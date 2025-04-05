import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { CheckCircle, XCircle, ArrowRight, AlertCircle, Loader2, Calendar, User, MessageSquare, Feather, PartyPopper, ThumbsDown, UserCheck, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';

const InvitationResponsePage = () =>
{
    const { t } = useTranslation();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [isAlreadyMember, setIsAlreadyMember] = useState(false);

    useEffect(() =>
    {
        const fetchInvitation = async () =>
        {
            if(!isLoaded)
                return;

            const urlToken = new URLSearchParams(window.location.search).get('token');
            const isGeneralInvite = !!urlToken;

            if(!isSignedIn)
            {
                setError({
                    message: 'Please login first to view this invitation 🔐',
                    icon: 'alert',
                    title: 'Login Required',
                    emoji: '🔒'
                });
                setLoading(false);
                return;
            }

            try{
                setLoading(true);
                const authToken = await getToken();

                const response = await axios.get(
                    `http://localhost:8080/api/invitations/${id}`,
                    {
                        params: isGeneralInvite ? { token: urlToken } : undefined,
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                        withCredentials: true
                    }
                );

                if(response.data.status !== 'Pending')
                {
                    const statusMap = {
                        'Accepted': {
                            message: 'This invitation has already been accepted! 🎉',
                            icon: 'party',
                            emoji: '🥳'
                        },
                        'Declined': {
                            message: 'This invitation was declined. ❌',
                            icon: 'thumbsdown',
                            emoji: '😶'
                        }
                    };
                    setError({
                        ...statusMap[response.data.status],
                        title: 'Invitation Processed'
                    });
                    return;
                }

                if(!isGeneralInvite)
                {
                    if(response.data.email)
                    {
                        const isRecipient = user.emailAddresses.some(
                            e => e.emailAddress === response.data.email
                        );
                        if(!isRecipient)
                        {
                            setError({
                                message: 'This invitation is not for you! 😇',
                                icon: 'feather',
                                title: 'Oops!',
                                emoji: ''
                            });
                            return;
                        }
                    }
                    else
                    {
                        setError({
                            message: 'This is a general invite page. You need the specific token link to access it.',
                            icon: 'alert',
                            title: 'Invalid Access',
                            emoji: '🔐'
                        });
                        return;
                    }
                }

                if(new Date(response.data.expiresAt) < new Date())
                {
                    setError({
                        message: 'This invitation has expired. ⏰',
                        icon: 'alert',
                        title: 'Expired',
                        emoji: '😞'
                    });
                    return;
                }

                const projectResponse = await axios.get(
                    `http://localhost:8080/api/projects/${response.data.projectId}`,
                    {
                        headers: { 'Authorization': `Bearer ${authToken}` },
                        withCredentials: true
                    }
                );

                const membersResponse = await axios.get(
                    `http://localhost:8080/api/projects/${response.data.projectId}/members`,
                    {
                        headers: { 'Authorization': `Bearer ${authToken}` },
                        withCredentials: true
                    }
                );

                const primaryEmail = user.emailAddresses.find(
                    email => email.id === user.primaryEmailAddressId
                )?.emailAddress;

                const alreadyMember = membersResponse.data.some(
                    member => member.email === primaryEmail
                );

                setIsAlreadyMember(alreadyMember);

                setInvitation({
                    ...response.data,
                    projectName: projectResponse.data.projectName,
                    senderName: projectResponse.data.owner.username,
                    isGeneralInvite
                });
                setError(null);
            }catch(err){
                console.error('Error:', err);
                setError({
                    message: err.response?.data?.message || 'Failed to process invitation',
                    icon: 'alert',
                    title: 'Error',
                    emoji: '😕'
                });
            }finally{
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [id, isLoaded, isSignedIn, user, getToken, searchParams]);

    const handleResponse = async (accept) =>
    {
        try{
            setResponding(true);
            const token = await getToken();
            const urlToken = new URLSearchParams(window.location.search).get('token');
            const isGeneralInvite = !!urlToken;
            const primaryEmail = user.emailAddresses.find(
                email => email.id === user.primaryEmailAddressId
            )?.emailAddress;

            const config =
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };

            const requestBody = {
                accept,
                email: primaryEmail,
                ...(isGeneralInvite && { token: urlToken })
            };

            await axios.post(
                `http://localhost:8080/api/invitations/${id}/respond`,
                requestBody,
                config
            );

            setSuccess(accept ?
            {
                message: 'Invitation accepted successfully! You are now part of the project. 🎊',
                emoji: '🚀'
            }
            :
            {
                message: 'Invitation declined successfully.',
                emoji: '👋'
            });

            setTimeout(() =>
            {
                navigate(accept ? '/dashboard' : '/');
            }, 3000);
        }catch(err){
            console.error('Error responding to invitation:', err);
            let errorMessage = 'Failed to respond to invitation';
            if(err.response)
            {
                if (err.response.status === 404) errorMessage = 'Invitation not found or already processed';
                else if (err.response.status === 400) errorMessage = err.response.data.message || 'Invalid invitation state';
            }
            setError({
                message: errorMessage,
                icon: 'alert',
                title: 'Error',
                emoji: '😕'
            });
        }finally{
            setResponding(false);
        }
    };

    const getMemberIcon = (member, isCurrentUser) =>
    {
        if(isCurrentUser)
        {
            return(
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0.3)", "0px 0px 10px rgba(59, 130, 246, 0.6)", "0px 0px 0px rgba(59, 130, 246, 0.3)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <UserCheck className="h-4 w-4 text-blue-500" />
                </motion.div>
            );
        }
        return(
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-gray-500" />
            </div>
        );
    };

    const cardVariants =
    {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const buttonHoverVariants =
    {
        hover:
        {
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    };

    const getErrorIcon = (iconType, title) =>
    {
        switch(iconType)
        {
            case 'party':
                return(
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-6 shadow-lg">
                        <PartyPopper className="h-10 w-10 text-green-500" />
                    </motion.div>
                );
            case 'thumbsdown':
                return(
                    <motion.div
                        animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-6 shadow-lg">
                        <ThumbsDown className="h-10 w-10 text-red-500" />
                    </motion.div>
                );
            case 'feather':
                return(
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-lg">
                        <div className="relative">
                            <Feather className="h-10 w-10 text-blue-400" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-300 flex items-center justify-center">
                                <div className="w-2 h-1 bg-black rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'alert':
                if(title === 'Invalid Access')
                {
                    return(
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6 shadow-lg">
                            <svg
                                className="h-10 w-10 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </motion.div>
                    );
                }
                if(title === 'Expired')
                {
                    return(
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6 shadow-lg">
                            <svg
                                className="h-10 w-10 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </motion.div>
                    );
                }
                return(
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 shadow-lg">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </motion.div>
                );
            default:
                return(
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 shadow-lg">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </motion.div>
                );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[var(--loginpage-bg)] to-[var(--loginpage-bg2)]">
            <div className="w-full bg-gradient-to-r from-[var(--features-icon-color)] via-purple-500 to-[var(--hover-color)] shadow-lg z-10">
                <Header title={<span className="text-xl font-bold text-white">{t("invitation.title") || "Project Invitation"}</span>} />
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="bg-[var(--bg-color)] p-8 rounded-2xl shadow-2xl border border-[var(--loginpage-bg2)] w-full max-w-md backdrop-blur-sm bg-opacity-90">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12">
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            boxShadow: ["0px 0px 10px rgba(var(--features-icon-color-rgb), 0.3)", "0px 0px 20px rgba(var(--features-icon-color-rgb), 0.7)", "0px 0px 10px rgba(var(--features-icon-color-rgb), 0.3)"]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-16 w-16 rounded-full border-4 border-[var(--loginpage-bg)]">
                                    </motion.div>
                                    <Loader2 className="absolute top-0 left-0 h-16 w-16 text-[var(--features-icon-color)] animate-spin" />
                                </div>
                                <p className="text-[var(--features-title-color)] text-lg font-medium mt-6">Loading invitation details...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center">
                                {getErrorIcon(error.icon, error.title)}
                                <h2 className="text-2xl font-bold text-[var(--features-title-color)] mb-3">{error.title} {error.emoji}</h2>
                                <p className="text-[var(--features-text-color)] mb-6">{error.message}</p>
                                <motion.button
                                    whileHover="hover"
                                    variants={buttonHoverVariants}
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-gradient-to-r from-[var(--features-icon-color)] to-[var(--hover-color)] hover:bg-[var(--hover-color)] text-white py-3 px-6 rounded-lg transition-colors flex items-center shadow-md hover:shadow-xl">
                                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </motion.button>
                            </motion.div>
                        ) : success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        boxShadow: ["0px 0px 0px rgba(34, 197, 94, 0.2)", "0px 0px 15px rgba(34, 197, 94, 0.6)", "0px 0px 0px rgba(34, 197, 94, 0.2)"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-6 shadow-md">
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[var(--features-title-color)] mb-3">Success! {success.emoji}</h2>
                                <p className="text-[var(--features-text-color)]">{success.message}</p>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className="h-1 bg-gradient-to-r from-[var(--features-icon-color)] to-[var(--hover-color)] mt-8 rounded-full shadow-sm" />
                                <p className="text-sm text-[var(--features-text-color)] mt-2">Redirecting you shortly...</p>
                            </motion.div>
                        ) : invitation ? (
                            <motion.div
                                key="invitation"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>
                                <div className="text-center mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--features-icon-color)] to-[var(--hover-color)] flex items-center justify-center mx-auto mb-5 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <rect x="2" y="4" width="20" height="16" rx="3" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            <path d="M2 7v13c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V7" />
                                        </svg>
                                    </motion.div>
                                    <motion.h2 className="text-2xl font-bold text-[var(--features-title-color)]">
                                        {invitation.isGeneralInvite
                                            ? "Project Invitation Link ✨"
                                            : "Project Invitation ✨"}
                                    </motion.h2>
                                    <motion.p className="text-[var(--features-text-color)] mt-1">
                                        {invitation.isGeneralInvite
                                            ? "You've accessed a general project invitation link 🎯"
                                            : "You've been invited to join a project 🎯"}
                                    </motion.p>
                                    {invitation.isGeneralInvite && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                                            This link can be used by anyone who has it. Only share with trusted people.
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-5 mb-8">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-start p-3 rounded-lg hover:bg-[var(--loginpage-bg)] transition-colors">
                                        <User className="text-[var(--features-icon-color)] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-[var(--features-text-color)] text-sm font-medium">Project Owner</p>
                                            <p className="text-[var(--features-title-color)] font-semibold">{invitation.senderName || "Project Admin"}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-start p-3 rounded-lg hover:bg-[var(--loginpage-bg)] transition-colors">
                                        <svg className="text-[var(--features-icon-color)] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5a2 2 0 012-2h4a2 2 0 012 2v12a2 2 0 01-2 2h-4a2 2 0 01-2-2V5z" />
                                        </svg>
                                        <div>
                                            <p className="text-[var(--features-text-color)] text-sm font-medium">Project</p>
                                            <p className="text-[var(--features-title-color)] font-semibold">{invitation.projectName}</p>
                                        </div>
                                    </motion.div>

                                    {invitation.role && (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex items-start p-3 rounded-lg hover:bg-[var(--loginpage-bg)] transition-colors">
                                            <svg className="text-[var(--features-icon-color)] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <div>
                                                <p className="text-[var(--features-text-color)] text-sm font-medium">Role</p>
                                                <p className="text-[var(--features-title-color)] font-semibold">{invitation.role}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                    {invitation.message && (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="flex items-start p-3 rounded-lg hover:bg-[var(--loginpage-bg)] transition-colors">
                                            <MessageSquare className="text-[var(--features-icon-color)] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-[var(--features-text-color)] text-sm font-medium">Message</p>
                                                <div className="bg-gradient-to-r from-[var(--loginpage-bg)] to-[var(--loginpage-bg2)] p-4 rounded-lg mt-1 text-[var(--features-title-color)] shadow-sm">
                                                    {invitation.message}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-start p-3 rounded-lg hover:bg-[var(--loginpage-bg)] transition-colors">
                                        <Calendar className="text-[var(--features-icon-color)] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-[var(--features-text-color)] text-sm font-medium">Expires</p>
                                            <p className="text-[var(--features-title-color)]">
                                                {new Date(invitation.expiresAt).toLocaleDateString()} at {new Date(invitation.expiresAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Already member warning */}
                                {isAlreadyMember && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                                        <motion.div
                                            animate={{
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="flex-shrink-0">
                                            <UserCheck className="h-5 w-5 text-amber-600" />
                                        </motion.div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-amber-800">You're already a member!</h3>
                                            <div className="mt-1 text-sm text-amber-700">
                                                <p>You can't accept this invitation because you're already part of this project.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <motion.button
                                        whileHover={!isAlreadyMember ? "hover" : {}}
                                        variants={buttonHoverVariants}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => !isAlreadyMember && handleResponse(true)}
                                        disabled={responding || isAlreadyMember}
                                        className={`flex-1 py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center font-medium ${isAlreadyMember
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-[var(--features-icon-color)] to-[var(--hover-color)] text-white hover:shadow-xl hover:opacity-90 disabled:opacity-70'
                                            }`}>
                                        {responding ? (
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        ) : (
                                            <>
                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                {invitation.isGeneralInvite ? "Join Project" : "Accept Invitation"}
                                            </>
                                        )}
                                    </motion.button>

                                    {!invitation.isGeneralInvite && (
                                        <motion.button
                                            whileHover={!isAlreadyMember ? "hover" : {}}
                                            variants={buttonHoverVariants}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => !isAlreadyMember && handleResponse(false)}
                                            disabled={responding || isAlreadyMember}
                                            className={`flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center font-medium ${isAlreadyMember
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                                                    : 'bg-[var(--loginpage-bg)] text-[var(--features-title-color)] border border-[var(--loginpage-bg2)] hover:bg-[var(--loginpage-bg2)] shadow-md hover:shadow-xl disabled:opacity-70'
                                                }`}>
                                            {responding ? (
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 mr-2" />
                                                    Decline
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="not-found"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-6 shadow-lg">
                                    <AlertCircle className="h-10 w-10 text-yellow-500" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[var(--features-title-color)] mb-3">Invitation Not Found 😕</h2>
                                <p className="text-[var(--features-text-color)] mb-6">The invitation you're looking for doesn't exist or has expired.</p>
                                <motion.button
                                    whileHover="hover"
                                    variants={buttonHoverVariants}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-gradient-to-r from-[var(--features-icon-color)] to-[var(--hover-color)] text-white py-3 px-6 rounded-lg transition-colors flex items-center shadow-md hover:shadow-xl">
                                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="py-4 text-center text-[var(--features-text-color)] text-sm">
                {new Date().getFullYear()} PlanWise - Need help?
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    className="text-[var(--features-icon-color)] hover:underline ml-1"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/', { state: { scrollToBottom: true } });
                    }}>
                    Contact Support
                </motion.a>
            </motion.div>
        </div>
    );
};

export default InvitationResponsePage;