import { useRef, useEffect } from "react";

const CustomDropdown = ({ options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative inline-block text-left w-40" ref={dropdownRef}>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option}
              className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 ${
                selected === option ? "font-bold text-blue-600" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevents immediate closing
                onSelect(option);
                setTimeout(() => onToggle(false), 150); // Delays closing to allow updates
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
