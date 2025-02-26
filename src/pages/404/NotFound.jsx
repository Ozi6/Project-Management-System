import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          {/* 404 Text with Animation */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.6 
            }}
          >
            <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          {/* Decorative Element */}
          <div className="relative w-full max-w-md mx-auto h-2 bg-gray-100 rounded-full mb-10">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            ></motion.div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Link to="/" className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            
            <button 
              onClick={handleGoBack}
              className="flex items-center justify-center bg-transparent border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" />
              Go Back
            </button>
          </div>
          
          {/* Search Suggestion */}
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-4">Or try searching for what you need:</p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search PlanWise..."
                className="w-full py-3 px-5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          {/* Common Links */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Popular pages you might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/features/project-management" className="text-blue-600 hover:text-blue-800 text-sm">
                Project Management
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/features/team-collaboration" className="text-blue-600 hover:text-blue-800 text-sm">
                Team Collaboration
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/features/task-tracking" className="text-blue-600 hover:text-blue-800 text-sm">
                Task Tracking
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/about" className="text-blue-600 hover:text-blue-800 text-sm">
                About Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;