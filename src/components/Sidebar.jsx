import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  KanbanSquare, 
  Users, 
  Calendar, 
  Settings, 
  PieChart, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  User,
  ChevronRight,
  LogOut,
  AlertTriangle,
  BugPlay,
  AlertOctagon,
  ShieldAlert,
  X
} from "lucide-react";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activeTab, setActiveTab, customNavItems, isMobile = false, closeMobileMenu }) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showIssuesMenu, setShowIssuesMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings); // Toggle visibility of settings
  };

  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  // Handle navigation in mobile mode
    const handleMobileNavigation = (item) => {
    setActiveTab(item.id);
      navigate(item.path, { state: item.state });
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  // Use custom nav items if provided, otherwise use default
  const navItems = customNavItems || [
    { 
      id: 'dashboard', 
      icon: Layout, 
      label: t("sidebar.dash"), 
      path: '/dashboard',
      color: 'bg-[var(--sidebar-dashboard-bg-color)] text-[var(--sidebar-dashboard-color)]',
      iconColor: 'text-[var(--sidebar-dashboard-color)]',     
      defaultColor : true
    },
    { 
      id: 'projects', 
      icon: KanbanSquare, 
      label: t("sidebar.pro"), 
      path: '/projects',
      color: 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]',
      iconColor: 'text-[var(--sidebar-projects-color)]'
    },
    { 
      id: 'calendar', 
      icon: Calendar, 
      label: t("sidebar.gantt"), 
      path: '/calendar',
      color: 'bg-[var(--sidebar-gantt-bg-color)] text-[var(--sidebar-gantt-color)]',
      iconColor: 'text-[var(--sidebar-gantt-color)]'
    }
  ];

  // Merge help items into issuesItems
  const issuesItems = isAdmin ? [
    { 
      id: 'adminIssues', 
      icon: ShieldAlert, 
      label: t("sidebar.help"), 
      path: '/admin/issues',
      color: 'bg-rose-50 text-rose-600',
      iconColor: 'text-rose-500'
    }
  ] : [
    { 
      id: 'bugs', 
      icon: BugPlay, 
      label: t("sidebar.bug"), 
      path: '/bugs',
      color: 'bg-rose-50 text-rose-600',
      iconColor: 'text-rose-500'
    }
    
  ];

  useEffect(() => {
    const path = location.pathname;
    
    // Check if we're on an issues or bugs page to determine if menu should be open
    const isIssuesPage = path.includes('/bugs') || path.includes('/admin/issues');
    if (isIssuesPage) {
      setShowIssuesMenu(true);
    }
    
    // Path matching for active tab highlighting
    const exactNavMatch = navItems.find(item => path === item.path);
    const exactIssuesMatch = issuesItems.find(item => path === item.path);
    
    // Broader match checking for nested paths
    const startsWithNavMatch = navItems.find(item => 
      path.startsWith(item.path) && item.path !== '/' && item.path.length > 1
    );
    const startsWithIssuesMatch = issuesItems.find(item => 
      path.startsWith(item.path) && item.path !== '/' && item.path.length > 1
    );
    
    // Determine active item
    const currentNavItem = exactNavMatch || startsWithNavMatch;
    const currentIssuesItem = exactIssuesMatch || startsWithIssuesMatch;
    
    // Set active tab based on matched item
    if (currentIssuesItem) {
      setActiveTab(currentIssuesItem.id);
    } else if (currentNavItem) {
      setActiveTab(currentNavItem.id);
    } else if (isIssuesPage) {
      // Fallback for issues pages if no exact match found
      if (path.includes('/bugs')) {
        setActiveTab('bugs');
      } else if (path.includes('/admin/issues')) {
        setActiveTab('adminIssues');
      }
    }
    
  }, [location.pathname, navItems, issuesItems, setActiveTab]);

  const getCurrentLabel = () => {
    const currentItem = navItems.find(item => item.id === activeTab);
    return currentItem ? currentItem.label : 'PlanWise';
  };

  const handleNavigation = (item) => {
    if (isMobile) {
      handleMobileNavigation(item);
    } else {
      setActiveTab(item.id);
        navigate(item.path, { state: item.state });
    }
  };

  return(
    <div className={`sidebar relative h-screen bg-gradient-to-b from-[var(--bg-color)] to-[var(--loginpage-bg)] flex flex-col transition-all duration-300
      ${isMobile ? 'w-full' : isOpen ? 'w-64' : 'w-16'} shadow-md`}>
     
      {/* Mobile close button */}
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[var(--features-icon-color)]">Menu</h2>
          <button 
            onClick={closeMobileMenu}
            className="p-1 hover:bg-gray-200 rounded-full"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      {/* User section */}
      <div className={`p-4 border-b border-gray-200 bg-[var(--bg-color)] ${isMobile ? 'flex items-center' : isOpen ? 'flex items-center' : 'flex items-center justify-center'}`}>
        <SignedIn>
          <div className={`flex items-center ${isMobile ? 'w-full' : isOpen ? 'w-full' : 'justify-center'}`}>
            <div className="flex-shrink-0">
              <UserButton afterSignOutUrl="/" />
            </div>
            {(isOpen || isMobile) && (
              <div className="flex flex-col ml-3 overflow-hidden">
                <span className="font-medium text-sm truncate">{user?.fullName || t("sidebar.user")}</span>
                <span className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || ''}</span>
              </div>
            )}
          </div>
        </SignedIn>
        <SignedOut>
          <div className={`${isMobile ? 'flex items-center' : isOpen ? 'flex items-center' : 'flex items-center justify-center'}`}>
            <div className={`h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}>
              <User size={16} className="text-gray-500" />
            </div>
            {(isOpen || isMobile) && (
              <div className="flex-1 ml-3">
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </SignedOut>
      </div>

      {/* Main navigation */}
      <div className="sidebar-content flex-1 overflow-y-auto overflow-x-hidden whitespace-nowrap w-full">
        <nav className="mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hoverBgColor = item.color?.replace("100", "50") || "bg-gray-50"; // Create lighter hover background
            // Make Dashboard blue even when not active
            const isItemDashboard = item.id === 'dashboard';
            const isItemProjects = item.id === 'projects';
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full p-4 flex items-center text-[var(--features-title-color)] text-left transition-all duration-200 
                  ${activeTab === item.id 
                    ? `${item.color} ${item.iconColor}` 
                    : isItemDashboard 
                      ? "text-[var(--sidebar-dashboard-color)]"
                      : isItemProjects
                        ? "text-[var(--sidebar-projects-color)]"  
                        : "text-[var(--sidebar-gantt-color)]"} 
  
                  hover:${hoverBgColor} hover:text-${item.iconColor?.split('-')[1] || 'blue'}-600
                  hover:scale-105 hover:shadow-md hover:border hover:border-${item.iconColor?.split('-')[1] || 'blue'}-200`}
              >
                <Icon className={`min-w-6 h-6 w-6 ${
                  activeTab === item.id 
                    ? item.iconColor 
                    : isItemDashboard 
                      ? 'text-[var(--homapage-card-color)]'
                      : ''
                }`} />
                <span className={`ml-3 text-base font-medium ${!isOpen && !isMobile ? 'hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Issues & Help Section - Inside sidebar-content */}
        <div className="mt-6 border-t border-gray-200 pt-4 px-4">
          <button 
            onClick={() => {
              // Only toggle if we're not on an issues page, otherwise keep it open
              const path = location.pathname;
              const isIssuesPage = path.includes('/bugs') || path.includes('/admin/issues');
              
              if (isIssuesPage) {
                // If on issues page, only allow opening the menu, not closing
                setShowIssuesMenu(true);
              } else {
                // Otherwise toggle normally
                setShowIssuesMenu(!showIssuesMenu);
              }
            }}
            className={`w-full py-3 flex items-center justify-between !text-[var(--bug-report)] hover:bg-[var(--bug-report)]/30 transition-colors rounded-lg ${showIssuesMenu ? 'bg-[var(--bug-report)]/10' : ''}`}
          >
            <div className="flex items-center">
              <AlertTriangle className="min-w-5 h-5 w-5" />
              <span className={`ml-3 text-base font-medium ${!isOpen && !isMobile ? 'hidden' : ''}`}>
                {t("sidebar.help")}
              </span>
            </div>
            {(isOpen || isMobile) && (
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${showIssuesMenu ? 'rotate-90' : ''}`} 
              />
            )}
          </button>
          
          {(isOpen || isMobile) && showIssuesMenu && (
            <div className="mt-2 pl-8 space-y-2 mb-4">
              {issuesItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.id}
                    to={item.path}
                    onClick={isMobile && closeMobileMenu ? closeMobileMenu : undefined} 
                    className={`flex items-center py-2 px-3 text-sm text-[var(--text-color3)] rounded-md transition-colors
                      ${activeTab === item.id ? item.color : ''}
                      hover:bg-[var(--bug-report)]/20`}
                  >
                    <Icon size={16} className={`mr-2 ${item.iconColor}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toggle button - only shown on desktop */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--features-icon-color)] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Sidebar;