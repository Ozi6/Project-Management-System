import { useState, useRef, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
import PropTypes from "prop-types";
import ListEntry from "./ListEntry";
import EditCard from "./EditCard";
import { AnimatePresence } from "framer-motion";

const TaskList = ({
    title,
    tagColor,
    entries: initialEntries,
    onAddEntry,
    listId,
    categoryId,
    selectedEntryId,
    onSelectEntry,
    onEditCardOpen,
    onMoveEntry,
    onEntryDelete,
    onDeleteList,
    onDragStart,
    onUpdateEntryCheckedStatus,
    onFileChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(title);
    const [editableTagColor, setEditableTagColor] = useState(tagColor);
    const [newEntryId, setNewEntryId] = useState(null);
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
    const [dragPosition, setDragPosition] = useState(null);
    const [entries, setEntries] = useState(() =>
        initialEntries.map(entry => ({
            ...entry,
            file: entry.file && entry.file.name ? entry.file : null
        }))
    );
    const listRef = useRef(null);
    const headerRef = useRef(null);

    // Update entries when initialEntries prop changes
    useEffect(() => {
        setEntries(initialEntries);
    }, [initialEntries]);

    const handleDone = (newTitle, newTagColor) => {
        setEditableTitle(newTitle);
        setEditableTagColor(newTagColor);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEditCardOpen = () => {
        setIsEditing(true);
        onEditCardOpen();
    };

    const handleDeleteList = () =>
    {
        if (onDeleteList)
            onDeleteList(listId);
    };

    const getLuminance = (color) => {
        const rgb = color.match(/\w\w/g).map((x) => parseInt(x, 16));
        const [r, g, b] = rgb;
        const a = [r, g, b]
            .map((x) => x / 255)
            .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const luminance = getLuminance(editableTagColor.replace("#", ""));
    const textColor = luminance < 0.5 ? "white" : "#444444";

    const handleHeaderMouseDown = (e) => {
        if (e.button !== 0) return;

        let dragStarted = false;

        const startDrag = () => {
            if (!dragStarted) {
                dragStarted = true;
                onDragStart(e); //listId, title, 
                document.addEventListener('mousemove', handleMouseMove);
                //document.body.classList.add('dragging');
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

            if (!dragStarted) {
                //document.removeEventListener('mousemove', handleMouseMove);
                //document.body.classList.remove('dragging');
            }

            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleEntryDragStart = (entryId, text) => {
        if (window.dragState) {
            window.dragState.isDragging = true;
            window.dragState.draggedEntryId = entryId;
            window.dragState.draggedEntryText = text;
            window.dragState.sourceListId = listId;
            window.dragState.sourceCategoryId = categoryId;
        } else {
            window.dragState = {
                isDragging: true,
                draggedEntryId: entryId,
                draggedEntryText: text,
                sourceListId: listId,
                sourceCategoryId: categoryId,
                targetListId: null,
                targetCategoryId: null,
                targetIndex: null
            };
        }
    };

    const handleEntryDragEnd = () => {
        if (window.dragState && draggedOverIndex !== null) {
            const sourceEntryId = window.dragState.draggedEntryId;
            const sourceListId = window.dragState.sourceListId;
            const sourceCategoryId = window.dragState.sourceCategoryId;
            const sourceIndex = parseInt(sourceEntryId.split('-').pop());
            const sourceEntry = entries[sourceIndex];

            onMoveEntry({
                sourceEntryId,
                sourceListId,
                sourceCategoryId,
                targetListId: listId,
                targetCategoryId: categoryId,
                targetIndex: draggedOverIndex,
                entry: sourceEntry
            });
        }
        setDraggedOverIndex(null);
        setDragPosition(null);
    };

    const handleMouseMove = (e) => {
        if (!window.dragState || !window.dragState.isDragging || !listRef.current)
            return;

        const rect = listRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom) {
            const entryElements = listRef.current.querySelectorAll('.entry-container');

            if (entryElements.length === 0) {
                setDraggedOverIndex(0);
                setDragPosition('below');

                window.dragState.currentHoverListId = listId;
                window.dragState.currentHoverCategoryId = categoryId;
                window.dragState.currentHoverIndex = 0;
                return;
            }

            let closestIndex = 0;
            let closestDistance = Infinity;
            let position = 'below';

            entryElements.forEach((el, index) => {
                const entryRect = el.getBoundingClientRect();
                const entryMiddle = entryRect.top + entryRect.height / 2;
                const distance = Math.abs(e.clientY - entryMiddle);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                    position = e.clientY < entryMiddle ? 'above' : 'below';
                }
            });

            const isSameList = window.dragState.sourceListId === listId &&
                window.dragState.sourceCategoryId === categoryId;

            if (isSameList) {
                const draggedIdParts = window.dragState.draggedEntryId.split('-');
                const draggedIndex = parseInt(draggedIdParts[draggedIdParts.length - 1]);

                const targetIndex = position === 'below' ? closestIndex + 1 : closestIndex;

                if (targetIndex === draggedIndex || targetIndex === draggedIndex + 1) {
                    setDraggedOverIndex(null);
                    setDragPosition(null);
                    window.dragState.currentHoverListId = listId;
                    window.dragState.currentHoverCategoryId = categoryId;
                    window.dragState.currentHoverIndex = null;
                    return;
                }
            }
            const targetIndex = position === 'below' ? closestIndex + 1 : closestIndex;
            setDraggedOverIndex(targetIndex);
            setDragPosition(position);
            window.dragState.currentHoverListId = listId;
            window.dragState.currentHoverCategoryId = categoryId;
            window.dragState.currentHoverIndex = targetIndex;
        } else {
            setDraggedOverIndex(null);
            setDragPosition(null);

            if (window.dragState.currentHoverListId === listId &&
                window.dragState.currentHoverCategoryId === categoryId) {
                window.dragState.currentHoverListId = null;
                window.dragState.currentHoverCategoryId = null;
                window.dragState.currentHoverIndex = null;
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);

        const handleMouseUp = () => {
            if (window.dragState && window.dragState.isDragging) {
                const isTargetingThisList = window.dragState.currentHoverListId === listId &&
                    window.dragState.currentHoverCategoryId === categoryId;
                const isSourceList = window.dragState.sourceListId === listId &&
                    window.dragState.sourceCategoryId === categoryId;

                if (isTargetingThisList) {
                    const sourceEntryId = window.dragState.draggedEntryId;
                    const sourceListId = window.dragState.sourceListId;
                    const sourceCategoryId = window.dragState.sourceCategoryId;
                    const sourceEntryText = window.dragState.draggedEntryText;

                    const sourceEntryIdParts = sourceEntryId.split('-');
                    const sourceEntryIndex = parseInt(sourceEntryIdParts[sourceEntryIdParts.length - 1]);

                    if (window.dragState.currentHoverIndex === null && isSourceList) {
                        // Do nothing
                    } else {
                        let targetIndex = window.dragState.currentHoverIndex;

                        if (isSourceList && targetIndex > sourceEntryIndex) {
                            targetIndex -= 1;
                        }

                        if (targetIndex === null) {
                            targetIndex = entries.length - (isSourceList ? 1 : 0);
                        }

                        onMoveEntry({
                            sourceEntryId,
                            sourceListId,
                            sourceCategoryId,
                            targetListId: listId,
                            targetCategoryId: categoryId,
                            targetIndex: targetIndex,
                            entryText: sourceEntryText
                        });
                    }
                    window.dragState = null;
                } else if (isSourceList && !window.dragState.currentHoverListId) {
                    const sourceEntryId = window.dragState.draggedEntryId;
                    const sourceEntryText = window.dragState.draggedEntryText;

                    onMoveEntry({
                        sourceEntryId,
                        sourceListId: listId,
                        sourceCategoryId: categoryId,
                        targetListId: listId,
                        targetCategoryId: categoryId,
                        targetIndex: -1,
                        entryText: sourceEntryText
                    });
                    window.dragState = null;
                }
            }
            setDraggedOverIndex(null);
            setDragPosition(null);
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [listId, categoryId, onMoveEntry, entries.length]);

    // Callback to update entry text
    const handleTextChange = (index, newText) => {
        const updatedEntries = [...entries];
        updatedEntries[index].text = newText;
        setEntries(updatedEntries);
    };

    // Callback to update entry due date
    const handleDueDateChange = (index, newDueDate) => {
        const updatedEntries = [...entries];
        updatedEntries[index].dueDate = newDueDate;
        setEntries(updatedEntries);
    };

    // Callback to update entry warning threshold
    const handleWarningThresholdChange = (index, newWarningThreshold) => {
        const updatedEntries = [...entries];
        updatedEntries[index].warningThreshold = newWarningThreshold;
        setEntries(updatedEntries);
    };

    const handleFileChange = (index, file) => {
        const updatedEntries = [...entries];
        updatedEntries[index].file = file && file.name ? file : null;
        setEntries(updatedEntries);
        onFileChange?.(listId, index, updatedEntries[index].file);
    };

    const handleDelete = (entryId) =>
    {
        const parts = entryId.split('-');
        const index = parseInt(parts[parts.length - 1]);

        setEntries(entries.filter((_, i) => i !== index));

    };

    const handleAssignedChange = (index, newAssigneesUsers, newAssigneesTeams) => {
        const updatedEntries = [...entries];
        updatedEntries[index].assignedUsers = newAssigneesUsers;
        updatedEntries[index].assignedTeams = newAssigneesTeams;
        setEntries(updatedEntries);
    };

    return (
        <div className="relative" ref={listRef}>
            <div
                className={`bg-gray-100 rounded-lg shadow-xl p-2 flex flex-col w-64 transition-all duration-300 ease-in-out
                ${newEntryId ? "animate-[expand_0.3s_ease-out_forwards]" : ""}`}>
                <div
                    ref={headerRef}
                    onMouseDown={handleHeaderMouseDown}
                    className="p-3 rounded-xl flex justify-between items-center cursor-grab active:cursor-grabbing"
                    style={{ backgroundColor: editableTagColor, color: textColor }}>
                    <span className="w-full text-left font-bold">{editableTitle}</span>
                    <Settings
                        size={18}
                        cursor="pointer"
                        onClick={handleEditCardOpen}
                        className="transition-transform transform hover:scale-150 hover:text-gray-150" />
                </div>

                <div className="flex flex-col gap-2 p-2">
                    {entries.length > 0 ? (
                        entries.map((entry, index) => {
                            const entryId = `cat-${categoryId}-list-${listId}-entry-${index}`;
                            const isCurrentlyDragged = window.dragState &&
                                window.dragState.isDragging &&
                                window.dragState.draggedEntryId === entryId;
                            const showDropIndicator = draggedOverIndex === index &&
                                window.dragState &&
                                window.dragState.isDragging &&
                                (window.dragState.sourceListId !== listId ||
                                    window.dragState.sourceCategoryId !== categoryId ||
                                    window.dragState.draggedEntryId !== entryId);
                            return (
                                <div key={entryId} className="entry-container">
                                    <ListEntry
                                        entryId={entryId}
                                        text={entry.text}
                                        checked={entry.checked}
                                        onCheckChange={(isChecked) => {
                                            onUpdateEntryCheckedStatus(listId, index, isChecked);
                                        }}
                                        isNew={index === entries.length - 1 && newEntryId !== null}
                                        isSelected={selectedEntryId === entryId}
                                        onClick={onSelectEntry}
                                        onDragStart={handleEntryDragStart}
                                        onDragEnd={handleEntryDragEnd}
                                        isDragging={isCurrentlyDragged}
                                        isDraggedOver={showDropIndicator}
                                        dragPosition={dragPosition}
                                        dueDate={entry.dueDate}
                                        warningThreshold={entry.warningThreshold}
                                        onTextChange={(newText) => handleTextChange(index, newText)}
                                        onDueDateChange={(newDueDate) => handleDueDateChange(index, newDueDate)}
                                        onWarningThresholdChange={(newWarningThreshold) => handleWarningThresholdChange(index, newWarningThreshold)}
                                        file={entry.file}
                                        onDelete={(entryId) => {
                                            onEntryDelete(listId, index);
                                        }}
                                        onFileChange={(file) => handleFileChange(index, file)}
                                        assignedTeams={entry.assignedTeams}
                                        assignedUsers={entry.assignedUsers}
                                        onAssign={(newAssigneesUsers, newAssigneesTeams) => handleAssignedChange(index, newAssigneesUsers, newAssigneesTeams)}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">No entries</p>
                    )}
                    {draggedOverIndex === entries.length && window.dragState && window.dragState.isDragging && (
                        <div className="border-2 border-dashed border-blue-500 rounded-md h-10 my-2 flex items-center justify-center bg-blue-50">
                            <span className="text-blue-500 text-sm">Drop here</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onAddEntry(listId)}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-all duration-300 hover:bg-blue-600 hover:scale-105">
                    <Plus size={16} /> Add Entry
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isEditing && (
                    <EditCard
                        title={editableTitle}
                        tagColor={editableTagColor}
                        onDone={handleDone}
                        onCancel={handleCancel}
                        onDelete={handleDeleteList}/>
                )}
            </AnimatePresence>

            <style jsx>
                {`
                @keyframes expand {
                    from {
                        max-height: calc(100% - 3rem);
                    }
                    to {
                        max-height: calc(100% + 3rem);
                    }
                }
                `}
            </style>
        </div>
    );
};

TaskList.propTypes = {
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    listId: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    selectedEntryId: PropTypes.string,
    onSelectEntry: PropTypes.func.isRequired,
    onEditCardOpen: PropTypes.func.isRequired,
    onMoveEntry: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onEntryDelete: PropTypes.func.isRequired
};

export default TaskList;