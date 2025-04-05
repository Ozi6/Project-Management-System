import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ListEntryAssignPopup = ({ entry, onAssign, onClose, teams, users }) =>
{
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        assignedTeams: entry.assignedTeams || [],
        assignedUsers: entry.assignedUsers || []
    });
    
    const assignedTeamIds = formData.assignedTeams.map(team => team.id);
    const assignedUserIds = formData.assignedUsers.map(user => user.userId);
    
    const [availableTeams, setAvailableTeams] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() =>
    {
        setAvailableTeams(teams.filter(team => !assignedTeamIds.includes(team.id)));
        setAvailableUsers(users.filter(user => !assignedUserIds.includes(user.userId)));
    }, [teams, users, assignedTeamIds, assignedUserIds]);

    const addTeam = (teamId) =>
    {
        const teamToAdd = teams.find(t => t.id === teamId);
        if(teamToAdd && !assignedTeamIds.includes(teamId))
        {
            setFormData(prev => ({
                ...prev,
                assignedTeams: [...prev.assignedTeams, teamToAdd]
            }));
        }
    };

    const removeTeam = (teamId) =>
    {
        setFormData(prev => ({
            ...prev,
            assignedTeams: prev.assignedTeams.filter(team => team.id !== teamId)
        }));
    };

    const addUser = (userId) =>
    {
        const userToAdd = users.find(u => u.userId === userId);
        if (userToAdd && !assignedUserIds.includes(userId)) {
            setFormData(prev => ({
                ...prev,
                assignedUsers: [...prev.assignedUsers, userToAdd]
            }));
        }
    };

    const removeUser = (userId) =>
    {
        setFormData(prev => ({
            ...prev,
            assignedUsers: prev.assignedUsers.filter(user => user.userId !== userId)
        }));
    };

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        console.log("Submitting assignment data:", formData);
        
        onAssign(formData);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
            //onClick={onClose}
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[var(--features-icon-color)] text-white rounded-t-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t("prode.ass.tit")}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-[var(--bg-color)] rounded-full hover:bg-[var(--hover-color)] transition-colors duration-200 transform hover:scale-110"
                        >
                            <FaTimes className="text-[var(--features-icon-color)] hover:text-white treansition-colors duration-200" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 bg-[var(--bg-color)]">
                    <div className="mb-4 flex">
                        <div className="w-1/2 pr-2">
                            <label className="block text-[var(--features-title-color)] text-sm font-medium mb-2">
                            {t("prode.ass.1")}
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {formData.assignedTeams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="flex justify-between items-center bg-[var(--features-icon-color)]/20 text-[var(--features-text-color)] px-2 py-1 mb-1 rounded text-sm"
                                    >
                                        {team.teamName}
                                        <button
                                            type="button"
                                            onClick={() => removeTeam(team.id)}
                                            className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <div className="w-1/2 pl-2">
                            <label className="block text-[var(--features-title-color)] text-sm font-medium mb-2">
                            {t("prode.ass.2")}
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {availableTeams.map((z) => (
                                    <div
                                        key={z.id}
                                        className="flex justify-between items-center px-2 py-1 mb-1 bg-[var(--features-icon-color)]/20 text-[var(--features-text-color)] rounded text-sm"
                                    >
                                        {z.teamName}
                                        <button
                                            type="button"
                                            onClick={() => addTeam(z.id)}
                                            className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]"
                                        >
                                            {t("prode.ass.add")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex">
                        <div className="w-1/2 pr-2">
                            <label className="block text-[var(--features-title-color)] text-sm font-medium mb-2">
                            {t("prode.ass.3")}
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {formData.assignedUsers.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="flex justify-between items-center bg-green-100 text-green-800 px-2 py-1 mb-1 rounded text-sm"
                                    >
                                        {user.username}
                                        <button
                                            type="button"
                                            onClick={() => removeUser(user.userId)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-px bg-[var(--gray-card3)] mx-2"></div>
                        {/* Available Users */}
                        <div className="w-1/2 pl-2">
                            <label className="block text-[var(--features-title-color)] text-sm font-medium mb-2">
                                {t("prode.ass.4")}
                            </label>
                            <div className="max-h-40 overflow-y-auto">
                                {availableUsers.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="flex justify-between items-center px-2 py-1 mb-1 text-[var(--features-text-color)] bg-[var(--features-icon-color)]/10 rounded text-sm"
                                    >
                                        {user.username}
                                        <button
                                            type="button"
                                            onClick={() => addUser(user.userId)}
                                            className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]"
                                        >
                                            {t("prode.ass.add")}
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
                            className="px-4 py-2 border border-gray-300 rounded-md text-[var(--features-title-color)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {t("prode.can")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--features-icon-color)] !text-white rounded-md hover:bg-[var(--hover-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {t("prode.ass.ass")}
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
                teamIcon: PropTypes.elementType,
            })
        ),
        assignedUsers: PropTypes.arrayOf(
            PropTypes.shape({
                userId: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
                profilePicture: PropTypes.elementType,
            })
        ),
    }),
    onAssign: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            teamName: PropTypes.string.isRequired,
            teamIcon: PropTypes.elementType,
        })
    ).isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            profilePicture: PropTypes.elementType,
        })
    ).isRequired,
};

export default ListEntryAssignPopup;