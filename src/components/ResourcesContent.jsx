import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourcesContent = ({ isOpen, setIsOpen }) => {
    const container = {
        hidden: { 
            opacity: 0,
            height: 0,
            y: -20
        },
        show: {
            opacity: 1,
            height: "auto",
            y: 0,
            transition: {
                height: { duration: 0.6, ease: "easeOut" },
                opacity: { duration: 0.4, delay: 0.1 },
                y: { duration: 0.6, ease: "easeOut" },
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            y: -20,
            transition: {
                height: { duration: 0.6, ease: "easeInOut" },
                opacity: { duration: 0.4 },
                y: { duration: 0.6, ease: "easeInOut" },
                staggerChildren: 0.05,
                staggerDirection: -1,
                when: "beforeChildren"
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const resources = [
        {
            title: "Documentation",
            description: "Detailed guides and API references",
            icon: BookOpen,
            link: "/docs"
        },
        {
            title: "Video Tutorials",
            description: "Learn through step-by-step videos",
            icon: Video,
            link: "/tutorials"
        },
        {
            title: "Blog",
            description: "Latest updates and best practices",
            icon: FileText,
            link: "/blog"
        },
        {
            title: "Help Center",
            description: "FAQ and support documentation",
            icon: HelpCircle,
            link: "/help"
        }
    ];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                    />
                    
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="w-full bg-white border-b border-gray-200 shadow-lg relative z-40"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {resources.map((resource, index) => (
                                    <Link to={resource.link} key={index}>
                                        <motion.div 
                                            variants={item}
                                            className="p-4 rounded-lg transition-all duration-200"
                                            whileHover={{ 
                                                scale: 1.02, 
                                                backgroundColor: "rgb(249 250 251)",
                                                transition: { duration: 0.3 }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <resource.icon className="h-6 w-6 text-blue-600 mb-3" />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {resource.title}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                {resource.description}
                                            </p>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResourcesContent;