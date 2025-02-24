import { useState } from "react";
import { X } from "lucide-react"; // Close icon

const InvitePeople = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Hide modal if not open

    return (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {/* Modal Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Invite People</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Email Input Form */}
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email..."
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Invite
                    </button>
                </div>

                {/* Invite by Link Button */}
                <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:underline">
                        Invite by Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePeople;
