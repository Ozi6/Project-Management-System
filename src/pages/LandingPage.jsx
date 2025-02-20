// src/components/Homepage.jsx
import React from 'react';
import Header from '../components/Header'; // Correct path
import HeroSection from '../components/HeroSection'; // Correct path
import FeaturesSection from '../components/FeaturesSection'; // Correct path
import Footer from '../components/Footer'; // Correct path
//import Topbar from '../components/Topbar'; // Correct path
import './LandingPage.css'; 

const LandingPage = () => {
  return (
    <div className="landingpage">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;