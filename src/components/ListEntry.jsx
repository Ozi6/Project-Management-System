import PropTypes from "prop-types";
import { useState } from "react";
import AnimatedCheckbox from "./AnimatedCheckbox";
import { AnimatePresence } from "framer-motion";
import ListEntryPopup from "./ListEntryPopup";

const ListEntry = ({ text, isNew, isSelected, onClick }) => {
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        onClick(); // Notify parent of click
    };

    return (
        <div className="relative">
            <div
                onClick={handleClick}
                className={`p-2 shadow rounded-md border border-gray-300 flex items-center gap-2 transition-all duration-300 ease-out cursor-pointer
                    ${isNew ? "animate-entryAppear" : ""}
                    ${isSelected ? "bg-blue-400 border-blue-300" : "bg-white hover:scale-105 hover:shadow-lg"}`}>
                <AnimatedCheckbox checked={checked} onChange={setChecked} />
                <span className="relative overflow-hidden">
                    <span
                        className={`absolute inset-0 bg-gray-400 h-0.5 top-1/2 transform -translate-y-1/2 
                            ${checked ? "animate-cross-out" : "animate-uncross-out"}`}></span>
                    <span
                        className={`transition-all duration-300 ease-out 
                            ${isSelected ? (checked ? "text-gray-200" : "text-white") : (checked ? "text-gray-400" : "text-black")}`}>
                        {text}
                    </span>
                </span>
            </div>

            <AnimatePresence>
                {isSelected && <ListEntryPopup onClose={() => onClick()} />}
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
};

ListEntry.defaultProps = {
    isNew: false,
};

export default ListEntry;