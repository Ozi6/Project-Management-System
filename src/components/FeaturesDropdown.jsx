import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesDropdown = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200 relative group"
        >
            <span className="relative">
                Features
                <motion.span 
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ 
                        width: isOpen ? '100%' : 0,
                        transition: { 
                            duration: 0.25,
                            ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic-bezier for smoother motion
                        }
                    }}
                    whileHover={{ width: '100%', transition: { duration: 0.2 } }}
                />
            </span>
            
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    mass: 0.8,  // Lower mass for quicker response
                    velocity: 2 // Initial velocity for more immediacy
                }}
                className="ml-1 flex items-center justify-center"
            >
                <ChevronDown className="h-5 w-5 text-current" />
            </motion.div>
            
            {/* Enhanced ripple effect when dropdown is toggled */}
            <AnimatePresence>
                {isOpen && (
                    <motion.span
                        className="absolute -inset-3 rounded-lg bg-blue-50/70"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: [0, 0.3, 0], 
                            scale: [0.8, 1.05, 1]
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ 
                            duration: 0.5, 
                            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth expansion
                            times: [0, 0.2, 1] // Control timing of keyframes
                        }}
                        style={{ zIndex: -1 }}
                    />
                )}
            </AnimatePresence>
        </button>
    );
};

export default FeaturesDropdown;