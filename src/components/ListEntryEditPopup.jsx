import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaTimes, FaPaperclip, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ListEntryEditPopup = ({ entry, onSave, onClose }) => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        text: "",
        dueDate: "",
        warningThreshold: 1,
        checked: false,
        file: null,
    });

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (entry && !hasInitialized) {
            setFormData({
                text: entry.text || "",
                dueDate: entry.dueDate ? new Date(entry.dueDate).toISOString().split("T")[0] : "",
                warningThreshold: entry.warningThreshold || 1,
                checked: entry.checked || false,
                file: entry.file || null,
            });
            setHasInitialized(true);
        }
    }, [entry, hasInitialized]);

    const handleClose = () => {
        setHasInitialized(false);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                file: files[0] || null, 
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleRemoveFile = () => {
        setFormData((prev) => ({
            ...prev,
            file: null,
        }));
    };

    const warningThreshold = parseInt(formData.warningThreshold, 10);
    const maxThreshold = 365 * 10; //10 years

    const handleSubmit = (e) => {
        e.preventDefault();
        if (warningThreshold > maxThreshold) {
            alert(`Warning threshold cannot be greater than ${maxThreshold} days.`);
            return;
        }

        const updatedEntry = {
            ...entry,
            text: formData.text,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            warningThreshold: parseInt(formData.warningThreshold, 10),
            checked: formData.checked,
            file: formData.file,
        };
        onSave(updatedEntry);
        onClose();
    };

    const clearDueDate = () => {
        setFormData((prev) => ({
            ...prev,
            dueDate: "",
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[var(--features-icon-color)] text-white rounded-t-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t("prode.edit.tit")}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white rounded-full hover:bg-[var(--hover-color)] transition-all duration-200 transform hover:scale-110"
                        >
                            <FaTimes className="text-[var(--features-icon-color)] hover:text-white transition-colors duration-200" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 bg-[var(--bg-color)]">
                    <div className="mb-4">
                        <label className="block text-[var(--features-title-color)] text-sm font-medium mb-1" htmlFor="text">
                            {t("prode.edit.name")}
                        </label>
                        <input
                            type="text"
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            placeholder="Enter task name"
                            className="w-full px-3 py-2 border border-[var(--gray-card3)] bg-[var(--gray-card1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex justify-between">
                            <span className="block text-[var(--features-title-color)] text-sm font-medium mb-1">{t("prode.edit.due")}</span>
                            {formData.dueDate && (
                                <button
                                    type="button"
                                    onClick={clearDueDate}
                                    className="text-xs text-[var(--features-icon-color)] hover:text-[var(--hover-color)]"
                                >
                                    {t("prode.edit.clr")}
                                </button>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[var(--gray-card3)] rounded-md bg-[var(--gray-card1)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] pl-10"
                            />
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--features-icon-color)]" />
                        </div>
                    </div>

                    {formData.dueDate && (
                        <div className="mb-4">
                            <label className="block text-[var(--features-title-color)] text-sm font-medium mb-1" htmlFor="warningThreshold">
                                {t("prode.edit.warn")}
                            </label>
                            <input
                                type="number"
                                id="warningThreshold"
                                name="warningThreshold"
                                value={formData.warningThreshold}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-[var(--gray-card3)] bg-[var(--gray-card1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                            />
                            <p className="text-xs text-[var(--text-color3)] mt-1">
                            {t("prode.edit.warnd")}
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="checked"
                                checked={formData.checked}
                                onChange={handleChange}
                                className="h-4 w-4 text-[var(--features-icon-color)] bg-[var(--gray-card3)] focus:ring-[var(--features-icon-color)]/70 border-[var(--gray-card3)] rounded"
                            />
                            <span className="ml-2 text-[var(--text-color3)] text-sm">{t("prode.edit.mark")}</span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <label className="block text-[var(--features-title-color)] text-sm font-medium mb-1" htmlFor="file">
                        {t("prode.edit.att")}
                        </label>
                        {formData.file && (
                            <div className="flex items-center gap-2 mb-2">
                                <FaPaperclip className="text-[var(--features-icon-color)]" />
                                <span className="text-sm text-gray-700">
                                    {formData.file.name.length > 15
                                        ? formData.file.name.substring(0, 15) + "..." + formData.file.name.substring(formData.file.name.lastIndexOf("."))
                                        : formData.file.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-[var(--bug-report)]/70 hover:text-[var(--bug-report)]"
                                    title="Remove file"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[var(--gray-card3)] bg-[var(--gray-card1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                        />
                        {formData.file && (
                            <p className="text-xs text-[var(--text-color3)] mt-1">
                                {t("prode.edit.attd3")}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-[var(--features-text-colro)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                        >
                            {t("prode.can")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--features-icon-color)] !text-white rounded-md hover:bg-[var(--hover-color)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                        >
                            {t("prode.edit.save")}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

ListEntryEditPopup.propTypes = {
    entry: PropTypes.shape({
        text: PropTypes.string,
        dueDate: PropTypes.instanceOf(Date),
        warningThreshold: PropTypes.number,
        checked: PropTypes.bool,
        entryId: PropTypes.string,
        file: PropTypes.instanceOf(File),
    }),
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ListEntryEditPopup;