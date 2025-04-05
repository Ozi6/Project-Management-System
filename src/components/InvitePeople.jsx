import { useState } from "react";
import { X, AlertCircle, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const InvitePeople = ({ isOpen, onClose, projectId }) =>
{
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen)
        return null;

    const handleInviteUser = async () =>
    {
        setError("");
        setSuccessMessage("");

        if (!email || !email.includes('@') || !email.includes('.'))
        {
            setError(t("adset.emailInvalid") || "Please enter a valid email address");
            return;
        }

        setLoading(true);

        try{
            await axios.post('http://localhost:8080/api/invitations',
            {
                projectId: projectId,
                email: email
            });

            setSuccessMessage(t("adset.inviteSent") || "Invitation sent successfully!");
            setEmail("");

            setTimeout(() =>
            {
                onClose();
            }, 2000);

        }catch(err){
            console.error("Error sending invitation:", err);
            setError(
                err.response?.data?.message ||
                t("adset.inviteError") ||
                "Failed to send invitation. Please try again."
            );
        }finally{
            setLoading(false);
        }
    };

    const handleInviteByLink = () =>
    {
        const inviteLink = `${window.location.origin}/join-project/${projectId}`;

        navigator.clipboard.writeText(inviteLink)
            .then(() =>
            {
                setSuccessMessage(t("adset.linkCopied") || "Invite link copied to clipboard!");
                setTimeout(() => setSuccessMessage(""), 2000);
            })
            .catch(err =>
            {
                console.error("Failed to copy:", err);
                setError(t("adset.copyError") || "Failed to copy link");
            });
    };

    return(
        <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl text-[var(--features-icon-color)] font-semibold">{t("adset.inv")}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">{t("adset.email")}</label>
                    <input
                        type="email"
                        placeholder={t("adset.emaild")}
                        className="w-full p-2 border rounded text-[var(--features-icon-color)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}/>
                    {error && (
                        <div className="mt-2 text-red-500 flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mt-2 text-green-500 flex items-center text-sm">
                            <Check className="w-4 h-4 mr-1" />
                            {successMessage}
                        </div>
                    )}
                    <button
                        className={`w-full mt-3 bg-[var(--features-icon-color)] !text-white py-2 rounded transition ${loading
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-[var(--hover-color)]'
                            }`}
                        onClick={handleInviteUser}
                        disabled={loading}>
                        {loading ? t("adset.sending") || "Sending..." : t("adset.invite")}
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        className="text-[var(--features-icon-color)] hover:underline"
                        onClick={handleInviteByLink}>
                        {t("adset.link")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePeople;