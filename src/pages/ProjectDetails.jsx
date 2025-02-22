import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskList from "../components/TaskList";

const ProjectDetails = () => {
    const { id } = useParams();
    const [columns, setColumns] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);

    // Initial task lists
    const initialColumns = [
        [
            { title: "A", tagColor: "#8b5cf6" },
            { title: "F", tagColor: "#8b5cf6" },
            { title: "K", tagColor: "#8b5cf6" },
        ],
        [
            { title: "B", tagColor: "#f43f5e" },
            { title: "G", tagColor: "#f43f5e" },
            { title: "L", tagColor: "#8b5cf6" },
        ],
        [
            { title: "C", tagColor: "#f97316" },
            { title: "H", tagColor: "#f97316" },
        ],
        [
            { title: "D", tagColor: "#eab308" },
            { title: "I", tagColor: "#eab308" },
        ],
        [
            { title: "E", tagColor: "#10b981" },
            { title: "J", tagColor: "#10b981" },
        ],
    ];

    const MIN_COLUMN_WIDTH = 250;

    const redistributeTasks = (width) =>
    {
        const possibleColumns = Math.max(1, Math.floor(width / MIN_COLUMN_WIDTH));

        if(possibleColumns === columns.length)
            return;

        const allTasks = columns.flat();

        const newColumns = Array.from({ length: possibleColumns }, () => []);
        allTasks.forEach((task, index) =>
        {
            const columnIndex = index % possibleColumns;
            newColumns[columnIndex].push(task);
        });

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
        return() => window.removeEventListener("resize", handleResize);
    },[columns]);

    useEffect(() =>
    {
        setColumns(initialColumns);
    },[]);

    return(
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
                        {
                            columns.map((tasks, columnIndex) => (
                                <div
                                    key={columnIndex}
                                    className="flex flex-col gap-4 flex-1 min-w-[220px]">
                                    {
                                        tasks.map((task, taskIndex) =>(
                                        <TaskList
                                            key={taskIndex}
                                            title={task.title}
                                            tagColor={task.tagColor}/>
                                        ))
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