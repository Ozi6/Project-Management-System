import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import { FaUsers, FaCogs, FaLightbulb, FaChartBar, FaFolder, FaDatabase, FaServer, FaCode, FaCog, FaDesktop, FaPaintBrush } from "react-icons/fa";
import { MdGroupAdd, MdAssignment, MdWork, MdBuild, MdFolderOpen } from "react-icons/md";
import { IoMdPeople, IoMdSettings } from "react-icons/io";

const iconMap = {
  Users: FaUsers,
  Cog: FaCogs,
  LightBulb: FaLightbulb,
  ChartBar: FaChartBar,
  Folder: FaFolder,
  AddGroup: MdGroupAdd,
  Assignment: MdAssignment,
  Work: MdWork,
  Build: MdBuild,
  FolderOpen: MdFolderOpen,
  People: IoMdPeople,
  Settings: IoMdSettings,
  FaDatabase: FaDatabase,
  FaServer: FaServer,
  FaCode: FaCode,
  FaCog: FaCog,
  FaDesktop: FaDesktop,
  FaPaintBrush: FaPaintBrush 
};

const allIcons = [
  { name: "Users", icon: FaUsers },
  { name: "Cogs", icon: FaCogs },
  { name: "LightBulb", icon: FaLightbulb },
  { name: "ChartBar", icon: FaChartBar },
  { name: "Folder", icon: FaFolder },
  { name: "AddGroup", icon: MdGroupAdd },
  { name: "Assignment", icon: MdAssignment },
  { name: "Work", icon: MdWork },
  { name: "Build", icon: MdBuild },
  { name: "FolderOpen", icon: MdFolderOpen },
  { name: "People", icon: IoMdPeople },
  { name: "Settings", icon: IoMdSettings },
  { name: "Database", icon: FaDatabase },
  { name: "Server", icon: FaServer },
  { name: "Code", icon: FaCode },
  { name: "Cog", icon: FaCog },
  { name: "Desktop", icon: FaDesktop },
  { name: "PaintBrush", icon: FaPaintBrush },
];

