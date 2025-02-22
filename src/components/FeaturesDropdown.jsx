import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FeaturesDropdown = ({ isOpen, setIsOpen }) => {
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
                Features
                {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>
        </div>
    );
};

export default FeaturesDropdown;