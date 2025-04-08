import { useState, useEffect } from "react";
import { FaCog, FaSave } from "react-icons/fa";
import { useUser, useAuth } from "@clerk/clerk-react";
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const GeneralSettings = ({ setShowAdvanced, projectId }) => {
    const { t } = useTranslation();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    // Remove isOwner prop and fetch it from backend
    const [isProjectOwner, setIsProjectOwner] = useState(false);
    const [projectName, setProjectName] = useState(t("set.name"));
    const [projectDescription, setProjectDescription] = useState(t("set.dd"));
    const [backgroundImage, setBackgroundImage] = useState("/src/img_back.jpg");
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isLoaded || !user || !projectId)
            return;

        const fetchData = async () => {
            try {
                const token = await getToken();
                
                // Fetch ownership status from backend
                const ownershipResponse = await axios.get(
                    `http://localhost:8080/api/projects/${projectId}/isOwner`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'userId': user.id
                        },
                    }
                );
                setIsProjectOwner(ownershipResponse.data.isOwner);
                
                // Fetch project details
                const detailsResponse = await axios.get(
                    `http://localhost:8080/api/projects/${projectId}/details`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const projectData = detailsResponse.data;
                
                if(projectData.projectName)
                    setProjectName(projectData.projectName);
                setProjectDescription(projectData.description);
                if(projectData.dueDate)
                    setDueDate(new Date(projectData.dueDate).toISOString().split('T')[0]);
                if(projectData.backgroundImage)
                    setBackgroundImage(`data:image/jpeg;base64,${projectData.backgroundImage}`);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching project data:', err);
                setError('Failed to load project settings');
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoaded, projectId, user, getToken]);

    const handleBackgroundImageChange = (e) =>
    {
        if(!isProjectOwner)
            return;

        const file = e.target.files[0];
        if(file)
        {
            setBackgroundImageFile(file);
            setBackgroundImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteProject = () =>
    {
        if(!isProjectOwner)
            return;

        if(window.confirm(t("set.warn")))
            console.log(t("set.warn.ok"));
    };

    const handleSaveChanges = async () => {
        // We'll still keep this check in the frontend for UI responsiveness
        if (!isProjectOwner || !projectId)
            return;
            
        setSaving(true);
        setSaveSuccess(false);

        try {
            const token = await getToken();

            const formData = new FormData();
            formData.append('projectName', projectName);
            formData.append('description', projectDescription);
            formData.append('dueDate', dueDate ? new Date(dueDate).toISOString().substring(0, 10) : null);

            if (backgroundImageFile)
                formData.append('backgroundImage', backgroundImageFile);

            const response = await axios.put(
                `http://localhost:8080/api/projects/${projectId}/update`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'userId': user.id
                    }
                }
            );

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Permission denied: Only the project owner can update project details');
            } else {
                console.error('Error updating project:', err);
                setError('Failed to update project settings');
            }
        } finally {
            setSaving(false);
        }
    };

    if(loading)
    {
        return (
            <div className="space-y-6 max-w-2xl mx-auto bg-[var(--gray-card3)] p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-center h-64">
                    <p className="text-[var(--text-color3)]">Loading project settings...</p>
                </div>
            </div>
        );
    }

    if(error)
    {
        return (
            <div className="space-y-6 max-w-2xl mx-auto bg-[var(--gray-card3)] p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return(
        <div className="space-y-6 max-w-2xl mx-auto bg-[var(--gray-card3)] p-6 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2">
                <FaCog className="text-[var(--features-title-color)] text-3xl" />
                <h2 className="text-3xl font-semibold text-[var(--features-text-color)]">{t("set.gen")}</h2>
            </div>

            {!isProjectOwner && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-yellow-500" />
                    {t("set.per")}
                </div>
            )}

            {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center">
                    <FaSave className="w-5 h-5 mr-2 text-green-500" />
                    Project settings saved successfully!
                </div>
            )}

            <div className="bg-[var(--bg-color)] rounded-xl bg-[var(--bg-color)] shadow-lg p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color3)]">{t("set.name")}</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => isProjectOwner && setProjectName(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${isProjectOwner
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
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${isProjectOwner
                            ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                            : "bg-[var(--gray-card3)]/20 text-[var(--text-color3)]/50"
                            } transition-all duration-300 ease-in-out`}
                        disabled={!isProjectOwner}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-color3)]">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => isProjectOwner && setDueDate(e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 ${isProjectOwner
                            ? "hover:shadow-lg hover:scale-105 focus:shadow-xl focus:scale-105"
                            : "bg-[var(--gray-card3)]/20 text-[var(--text-color3)]/50 cursor-not-allowed"
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
                        className={`block w-full text-sm ${isProjectOwner
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
                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="bg-[var(--features-icon-color)]/50 hover:bg-[var(--hover-color)] !text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        {t("set.advanced")}
                    </button>

                    {isProjectOwner && (
                        <button
                            onClick={handleSaveChanges}
                            disabled={saving}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 !text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out"
                        >
                            <FaSave className="h-4 w-4" />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}

                    <button
                        onClick={handleDeleteProject}
                        className={`bg-red-500 !text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out ${isProjectOwner ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
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