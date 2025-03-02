import { useState } from 'react';

const ToggleButton = ({ isChecked }) =>
{
    const [isActive, setIsActive] = useState(false);

    const handleMouseDown = () =>
    {
        setIsActive(true);
    };

    const handleMouseUp = () =>
    {
        setIsActive(false);
    };

    return(
        <div className="relative inline-block w-30 h-10">
            <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                readOnly/>
            <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${isChecked ? 'bg-red-50' : 'bg-blue-50'}`}/>
            <div
                className="absolute inset-0"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}>
                <div
                    className={`
                        absolute top-1 text-center text-white text-xs font-bold
                        ${isChecked ? 'right-1' : 'left-1'}
                        ${isActive ? 'w-16' : ''}
                        flex items-center justify-center
                        transition-all duration-300
                        rounded-full
                    `}
                    style={{
                        transitionTimingFunction: "cubic-bezier(0.18, 0.89, 0.35, 1.15)",
                        height: "32px",
                        width: isActive ? "112px" : isChecked ? "80px" : "80px",
                        transform: isChecked && isActive ? 'translateX(0px)' : 'translateX(0)',
                        background: isActive
                            ? 'linear-gradient(to right, rgba(59, 130, 246, 1), rgba(239, 68, 68, 1))' : isChecked ? 'rgba(239, 68, 68, 1)' : 'rgba(59, 130, 246, 1)',
                    }}
                >
                    {isChecked ? 'Horizontal' : 'Vertical'}
                </div>
            </div>
        </div>
    );
};

export default ToggleButton;