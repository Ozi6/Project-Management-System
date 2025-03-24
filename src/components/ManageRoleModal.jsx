import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const ManageRoleModal = ({
  member,
  onClose,
  onUpdateRole,
  roles,
  currentRole,
}) => {
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
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 50 }}
          >
            <motion.div
              className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden"
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
                  Manage Role
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => onUpdateRole(member.id, role)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--features-icon-color)]/10 transition-colors duration-200"
                    >
                      <span className="text-[var(--gray-card3)]">{role}</span>
                      {currentRole === role && (
                        <Check className="w-5 h-5 text-[var(--features-icon-color)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ManageRoleModal;
