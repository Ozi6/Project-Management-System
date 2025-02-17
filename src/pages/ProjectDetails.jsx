import { useParams } from "react-router-dom";
import Sidebar from '../frontend/Sidebar';
import TopBar from '../frontend/TopBar';
import Dragable from '../frontend/Dragable';

const projects = [
    { id: 1, name: "a" },
    { id: 2, name: "b" }
];

function ProjectDetails() {
    const { id } = useParams();
    const project = projects.find((p) => p.id.toString() === id);

    return (
        <>
            <Dragable />
            <TopBar />
            <Sidebar />
            <div>
                <h1>Project Details</h1>
                {project ? (
                    <p>Showing details for project: {project.name}</p>
                ) : (
                    <p>Project not found</p>
                )}
            </div>
        </>
    );
}

export default ProjectDetails;
