import { useState, Fragment } from "react";
import { UserPlus, Trash, ChevronDown, Search } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import InvitePeople from "./InvitePeople";
import ManageAccessModal from "./ManageAccessModal";
import ErrorBoundary from "./ErrorBoundary";
import Dropdown from "./Dropdown";


import SimpleModal from "./SimpleModal";
import ManageTeamsModal from "./ManageTeamsModal";

const RemoveConfirmationModal = ({ member, onConfirm, onCancel }) => {
  return (
    <AnimatePresence mode="wait">
      {member && (
        <>
          <motion.div
            className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
            style={{ zIndex: 40 }}
          />
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
            <motion.div
              className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden"
              initial={{ y: "-20%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
            >
              <div className="bg-red-500 p-4 shadow-md">
                <h3 className="text-xl font-bold text-white text-center">
                  Confirm Removal
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-gray-700 text-center">
                  Are you sure you want to remove {member.name || "Unknown"}?
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={() => onConfirm(member.id)}
                    disabled={!member?.id}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const AdvancedSettings = ({ setShowAdvanced }) => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      team: "Engineering",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      team: "Marketing",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      team: "Design",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberToManageTeams, setMemberToManageTeams] = useState(null);
  const [teams, setTeams] = useState([
    { id: 1, name: "Engineering", icon: "Wrench" },
    { id: 2, name: "Marketing", icon: "BarChart" },
    { id: 3, name: "Design", icon: "Paintbrush" },
  ]);
  
  const [permissions, setPermissions] = useState(
    members.reduce(
      (acc, member) => ({
        ...acc,
        [member.email]: {
          "View Project": true,
          "Edit Project": false,
          "Delete Project": false,
        },
      }),
      {}
    )
  );

  const togglePermission = (email, option) => {
    if (!email || !permissions[email]) {
      console.warn("Invalid email or permissions for togglePermission");
      return;
    }
    setPermissions((prev) => ({
      ...prev,
      [email]: {
        ...prev[email],
        [option]: !prev[email]?.[option],
      },
    }));
  };
  
  const confirmRemoveMember = (id) => {
    if (!id) {
      console.warn("Invalid id for confirmRemoveMember");
      return;
    }
    setMembers(members.filter((member) => member.id !== id));
    setMemberToRemove(null); // Close the modal after confirmation
  };

  const addToTeam = (memberId, teamName) => {
    if (!memberId) {
      console.warn("Invalid memberId for addToTeam");
      return;
    }
    setMembers(
      members.map((member) =>
        member.id === memberId ? { ...member, team: teamName || "" } : member
      )
    );
  };

  const editTeam = (updatedTeam, oldTeam) => {
    if (!updatedTeam || !updatedTeam.name || !updatedTeam.name.trim()) {
      console.warn("Cannot edit team: updatedTeam or name is invalid");
      return;
    }
  
    if (oldTeam) {
      // Update existing team based on ID
      const updatedTeams = teams.map((team) =>
        team.id === oldTeam.id ? updatedTeam : team
      );
      setTeams(updatedTeams);
  
      // Update members with the new team name if it changed
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.team === oldTeam.name && oldTeam.name !== updatedTeam.name
            ? { ...member, team: updatedTeam.name }
            : member
        )
      );
    } else {
      // Add new team only if explicitly intended (no oldTeam provided)
      const existingTeam = teams.find((team) => team.id === updatedTeam.id);
      if (!existingTeam) {
        setTeams((prevTeams) => [...prevTeams, updatedTeam]);
      } else {
        // If ID exists but no oldTeam, update instead of adding
        const updatedTeams = teams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        );
        setTeams(updatedTeams);
      }
    }
  };
 
  const updateMemberRole = (memberId, newRole) => {
    if (!memberId || !newRole) return;

    setTeams(prevTeams => {
      const updatedTeams = prevTeams.map(team => ({
        ...team,
        members: team.members.map(member => 
          member.id === memberId 
            ? { ...member, role: newRole }
            : member
        )
      }));
      

      const memberUpdated = updatedTeams.some(team => 
        team.members.some(member => 
          member.id === memberId && member.role === newRole
        )
      );
      
      if (!memberUpdated) {
        console.warn('Failed to update member role');
        return prevTeams;
      }
      
      return updatedTeams;
    });

  const deleteTeam = (teamName) => {
    if (!teamName || typeof teamName !== "string") {
      console.warn("Cannot delete team: invalid team name");
      return;
    }
    setTeams(teams.filter((team) => team.name !== teamName));
    setMembers(
      members.map((member) =>
        member.team === teamName ? { ...member, team: "" } : member
      )
    );
  };

  const handleRemoveClick = (member) => {
    if (!member || !member.id) {
      console.warn("Cannot remove member: invalid member data");
      return;
    }
    setMemberToRemove(member); // Open the confirmation modal
  };

  const filteredMembers = members.filter(
    (member) =>
      member && (member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ErrorBoundary>
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Advanced Settings</h2>
        <div className="flex justify-between items-center mb-6">
          {/* Go Back to General Settings Button */}
          <button
            onClick={() => setShowAdvanced(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 ease-in-out"
          >
            Go Back to General Settings
          </button>

          {/* Invite People Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 ease-in-out flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Invite People
          </button>
        </div>
        
        {/* Invite People Modal */}
        <InvitePeople
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!members.length} // Disable search if no members exist
          />
        </div>

        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`https://i.pravatar.cc/150?img=${member.id}`} // Using a dummy avatar for each member
                  alt={member.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">Team: {member.team || "None"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-700"
                  onClick={() => setSelectedMember(member || null)}
                  disabled={!member}
                >
                  Manage Access
                </button>

                <button
                  className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setMemberToManageTeams(member || null)}
                >
                  Manage Team
                </button>

                <button
                  onClick={() => handleRemoveClick(member)}
                  className="bg-red-500 text-white p-2 rounded-lg flex items-center transition-all hover:bg-red-700 hover:scale-110"
                  disabled={!member}
                >
                  <Trash className="w-5 h-5 mr-1" />
                  Remove
                </button>
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

        <ManageAccessModal
          member={selectedMember}
          permissions={permissions}
          onTogglePermission={togglePermission}
          onClose={() => setSelectedMember(null)}
        />

        <RemoveConfirmationModal
          member={memberToRemove}
          onConfirm={confirmRemoveMember}
          onCancel={() => setMemberToRemove(null)}
        />
        
        {memberToManageTeams && (
          <ManageTeamsModal
            member={memberToManageTeams}
            teams={teams || []}
            onAddToTeam={addToTeam}
            onEditTeam={editTeam}
            onDeleteTeam={deleteTeam}
            onClose={() => setMemberToManageTeams(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};
};
export default AdvancedSettings;