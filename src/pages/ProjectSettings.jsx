import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Changed from ViewportSidebar
import AdvancedSettings from "../components/AdvancedSettings";
import GeneralSettings from "../components/GeneralSettings";
import Header from "../components/Header"; // Added Header import
import { KanbanSquare, Layout, Settings, Users as UsersIcon, Activity } from "lucide-react"; // Import icons

const ProjectSettings = () => {
    const [activeTab, setActiveTab] = useState("settings"); // Set default active tab to settings
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Custom navigation items for the sidebar
    const customNavItems = [
        { 
            id: 'dashboard', 
            icon: Layout, 
            label: 'Dashboard', 
            path: '/dashboard',
            color: 'bg-blue-100 text-blue-600',  
            iconColor: 'text-blue-600',     
            defaultColor: true
        },
        { 
            id: 'projects', 
            icon: KanbanSquare, 
            label: 'This Project', 
            path: '/project/1',
            color: 'bg-purple-100 text-purple-600',
            iconColor: 'text-purple-600'
        },
        { 
            id: 'activity', 
            icon: Activity, 
            label: 'Activity',
            path: '/activity',
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        { 
            id: 'teams', 
            icon: UsersIcon, 
            label: 'Teams',
            path: '/teams',
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        { 
            id: 'settings', 
            icon: Settings, 
            label: 'Settings',
            path: '/project/settings',
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="w-full bg-white shadow-sm z-10">
                <Header
                    title={<span className="text-xl font-semibold text-gray-800">Project Settings</span>}
                />
            </div>

            <div className="flex flex-1">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    customNavItems={customNavItems} 
                />
                <div className="flex-1 overflow-y-auto p-6">
                    {showAdvanced ? (
                        <AdvancedSettings setShowAdvanced={setShowAdvanced} />  // Passing the state setter to navigate back
                    ) : (
                        <GeneralSettings setShowAdvanced={setShowAdvanced} />  // Passing the state setter to show advanced settings
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;
