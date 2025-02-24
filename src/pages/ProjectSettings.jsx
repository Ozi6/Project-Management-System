import { useState } from "react";
import SettingsSidebar from "../components/SettingsSidebar";
import ManageMembers from "../components/ManageMembers";
import ManageAccess from "../components/ManageAccess"


const ManageTeams = () => (
    <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Teams</h2>
        <p>Team management options go here...</p>
    </div>
);

const ProjectSettings = () => {
    const [activeTab, setActiveTab] = useState("members");

    const renderSettingsContent = () => {
        switch (activeTab) {
            case "members":
                return <ManageMembers />;
            case "access":
                return <ManageAccess />;
            case "teams":
                return <ManageTeams />;
            default:
                return <div>Select an option from the sidebar</div>;
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
