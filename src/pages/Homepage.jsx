// src/components/Homepage.jsx
import React from 'react';
import Header from '../components/Header'; // Correct path
import HeroSection from '../components/HeroSection'; // Correct path
import FeaturesSection from '../components/FeaturesSection'; // Correct path
import Footer from '../components/Footer'; // Correct path
import './Homepage.css'; 

const Homepage = () => {
  return (
    <div className="homepage">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Homepage;