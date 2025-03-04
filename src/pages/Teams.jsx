import React, { useState } from "react";
import ViewportSidebar from "../components/ViewportSidebar";
import ManageRoleModal from "../components/ManageRoleModal";

// Добавляем цвета для разных команд
const teamColors = {
  1: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
  2: "from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
  3: "from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200",
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

  const updateMemberRole = (memberId, newRole) => {
    if (!memberId || !newRole) return;

    setTeams((prevTeams) => {
      const updatedTeams = prevTeams.map((team) => ({
        ...team,
        members: team.members.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        ),
      }));

      // Проверяем, что роль действительно обновилась
      const memberUpdated = updatedTeams.some((team) =>
        team.members.some(
          (member) => member.id === memberId && member.role === newRole
        )
      );

      if (!memberUpdated) {
        console.warn("Failed to update member role");
        return prevTeams;
      }

      return updatedTeams;
    });

    setSelectedMember(null);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div>
        <ViewportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content */}
      <div className="flex-1 py-6 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold ml-6 mt-5 mb-8 text-gray-800 px-6">
          Teams
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
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
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center space-x-2"
                      >
                        <span>{member.role || "Set Role"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <ManageRoleModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdateRole={updateMemberRole}
          roles={roles}
          currentRole={selectedMember?.role}
        />
      </div>
    </div>
  );
};

export default Teams;
