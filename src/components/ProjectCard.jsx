import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./ProjectCard.css";

function ProjectCard({ id, name, owner, role, teamSize, progress }) {
    return(
        <Link to={`/project/${id}`} className="project-card-link">
            <div className="project-card">
                <div className="card-header">
                    <h2 className="project-name">{name}</h2>
                </div>
                <div className="card-body">
                    <p className="project-info"><strong>Owner:</strong> {owner}</p>
                    <p className="project-role"><strong>Role:</strong> {role}</p>
                    <p className="project-team"><strong>Team Size:</strong> {teamSize}</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width:`${progress}%`}}></div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

ProjectCard.propTypes =
{
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    teamSize: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired
};

export default ProjectCard;
