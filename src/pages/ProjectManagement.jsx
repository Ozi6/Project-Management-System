import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, SortAsc, User, Heart } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


const ProjectManagement = () => {
    const [activeTab, setActiveTab] = useState("projects");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    // Event Handlers
    const onTaskChange = (taskId, newStartDate, newEndDate) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, start: newStartDate, end: newEndDate } : task
            )
        );
    };

    const onProgressChange = (taskId, newProgress) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, progress: newProgress } : task
            )
        );
    };

    const onTaskDelete = taskId => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    const onDblClick = taskId => {
        console.log(`Task with ID ${taskId} was double clicked`);
    };

    const onClick = taskId => {
        console.log(`Task with ID ${taskId} was clicked`);
    };

    const handleNewProject = () => {
        navigate('/project/new');
    };
    
    const sampleProjects = [
        { id: 1, name: "Website Redesign", owner: "Alice", role: "Project Manager", progress: 75, status: "In Progress", isOwner: true },
        { id: 2, name: "Mobile App Development", owner: "Bob", role: "Developer", progress: 30, status: "In Progress", isOwner: false },
        { id: 3, name: "Database Migration", owner: "Charlie", role: "DB Admin", progress: 100, status: "Completed", isOwner: false }
    ];

    const [activeProjects, setProject] = useState(sampleProjects);
    const [isAddProjectPopUpOpen, setIsAddProjectPopUpOpen] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(activeProjects);

    const openPopUp = () => {
        setIsAddProjectPopUpOpen(true);
    }
    
    const closePopUp = () => {
        setIsAddProjectPopUpOpen(false);
    }

    const [newProjectDetails, setNewProjectDetails] = useState({
        name: "",
        owner: "",
        role: "",
        progress: 0,
        status: "In Progress",
        dueDate: "",
    });

    useEffect(() => {
        let result = activeProjects;
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(project => 
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.owner.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (filterStatus !== "all") {
            result = result.filter(project => 
                project.status.toLowerCase() === filterStatus.toLowerCase()
            );
        }
        
        setFilteredProjects(result);
    }, [activeProjects, searchTerm, filterStatus]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProjectDetails({
            ...newProjectDetails,
            [name]: value,
        });
    };

    const addNewProject = () => {
        const newProject = {
            id: uuidv4(),
            name: newProjectDetails.name,
            owner: newProjectDetails.owner,
            role: newProjectDetails.role,
            progress: 0,
            status: "In Progress",
            isOwner: true,
        };
        
        setProject([...activeProjects, newProject]);
        setNewProjectDetails({
            name: "",
            owner: "",
            role: "",
            progress: 0,
            status: "In Progress",
            isOwner: "",
        });
        setIsAddProjectPopUpOpen(false);
    };
    
    return (
        <div className="flex flex-col h-screen bg-pink-50">
            {/* Header with shadow */}
            <div className="w-full bg-white shadow-sm z-10 border-b-2 border-pink-100">
                <Header
                    title={<span className="text-xl font-semibold text-pink-800">Projects</span>}
                    action={{
                        onClick: openPopUp,
                        icon: <Plus className="mr-2 h-4 w-4" />,
                        label: "New Project"
                    }}
                />
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar with improved styling */}
                <div className="bg-white shadow-md z-5 border-r border-pink-100">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="flex-1 overflow-auto bg-gray-50">
                    <main className="p-6 h-full w-full">
                        {activeTab === "calendar" ? <GanttChart fullPage={true} /> : 
                         activeTab === "teams" ? (
                            <Teams />  
                        ) : (
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
                        )}
                    </main>
                </div>
                
                {/* Main content area with better organization */}
                <div className="flex-1 overflow-auto bg-pink-50 flex flex-col">
                    <div className="p-6 space-y-6 flex-grow">
                        {/* Search and filters bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                            <div className="relative w-full md:w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="bg-white border border-pink-200 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 p-2.5"
                                    placeholder="Search projects or team members"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <select 
                                        className="bg-white border border-pink-200 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 appearance-none pr-8"
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        value={filterStatus}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                                
                                
                            </div>
                        </div>
                        
                        {/* Project stats summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-200">
                                <h3 className="text-sm text-pink-600 font-medium">Total Projects</h3>
                                <p className="text-2xl font-bold text-pink-800">{activeProjects.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-200">
                                <h3 className="text-sm text-pink-600 font-medium">In Progress</h3>
                                <p className="text-2xl font-bold text-pink-600">
                                    {activeProjects.filter(p => p.status === "In Progress").length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-200">
                                <h3 className="text-sm text-pink-600 font-medium">Completed</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {activeProjects.filter(p => p.status === "Completed").length}
                                </p>
                            </div>
                        </div>
                        
                        {/* Projects grid with animations */}
                        <div>
                            <h2 className="text-lg font-semibold text-pink-800 mb-4">
                                {searchTerm || filterStatus !== "all" ? "Filtered Projects" : "All Projects"}
                            </h2>
                            
                            {filteredProjects.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-pink-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">No projects found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter settings</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ProjectCard
                                                projectIndex={index}
                                                id={project.id}
                                                name={project.name}
                                                owner={project.owner}
                                                role={project.role}
                                                progress={project.progress}
                                                status={project.status}
                                                isOwner={project.isOwner}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Compact Footer with pink accents */}
                    <div className="bg-white border-t border-pink-100 py-3 px-6">
                        <div className="flex flex-row justify-between items-center text-xs text-pink-600">
                            <div>
                                <span>© 2025 PlanWise</span>
                                <span className="hidden sm:inline"> • All rights reserved</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/terms" className="hover:text-pink-800 transition-colors">Terms</Link>
                                <Link to="/privacy" className="hover:text-pink-800 transition-colors">Privacy</Link>
                                <span className="flex items-center">
                                    Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by PlanWise
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal with pink accents */}
            <AnimatePresence>
                {isAddProjectPopUpOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-gray-800/10 w-full max-w-md ring-2 ring-gray-900/5 ring-opacity-75"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="inline-block w-12 h-1.5 bg-pink-600 rounded-full mb-2"></span>
                                    <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
                                </div>
                                <button 
                                    onClick={closePopUp}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    addNewProject();
                                }}
                                className="space-y-5"
                            >
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newProjectDetails.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Enter project name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">Project Owner</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="owner"
                                            name="owner"
                                            value={newProjectDetails.owner}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            required
                                            placeholder="Project owner"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={newProjectDetails.role}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select your role</option>
                                        <option value="Project Manager">Project Manager</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Designer">Designer</option>
                                        <option value="DB Admin">DB Admin</option>
                                        <option value="QA Tester">QA Tester</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={newProjectDetails.dueDate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={closePopUp}
                                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-7 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors flex items-center shadow-sm hover:shadow-md font-medium"
                                    >
                                        <Plus className="h-4 w-4 mr-1.5" />
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectManagement;