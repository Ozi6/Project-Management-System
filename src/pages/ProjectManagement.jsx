import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";

const ProjectManagement = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();
    
    const handleNewProject = () => {
        navigate('/project/new');
    };
    
    const sampleProjects = [
        { id: 1, name: "Website Redesign", owner: "Alice", role: "Project Manager", progress: 75, status: "In Progress", dueDate: "2025-03-15" },
        { id: 2, name: "Mobile App Development", owner: "Bob", role: "Developer", progress: 30, status: "In Progress", dueDate: "2025-04-01" },
        { id: 3, name: "Database Migration", owner: "Charlie", role: "DB Admin", progress: 100, status: "Completed", dueDate: "2025-02-28" }
    ];
    
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header with shadow to create separation */}
            <div className="w-full bg-white shadow-md z-10">
                <Header
                    title={<span className="text-xl">Project Management</span>} // Changed from default to text-2xl
                    action={{
                        onClick: handleNewProject,
                        icon: <Plus className="mr-2 h-4 w-4" />, // Reduced icon size
                        label: "New Project"
                    }}
                />
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar with distinct styling */}
                <div className="bg-white shadow-lg z-5 border-r border-gray-200">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                {/* Main content area with subtle separation */}
                <div className="flex-1 overflow-auto bg-gray-50">
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
                                    dueDate={project.dueDate}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProjectManagement;