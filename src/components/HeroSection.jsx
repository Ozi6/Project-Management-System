// src/components/HeroSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/projects');
  };

  return (
    <section className="relative bg-gray-900 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-tight text-white">
              Transform Your Project Management with{' '}
              <span className="text-blue-500">PlanWise</span>
            </h1>
            <p className="text-xl text-gray-300">
              Streamline collaboration, boost productivity, and deliver projects 
              successfully with our powerful project management solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold 
                hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-white px-8 py-3 rounded-lg 
                font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300">
                Watch Demo
              </button>
            </div>
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div>
                <h3 className="text-3xl font-bold text-green-500">Manage Projects 24/7</h3>
                <p className="text-gray-300">Stay on Track, Anytime</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-500">100%</h3>
                <p className="text-gray-300">Secure</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-500">Free</h3>
                <p className="text-gray-300">To Start</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="relative lg:pl-6">
            <div className="relative z-10 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent"></div>
              <img
                src="https://placehold.co/800x600/111827/4F46E5?text=Dashboard+Preview"
                alt="Project Dashboard"
                className="w-full h-auto relative z-10"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gray-800/50 rounded-full filter blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 24L60 32C120 40 240 56 360 64C480 72 600 72 720 64C840 56 960 40 1080 32C1200 24 1320 24 1380 24L1440 24V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0V24Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;