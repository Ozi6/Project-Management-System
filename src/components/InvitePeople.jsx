import { useState, useEffect } from "react";
import { X, AlertCircle, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const InvitePeople = ({ isOpen, onClose, projectId }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [members, setMembers] = useState([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() =>
    {
        if(!isOpen)
            return;

        const fetchMembers = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(
                    `http://localhost:8080/api/projects/${projectId}/members`,
                    {
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const membersData = response.data.map(member => (
                {
                    id: member.userId,
                    email: member.email,
                }));

                setMembers(membersData);
            }catch(err){
                console.error('Error fetching members:', err);
            }
        };
        fetchMembers();
    },[isOpen, projectId]);

    if(!isOpen)
        return null;

    const isEmailAlreadyMember = () =>
    {
        return members.some(member => member.email.toLowerCase() === email.toLowerCase());
    };

    const handleInviteUser = async () =>
    {
        setError("");
        setSuccessMessage("");

        if(!email || !email.includes('@') || !email.includes('.'))
        {
            setError(t("adset.emailInvalid") || "Please enter a valid email address");
            return;
        }

        setIsChecking(true);
        try{
            if(isEmailAlreadyMember())
            {
                setError(t("adset.alreadyMember") || "This user is already a member of the project");
                return;
            }
        }finally{
            setIsChecking(false);
        }

        setLoading(true);

        try{
            console.log(email);
            console.log(members);
            await axios.post('http://localhost:8080/api/invitations',
            {
                projectId: projectId,
                email: email
            });

            setSuccessMessage(t("adset.inviteSent") || "Invitation sent successfully!");
            setEmail("");

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error("Error sending invitation:", err);
            setError(
                err.response?.data?.message ||
                t("adset.inviteError") ||
                "Failed to send invitation. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInviteByLink = async () => {
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try{
            const token = await getToken();
            const response = await axios.post(
                `http://localhost:8080/api/invitations/general/${projectId}`,
                {},
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log("Invitation response:", response.data);

            //Format: http://localhost:5173/invitations/3?token=abc123-def456
            const inviteLink = `${window.location.origin}/invitations/${response.data.invitationId}?token=${response.data.token}`;

            window.focus();

            await navigator.clipboard.writeText(inviteLink);
            setSuccessMessage(t("adset.linkCopied") || "Invite link copied to clipboard!");
            setTimeout(() => setSuccessMessage(""), 2000);
        }catch(err){
            console.error("Error generating invite link:", err);
            setError(
                err.response?.data?.message ||
                t("adset.linkError") ||
                "Failed to generate invite link. Please try again."
            );
        } finally {
            setLoading(false);
        }
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
                        disabled={loading || isChecking} />
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
                        className={`w-full mt-3 bg-[var(--features-icon-color)] !text-white py-2 rounded transition ${loading || isChecking
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-[var(--hover-color)]'
                            }`}
                        onClick={handleInviteUser}
                        disabled={loading || isChecking}>
                        {loading ? t("adset.sending") || "Sending..." :
                            isChecking ? t("adset.checking") || "Checking..." : t("adset.invite")}
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