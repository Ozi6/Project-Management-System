import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
    BarChart3, Activity, PieChart, ChevronRight,
    Calendar, CheckCircle, Clock, AlertCircle,
    ArrowUp, ArrowDown, Eye, FileText, Plus, Heart,
    Menu
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateActivityMessage } from '../utils/activityUtils';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [recentFiles, setRecentFiles] = useState([]);
    const location = useLocation();
    const [accessDeniedMessage, setAccessDeniedMessage] = useState(null);

    useEffect(() => {
        if (location.state?.accessDenied) {
            setAccessDeniedMessage(location.state.message || "Access denied");
            // Clear the state after displaying the message
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const syncUserData = async () =>
        {
            if(!isLoaded || !user)
                return;

            try{
                const token = await getToken();
                const userDTO =
                {
                    userId: user.id,
                    username: user.username || user.fullName,
                    email: user.emailAddresses[0].emailAddress,
                    profileImageUrl: user.imageUrl || null
                };

                await axios.post('http://localhost:8080/api/users/sync', userDTO,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }catch(error){
                console.error('Error syncing user data:', error);
            }
        };

        syncUserData();
    }, [isLoaded, user, getToken]);

    const fetchRecentFiles = async () =>
    {
        try{
            const token = await getToken();
            const projectsResponse = await axios.get(`http://localhost:8080/api/projects/user/${user.id}/related`, {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            const allFiles = [];

            for(const project of projectsResponse.data)
            {
                const detailsResponse = await axios.get(`http://localhost:8080/api/projects/${project.projectId}/details`,
                {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                });

                const projectData = detailsResponse.data;
                const projectName = projectData.projectName;

                if(projectData.categories)
                {
                    const categories = Array.isArray(projectData.categories)
                        ? projectData.categories
                        : [projectData.categories];

                    categories.forEach(category =>
                    {
                        if(category.taskLists)
                        {
                            const taskLists = Array.isArray(category.taskLists)
                                ? category.taskLists
                                : [category.taskLists];

                            taskLists.forEach(taskList =>
                            {
                                if(taskList.entries)
                                {
                                    const entries = Array.isArray(taskList.entries)
                                        ? taskList.entries
                                        : [taskList.entries];

                                    entries.forEach(entry =>
                                    {
                                        if(entry.file)
                                        {
                                            allFiles.push(
                                            {
                                                ...entry.file,
                                                projectName,
                                                uploadedAt: entry.file.uploadedAt || new Date().toISOString()
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }

            const sortedFiles = allFiles.sort((a, b) =>
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            ).slice(0, 3);

            setRecentFiles(sortedFiles);
        }catch(error){
            console.error('Error fetching recent files:', error);
        }
    };

    useEffect(() => {
        if (user && isLoaded)
            fetchRecentFiles();
    }, [user, isLoaded]);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        inProgress: 0,
        completed: 0,
        upcomingDeadlines: 0,
        teamMembers: 0,
        completionRate: 0
    });
    const [statsChanges, setStatsChanges] = useState({
      totalProjects: { value: 0, direction: 'up' },
      inProgress: { value: 0, direction: 'up' },
      completed: { value: 0, direction: 'up' }
    });
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);

    const fetchRecentActivities = async () => {
        setIsLoadingActivities(true);
        try {
            const token = await getToken();
            
            // Get all user projects with their names
            const projectsResponse = await axios.get(
                `http://localhost:8080/api/projects/user/${user.id}/related`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
            
            // Create a map of project IDs to project names
            const projectMap = {};
            projectsResponse.data.forEach(project => {
                projectMap[project.projectId] = project.projectName;
            });
            
            // Get activities from all projects and combine them
            const allActivities = [];
            for (const project of projectsResponse.data) {
                try {
                    const activitiesResponse = await axios.get(
                        `http://localhost:8080/api/projects/${project.projectId}/activities`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                            withCredentials: true
                        }
                    );
                    
                    // Add project name to each activity
                    const activitiesWithProject = activitiesResponse.data.map(activity => ({
                        ...activity,
                        project: {
                            projectId: activity.projectId,
                            projectName: projectMap[activity.projectId] || 'Unknown Project'
                        }
                    }));
                    
                    allActivities.push(...activitiesWithProject);
                } catch (error) {
                    console.error(`Error fetching activities for project ${project.projectId}:`, error);
                }
            }
            
            // Sort by activity time (newest first) and limit to 5
            const sortedActivities = allActivities
                .sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime))
                .slice(0, 5);
            
            setRecentActivities(sortedActivities);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            setRecentActivities([]); // Set empty array on error
        } finally {
            setIsLoadingActivities(false);
        }
    };

    useEffect(() => {
        if (user && isLoaded) {
            fetchRecentActivities();
        }
    }, [user, isLoaded]);

    const formatActivityTime = (dateTime) => {
        const now = new Date();
        const activityDate = new Date(dateTime);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);

        if (diffInSeconds < 60)
            return t('activity.time.just_now');
        if (diffInSeconds < 3600)
            return t('activity.time.minutes_ago', { minutes: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400)
            return t('activity.time.hours_ago', { hours: Math.floor(diffInSeconds / 3600) });
        if (diffInSeconds < 604800)
            return t('activity.time.days_ago', { days: Math.floor(diffInSeconds / 86400) });

        return activityDate.toLocaleDateString();
    };

    // Sample data that would normally come from an API
    useEffect(() => {
      const fetchProjects = async () => {
        if (!isLoaded || !user) return;
        
        //setIsLoadingProjects(true);
        try {
          const token = await getToken();
          
          // Fetch user's projects
          const projectsResponse = await axios.get(
            `http://localhost:8080/api/projects/user/${user.id}/related`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          
          // Get projects data
          const projectsData = projectsResponse.data;
          
          // For each project, fetch its progress
          const projectsWithProgress = await Promise.all(
            projectsData.map(async (project) => {
              try {
                const progressResponse = await axios.get(
                  `http://localhost:8080/api/projects/${project.projectId}/progress`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                  }
                );
                
                // Format the project data to match our UI needs
                return {
                  id: project.projectId,
                  name: project.projectName,
                  progress: progressResponse.data || 0,
                  status: progressResponse.data === 100 ? t("dashboard.complete") : t("dashboard.progress"),
                  dueDate: project.dueDate || new Date().toISOString().split('T')[0],
                  owner: project.ownerName || "You",
                  description: project.description
                };
              } catch (error) {
                console.error(`Error fetching progress for project ${project.projectId}:`, error);
                // Return project with default progress if progress fetch fails
                return {
                  id: project.projectId,
                  name: project.projectName,
                  progress: 0,
                  status: t("dashboard.progress"),
                  dueDate: project.dueDate || new Date().toISOString().split('T')[0],
                  owner: project.ownerName || "You",
                  description: project.description
                };
              }
            })
          );
          
          setProjects(projectsWithProgress);
          // Fetch data for 3 boxes
          try {
            const statsResponse = await axios.get(
              `http://localhost:8080/api/projects/user/${user.id}/dashboard-stats`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            
            const dashboardStats = statsResponse.data;
            
            // Set stats changes based on real data
            setStatsChanges({
              totalProjects: { 
                value: dashboardStats.projectsGrowthPercent, 
                direction: dashboardStats.projectsGrowthPercent >= 0 ? 'up' : 'down' 
              },
              inProgress: { 
                value: dashboardStats.inProgressGrowthPercent, 
                direction: dashboardStats.inProgressGrowthPercent >= 0 ? 'up' : 'down' 
              },
              completed: { 
                value: dashboardStats.completionPercent, 
                direction: dashboardStats.completionGrowthPercent >= 0 ? 'up' : 'down' 
              }
            });
            
          } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            // Fallback to sample data if API call fails
            setStatsChanges({
              totalProjects: { value: 12, direction: 'up' },
              inProgress: { value: 5, direction: 'down' },
              completed: { value: 8, direction: 'up' }
            });
          }
  
          
          // Calculate stats based on real data
          const inProgressCount = projectsWithProgress.filter(p => p.status === t("dashboard.progress")).length;
          const completedCount = projectsWithProgress.filter(p => p.status === t("dashboard.complete")).length;
          const totalProjects = projectsWithProgress.length;
          
          setStats({
            totalProjects: totalProjects,
            inProgress: inProgressCount,
            completed: completedCount,
            upcomingDeadlines: projectsWithProgress.filter(p => {
              const dueDate = new Date(p.dueDate);
              const today = new Date();
              const diffTime = dueDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays > 0 && diffDays <= 7; // Due within a week
            }).length,
            teamMembers: new Set(projectsWithProgress.map(p => p.owner)).size,
            completionRate: totalProjects > 0 ? Math.round((completedCount / totalProjects) * 100) : 0,
          });
        } catch (error) {
          console.error("Error fetching projects:", error);
          // Fallback to sample data if API call fails
          useSampleData();
        } finally {
          //setIsLoadingProjects(false);
        }
      };
          // Fallback function to use sample data if API fails
      const useSampleData = () => {
        const sampleProjects = [
          {
            id: 1,
            name: "Website Redesign",
            progress: 75,
            status: t("dashboard.progress"),
            dueDate: "2025-04-15",
            owner: "Alice",
          },
          // ... other sample projects ...
        ];
        
        setProjects(sampleProjects);
        
        // Calculate stats from sample data
        const inProgressCount = sampleProjects.filter(p => p.status === t("dashboard.progress")).length;
        const completedCount = sampleProjects.filter(p => p.status === t("dashboard.complete")).length;
        const totalTasks = sampleProjects.length;

        const getStatusColor = (status) => {
            switch (status) {
                case t("dashboard.risk"): return 'text-red-500';
                case t("dashboard.upcoming"): return 'text-[var(--features-icon-color)]';
                default: return 'text-[var(--features-icon-color)]';
            }
        };
        
        const getStatusIcon = (status) => {
            switch (status) {
                case t("dashboard.risk"): return <AlertCircle className="h-4 w-4 text-red-500" />;
                case t("dashboard.upcoming"): return <Clock className="h-4 w-4 text-[var(--features-icon-color)]" />;
                default: return <Clock className="h-4 w-4 text-[var(--features-icon-color)]" />;
            }
        };
        
        setStats({
          totalProjects: totalTasks,
          inProgress: inProgressCount,
          completed: completedCount,
          upcomingDeadlines: 3,
          teamMembers: new Set(sampleProjects.map(p => p.owner)).size,
          completionRate: Math.round((completedCount / totalTasks) * 100),
        });
      };
      
      fetchProjects();
    }, [isLoaded, user, getToken, t]);

    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [isLoadingDeadlines, setIsLoadingDeadlines] = useState(false);
  
    const fetchUpcomingDeadlines = async () => {
        try {
            const token = await getToken();
            const projectsResponse = await axios.get(
                `http://localhost:8080/api/projects/user/${user.id}/related`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
    
            const allTasks = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date
    
            for (const project of projectsResponse.data) {
                const detailsResponse = await axios.get(
                    `http://localhost:8080/api/projects/${project.projectId}/details`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        withCredentials: true
                    }
                );
    
                const projectData = detailsResponse.data;
                
                if (projectData.categories) {
                    const categories = Array.isArray(projectData.categories)
                        ? projectData.categories
                        : [projectData.categories];
    
                    categories.forEach(category => {
                        if (category.taskLists) {
                            const taskLists = Array.isArray(category.taskLists)
                                ? category.taskLists
                                : [category.taskLists];
    
                            taskLists.forEach(taskList => {
                                if (taskList.entries) {
                                    const entries = Array.isArray(taskList.entries)
                                        ? taskList.entries
                                        : [taskList.entries];
    
                                    entries.forEach(entry => {
                                        if (entry.dueDate && !entry.isChecked) {
                                            const dueDate = new Date(entry.dueDate);
                                            dueDate.setHours(0, 0, 0, 0); // Normalize due date
                                            const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
                                            if (daysUntilDue <= 14) { // Show tasks due in next 2 weeks
                                                let status = 'upcoming';
                                                if (daysUntilDue < 0) {
                                                    status = 'overdue';
                                                } else if (daysUntilDue <= 3 || 
                                                         (entry.warningThreshold && daysUntilDue <= entry.warningThreshold)) {
                                                    status = 'warning'; // Mark as warning if <= 3 days left
                                                }
    
                                                allTasks.push({
                                                    id: entry.entryId || uuidv4(),
                                                    task: entry.entryName || 'Unnamed Entry',
                                                    project: projectData.projectName,
                                                    dueDate: entry.dueDate,
                                                    status: status,
                                                    daysUntilDue: daysUntilDue,
                                                    category: category.categoryName || 'Unnamed Category',
                                                    taskList: taskList.taskListName || 'Unnamed Task List'
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
    
            // Sort by due date (earliest first)
            return allTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } catch (error) {
            console.error('Error fetching upcoming deadlines:', error);
            return [];
        }
    };

    

    useEffect(() => {
        if (user && isLoaded) {
            setIsLoadingDeadlines(true);
            fetchUpcomingDeadlines().then(tasks => {
                setUpcomingDeadlines(tasks);
                setIsLoadingDeadlines(false);
            });
        }
    }, [user, isLoaded]);
  
    
    // In the Dashboard component
    useEffect(() => {
        setActiveTab('dashboard');
    }, [setActiveTab]);

    // Add this effect to update the tab when location changes
    useEffect(() => {
        if (location.pathname === '/dashboard') {
            setActiveTab('dashboard');
        }
    }, [location, setActiveTab]);

    // Simulated activity data


    // Upcoming deadlines


    // Determine task status color
    const getStatusColor = (status) => {
        switch (status) {
            case t("dashboard.risk"): return 'text-red-500';
            case t("dashboard.track"): return 'text-green-500';
            default: return 'text-[var(--features-icon-color)]';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case t("dashboard.risk"): return <AlertCircle className="h-4 w-4 text-red-500" />;
            case t("dashboard.track"): return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return <Clock className="h-4 w-4 text-[var(--features-icon-color)]" />;
        }
    };

    // Handle new project creation
    const handleNewProject = () => {
        navigate('/projects/new');
    };

    // Add a function to navigate to calendar
    const navigateToCalendar = () => {
        navigate('/calendar');
    };

    // Check screen size and close mobile sidebar on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile sidebar when changing routes
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const getActivityIcon = (actionType) => {
        switch (actionType) {
            case 'CREATE':
                return <Plus className="h-4 w-4 text-white" />;
            case 'UPDATE':
                return <FileText className="h-4 w-4 text-white" />;
            case 'DELETE':
                return <AlertCircle className="h-4 w-4 text-white" />;
            case 'ADD':
                return <Heart className="h-4 w-4 text-white" />;
            case 'REMOVE':
                return <ArrowDown className="h-4 w-4 text-white" />;
            default:
                return <Activity className="h-4 w-4 text-white" />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--loginpage-bg)]">
            {/* Header with blue accent */}
            <div className="w-full bg-[var(--bg-color4)] shadow-sm z-10 border-b-2 border-[var(--loginpage-bg)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--features-icon-color)]">{t("sidebar.dash")}</span>}
                    action={{
                        onClick: handleNewProject,
                        icon: <Plus className="mr-2 h-4 w-4" />,
                        label: "New Project"
                    }}
                />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile menu toggle button */}
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--features-icon-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--hover-color)] transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                {/* Sidebar - hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block bg-[var(--bg-color4)] shadow-md z-5 border-r border-[var(--loginpage-bg)]">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Mobile sidebar - full screen overlay when open */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-[var(--bg-color4)]">
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                )}

                {/* Main content with blue background */}
                <div className="flex-1 overflow-auto bg-[var(--dashboard-bg)] flex flex-col">
                    <div className="p-6 space-y-6 flex-grow">
                        {/* Welcome banner with blue gradient */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-r from-[var(--features-icon-color)] to-[var(--homepage-card-color)] rounded-xl shadow-md p-6 text-white"
                        >
                            <h1 className="text-2xl font-bold mb-2">{t("dashboard.well")}</h1>
                            <p className="opacity-90">
                                {t("dashboard.welld")}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4">
                                <Link to="/projects" className="bg-[var(--bg-color4)]bg-[var(--bg-color4)]/20 hover:bg-[var(--bg-color4)]/30 transition-colors py-2 px-4 rounded-lg flex items-center text-sm backdrop-blur-sm">
                                    {t("dashboard.view")} <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>

                        {accessDeniedMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {accessDeniedMessage}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Stats with blue accents */}
                        <div className="flex justify-center gap-6 flex-wrap">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--loginpage-bg2)] w-80"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-[var(--features-icon-color)] font-medium">{t("dashboard.total")}</p>
                                        <h3 className="text-2xl font-bold text-[var(--features-icon-color)]">{stats.totalProjects}</h3>
                                    </div>
                                    <span className="p-2 bg-[var(--loginpage-bg)] rounded-md">
                                        <BarChart3 className="h-5 w-5 text-[var(--features-icon-color)]" />
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center text-xs">
                                  {/* Remove percentage stats, just show the period text */}
                                  
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--loginpage-bg2)] w-80"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-[var(--features-icon-color)] font-medium">{t("dashboard.progress")}</p>
                                        <h3 className="text-2xl font-bold text-[var(--features-icon-color)]">{stats.inProgress}</h3>
                                    </div>
                                    <span className="p-2 bg-[var(--loginpage-bg)] rounded-md">
                                        <Activity className="h-5 w-5 text-[var(--features-icon-color)]" />
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center text-xs">
                                  
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--loginpage-bg2)] w-80"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-[var(--features-icon-color)] font-medium">{t("dashboard.complete")}</p>
                                        <h3 className="text-2xl font-bold text-[var(--features-icon-color)]">{stats.completed}</h3>
                                    </div>
                                    <span className="p-2 bg-[var(--loginpage-bg)] rounded-md">
                                        <CheckCircle className="h-5 w-5 text-[var(--features-icon-color)]" />
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center text-xs">
                                  
                                </div>
                            </motion.div>
                        </div>

                        {/* Main dashboard content with blue accents */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-5 rounded-xl text-[var(--features-title-color)] shadow-sm border border-[var(--loginpage-bg)] lg:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold text-[var(--features-title-color)]">{t("dashboard.proprog")}</h2>
                                    <Link to="/projects" className="text-sm text-[var(--features-icon-color)] hover:underline flex items-center">
                                        {t("dashboard.viewall")} <ChevronRight className="h-4 w-4" />

                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {projects.length > 0 ? (
                                        projects.slice(0, 4).map(project => (
                                            <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-[var(--features-icon-color)]/30 rounded-lg transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white text-xs mr-3">
                                                        {project.owner.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">{project.name}</h3>
                                                        <p className="text-xs text-[var(--features-text-color)]">{t("dashboard.due")}{`: ${new Date(project.dueDate).toLocaleDateString()}`}</p>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-[var(--features-text-color)]">{project.progress}%</span>
                                                        <span className="text-xs font-medium" style={{ color: project.progress === 100 ? '#10B981' : 'var(--features-icon-color)' }}>
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-[var(--features-icon-color)]'}`}
                                                            style={{ width: `${project.progress}%` }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-sm text-[var(--features-title-color)]">
                                            {t("dashboard.noProjects") || "No projects yet"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent Activity Feed with blue accents */}
                                

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-5 rounded-xl shadow-sm border border-[var(--loginpage-bg)]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold text-[var(--features-title-color)]">{t("dashboard.recent")}</h2>
                                    <Link 
                                        to="/activities" 
                                        className="text-sm text-[var(--features-icon-color)] hover:underline flex items-center"
                                    >
                                        
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {isLoadingActivities ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
                                        </div>
                                    ) : recentActivities.length > 0 ? (
                                        recentActivities.slice(0, 3).map((activity) => (
                                            <motion.div
                                                key={activity.activityId}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-start gap-3 p-3 hover:bg-[var(--loginpage-bg)] rounded-lg transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--features-icon-color)] flex items-center justify-center text-white">
                                                        {getActivityIcon(activity.actionType)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-[var(--features-text-color)] truncate">
                                                            {activity.user?.username || 'PlanWise'}
                                                        </p>
                                                        <span className="text-xs text-[var(--features-title-color)]">
                                                            {formatActivityTime(activity.activityTime)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[var(--features-title-color)]">
                                                        {generateActivityMessage(activity, t)}
                                                    </p>
                                                    {activity.entityName && (
                                                        <p className="text-xs text-[var(--features-icon-color)] truncate">
                                                            {activity.entityName}
                                                        </p>
                                                    )}
                                                    {(activity.oldValue || activity.newValue) && (
                                                        <div className="text-xs mt-1">
                                                            {activity.oldValue && (
                                                                <span className="text-[var(--bug-report)] line-through mr-2">{activity.oldValue}</span>
                                                            )}
                                                            {activity.newValue && (
                                                                <span className="text-[var(--homepage-text-bright)]">{activity.newValue}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-sm text-[var(--features-title-color)]">
                                            {t("dashboard.noActivities")}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Third row with blue accents */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upcoming deadlines */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-5 rounded-xl shadow-sm border border-[var(--loginpage-bg)]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold text-[var(--features-title-color)]">{t("dashboard.upcoming")}</h2>
                                    <button
                                        onClick={navigateToCalendar}
                                        className="text-sm flex items-center text-[var(--features-icon-color)] hover:underline"
                                    >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {t("dashboard.view.timeline")}
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {isLoadingDeadlines ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
                                        </div>
                                    ) : upcomingDeadlines.length > 0 ? (
                                        upcomingDeadlines.slice(0, 4).map(deadline => {
                                            const statusText = deadline.status === 'overdue' ? t("dashboard.risk") : 
                                                            deadline.status === 'warning' ? t("dashboard.risk") : // Changed to use "Riskli" for warning
                                                            t("dashboard.upcoming");
                                            
                                            return (
                                                <div key={deadline.id} className="flex items-center !bg-[var(--bg-color)] justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div>
                                                        <h3 className="font-medium text-[var(--features-text-color)]">{deadline.task}</h3>
                                                        <p className="text-xs text-[var(--features-title-color)]">{deadline.project} • {deadline.category}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center mb-1">
                                                            {getStatusIcon(statusText)}
                                                            <span className={`ml-1 text-xs font-medium ${getStatusColor(statusText)}`}>
                                                                {statusText}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-[var(--features-title-color)]">
                                                            {new Date(deadline.dueDate).toLocaleDateString()}
                                                            {deadline.daysUntilDue === 0 && ` (${t("cal.due_today")})`}
                                                            {deadline.daysUntilDue === 1 && ` (${t("cal.due_tomorrow")})`}
                                                            {deadline.daysUntilDue > 1 && deadline.daysUntilDue <= 3 && ` (${t("cal.due_in")} ${deadline.daysUntilDue} ${t("cal.days")})`}
                                                            {deadline.daysUntilDue > 3 && ` (${t("cal.due_in")} ${deadline.daysUntilDue} ${t("cal.days")})`}
                                                            {deadline.daysUntilDue < 0 && ` (${Math.abs(deadline.daysUntilDue)} ${t("cal.days_overdue")})`}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-sm text-[var(--features-title-color)]">
                                            {t("dashboard.noUpcomingDeadlines")}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Documents with blue accents */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="bg-[var(--bg-color)] p-5 rounded-xl shadow-sm border border-[var(--loginpage-bg)]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold text-[var(--features-title-color)]">{t("dashboard.doc")}</h2>
                                </div>
                                <div className="space-y-3">
                                    {recentFiles.length > 0 ? (
                                        recentFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-[var(--bg-color)] p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-[var(--features-icon-color)] mr-3" />
                                                    <div>
                                                        <h3 className="font-medium text-[var(--features-text-color)]">{file.fileName}</h3>
                                                        <p className="text-xs text-[var(--features-title-color)]">
                                                            {t("dashboard.from")} {file.projectName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-[var(--features-title-color)]">
                                                        {(file.fileSize / 1024).toFixed(1)} KB
                                                    </span>
                                                    <span className="text-xs text-[var(--features-text-color)]">
                                                        {formatActivityTime(file.uploadedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-sm text-[var(--features-title-color)]">
                                            {t("dashboard.noDocuments") || "No recent documents"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer with blue accent */}
                    <div className="!bg-[var(--bg-color)] border-t border-[var(--loginpage-bg)] py-3 px-6">
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

export default Dashboard;