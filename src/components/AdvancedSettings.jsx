import { useState, Fragment, useEffect } from "react";
import { UserPlus, Trash, ChevronDown, Search, UserCheck } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useAuth } from "@clerk/clerk-react";
import InvitePeople from "./InvitePeople";
import ManageAccessModal from "./ManageAccessModal";
import ErrorBoundary from "./ErrorBoundary";
import SimpleModal from "./SimpleModal";
import ManageTeamsModal from "./ManageTeamsModal";
import { useTranslation } from "react-i18next";
import axios from "axios";

const RemoveConfirmationModal = ({ member, onConfirm, projectId }) => {
    const { t } = useTranslation();

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
              <div className="bg-[var(--bug-report)] p-4 shadow-md">
                <h3 className="text-xl font-bold text-white text-center">
                {t("adset.conf")}
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-gray-700 text-center">
                
                {t("adset.confm")} {member.name || "Unknown"}?
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 !text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={onCancel}
                  >
                    {t("prode.can")}
                  </button>
                  <button
                    className="bg-[var(--bug-report)]/50 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-32"
                    onClick={() => onConfirm(member.id)}
                    disabled={!member?.id}
                  >
                    {t("adset.rem")}
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

// Simple placeholder for ManageRoleModal
const ManageRoleModal = ({ member, onClose, onUpdateRole, roles, currentRole }) => {
  if (!member) return null;
  
  return (
    <SimpleModal
      isOpen={!!member}
      onClose={onClose}
      title="Manage Role"
    >
      <div className="p-4">
        <p>Manage roles for {member.name}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

const AdvancedSettings = ({ setShowAdvanced, isOwner, projectId }) =>
{
    const {t} = useTranslation();
    const { getToken } = useAuth();
    const { user } = useUser();
    const isProjectOwner = isOwner;

    const [members, setMembers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {

    }, [projectId, getToken, t]);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            await fetchTeams();
            await fetchMembers();
        };

        fetchData();
    },[projectId, getToken, t]);

    const fetchTeams = async () =>
    {
        try{
            const token = await getToken();
            const response = await axios.get(
                `http://localhost:8080/api/projects/${projectId}/teams`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const teamsData = response.data.map(team => (
            {
                id: team.teamId,
                name: team.teamName,
                icon: team.iconName,
                members: team.members ? team.members.map(m => m.userId) : []
            }));

            setTeams(teamsData);
        }catch(err){
            console.error('Error fetching teams:', err);
            setError(t("pro.errd"));
        }
    };

    const fetchMembers = async () =>
    {
        try{
            const token = await getToken();
            const response = await axios.get(
                `http://localhost:8080/api/projects/${projectId}/members`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const membersData = response.data.map(member => (
            {
                id: member.userId,
                name: (member.username || member.email) + (member.userId === user.id ? " (You)" : ""),
                email: member.email,
                team: member.team || "",
                role: member.userId == user.I ? "Owner" : member.role || "Member",
                avatar: member.profileImageUrl
                    ? `${member.profileImageUrl}?width=150&height=150`
                    : `https://i.pravatar.cc/150?u=${member.email}`
            }));

            setMembers(membersData);

            setLoading(false);
        }catch(err){
            console.error('Error fetching members:', err);
            setError(t("pro.errd"));
            setLoading(false);
        }
    };
  
  // Define roles
  const roles = ["Admin", "Member", "Guest"];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberToManageTeams, setMemberToManageTeams] = useState(null);
  
  const [permissions, setPermissions] = useState(
    members.reduce(
      (acc, member) => ({
        ...acc,
        [member.email]: {
          [t("adset.view")]: true,
          [t("adset.edit")]: false,
          [t("adset.del")]: false,
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
  
  const updateMemberRole = (memberId, newRole) => {
    if (!memberId || !newRole) return;

    setTeams(prevTeams => {
      const updatedTeams = prevTeams.map(team => ({
        ...team,
        members: team.members ? team.members.map(member => 
          member.id === memberId 
            ? { ...member, role: newRole }
            : member
        ) : []
      }));
      
      const memberUpdated = updatedTeams.some(team => 
        team.members && team.members.some(member => 
          member.id === memberId && member.role === newRole
        )
      );
      
      if (!memberUpdated) {
        console.warn('Failed to update member role');
        return prevTeams;
      }
      
      return updatedTeams;
    });
  };

    const deleteTeam = async (teamId) =>
    {
        try{
            const token = await getToken();
            await axios.delete(
                `http://localhost:8080/api/projects/${projectId}/teams/${teamId}`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.team === teams.find(t => t.id === teamId)?.name
                        ? { ...member, team: "" }
                        : member
                )
            );
            return true;
        }catch(err){
            console.error('Error deleting team:', err);
            return false;
        }
    };

  const confirmRemoveMember = (id) => {
    if (!id) {
      console.warn("Invalid id for confirmRemoveMember");
      return;
    }
    setMembers(members.filter((member) => member.id !== id));
    setMemberToRemove(null); // Close the modal after confirmation
  };

    const addToTeam = async (memberId, teamId) =>
    {
        try{
            const token = await getToken();
            await axios.post(
                `http://localhost:8080/api/projects/${projectId}/teams/${teamId}/members/${memberId}`,
                {},
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.id === memberId
                        ? { ...member, team: teams.find(t => t.id === teamId)?.name || "" }
                        : member
                )
            );
        }catch(err){
            console.error('Error adding member to team:', err);
        }
    };

    const getInitial = (name) =>
    {
        if(!name)
            return '?';
        const parts = name.split(' ');
        if(parts.length === 1)
            return parts[0].charAt(0).toUpperCase();
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    };


    const editTeam = async (updatedTeam, oldTeam) =>
    {
        try{
            const token = await getToken();
            const response = await axios.put(
                `http://localhost:8080/api/projects/${projectId}/teams/${oldTeam.id}`,
                {
                    teamName: updatedTeam.name,
                    iconName: updatedTeam.icon
                },
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team.id === oldTeam.id
                        ? { ...team, name: updatedTeam.name, icon: updatedTeam.icon }
                        : team
                )
            );
        } catch (err) {
            console.error('Error updating team:', err);
        }
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
      <div className="p-4 md:p-6 w-full">
        <h2 className="text-xl font-bold mb-4 text-[var(--features-title-color)]">{t("adset.tit")}</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          {/* Go Back to General Settings Button */}
          <button
            onClick={() => setShowAdvanced(false)}
            className="bg-[var(--sidebar-gantt-color)]/80 hover:bg-[var(--sidebar-gantt-color)] !text-white font-semibold py-2 px-4 rounded-xl transition duration-200 ease-in-out w-full sm:w-auto"
          >
            {t("adset.back")}
          </button>

          {/* Invite People Button - only fully visible to project owner */}
          <button
            onClick={() => isProjectOwner && setIsModalOpen(true)}
            className={`bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)] !text-white font-semibold py-2 px-4 rounded-xl transition duration-200 ease-in-out flex items-center justify-center w-full sm:w-auto ${
              !isProjectOwner ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isProjectOwner}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {t("adset.inv")}
          </button>
        </div>
        
        {/* Owner status indicator */}
        {!isProjectOwner && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
            <span>{t("set.per")}</span>
          </div>
        )}
        
        {/* Invite People Modal */}
        <InvitePeople
            isOpen={isModalOpen && isProjectOwner}
            projectId={projectId}
            onClose={() => setIsModalOpen(false)}
        />

        {/* Search Input */}
        <div className="relative mb-6 bg-[var(--bg-color)] rounded-lg text-[var(--features-title-color)]">
          <Search className="absolute left-3 top-3 text-[var(--features-icon-color)] w-5 h-5" />
          <input
            type="text"
            placeholder={t("adset.search")}
            className="pl-10 pr-4 py-2 border border-[var(--features-icon-color)]/70 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!members.length}
          />
        </div>

        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--gray-card1)] shadow rounded-lg transition-all duration-300 ease-in-out hover:bg-[var(--features-hover-bg)] hover:shadow-lg"
            >
              <div className="flex items-center text-[var(--features-title-color)] space-x-4 mb-4 sm:mb-0">
                {member.avatar ? (
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                        onError={(e) =>
                        {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.style.display = 'none';
                            // This will make the fallback div show instead
                        }}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {getInitial(member.name)}
                    </div>
                )}
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <p className="text-lg font-medium">{member.name}</p>
                    {member.role === "Owner" && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <UserCheck className="w-3 h-3 mr-1" />
                        {t("adset.own")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-color3)]">{member.email}</p>
                  <p className="text-xs text-[var(--features-text-color)]">{t("adset.team2")}: {member.team || "None"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
                {/* Manage Access Button */}
                <button
                  className={`bg-[var(--homepage-text-bright)]/80 !text-white px-3 py-1.5 text-sm rounded-lg transition flex-1 sm:flex-none ${
                    isProjectOwner ? "hover:bg-[var(--homepage-text-bright)]/50" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => isProjectOwner && setSelectedMember(member)}
                  disabled={!isProjectOwner}
                >
                  {t("adset.acc")}
                </button>

                {/* Manage Team Button */}
                <button
                  className={`!text-white bg-[var(--features-icon-color)] px-3 py-1.5 text-sm rounded-lg transition flex-1 sm:flex-none ${
                    isProjectOwner ? "hover:bg-[var(--hover-color)]" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => isProjectOwner && setMemberToManageTeams(member)}
                  disabled={!isProjectOwner}
                >
                  {t("adset.teaman")}
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => isProjectOwner && handleRemoveClick(member)}
                  className={`bg-[var(--bug-report)]/80 !text-white px-3 py-1.5 text-sm rounded-lg flex items-center justify-center transition-all flex-1 sm:flex-none ${
                    isProjectOwner ? "hover:bg-[var(--bug-report)]" : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isProjectOwner}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  {t("adset.rem")}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Modals are conditional based on project ownership */}
        {isProjectOwner && (
          <>
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
                        projectId={projectId}
                    />
                )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdvancedSettings;