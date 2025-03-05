import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ManageRoleModal from "../components/ManageRoleModal";
import { Users, KanbanSquare, Layout, Settings, Activity, Edit2, Trash2, MoreVertical, Plus, X, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; // Add this import if using Clerk for auth

const teamColors = {
  1: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
  4: "from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
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
  const [activeTab, setActiveTab] = useState("teams");
  const [teams, setTeams] = useState(teamsData);
  const [selectedMember, setSelectedMember] = useState(null);

  // Custom navigation items for the sidebar - matching ProjectDetails.jsx
  const customNavItems = [
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
      id: 'projects', 
      icon: KanbanSquare, 
      label: 'This Project', 
      path: '/project/1',
      color: 'bg-purple-100 text-purple-600',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'activity', 
      icon: Activity, 
      label: 'Activity',
      path: '/activity',
      color: 'bg-yellow-100 text-yellow-600',
      iconColor: 'text-amber-600'
    },
    { 
      id: 'teams', 
      icon: Users, 
      label: 'Teams',
      path: '/teams',
      color: 'bg-green-100 text-green-600',
      iconColor: 'text-green-600'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      path: '/project/settings',
      color: 'bg-gray-100 text-gray-600',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      {/* Header with shadow */}
      <div className="w-full bg-white shadow-sm z-10 border-b-2 border-blue-100">
        <Header
          title={<span className="text-xl font-semibold text-blue-800">Teams</span>}
          action={{
            onClick: () => console.log("Add team clicked"),
            icon: <Users className="mr-2 h-4 w-4" />,
            label: "Add Team"
          }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with customNavItems to match ProjectDetails.jsx */}
        <div className="bg-white shadow-md z-5 border-r border-blue-100">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            customNavItems={customNavItems} 
          />
        </div>

        {/* Main content */}
        <div className="flex-1 py-6 px-6 overflow-auto bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 bg-gradient-to-br ${
                  teamColors[team.id]
                } overflow-hidden`}
              >
                <div className="w-full p-4 text-left border-b border-gray-100/50">
                  <span className="font-medium text-gray-700">{team.name}</span>
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
                            <div className="font-medium text-sm text-gray-700">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {member.role || "Member"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;