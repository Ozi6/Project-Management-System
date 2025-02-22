import React from 'react';
import { motion } from 'framer-motion';

const FeaturesContent = ({ isOpen }) => {
    if (!isOpen) return null;

    const container = {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="w-full bg-white border-t border-b border-gray-200 shadow-sm overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div 
                        variants={item}
                        className="feature-item hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">Project Management</h3>
                        <p className="text-gray-600 mt-1">Efficiently manage your projects with our intuitive tools.</p>
                    </motion.div>
                    <motion.div 
                        variants={item}
                        className="feature-item hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">Team Collaboration</h3>
                        <p className="text-gray-600 mt-1">Work seamlessly with your team members in real-time.</p>
                    </motion.div>
                    <motion.div 
                        variants={item}
                        className="feature-item hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">Task Tracking</h3>
                        <p className="text-gray-600 mt-1">Keep track of all your tasks and deadlines in one place.</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturesContent;