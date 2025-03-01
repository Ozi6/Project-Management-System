// src/components/Homepage.jsx
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const Homepage = () => {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header 
        isSignedIn={isSignedIn} 
        userName={user?.firstName || 'there'} 
      />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
