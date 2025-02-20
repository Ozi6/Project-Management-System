import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";



const ProjectDetails = () => {
  const { id } = useParams();

  return (
    
    <div className="p-6">
      <h1 className="text-3xl font-bold">Project Details</h1>
      <p className="text-gray-600 mt-2">Project ID: {id}</p>
      <Link to="/projects" className="text-blue-500 mt-4 block">← Back to Projects</Link>
    </div>
  );
};

export default ProjectDetails;