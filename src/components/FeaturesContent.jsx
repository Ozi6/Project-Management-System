import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesContent = ({ isOpen, setIsOpen }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const container = {
        hidden: { opacity: 0, y: -10 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const overlay = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: {
                duration: 0.15,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        variants={overlay}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30"
                    />
                    
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="w-full bg-white border-b border-gray-200 shadow-lg relative z-40"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Feature items */}
                                <motion.div 
                                    variants={item}
                                    className="feature-item hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
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
                </>
            )}
        </AnimatePresence>
    );
};

export default FeaturesContent;