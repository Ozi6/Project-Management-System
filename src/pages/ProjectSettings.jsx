import { useState } from "react";
import SettingsSidebar from "../components/SettingsSidebar";
import AdvancedSettings from "../components/AdvancedSettings";
import GeneralSettings from "../components/GeneralSettings";





const ProjectSettings = () => {
    const [activeTab, setActiveTab] = useState("members");

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
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-6">{renderSettingsContent()}</div>
        </div>
    );
};

export default ProjectSettings;
