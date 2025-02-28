import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { v4 as uuidv4 } from "uuid";

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

    const [activeProjects, setProject] = useState(sampleProjects);
    const [isAddProjectPopUpOpen, setIsAddProjectPopUpOpen] = useState(false);

    const openPopUp = () => {
        setIsAddProjectPopUpOpen(true);
    }
    const closePopUp = () => {
        setIsAddProjectPopUpOpen(false);
    }

    const [newProjectDetails, setNewProjectDetails] = useState(
        {
            name: "",
            owner: "",
            role: "",
            progress: 0,
            status: "In progress",
            dueDate: "",
        }
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProjectDetails({
            ...newProjectDetails,
            [name]: value,
        });
    };


    const addNewProject = () => {
        //do stuff so that a new project is added to the sample Projects
        const newProject =
        {
            id: uuidv4(),
            name: newProjectDetails.name,
            owner: newProjectDetails.owner,
            role: newProjectDetails.role,
            progress: 0,
            status: "In progress",
            dueDate: newProjectDetails.dueDate,

        }
        
        setProject([...activeProjects, newProject]);
        setIsAddProjectPopUpOpen(false);

    };
    
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header with shadow to create separation */}
            <div className="w-full bg-white shadow-md z-10">
                <Header
                    title={<span className="text-xl">Project Management</span>} // Changed from default to text-2xl
                    action={{
                        onClick: openPopUp,
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
                            {activeProjects.map((project, projectIndex) => (
                                <ProjectCard
                                    projectIndex={projectIndex}
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    owner={project.owner}
                                    role={project.role}
                                    progress={project.progress}
                                    status={project.status}
                                    dueDate={project.dueDate}

                                    onAddNewProject = {() => addNewProject(projectIndex)}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>



            {isAddProjectPopUpOpen && (
                <div className="fixed inset-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.3)] w-96">
                        <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewProject();
                            }}
                        >
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProjectDetails.name}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    value={newProjectDetails.owner}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={newProjectDetails.role}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={newProjectDetails.dueDate}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={closePopUp}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Add Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ProjectManagement;