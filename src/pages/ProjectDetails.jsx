import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Categorizer from "../components/Categorizer";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

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
    const [selectedEntry, setSelectedEntry] = useState(null);

    const MIN_COLUMN_WIDTH = 300;
    /*This if else is the craziest algorithm I've ever written, basically uneven-matrix-resize that keeps a heap balance property for responsivity!
    No AI can replicate this, on God on Donda.*/
    const redistributeTasks = (width) =>
    {
        const possibleColumns = Math.max(1, Math.floor(width / MIN_COLUMN_WIDTH));

        if (possibleColumns === columns.length)
            return;

        let newColumns;

        if (possibleColumns < columns.length) {
            const columnsCopy = columns.slice(0, -1);
            const tasksToDistribute = columns[columns.length - 1];
            newColumns = [...columnsCopy];
            tasksToDistribute.forEach((task) => {
                let shortestColumnIndex = 0;
                for (let i = 1; i < newColumns.length; i++) {
                    if (newColumns[i].length < newColumns[shortestColumnIndex].length) {
                        shortestColumnIndex = i;
                    }
                }
                newColumns[shortestColumnIndex].push(task);
            });
            setColumns(newColumns);
        } else {
            const copyColumns = columns.map(col => [...col]);
            copyColumns.push([]);
            const totalTasks = columns.reduce((sum, col) => sum + col.length, 0);
            const tasksPerColumn = Math.floor(totalTasks / copyColumns.length);
            let currentColIndex = columns.length - 1;

            for (let i = columns.length - 2; i >= 0; i--) {
                if (columns[i].length > columns[currentColIndex].length) {
                    currentColIndex = i;
                    break;
                }
            }

            let tasksToMove = tasksPerColumn;
            let currentTaskIndex;

            while (tasksToMove > 0) {
                while (currentColIndex >= 0 && copyColumns[currentColIndex].length === 0) {
                    currentColIndex--;
                    if (currentColIndex < 0) currentColIndex = columns.length - 1;
                }
                currentTaskIndex = copyColumns[currentColIndex].length - 1;
                if (currentTaskIndex >= 0) {
                    const task = copyColumns[currentColIndex].pop();
                    copyColumns[copyColumns.length - 1].unshift(task);
                    tasksToMove--;
                }
                currentColIndex--;
                if (currentColIndex < 0) currentColIndex = columns.length - 1;
            }
            setColumns(copyColumns);
        }
    };

    const addEntry = (columnIndex, taskIndex) => {
        const newColumns = [...columns];
        const newEntry = `New Entry ${newColumns[columnIndex][taskIndex].taskLists[0].entries.length + 1}`;
        newColumns[columnIndex][taskIndex].taskLists[0].entries.push(newEntry);
        setColumns(newColumns);
    };

    const addList = (columnIndex, taskIndex) => {
        const newColumns = [...columns];
        const newList = {
            id: uuidv4(),
            title: `Task List ${newColumns[columnIndex][taskIndex].taskLists.length + 1}`,
            tagColor: newColumns[columnIndex][taskIndex].tagColor,
            entries: [],
        };
        newColumns[columnIndex][taskIndex].taskLists.push(newList);
        setColumns(newColumns);
    };

    const handleEntryClick = (columnIndex, taskIndex) => {
        const entryId = `${columnIndex}-${taskIndex}`;
        setSelectedEntry(selectedEntry === entryId ? null : entryId);
    };

    const resetSelectedEntry = () => {
        setSelectedEntry(null);
    };

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById("columns-container");
            if (container) {
                setContainerWidth(container.offsetWidth);
                redistributeTasks(container.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [columns]);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="p-6">
                    <h1 className="text-3xl font-bold">Project Details</h1>
                    <p className="text-gray-600 mt-2">Project ID: {id}</p>
                    <Link to="/projects" className="text-blue-500 mt-4 block">
                        ← Back to Projects
                    </Link>
                    <div
                        id="columns-container"
                        className="flex flex-wrap gap-4 mt-6">
                        {columns.map((tasks, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="flex flex-col gap-4 flex-1 min-w-72">
                                {tasks.map((task, taskIndex) => (
                                    <Categorizer
                                        key={task.id} // Use category ID as key
                                        title={task.title}
                                        tagColor={task.tagColor}
                                        taskLists={task.taskLists}
                                        isSelected={selectedEntry === `${columnIndex}-${taskIndex}`}
                                        onAddEntry={() => addEntry(columnIndex, taskIndex)}
                                        onClick={() => handleEntryClick(columnIndex, taskIndex)}
                                        onEditCardOpen={resetSelectedEntry}
                                        onAddList={() => addList(columnIndex, taskIndex)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;