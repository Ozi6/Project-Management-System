import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import AnimatedCheckbox from "./AnimatedCheckbox";
import { AnimatePresence } from "framer-motion";
import ListEntryPopup from "./ListEntryPopup";

const ListEntry = ({
    text,
    isNew,
    isSelected,
    onClick,
    entryId,
    onDragStart,
    onDragEnd,
    onDrop,
    isDragging,
    isDraggedOver,
    dragPosition
}) => {
    const [checked, setChecked] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isDraggingThis, setIsDraggingThis] = useState(false);
    const entryRef = useRef(null);
    const dragImageRef = useRef(null);
    const mouseOffsetX = useRef(0);
    const mouseOffsetY = useRef(0);
    const isDragOperation = useRef(false);

    const handleClick = (e) =>
    {
        if (!isDragOperation.current)
        {
            onClick(entryId);
        }
    };

    const handleCheckboxChange = (newChecked, e) =>
    {
        if (e)
        {
            e.stopPropagation();
        }

        setChecked(newChecked);
        setHasInteracted(true);
    };

    const handleMouseDown = (e) =>
    {
        let target = e.target;
        while(target && target !== entryRef.current)
        {
            if (target.classList.contains('checkbox-container') ||
                target.closest('.checkbox-container'))
            {
                return;
            }
            target = target.parentElement;
        }

        if (e.button !== 0)
            return;

        isDragOperation.current = false;

        const rect = entryRef.current.getBoundingClientRect();
        mouseOffsetX.current = e.clientX - rect.left;
        mouseOffsetY.current = e.clientY - rect.top;

        let dragStarted = false;

        const startDrag = () =>
        {
            if (!dragStarted) {
                dragStarted = true;
                isDragOperation.current = true;
                setIsDraggingThis(true);
                onDragStart(entryId, text);
                document.addEventListener('mousemove', handleMouseMove);
                document.body.classList.add('dragging');
            }
        };

        const dragTimeout = setTimeout(() =>
        {
            startDrag();
        }, 150);

        const handleMouseMoveStart = (moveEvent) =>
        {
            if (!dragStarted) {
                const dx = moveEvent.clientX - e.clientX;
                const dy = moveEvent.clientY - e.clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 5) {
                    clearTimeout(dragTimeout);
                    startDrag();
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMoveStart);

        const handleMouseUp = () =>
        {
            clearTimeout(dragTimeout);
            document.removeEventListener('mousemove', handleMouseMoveStart);

            if (dragStarted)
            {
                setIsDraggingThis(false);
                onDragEnd();
                document.removeEventListener('mousemove', handleMouseMove);
                document.body.classList.remove('dragging');
            }
            else
            {
                isDragOperation.current = false;
            }

            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) =>
    {
        if (dragImageRef.current)
        {
            dragImageRef.current.style.left = `${e.clientX - mouseOffsetX.current}px`;
            dragImageRef.current.style.top = `${e.clientY - mouseOffsetY.current}px`;
        }
    };


    useEffect(() =>
    {
        return () =>
        {
            document.removeEventListener('mousemove', handleMouseMove);
            document.body.classList.remove('dragging');
        };
    }, []);

    return(
        <div className="relative">
            <div
                ref={entryRef}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                className={`p-2 shadow rounded-md border border-gray-300 flex items-center gap-2 transition-all duration-300 ease-out cursor-grab 
                    ${isNew ? "animate-entryAppear" : ""} 
                    ${isSelected ? "bg-blue-400 border-blue-300" : "bg-white hover:scale-105 hover:shadow-lg"}
                    ${isDraggingThis ? "opacity-20" : ""}
                    ${isDraggedOver ? (dragPosition === 'above' ? "border-t-4 border-t-dashed border-t-blue-500 mt-4" : dragPosition === 'below' ? "border-b-4 border-b-dashed border-b-blue-500 mb-4" : "") : ""}`}
            >
                <div className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                    <AnimatedCheckbox
                        checked={checked}
                        onChange={handleCheckboxChange}/>
                </div>
                <span className="relative overflow-hidden">
                    <span
                        className={`absolute inset-0 bg-gray-400 h-0.5 top-1/2 transform -translate-y-1/2 ${checked ? "animate-cross-out" : (hasInteracted ? "animate-uncross-out" : "w-0")}`}/>
                    <span
                        className={`transition-all duration-300 ease-out select-none ${isSelected ? (checked ? "text-gray-200" : "text-white") : (checked ? "text-gray-400" : "text-black")}`}>
                        {text}
                    </span>
                </span>
            </div>

            {isDraggingThis && (
                <div
                    ref={dragImageRef}
                    className="fixed z-50 p-2 shadow rounded-md border border-blue-500 bg-blue-100 flex items-center gap-2 pointer-events-none"
                    style={{
                        width: entryRef.current ? `${entryRef.current.offsetWidth}px` : 'auto',
                        opacity: 0.8
                    }}
                >
                    <AnimatedCheckbox checked={checked} onChange={() => { }} />
                    <span>{text}</span>
                </div>
            )}

            <AnimatePresence>
                {isSelected && <ListEntryPopup onClose={() => onClick(null)} />}
            </AnimatePresence>

            <style jsx>
                {`
                    @keyframes entryAppear {
                        0% {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes cross-out {
                        0% {
                            width: 0%;
                        }
                        100% {
                            width: 100%;
                        }
                    }
                    @keyframes uncross-out {
                        0% {
                            width: 100%;
                        }
                        100% {
                            width: 0%;
                        }
                    }
                    .animate-entryAppear {
                        animation: entryAppear 0.3s ease-out forwards;
                    }
                    .animate-cross-out {
                        animation: cross-out 0.3s cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }
                    .animate-uncross-out {
                        animation: uncross-out 0.3s cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }
                `}
            </style>
        </div>
    );
};

ListEntry.propTypes = {
    text: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    entryId: PropTypes.string.isRequired,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    isDragging: PropTypes.bool,
    isDraggedOver: PropTypes.bool,
    dragPosition: PropTypes.oneOf(['above', 'below', null])
};

ListEntry.defaultProps = {
    isNew: false,
    isDragging: false,
    isDraggedOver: false,
    dragPosition: null,
    onDragStart: () => { },
    onDragEnd: () => { },
    onDrop: () => { }
};

export default ListEntry;