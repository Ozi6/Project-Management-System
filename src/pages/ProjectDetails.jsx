import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import ViewportHeader from "../components/ViewportHeader";
import ViewportSidebar from "../components/ViewportSidebar";
import Categorizer from "../components/Categorizer";
import { useNavigate } from 'react-router-dom';
import { SearchProvider, useSearch } from '../scripts/SearchContext';
import ProgressBar from '../components/ProgressBar';
import { Teams, Users } from '../components/TeamAndUsersTest';

const ProjectDetailsWrapper = () =>
{
    return(
        <SearchProvider>
            <ProjectDetails/>
        </SearchProvider>
    );
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("team");
    const initialColumns = [
        [
            {
                id: "category-a",
                title: "Category A",
                tagColor: "#8b5cf6",
                taskLists: [
                    {
                        id: "task-list-1",
                        title: "Task List 1",
                        tagColor: "#8b5cf6",
                        entries: [
                            {
                                text: "Complete project proposal",
                                entryId: "task-1",
                                dueDate: new Date("2025-12-15"),
                                assignedTeams: [Teams[0], Teams[1]],
                                assignedUsers: [Users[0]]
                            },
                            {
                                text: "Review design mockups",
                                entryId: "task-2",
                                dueDate: new Date("2025-3-2"),
                            },
                        ],
                    },
                    {
                        id: "task-list-2",
                        title: "Task List 2",
                        tagColor: "#8b5cf6",
                        entries: [
                            {
                                text: "Prepare presentation slides",
                                entryId: "task-3",
                                dueDate: new Date("2025-12-10"),
                            },
                            {
                                text: "Send meeting invites",
                                entryId: "task-4",
                            },
                        ],
                    },
                ],
            },
            {
                id: "category-b",
                title: "Category B",
                tagColor: "#f43f5e",
                taskLists: [
                    {
                        id: "task-list-3",
                        title: "Task List 3",
                        tagColor: "#f43f5e",
                        entries: [
                            {
                                text: "Update website content",
                                entryId: "task-5",
                                dueDate: new Date("2025-12-25"),
                            },
                            {
                                text: "Test new features",
                                entryId: "task-6",
                                dueDate: new Date("2025-12-18"), // Due soon
                            },
                        ],
                    },
                    {
                        id: "task-list-4",
                        title: "Task List 4",
                        tagColor: "#f43f5e",
                        entries: [
                            {
                                text: "Fix bugs in production",
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
                title: "Category C",
                tagColor: "#f97316",
                taskLists: [
                    {
                        id: "task-list-5",
                        title: "Task List 5",
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
                        title: "Task List 6",
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

    const toggleLayout = (isHorizontal) =>
    {
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
    const redistributeTasks = (width) =>
    {
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

    const handleMoveEntry = (moveData) =>
    {
        const
            {
            sourceEntryId,
            sourceListId,
            sourceCategoryId,
            targetListId,
            targetCategoryId,
            targetIndex,
            entryText
        } = moveData;

        const newColumns = JSON.parse(JSON.stringify(columns));

        const sourceEntryIdParts = sourceEntryId.split('-');
        const sourceEntryIndex = parseInt(sourceEntryIdParts[sourceEntryIdParts.length - 1]);

        let sourceCategory, sourceList, targetCategory, targetList;
        let sourceColumnIndex, sourceTaskIndex, targetColumnIndex, targetTaskIndex;

        outerLoop: for(let colIndex = 0; colIndex < newColumns.length; colIndex++)
        {
            for(let taskIndex = 0; taskIndex < newColumns[colIndex].length; taskIndex++)
            {
                const category = newColumns[colIndex][taskIndex];
                if(category.id === sourceCategoryId)
                {
                    sourceCategory = category;
                    sourceColumnIndex = colIndex;
                    sourceTaskIndex = taskIndex;
                    sourceList = category.taskLists.find(list => list.id === sourceListId);
                    if (sourceList) break outerLoop;
                }
            }
        }

        if(!sourceCategory || !sourceList)
        {
            console.error("test1");
            return;
        }

        if(targetIndex === -1)
        {
            setColumns(newColumns);
            return;
        }

        if(targetListId && targetCategoryId)
        {
            outerLoop: for(let colIndex = 0; colIndex < newColumns.length; colIndex++)
            {
                for(let taskIndex = 0; taskIndex < newColumns[colIndex].length; taskIndex++)
                {
                    const category = newColumns[colIndex][taskIndex];
                    if(category.id === targetCategoryId)
                    {
                        targetCategory = category;
                        targetColumnIndex = colIndex;
                        targetTaskIndex = taskIndex;
                        targetList = category.taskLists.find(list => list.id === targetListId);
                        if (targetList) break outerLoop;
                    }
                }
            }
        }

        if(!targetCategory || !targetList)
        {
            console.log("test2");
            return;
        }

        const isSameList = sourceListId === targetListId && sourceCategoryId === targetCategoryId;
        const entryToMove = sourceList.entries[sourceEntryIndex];

        if(isSameList)
        {
            sourceList.entries.splice(sourceEntryIndex, 1);
            sourceList.entries.splice(targetIndex, 0, entryToMove);
        }
        else
        {
            sourceList.entries.splice(sourceEntryIndex, 1);
            targetList.entries.splice(targetIndex, 0, entryToMove || entryText);
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

    return (
        <div className="flex flex-col h-screen">
            <ViewportHeader 
              isHorizontalLayout={isHorizontalLayout} 
              toggleLayout={toggleLayout} 
              onAddCategorizer={handleAddCategorizer}
            />
            <div className="flex flex-1">
                <ViewportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex flex-col flex-1">
                    {searchTerm && filteredColumns && filteredColumns.length === 0 && (
                        <div className="flex justify-center items-center p-8 text-gray-500">
                            No results found for "{searchTerm}"
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
                        className={`flex ${isHorizontalLayout ? 'overflow-x-auto' : 'flex-wrap'} gap-4 mt-6 pl-1`}>
                        {displayColumns.map((tasks, columnIndex) => (
                            <div
                                key={columnIndex}
                                className={`flex flex-col gap-4 ${isHorizontalLayout
                                    ? 'min-w-[285px] max-w-[285px] flex-shrink-0'
                                    : 'min-w-[285px] max-w-[285px] flex-1'}`}>
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
                <ProgressBar tasks={displayColumns}/>
            </div>
        </div>
    );
};

export default ProjectDetailsWrapper;