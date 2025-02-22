import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Features = ({ isOpen, toggleOpen }) => {
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="text-lg text-gray-600 hover:text-blue-600 transition duration-200 flex items-center"
      >
        Features {isOpen ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-screen bg-white shadow-lg mt-2 py-6 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">Project Management</h3>
                <p className="text-gray-600">Streamline your projects with our intuitive tools.</p>
              </div>
              <div className="p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Work together seamlessly with your team.</p>
              </div>
              <div className="p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">Task Tracking</h3>
                <p className="text-gray-600">Keep track of progress and deadlines efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;