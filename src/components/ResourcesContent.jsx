import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, FileText, HelpCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResourcesContent = ({ isOpen, setIsOpen }) => {
    const {t}=useTranslation();
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
            title: t("resources1"),
            description: t("resources1d"),
            icon: Users,
            link: "/about"
        },
        {
            title: t("resources2"),
            description: t("resources2d"),
            icon: HelpCircle,
            link: "/faq"
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
                        className="w-full border-b shadow-lg relative z-40"
                        style={{
                            backgroundColor: "var(--features-bg)",
                            borderColor: "var(--features-border)",
                          }}
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
                                                backgroundColor: "var(--features-icon-bg)",
                                                transition: { duration: 0.3 }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <resource.icon 
                                                className="h-6 w-6 mb-3" 
                                                style={{color: "var(--features-icon-color)"}}
                                            />
                                            <h3 className="text-lg font-semibold"
                                                style={{color: "var(--features-title-color)"}}
                                            >
                                                {resource.title}
                                            </h3>
                                            <p className="mt-1"
                                                style={{color: "var(--features-text-color)"}}
                                            >
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