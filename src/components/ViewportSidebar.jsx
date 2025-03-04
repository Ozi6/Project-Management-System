import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  KanbanSquare,
  Users,
  Calendar,
  Settings,
  PieChart,
} from "lucide-react";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false); // Default to closed
    const { user } = useUser();
    const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      id: "dashboard",
      icon: Layout,
      label: "Dashboard",
      path: "/dashboard",
      color: "bg-slate-100 text-slate-600",
    },
    {
      id: "team",
      icon: Users,
      label: "Teams",
      path: "/teams",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "Calendar",
      path: "/calendar",
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/project/settings",
      color: "bg-slate-100 text-slate-600",
    },
  ];

    // Check user permissions for showing settings
    const hasPermission = user?.role === 'manager' || user?.role === 'owner';

    // const filteredNavItems = navItems.filter(item => item.id !== 'settings' || hasPermission);
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
                        <Layout className="h-8 w-8 text-gray-600" />
                        {isOpen && <h1 className="text-2xl font-bold text-blue-600">PlanWise</h1>}
                    </Link>

                    <nav className="mt-4">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item)}
                                    className={`w-full p-4 flex items-center text-left transition-all duration-200 hover:bg-blue-50 hover:scale-105 
                                        ${activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>
                                    <Icon className="mr-3 h-6 w-6" />
                                    {isOpen && <span>{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

      {/* Main Content (Shifts when sidebar is open) */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        <button
          onClick={toggleSidebar}
          className={`fixed z-20 top-[50vh] ${
            isOpen ? "left-[256px]" : "left-[72px]"
          } w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-all duration-200`}
          style={{ transform: "translateY(-50%)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            className={`h-5 w-5 transition-transform duration-200 ${
              isOpen ? "" : "rotate-180"
            }`}
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
    </div>
  );
};

export default Sidebar;
