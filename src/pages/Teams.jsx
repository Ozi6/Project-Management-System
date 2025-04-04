import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ManageRoleModal from "../components/ManageRoleModal";
import { Users, KanbanSquare, Layout, Settings, Activity, Edit2, Trash2, MoreVertical, Plus, X, UserCheck, Menu, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; // Add this import if using Clerk for auth
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const teamColors = {
  1: "from-[var(--gray-card1)] to-[var(--loginpage-bg)] hover:from-[var(--loginpage-bg)] hover:to-[var(--gray-card3)]",
  4: "from-[var(--gray-card1)] to-[var(--loginpage-bg)] hover:from-[var(--loginpage-bg)] hover:to-[var(--gray-card3)]",
};

const roles = ["Team Lead", "Senior", "Middle", "Junior"];

const teamsData = [
  {
    id: 1,
    name: "Frontend Team",
    members: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        role: "Team Lead",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        role: "Senior",
      },
      {
        id: 9,
        name: "Alex Turner",
        email: "alex@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        role: "Middle",
      },
    ],
  },
  {
    id: 2,
    name: "Backend Team",
    members: [
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        role: "Team Lead",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "Senior",
      },
      {
        id: 10,
        name: "David Chen",
        email: "david@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        role: "Junior",
      },
    ],
  },
  {
    id: 3,
    name: "Design Team",
    members: [
      {
        id: 5,
        name: "Emma Davis",
        email: "emma@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      },
      {
        id: 6,
        name: "Lucas White",
        email: "lucas@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      },
      {
        id: 7,
        name: "John Doe ",
        email: "john@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
    ],
  },
  {
    id: 4,
    name: "DevOps Team",
    members: [
      {
        id: 7,
        name: "Oliver Brown",
        email: "oliver@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
      },
      {
        id: 8,
        name: "Sophia Lee",
        email: "sophia@example.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      },
    ],
  },
];

const Teams = () => {
    const { id } = useParams();
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState("teams");
  const [teams, setTeams] = useState(teamsData);
  const [selectedMember, setSelectedMember] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const isOwner = location.state?.isOwner || false;


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

  // Custom navigation items for the sidebar - matching ProjectDetails.jsx
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
            color: 'bg-purple-100 text-purple-600',
            iconColor: 'text-purple-600'
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
            icon: Users,
            label: t("sidebar.team"),
            path: `/project/${id}/teams`,
            state: { isOwner },
            color: 'bg-[var(--sidebar-teams-bg-color)] text-[var(--sidebar-teams-color)]',
            iconColor: 'text-[var(--sidebar-teams-color)]'
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with shadow */}
      <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b border-[var(--sidebar-teams-color)]">
        <Header
          title={<span className="text-xl font-semibold text-[var(--sidebar-teams-color)]">{t("sidebar.team")}</span>}
          action={{
            onClick: () => console.log("Add team clicked"),
            icon: <Users className="mr-2 h-4 w-4" />,
            label: "Add Team"
          }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu toggle button */}
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar - hidden on mobile, shown on md+ screens */}
        <div className="hidden md:block bg-white shadow-md z-5 border-r border-blue-100">
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
        <div className="flex-1 overflow-auto bg-[var(--sidebar-teams-bg-color)] flex flex-col">
          <div className="grid grid-cols-1 py-6 px-6 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto flex-grow">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 bg-gradient-to-br ${
                  teamColors[team.id] || "from-[var(--gray-card1)] to-[var(--loginpage-bg)] hover:from-[var(--loginpage-bg)] hover:to-[var(--gray-card3)]"
                } overflow-hidden`}
              >
                <div className="w-full p-4 text-left border-b border-gray-100/50">
                  <span className="font-medium text-[var(--features-text-color)]">{team.name}</span>
                </div>

                <div className="p-4 backdrop-blur-sm bg-white/30">
                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-8 h-8 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
                          />
                          <div>
                            <div className="font-medium text-sm text-[var(--features-title-color)]">
                              {member.name}
                            </div>
                            <div className="text-xs text-[var(--text-color3)] hover:text-gray-700 transition-colors duration-200">
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-[var(--loginpage-bg)] text-[var(--features-text-color)] rounded-full">
                          {member.role || t("team.mem")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          
          <div className="w-full bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6 mt-auto">
            <div className="flex flex-row justify-between items-center text-xs text-[var(--featureas-icon-color)]">
              <div>
                <span className="text-[var(--sidebar-teams-color)]">© 2025 PlanWise</span>
                <span className="hidden sm:inline text-[var(--sidebar-teams-color)]"> • {t("dashboard.rights")}</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/terms" className="text-[var(--sidebar-teams-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.terms")}</Link>
                <Link to="/privacy" className="text-[var(--sidebar-teams-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.pri")}</Link>
                <span className="flex items-center text-[var(--sidebar-teams-color)]">
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

export default Teams;