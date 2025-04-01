import { useState } from "react";
import { FaCog } from "react-icons/fa"; 
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const GeneralSettings = ({ setShowAdvanced, isOwner }) => {
    const {t} = useTranslation();
    const { user } = useUser();
    
    // Check if current user is the project owner
    const isProjectOwner = isOwner || false;
    
    const [projectName, setProjectName] = useState(t("set.named"));
    const [projectDescription, setProjectDescription] = useState(t("set.dd"));
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
        
        if (window.confirm(t("set.warn"))) {
            // Implement your delete project logic here
            console.log(t("set.warn.ok"));
            // Redirect or perform other actions after deletion
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto bg-[var(--gray-card3)] p-6 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2">
                <FaCog className="text-[var(--features-title-color)] text-3xl" />
                <h2 className="text-3xl font-semibold text-[var(--features-text-color)]">{t("set.gen")}</h2>
            </div>

            {/* Owner status indicator */}
            {!isProjectOwner && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-yellow-500" />
                    {t("set.per")}
                </div>
            )}

            <div className="bg-[var(--bg-color)] rounded-xl bg-[var(--bg-color)] shadow-lg p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color3)]">{t("set.name")}</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => isProjectOwner && setProjectName(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${
                            isProjectOwner 
                                ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                                : "bg-[var(--gray-card3)]/20 text-[var(--text-color3)]/50 cursor-not-allowed"
                        } transition-all duration-300 ease-in-out`}
                        disabled={!isProjectOwner}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color3)]">{t("set.d")}</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => isProjectOwner && setProjectDescription(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${
                            isProjectOwner 
                                ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                                : "bg-[var(--gray-card3)]/20 text-[var(--text-color3)]/50"
                        } transition-all duration-300 ease-in-out`}
                        disabled={!isProjectOwner}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--features-text-color)]">{t("set.update")} (800x400)</label>
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
                    <div className="mt-4 relative w-full h-64 bg-[var(--gray-card3)]/30 rounded-xl shadow-md">
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
                        className="bg-[var(--features-icon-color)]/50 hover:bg-[var(--hover-color)] !text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        {t("set.advanced")}
                    </button>

                    {/* Delete Project Button - disabled for non-owners */}
                    <button
                        onClick={handleDeleteProject}
                        className={`bg-red-500 !text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out ${
                            isProjectOwner ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isProjectOwner}
                    >
                        {t("set.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
