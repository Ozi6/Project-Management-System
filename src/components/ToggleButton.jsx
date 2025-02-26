import { useState, useEffect } from 'react';

const ToggleButton = ({ initialChecked, onToggle }) =>
{
    const [isChecked, setIsChecked] = useState(initialChecked || false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() =>
    {
        if(initialChecked !== undefined)
            setIsChecked(initialChecked);
    },[initialChecked]);

    const handleToggle = () =>
    {
        const newState = !isChecked;
        setIsChecked(newState);
        if(onToggle)
            onToggle(newState);
    };

    const handleMouseDown = () =>
    {
        setIsActive(true);
    };

    const handleMouseUp = () =>
    {
        setIsActive(false);
    };

    return(
        <div className="relative inline-block w-41 h-10">
            <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={handleToggle}/>
            <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${isChecked ? 'bg-red-50' : 'bg-blue-50'}`}/>
            <div
                className="absolute inset-0"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onClick={handleToggle}>
                <div
                    className={`
                        absolute top-1 text-center text-white text-xs font-bold
                        ${isChecked ? 'left-20' : 'left-1'}
                        ${isActive && !isChecked ? 'w-28 rounded-full' : ''}
                        ${isActive && isChecked ? 'w-28 -ml-16' : ''}
                        ${!isActive ? 'rounded-full' : ''}
                        flex items-center justify-center
                        transition-all duration-300
                        ${isChecked ? 'bg-red-500' : 'bg-blue-500'}
                    `}
                    style={{
                        transitionTimingFunction: "cubic-bezier(0.18, 0.89, 0.35, 1.15)",
                        height: "32px",
                        width: isActive ? "112px" : (isChecked ? "80px" : "96px")
                    }}>
                    {isChecked ? 'Horizontal' : 'Vertical'}
                </div>
            </div>
        </div>
    );
};

export default ToggleButton;