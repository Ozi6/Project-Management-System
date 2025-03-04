import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

const ListEntryAssignPopup = ({ entry, onAssign, onClose, teams, users }) => {
    const [formData, setFormData] = useState({
        assignedTeams: entry ? entry.assignedTeams || [] : [],
        assignedUsers: entry ? entry.assignedUsers || [] : [],
    });
    const [availableTeams, setAvailableTeams] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        setAvailableTeams(teams.filter(team => !formData.assignedTeams.includes(team.id)));
        setAvailableUsers(users.filter(user => !formData.assignedUsers.includes(user.id)));
    }, [teams, users, formData.assignedTeams, formData.assignedUsers]);

    const addTeam = (teamId) => {
        setFormData((prev) => ({
            ...prev,
            assignedTeams: prev.assignedTeams.includes(teamId)
                ? prev.assignedTeams
                : [...prev.assignedTeams, teamId],
        }));
    };

    const removeTeam = (teamId) => {
        setFormData((prev) => ({
            ...prev,
            assignedTeams: prev.assignedTeams.filter((team) => team !== teamId),
        }));
    };

    const addUser = (userId) => {
        setFormData((prev) => ({
            ...prev,
            assignedUsers: prev.assignedUsers.includes(userId)
                ? prev.assignedUsers
                : [...prev.assignedUsers, userId],
        }));
    };

    const removeUser = (userId) => {
        setFormData((prev) => ({
            ...prev,
            assignedUsers: prev.assignedUsers.filter((user) => user !== userId),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign(formData.assignedUsers, formData.assignedTeams);
        onClose();
    };

    useEffect(() => {
        console.log("all teams: ", teams);
        console.log("available teams: ", availableTeams);
        console.log("assigned teams: ", formData.assignedTeams);
    }, [teams, formData.assignedTeams, availableTeams]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-blue-500 text-white rounded-t-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Assign Task</h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                        >
                            <FaTimes className="text-white" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4 flex">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Assigned Teams
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {formData.assignedTeams.map((teamId) => {
                                    const team = teams.find((t) => t.id === teamId);
                                    return team ? (
                                        <div
                                            key={teamId}
                                            className="flex justify-between items-center bg-blue-100 text-blue-800 px-2 py-1 mb-1 rounded text-sm"
                                        >
                                            {team.teamName}
                                            <button
                                                type="button"
                                                onClick={() => removeTeam(teamId)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Available Teams
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {availableTeams.map((z) => (
                                    <div
                                        key={z.id}
                                        className="flex justify-between items-center px-2 py-1 mb-1 bg-gray-100 rounded text-sm"
                                    >
                                        {z.teamName}
                                        <button
                                            type="button"
                                            onClick={() => addTeam(z.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Assigned Users
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {formData.assignedUsers.map((userId) => {
                                    const user = users.find((u) => u.id === userId);
                                    return user ? (
                                        <div
                                            key={userId}
                                            className="flex justify-between items-center bg-green-100 text-green-800 px-2 py-1 mb-1 rounded text-sm"
                                        >
                                            {user.name}
                                            <button
                                                type="button"
                                                onClick={() => removeUser(userId)}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        {/* Available Users */}
                        <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Available Users
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {availableUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex justify-between items-center px-2 py-1 mb-1 bg-gray-100 rounded text-sm"
                                    >
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => addUser(user.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Assign Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

ListEntryAssignPopup.propTypes = {
    entry: PropTypes.shape({
        text: PropTypes.string,
        dueDate: PropTypes.instanceOf(Date),
        warningThreshold: PropTypes.number,
        checked: PropTypes.bool,
        entryId: PropTypes.string,
        file: PropTypes.instanceOf(File),
        assignedTeams: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                teamName: PropTypes.string.isRequired,
            })
        ),
        assignedUsers: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                teamName: PropTypes.string.isRequired,
            })
        ),
    }),
    onAssign: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            teamName: PropTypes.string.isRequired,
        })
    ).isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ListEntryAssignPopup;