// TeamDeleteConfirmation Component
const TeamDeleteConfirmation = ({ teamName, onConfirm, onCancel }) => {
  if (!teamName || typeof teamName !== "string") return null;

  return (
    <AnimatePresence>
      {teamName && (
        <>
          <motion.div
            className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
            style={{ zIndex: 10002 }}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            style={{ zIndex: 10003 }}
          >
            <div className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden">
              <div className="bg-[var(--bug-report)] p-4 shadow-md">
                <h3 className="text-xl font-bold !text-white text-center">Confirm Deletion</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-gray-700 text-center">Are you sure you want to delete the team "{teamName}"?</p>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 !text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[var(--bug-report)]/90 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-32"
                    onClick={() => onConfirm(teamName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ManageTeamsModal = ({ member, teams, onAddToTeam, onEditTeam, onDeleteTeam, onClose }) => {
  const [localMemberTeam, setLocalMemberTeam] = useState(member?.team || "");
  const [localTeams, setLocalTeams] = useState(Array.isArray(teams) ? [...teams] : []);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingTeamName, setEditingTeamName] = useState("");
  const [editingTeamIcon, setEditingTeamIcon] = useState("");
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamIcon, setNewTeamIcon] = useState("Users");
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [showIconMenuForTeamId, setShowIconMenuForTeamId] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const uniqueTeams = Array.isArray(teams) 
      ? teams.map((team, index) => ({
          ...team,
          id: team.id || `${index}-${Date.now()}`
        }))
      : [];
    setLocalTeams(uniqueTeams);
    setLocalMemberTeam(member?.team || "");
  }, [teams, member]);

  useEffect(() => {
    if (editingTeamId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTeamId]);

  const handleEditTeam = (team) => {
    if (editingTeamId === team.id) {
      handleSaveTeam(team);
    } else {
      setEditingTeamId(team.id);
      setEditingTeamName(team.name);
      setEditingTeamIcon(team.icon);
      setShowIconMenuForTeamId(null);
    }
  };

  const handleSaveTeam = (oldTeam) => {
    if (!editingTeamId || !editingTeamName.trim()) return;

    const updatedTeam = {
      id: editingTeamId,
      name: editingTeamName.trim(),
      icon: editingTeamIcon || "Users"
    };

    setLocalTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === editingTeamId ? updatedTeam : team
      )
    );

    onEditTeam(updatedTeam, oldTeam);

    setEditingTeamId(null);
    setEditingTeamName("");
    setEditingTeamIcon("");
    setShowIconMenuForTeamId(null);
  };

  const handleToggleTeam = (teamName) => {
    if (!onAddToTeam || !member || !member.id) return;
    const newTeam = localMemberTeam === teamName ? "" : teamName;
    onAddToTeam(member.id, newTeam);
    setLocalMemberTeam(newTeam);
  };

  const handleDeleteTeam = (teamName) => {
    setTeamToDelete(teamName);
  };

  const handleIconSelect = (iconName) => {
    if (editingTeamId) {
      setEditingTeamIcon(iconName);
    } else if (isAddingTeam) {
      setNewTeamIcon(iconName);
    }
    setShowIconMenuForTeamId(null);
  };

  const handleNameChange = (e) => {
    setEditingTeamName(e.target.value);
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeamName("");
    setEditingTeamIcon("");
    setShowIconMenuForTeamId(null);
  };

  const handleAddTeam = () => {
    if (!onEditTeam || !newTeamName.trim()) return;
    const newTeam = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newTeamName.trim(),
      icon: newTeamIcon
    };
    setLocalTeams(prev => [...prev, newTeam]);
    onEditTeam(newTeam, null);
    setNewTeamName("");
    setNewTeamIcon("Users");
    setIsAddingTeam(false);
  };

  const confirmDeleteTeam = (teamName) => {
    if (!onDeleteTeam || !teamName) return;
    onDeleteTeam(teamName);
    setLocalTeams(prev => prev.filter(team => team.name !== teamName));
    if (localMemberTeam === teamName) setLocalMemberTeam("");
    setTeamToDelete(null);
    setEditingTeamId(null);
  };

  const handleModalClose = () => {
    setEditingTeamId(null);
    setIsAddingTeam(false);
    setTeamToDelete(null);
    setShowIconMenuForTeamId(null);
    onClose();
  };

  if (!member) return null;

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleModalClose}
          style={{ zIndex: 10000 }}
        />
        <motion.div
          key="modal"
          className="fixed inset-0 flex items-center justify-center"
          initial={{ y: "-20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          style={{ zIndex: 10001 }}
        >
          <div className="bg-[var(--bg-color)] rounded-lg w-96 flex flex-col shadow-lg overflow-hidden">
            <div className="bg-[var(--features-icon-color)] p-4 shadow-md">
              <h3 className="text-xl font-bold text-white text-center">
                Manage Teams for {member?.name || "Unknown"}
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {localTeams.map((team) => (
                <div 
                  key={team.id} 
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-gray-700 transition-all duration-200 hover:bg-[var(--features-icon-color)]/20"
                >
                  {editingTeamId === team.id ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 relative">
                        <button
                          onClick={() => setShowIconMenuForTeamId(team.id)}
                          className="border p-1 rounded hover:bg-gray-200"
                        >
                          {React.createElement(iconMap[editingTeamIcon] || FaUsers, { className: "h-5 w-5 text-gray-700" })}
                        </button>
                        {showIconMenuForTeamId === team.id && (
                          <div className="absolute top-10 left-0 bg-white border shadow-lg grid grid-cols-5 gap-2 p-2 z-10">
                            {allIcons.map(({ name, icon: Icon }) => (
                              <button 
                                key={name} 
                                onClick={() => handleIconSelect(name)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Icon className="h-5 w-5 text-gray-700" />
                              </button>
                            ))}
                          </div>
                        )}
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingTeamName}
                          onChange={handleNameChange}
                          className="border p-1 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveTeam(team)}
                        />
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localMemberTeam === team.name}
                            onChange={() => handleToggleTeam(team.name)}
                            className="hidden"
                          />
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                            localMemberTeam === team.name ? "bg-[var(--features-icon-color)]/50 border-[var(--features-icon-color)]/70" : "bg-white border-gray-300 hover:border-gray-500"
                          }`}>
                            {localMemberTeam === team.name && <Check size={16} className="text-white" />}
                          </span>
                        </label>
                      </div>
                      <div className="flex justify-between gap-2">
                        <button 
                          onClick={() => handleSaveTeam(team)} 
                          className="bg-[var(--features-icon-color)]/60 !text-white px-2 py-1 rounded hover:bg-[var(--features-icon-color)] flex-1 transition-all duration-200"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(team.name)} 
                          className="bg-[var(--bug-report)]/90 !text-white px-2 py-1 rounded hover:bg-[var(--bug-report)] flex-1 transition-all duration-200"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          className="bg-gray-500 !text-white px-2 py-1 rounded hover:bg-gray-600 flex-1 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2">
                          {React.createElement(iconMap[team.icon] || FaUsers, { className: "h-5 w-5 text-gray-700" })}
                          <span className="text-gray-800 font-medium">{team.name}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="border p-1 rounded bg-[var(--features-icon-color)]/50 hover:bg-[var(--features-icon-color)]/50 text-gray-700 transition-all duration-200"
                        >
                          <Pencil size={18} />
                        </button>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localMemberTeam === team.name}
                            onChange={() => handleToggleTeam(team.name)}
                            className="hidden"
                          />
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                            localMemberTeam === team.name ? "bg-[var(--features-icon-color)]/50 border-[var(--features-icon-color)]/70" : "bg-white border-gray-300 hover:border-gray-500"
                          }`}>
                            {localMemberTeam === team.name && <Check size={16} className="text-white" />}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isAddingTeam && (
                <div className="flex flex-col gap-2 p-2 border-b bg-[var(--features-icon-color)]/10 rounded">
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => setShowIconMenuForTeamId("new")}
                      className="border p-1 rounded hover:bg-gray-200"
                    >
                      {React.createElement(iconMap[newTeamIcon] || FaUsers, { className: "h-5 w-5 text-gray-700" })}
                    </button>
                    {showIconMenuForTeamId === "new" && (
                      <div className="absolute top-10 left-0 bg-white border shadow-lg grid grid-cols-5 gap-2 p-2 z-10">
                        {allIcons.map(({ name, icon: Icon }) => (
                          <button 
                            key={name} 
                            onClick={() => handleIconSelect(name)}
                            className="p-1 hover:bg-[var(--features-icon-color)]/10 rounded"
                          >
                            <Icon className="h-5 w-5 text-gray-700" />
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="border p-1 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                      placeholder="New team name"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button 
                      onClick={handleAddTeam} 
                      className="bg-[var(--features-icon-color)]/50 !text-white px-2 py-1 rounded hover:bg-[var(--features-icon-color)]/70 transition-all duration-200"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setIsAddingTeam(false)} 
                      className="bg-gray-500 !text-white px-2 py-1 rounded hover:bg-gray-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-between">
              <button 
                onClick={() => setIsAddingTeam(true)}
                className="bg-[var(--features-icon-color)] !text-white px-4 py-2 rounded hover:bg-[var(--hover-color)] transition-all duration-200"
              >
                Add Team
              </button>
              <button 
                onClick={handleModalClose} 
                className="bg-[var(--features-icon-color)]/50 !text-white px-4 py-2 rounded hover:bg-[var(--features-icon-color)]/70 transition-all duration-200"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <TeamDeleteConfirmation
        teamName={teamToDelete}
        onConfirm={confirmDeleteTeam}
        onCancel={() => setTeamToDelete(null)}
      />
    </>
  );
};
export default ManageTeamsModal;