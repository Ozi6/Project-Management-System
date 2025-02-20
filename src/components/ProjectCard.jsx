import { useNavigate } from "react-router-dom";

const ProjectCard = ({ id, name, owner, role, progress, status, dueDate }) =>
{
    const navigate = useNavigate();

    return(
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
            onClick={() => navigate(`/project/${id}`)}>
            <div className="bg-blue-500 rounded-lg p-2 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-300 text-blue-900"}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">{owner}</span>
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Your Role:</span> {role}
                </p>
            </div>
            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <span>Due Date:</span>
                <span>{dueDate}</span>
            </div>
        </div>
    );
};

export default ProjectCard;
