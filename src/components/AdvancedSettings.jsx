import { useState, Fragment } from "react";
import { UserPlus, Trash2, ChevronDown, Search } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import InvitePeople from "./InvitePeople";
import ManageAccessModal from "./ManageAccessModal";
import ManageTeamsModal from "./ManageTeamsModal";
import ErrorBoundary from "./ErrorBoundary"; // Ensure this exists as shown previously
import SimpleModal from "./SimpleModal";


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

const AdvancedSettings = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Manager",
      team: "Engineering",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Guest",
      team: "Marketing",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Member",
      team: "Design",
    },
  ]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const roles = ["Manager", "Guest", "Member"];
  const [memberToManageTeams, setMemberToManageTeams] = useState(null);
  const [teams, setTeams] = useState([
    { name: "Engineering", icon: "Wrench" },
    { name: "Marketing", icon: "BarChart" },
    { name: "Design", icon: "Paintbrush" },
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

  const updateRole = (id, newRole) => {
    if (!id || !newRole) {
      console.warn("Invalid id or newRole for updateRole");
      return;
    }
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
    setOpenDropdown(null); // Close dropdown after selecting a role
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
      const updatedTeams = teams.map((team) => 
        team.name === oldTeam.name ? updatedTeam : team
      );
      setTeams(updatedTeams);

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.team === oldTeam.name 
            ? { ...member, team: updatedTeam.name } 
            : member
        )
      );
    } else {
      setTeams((prevTeams) => [...prevTeams, updatedTeam]);
    }
  };

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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Project Settings</h2>

        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          onClick={() => setIsModalOpen(true)}
          disabled={!members.length} // Prevent invite if no members exist
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Invite People
        </button>
        <InvitePeople
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

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
              <div>
                <p className="text-lg font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>

              <div className="flex w-[600px] justify-center items-center space-x-4">
                <Menu as="div" className="relative inline-block text-left w-40 z-10">
                  <Menu.Button
                    className="flex items-center w-[160px] justify-between bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                    onClick={() => setOpenDropdown((prev) => (prev === member.id ? null : member.id))}
                    onBlur={() => setTimeout(() => setOpenDropdown(null), 200)} // Delay to allow menu click
                  >
                    {member.role || "No Role"}
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </Menu.Button>

                  <Transition
                    show={openDropdown === member.id}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items
                      className="absolute left-0 mt-1 min-w-[160px] bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] origin-top-right"
                      style={{
                        top: "100%",
                        transform: "translateY(10px)",
                      }}
                    >
                      {roles.map((role) => (
                        <Menu.Item key={role}>
                          {({ active }) => (
                            <button
                              className={`block w-full text-left px-4 py-2 ${
                                active ? "bg-blue-100" : ""
                              } ${member.role === role ? "font-bold text-blue-600" : "text-gray-700"}`}
                              onClick={() => updateRole(member.id, role)}
                              disabled={!member?.id}
                            >
                              {role}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-700"
                  onClick={() => setSelectedMember(member || null)}
                  disabled={!member}
                >
                  Manage Access
                </button>

                <button
                  className="text-gray-700 font-medium w-[90px] text-center bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => setMemberToManageTeams(member || null)}
                  disabled={!member}
                >
                  {member.team || "No Team"}
                </button>

                <button
                  onClick={() => handleRemoveClick(member)}
                  className="bg-red-500 text-white p-2 rounded-lg flex items-center transition-all hover:bg-red-700 hover:scale-110"
                  disabled={!member}
                >
                  <Trash2 className="w-5 h-5 mr-1" />
                  Remove
                </button>
                {/* <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setModalOpen(true)}
                >
                  Open Modal
                </button> */}
              </div>
            </div>
          ))}
        </div>

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
        <ManageTeamsModal
          member={memberToManageTeams || null} // Ensure null if not set
          teams={teams || []} // Ensure teams is always an array
          onAddToTeam={addToTeam}
          onEditTeam={editTeam}
          onDeleteTeam={deleteTeam}
          onClose={() => setMemberToManageTeams(null)}
        />
        <SimpleModal 
          isOpen={modalOpen} onClose={() => setModalOpen(false)}

        />
      </div>
    </ErrorBoundary>
  );
};

export default AdvancedSettings;