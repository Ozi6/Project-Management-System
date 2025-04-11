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
    BookOpen,
    Menu, 
    Plus 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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

    const [hasAccess, setHasAccess] = useState(false);
    const [accessChecking, setAccessChecking] = useState(true);
    const [isOwner, setIsOwner] = useState(location.state?.isOwner || false);

    const [activeTab, setActiveTab] = useState("team");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [projectProgress, setProjectProgress] = useState(0);
    const [columns, setColumns] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const [originalColumns, setOriginalColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [dataReady, setDataReady] = useState(false);
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const { searchTerm, filteredColumns, performSearch } = useSearch();

    useEffect(() => {
        if (!isLoaded || !user || !id) return;
        
        const checkProjectAccess = async () => {
            try {
                setAccessChecking(true);
                const token = await getToken();
                
                const response = await axios.get(
                    `http://localhost:8080/api/projects/${id}/members`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                const isMember = response.data.some(member => member.userId === user.id);
                
                const ownerResponse = await axios.get(
                    `http://localhost:8080/api/projects/${id}/isOwner`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'userId': user.id
                        }
                    }
                );
                
                setIsOwner(ownerResponse.data.isOwner);
                setHasAccess(isMember || ownerResponse.data.isOwner);
                
                if (!isMember && !ownerResponse.data.isOwner) {
                    navigate('/dashboard', { 
                        state: { 
                            accessDenied: true,
                            message: "You don't have access to this project" 
                        }
                    });
                }
            } catch (error) {
                console.error("Error checking project access:", error);
                navigate('/dashboard', { 
                    state: { 
                        accessDenied: true,
                        message: "Failed to verify project access" 
                    }
                });
            } finally {
                setAccessChecking(false);
            }
        };
        
        checkProjectAccess();
        
    }, [id, isLoaded, user, getToken, navigate]);

    const fetchProjectProgress = async () => {
        if (!isLoaded || !user || !id) return;
        
        try {
            const token = await getToken();
            const response = await axios.get(
                `http://localhost:8080/api/projects/${id}/progress`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            
            setProjectProgress(response.data);
        } catch (error) {
            console.error("Error fetching project progress:", error);
        }
    };

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
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const projectData = response.data;

                setTeams(projectData.teams || []);
                setMembers(projectData.members || []);

                if(projectData.backgroundImage)
                    setBackgroundImage(`data:image/jpeg;base64,${projectData.backgroundImage}`);

                const projectCategories = Array.isArray(projectData.categories)
                    ? projectData.categories
                    : (projectData.categories ? [projectData.categories] : []);

                console.log(response.data);

                const formattedColumns = projectCategories.map(category =>
                {
                    const formattedCategory =
                    {
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
                                            assignedUsers: entry.assignedUsers || [],
                                            assignedTeams: entry.assignedTeams || [],
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
                setTimeout(() =>
                {
                    setLoading(false);
                    setTimeout(() =>
                    {
                        setDataReady(true);
                    }, 100);
                }, 300);
            }catch(err){
                console.error('Error fetching project details:', err);
                setError('Failed to load project details');
                setLoading(false);
            }
        };
        fetchProjectDetails();
    },[isLoaded, id, user, getToken]);

    useEffect(() =>
    {
        if(dataReady && !isHorizontalLayout)
        {
            fetchProjectProgress();
            const container = document.getElementById("columns-container");
            if(container)
                redistributeTasks(container.offsetWidth);
        }
    },[dataReady]);
    useEffect(() => {
        if (dataReady && columns.length > 0) {
            fetchProjectProgress();
        }
    }, [columns]);
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
                fetchProjectProgress();
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

    const getOverlayColor = () =>
    {
        return 'rgba(255, 255, 255, 0.7)';
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

    useEffect(() =>
    {
        const handleResize = () =>
        {
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
    },[columns, isHorizontalLayout]);

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

        if(updateData.text !== undefined)
        {
            entry.text = updateData.text;
            entry.entryName = updateData.text;
        }

        if(updateData.dueDate !== undefined)
            entry.dueDate = updateData.dueDate;

        if(updateData.warningThreshold !== undefined)
            entry.warningThreshold = updateData.warningThreshold;

        if(updateData.assignedUsers !== undefined)
            entry.assignedUsers = updateData.assignedUsers;

        if(updateData.assignedTeams !== undefined)
            entry.assignedTeams = updateData.assignedTeams;

        if(updateData.fileOperation)
        {
            try{
                const { type, file, userId, entryId } = updateData.fileOperation;
                const token = await getToken();

                if(type === 'delete')
                {
                    const currentEntryResponse = await axios.get(`http://localhost:8080/api/entries/${entryId}`);
                    const currentEntry = currentEntryResponse.data;

                    if(currentEntry.file?.fileId)
                        await axios.delete(`http://localhost:8080/api/files/${currentEntry.file.fileId}`);

                    entry.file = null;
                }
                else if(type === 'upload' && file)
                {
                    const currentEntryResponse = await axios.get(`http://localhost:8080/api/entries/${entryId}`);
                    const currentEntry = currentEntryResponse.data;

                    if(currentEntry.file?.fileId)
                        await axios.delete(`http://localhost:8080/api/files/${currentEntry.file.fileId}`);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('userId', userId);

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

                    entry.file = fileObject;
                    entry.fileMetadata =
                    {
                        fileId: uploadedFile.fileId,
                        fileName: uploadedFile.fileName,
                        fileSize: uploadedFile.fileSize,
                        fileType: uploadedFile.fileType,
                        fileDataBase64: uploadedFile.fileDataBase64
                    };
                }
            }catch(error){
                console.error('Error in file operation:', error);
                throw error;
            }
        }

        try{
            const token = await getToken();

            console.log(entry);

            const updatePayload =
            {
                entryName: entry.text,
                isChecked: entry.checked || false,
                dueDate: entry.dueDate,
                warningThreshold: entry.warningThreshold,
                assignedUsers: entry.assignedUsers || [],
                assignedTeams: entry.assignedTeams || []
            };

            if (updateData.fileOperation)
            {
                if (updateData.fileOperation.type === 'delete')
                    updatePayload.file = null;
                else if(updateData.fileOperation.type === 'upload' && entry.fileMetadata)
                {
                    updatePayload.file = entry.fileMetadata;
                    delete entry.fileMetadata;
                }
            }

            await axios.put(
                `http://localhost:8080/api/entries/${entry.id}`,
                updatePayload,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setColumns(newColumns);
        }catch(error){
            console.error('Error updating entry:', error);
        }
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
            state: { isOwner },
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        {
            id: 'teams',
            icon: UsersIcon,
            label: t("sidebar.team"),
            path: `/project/${id}/teams`,
            state: { isOwner },
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        {
            id: 'notes',
            icon: BookOpen,
            label: "Notes",
            path: `/project/${id}/notes`,
            state: { isOwner },
            color: 'bg-indigo-100 text-indigo-600',
            iconColor: 'text-indigo-600'
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

    if (accessChecking) {
        return (
            <div className="flex items-center justify-center h-screen bg-[var(--loginpage-bg)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--features-icon-color)] mx-auto"></div>
                    <p className="mt-4 text-[var(--features-title-color)]">Verifying project access...</p>
                </div>
            </div>
        );
    }

    if(loading)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-500">{t("prode.load")}</div>
            </div>
        );
    }
    const loadingVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
        }
    };

    const containerVariants =
    {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const columnVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            {backgroundImage && (
                <div
                    className="fixed inset-0 z-0 bg-center bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                >
                    <div
                        className="fixed inset-0 backdrop-blur-sm"
                        style={{ backgroundColor: getOverlayColor() }}
                    ></div>
                </div>
            )}
            <ViewportHeader
                isHorizontalLayout={isHorizontalLayout}
                toggleLayout={toggleLayout}
                onAddCategorizer={handleAddCategorizer}
                projectId={id}
            />
            <div className="flex flex-1 relative">
                {/* Mobile menu toggle button */}
                <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                    {/* Mobile Add Category button - top */}
                    <motion.button
                        onClick={handleAddCategorizer}
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Add category"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Plus size={24} />
                    </motion.button>

                    {/* Mobile Progress toggle button - middle */}
                    <motion.button
                        onClick={toggleProgressBar}
                        className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                        aria-label="Toggle progress"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Activity size={24} />
                    </motion.button>

                    {/* Mobile menu toggle button - bottom */}
                    <motion.button
                        onClick={toggleMobileSidebar}
                        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                        aria-label="Toggle menu"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Menu size={24} />
                    </motion.button>
                </div>

                {/* Sidebar - hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block fixed top-15 left-0 h-full bg-[var(--bg-color)] shadow-md z-10">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        customNavItems={customNavItems}
                        onCollapseChange={setIsSidebarCollapsed}
                    />
                </div>

                {/* Mobile sidebar - full screen overlay when open */}
                <AnimatePresence>
                    {isMobileSidebarOpen && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-40 bg-white"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <Sidebar
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                customNavItems={customNavItems}
                                isMobile={true}
                                closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                                isCollapsed={isSidebarCollapsed}
                                onCollapseChange={setIsSidebarCollapsed}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main content area */}
                <motion.div
                    className="flex-1 overflow-auto"
                    animate={{
                        marginLeft: isSidebarCollapsed ? '12rem' : '2rem'
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onAnimationComplete={() =>
                    {
                        const container = document.getElementById("columns-container");
                        if(container && !isHorizontalLayout)
                            redistributeTasks(container.offsetWidth);
                    }}
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                className="flex flex-col justify-center items-center h-[80vh]"
                                variants={loadingVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        transition: {
                                            duration: 1.5,
                                            ease: "linear",
                                            repeat: Infinity
                                        }
                                    }}
                                    className="text-indigo-600 mb-4"
                                >
                                    <Loader2 size={40} />
                                </motion.div>
                                <motion.div
                                    className="text-xl text-gray-600 font-medium"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        transition: {
                                            duration: 2,
                                            repeat: Infinity
                                        }
                                    }}
                                >
                                    {t("prode.load")}
                                </motion.div>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                className="flex justify-center items-center h-[80vh]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="p-6 bg-red-50 rounded-lg shadow border border-red-200">
                                    <div className="text-xl text-red-600 font-medium">Error: {error}</div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {searchTerm && filteredColumns && filteredColumns.length === 0 && (
                                    <motion.div
                                        className="flex justify-center items-center p-8 text-gray-500"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        No results found for "{searchTerm}"
                                    </motion.div>
                                )}

                                {/* Mobile progress bar - conditionally shown when toggled */}
                                <AnimatePresence>
                                    {showProgressBar && (
                                        <motion.div
                                            className="md:hidden mx-4 mt-4"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="bg-white p-4 rounded-lg shadow">
                                                <h3 className="text-md text-[var(--features-text-color)] font-semibold mb-2">Project Progress</h3>
                                                <div className="px-2">
                                                    <ProgressBar tasks={displayColumns} progress={projectProgress} isCompact={true} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    id="columns-container"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate={dataReady ? "visible" : "hidden"}
                                    style={{
                                        width: '100%',
                                        marginBottom: '20px',
                                    }}
                                    className={`flex ${isHorizontalLayout ? 'overflow-x-auto' : 'flex-wrap'} gap-4 mt-6 px-4 md:pl-20`}
                                >
                                    {displayColumns.map((tasks, columnIndex) => (
                                        <motion.div
                                            key={columnIndex}
                                            variants={columnVariants}
                                            className={`flex flex-col gap-4 ${isHorizontalLayout
                                                ? 'min-w-[285px] max-w-[285px] flex-shrink-0'
                                                : 'min-w-[280px] max-w-full md:max-w-[285px] flex-1'}`}
                                        >
                                            {tasks.map((task, taskIndex) => (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        delay: 0.1 * taskIndex,
                                                        duration: 0.4
                                                    }}
                                                >
                                                    <Categorizer
                                                        onUpdateEntryCheckedStatus={(listId, entryIndex, isChecked) =>
                                                            updateEntryCheckedStatus(columnIndex, taskIndex, listId, entryIndex, isChecked)}
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
                                                        members={members}
                                                        teams={teams}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Desktop progress bar - hidden on mobile */}
                <div className={`hidden md:block`}>
                    <ProgressBar tasks={displayColumns} progress={projectProgress} />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsWrapper;