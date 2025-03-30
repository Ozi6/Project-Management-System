import { useState } from "react";
import { X } from "lucide-react"; // Close icon
import { useTranslation } from "react-i18next";

const InvitePeople = ({ isOpen, onClose }) => {
    const {t} = useTranslation();
    if (!isOpen) return null; // Hide modal if not open

    return (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {/* Modal Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl text-[var(--features-icon-color)] font-semibold">{t("adset.inv")}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Email Input Form */}
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">{t("adset.email")}</label>
                    <input
                        type="email"
                        placeholder={t("adset.emaild")}
                        className="w-full p-2 border rounded text-[var(--features-icon-color)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]/50"
                    />
                    <button className="w-full mt-3 bg-[var(--features-icon-color)] !text-white py-2 rounded hover:bg-[var(--hover-color)] transition">
                    {t("adset.invite")}
                    </button>
                </div>

                {/* Invite by Link Button */}
                <div className="mt-4 text-center">
                    <button className="text-[var(--features-icon-color)] hover:underline">
                    {t("adset.link")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePeople;
