import PropTypes from "prop-types";

const AnimatedCheckbox = ({ checked, onChange }) =>
{
    return(
        <label className="relative flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(!checked)}
                className="sr-only peer"/>
            <div className="p-1 rounded-lg border-2 border-[var(--features-icon-color)]">
                <div
                    className={`w-3 h-3 bg-white dark:bg-[var(--features-icon-color)]/80 rounded-md shadow-lg transition-all duration-300 relative z-0
                        ${checked ? "bg-transparent shadow-none" : "shadow-md"}`}
                ></div>
                <div
                    className={`absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-600 rounded-md transition-transform z-10
                    ${checked ? "animate-fade-in" : "animate-fade-out"}`}
                ></div>
                <div
                    className={`absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-600 rounded-md transition-transform z-15
                    ${checked ? "animate-explosion block" : "hidden"}`}
                ></div>
                <svg
                    className={`w-4 h-4 text-white transition-all duration-300 stroke-current absolute z-20
                        ${checked ? "animate-draw-checkmark" : "animate-erase-checkmark"}`}
                    style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline
                        points="4 12 9 17 20 6"
                        style=
                        {
                            {
                                strokeDasharray: 22,
                                strokeDashoffset: checked ? 0 : 22,
                                transition: "stroke-dashoffset 350ms cubic-bezier(0.83, 0.05, 0.62, 1)",
                            }
                        }/>
                </svg>
            </div>
            <style jsx>
                {
                    `
                    @keyframes explosion{
                        0%{
                            transform: scale(0);
                            opacity: 0;
                        }30%{
                            opacity: 1;
                        }70%{
                            transform: scale(1.6);
                            opacity: 0.3;
                        }100%{
                            transform: scale(2); /* Explode and disappear */
                            opacity: 0;
                            visibility: hidden; /* Hide the explosion after animation */
                        }
                    }@keyframes fade-in{
                        0%{
                            opacity: 0;
                        }100%{
                            opacity: 1;
                        }
                    }@keyframes fade-out {
                        0%{
                            opacity: 1;
                        }100%{
                            opacity: 0;
                            visibility: hidden; /* Hide after animation */
                        }
                    }@keyframes draw-checkmark {
                        0%{
                            stroke-dashoffset: 22;
                        }100%{
                            stroke-dashoffset: 0;
                        }
                    }@keyframes erase-checkmark{
                        0%{
                            stroke-dashoffset: 0;
                        }100%{
                            stroke-dashoffset: 22;
                        }
                    }.animate-explosion{
                        animation: explosion 0.6s ease-out forwards;
                    }.animate-fade-in{
                        animation: fade-in 200ms cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }.animate-fade-out{
                        animation: fade-out 200ms cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }.animate-draw-checkmark{
                        animation: draw-checkmark 350ms cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }.animate-erase-checkmark{
                        animation: erase-checkmark 350ms cubic-bezier(0.83, 0.05, 0.62, 1) forwards;
                    }
                    `
                }
            </style>
        </label>
    );
};

AnimatedCheckbox.propTypes =
{
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default AnimatedCheckbox;