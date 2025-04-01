import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdvancedSettings from "../components/AdvancedSettings";
import GeneralSettings from "../components/GeneralSettings";
import Header from "../components/Header";
import { KanbanSquare, Layout, Settings, Users as UsersIcon, Activity, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProjectSettings = () =>
{
    const { id } = useParams();
    const {t} = useTranslation();
    const [activeTab, setActiveTab] = useState("settings");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const { state } = location;

    const isOwner = state?.isOwner || false;

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
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
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
            id: 'settings',
            icon: Settings,
            label: t("sidebar.set"),
            path: `/project/${id}/settings`,
            state: { isOwner },
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

    // Handle mobile sidebar
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

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="w-full bg-white shadow-sm z-10 border-b-2 border-gray-100">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--features-title-color)]">{t("set.tit")}</span>}
                />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile menu toggle button */}
                <button 
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--loginpage-bg)] text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                {/* Sidebar - hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block bg-white shadow-md z-5 border-r border-gray-100">
                    <Sidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        customNavItems={customNavItems} 
                    />
                </div>
                
                {/* Mobile sidebar - full screen overlay when open */}
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
                
                {/* Main content */}
                <div className="flex-1 overflow-auto bg-[var(--loginpage-bg)]/40 flex flex-col">
                    <div className="p-6 flex-grow">
                        {showAdvanced ? (
                            <AdvancedSettings
                                setShowAdvanced={setShowAdvanced}
                                isOwner={isOwner}
                            />
                        ) : (
                                <GeneralSettings setShowAdvanced={setShowAdvanced}
                                isOwner={isOwner}
                            />
                        )}
                    </div>
                    
                    {/* Footer - optional, following the pattern from other pages */}
                    <div className="bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6">
                        <div className="flex flex-row justify-between items-center text-xs text-[var(--features-icon-color)]">
                            <div>
                                <span>© 2025 PlanWise</span>
                                <span className="hidden sm:inline"> • {t("dashboard.rights")}</span>
                            </div>
                            <div className="text-xs text-[var(--features-icon-color)]">
                            {t("set.tit")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;
