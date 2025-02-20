import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";

const ProjectManagement = () =>
{
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    const handleNewProject = () =>
    {
        navigate('/project/new');
    };

    const sampleProjects =
    [
        { id: 1, name: "Website Redesign", owner: "Alice", role: "Project Manager", progress: 75, status: "In Progress", dueDate: "2025-03-15" },
        { id: 2, name: "Mobile App Development", owner: "Bob", role: "Developer", progress: 30, status: "In Progress", dueDate: "2025-04-01" },
        { id: 3, name: "Database Migration", owner: "Charlie", role: "DB Admin", progress: 100, status: "Completed", dueDate: "2025-02-28" }
    ];

    return(
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 overflow-auto">
                <Header
                    title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    action={{
                        onClick: handleNewProject,
                        icon: <Plus className="mr-2 h-5 w-5" />,
                        label: "New Project"
                    }}/>

                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sampleProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                owner={project.owner}
                                role={project.role}
                                progress={project.progress}
                                status={project.status}
                                dueDate={project.dueDate}/>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default ProjectManagement;