import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter, SortAsc, User, Heart, Menu, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { KanbanSquare, Layout, Settings, Users as UsersIcon, Activity,MessageCircle,BookOpen } from "lucide-react";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser, useAuth } from "@clerk/clerk-react";


const CalendarPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState("calendar");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [tasksByDate, setTasksByDate] = useState({});
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState([]);
    const location = useLocation();
    const { state } = location;
    const isOwner = state?.isOwner || false;
    const [language, setLanguage] = useState(i18n.language);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    useEffect(() =>
    {
        if (!isLoaded || !user)
            return;

        const fetchProjectDetails = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(`http://localhost:8080/api/projects/${id}/details`,
                    {
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                const projectData = response.data;
                const formattedColumns = projectData.categories.map(category =>
                {
                    const formattedCategory =
                    {
                        ...category,
                        title: category.categoryName || 'Unnamed Category',
                        tagColor: category.color || 'gray',
                        taskLists: category.taskLists.map(taskList => ({
                            ...taskList,
                            title: taskList.taskListName || 'Unnamed Task List',
                            tagColor: taskList.color || 'gray',
                            entries: taskList.entries.map(entry => ({
                                ...entry,
                                text: entry.entryName || 'Unnamed Entry',
                                checked: entry.isChecked || false,
                                dueDate: entry.dueDate ? new Date(entry.dueDate) : null,
                                warningThreshold: entry.warningThreshold || null,
                                id: entry.entryId || uuidv4(),
                            })),
                            id: taskList.taskListId || uuidv4()
                        })),
                        id: category.categoryId || uuidv4()
                    };
                    return formattedCategory;
                });

                setProjectData([formattedColumns]);
                setLoading(false);
            }catch(err){
                console.error('Error fetching project details:', err);
                setError('Failed to load project details');
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [isLoaded, id, user, getToken]);

    useEffect(() =>
    {
        if (!projectData || !projectData.length) return;

        const taskMap = {};
        const today = new Date();

        projectData.forEach(column =>
        {
            column.forEach(category =>
            {
                category.taskLists.forEach(taskList =>
                {
                    taskList.entries.forEach(entry =>
                    {
                        if(entry.dueDate)
                        {
                            const date = new Date(entry.dueDate);
                            const dateKey = date.toDateString();

                            const daysUntilDue = Math.floor((date - today) / (1000 * 60 * 60 * 24));

                            let status = 'upcoming';
                            if(entry.checked)
                                status = 'completed';
                            else if(daysUntilDue < 0)
                                status = 'overdue';
                            else if(entry.warningThreshold && daysUntilDue <= entry.warningThreshold)
                                status = 'warning';

                            if(!taskMap[dateKey])
                                taskMap[dateKey] = [];

                            taskMap[dateKey].push({
                                id: entry.id,
                                text: entry.text,
                                date: date,
                                category: category.title,
                                taskList: taskList.title,
                                color: category.tagColor,
                                status: status,
                                checked: entry.checked,
                                daysUntilDue: daysUntilDue
                            });
                        }
                    });
                });
            });
        });

        setTasksByDate(taskMap);
    }, [projectData]);

    useEffect(() =>
    {
        setLanguage(i18n.language);
    }, [i18n.language]);

    const customNavItems =
        [
            {
                id: 'dashboard',
                icon: Layout,
                label: t("sidebar.dash"),
                path: '/dashboard',
                iconColor: 'text-blue-600',
                defaultColor: true
            },
            {
                id: 'projects',
                icon: KanbanSquare,
                label: t("sidebar.this"),
                path: `/project/${id}`,
                state: { isOwner },
                color: 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]',
                iconColor: 'text-[var(--sidebar-projects-color)]'
            },
            {
                id: 'activity',
                icon: Activity,
                label: t("sidebar.act"),
                path: `/project/${id}/activity`,
                state: { isOwner },
                color: 'bg-[var(--sidebar-gantt-bg-color)] text-[var(--sidebar-gantt-color)]',
                iconColor: 'text-amber-600'
            },
            {
                id: 'notes',
                icon: BookOpen,
                label: "Notes",
                path: `/project/${id}/notes`,
                state: { isOwner },
                color: 'bg-indigo-100 text-indigo-600',
                iconColor: 'text-indigo-600'
            },
            {
                id: 'teams',
                icon: UsersIcon,
                label: t("sidebar.team"),
                path: `/project/${id}/teams`,
                state: { isOwner },
                color: 'bg-green-100 text-green-600',
                iconColor: 'text-green-600'
            },
            {
                id: 'chat',
                icon: MessageCircle,
                label: t("sidebar.chat"),
                path: `/project/${id}/temp-chat`,
            },
            {
                id: 'settings',
                icon: Settings,
                label: t("sidebar.set"),
                path: `/project/${id}/settings`,
                state: { isOwner },
                color: 'bg-gray-100 text-gray-600',
                iconColor: 'text-gray-600'
            }
        ];

    useEffect(() =>
    {
        const handleResize = () =>
        {
            if (window.innerWidth >= 768)
                setIsMobileSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

    useEffect(() =>
    {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () =>
    {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    useEffect(() =>
    {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();

        const days = [];

        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for(let i = startingDayOfWeek - 1; i >= 0; i--)
        {
            days.push({
                date: new Date(year, month - 1, prevMonthDays - i),
                currentMonth: false
            });
        }

        for(let day = 1; day <= daysInMonth; day++)
        {
            days.push({
                date: new Date(year, month, day),
                currentMonth: true
            });
        }

        const remainingDays = 42 - days.length;
        for(let day = 1; day <= remainingDays; day++)
        {
            days.push({
                date: new Date(year, month + 1, day),
                currentMonth: false
            });
        }

        setCalendarDays(days);
    }, [currentMonth]);

    const getTasksForDay = (day) =>
    {
        const dateKey = day.toDateString();
        return tasksByDate[dateKey] || [];
    };

    const getPriorityTasksForDay = (day) =>
    {
        const tasks = getTasksForDay(day);
        return tasks.filter(task => task.status === 'warning' || task.status === 'overdue');
    };

    const prevMonth = () =>
    {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () =>
    {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const goToToday = () =>
    {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedDate(today);
    };

    const formatMonthYear = (date, language) =>
    {
        return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });
    };

    const isToday = (date) =>
    {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) =>
    {
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const getStatusColor = (status) =>
    {
        switch(status)
        {
            case 'completed':
                return '#10B981';
            case 'overdue':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            default:
                return '#60A5FA';
        }
    };

    const getStatusIcon = (status) =>
    {
        switch(status)
        {
            case 'completed':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'overdue':
                return <AlertTriangle size={16} className="text-red-500" />;
            case 'warning':
                return <Clock size={16} className="text-amber-500" />;
            default:
                return <Clock size={16} className="text-blue-500" />;
        }
    };

    const formatDueMessage = (daysUntilDue, status) =>
    {
        if(status === 'completed')
            return t("cal.completed");
        else if(daysUntilDue < 0)
            return `${Math.abs(daysUntilDue)} ${t("cal.days_overdue")}`;
        else if(daysUntilDue === 0)
            return t("cal.due_today");
        else if(daysUntilDue === 1)
            return t("cal.due_tomorrow");
        else
            return `${t("cal.due_in")} ${daysUntilDue} ${t("cal.days")}`;
    };

    const getDayBackgroundColor = (day) =>
    {
        const tasks = getTasksForDay(day);
        if(!tasks.length) return '';

        if(tasks.some(task => task.status === 'overdue'))
            return 'bg-red-50';
        else if(tasks.some(task => task.status === 'warning'))
            return 'bg-amber-50';
        return '';
    };

    const getTaskCountBadgeColor = (tasks) => {
        if (tasks.some(task => task.status === 'overdue'))
            return 'bg-red-500';
        else if (tasks.some(task => task.status === 'warning'))
            return 'bg-amber-500';
        else if (tasks.some(task => task.status === 'completed'))
            return 'bg-green-500';
        return 'bg-blue-500';
    };

    if(loading)
    {
        return(
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-500">{t("prode.load")}</div>
            </div>
        );
    }

    if(error)
    {
        return(
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="w-full bg-white shadow-sm z-10 border-b border-[var(--sidebar-gantt-color2)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">{t("cal.tit")}</span>}
                />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--features-icon-color)] text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-gray-100">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        customNavItems={customNavItems}
                    />
                </div>

                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            customNavItems={customNavItems}
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto bg-[var(--sidebar-gantt-bg-color)] flex flex-col items-center h-full mt-0">
                    <div className="p-6 w-full max-w-4xl">
                        <div className="bg-[var(--bg-color)] rounded-lg shadow p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-[var(--features-text-color)]" />
                                    <h2 className="text-xl font-semibold text-[var(--features-icon-color)]">{t("cal.cal")}</h2>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={goToToday}
                                        className="px-3 py-1 text-sm bg-[var(--loginpage-bg)] text-[var(--features-icon-color)] rounded hover:bg-[var(--loginpage-bg2)] transition-colors"
                                    >
                                        {t("cal.today")}
                                    </button>
                                    <button
                                        onClick={prevMonth}
                                        className="p-1 rounded-full hover:bg-[var(--gray-card3)]"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-[var(--features-title-color)]" />
                                    </button>
                                    <span className="text-lg text-[var(--features-title-color)] font-medium w-40 text-center">
                                        {formatMonthYear(currentMonth, language)}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="p-1 rounded-full hover:bg-[var(--gray-card3)]"
                                    >
                                        <ChevronRight className="h-5 w-5 text-[var(--features-title-color)]" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end items-center mb-3 gap-3 flex-wrap">
                                <div className="flex items-center gap-1 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>{t("cal.overdue")}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span>{t("cal.due_soon")}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>{t("cal.upcoming")}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>{t("cal.completed")}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 border-1 border-[var(--sidebar-gantt-color2)] gap-px bg-[var(--sidebar-gantt-color2)]">
                                {[t("gantt.sun"), t("gantt.mon"), t("gantt.tue"), t("gantt.wed"), t("gantt.thu"), t("gantt.fri"), t("gantt.sat")].map(day => (
                                    <div key={day} className="bg-[var(--gray-card3)] text-center py-2 font-medium text-[var(--features-title-color)] text-xs sm:text-sm">
                                        {window.innerWidth < 640 ? day.charAt(0) : day}
                                    </div>
                                ))}

                                {calendarDays.map((day, index) => {
                                    const tasks = getTasksForDay(day.date);
                                    const priorityTasks = getPriorityTasksForDay(day.date);
                                    const hasTask = tasks.length > 0;
                                    const hasHighPriority = priorityTasks.length > 0;
                                    const dayBgColor = getDayBackgroundColor(day.date);

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedDate(day.date)}
                                            className={`min-h-16 sm:min-h-24 p-1 ${!day.currentMonth ? 'bg-[var(--gray-card2)] text-[var(--text-color3)]' : 'bg-[var(--bg-color)] text-[var(--text-color3)]'
                                                } ${dayBgColor} ${isToday(day.date) ? 'border-t-2 border-[var(--features-icon-color)]' : ''
                                                } ${isSelected(day.date) ? 'ring-2 ring-[var(--features-icon-color)]' : ''
                                                } hover:bg-[var(--gray-card3)] cursor-pointer transition-colors`}
                                        >
                                            <div className="flex justify-between">
                                                <span className={`text-xs sm:text-sm ${isToday(day.date) ? 'font-bold text-[var(--features-icon-color)]' : ''}`}>
                                                    {day.date.getDate()}
                                                </span>
                                                {hasTask && (
                                                    <span className={`h-5 w-5 rounded-full ${getTaskCountBadgeColor(tasks)} text-white text-xs flex items-center justify-center`}>
                                                        {tasks.length}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-1 max-h-10 sm:max-h-20 overflow-y-auto">
                                                {tasks.slice(0, window.innerWidth < 640 ? 1 : 3).map((task, i) => {
                                                    const statusColor = getStatusColor(task.status);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="text-xs mb-1 p-1 rounded truncate flex items-center gap-1"
                                                            style={{ backgroundColor: `${statusColor}10`, borderLeft: `3px solid ${statusColor}` }}
                                                        >
                                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor }}></div>
                                                            <span className="truncate">{task.text}</span>
                                                        </div>
                                                    );
                                                })}
                                                {tasks.length > (window.innerWidth < 640 ? 1 : 3) && (
                                                    <div className="text-xs text-gray-500 pl-1">
                                                        +{tasks.length - (window.innerWidth < 640 ? 1 : 3)} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-medium text-[var(--features-text-color)] flex items-center">
                                    <span>{t("cal.tasks")} {selectedDate.toLocaleDateString()}</span>
                                    {getTasksForDay(selectedDate).length > 0 && (
                                        <span className="ml-2 bg-[var(--features-icon-color)] text-white rounded-full text-xs px-2 py-0.5">
                                            {getTasksForDay(selectedDate).length}
                                        </span>
                                    )}
                                </h3>
                                <div className="mt-2 space-y-2 max-h-64 text-[var(--features-title-color)] overflow-y-auto">
                                    {getTasksForDay(selectedDate).length > 0 ? (
                                        getTasksForDay(selectedDate).map((task, index) => {
                                            const statusColor = getStatusColor(task.status);
                                            return (
                                                <div
                                                    key={index}
                                                    className="p-3 rounded-md shadow-sm border-l-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                                    style={{ borderLeftColor: statusColor }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(task.status)}
                                                        <div>
                                                            <div className="font-medium flex items-center">
                                                                <span>{task.text}</span>
                                                                {task.checked && (
                                                                    <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                                                        {t("cal.completed")}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-[var(--features-text-color)] flex items-center gap-1">
                                                                <span>{task.category} • {task.taskList}</span>
                                                                <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                                                                <span style={{ color: statusColor }}>
                                                                    {formatDueMessage(task.daysUntilDue, task.status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-[var(--text-color3)] text-center py-4 bg-gray-50 rounded-md">
                                            {t("cal.tasks.no")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6 mt-auto">
                        <div className="flex flex-row justify-between items-center text-xs text-[var(--featureas-icon-color)]">
                            <div>
                                <span className="text-[var(--features-title-color)]">© 2025 PlanWise</span>
                                <span className="hidden sm:inline text-[var(--features-title-color)]"> • {t("dashboard.rights")}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/terms" className="text-[var(--features-title-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.terms")}</Link>
                                <Link to="/privacy" className="text-[var(--features-title-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.pri")}</Link>
                                <span className="flex items-center text-[var(--features-title-color)]">
                                    {t("dashboard.made")} <Heart className="h-3 w-3 text-red-500 mx-1 " /> {t("dashboard.by")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;