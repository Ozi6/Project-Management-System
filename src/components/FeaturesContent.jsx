import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutGrid, Users, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesContent = ({ isOpen, setIsOpen }) => {
    const {t } = useTranslation();
    const features = [
        {
            title: t("features1"),
            description: t("features1d"),
            icon: LayoutGrid,
            link: "/features/project-management"
        },
        {
            title: t("features2"),
            description: t("features2d"),
            icon: Users,
            link: "/features/team-collaboration"
        },
        {
            title: t("features3"),
            description: t("features3d"),
            icon: CheckSquare,
            link: "/features/task-tracking"
        }
    ];

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
                height: {
                    duration: 0.4,
                    ease: "easeOut"
                },
                opacity: {
                    duration: 0.3,
                    delay: 0.1
                },
                y: {
                    duration: 0.4,
                    ease: "easeOut"
                },
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            y: -20,
            transition: {
                height: {
                    duration: 0.3,
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 0.2
                },
                y: {
                    duration: 0.3,
                    ease: "easeInOut"
                }
            }
        }
    };

    const item = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.95
        },
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

    const overlay = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        variants={overlay}
                        initial="hidden"
                        animate="show"
                        exit="exit"
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <Link 
                                        to={feature.link} 
                                        key={index}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <motion.div 
                                            variants={item}
                                            className="feature-item p-6 rounded-lg transition-all duration-200"
                                            whileHover={{ 
                                                scale: 1.03, 
                                                backgroundColor: "var(--features-hover-bg)",
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <feature.icon 
                                                className="h-8 w-8 mb-4" 
                                                style={{color: "var(--features-icon-color)"}}
                                            />
                                            <h3 className="text-lg font-semibold "
                                                style={{color: "var(--features-title-color)"}}
                                            >
                                                {feature.title}
                                            </h3>
                                            <p className="mt-1"
                                                style={{color: "var(--features-text-color)"}}
                                            >
                                                {feature.description}
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

export default FeaturesContent;