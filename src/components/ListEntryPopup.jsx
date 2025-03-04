import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import ListEntryEditPopup from "./ListEntryEditPopup";
import ListEntryAssignPopup from "./ListEntryAssignPopup";

const ListEntryPopup = ({ entry, onClose, onEdit, onDelete, onAssign, teams, users}) => {
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAssignPopup, setShowAssignPopup] = useState(false);

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleSaveEdit = (updatedEntry) =>
    {
        onEdit(updatedEntry);
        setShowEditPopup(false);
    };

    const handleAssignClicked = () => {
        setShowAssignPopup(true);
    };

    const handleAssign = (newUsers, newTeams) => {
        onAssign(newUsers, newTeams);
        setShowAssignPopup(false);
    };

    return(
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-0 left-full ml-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden z-40">
                <div className="max-h-40 overflow-y-auto">
                    <button
                        onClick={handleEditClick}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200">
                        Edit
                    </button>
                    {onAssign && (
                        <button
                            onClick={handleAssignClicked}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200">
                            Assign
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(entry.entryId)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200 text-red-500">
                            Delete
                        </button>
                    )}
                </div>
            </motion.div>

            {showEditPopup && (
                <ListEntryEditPopup
                    entry={entry}
                    onSave={handleSaveEdit}
                    onClose={() => setShowEditPopup(false)}/>
            )}
            {showAssignPopup && (
                <ListEntryAssignPopup
                    entry={entry}
                    onAssign={handleAssign}
                    onClose={() => setShowAssignPopup(false)}
                    teams={teams}
                    users={users}/>
            )}
        </>
    );
};

ListEntryPopup.propTypes = {
    entry: PropTypes.shape({
        text: PropTypes.string.isRequired,
        checked: PropTypes.bool,
        dueDate: PropTypes.instanceOf(Date),
        warningThreshold: PropTypes.number,
        entryId: PropTypes.string.isRequired,
        assignedUsers: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            profilePicture: PropTypes.elementType,
        })).isRequired,
        assignedTeams: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            teamIcon: PropTypes.elementType,
        })).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onAssign: PropTypes.func,
    teams: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            teamName: PropTypes.string.isRequired,
            teamIcon: PropTypes.elementType,
        })).isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        profilePicture: PropTypes.elementType,
    })).isRequired,
};

export default ListEntryPopup;