import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Edit2,
  Users,
  Rocket,
  Lightbulb,
  Wrench,
  Paintbrush,
  BarChart,
} from "lucide-react";

// Map of icon names to Lucide components
const iconMap = {
  Users: Users,
  Rocket: Rocket,
  Lightbulb: Lightbulb,
  Wrench: Wrench,
  Paintbrush: Paintbrush,
  BarChart: BarChart,
};

// Confirmation Modal for Team Deletion
const TeamDeleteConfirmation = ({ teamName, onConfirm, onCancel }) => {
  // Check if teamName is valid
  if (!teamName || typeof teamName !== "string") {
    console.warn("Invalid teamName in TeamDeleteConfirmation");
    return null;
  }

  return (
    <AnimatePresence mode="sync">
      {teamName && (
        <>
          <motion.div
            className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
            style={{ zIndex: 60 }}
          />
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 70 }}
          >
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
                  Confirm Deletion
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-gray-700 text-center">
                  Are you sure you want to delete the team "{teamName}"?
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={onCancel}
                    disabled={!teamName}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all duration-200 hover:scale-105 w-32"
                    onClick={() => onConfirm(teamName)}
                    disabled={!teamName}
                  >
                    Delete
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

const ManageTeamsModal = ({
  member,
  teams,
  onAddToTeam,
  onEditTeam,
  onDeleteTeam,
  onClose,
}) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamIcon, setNewTeamIcon] = useState("Users");
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [localMemberTeam, setLocalMemberTeam] = useState(member?.team || ""); // Local state to track team
  const [localTeams, setLocalTeams] = useState([]); // Local state for teams, initialized empty

  const modalRef = useRef(null); // Ref to track the modal element
  const editInputRef = useRef(null); // Ref to track the editing input for focus management

  // Memoize localTeams to prevent unnecessary re-renders
  const memoizedLocalTeams = useCallback(() => localTeams, [localTeams]);

  // Sync local states with props, ensuring consistent updates with safeguards
  useEffect(() => {
    setLocalMemberTeam(member?.team || "");
    console.log("Member team updated:", member?.team);
  }, [member]);

  useEffect(() => {
    setLocalTeams(Array.isArray(teams) ? [...(teams || [])] : []); // Handle undefined teams
    console.log("Teams prop updated:", teams);
  }, [teams]);

  // Debugging logs for state updates, including teams and input value
  // useEffect(() => {
  //   console.log("ManageTeamsModal rendered with:", {
  //     member,
  //     teams: Array.isArray(teams) ? teams : [],
  //     editingTeam,
  //     localMemberTeam,
  //     localTeams: memoizedLocalTeams(),
  //   });
  //   if (editingTeam) {
  //     console.log("Current editingTeam (including name):", {
  //       name: editingTeam.name,
  //       icon: editingTeam.icon,
  //     });
  //   }
  // }, [member, teams, editingTeam, localMemberTeam, memoizedLocalTeams]);

  const icons = [
    "Users",
    "Rocket",
    "Lightbulb",
    "Wrench",
    "Paintbrush",
    "BarChart",
  ];

  const handleAddTeam = () => {
    if (!onEditTeam || !newTeamName.trim()) {
      console.warn("Cannot add team: onEditTeam or newTeamName invalid");
      return;
    }
    onEditTeam({ name: newTeamName.trim(), icon: newTeamIcon }, null);
    setNewTeamName("");
    setNewTeamIcon("Users");
    setIsAddingTeam(false);
  };

  const handleEditTeam = (team) => {
    if (!onEditTeam || !team || !team.name) {
      console.warn("Cannot edit team: onEditTeam, team, or team.name invalid");
      return;
    }
    if (editingTeam && editingTeam.name === team.name) {
      if (!editingTeam.name.trim()) {
        alert("Team name cannot be empty.");
        return;
      }
      console.log("Saving edited team:", editingTeam);
      const updatedTeam = { ...editingTeam, name: editingTeam.name.trim() };
      onEditTeam(updatedTeam, team); // Update existing team in AdvancedSettings
      // Update localTeams for immediate UI feedback and force re-render
      const updatedLocalTeams = localTeams.map((t) =>
        t.name === team.name ? updatedTeam : t
      );
      setLocalTeams(updatedLocalTeams);
      console.log("Updated localTeams in modal:", updatedLocalTeams);
      setEditingTeam(null); // Reset editing state, but keep modal open
      if (editInputRef.current) editInputRef.current.blur(); // Optionally blur input after save
    } else {
      setEditingTeam({
        ...team,
        name: team.name || "",
        icon: team.icon || "Users",
      }); // Start editing with current values
      // Focus the input when starting to edit
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  };

  const handleNameChange = (e) => {
    setEditingTeam((prev) => ({
      ...prev,
      name: e.target.value,
    }));
    console.log("Editing team name change (input value):", e.target.value); // Debug input value
  };

  const handleIconChange = (e) => {
    setEditingTeam((prev) => ({
      ...prev,
      icon: e.target.value,
    }));
    console.log("Editing team icon change:", e.target.value); // Debug icon change
  };

  const isMemberInTeam = (teamName) => localMemberTeam === teamName; // Use local state for UI consistency

  const toggleTeamSelection = (teamName) => {
    if (!onAddToTeam || !member || !member.id) {
      console.warn(
        "Cannot toggle team: onAddToTeam, member, or member.id invalid"
      );
      return;
    }
    const newTeam = localMemberTeam === teamName ? "" : teamName;
    console.log(
      "Toggling team for member:",
      member.id,
      "from:",
      localMemberTeam,
      "to:",
      newTeam
    );
    onAddToTeam(member.id, newTeam);
    setLocalMemberTeam(newTeam); // Update local state immediately for UI
  };

  const confirmDeleteTeam = (teamName) => {
    if (!onDeleteTeam || !teamName) {
      console.warn("Cannot delete team: onDeleteTeam or teamName invalid");
      return;
    }
    onDeleteTeam(teamName);
    setTeamToDelete(null);
  };

  // Handle key press events only for Save/Cancel within the modal, preventing unintended closures
  const handleKeyDown = useCallback(
    (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        e.stopPropagation(); // Prevent key events from affecting other elements
        e.preventDefault(); // Prevent default key behavior (e.g., form submission, navigation)
        if (e.key === "Enter" && (editingTeam || isAddingTeam)) {
          if (editingTeam) handleEditTeam(editingTeam); // Save edited team
          if (isAddingTeam) handleAddTeam(); // Save new team
        } else if (e.key === "Escape" && (editingTeam || isAddingTeam)) {
          setEditingTeam(null); // Cancel editing team
          setIsAddingTeam(false); // Cancel adding new team
        }
        // Do not close the modal or reset states on any other key presses
      }
    },
    [editingTeam, isAddingTeam]
  );

  // Add keydown listener only when modal is active (member exists), but prevent modal close
  useEffect(() => {
    if (member) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, handleKeyDown]);

  // Explicitly manage modal close only via buttons, not blur or keyboard
  const handleModalClose = () => {
    setEditingTeam(null); // Reset editing state
    setIsAddingTeam(false); // Reset adding state
    setTeamToDelete(null); // Reset deletion state
    onClose(); // Trigger onClose prop only when user clicks Close button
  };

  // Prevent input blur from closing editing mode
  const handleInputBlur = (e) => {
    e.stopPropagation(); // Prevent blur from closing modal
    e.preventDefault(); // Prevent default blur behavior
    // Do not reset editingTeam here; keep editing mode open unless explicitly canceled
    console.log("Input blurred, keeping editing mode open");
    if (!e.target.value.trim() && editingTeam) {
      alert("Team name cannot be empty.");
      e.target.focus(); // Keep focus to correct the empty input
    }
  };

  // Early return outside AnimatePresence (after all Hooks)
  if (!member) {
    console.log("Member is null, skipping render");
    return null;
  }

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
          onClick={(e) => {
            e.stopPropagation(); // Prevent backdrop click from closing modal
            e.preventDefault(); // Prevent default click behavior
          }}
          style={{ zIndex: 10000 }} // High z-index to cover roles dropdown
        />
        <motion.div
          key="modal"
          ref={modalRef} // Attach ref to the modal container for key event handling
          className="fixed inset-0 flex items-center justify-center"
          initial={{ y: "-20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          style={{ zIndex: 10001 }} // High z-index to cover roles dropdown
          onKeyDown={(e) => {
            e.stopPropagation(); // Prevent key events from bubbling up
            e.preventDefault(); // Prevent default key behavior
          }}
        >
          <div className="bg-white rounded-md w-96 flex flex-col shadow-lg overflow-hidden">
            <div className="bg-blue-500 p-4 shadow-md">
              <h3 className="text-xl font-bold text-white text-center">
                Manage Teams for {member.name || "Unknown"}
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {localTeams.length > 0 ? (
                  localTeams.map((team, index) => (
                    <div
                      key={`${
                        team.name
                      }-${index}-${Date.now()}-${Math.random()}`} // Highly unique key to force re-render
                      className="flex items-center justify-between p-2 border-b"
                    >
                      {editingTeam && editingTeam.name === team.name ? (
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <input
                              ref={editInputRef} // Attach ref to the input for focus management
                              type="text"
                              value={editingTeam?.name || ""} // Ensure value is correctly bound
                              onChange={handleNameChange}
                              className="border p-1 bg-red-400 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter team name"
                              onBlur={handleInputBlur} // Handle blur without closing
                              onKeyDown={(e) => {
                                e.stopPropagation(); // Prevent key events from bubbling up
                                e.preventDefault(); // Prevent default key behavior
                              }}
                            />
                            <select
                              value={editingTeam?.icon || "Users"}
                              onChange={handleIconChange}
                              className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                e.stopPropagation(); // Prevent key events from bubbling up
                                e.preventDefault(); // Prevent default key behavior
                              }}
                            >
                              {icons.map((icon) => (
                                <option key={icon} value={icon}>
                                  {icon}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex justify-between">
                            <button
                              onClick={() => handleEditTeam(team)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setTeamToDelete(team.name)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setEditingTeam(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center">
                              {iconMap[team.icon] &&
                                React.createElement(iconMap[team.icon], {
                                  size: 20,
                                })}
                            </div>
                            <span>{team.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleTeamSelection(team.name)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                isMemberInTeam(localTeams[index]?.name)
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300"
                              }`}
                            >
                              {isMemberInTeam(localTeams[index]?.name) && (
                                <Check size={12} />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditTeam(localTeams[index])}
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>No teams available.</div>
                )}
              </div>
            </div>
            <div className="flex justify-between px-4 pb-4">
              {isAddingTeam ? (
                <div className="flex flex-col gap-2 w-3/4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="New team name"
                      className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onBlur={(e) => {
                        e.stopPropagation(); // Prevent blur from closing modal
                        e.preventDefault(); // Prevent default blur behavior
                        if (!e.target.value.trim()) {
                          alert("Team name cannot be empty.");
                          e.target.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation(); // Prevent key events from bubbling up
                        e.preventDefault(); // Prevent default key behavior
                      }}
                    />
                    <select
                      value={newTeamIcon}
                      onChange={(e) => setNewTeamIcon(e.target.value)}
                      className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        e.stopPropagation(); // Prevent key events from bubbling up
                        e.preventDefault(); // Prevent default key behavior
                      }}
                    >
                      {icons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleAddTeam}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingTeam(false)}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTeam(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Team
                </button>
              )}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleModalClose}
              >
                Close
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
