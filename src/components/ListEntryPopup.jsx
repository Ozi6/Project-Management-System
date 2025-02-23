import { motion } from "framer-motion";

const ListEntryPopup = ({ onClose }) =>
{
    return(
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-0 left-full ml-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden z-50">
            <div className="max-h-40 overflow-y-auto">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200">
                    Edit
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200">
                    Assign
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200">
                    Delete
                </button>
            </div>
        </motion.div>
    );
};

export default ListEntryPopup;