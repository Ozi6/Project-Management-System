import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressBar = ({ tasks }) => {
    const [progress, setProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Update window dimensions when resized
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!tasks || tasks.length === 0)
            return;

        let totalEntries = 0;
        let checkedEntries = 0;

        tasks.forEach(column => {
            column.forEach(task => {
                if (task.taskLists) {
                    task.taskLists.forEach(list => {
                        if (list.entries) {
                            totalEntries += list.entries.length;
                            checkedEntries += list.entries.filter(entry => entry.checked).length;
                        }
                    });
                }
            });
        });

        const calculatedProgress = totalEntries > 0 ? Math.floor((checkedEntries / totalEntries) * 100) : 0;
        setProgress(calculatedProgress);
        
        // Show confetti when progress reaches 100%
        if (calculatedProgress === 100 && totalEntries > 0) {
            setShowConfetti(true);
            // Hide confetti after 8 seconds
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [tasks]);

    // Color gradient based on progress
    const getProgressColor = () => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <>
            {/* Confetti overlay */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.2}
                />
            )}
            
            {/* Achievement popup */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <div className="bg-white px-8 py-4 rounded-lg shadow-2xl border-2 border-green-500">
                            <h3 className="text-2xl font-bold text-green-600">All Tasks Complete! 🎉</h3>
                            <p className="text-gray-600">Great job completing all your tasks!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-2 px-4 z-40">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progress: {progress}%</span>
                    <div className="w-full mx-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`${getProgressColor()} h-2.5 rounded-full`}
                        />
                    </div>
                    <span className={`text-sm font-medium ${progress === 100 ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                        {progress === 100 ? '🎉 100%' : `${progress}%`}
                    </span>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;