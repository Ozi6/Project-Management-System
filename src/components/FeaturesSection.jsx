// src/components/FeaturesSection.jsx
import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="features">
      <h2>Why Choose PlanWise?</h2>
      <div className="features-grid">
        <div className="feature">
          <h3>Task Management</h3>
          <p>Easily create, assign, and track tasks.</p>
        </div>
        <div className="feature">
          <h3>Collaboration</h3>
          <p>Work seamlessly with your team in real-time.</p>
        </div>
        <div className="feature">
          <h3>Customizable Boards</h3>
          <p>Tailor your boards to fit your workflow.</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;