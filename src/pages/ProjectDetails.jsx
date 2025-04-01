import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";
import ViewportHeader from "../components/ViewportHeader";
import Sidebar from "../components/Sidebar";
import Categorizer from "../components/Categorizer";
import { SearchProvider, useSearch } from '../scripts/SearchContext';
import ProgressBar from '../components/ProgressBar';
import { 
  Activity, 
  KanbanSquare, 
  Layout, 
  Settings, 
  Users as UsersIcon, 
  Menu, 
  Plus 
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ProjectDetailsWrapper = () => {
    return(
        <SearchProvider>
            <ProjectDetails/>
        </SearchProvider>
    );
};

const ProjectDetails = () => {
    const {t} = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const isOwner = location.state?.isOwner || false;
    const [activeTab, setActiveTab] = useState("team");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [columns, setColumns] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const [originalColumns, setOriginalColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { searchTerm, filteredColumns, performSearch } = useSearch();

    useEffect(() =>
    {
        if (!isLoaded || !user)
            return;

        const fetchProjectDetails = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(`http://localhost:8080/api/projects/${id}/details`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const projectData = response.data;
                const projectCategories = Array.isArray(projectData.categories)
                    ? projectData.categories
                    : (projectData.categories ? [projectData.categories] : []);

                const formattedColumns = projectCategories.map(category =>
                {
                    const formattedCategory = {
                        ...category,
                        title: category.categoryName || 'Unnamed Category',
                        tagColor: category.color || 'gray',
                        taskLists: Array.isArray(category.taskLists)
                            ? category.taskLists.map(taskList => ({
                                ...taskList,
                                title: taskList.taskListName || 'Unnamed Task List',
                                tagColor: taskList.color || 'gray',
                                entries: Array.isArray(taskList.entries)
                                    ? taskList.entries.map(entry =>
                                    {
                                        let fileObject = null;
                                        if (entry.file && entry.file.fileDataBase64)
                                        {
                                            const binaryString = atob(entry.file.fileDataBase64);
                                            const bytes = new Uint8Array(binaryString.length);
                                            for (let i = 0; i < binaryString.length; i++)
                                                bytes[i] = binaryString.charCodeAt(i);
                                            const blob = new Blob([bytes], { type: entry.file.fileType });
                                            fileObject = new File([blob], entry.file.fileName,
                                            {
                                                type: entry.file.fileType,
                                                lastModified: new Date().getTime()
                                            });
                                        }

                                        return{
                                            ...entry,
                                            text: entry.entryName || 'Unnamed Entry',
                                            checked: entry.isChecked || false,
                                            dueDate: entry.dueDate ? new Date(entry.dueDate) : null,
                                            warningThreshold: entry.warningThreshold || null,
                                            id: entry.entryId || uuidv4(),
                                            file: fileObject
                                        };
                                    })
                                    : [],
                                id: taskList.taskListId || uuidv4()
                            }))
                            : [],
                        id: category.categoryId || uuidv4()
                    };
                    return [formattedCategory];
                });

                setColumns(formattedColumns);
                setLoading(false);
            }catch(err){
                console.error('Error fetching project details:', err);
                setError('Failed to load project details');
                setLoading(false);
            }
        };
        fetchProjectDetails();
    },[isLoaded, id, user, getToken]);

    const BASE_MIN_COLUMN_WIDTH = 315;
    const MIN_COLUMN_WIDTH = BASE_MIN_COLUMN_WIDTH;

    useEffect(() =>
    {
        const handleResize = () =>
        {
            if (window.innerWidth >= 768)
            {
                setIsMobileSidebarOpen(false);
                setShowProgressBar(true);
            }
            else
                setShowProgressBar(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

    useEffect(() =>
    {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const toggleProgressBar = () => {
        setShowProgressBar(!showProgressBar);
    };

    const toggleLayout = (isHorizontal) => {
        if (!isHorizontal)
        {
            if (originalColumns)
                setColumns(originalColumns);
        }
        else
        {
            setOriginalColumns(columns);

            const allCategories = [];
            const maxRows = Math.max(...columns.map(column => column.length));

            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++)
            {
                for (let colIndex = 0; colIndex < columns.length; colIndex++)
                {
                    if(columns[colIndex][rowIndex])
                        allCategories.push(columns[colIndex][rowIndex]);
                }
            }
            const horizontalLayout = allCategories.map(category => [category]);
            setColumns(horizontalLayout);
        }
        setIsHorizontalLayout(isHorizontal);
    };

    /*This if else is the craziest algorithm I've ever written, basically uneven-matrix-resize that keeps a heap balance property for responsivity!
    No AI can replicate this, on God on Donda.*/
    //7-03-2025, and of course, the complex algorithm is broken by its enemy. Used to call this twice upon resize.
    const redistributeTasks = (width) => {
        if(isHorizontalLayout)
            return;

        const possibleColumns = Math.max(1, Math.floor(width / MIN_COLUMN_WIDTH));

        if(possibleColumns === columns.length)
            return;

        let newColumns;

        if(possibleColumns < columns.length)
        {
            const columnsCopy = columns.slice(0, -1);
            const tasksToDistribute = columns[columns.length - 1];
            newColumns = [...columnsCopy];
            tasksToDistribute.forEach((task) =>
            {
                let shortestColumnIndex = 0;
                for(let i = 1; i < newColumns.length; i++)
                {
                    if(newColumns[i].length < newColumns[shortestColumnIndex].length)
                        shortestColumnIndex = i;
                }
                newColumns[shortestColumnIndex].push(task);
            });
            setColumns(newColumns);
        }
        else
        {
            const copyColumns = columns.map(col => [...col]);
            copyColumns.push([]);
            const totalTasks = columns.reduce((sum, col) => sum + col.length, 0);
            const tasksPerColumn = Math.floor(totalTasks / copyColumns.length);
            let currentColIndex = columns.length - 1;

            for(let i = columns.length - 2; i >= 0; i--)
            {
                if (columns[i].length > columns[currentColIndex].length)
                {
                    currentColIndex = i;
                    break;
                }
            }

            let tasksToMove = tasksPerColumn;
            let currentTaskIndex;

            while(tasksToMove > 0)
            {
                while(currentColIndex >= 0 && copyColumns[currentColIndex].length === 0)
                {
                    currentColIndex--;
                    if(currentColIndex < 0)
                        currentColIndex = columns.length - 1;
                }
                currentTaskIndex = copyColumns[currentColIndex].length - 1;
                if(currentTaskIndex >= 0)
                {
                    const task = copyColumns[currentColIndex].pop();
                    copyColumns[copyColumns.length - 1].unshift(task);
                    tasksToMove--;
                }
                currentColIndex--;
                if(currentColIndex < 0)
                    currentColIndex = columns.length - 1;
            }
            setColumns(copyColumns);
        }
    };

    const handleAddCategorizer = async () =>
    {
        try{
            const token = await getToken();
            const newCategory ={
                categoryName: t("prode.new"),
                color: "red",
            };
            const response = await axios.post(
                `http://localhost:8080/api/categories`,
                newCategory,
                {
                    params: { projectId: id },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            const newCategorizer =
            {
                ...response.data,
                title: response.data.categoryName,
                tagColor: response.data.color,
                id: response.data.categoryId
            };

            const newColumns = [...columns];
            if(isHorizontalLayout)
            {
                const emptyColumnIndex = newColumns.findIndex(column => column.length === 0);
                if(emptyColumnIndex === -1)
                {
                    const newColumn = [newCategorizer];
                    newColumns.push(newColumn);
                }
                else
                    newColumns[emptyColumnIndex].push(newCategorizer);
            }
            else
            {
                let smallestColumnIndex = 0;
                for(let i = 1; i < newColumns.length; i++) {
                    if(newColumns[i].length < newColumns[smallestColumnIndex].length)
                        smallestColumnIndex = i;
                }
                newColumns[smallestColumnIndex].push(newCategorizer);
            }
            setColumns(newColumns);
            if (isHorizontalLayout)
                setOriginalColumns(newColumns);
        }catch(err){
            console.error('Error adding category:', err.response ? err.response.data : err);
        }
    };

    const addEntry = async (columnIndex, taskIndex, listId) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);

        if(taskList)
        {
            try{
                const token = await getToken();
                const newEntryData =
                {
                    entryName: `New Entry ${taskList.entries.length + 1}`,
                    isChecked: false,
                    dueDate: null
                };

                const response = await axios.post(
                    `http://localhost:8080/api/entries`,
                    newEntryData,
                    {
                        params: { taskListId: listId },
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const savedEntry =
                {
                    ...response.data,
                    text: response.data.entryName,
                    id: response.data.entryId,
                    isChecked: response.data.isChecked || false,
                    dueDate: response.data.dueDate ? new Date(response.data.dueDate) : null
                };

                taskList.entries.push(savedEntry);
                setColumns(newColumns);
            }catch(err){
                console.error('Error adding entry:', err.response ? err.response.data : err);
            }
        }
    };

    const handleEntryDelete = async (columnIndex, taskIndex, listId, entryIndex) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if(taskList && taskList.entries.length > entryIndex)
        {
            const entryToDelete = taskList.entries[entryIndex];

            try{
                const token = await getToken();
                await axios.delete(
                    `http://localhost:8080/api/entries/${entryToDelete.id}`,
                    {
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                taskList.entries.splice(entryIndex, 1);
                setColumns(newColumns);
            }catch(err){
                console.error('Error deleting entry:', err.response ? err.response.data : err);
            }
        }
    };

    const updateEntryCheckedStatus = async (columnIndex, taskIndex, listId, entryIndex, isChecked) => {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if (taskList && taskList.entries[entryIndex])
        {
            const entry = taskList.entries[entryIndex];
            try{
                const token = await getToken();
                await axios.put(
                    `http://localhost:8080/api/entries/${entry.id}/check`,
                    null,
                    {
                        params: { isChecked },
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (typeof taskList.entries[entryIndex] === 'string') {
                    taskList.entries[entryIndex] =
                    {
                        text: taskList.entries[entryIndex],
                        checked: isChecked
                    };
                }
                else
                    taskList.entries[entryIndex].checked = isChecked;
                entry.isChecked = isChecked;
                setColumns(newColumns);
            }catch(err){
                console.error('Error updating entry check status:', err.response ? err.response.data : err);
            }

        }
    };

    const addList = async (columnIndex, categoryIndex) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][categoryIndex];

        const newList =
        {
            id: uuidv4(),
            title: `Task List ${category.taskLists.length + 1}`,
            taskListName: `Task List ${category.taskLists.length + 1}`,
            color: category.tagColor,
            tagColor: category.tagColor,
            entries: []
        };

        category.taskLists.push(newList);
        setColumns(newColumns);

        try{
            const response = await saveNewTaskList(category.id, newList);
            if(response && response.taskListId)
            {
                const updatedColumns = [...columns];
                const updatedCategory = updatedColumns[columnIndex][categoryIndex];
                const listIndex = updatedCategory.taskLists.findIndex(list => list.id === newList.id);
                if(listIndex !== -1)
                {
                    updatedCategory.taskLists[listIndex].id = response.taskListId;
                    setColumns(updatedColumns);
                }
            }
        }catch(err){
            console.error('Failed to save task list:', err);
            const rollbackColumns = [...columns];
            rollbackColumns[columnIndex][categoryIndex].taskLists =
                rollbackColumns[columnIndex][categoryIndex].taskLists.filter(list => list.id !== newList.id);
            setColumns(rollbackColumns);
        }
    };

    const saveNewTaskList = async (categoryId, taskList) => {
        try {
            const token = await getToken();
            const response = await axios.post(
                `http://localhost:8080/api/tasklists`,
                {
                    taskListName: taskList.taskListName,
                    color: taskList.color
                },
                {
                    params: { categoryId },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        }catch(err){
            console.error('Error saving new task list:', err);
            throw err;
        }
    };

    const onSelectEntry = (entryId) =>
    {
        setSelectedEntryId(entryId === selectedEntryId ? null : entryId);
    };

    const resetSelectedEntry = () =>
    {
        setSelectedEntryId(null);
    };

    const handleUpdateTaskList = async (listId, newTitle, newColor) =>
    {
        try{
            const token = await getToken();
            await axios.put(
                `http://localhost:8080/api/tasklists/${listId}`,
                {
                    taskListName: newTitle,
                    color: newColor
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const updatedColumns = [...columns];
            updatedColumns.forEach(column =>
            {
                column.forEach(category =>
                {
                    category.taskLists = category.taskLists.map(list =>
                    {
                        if (list.id === listId)
                        {
                            return{
                                ...list,
                                title: newTitle,
                                taskListName: newTitle,
                                tagColor: newColor,
                                color: newColor
                            };
                        }
                        return list;
                    });
                });
            });
            setColumns(updatedColumns);
        }catch(error){
            console.error('Error updating task list:', error);
        }
    };

    const deepCopyColumns = (columns) => {
        return columns.map(column => {
            return column.map(category => {
                return {
                    ...category,
                    taskLists: (category.taskLists || []).map(taskList => {
                        return {
                            ...taskList,
                            entries: (taskList.entries || []).map(entry => {
                                return {
                                    ...entry,
                                    assignedUsers: (entry.assignedUsers || []).map(user => ({
                                        ...user,
                                        profilePicture: user.profilePicture
                                    })),
                                    assignedTeams: (entry.assignedTeams || []).map(team => ({
                                        ...team,
                                        teamIcon: team.teamIcon
                                    }))
                                };
                            })
                        };
                    })
                };
            });
        });
    };

    const handleMoveTaskList = (moveData) => {
        const { sourceListId, sourceCategoryId, targetCategoryId, targetIndex } = moveData;
        const newColumns = JSON.parse(JSON.stringify(columns));

        let sourceCategory, sourceColumnIndex, sourceCategoryIndex;
        let targetCategory, targetColumnIndex, targetCategoryIndex;
        let sourceListIndex;

        outerLoop: for (let colIndex = 0; colIndex < newColumns.length; colIndex++) {
            for (let catIndex = 0; catIndex < newColumns[colIndex].length; catIndex++) {
                const category = newColumns[colIndex][catIndex];
                if (category.id === sourceCategoryId) {
                    sourceCategory = category;
                    sourceColumnIndex = colIndex;
                    sourceCategoryIndex = catIndex;
                    sourceListIndex = sourceCategory.taskLists.findIndex(list => list.id === sourceListId);
                    if (sourceListIndex !== -1) break outerLoop;
                }
            }
        }

        if (!sourceCategory || sourceListIndex === -1) return;

        outerLoop: for (let colIndex = 0; colIndex < newColumns.length; colIndex++) {
            for (let catIndex = 0; catIndex < newColumns[colIndex].length; catIndex++) {
                const category = newColumns[colIndex][catIndex];
                if (category.id === targetCategoryId) {
                    targetCategory = category;
                    targetColumnIndex = colIndex;
                    targetCategoryIndex = catIndex;
                    break outerLoop;
                }
            }
        }

        if (!targetCategory) return;

        const [movedList] = sourceCategory.taskLists.splice(sourceListIndex, 1);
        targetCategory.taskLists.splice(targetIndex, 0, movedList);

        setColumns(newColumns);
    };

    const handleDeleteList = async (columnIndex, taskIndex, listId) =>
    {
        try{
            const token = await getToken();
            await axios.delete(
                `http://localhost:8080/api/tasklists/${listId}`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const newColumns = [...columns];
            const category = newColumns[columnIndex][taskIndex];

            category.taskLists = category.taskLists.filter(list => list.id !== listId);

            setColumns(newColumns);
        }catch(error){
            console.error('Error deleting task list:', error);
        }
    };

    const handleMoveEntry = (moveData) => {
        const {
            sourceEntryId,
            sourceListId,
            sourceCategoryId,
            targetListId,
            targetCategoryId,
            targetIndex,
            entry
        } = moveData;

        const newColumns = deepCopyColumns(columns);

        const sourceEntryIdParts = sourceEntryId.split('-');
        const sourceEntryIndex = parseInt(sourceEntryIdParts[sourceEntryIdParts.length - 1]);

        let sourceCategory, sourceList, targetCategory, targetList;
        let sourceColumnIndex, sourceTaskIndex, targetColumnIndex, targetTaskIndex;

        outerLoop: for (let colIndex = 0; colIndex < newColumns.length; colIndex++) {
            for (let taskIndex = 0; taskIndex < newColumns[colIndex].length; taskIndex++) {
                const category = newColumns[colIndex][taskIndex];
                if (category.id === sourceCategoryId) {
                    sourceCategory = category;
                    sourceColumnIndex = colIndex;
                    sourceTaskIndex = taskIndex;
                    sourceList = category.taskLists.find(list => list.id === sourceListId);
                    if (sourceList) break outerLoop;
                }
            }
        }

        if (!sourceCategory || !sourceList) {
            console.error("Source not found");
            return;
        }

        if (targetIndex === -1) {
            setColumns(newColumns);
            return;
        }

        if (targetListId && targetCategoryId) {
            outerLoop: for (let colIndex = 0; colIndex < newColumns.length; colIndex++) {
                for (let taskIndex = 0; taskIndex < newColumns[colIndex].length; taskIndex++) {
                    const category = newColumns[colIndex][taskIndex];
                    if (category.id === targetCategoryId) {
                        targetCategory = category;
                        targetColumnIndex = colIndex;
                        targetTaskIndex = taskIndex;
                        targetList = category.taskLists.find(list => list.id === targetListId);
                        if (targetList) break outerLoop;
                    }
                }
            }
        }

        if (!targetCategory || !targetList) {
            console.error("Target not found");
            return;
        }

        const isSameList = sourceListId === targetListId && sourceCategoryId === targetCategoryId;
        const entryToMove = sourceList.entries[sourceEntryIndex] || entry;

        if (!entryToMove) {
            console.error("Entry to move not found");
            return;
        }

        const safeEntry = {
            ...entryToMove,
            assignedUsers: entryToMove.assignedUsers || [],
            assignedTeams: entryToMove.assignedTeams || []
        };

        if (isSameList) {
            sourceList.entries.splice(sourceEntryIndex, 1);
            sourceList.entries.splice(targetIndex, 0, safeEntry);
        } else {
            sourceList.entries.splice(sourceEntryIndex, 1);
            targetList.entries.splice(targetIndex, 0, safeEntry);
        }

        setColumns(newColumns);
    };

    const updateCategory = async (columnIndex, taskIndex, categoryId, newTitle, newTagColor) =>
    {
        try{
            const token = await getToken();
            const response = await axios.put(
                `http://localhost:8080/api/categories/${categoryId}`,
                {
                    categoryName: newTitle,
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

            const updatedCategory = response.data;

            const updatedColumns = [...displayColumns];
            const category = updatedColumns[columnIndex][taskIndex];
            if(category && category.id === categoryId)
            {
                category.title = updatedCategory.categoryName;
                category.tagColor = updatedCategory.color;
                category.categoryName = updatedCategory.categoryName;
                category.color = updatedCategory.color;
            }
            setColumns(updatedColumns);
        }catch(err){
            console.error('Error updating category:', err);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById("columns-container");
            if (container) {
                setContainerWidth(container.offsetWidth);
                if (!isHorizontalLayout)
                    redistributeTasks(container.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [columns, isHorizontalLayout]);

    useEffect(() => {
        if (searchTerm) {
            performSearch(searchTerm, columns);
        } else {
            performSearch('', columns);
        }
    },[searchTerm, columns]);

    const handleDeleteCategory = async (columnIndex, taskIndex, categoryId) =>
    {
        try{
            const token = await getToken();
            const response = await axios.delete(
                `http://localhost:8080/api/categories/${categoryId}`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status !== 204)
                throw new Error('Failed to delete category');

            const newColumns = [...columns];

            if (newColumns[columnIndex] && newColumns[columnIndex][taskIndex])
            {
                newColumns[columnIndex].splice(taskIndex, 1);
                if (newColumns[columnIndex].length === 0)
                    newColumns.splice(columnIndex, 1);
            }

            setColumns(newColumns);

        }catch(error){
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const handleEntryUpdate = async (columnIndex, taskIndex, listId, entryIndex, updateData) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);

        if(!taskList || !taskList.entries[entryIndex])
            return;

        const entry = taskList.entries[entryIndex];

        if(updateData.fileOperation)
        {
            try{
                const { type, file, userId, entryId } = updateData.fileOperation;
                const currentEntryResponse = await axios.get(`http://localhost:8080/api/entries/${entryId}`);
                const currentEntry = currentEntryResponse.data;

                if(type === 'delete')
                {
                    if(currentEntry.file?.fileId)
                        await axios.delete(`http://localhost:8080/api/files/${currentEntry.file.fileId}`);

                    const updatedEntry = { ...currentEntry, file: null };
                    const token = await getToken();
                    await axios.put(
                        `http://localhost:8080/api/entries/${entryId}`,
                        updatedEntry,
                        {
                            headers:
                            {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        }
                    );

                    taskList.entries[entryIndex] =
                    {
                        ...entry,
                        file: null
                    };
                }
                else if(type === 'upload' && file)
                {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('userId', userId);

                    if(currentEntry.file?.fileId)
                        await axios.delete(`http://localhost:8080/api/files/${currentEntry.file.fileId}`);

                    const token = await getToken();
                    const fileResponse = await axios.post(
                        'http://localhost:8080/api/files/upload',
                        formData,
                        {
                            headers:
                            {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`
                            },
                            withCredentials: true
                        }
                    );

                    const uploadedFile = fileResponse.data;

                    let fileObject = null;
                    if(uploadedFile.fileDataBase64)
                    {
                        const binaryString = atob(uploadedFile.fileDataBase64);
                        const bytes = new Uint8Array(binaryString.length);
                        for(let i = 0; i < binaryString.length; i++)
                            bytes[i] = binaryString.charCodeAt(i);
                        const blob = new Blob([bytes], { type: uploadedFile.fileType });
                        fileObject = new File([blob], uploadedFile.fileName,
                        {
                            type: uploadedFile.fileType,
                            lastModified: new Date().getTime()
                        });
                    }

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

                    await axios.put(
                        `http://localhost:8080/api/entries/${entryId}`,
                        updatedEntry,
                        {
                            headers:
                            {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        }
                    );

                    taskList.entries[entryIndex] =
                    {
                        ...entry,
                        file: fileObject
                    };
                }
            }catch(error){
                console.error('Error in file operation:', error);
                throw error;
            }
        }

        if (Object.keys(updateData).some(key => key !== 'fileOperation'))
        {
            try{
                const token = await getToken();
                await axios.put(
                    `http://localhost:8080/api/entries/${entry.id}`,
                    {
                        entryName: updateData.text !== undefined ? updateData.text : entry.text,
                        isChecked: updateData.checked !== undefined ? updateData.checked : entry.checked,
                        dueDate: updateData.dueDate !== undefined ? updateData.dueDate : entry.dueDate,
                        warningThreshold: updateData.warningThreshold !== undefined ? updateData.warningThreshold : entry.warningThreshold,
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

                taskList.entries[entryIndex] =
                {
                    ...entry,
                    ...updateData
                };
            }catch(error){
                console.error('Error updating entry:', error);
            }
        }
        setColumns(newColumns);
    };

    const displayColumns = filteredColumns || columns;

    const customNavItems =
    [
        {
            id: 'dashboard',
            icon: Layout,
            label: t("sidebar.dash"),
            path: '/dashboard',
            iconColor: 'text-blue-600',
            defaultColor: true
        },
        {
            id: 'projects',
            icon: KanbanSquare,
            label: t("sidebar.this"),
            path: `/project/${id}`,
            state: { isOwner },
            color: 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]',
            iconColor: 'text-[var(--sidebar-projects-color)]'
        },
        {
            id: 'activity',
            icon: Activity,
            label: t("sidebar.act"),
            path: `/project/${id}/activity`,
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        {
            id: 'teams',
            icon: UsersIcon,
            label: t("sidebar.team"),
            path: `/project/${id}/teams`,
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        {
            id: 'settings',
            icon: Settings,
            label: t("sidebar.set"),
            path: `/project/${id}/settings`,
            state: { isOwner },
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

    if(loading)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-500">{t("prode.load")}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <ViewportHeader 
              isHorizontalLayout={isHorizontalLayout} 
              toggleLayout={toggleLayout} 
              onAddCategorizer={handleAddCategorizer}
            />
            <div className="flex flex-1 relative">
                {/* Mobile menu toggle button */}
                <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                    {/* Mobile Add Category button - top */}
                    <button 
                        onClick={handleAddCategorizer}
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Add category"
                    >
                        <Plus size={24} />
                    </button>

                    {/* Mobile Progress toggle button - middle */}
                    <button 
                        onClick={toggleProgressBar}
                        className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                        aria-label="Toggle progress"
                    >
                        <Activity size={24} />
                    </button>

                    {/* Mobile menu toggle button - bottom */}
                    <button 
                        onClick={toggleMobileSidebar}
                        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Sidebar - hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5">
                    <Sidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab}
                        customNavItems={customNavItems}
                    />
                </div>
                
                {/* Mobile sidebar - full screen overlay when open */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            customNavItems={customNavItems}
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                )}

                {/* Main content area */}
                <div className="flex-1 overflow-auto">
                    {searchTerm && filteredColumns && filteredColumns.length === 0 && (
                        <div className="flex justify-center items-center p-8 text-gray-500">
                            No results found for "{searchTerm}"
                        </div>
                    )}
                    
                    {/* Mobile progress bar - conditionally shown when toggled */}
                    {showProgressBar && (
                        <div className="md:hidden mx-4 mt-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-md text-[var(--features-text-color)] font-semibold mb-2">Project Progress</h3>
                                <div className="px-2">
                                    <ProgressBar tasks={displayColumns} isCompact={true} />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div
                        id="columns-container"
                        style={{
                            transform: ``,
                            transformOrigin: 'top left',
                            width: '100%',
                            marginBottom: '20px',
                        }}
                        className={`flex ${isHorizontalLayout ? 'overflow-x-auto' : 'flex-wrap'} gap-4 mt-6 px-4 md:pl-8`}>
                        {displayColumns.map((tasks, columnIndex) => (
                            <div
                                key={columnIndex}
                                className={`flex flex-col gap-4 ${isHorizontalLayout
                                    ? 'min-w-[285px] max-w-[285px] flex-shrink-0'
                                    : 'min-w-[280px] max-w-full md:max-w-[285px] flex-1'}`}>
                                {tasks.map((task, taskIndex) => (
                                    <Categorizer
                                        onUpdateEntryCheckedStatus={(listId, entryIndex, isChecked) =>
                                            updateEntryCheckedStatus(columnIndex, taskIndex, listId, entryIndex, isChecked)}
                                        key={task.id}
                                        columnIndex={columnIndex}
                                        taskIndex={taskIndex}
                                        categoryId={task.id}
                                        title={task.title}
                                        tagColor={task.tagColor}
                                        taskLists={task.taskLists}
                                        selectedEntryId={selectedEntryId}
                                        onSelectEntry={onSelectEntry}
                                        onAddEntry={(listId) => addEntry(columnIndex, taskIndex, listId)}
                                        onEntryDelete={handleEntryDelete}
                                        onEditCardOpen={resetSelectedEntry}
                                        onAddList={() => addList(columnIndex, taskIndex)}
                                        onMoveEntry={handleMoveEntry}
                                        onMoveTaskList={handleMoveTaskList}
                                        onDeleteList={handleDeleteList}
                                        onUpdateCategory={(categoryId, newTitle, newTagColor) => {
                                            updateCategory(columnIndex, taskIndex, categoryId, newTitle, newTagColor);
                                        }}
                                        onDeleteCategory={() => handleDeleteCategory(columnIndex, taskIndex, task.id)}
                                        onUpdateTaskList={handleUpdateTaskList}
                                        onEntryUpdate={(listId, entryIndex, updateData) =>
                                            handleEntryUpdate(columnIndex, taskIndex, listId, entryIndex, updateData)
                                        }
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Desktop progress bar - hidden on mobile */}
                <div className={`hidden md:block`}>
                    <ProgressBar tasks={displayColumns} />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsWrapper;