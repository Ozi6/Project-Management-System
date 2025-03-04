import { useState } from "react";
import SettingsSidebar from "../components/SettingsSidebar";
import AdvancedSettings from "../components/AdvancedSettings";
import GeneralSettings from "../components/GeneralSettings";
import ViewportSidebar from "../components/ViewportSidebar";





const ProjectSettings = () => {
    const [activeTab, setActiveTab] = useState("members");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const renderSettingsContent = () => {
        switch (activeTab) {
            case "general":
                return <GeneralSettings />;
            case "advanced":
                return <AdvancedSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="flex">
            <ViewportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {showAdvanced ? (
                <AdvancedSettings setShowAdvanced={setShowAdvanced} />  // Passing the state setter to navigate back
            ) : (
                <GeneralSettings setShowAdvanced={setShowAdvanced} />  // Passing the state setter to show advanced settings
            )}
        </div>
    );
};

export default ProjectSettings;
