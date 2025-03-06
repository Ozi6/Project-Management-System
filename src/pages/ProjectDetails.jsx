import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import ViewportHeader from "../components/ViewportHeader";
import Sidebar from "../components/Sidebar";
import Categorizer from "../components/Categorizer";
import { SearchProvider, useSearch } from '../scripts/SearchContext';
import ProgressBar from '../components/ProgressBar';
import { Teams, Users } from '../components/TeamAndUsersTest';
import { 
  Activity, 
  KanbanSquare, 
  Layout, 
  Settings, 
  Users as UsersIcon, 
  Menu, 
  Plus 
} from "lucide-react";

const ProjectDetailsWrapper = () => {
    return(
        <SearchProvider>
            <ProjectDetails/>
        </SearchProvider>
    );
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("team");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const initialColumns = [
        [
            {
                id: "category-a",
                title: "Backend",
                tagColor: "#8b5cf6",
                taskLists: [
                    {
                        id: "task-list-1",
                        title: "SQL",
                        tagColor: "#8b5cf6",
                        entries: [
                            {
                                text: "Connect API",
                                entryId: "task-1",
                                dueDate: new Date("2025-12-15"),
                                assignedTeams: [Teams[0], Teams[1]],
                                assignedUsers: [Users[0]]
                            },
                            {
                                text: "Establish Database",
                                entryId: "task-2",
                                dueDate: new Date("2025-3-2"),
                                assignedTeams: [Teams[0], Teams[1]],
                                assignedUsers: [Users[0]]
                            },
                        ],
                    },
                    {
                        id: "task-list-2",
                        title: "User Establishing",
                        tagColor: "#8b5cf6",
                        entries: [
                            {
                                text: "Proper Initializations",
                                entryId: "task-3",
                                dueDate: new Date("2025-12-10"),
                            },
                            {
                                text: "Authentication",
                                entryId: "task-4",
                            },
                        ],
                    },
                ],
            },
            {
                id: "category-b",
                title: "Frontend",
                tagColor: "#f43f5e",
                taskLists: [
                    {
                        id: "task-list-3",
                        title: "Controls",
                        tagColor: "#f43f5e",
                        entries: [
                            {
                                text: "Update Website Content",
                                entryId: "task-5",
                                dueDate: new Date("2025-12-25"),
                                assignedTeams: [ Teams[1]],
                                assignedUsers: [Users[0]]
                            },
                            {
                                text: "Test New Features",
                                entryId: "task-6",
                                dueDate: new Date("2025-12-18"), // Due soon
                            },
                        ],
                    },
                    {
                        id: "task-list-4",
                        title: "Extra",
                        tagColor: "#f43f5e",
                        entries: [
                            {
                                text: "Fix Bugs in Template",
                                entryId: "task-7",
                            },
                            {
                                text: "Write documentation",
                                entryId: "task-8",
                                dueDate: new Date("2025-12-30"),
                            },
                        ],
                    },
                ],
            },
            {
                id: "category-c",
                title: "Management",
                tagColor: "#f97316",
                taskLists: [
                    {
                        id: "task-list-5",
                        title: "Office",
                        tagColor: "#f97316",
                        entries: [
                            {
                                text: "Plan team outing",
                                entryId: "task-9",
                                dueDate: new Date("2025-12-22"), // Due soon
                            },
                            {
                                text: "Order office supplies",
                                entryId: "task-10",
                            },
                        ],
                    },
                    {
                        id: "task-list-6",
                        title: "Employees",
                        tagColor: "#f97316",
                        entries: [
                            {
                                text: "Conduct performance reviews",
                                entryId: "task-11",
                                dueDate: new Date("2025-12-28"),
                            },
                            {
                                text: "Submit quarterly report",
                                entryId: "task-12",
                                dueDate: new Date("2025-12-31"),
                            },
                        ],
                    },
                ],
            },
        ],
    ];

    const [columns, setColumns] = useState(initialColumns);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const [originalColumns, setOriginalColumns] = useState(null);
    const { searchTerm, filteredColumns, performSearch } = useSearch();

    const BASE_MIN_COLUMN_WIDTH = 315;
    const MIN_COLUMN_WIDTH = BASE_MIN_COLUMN_WIDTH;

    // Mobile sidebar handlers
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileSidebarOpen(false);
                setShowProgressBar(true);
            } else {
                setShowProgressBar(false);
            }
        };

        handleResize(); // Call once on mount to set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile sidebar when changing routes
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const toggleProgressBar = () => {
        setShowProgressBar(!showProgressBar);
    };

    // Existing logic for layout toggle
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

    // Existing function for task redistribution
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

    // Keep the existing resize effect, but adjust it to work with mobile sidebar
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

    const handleAddCategorizer = () =>
    {
        const newCategorizer =
        {
            id: uuidv4(),
            title: "New Categorizer",
            tagColor: "red",
            taskLists: [],
        };

        const newColumns = [...columns];

        if (isHorizontalLayout)
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
            for (let i = 1; i < newColumns.length; i++)
            {
                if(newColumns[i].length < newColumns[smallestColumnIndex].length)
                    smallestColumnIndex = i;
            }
            newColumns[smallestColumnIndex].push(newCategorizer);
        }

        setColumns(newColumns);

        if (isHorizontalLayout)
            setOriginalColumns(newColumns);
    };

    const addEntry = (columnIndex, taskIndex, listId) => {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if (taskList) {
            const newEntry = {
                text: `New Entry ${taskList.entries.length + 1}`,
                checked: false
            };
            taskList.entries.push(newEntry);
            setColumns(newColumns);
        }
    };

    const handleEntryDelete = (columnIndex, taskIndex, listId, entryIndex) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if(taskList && taskList.entries.length > entryIndex)
        {
            taskList.entries.splice(entryIndex, 1);
            setColumns(newColumns);
        }
    };

    const updateEntryCheckedStatus = (columnIndex, taskIndex, listId, entryIndex, isChecked) => {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if (taskList && taskList.entries[entryIndex]) {
            if (typeof taskList.entries[entryIndex] === 'string') {
                taskList.entries[entryIndex] = {
                    text: taskList.entries[entryIndex],
                    checked: isChecked
                };
            } else {
                taskList.entries[entryIndex].checked = isChecked;
            }
            setColumns(newColumns);
        }
    };

    const addList = (columnIndex, taskIndex) =>
    {
        const newColumns = [...columns];
        const newList =
        {
            id: uuidv4(),
            title: `Task List ${newColumns[columnIndex][taskIndex].taskLists.length + 1}`,
            tagColor: newColumns[columnIndex][taskIndex].tagColor,
            entries: [],
        };
        newColumns[columnIndex][taskIndex].taskLists.push(newList);
        setColumns(newColumns);
    };

    const onSelectEntry = (entryId) =>
    {
        setSelectedEntryId(entryId === selectedEntryId ? null : entryId);
    };

    const resetSelectedEntry = () =>
    {
        setSelectedEntryId(null);
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

    const handleDeleteList = (columnIndex, taskIndex, listId) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];

        category.taskLists = category.taskLists.filter(list => list.id !== listId);

        setColumns(newColumns);
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

    const updateCategory = (columnIndex, taskIndex, categoryId, newTitle, newTagColor) =>
    {
        const updatedColumns = [...displayColumns];
        const category = updatedColumns[columnIndex][taskIndex];
        if (category && category.id === categoryId)
        {
            category.title = newTitle;
            category.tagColor = newTagColor;
        }
        setColumns(updatedColumns);
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

    const handleDeleteCategory = (columnIndex, taskIndex) =>
    {
        const newColumns = [...columns];

        if (newColumns[columnIndex] && newColumns[columnIndex][taskIndex])
        {
            newColumns[columnIndex].splice(taskIndex, 1);

            if (newColumns[columnIndex].length === 0)
                newColumns.splice(columnIndex, 1);
        }

        setColumns(newColumns);
    }

    const displayColumns = filteredColumns || columns;

    // Custom navigation items for the sidebar
    const customNavItems = [
        { 
            id: 'dashboard', 
            icon: Layout, 
            label: 'Dashboard', 
            path: '/dashboard',
            color: 'bg-blue-100 text-blue-600',  
            iconColor: 'text-blue-600',     
            defaultColor: true
        },
        { 
            id: 'projects', 
            icon: KanbanSquare, 
            label: 'This Project', // Changed from "Projects" to "This Project"
            path: '/project/1', // Changed from "/projects" to "/project/1"
            color: 'bg-purple-100 text-purple-600',
            iconColor: 'text-purple-600'
        },
        { 
            id: 'activity', 
            icon: Activity, 
            label: 'Activity',
            path: '/activity',
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        { 
            id: 'teams', 
            icon: UsersIcon, 
            label: 'Teams',
            path: '/teams',
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        { 
            id: 'settings', 
            icon: Settings, 
            label: 'Settings',
            path: '/project/settings',
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

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
                <div className="hidden md:block bg-white shadow-md z-5">
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
                                <h3 className="text-md font-semibold mb-2">Project Progress</h3>
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
                                        onDeleteCategory={() => handleDeleteCategory(columnIndex, taskIndex)}
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