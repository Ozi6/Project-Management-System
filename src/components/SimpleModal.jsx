import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SimpleModal = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white p-6 rounded-md shadow-lg w-80"
          initial={{ y: "-20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "20%", opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <h2 className="text-xl font-bold mb-4">Test Modal</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 w-full rounded-md"
            placeholder="Type something..."
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleModal;
