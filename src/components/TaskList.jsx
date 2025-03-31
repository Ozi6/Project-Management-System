import { useState, useRef, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
import PropTypes from "prop-types";
import ListEntry from "./ListEntry";
import EditCard from "./EditCard";
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";
import { Teams, Users } from './TeamAndUsersTest';
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    onFileChange,
    onEntryUpdate,
    onUpdateTaskList
}) => {
    const {t} = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(title);
    const [editableTagColor, setEditableTagColor] = useState(tagColor);
    const [newEntryId, setNewEntryId] = useState(null);
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
    const [dragPosition, setDragPosition] = useState(null);
    const { getToken } = useAuth();
    const { user } = useUser();
    const [entries, setEntries] = useState(() =>
        initialEntries.map(entry => ({
            ...entry,
            file: entry.file && entry.file.name ? entry.file : null
        }))
    );
    const listRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        setEntries(initialEntries);
    }, [initialEntries]);

    const handleDone = async (newTitle, newTagColor) =>
    {
        try{
            const token = await getToken();
            const response = await axios.put(
                `http://localhost:8080/api/tasklists/${listId}`,
                {
                    taskListName: newTitle,
                    color: newTagColor
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setEditableTitle(newTitle);
            setEditableTagColor(newTagColor);
            setIsEditing(false);

            if (onUpdateTaskList)
                onUpdateTaskList(listId, newTitle, newTagColor);
        }catch(error){
            console.error('Error updating task list:', error);
        }
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

    const handleEntryDragStart = (entryId, text, trueId) =>
    {
        if(window.dragState)
        {
            window.dragState.isDragging = true;
            window.dragState.draggedEntryId = entryId;
            window.dragState.draggedEntryTrueId = trueId;
            window.dragState.draggedEntryText = text;
            window.dragState.sourceListId = listId;
            window.dragState.sourceCategoryId = categoryId;
        }
        else
        {
            window.dragState =
            {
                isDragging: true,
                draggedEntryId: entryId,
                draggedEntryTrueId: trueId,
                draggedEntryText: text,
                sourceListId: listId,
                sourceCategoryId: categoryId,
                targetListId: null,
                targetCategoryId: null,
                targetIndex: null
            };
        }
    };

    const handleEntryDragEnd = async () =>
    {
        if (window.dragState && draggedOverIndex !== null)
        {
            
            const sourceEntryId = window.dragState.draggedEntryId;
            const sourceListId = window.dragState.sourceListId;
            const sourceEntryTrueId = window.dragState.draggedEntryTrueId;
            const sourceCategoryId = window.dragState.sourceCategoryId;
            const sourceIndex = parseInt(sourceEntryId.split('-').pop());
            const sourceEntry = entries[sourceIndex];

            try {
                console.log(sourceEntryTrueId);
                if (sourceEntry.id && listId !== sourceListId && sourceEntryTrueId)
                    await moveEntryToNewList(sourceEntryTrueId, listId);

                onMoveEntry({
                    sourceEntryId,
                    sourceListId,
                    sourceCategoryId,
                    targetListId: listId,
                    targetCategoryId: categoryId,
                    targetIndex: draggedOverIndex,
                    entry: sourceEntry
                });
            }catch(error){
                console.error('Failed to move entry:', error);
            }
        }
        setDraggedOverIndex(null);
        setDragPosition(null);
    };

    const handleMouseMove = (e) =>
    {
        if(!window.dragState || !window.dragState.isDragging || !listRef.current)
            return;

        const rect = listRef.current.getBoundingClientRect();
        if(e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom)
        {

            const entryElements = listRef.current.querySelectorAll('.entry-container');

            if(entryElements.length === 0)
            {
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

            entryElements.forEach((el, index) =>
            {
                const entryRect = el.getBoundingClientRect();
                const entryMiddle = entryRect.top + entryRect.height / 2;
                const distance = Math.abs(e.clientY - entryMiddle);

                if(distance < closestDistance)
                {
                    closestDistance = distance;
                    closestIndex = index;
                    position = e.clientY < entryMiddle ? 'above' : 'below';
                }
            });

            const isSameList = window.dragState.sourceListId === listId &&
                window.dragState.sourceCategoryId === categoryId;

            if(isSameList)
            {
                const draggedIdParts = window.dragState.draggedEntryId.split('-');
                const draggedIndex = parseInt(draggedIdParts[draggedIdParts.length - 1]);

                const targetIndex = position === 'below' ? closestIndex + 1 : closestIndex;

                if(targetIndex === draggedIndex || targetIndex === draggedIndex + 1)
                {
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
        }
        else
        {
            setDraggedOverIndex(null);
            setDragPosition(null);

            if(window.dragState.currentHoverListId === listId &&
                window.dragState.currentHoverCategoryId === categoryId)
            {
                window.dragState.currentHoverListId = null;
                window.dragState.currentHoverCategoryId = null;
                window.dragState.currentHoverIndex = null;
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);

        const handleMouseUp = async () => {
            if (window.dragState && window.dragState.isDragging) {
                const isTargetingThisList = window.dragState.currentHoverListId === listId &&
                    window.dragState.currentHoverCategoryId === categoryId;
                const isSourceList = window.dragState.sourceListId === listId &&
                    window.dragState.sourceCategoryId === categoryId;

                if (isTargetingThisList) {
                    const sourceEntryId = window.dragState.draggedEntryId;
                    const sourceListId = window.dragState.sourceListId;
                    const sourceEntryTrueId = window.dragState.draggedEntryTrueId;
                    const sourceCategoryId = window.dragState.sourceCategoryId;
                    const sourceEntryText = window.dragState.draggedEntryText;

                    // Get the source entry properly
                    let sourceEntry;
                    if (isSourceList) {
                        const sourceEntryIdParts = sourceEntryId.split('-');
                        const sourceEntryIndex = parseInt(sourceEntryIdParts[sourceEntryIdParts.length - 1]);
                        sourceEntry = entries[sourceEntryIndex];
                    } else {
                        // For entries coming from other lists, use the minimal required data
                        sourceEntry = {
                            text: sourceEntryText,
                            entryId: sourceEntryTrueId,
                            // Add other required properties with default values
                            checked: false,
                            dueDate: null,
                            warningThreshold: 1,
                            assignedUsers: [],
                            assignedTeams: []
                        };
                    }

                    let targetIndex = window.dragState.currentHoverIndex;

                    if (isSourceList && targetIndex !== null && targetIndex > sourceEntryIndex) {
                        targetIndex -= 1;
                    }

                    if (targetIndex === null) {
                        targetIndex = entries.length;
                    }

                    try {
                        if (sourceEntryTrueId && listId !== sourceListId) {
                            await moveEntryToNewList(sourceEntryTrueId, listId);
                        }

                        onMoveEntry({
                            sourceEntryId,
                            sourceListId,
                            sourceCategoryId,
                            targetListId: listId,
                            targetCategoryId: categoryId,
                            targetIndex: targetIndex,
                            entryText: sourceEntryText,
                            entry: sourceEntry
                        });
                    } catch (error) {
                        console.error('Failed to move entry:', error);
                    }
                    window.dragState = null;
                } else if (isSourceList && !window.dragState.currentHoverListId) {
                    const sourceEntryId = window.dragState.draggedEntryId;
                    const sourceEntryText = window.dragState.draggedEntryText;
                    const sourceEntryIndex = parseInt(sourceEntryId.split('-').pop());
                    const sourceEntry = entries[sourceEntryIndex];
                    onMoveEntry({
                        sourceEntryId,
                        sourceListId: listId,
                        sourceCategoryId: categoryId,
                        targetListId: listId,
                        targetCategoryId: categoryId,
                        targetIndex: -1,
                        entryText: sourceEntryText,
                        entry: sourceEntry
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


    const handleTextChange = async (index, newText) =>
    {
        const updatedEntries = [...entries];
        const entry = updatedEntries[index];

        entry.text = newText;
        setEntries(updatedEntries);

        try
        {
            if(entry.id)
                await updateEntryInBackend(entry.id, { ...entry, text: newText });
        }catch(error){
            const originalEntries = [...entries];
            setEntries(originalEntries);
        }
    };


    const handleDueDateChange = async (index, newDueDate) =>
    {
        const updatedEntries = [...entries];
        const entry = updatedEntries[index];

        entry.dueDate = newDueDate;
        setEntries(updatedEntries);

        try{
            if (entry.id)
                await updateEntryInBackend(entry.id, { ...entry, dueDate: newDueDate });
        }catch(error){
            const originalEntries = [...entries];
            setEntries(originalEntries);
        }
    };


    const handleWarningThresholdChange = async (index, newWarningThreshold) =>
    {
        const updatedEntries = [...entries];
        const entry = updatedEntries[index];

        entry.warningThreshold = newWarningThreshold;
        setEntries(updatedEntries);

        try{
            if (entry.id)
                await updateEntryInBackend(entry.id, { ...entry, warningThreshold: newWarningThreshold });
        }catch(error){
            const originalEntries = [...entries];
            setEntries(originalEntries);
        }
    };

    const handleFileChange = async (index, entryId, userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            const fileResponse = await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const uploadedFile = fileResponse.data;

            const currentEntryResponse = await axios.get(`http://localhost:8080/api/entries/${entryId}`);
            const currentEntry = currentEntryResponse.data;

            const updatedEntry =
            {
                ...currentEntry,
                file:
                {
                    fileId: uploadedFile.fileId,
                    fileName: uploadedFile.fileName,
                    fileSize: uploadedFile.fileSize,
                    fileType: uploadedFile.fileType,
                    fileDataBase64: uploadedFile.fileDataBase64
                }
            };

            const entryResponse = await axios.put(
                `http://localhost:8080/api/entries/${entryId}`,
                updatedEntry
            );

            let fileObject = null;
            if (uploadedFile.fileDataBase64)
            {
                const binaryString = atob(uploadedFile.fileDataBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++)
                    bytes[i] = binaryString.charCodeAt(i);
                const blob = new Blob([bytes], { type: uploadedFile.fileType });
                fileObject = new File([blob], uploadedFile.fileName,
                {
                    type: uploadedFile.fileType,
                    lastModified: new Date().getTime()
                });
            }

            const updatedEntries = [...entries];
            updatedEntries[index] =
            {
                ...updatedEntries[index],
                file: fileObject
            };
            setEntries(updatedEntries);

            return entryResponse.data;
        }catch(error){
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const updateEntryInBackend = async (entryId, updatedData) =>
    {
        try{
            const token = await getToken();
            const response = await axios.put(
                `http://localhost:8080/api/entries/${entryId}`,
                {
                    entryName: updatedData.text,
                    isChecked: updatedData.checked || false,
                    dueDate: updatedData.dueDate,
                    warningThreshold: updatedData.warningThreshold,
                    // Add other fields as needed
                },
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        }catch(error){
            console.error('Error updating entry:', error.response ? error.response.data : error);
            throw error;
        }
    };

    const uploadFileToBackend = async (entryId, file) =>
    {
        if(!file)
            return null;

        const formData = new FormData();
        formData.append('file', file);

        try{
            const token = await getToken();
            const response = await axios.post(
                `http://localhost:8080/api/entries/${entryId}/file`,
                formData,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        }catch(error){
            console.error('Error uploading file:', error.response ? error.response.data : error);
            throw error;
        }
    };

    const handleDelete = (entryId) =>
    {
        const parts = entryId.split('-');
        const index = parseInt(parts[parts.length - 1]);

        setEntries(entries.filter((_, i) => i !== index));
    };

    const moveEntryToNewList = async (entryId, newTaskListId) =>
    {
        console.log(`Moving entry ${entryId} to list ${newTaskListId}`);
        try{
            const token = await getToken();
            const url = `http://localhost:8080/api/entries/${entryId}/move?taskListId=${newTaskListId}`;
            console.log("Request URL:", url);

            const response = await axios.put(
                url,
                {},
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        }catch(error){
            console.error('Error moving entry:',
            {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            throw error;
        }
    };

    const handleAssignedChange = (index, newAssigneesUsers, newAssigneesTeams) => {
        const updatedEntries = [...entries];
        updatedEntries[index].assignedUsers = newAssigneesUsers;
        updatedEntries[index].assignedTeams = newAssigneesTeams;
        setEntries(updatedEntries);

        if (onEntryUpdate)
        {
            onEntryUpdate(listId, index,
            {
                assignedUsers: newAssigneesUsers,
                assignedTeams: newAssigneesTeams
            });
        }
    };

    return (
        <div className="relative" ref={listRef}>
            <div
                className={`bg-[var(--gray-card3)] rounded-lg shadow-xl p-2 flex flex-col w-64 transition-all duration-300 ease-in-out
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
                                window.dragState.draggedEntryId === entryId &&
                                window.dragState.draggedEntryTrueId === entry.entryId;
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
                                        trueId={entry.entryId}
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
                                        onFileChange={(file) => handleFileChange(index, entry.entryId, user.id, file)}
                                        assignedUsers={entry.assignedUsers || []}
                                        assignedTeams={entry.assignedTeams || []}
                                        onAssign={(newUsers, newTeams) => handleAssignedChange(index, newUsers, newTeams)}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-[var(--features-text-color)]">{t("prode.no.ent")}</p>
                    )}
                    {draggedOverIndex === entries.length && window.dragState && window.dragState.isDragging && (
                        <div className="border-2 border-dashed border-[var(--features-icon-color)] rounded-md h-10 my-2 flex items-center justify-center bg-[var(--loginpage-bg)]">
                            <span className="text-[var(--features-icon-color)] text-sm">Drop here</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onAddEntry(listId)}
                    className="mt-2 bg-[var(--features-icon-color)] !text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-all duration-300 hover:bg-[var(--hover-color)] hover:scale-105">
                    <Plus size={16} /> {t("prode.addent")}
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

TaskList.propTypes =
{
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    selectedEntryId: PropTypes.string,
    onSelectEntry: PropTypes.func.isRequired,
    onEditCardOpen: PropTypes.func.isRequired,
    onMoveEntry: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onEntryDelete: PropTypes.func.isRequired
};

export default TaskList;