import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import AnimatedCheckbox from "./AnimatedCheckbox";
import { AnimatePresence } from "framer-motion";
import ListEntryPopup from "./ListEntryPopup";
import { FaExclamationCircle, FaPaperclip } from "react-icons/fa"; // Import an icon library for the red exclamation mark
import { Teams, Users } from './TeamAndUsersTest';

const ListEntry = ({
    text,
    dueDate,
    warningThreshold,
    assignedUsers = [],
    assignedTeams = [],
    checked,
    onCheckChange,
    onTextChange,
    onDueDateChange,
    onWarningThresholdChange,
    onAssign,
    isNew,
    isSelected,
    onClick,
    entryId,
    onDragStart,
    onDragEnd,
    onDrop,
    isDragging,
    isDraggedOver,
    dragPosition,
    file,
    onFileChange,
    onDelete,
}) => {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isDraggingThis, setIsDraggingThis] = useState(false);
    const entryRef = useRef(null);
    const dragImageRef = useRef(null);
    const mouseOffsetX = useRef(0);
    const mouseOffsetY = useRef(0);
    const isDragOperation = useRef(false);

    const isDueSoon = !checked && dueDate && new Date(dueDate) - new Date() <= warningThreshold * 24 * 60 * 60 * 1000;

    const handleClick = (e) => {
        if (!isDragOperation.current) {
            onClick(entryId);
        }
    };

    const handleCheckboxChange = (newChecked, e) => {
        if (e) {
            e.stopPropagation();
        }

        onCheckChange(newChecked);
        setHasInteracted(true);
    };

    const handleDownload = (e) =>
    {
        e.stopPropagation();

        if(file)
        {
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL);
        }
    };

    const handleMouseDown = (e) => {
        let target = e.target;
        while (target && target !== entryRef.current) {
            if (target.classList.contains('checkbox-container') ||
                target.closest('.checkbox-container')) {
                return;
            }
            target = target.parentElement;
        }

        if (e.button !== 0)
            return;

        isDragOperation.current = false;

        const rect = entryRef.current.getBoundingClientRect();
        mouseOffsetX.current = e.clientX - rect.left;
        mouseOffsetY.current = e.clientY - rect.top;

        let dragStarted = false;

        const startDrag = () => {
            if (!dragStarted) {
                dragStarted = true;
                isDragOperation.current = true;
                setIsDraggingThis(true);
                onDragStart(entryId, text);
                document.addEventListener('mousemove', handleMouseMove);
                document.body.classList.add('dragging');
            }
        };

        const dragTimeout = setTimeout(() => {
            startDrag();
        }, 150);

        const handleMouseMoveStart = (moveEvent) => {
            if (!dragStarted) {
                const dx = moveEvent.clientX - e.clientX;
                const dy = moveEvent.clientY - e.clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 5) {
                    clearTimeout(dragTimeout);
                    startDrag();
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMoveStart);

        const handleMouseUp = () => {
            clearTimeout(dragTimeout);
            document.removeEventListener('mousemove', handleMouseMoveStart);

            if (dragStarted) {
                setIsDraggingThis(false);
                onDragEnd();
                document.removeEventListener('mousemove', handleMouseMove);
                document.body.classList.remove('dragging');
            } else {
                isDragOperation.current = false;
            }

            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (dragImageRef.current)
        {
            dragImageRef.current.style.left = `${(e.clientX - mouseOffsetX.current)}px`;
            dragImageRef.current.style.top = `${(e.clientY - mouseOffsetY.current)}px`;
        }
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.body.classList.remove('dragging');
        };
    }, []);

    return (
        <div className="relative">
            <div
                ref={entryRef}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                className={`p-2 shadow rounded-md border border-gray-300 flex flex-col gap-2 transition-all duration-300 ease-out cursor-grab 
            ${isDueSoon ? "border-red-500 border-2" : "border-gray-300"}
            ${isNew ? "animate-entryAppear" : ""} 
            ${isSelected ? "bg-blue-400 border-blue-300" : "bg-white hover:scale-105 hover:shadow-lg"}
            ${isDraggingThis ? "opacity-20" : ""}
            ${isDraggedOver ? (dragPosition === 'above' ? "border-t-4 border-t-dashed border-t-blue-500 mt-4" : dragPosition === 'below' ? "border-b-4 border-b-dashed border-b-blue-500 mb-4" : "") : ""}`}
            >
                <div className="flex items-center gap-2">
                    <div className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                        <AnimatedCheckbox
                            checked={checked}
                            onChange={handleCheckboxChange} />
                    </div>
                    <span className="relative overflow-hidden">
                        <span
                            className={`absolute inset-0 bg-gray-400 h-0.5 top-1/2 transform -translate-y-1/2 ${checked ? "animate-cross-out" : (hasInteracted ? "animate-uncross-out" : "w-0")}`} />
                        <span
                            className={`transition-all duration-300 ease-out select-none ${isSelected ? (checked ? "text-gray-200" : "text-white") : (checked ? "text-gray-400" : "text-black")}`}>
                            {text}
                        </span>
                    </span>
                </div>
                {dueDate && (
                    <div className="flex items-center gap-2">
                        {isDueSoon && <FaExclamationCircle className="text-red-500" />}
                        <span className={`text-sm ${isDueSoon ? "text-red-500" : "text-gray-500"}`}>
                            {new Date(dueDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
                {(assignedUsers.length > 0 || assignedTeams.length > 0) && (
                    <div className="flex items-center gap-2 mt-1">
                        {assignedTeams.map((team) => {
                            const TeamIcon = team.teamIcon;
                            return (
                                <div
                                    key={team.id}
                                    className="tooltip"
                                    title={team.teamName || 'Unnamed Team'}
                                >
                                    {TeamIcon && <TeamIcon className="text-gray-600 w-4 h-4" />}
                                </div>
                            );
                        })}
                        {assignedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold tooltip"
                                title={user.name || 'Unknown User'}
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name || 'User'}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    (user.name || '??').split(' ').map(n => n[0]).join('').substring(0, 2)
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* Display the file if it exists */}
                {file && (
                    <div className="flex items-center gap-2">
                        <FaPaperclip
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                            onClick={handleDownload}
                            title={`Download ${file.name}`}
                        />
                        <span className="text-sm text-gray-500">
                            {file.name.length > 15
                                ? (() => {
                                    const lastDotIndex = file.name.lastIndexOf(".");
                                    if (lastDotIndex !== -1) {
                                        const namePart = file.name.substring(0, lastDotIndex);
                                        const extPart = file.name.substring(lastDotIndex);
                                        return namePart.length + extPart.length > 15
                                            ? namePart.substring(0, 15 - extPart.length) + "..." + extPart
                                            : file.name;
                                    }
                                    return file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name;
                                })()
                                : file.name}
                        </span>
                    </div>
                )}
            </div>

            {isDraggingThis && (
                <div
                    ref={dragImageRef}
                    className="fixed z-50 p-2 shadow rounded-md border border-blue-500 bg-blue-100 flex items-center gap-2 pointer-events-none"
                    style={{
                        width: entryRef.current ? `${entryRef.current.offsetWidth}px` : 'auto',
                        opacity: 0.8
                    }}
                >
                    <AnimatedCheckbox checked={checked} onChange={() => { }} />
                    <span>{text}</span>
                </div>
            )}

            <AnimatePresence>
                {isSelected && (
                    <ListEntryPopup
                        entry={{
                            text,
                            checked,
                            dueDate,
                            warningThreshold,
                            entryId,
                            file,
                            assignedTeams,
                            assignedUsers
                        }}
                        onClose={() => onClick(null)}
                        onEdit={(updatedEntry) => {
                            onCheckChange(updatedEntry.checked);

                            if (updatedEntry.text !== text) {
                                onTextChange(updatedEntry.text);
                            }

                            if (updatedEntry.dueDate !== dueDate) {
                                onDueDateChange(updatedEntry.dueDate);
                            }

                            if (updatedEntry.warningThreshold !== warningThreshold) {
                                onWarningThresholdChange(updatedEntry.warningThreshold);
                            }

                            if (updatedEntry.file !== file) {
                                onFileChange(updatedEntry.file);
                            }

                            onClick(null);
                        }}
                        onDelete={(id) => {
                            if (onDelete)
                                onDelete(id);
                            onClick(null);
                        }}
                        onAssign={(updatedEntry) => {
                            if (onAssign && (updatedEntry.assignedTeams !== assignedTeams || updatedEntry.assignedUsers !== assignedUsers)) {
                                onAssign(
                                    updatedEntry.assignedUsers || [],
                                    updatedEntry.assignedTeams || []
                                );
                            }
                            onClick(null);
                        }}
                        teams={Teams}
                        users={Users}
                    />
                )}
            </AnimatePresence>

            <style jsx>
                {`
            @keyframes entryAppear {
                0% {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes cross-out {
                0% {
                    width: 0%;
                }
                100% {
                    width: 100%;
                }
            }
            @keyframes uncross-out {
                0% {
                    width: 100%;
                }
                100% {
                    width: 0%;
                }
            }
            .animate-entryAppear {
                animation: entryAppear 0.3s ease-out forwards;
            }
            .animate-cross-out {
                animation: cross-out 0.3s cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
            }
            .animate-uncross-out {
                animation: uncross-out 0.3s cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
            }
        `}
            </style>
        </div>
    );
};

ListEntry.propTypes = {
    text: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date),
    warningThreshold: PropTypes.number,
    assignedUsers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        teamIcon: PropTypes.elementType,
    })).isRequired,
    assignedTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
        teamIcon: PropTypes.elementType,
    })).isRequired,
    checked: PropTypes.bool.isRequired,
    onCheckChange: PropTypes.func.isRequired,
    onTextChange: PropTypes.func,
    onDueDateChange: PropTypes.func,
    onWarningThresholdChange: PropTypes.func,
    onAssign: PropTypes.func,
    isNew: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    entryId: PropTypes.string.isRequired,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    isDragging: PropTypes.bool,
    isDraggedOver: PropTypes.bool,
    dragPosition: PropTypes.oneOf(['above', 'below', null]),
    file: PropTypes.instanceOf(File),
    onFileChange: PropTypes.func,
    onDelete: PropTypes.func,
};

ListEntry.defaultProps = {
    isNew: false,
    isDragging: false,
    isDraggedOver: false,
    dragPosition: null,
    onDragStart: () => { },
    onDragEnd: () => { },
    onDrop: () => { },
    warningThreshold: 1,
    file: null,
    assignedTeams: [],
    assignedUsers: [],
    onTextChange: () => { },
    onDueDateChange: () => { },
    onWarningThresholdChange: () => { },
    onFileChange: () => { },
    onDelete: () => { },
    onAssign: () => { },
};

export default ListEntry;