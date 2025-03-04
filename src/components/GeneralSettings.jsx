import { useState } from "react";
import { FaCog } from "react-icons/fa"; // Import settings icon

const GeneralSettings = ({ setShowAdvanced }) => {
    const [projectName, setProjectName] = useState("My Project");
    const [projectDescription, setProjectDescription] = useState("A brief description of my project.");
    const [backgroundImage, setBackgroundImage] = useState("/src/img_back.jpg"); // Default image
    const [isPublic, setIsPublic] = useState(false);

    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProject = () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            // Implement your delete project logic here
            console.log("Project deleted!");
            // Redirect or perform other actions after deletion
        }
    };

    return (
        
        <div className="space-y-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2">
                <FaCog className="text-gray-600 text-3xl" /> {/* Enlarged icon */}
                <h2 className="text-3xl font-semibold text-gray-800">General Settings</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105 transition-all duration-300 ease-in-out"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105 transition-all duration-300 ease-in-out"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Update Background Image (800x400)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
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
                    {/* Advanced Settings Button */}
                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        Advanced Settings
                    </button>

                    {/* Delete Project Button */}
                    <button
                        onClick={handleDeleteProject}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
