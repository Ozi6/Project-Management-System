import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// New separate component for Manage Access Modal
const ManageAccessModal = ({ member, permissions, onTogglePermission, onClose }) => {
  const {t} = useTranslation();
  const accessOptions = [t("adset.view"), t("adset.edit"), t("adset.del")];

  return (
    <AnimatePresence mode="wait">
      {member && (
        <>
          <motion.div
            className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{ zIndex: 40 }}
          />
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
            <motion.div
              className="bg-white rounded-md w-96 flex flex-col shadow-lg overflow-hidden"
              initial={{ y: "-20%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
            >
              <div className="bg-[var(--features-icon-color)] p-4 shadow-md">
                <h3 className="text-xl font-bold text-white text-center">
                  {member.name}{t("adset.access")}
                </h3>
              </div>
              <div className="p-6 flex flex-col bg-[var(--gray-card2)] gap-4">
                <ul className="space-y-4">
                  {accessOptions.map((option) => (
                    <li
                      key={option}
                      className="flex justify-between items-center"
                    >
                      <span className="text-[var(--features-title-color)]">{option}</span>
                      <div
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${
                          permissions[member.email]?.[option]
                            ? "bg-green-500"
                            : "bg-[var(--bug-report)]"
                        }`}
                        onClick={() => onTogglePermission(member.email, option)}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                          animate={{
                            x: permissions[member.email]?.[option] ? 28 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                          {permissions[member.email]?.[option] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-[var(--bug-report)]" />
                          )}
                        </motion.div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 bg-[var(--bug-report)]/80 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-full"
                  onClick={onClose}
                >
                  {t("bug.close")}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ManageAccessModal;