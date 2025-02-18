// src/components/HeroSection.jsx
import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>PlanWise: Your Project Management Solution</h1>
        <p>Organize, track, and collaborate on your projects with ease.</p>
        <a href="/projects" className="cta-button">Get Started</a>
      </div>
    </section>
  );
};

export default HeroSection;