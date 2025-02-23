import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskList from "../components/TaskList";

const ProjectDetails = () =>
{
    const { id } = useParams();
    const initialColumns =
    [
        [
            { title: "A", tagColor: "#8b5cf6", entries: ["Example Entry"] },
            { title: "F", tagColor: "#8b5cf6", entries: ["Example Entry"] },
            { title: "K", tagColor: "#8b5cf6", entries: ["Example Entry"] },
        ],
        [
            { title: "B", tagColor: "#f43f5e", entries: ["Example Entry"] },
            { title: "G", tagColor: "#f43f5e", entries: ["Example Entry"] },
            { title: "L", tagColor: "#8b5cf6", entries: ["Example Entry"] },
        ],
        [
            { title: "C", tagColor: "#f97316", entries: ["Example Entry"] },
            { title: "H", tagColor: "#f97316", entries: ["Example Entry"] },
        ],
        [
            { title: "D", tagColor: "#eab308", entries: ["Example Entry"] },
            { title: "I", tagColor: "#eab308", entries: ["Example Entry"] },
        ],
        [
            { title: "E", tagColor: "#10b981", entries: ["Example Entry"] },
            { title: "J", tagColor: "#10b981", entries: ["Example Entry"] },
        ],
    ];

    const [columns, setColumns] = useState(initialColumns);
    const [containerWidth, setContainerWidth] = useState(0);

    const MIN_COLUMN_WIDTH = 250;

    const redistributeTasks = (width) =>
    {
        const possibleColumns = Math.max(1, Math.floor(width / MIN_COLUMN_WIDTH));

        if(possibleColumns === columns.length)
            return;

        let newColumns;

        /*This if else is the craziest algorithm I've ever written, basically uneven-matrix-resize that keeps a heap balance property for responsivity!
        No AI can replicate this, on God on Donda.*/
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
                    {
                        shortestColumnIndex = i;
                    }
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

            for (let i = columns.length - 2; i >= 0; i--)
            {
                if(columns[i].length > columns[currentColIndex].length)
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
                    if (currentColIndex < 0)
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

    const addEntry = (columnIndex, taskIndex) =>
    {
        const newColumns = [...columns];
        const newEntry = `New Entry ${newColumns[columnIndex][taskIndex].entries.length + 1}`;
        newColumns[columnIndex][taskIndex].entries.push(newEntry);
        setColumns(newColumns);
    };

    useEffect(() =>
    {
        const handleResize = () =>
        {
            const container = document.getElementById("columns-container");
            if(container)
            {
                setContainerWidth(container.offsetWidth);
                redistributeTasks(container.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[columns]);

    return(
        <div className="flex h-screen">
            <Sidebar/>
            <div className="flex flex-col flex-1">
                <Header/>
                <div className="p-6">
                    <h1 className="text-3xl font-bold">Project Details</h1>
                    <p className="text-gray-600 mt-2">Project ID: {id}</p>
                    <Link to="/projects" className="text-blue-500 mt-4 block">
                        ← Back to Projects
                    </Link>
                    <div
                        id="columns-container"
                        className="flex flex-wrap gap-4 mt-6">
                        {
                            columns.map((tasks, columnIndex) => (
                            <div
                                key={columnIndex}
                                className="flex flex-col gap-4 flex-1 min-w-[220px]">
                                {
                                    tasks.map((task, taskIndex) => (
                                    <TaskList
                                        key={taskIndex}
                                        title={task.title}
                                        tagColor={task.tagColor}
                                        entries={task.entries}
                                        onAddEntry={() => addEntry(columnIndex, taskIndex)}/>))
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