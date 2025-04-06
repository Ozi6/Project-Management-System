    import { useState } from "react";
    import { motion } from "framer-motion";
    import PropTypes from "prop-types";
    import ListEntryEditPopup from "./ListEntryEditPopup";
    import ListEntryAssignPopup from "./ListEntryAssignPopup";
    import { useTranslation } from "react-i18next";

const ListEntryPopup = ({ entry, onClose, onEdit, onDelete, onAssign, teams, users }) =>
{
    const {t} = useTranslation();
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleEditClick = () =>
    {
        setShowEditPopup(true);
    };

    const handleSaveEdit = async (updatedEntry) =>
    {
        setIsProcessing(true);
        try{
            await onEdit(updatedEntry);
            setShowEditPopup(false);
        }catch(error){
            console.error("Failed to update entry:", error);
        }finally{
            setIsProcessing(false);
        }
    };

    const handleAssignClicked = () =>
    {
            setShowAssignPopup(true);
        };

    const handleAssign = (assignData) =>
    {
        const updatedEntry = {
            ...entry,
            assignedTeams: assignData.assignedTeams,
            assignedUsers: assignData.assignedUsers
        };
        onAssign(updatedEntry);
        setShowAssignPopup(false);
    };

    return(
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-0 left-full ml-2 w-48 bg-[var(--bg-color)] shadow-lg rounded-md border border-gray-200 overflow-hidden z-40">
                <div className="max-h-40 overflow-y-auto">
                    <button
                        onClick={handleEditClick}
                        className="w-full px-4 py-2 text-left hover:bg-[var(--features-icon-color)]/10 transition-colors duration-200">
                        {t("prode.edit")}
                    </button>
                    {onAssign && (
                        <button
                            onClick={handleAssignClicked}
                            className="w-full px-4 py-2 text-left hover:bg-[var(--features-icon-color)]/10 transition-colors duration-200">
                            {t("prode.ass")}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(entry.entryId)}
                            className="w-full px-4 py-2 text-left bg-[var(--bg-color)] hover:bg-[var(--features-icon-color)]/10 transition-colors duration-200 !text-[var(--bug-report)]">
                            {t("prode.delete")}
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
        profilePicture: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    })).isRequired,
};

export default ListEntryPopup;