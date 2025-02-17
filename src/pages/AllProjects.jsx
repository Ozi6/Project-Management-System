import { Link } from "react-router-dom";
import Sidebar from '../frontend/Sidebar';
import TopBar from '../frontend/TopBar';

const projects = [  //using this because we dont have a db yet.
    { id: 1, name: "a" },
    { id: 2, name: "b" }
];

function AllProjects()
{
    return (
        <>
            <TopBar />
            <Sidebar />
            <div>
                <h1>All Projects</h1>
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <Link to={`/project/${project.id}`}>{project.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default AllProjects;