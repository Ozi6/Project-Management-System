import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, Filter, User, Heart, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useUser, useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from 'axios';

const ProjectManagement = () => {
    const [activeTab, setActiveTab] = useState("projects");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    
    useEffect(() => {
        if (!isLoaded) return;

        const fetchProjects = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`http://localhost:8080/api/projects/user/${user.id}/related`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const projects = response.data.map(project => ({
                    projectId: project.projectId,
                    projectName: project.projectName,
                    description: project.description,
                    ownerId: project.owner?.userId,
                    categories: project.categories || [],
                    isOwner: project.owner?.userId === user.id,
                    progress: calculateProgress(project.categories),
                    status: determineStatus(project.categories),
                }));

                setActiveProjects(projects);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects');
                setLoading(false);
            }
        };

        fetchProjects();
    }, [isLoaded, getToken, user]);

    const calculateProgress = (categories) => {
        if (!categories?.length) return 0;

        const allListEntries = categories.flatMap(category =>
            category.taskLists?.flatMap(taskList => taskList.entries) || []
        );

        if (!allListEntries.length) return 0;

        const totalEntries = allListEntries.length;
        const completedEntries = allListEntries.filter(entry => entry.isChecked).length;

        return Math.round((completedEntries / totalEntries) * 100);
    };

    const determineStatus = (categories) => {
        if (!categories?.length) return "In Progress";

        const allListEntries = categories.flatMap(category =>
            category.taskLists?.flatMap(taskList => taskList.entries) || []
        );

        if (!allListEntries.length) return "In Progress";

        const allCompleted = allListEntries.every(entry => entry.isChecked);
        return allCompleted ? "Completed" : "In Progress";
    };

    const [isAddProjectPopUpOpen, setIsAddProjectPopUpOpen] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(activeProjects);

    const openPopUp = () => {
        setIsAddProjectPopUpOpen(true);
    }
    
    const closePopUp = () => {
        setIsAddProjectPopUpOpen(false);
    }

    const [newProjectDetails, setNewProjectDetails] = useState({
        project_name: "",
        Description: "",
    });

    useEffect(() => {
        let result = activeProjects;
        
        if (searchTerm) {
            result = result.filter(project => 
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.owner.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
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


    const addNewProject = async () => {
        try {
            const token = await getToken();
            const projectData = {
                projectName: newProjectDetails.project_name,
                description: newProjectDetails.Description,
                createdAt: new Date().toISOString(),
                owner: {
                    userId: user.id,
                    email: user.primaryEmailAddress?.emailAddress || "unknown@example.com",
                    username: user.fullName || user.username || "Unknown User"
                },
                members: [],
                teams: [],
                categories: []
            };
    
            const response = await axios.post('http://localhost:8080/api/projects', projectData,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const newProject = {
                ProjectID: response.data.projectId, // Note: matching backend response field
                project_name: response.data.projectName,
                Description: response.data.description,
                OwnerID: user.id,
                Categories: [],
                isOwner: true,
                progress: 0,
                status: "In Progress",
            };
    
            setActiveProjects([...activeProjects, newProject]);
            setNewProjectDetails({
                project_name: "",
                Description: "",
            });
            setIsAddProjectPopUpOpen(false);
        } catch(error) {
            console.error("Error creating project:", error);
        }
    };

    const deleteProject = async (projectId) =>
    {
        if (!isLoaded || !user)
            return;

        try{
            const token = await getToken();
            await axios.delete(`http://localhost:8080/api/projects/${projectId}`,
            {
                withCredentials: true,
                headers:
                {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedProjects = activeProjects.filter(project => project.id !== projectId);
            setActiveProjects(updatedProjects);
        }catch(error){
            console.error("Error deleting project:", error);
            //handle error (show notification maybe toast)
        }
    };

    useEffect(() =>
    {
        const handleResize = () =>
        {
            if (window.innerWidth >= 768)
                setIsMobileSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() =>
    {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleMobileSidebar = () =>
    {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };
    
    return(
        <div className="flex flex-col h-screen bg-[var(--sidebar-projects-bg-color)]">
            <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-[var(--sidebar-projects-bg-color)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--sidebar-projects-color)]">Projects</span>}
                    action={{
                        onClick: openPopUp,
                        icon: <Plus className="mr-2 h-4 w-4" />,
                        label: "New Project"
                    }}
                />
            </div>
            
            <div className="flex flex-1 overflow-hidden relative">
                <button 
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--sidebar-projects-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--sidebar-projects-color2)] transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                <button 
                    onClick={openPopUp}
                    className="md:hidden fixed bottom-4 right-20 z-50 bg-[var(--features-icon-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--hover-color)] transition-colors"
                    aria-label="Create new project"
                >
                    <Plus size={24} />
                </button>

                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-[var(--sidebar-projects-bg-color)]">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-[var(--bg-color)]">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                )}
                
                <div className="flex-1 overflow-auto bg-[var(--projects-bg)] flex flex-col">
                    <div className="md:hidden mx-6 mt-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--bg-color)] p-4 rounded-xl shadow-lg border-2 border-[var(--sidebar-projects-color)] hover:shadow-xl transition-all duration-300"
                            onClick={openPopUp}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-[var(--sidebar-projects-bg-color)] p-2 rounded-lg mr-3">
                                        <Plus className="h-5 w-5 text-[var(--sidebar-projects-color)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[var(--text-color3)]">Start a new project</h3>
                                        <p className="text-sm text-[var(--text-color3)]">Create and manage</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-[var(--sidebar-projects-color)]" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="p-6 space-y-6 flex-grow">
                        {/* Search and filters bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                            <div className="relative w-full md:w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="bg-[var(--bg-color)] border border-[var(--sidebar-projects-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
                                    placeholder="Search projects or team members"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <select 
                                        className="bg-[var(--bg-color)] border border-[var(--sidebar-projects-bg-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--sidebar-projects-color)] focus:border-purple-500 block w-full p-2.5 appearance-none pr-8"
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        value={filterStatus}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--features-icon-color)] pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Project stats summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border-1 border-[var(--sidebar-projects-color)]">
                                <h3 className="text-sm text-[var(--sidebar-projects-color)] font-medium">Total Projects</h3>
                                <p className="text-2xl font-bold text-[var(--sidebar-projects-color)]">{activeProjects.length}</p>
                            </div>
                            <div className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border-1 border-[var(--sidebar-projects-color)]">
                                <h3 className="text-sm text-[var(--sidebar-projects-color)] font-medium">In Progress</h3>
                                <p className="text-2xl font-bold text-[var(--sidebar-projects-color)]">
                                    {activeProjects.filter(p => p.status === "In Progress").length}
                                </p>
                            </div>
                            <div className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border-1 border-[var(--sidebar-projects-color)]">
                                <h3 className="text-sm text-[var(--sidebar-projects-color)] font-medium">Completed</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {activeProjects.filter(p => p.status === "Completed").length}
                                </p>
                            </div>
                        </div>
                        
                        {/* Projects grid with animations */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--sidebar-projects-color)] mb-4">
                                {searchTerm || filterStatus !== "all" ? "Filtered Projects" : "All Projects"}
                            </h2>
                            
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">Loading projects...</h3>
                                </div>
                            ) : error ? (
                                <div className="text-center py-10">
                                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--features-title-color)]">Error loading projects</h3>
                                    <p className="text-[var(--text-color3)]">{error}</p>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-[var(--sidebar-projects-color)]" />
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--features-text-color)]">No projects found</h3>
                                    <p className="text-[var(--features-title-color)]">Try adjusting your search or filter settings</p>
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
                                                key={project.ProjectID}
                                                ProjectID={project.ProjectID}
                                                project_name={project.project_name}
                                                Description={project.Description}
                                                OwnerID={project.OwnerID}
                                                isOwner={project.isOwner}
                                                progress={project.progress}
                                                status={project.status}
                                                onDelete={deleteProject}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Compact Footer with purple accents */}
                    <div className="bg-[var(--bg-color)] border-t border-[var(--sidebar-projects-bg-color)] py-3 px-6">
                        <div className="flex flex-row justify-between items-center text-xs text-[var(--sidebar-projects-color)]">
                            <div>
                                <span>© 2025 PlanWise</span>
                                <span className="hidden sm:inline"> • All rights reserved</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/terms" className="hover:text-[var(--features-title-color)] transition-colors">Terms</Link>
                                <Link to="/privacy" className="hover:text-[var(--features-text-color)] transition-colors">Privacy</Link>
                                <span className="flex items-center">
                                    Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by PlanWise
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal with purple accents */}
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
                            className="bg-[var(--bg-color)] p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-gray-800/10 w-full max-w-md ring-2 ring-gray-900/5 ring-opacity-75"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="inline-block w-12 h-1.5 bg-[var(--sidebar-projects-color)] rounded-full mb-2"></span>
                                    <h2 className="text-2xl font-bold text-[var(--features-text-color)]">Create New Project</h2>
                                </div>
                                <button 
                                    onClick={closePopUp}
                                    className="p-2 rounded-full text-[var(--features-title-color)] hover:bg-[var(--features-hover-bg)] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--features-title-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    <label htmlFor="name" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        id="project_name"
                                        name="project_name"
                                        value={newProjectDetails.project_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--features-text-color)] rounded-lg focus:ring-2 focus:ring-[var(--sidebar-projects-color)] focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Enter project name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={newProjectDetails.dueDate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 text-[var(--features-text-color)] rounded-lg focus:ring-2 focus:ring-[var(--sidebar-projects-color)] focus:border-transparent transition-all duration-200"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {isLoaded && user && (
                                    <div className="flex items-center mt-1 space-x-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden">
                                            {user.profileImageUrl ? (
                                                <img src={user.profileImageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700 text-xs">
                                                    {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Project will be created by {user.fullName || user.username}
                                        </p>
                                    </div>
                                )}

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
                                        className="px-7 !text-white py-2.5 rounded-lg bg-[var(--sidebar-projects-color)] hover:bg-[var(--hover-color)] transition-colors flex items-center shadow-sm hover:shadow-md font-medium"
                                    >
                                        <Plus className="h-4 w-4 mr-1.5 text-white" />
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