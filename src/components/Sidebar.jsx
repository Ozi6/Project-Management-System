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
  ShieldAlert  // Added for admin icon
} from "lucide-react";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showIssuesMenu, setShowIssuesMenu] = useState(false);
  
  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { 
      id: 'dashboard', 
      icon: Layout, 
      label: 'Dashboard', 
      path: '/dashboard',
      color: 'bg-blue-100 text-blue-600',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'projects', 
      icon: KanbanSquare, 
      label: 'Projects', 
      path: '/projects',
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
      path: '/settings',
      color: 'bg-slate-100 text-slate-600',
      iconColor: 'text-slate-600'
    },
  ];

  const helpItems = [
    { 
      id: 'documentation', 
      icon: FileText, 
      label: 'Documentation', 
      path: '/docs',
      color: 'bg-teal-50 text-teal-600',
      iconColor: 'text-teal-500'
    },
    { 
      id: 'support', 
      icon: MessageSquare, 
      label: 'Support', 
      path: '/support',
      color: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-500'
    }
  ];

  // Update the issuesItems based on user role
  const issuesItems = isAdmin ? [
    { 
      id: 'adminIssues', 
      icon: ShieldAlert, 
      label: 'User Issues', 
      path: '/admin/issues',
      color: 'bg-rose-50 text-rose-600',
      iconColor: 'text-rose-500'
    }
  ] : [
    { 
      id: 'bugs', 
      icon: BugPlay, 
      label: 'Bug Reports', 
      path: '/bugs',
      color: 'bg-rose-50 text-rose-600',
      iconColor: 'text-rose-500'
    }
  ];

  useEffect(() => {
    const path = location.pathname;
    const currentItem = navItems.find(item => path.startsWith(item.path));
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location, setActiveTab]);

  const getCurrentLabel = () => {
    const currentItem = navItems.find(item => item.id === activeTab);
    return currentItem ? currentItem.label : 'PlanWise';
  };

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return(
    <div className={`sidebar relative h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} shadow-md`}>
     
      {/* User section */}
      <div className={`p-4 border-b border-gray-200 ${isOpen ? 'flex items-center' : 'flex items-center justify-center'}`}>
        <SignedIn>
          <div className={`flex items-center ${isOpen ? 'w-full' : 'justify-center'}`}>
            <div className="flex-shrink-0">
              <UserButton afterSignOutUrl="/" />
            </div>
            {isOpen && (
              <div className="flex flex-col ml-3 overflow-hidden">
                <span className="font-medium text-sm truncate">{user?.fullName || 'User'}</span>
                <span className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || ''}</span>
              </div>
            )}
          </div>
        </SignedIn>
        <SignedOut>
          <div className={`${isOpen ? 'flex items-center' : 'flex items-center justify-center'}`}>
            <div className={`h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}>
              <User size={16} className="text-gray-500" />
            </div>
            {isOpen && (
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
            const hoverBgColor = item.color.replace("100", "50"); // Create lighter hover background
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full p-4 flex items-center text-left transition-all duration-200 
                  ${activeTab === item.id ? `${item.color} ${item.iconColor}` : "text-gray-600"} 
                  hover:${hoverBgColor} hover:text-${item.iconColor.split('-')[1]}-600
                  hover:scale-105 hover:shadow-md hover:border hover:border-${item.iconColor.split('-')[1]}-200`}
              >
                <Icon className={`min-w-6 h-6 w-6 ${activeTab === item.id ? item.iconColor : ''}`} />
                <span className={`ml-3 text-base font-medium ${!isOpen ? 'hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* New Issues & Help Section */}
      <div className="border-t border-gray-100">
        <div className="px-4 py-3">
          <button 
            onClick={() => isOpen && setShowIssuesMenu(!showIssuesMenu)}
            className={`w-full py-3 flex items-center justify-between text-gray-700 hover:text-rose-600 transition-colors`}
          >
            <div className="flex items-center">
              <AlertTriangle className="min-w-5 h-5 w-5" />
              <span className={`ml-3 text-sm font-medium ${!isOpen ? 'hidden' : ''} text-base`}>
                Issues & Help
              </span>
            </div>
            {isOpen && (
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${showIssuesMenu ? 'rotate-90' : ''}`} 
              />
            )}
          </button>
          
          {isOpen && showIssuesMenu && (
            <div className="mt-2 pl-8 space-y-2">
              {issuesItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.id}
                    to={item.path} 
                    className={`flex items-center py-2 px-3 text-sm rounded-md transition-colors
                      ${item.color}
                      hover:bg-${item.iconColor.split('-')[1]}-100`}
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

      {/* Help & Support Section */}
      <div className="border-t border-gray-100">
        <div className="px-4 py-3">
          <button 
            onClick={() => isOpen && setShowHelpMenu(!showHelpMenu)}
            className={`w-full py-3 flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors`}
          >
            <div className="flex items-center">
              <HelpCircle className="min-w-5 h-5 w-5" />
              <span className={`ml-3 font-medium ${!isOpen ? 'hidden' : ''} text-base`}>
                Help & Support
              </span>
            </div>
            {isOpen && (
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${showHelpMenu ? 'rotate-90' : ''}`} 
              />
            )}
          </button>
          
          {isOpen && showHelpMenu && (
            <div className="mt-2 pl-8 space-y-2">
              {helpItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.id}
                    to={item.path} 
                    className={`flex items-center py-2 px-3 text-sm rounded-md transition-colors
                      ${item.color}
                      hover:bg-${item.iconColor.split('-')[1]}-100`}
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

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 hover:scale-110 transition-all duration-200"
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
    </div>
  );
};

export default Sidebar;