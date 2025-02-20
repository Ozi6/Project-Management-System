import React from 'react';
import './Homepage.css'; // Assuming you have a CSS file for styling

const Homepage = () => {
    return (
        <div className="homepage">
            <h1>Project Hub</h1>

            <section className="dashboard">
                <h2>Dashboard</h2>
                <ul>
                    <li><strong>Projects</strong></li>
                    <li><strong>Team</strong></li>
                    <li><strong>Calendar</strong></li>
                    <li><strong>Reports</strong></li>
                    <li><strong>Settings</strong></li>
                </ul>
            </section>

            <hr />

            <section className="project">
                <h2>Website Redesign</h2>
                <ul>
                    <li><strong>Progress</strong></li>
                    <li><strong>Due Date:</strong>
                        <ul>
                            <li>In Progress 75%</li>
                            <li>2025-03-15</li>
                        </ul>
                    </li>
                    <li>In Progress 30%</li>
                    <li><strong>Due Date:</strong>
                        <ul>
                            <li>2025-04-01</li>
                        </ul>
                    </li>
                    <li>Complete 100%</li>
                    <li><strong>Due Date:</strong>
                        <ul>
                            <li>2025-02-28</li>
                        </ul>
                    </li>
                </ul>
            </section>

            <hr />

            <section className="project">
                <h2>Mobile App Development</h2>
                <ul>
                    <li><strong>Progress</strong></li>
                    <li><strong>Due Date:</strong>
                        <ul>
                            <li>In Progress 30%</li>
                            <li>2025-04-01</li>
                        </ul>
                    </li>
                    <li>Complete 100%</li>
                </ul>
            </section>
        </div>
    );
};

export default Homepage;