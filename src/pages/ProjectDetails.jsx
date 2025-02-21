import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskList from "../components/TaskList";

const ProjectDetails = () =>
{
    const { id } = useParams();
    const [responsiveColumns, setResponsiveColumns] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const initialColumns =
    [
        [
            { title: "Backlog", tagColor: "#8b5cf6" },
            { title: "Backlog", tagColor: "#8b5cf6" }
        ],
        [
            { title: "To Do", tagColor: "#f43f5e" },
            { title: "To Do", tagColor: "#f43f5e" }
        ],
        [
            { title: "In Progress", tagColor: "#f97316" },
            { title: "In Progress", tagColor: "#f97316" }
        ],
        [
            { title: "Review", tagColor: "#eab308" },
            { title: "Review", tagColor: "#eab308" }
        ],
        [
            { title: "Done", tagColor: "#10b981" },
            { title: "Done", tagColor: "#10b981" }
        ],
        [
            { title: "Archived", tagColor: "#6366f1" },
            { title: "Archived", tagColor: "#6366f1" }
        ]
    ];

    const MIN_COLUMN_WIDTH = 220;

    const redistributeTasks = (width) =>
    {
        const possibleColumns = Math.floor(width / MIN_COLUMN_WIDTH);
        if(possibleColumns <= 0)
            return;
        const allTasks = initialColumns.flat();
        const tasksPerColumn = Math.ceil(allTasks.length / possibleColumns);
        const newColumns = Array.from({ length: possibleColumns }, () => []);
        allTasks.forEach((task, index) =>
        {
            const columnIndex = Math.floor(index / tasksPerColumn);
            newColumns[columnIndex].push(task);
        });
        setResponsiveColumns(newColumns);
    };

    useEffect(() =>
    {
        const handleResize = () =>
        {
            const container = document.getElementById('columns-container');
            if(container)
            {
                setContainerWidth(container.offsetWidth);
                redistributeTasks(container.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        {responsiveColumns.map((tasks, columnIndex)=>(
                            <div
                                key={columnIndex}
                                className="flex flex-col gap-4 flex-1 min-w-[220px]">
                                {tasks.map((task, taskIndex)=>(
                                    <TaskList
                                        key={taskIndex}
                                        title={task.title}
                                        tagColor={task.tagColor}/>))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProjectDetails;