import { useNavigate } from "react-router-dom";
import { Calendar, Users, Clock, Trash2, AlertTriangle, X, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProjectCard = ({
    id,
    name,
    description,
    owner,
    progress,
    status,
    isOwner,
    onDelete,
    teamMembers,
    dueDate,
    lastUpdated
}) => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
          
          setLanguage(i18n.language);
          
        }, [i18n.language]);

    // Handle delete button click
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };
    
    // Handle confirming deletion
    const confirmDelete = (e) => {
        e.stopPropagation();
        onDelete && onDelete(id);
        setShowDeleteConfirm(false);
    };
    
    // Handle canceling deletion
    const cancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                className="bg-[var(--gray-card1)] rounded-lg shadow p-6 border-1 border-[var(--sidebar-projects-color)] cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200 relative overflow-hidden"
                onClick={() => navigate(`/project/${id}`, { state: { isOwner } })}
            >
                <div className="bg-[var(--features-icon-color)] rounded-lg p-3 mb-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
                            {isOwner && (
                                <span className="text-yellow-300 text-lg">👑</span>
                            )}
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-200 text-red-900"
                            }`}
                        >
                            {status === "Completed" ? t("procard.comp") : t("procard.in")}
                        </span>
                    </div>
                </div>
                
                {/* Project description */}
                <p className="text-sm text-[var(--features-title-color)] line-clamp-2 mb-3">
                    {description}
                </p>
                
                {/* Project metadata */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 text-[var(--text-color3)] mr-2" />
                        <span className="text-sm text-[var(--features-text-color)]">{t("procard.team")}: {teamMembers}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[var(--text-color3)] mr-2" />
                        <span className="text-sm text-[var(--features-text-color)]">{t("procard.due")}: {dueDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[var(--text-color3)] mr-2" />
                        <span className="text-sm text-[var(--features-text-color)]">{t("procard.upd")}:&nbsp;
                        {new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR': 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        }).format(new Date(lastUpdated))}</span>
                    </div>
                </div>
                
                <div className="mb-4">
                    <p className="text-sm text-[var(--features-title-color)] font-medium mb-1">
                        {t("procard.own")}: {owner}
                    </p>
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-[var(--features-icon-color)]">{t("procard.prog")}</span>
                        <span className="text-sm text-[var(--features-icon-color)]">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`rounded-full h-2 ${
                                status === "Completed" ? "bg-green-500" : 
                                progress > 75 ? "bg-blue-600" :
                                progress > 30 ? "bg-yellow-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Delete button */}
                {isOwner ? (<div className="mt-5 flex justify-end">
                    <button
                        onClick={handleDeleteClick}
                        className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {t("procard.del")}
                    </button>
                </div>)
                :
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleDeleteClick}
                        className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center"
                    >
                        <DoorOpen className="h-3.5 w-3.5 mr-1" />
                        {t("procard.leave")}
                    </button>
                </div>}

            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cancelDelete}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold ml-3 text-gray-800">{t("procard.del")}</h3>
                                <button 
                                    onClick={cancelDelete}
                                    className="ml-auto p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-600">
                                {t("procard.deld")} <span className="font-semibold">{name}</span>? {t("procard.deld2")}
                                </p>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    {t("prode.can")}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    {t("procard.del")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectCard;