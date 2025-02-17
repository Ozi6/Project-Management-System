import { Link } from "react-router-dom";
import Sidebar from '../frontend/Sidebar';
import TopBar from '../frontend/TopBar';
import ProjectCard from '../frontend/Components/ProjectCard'

const projects = [  //using this because we dont have a db yet.
    { id: 1, name: "DAG", owner: "Ozan NURCAN", role: "Developer", teamSize: 3, progress: 50 },
    { id: 2, name: "The Eye of Rah Tycoon 2", owner: "Elif BATCI", role: "Developer", teamSize: 2, progress: 90 }
];


function AllProjects()
{
    return(
        <>
            <TopBar />
            <Sidebar />
            <div>
                <h1>All Projects</h1>
                {/*proje kartlarý*/}
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            owner={project.owner}
                            role={project.role}
                            teamSize={project.teamSize}
                            progress={project.progress}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default AllProjects;