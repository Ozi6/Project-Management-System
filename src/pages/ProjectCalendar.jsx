import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Plus,
    CheckCircle, Clock, AlertCircle,
    GanttChartSquare, Menu
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUser, useAuth } from "@clerk/clerk-react";

const ProjectCalendar = () => {
    const [activeTab, setActiveTab] = useState('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        const handleLanguageChange = () => {
            window.location.reload();
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    useEffect(() =>
    {
        if (!isLoaded) return;

        const fetchProjects = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(`http://localhost:8080/api/projects/user/${user.id}/related`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const transformedProjects = response.data.map(project =>
                {
                    const allTasks = [];
                    let taskIdCounter = 1;

                    if(project.categories && project.categories.length > 0)
                    {
                        project.categories.forEach(category =>
                        {
                            if(category.taskLists && category.taskLists.length > 0)
                            {
                                category.taskLists.forEach(taskList =>
                                {
                                    if(taskList.entries && taskList.entries.length > 0)
                                    {
                                        taskList.entries.forEach(entry =>
                                        {
                                            if(!entry.dueDate)
                                                return;

                                            const taskId = `${project.projectId}-${taskIdCounter++}`;

                                            const createdAt = new Date(entry.createdAt);
                                            let startDate = createdAt.toISOString().split('T')[0];

                                            console.log(createdAt);
                                            console.log(entry.dueDate);

                                            let endDate = new Date(entry.dueDate).toISOString().split('T')[0];;

                                            let status = entry.isChecked ? t("dashboard.complete") : t("gantt.in");
                                            let progress = entry.isChecked ? 100 : 30;

                                            const dueDate = new Date(entry.dueDate);

                                            if(!entry.isChecked)
                                            {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                dueDate.setHours(0, 0, 0, 0);

                                                if(dueDate < today)
                                                    status = t("gantt.risk");
                                                else
                                                {
                                                    const warningThresholdDays = entry.warningThreshold || 3;
                                                    const diffTime = dueDate - today;
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                    if(diffDays <= warningThresholdDays)
                                                        status = t("gantt.warning");
                                                }
                                            }

                                            allTasks.push({
                                                id: taskId,
                                                name: entry.entryName,
                                                startDate: startDate,
                                                endDate: endDate,
                                                progress: progress,
                                                status: status,
                                                dependencies: [],
                                                originalData: entry
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }

                    let projectStartDate = new Date();
                    let projectEndDate = new Date();

                    projectStartDate = new Date(project.createdAt);
                    projectEndDate = new Date(project.dueDate);

                    const totalTasks = allTasks.length;
                    const completedTasks = allTasks.filter(task => task.status === t("dashboard.complete")).length;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    let status = t("gantt.in");
                    if(progress === 100)
                        status = t("dashboard.complete");
                    else if(allTasks.some(task => task.status === t("gantt.risk")))
                        status = t("gantt.risk");
                    else if(allTasks.some(task => task.status === t("gantt.warning")))
                        status = t("gantt.warning");
                    

                    const projectColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
                    const colorIndex = project.projectId % projectColors.length;

                    return{
                        id: project.projectId,
                        name: project.projectName,
                        startDate: projectStartDate.toISOString().split('T')[0],
                        endDate: projectEndDate.toISOString().split('T')[0],
                        progress: progress,
                        status: status,
                        color: projectColors[colorIndex],
                        tasks: allTasks,
                        description: project.description,
                        originalData: project
                    };
                });

                setProjects(transformedProjects);
                setLoading(false);
            }catch(err){
                console.error('Error fetching projects:', err);
                setError(t("pro.errd"));
                setLoading(false);
            }
        };

        fetchProjects();
    }, [isLoaded, getToken, user, t]);

    useEffect(() =>
    {
        const handleResize = () =>
        {
            if (window.innerWidth >= 768)
                setIsMobileSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() =>
    {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () =>
    {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const parseDate = (dateString) => new Date(dateString);

    const getDateRange = () => {
        if (projects.length === 0) return { startDate: new Date(), endDate: new Date() };

        let earliest = new Date();
        let latest = new Date();

        projects.forEach(project => {
            const projectStart = parseDate(project.startDate);
            const projectEnd = parseDate(project.endDate);

            if (projectStart < earliest) earliest = projectStart;
            if (projectEnd > latest) latest = projectEnd;

            project.tasks.forEach(task => {
                const taskStart = parseDate(task.startDate);
                const taskEnd = parseDate(task.endDate);

                if (taskStart < earliest) earliest = taskStart;
                if (taskEnd > latest) latest = taskEnd;
            });
        });

        return { startDate: earliest, endDate: latest };
    };

    // Calculate the number of days between two dates
    const daysBetween = (start, end) => {
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Get column headers (dates) for Gantt chart
    const getColumnHeaders = () => {
        const { startDate, endDate } = getDateRange();
        const days = daysBetween(startDate, endDate);
        const headers = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            headers.push(date);
        }

        return headers;
    };

    // Format date for display
    const formatDate = (date, language = 'en') => {
        return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' });
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Get task position and width in the Gantt chart
    const getTaskBarStyles = (task, columnHeaders) => {
        const startDate = parseDate(task.startDate);
        const endDate = parseDate(task.endDate);

        // Find the index of the column that contains the start date
        const startIndex = columnHeaders.findIndex(date =>
            date.getDate() === startDate.getDate() &&
            date.getMonth() === startDate.getMonth() &&
            date.getFullYear() === startDate.getFullYear()
        );

        // Calculate width based on number of days
        const width = daysBetween(startDate, endDate);

        return {
            gridColumnStart: startIndex + 1, // +1 because CSS grid is 1-based
            gridColumnEnd: `span ${width}`,
        };
    };

    const getStatusColor = (status) =>
    {
        switch(status)
        {
            case t("dashboard.complete"):
                return 'bg-green-500';
            case t("gantt.in"):
                return 'bg-blue-500';
            case t("gantt.warning"):
                return 'bg-amber-500';
            case t("gantt.risk"):
                return 'bg-red-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getStatusIcon = (status) =>
    {
        switch(status)
        {
            case t("dashboard.complete"):
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case t("gantt.in"):
                return <Clock className="h-4 w-4 text-blue-500" />;
            case t("gantt.warning"):
                return <AlertCircle className="h-4 w-4 text-amber-500" />;
            case t("gantt.risk"):
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    // Handle new event creation
    const handleNewEvent = () => {
        // In a real app, this would open a form to create a new event/task
        alert("New task creation would open here");
    };

    const getProjectColor = (project) =>
    {
        return project.color || '#3b82f6';
    };

    if(loading)
    {
        return (
            <div className="flex flex-col h-screen bg-amber-50">
                <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-[var(--sidebar-gantt-color2)]">
                    <Header
                        title={<span className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">{t("gantt.tit")}</span>}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[var(--sidebar-gantt-color)] border-r-transparent mb-4"></div>
                        <p className="text-[var(--sidebar-gantt-color)]">{t("dashboard.loading")}</p>
                    </div>
                </div>
            </div>
        );
    }

    if(error)
    {
        return (
            <div className="flex flex-col h-screen bg-amber-50">
                <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-[var(--sidebar-gantt-color2)]">
                    <Header
                        title={<span className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">{t("gantt.tit")}</span>}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">{t("dashboard.error")}</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="flex flex-col h-screen bg-amber-50">
            {/* Header */}
            <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-[var(--sidebar-gantt-color2)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">{t("gantt.tit")}</span>}
                    action={{
                        onClick: handleNewEvent,
                        icon: <Plus className="mr-2 h-4 w-4" />,
                        label: "New Task"
                    }}
                />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile menu toggle button */}
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--sidebar-gantt-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--sidebar-gantt-color2)] transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                {/* Sidebar - hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-[var(--sidebar-gantt-color2)]">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Mobile sidebar - full screen overlay when open */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-[var(--bg-color)]">
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                )}

                {/* Main content */}
                <div className="flex-1 overflow-auto bg-[var(--sidebar-gantt-bg-color)] flex flex-col">
                    <div className="p-6 space-y-6 flex-grow">
                        {/* Control header - simplified without view toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--sidebar-gantt-color2)]"
                        >
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">
                                    {t("gantt.tit")}
                                </h2>
                                <div className="bg-[var(--sidebar-gantt-color2)] text-white text-xs px-2 py-1 rounded-full">
                                    {projects.length} {t("gantt.projects")}
                                </div>
                            </div>
                        </motion.div>

                        {/* Project filter/selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--sidebar-gantt-color2)]"
                        >
                            <h3 className="text-sm font-semibold text-[var(--features-title-color)] mb-3">{t("gantt.filter")}</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedProject === null
                                            ? 'bg-[var(--sidebar-gantt-color2)] text-[var(--sidebar-gantt-color)] font-medium'
                                            : 'bg-gray-100 text-[var(--gray-card1)] hover:bg-gray-200'
                                        }`}
                                >
                                    {t("gantt.all")}
                                </button>
                                {projects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${project.id === selectedProject
                                                ? 'bg-[var(--sidebar-gantt-color2)] text-[var(--sidebar-gantt-color)] font-medium'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        style={project.id === selectedProject ? {
                                            backgroundColor: `${getProjectColor(project)}25`, // 25% opacity
                                            color: getProjectColor(project)
                                        } : {}}
                                    >
                                        {project.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Gantt Chart - with mobile-friendly note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-[var(--bg-color)] rounded-xl shadow-sm border border-[var(--sidebar-gantt-color2)] overflow-hidden"
                        >
                            {/* Mobile instruction for horizontal scrolling */}
                            <div className="md:hidden p-3 bg-[var(--sidebar-gantt-color2)] border-b border-[var(--sidebar-gantt-color2)] text-amber-800 text-xs flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
                                    <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.696L11.5 8.753V12a.5.5 0 0 0 1 0V4z" />
                                </svg>
                                Scroll horizontally to view the full timeline
                            </div>

                            <div className="overflow-x-auto">
                                <div className="min-w-max">
                                    {/* Gantt header - dates */}
                                    <div className="flex">
                                        <div className="w-48 shrink-0 p-3 border-r border-[var(--gray-card2)] bg-[var(--gray-card1)] font-semibold text-[var(--features-title-color)]">
                                            {t("gantt.task")}
                                        </div>
                                        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))` }}>
                                            {getColumnHeaders().map((date, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-2 text-center text-[var(--features-title-color)] text-xs font-medium border-r border-[var(--gray-card2)] ${isToday(date) ? 'bg-[var(--sidebar-gantt-color2)] text-[var(--sidebar-gantt-color)]' :
                                                        date.getDay() === 0 || date.getDay() === 6 ? 'bg-[var(--gray-card1)]' : ''
                                                        }`}
                                                >
                                                    <div className={`${isToday(date) ? 'font-bold' : ''}`}>{formatDate(date, language)}</div>
                                                    <div className="text-[10px] text-[var(--features-text-color)]">
                                                        {date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gantt body - projects and tasks */}
                                    <div>
                                        {projects
                                            .filter(project => selectedProject === null || project.id === selectedProject)
                                            .map(project => (
                                                <div key={project.id}>
                                                    {/* Project row */}
                                                    <div className="flex border-t border-[var(--gray-card2)] bg-[var(--gray-color)]">
                                                        <div className="w-48 shrink-0 p-3 border-r border-[var(--gray-card2)]">
                                                            <div className="flex items-center">
                                                                <div
                                                                    className="w-3 h-3 rounded-sm mr-2"
                                                                    style={{ backgroundColor: getProjectColor(project) }}
                                                                ></div>
                                                                <h3 className="font-semibold text-[var(--features-title-color)] truncate">{project.name}</h3>
                                                            </div>
                                                            <div className="text-xs text-[var(--text-color3)] mt-1">
                                                                {parseDate(project.startDate).toLocaleDateString()} - {parseDate(project.endDate).toLocaleDateString()}
                                                            </div>
                                                        </div>

                                                        {/* Project timeline bar */}
                                                        <div className="flex-1 relative flex items-center h-16 grid" style={{
                                                            gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))`
                                                        }}>
                                                            <div
                                                                className="absolute h-6 rounded-md flex items-center px-2 text-white text-xs font-medium"
                                                                style={{
                                                                    ...getTaskBarStyles(
                                                                        { startDate: project.startDate, endDate: project.endDate },
                                                                        getColumnHeaders()
                                                                    ),
                                                                    backgroundColor: getProjectColor(project),
                                                                    opacity: 0.8
                                                                }}
                                                            >
                                                                {project.name} ({project.progress}%)
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Task rows */}
                                                    {project.tasks.map(task => (
                                                        <div key={task.id} className="flex border-t text-[var(--features-title-color)] border-gray-100 hover:bg-[var(--gray-card1)]">
                                                            <div className="w-48 shrink-0 pl-6 pr-3 py-2 border-r border-[var(--gray-card2)] flex items-center">
                                                                <div
                                                                    className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(task.status)}`}
                                                                ></div>
                                                                <div className="truncate">
                                                                    <div className="text-sm">{task.name}</div>
                                                                    <div className="text-xs text-[var(--features-text-color)] flex items-center mt-0.5">
                                                                        {getStatusIcon(task.status)}
                                                                        <span className="ml-1">{task.status} • {task.progress}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Task timeline bar */}
                                                            <div className="flex-1 relative flex items-center h-12 grid" style={{
                                                                gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))`
                                                            }}>
                                                                {/* Full task bar background - with improved visibility for Not Started tasks */}
                                                                <div
                                                                    className="absolute h-5 rounded flex items-center"
                                                                    style={{
                                                                        ...getTaskBarStyles(task, getColumnHeaders()),
                                                                        backgroundColor: task.status === t("dashboard.complete") ? '#10b981' : task.status === t("gantt.risk") ? '#ef4444' : task.status === t("gantt.warning") ? '#f59e0b' : '#3b82f6',
                                                                        opacity: 0.4
                                                                    }}
                                                                >
                                                                </div>

                                                                {/* Progress indicator (solid color) - only for tasks with progress > 0 */}
                                                                {task.progress > 0 && (
                                                                    <div
                                                                        className="absolute h-5 rounded-l"
                                                                        style={{
                                                                            ...getTaskBarStyles(task, getColumnHeaders()),
                                                                            width: `${task.progress}%`,
                                                                            backgroundColor: task.status === t("dashboard.complete") ? '#10b981' : task.status === t("gantt.risk") ? '#ef4444' : task.status === t("gantt.warning") ? '#f59e0b' : '#3b82f6',
                                                                            zIndex: 5
                                                                        }}
                                                                    >
                                                                    </div>
                                                                )}

                                                                {/* Task name overlay - positioned on top regardless of progress */}
                                                                <div
                                                                    className="absolute h-5 rounded flex items-center px-2 z-10"
                                                                    style={{
                                                                        ...getTaskBarStyles(task, getColumnHeaders()),
                                                                    }}
                                                                >
                                                                    <div className="truncate text-xs font-medium text-white">
                                                                        {task.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Legend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--sidebar-gantt-color2)]"
                        >
                            <h3 className="text-sm font-semibold text-[var(--features-title-color)]/60 mb-3">{t("gantt.leg")}</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-sm text-[var(--features-title-color)]/60">{t("gantt.comp")}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-sm text-[var(--features-title-color)]/60">{t("gantt.in")}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                                    <span className="text-sm text-[var(--features-title-color)]/60">{t("gantt.warning")}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <span className="text-sm text-[var(--features-title-color)]/60">{t("gantt.risk")}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="bg-[var(--bg-color)] border-t border-[var(--sidebar-gantt-color)] py-3 px-6">
                        <div className="flex flex-row justify-between items-center text-xs text-[var(--sidebar-gantt-color)]">
                            <div>
                                <span className='text-[var(--sidebar-gantt-color)]'>© 2025 PlanWise</span>
                                <span className="hidden sm:inline text-[var(--sidebar-gantt-color)]"> • {t("dashboard.rights")}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <GanttChartSquare className="h-3 w-3 mr-1 text-[var(--sidebar-gantt-color)]" />
                                    {t("gantt.tit")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default ProjectCalendar;