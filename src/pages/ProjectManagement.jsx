import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, KanbanSquare, Users, Calendar, Settings, PieChart, Plus 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleNewProject = () => {
    // Navigate to new project creation page
    navigate('/project/new');
    // Alternatively, you could open a modal here
    // setIsNewProjectModalOpen(true);
  };

  const sampleProjects = [
    { id: 1, name: "Website Redesign", progress: 75, status: "In Progress", dueDate: "2025-03-15" },
    { id: 2, name: "Mobile App Development", progress: 30, status: "In Progress", dueDate: "2025-04-01" },
    { id: 3, name: "Database Migration", progress: 100, status: "Completed", dueDate: "2025-02-28" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Header 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          action={{
            onClick: handleNewProject,
            icon: <Plus className="mr-2 h-5 w-5" />,
            label: "New Project"
          }}
        />

        <main className="p-6">
          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition duration-200"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Due Date:</span>
                  <span>{project.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectManagement;
