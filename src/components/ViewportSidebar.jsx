import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, KanbanSquare, Users, Calendar, Settings, PieChart } from "lucide-react";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false); // Default to closed
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentProjectId, setCurrentProjectId] = useState(null);
    
    // Extract current project ID from URL and set it in state
    useEffect(() => {
        if (location.pathname.includes('/project/')) {
            const projectId = location.pathname.split('/project/')[1].split('/')[0];
            setCurrentProjectId(projectId);
            
            if (setActiveTab) {
                setActiveTab('projects');
            }
        }
    }, [location.pathname, setActiveTab]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Update navItems to match Sidebar.jsx styling with colors and icon colors
    const navItems = [
        { 
            id: 'dashboard', 
            icon: Layout, 
            label: 'Dashboard', 
            path: '/dashboard', 
            color: 'bg-blue-100 text-blue-600',
            iconColor: 'text-blue-600',
            defaultColor: true
        },
        { 
            id: 'project', 
            icon: KanbanSquare, 
            label: 'Project', 
            path: currentProjectId ? `/project/${currentProjectId}` : '/project/1',
            color: 'bg-purple-100 text-purple-600',
            iconColor: 'text-purple-600'
        },
        { 
            id: 'team', 
            icon: Users, 
            label: 'Teams', 
            path: '/team', 
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        { 
            id: 'calendar', 
            icon: Calendar, 
            label: 'Calendar', 
            path: '/activity',
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        { 
            id: 'settings', 
            icon: Settings, 
            label: 'Settings', 
            path: currentProjectId ? `/project/settings` : '/project/settings/', 
            color: 'bg-slate-100 text-slate-600',
            iconColor: 'text-slate-600'
        },
    ];

    // Check user permissions for showing settings
    const hasPermission = user?.role === 'manager' || user?.role === 'owner';
    const filteredNavItems = navItems;
    
    const handleNavigation = (item) => {
        if (setActiveTab) setActiveTab(item.id);
        navigate(item.path);
    };
    
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen bg-white transition-all duration-300 shadow-md z-10 overflow-hidden 
                ${isOpen ? 'w-64' : 'w-16'}`}>
                <div className="sidebar-content flex flex-col h-full">
                    <Link to="/" className="p-4 flex items-center space-x-2 no-underline hover:bg-gray-50 transition-colors duration-200">
                        <Layout className="h-8 w-8 text-blue-600" />
                        {isOpen && <h1 className="text-2xl font-bold text-blue-600">PlanWise</h1>}
                    </Link>

                    <nav className="mt-4">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const hoverBgColor = item.color.replace("100", "50"); // Create lighter hover background
                            const isItemDashboard = item.id === 'dashboard';
                            const colorClass = item.color.split(' ')[1]; // Extract text color class
                            
                            // Special handling for project views - mark the projects tab as active when in a project route
                            const isActive = item.id === activeTab || 
                                (item.id === 'projects' && location.pathname.includes('/project/'));
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item)}
                                    className={`w-full p-4 flex items-center text-left transition-all duration-200 
                                        ${isActive
                                            ? `${item.color} ${item.iconColor}` 
                                            : isItemDashboard 
                                                ? "text-blue-600" 
                                                : "text-gray-600"} 
                                        hover:${hoverBgColor} hover:${colorClass}
                                        hover:scale-105 hover:shadow-md hover:border hover:border-${item.iconColor.split('-')[1]}-200`}
                                >
                                    <Icon className={`mr-3 h-6 w-6 ${
                                        isActive
                                            ? item.iconColor 
                                            : isItemDashboard 
                                                ? 'text-blue-600'
                                                : ''
                                    }`} />
                                    {isOpen && <span className={`text-base font-medium`}>{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Return to current project button - Only show when on a project page */}
                    {currentProjectId && isOpen && (
                        <div className="mt-auto mb-4 px-4">
                            <button
                                onClick={() => navigate(`/project/${currentProjectId}`)}
                                className="w-full p-3 flex items-center justify-center bg-purple-100 text-purple-700 rounded-lg
                                hover:bg-purple-200 hover:shadow transition-colors duration-200"
                            >
                                <KanbanSquare className="h-5 w-5 mr-2" />
                                <span className="font-medium">Current Project</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content (Shifts when sidebar is open) */}
            <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'} p-6`}>
                <button
                    onClick={toggleSidebar}
                    className={`fixed z-20 top-[50vh] ${isOpen ? 'left-[256px]' : 'left-[72px]'} w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 hover:scale-110 transition-all duration-200`}
                    style={{ transform: 'translateY(-50%)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
