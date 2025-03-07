import { useState } from "react";
import { FaCog } from "react-icons/fa"; 
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk
import { UserCheck } from "lucide-react";

const GeneralSettings = ({ setShowAdvanced }) => {
    // Get current user from Clerk
    const { user } = useUser();

    // Hardcoded project owner for demo - replace with actual logic from your backend
    const projectOwner = "emir.ozen.55.6d@gmail.com";
    
    // Check if current user is the project owner
    const isProjectOwner = user?.primaryEmailAddress?.emailAddress === projectOwner || 
                          user?.publicMetadata?.role === "admin";
    
    const [projectName, setProjectName] = useState("My Project");
    const [projectDescription, setProjectDescription] = useState("A brief description of my project.");
    const [backgroundImage, setBackgroundImage] = useState("/src/img_back.jpg"); // Default image
    const [isPublic, setIsPublic] = useState(false);

    const handleBackgroundImageChange = (e) => {
        // Only allow changes if user is project owner
        if (!isProjectOwner) return;
        
        const file = e.target.files[0];
        if (file) {
            setBackgroundImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProject = () => {
        // Only project owners can delete projects
        if (!isProjectOwner) return;
        
        if (window.confirm("Are you sure you want to delete this project?")) {
            // Implement your delete project logic here
            console.log("Project deleted!");
            // Redirect or perform other actions after deletion
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2">
                <FaCog className="text-gray-600 text-3xl" />
                <h2 className="text-3xl font-semibold text-gray-800">General Settings</h2>
            </div>

            {/* Owner status indicator */}
            {!isProjectOwner && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-yellow-500" />
                    You need to be the project owner to modify these settings
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => isProjectOwner && setProjectName(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${
                            isProjectOwner 
                                ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                                : "bg-gray-50 text-gray-500 cursor-not-allowed"
                        } transition-all duration-300 ease-in-out`}
                        disabled={!isProjectOwner}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => isProjectOwner && setProjectDescription(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${
                            isProjectOwner 
                                ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                                : "bg-gray-50 text-gray-500 cursor-not-allowed"
                        } transition-all duration-300 ease-in-out`}
                        disabled={!isProjectOwner}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Update Background Image (800x400)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageChange}
                        className={`block w-full text-sm ${
                            isProjectOwner 
                                ? "text-slate-500 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer" 
                                : "text-gray-400 file:bg-gray-300 file:text-gray-500 cursor-not-allowed opacity-70"
                        } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold`}
                        disabled={!isProjectOwner}
                    />
                    <div className="mt-4 relative w-full h-64 bg-gray-200 rounded-xl shadow-md">
                        <img
                            src={backgroundImage}
                            alt="Project Background"
                            className="w-full h-full object-cover rounded-xl shadow-md"
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    {/* Advanced Settings Button - always available but with different styling based on ownership */}
                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        Advanced Settings
                    </button>

                    {/* Delete Project Button - disabled for non-owners */}
                    <button
                        onClick={handleDeleteProject}
                        className={`bg-red-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out ${
                            isProjectOwner ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isProjectOwner}
                    >
                        Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
