import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ViewportHeader from "../components/ViewportHeader";
import ViewportSidebar from "../components/ViewportSidebar";
import Categorizer from "../components/Categorizer";

const ProjectDetails = () => {
    const { id } = useParams();
    const initialColumns = [
        [
            {
                id: "category-a",
                title: "Category A",
                tagColor: "#8b5cf6",
                taskLists: [
                    { id: "task-list-1", title: "Task List 1", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                    { id: "task-list-2", title: "Task List 2", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-b",
                title: "Category B",
                tagColor: "#f43f5e",
                taskLists: [
                    { id: "task-list-3", title: "Task List 3", tagColor: "#f43f5e", entries: ["Example Entry"] },
                    { id: "task-list-4", title: "Task List 4", tagColor: "#f43f5e", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-c",
                title: "Category C",
                tagColor: "#f97316",
                taskLists: [
                    { id: "task-list-5", title: "Task List 5", tagColor: "#f97316", entries: ["Example Entry"] },
                    { id: "task-list-6", title: "Task List 6", tagColor: "#f97316", entries: ["Example Entry"] },
                ],
            },
        ],
        [
            {
                id: "category-d",
                title: "Category D",
                tagColor: "#8b5cf6",
                taskLists: [
                    { id: "task-list-1", title: "Task List 1", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                    { id: "task-list-2", title: "Task List 2", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-e",
                title: "Category E",
                tagColor: "#f43f5e",
                taskLists: [
                    { id: "task-list-3", title: "Task List 3", tagColor: "#f43f5e", entries: ["Example Entry"] },
                    { id: "task-list-4", title: "Task List 4", tagColor: "#f43f5e", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-f",
                title: "Category F",
                tagColor: "#f97316",
                taskLists: [
                    { id: "task-list-5", title: "Task List 5", tagColor: "#f97316", entries: ["Example Entry"] },
                    { id: "task-list-6", title: "Task List 6", tagColor: "#f97316", entries: ["Example Entry"] },
                ],
            },
        ], [
            {
                id: "category-g",
                title: "Category G",
                tagColor: "#8b5cf6",
                taskLists: [
                    { id: "task-list-1", title: "Task List 1", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                    { id: "task-list-2", title: "Task List 2", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-h",
                title: "Category H",
                tagColor: "#f43f5e",
                taskLists: [
                    { id: "task-list-3", title: "Task List 3", tagColor: "#f43f5e", entries: ["Example Entry"] },
                    { id: "task-list-4", title: "Task List 4", tagColor: "#f43f5e", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-i",
                title: "Category I",
                tagColor: "#f97316",
                taskLists: [
                    { id: "task-list-5", title: "Task List 5", tagColor: "#f97316", entries: ["Example Entry"] },
                    { id: "task-list-6", title: "Task List 6", tagColor: "#f97316", entries: ["Example Entry"] },
                ],
            },
        ],
        [
            {
                id: "category-j",
                title: "Category J",
                tagColor: "#8b5cf6",
                taskLists: [
                    { id: "task-list-1", title: "Task List 1", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                    { id: "task-list-2", title: "Task List 2", tagColor: "#8b5cf6", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-k",
                title: "Category K",
                tagColor: "#f43f5e",
                taskLists: [
                    { id: "task-list-3", title: "Task List 3", tagColor: "#f43f5e", entries: ["Example Entry"] },
                    { id: "task-list-4", title: "Task List 4", tagColor: "#f43f5e", entries: ["Example Entry"] },
                ],
            },
            {
                id: "category-l",
                title: "Category L",
                tagColor: "#f97316",
                taskLists: [
                    { id: "task-list-5", title: "Task List 5", tagColor: "#f97316", entries: ["Example Entry"] },
                    { id: "task-list-6", title: "Task List 6", tagColor: "#f97316", entries: ["Example Entry"] },
                ],
            },
        ],
    ];

    const [columns, setColumns] = useState(initialColumns);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const [originalColumns, setOriginalColumns] = useState(null);

    const MIN_COLUMN_WIDTH = 350;

    const toggleLayout = (isHorizontal) => {
        if (!isHorizontal) {
            if (originalColumns)
                setColumns(originalColumns);
        }
        else {
            setOriginalColumns(columns);
            const allCategories = columns.flat();
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

    const addEntry = (columnIndex, taskIndex, listId) =>
    {
        const newColumns = [...columns];
        const category = newColumns[columnIndex][taskIndex];
        const taskList = category.taskLists.find((list) => list.id === listId);
        if(taskList)
        {
            const newEntry = `New Entry ${taskList.entries.length + 1}`;
            taskList.entries.push(newEntry);
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
        const {
            sourceListId,
            sourceCategoryId,
            targetCategoryId,
            targetIndex
        } = moveData;
        const newColumns = JSON.parse(JSON.stringify(columns));
        let sourceCategory, sourceColumnIndex, sourceCategoryIndex;
        let targetCategory, targetColumnIndex, targetCategoryIndex;
        let sourceListIndex;
        outerLoop: for (let colIndex = 0; colIndex < newColumns.length; colIndex++)
        {
            for(let catIndex = 0; catIndex < newColumns[colIndex].length; catIndex++)
            {
                const category = newColumns[colIndex][catIndex];
                if(category.id === sourceCategoryId)
                {
                    sourceCategory = category;
                    sourceColumnIndex = colIndex;
                    sourceCategoryIndex = catIndex;
                    sourceListIndex = sourceCategory.taskLists.findIndex(list => list.id === sourceListId);
                    if (sourceListIndex !== -1) break outerLoop;
                }
            }
        }

        if(!sourceCategory || sourceListIndex === -1)
        {
            console.error('test1');
            return;
        }

        outerLoop: for(let colIndex = 0; colIndex < newColumns.length; colIndex++)
        {
            for(let catIndex = 0; catIndex < newColumns[colIndex].length; catIndex++)
            {
                const category = newColumns[colIndex][catIndex];
                if(category.id === targetCategoryId)
                {
                    targetCategory = category;
                    targetColumnIndex = colIndex;
                    targetCategoryIndex = catIndex;
                    break outerLoop;
                }
            }
        }

        if(!targetCategory)
        {
            console.error('test2');
            return;
        }

        const [movedList] = sourceCategory.taskLists.splice(sourceListIndex, 1);

        let adjustedTargetIndex = targetIndex;
        if(sourceCategoryId === targetCategoryId && sourceListIndex < targetIndex)
            adjustedTargetIndex--;

        if (adjustedTargetIndex === -1 || adjustedTargetIndex >= targetCategory.taskLists.length)
        {
            targetCategory.taskLists.push(movedList);
        }
        else
        {
            targetCategory.taskLists.splice(adjustedTargetIndex, 0, movedList);
        }

        setColumns(newColumns);
        document.body.classList.remove('dragging');

        if(typeof saveProjectData === 'function')
        {
            saveProjectData(newColumns);
        }
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

    return (
        <div className="flex flex-col h-screen">
            <ViewportHeader isHorizontalLayout={isHorizontalLayout} toggleLayout={toggleLayout} />
            <div className="flex flex-1">
                <ViewportSidebar />
                <div className="flex flex-col flex-1">
                    <div
                        id="columns-container"
                        className={`flex ${isHorizontalLayout ? 'overflow-x-auto' : 'flex-wrap'} gap-4 mt-6 pl-20`}>
                        {
                            columns.map((tasks, columnIndex) => (
                                <div
                                    key={columnIndex}
                                    className={`flex flex-col gap-4 ${isHorizontalLayout ? 'min-w-72 flex-shrink-0' : 'flex-1 min-w-72'}`}>
                                    {
                                        tasks.map((task, taskIndex) => (
                                            <Categorizer
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
                                                onEditCardOpen={resetSelectedEntry}
                                                onAddList={() => addList(columnIndex, taskIndex)}
                                                onMoveEntry={handleMoveEntry} />))
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;