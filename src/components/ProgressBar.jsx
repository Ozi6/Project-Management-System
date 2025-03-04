import React, { useEffect, useState } from 'react';

const ProgressBar = ({ tasks }) => {
    const [progress, setProgress] = useState(0);

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
    }, [tasks]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-2 px-4 z-50">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Progress: {progress}%</span>
                <div className="w-full mx-4 bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
        </div>
    );
};

export default ProgressBar;