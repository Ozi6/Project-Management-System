import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ member, roles, updateRole }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // To reference the dropdown menu
  const buttonRef = useRef(null); // To reference the button

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false); // Close dropdown if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-50">
      {/* Button to trigger dropdown */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center justify-between bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 cursor-pointer"
      >
        {member.role || "No Role"}
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-[200px] bg-white border border-gray-300 rounded-lg shadow-lg z-50"
          style={{
            top: buttonRef.current?.getBoundingClientRect().bottom + window.scrollY,
            left: buttonRef.current?.getBoundingClientRect().left + window.scrollX,
          }}
        >
          <div className="py-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  updateRole(member.id, role);
                  setOpen(false); // Close the dropdown after selecting a role
                }}
                className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 ${
                  member.role === role ? "bg-blue-200 font-bold" : ""
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
