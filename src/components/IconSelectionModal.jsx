import React, { useState } from 'react';
import { FaUsers, FaCogs, FaLightbulb, FaChartBar, FaFolder, FaDatabase, FaServer, FaCode, FaCog, FaDesktop, FaPaintBrush } from "react-icons/fa";
import { MdGroupAdd, MdAssignment, MdWork, MdBuild, MdFolderOpen } from "react-icons/md";
import { IoMdPeople, IoMdSettings } from "react-icons/io";

const IconSelectionModal = ({ onSelectIcon, onClose }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const iconMap = {
    Users: FaUsers, // Represents a group of users/team
    Cog: FaCogs, // Represents settings/tools
    LightBulb: FaLightbulb, // Represents ideas/innovation
    ChartBar: FaChartBar, // Represents progress/analytics
    Folder: FaFolder, // Represents organization/files
    AddGroup: MdGroupAdd, // Represents adding a group
    Assignment: MdAssignment, // Represents tasks/assignments
    Work: MdWork, // Represents work-related actions
    Build: MdBuild, // Represents building/project tasks
    FolderOpen: MdFolderOpen, // Represents open project files
    People: IoMdPeople, // Represents people (group/team)
    Settings: IoMdSettings, // Represents settings
    FaDatabase: FaDatabase,
    FaServer: FaServer,
    FaCode: FaCode,
    FaCog: FaCog,
    FaDesktop: FaDesktop,
    FaPaintBrush: FaPaintBrush 
  };
  
  // All project-related icons
  const allIcons = [
    { name: "Users", icon: FaUsers },
    { name: "Cogs", icon: FaCogs },
    { name: "LightBulb", icon: FaLightbulb },
    { name: "ChartBar", icon: FaChartBar },
    { name: "Folder", icon: FaFolder },
    { name: "AddGroup", icon: MdGroupAdd },
    { name: "Assignment", icon: MdAssignment },
    { name: "Work", icon: MdWork },
    { name: "Build", icon: MdBuild },
    { name: "FolderOpen", icon: MdFolderOpen },
    { name: "People", icon: IoMdPeople },
    { name: "Settings", icon: IoMdSettings },
    { name: "Database", icon: FaDatabase },
    { name: "Server", icon: FaServer },
    { name: "Code", icon: FaCode },
    { name: "Cog", icon: FaCog },
    { name: "Desktop", icon: FaDesktop },
    { name: "PaintBrush", icon: FaPaintBrush },
  ];
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  
    return (
      <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-96 p-6 flex flex-col items-center shadow-lg">
          <h3 className="text-xl font-bold mb-4">Select an Icon</h3>
  
          <div className="relative">
            {/* Button to open menu */}
            <button
              onClick={toggleMenu}
              className="bg-[var(--features-icon-color)] text-white px-4 py-2 rounded"
            >
              Choose Icon
            </button>
  
            {/* Menu with icons */}
            {isMenuOpen && (
              <div className="absolute z-10 bg-white border rounded shadow-lg mt-2 w-full">
                <div className="grid grid-cols-5 gap-2 p-2">
                  {allIcons.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => {
                        onSelectIcon(name);
                        setIsMenuOpen(false); // Close the menu after selection
                      }}
                      className="p-2 rounded hover:bg-gray-200 flex items-center justify-center"
                    >
                      <Icon className="h-8 w-8" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  export default IconSelectionModal;