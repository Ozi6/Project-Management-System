import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useAuth, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import
{
    FaSearch, FaBars, FaHeart, FaStickyNote, FaShare,
    FaTrash, FaPencilAlt, FaPlus, FaThumbtack, FaRegStickyNote, FaTimes, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import
{
    KanbanSquare, Layout, Settings, Users, Activity,
    BookOpen, X, FileText, Search as SearchIcon,MessageCircle
} from "lucide-react";

const Notes = () =>
{
    const { user, isLoaded } = useUser();
    const { id: projectId } = useParams();
    const { t } = useTranslation();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState("notes");
    const [noteType, setNoteType] = useState("personal");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showEditNoteModal, setShowEditNoteModal] = useState(false);
    const [editNoteData, setEditNoteData] = useState({ id: null, title: "", content: "", pinned: false, shared: false, color: "yellow" });
    const [notes, setNotes] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");
    const [newNotePinned, setNewNotePinned] = useState(false);
    const [newNoteShared, setNewNoteShared] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const location = useLocation();
    const isOwner = location.state?.isOwner || false;
    const [newNoteColor, setNewNoteColor] = useState("yellow");
    const [sortBy, setSortBy] = useState("updated");
    const [viewNoteModal, setViewNoteModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotes = async () =>
    {
        if(!isLoaded || !user || !projectId)
            return;
        try{
            setIsLoading(true);
            const token = await getToken();

            const response = await fetch(`http://localhost:8080/api/projects/${projectId}/notes`,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                }
            });

            if(!response.ok)
                throw new Error('Failed to fetch notes');

            const data = await response.json();

            const allNotes = data;
            const sharedNotes = allNotes.filter(note => note.shared && note.userId !== user.id);
            const personalNotes = allNotes.filter(note => note.userId.userId === user.id && !sharedNotes.includes(note));

            setNotes(personalNotes);
            setSharedNotes(sharedNotes);
            setIsLoading(false);
        }catch(err){
            setError(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() =>
    {
        fetchNotes();
    },[projectId, user]);

    const addNote = async () =>
    {
        if(!newNoteTitle.trim())
            return;

        try{
            const token = await getToken();
            const response = await fetch('http://localhost:8080/api/notes',
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                },
                body: JSON.stringify(
                {
                    title: newNoteTitle.trim(),
                    content: newNoteContent.trim(),
                    projectId: parseInt(projectId),
                    color: newNoteColor,
                    pinned: newNotePinned,
                    shared: newNoteShared
                })
            });

            if(!response.ok)
                throw new Error('Failed to add note');

            const newNote = await response.json();

            const noteWithColor =
            {
                ...newNote,
                color: newNoteColor,
                pinned: newNotePinned
            };

            if(newNoteShared)
                setSharedNotes(prev => [...prev, noteWithColor]);
            else
                setNotes(prev => [...prev, noteWithColor]);

            setNewNoteTitle("");
            setNewNoteContent("");
            setNewNotePinned(false);
            setNewNoteShared(false);
            setShowAddNoteModal(false);
        }catch(err){
            setError(err.message);
        }
    };

    const editNote = async () =>
    {
        if(!editNoteData.title.trim())
            return;

        try {

            const token = await getToken();

            const noteResponse = await fetch(`http://localhost:8080/api/notes/${editNoteData.id}`,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id,
                },
            });

            if(!noteResponse.ok)
                throw new Error('Failed to fetch note');

            const existingNote = await noteResponse.json();

            const response = await fetch(`http://localhost:8080/api/notes/${editNoteData.id}`,
            {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                },
                body: JSON.stringify(
                {
                    title: editNoteData.title.trim(),
                    content: editNoteData.content.trim(),
                    shared: editNoteData.shared,
                    color: editNoteData.color,
                    pinned: editNoteData.pinned,
                    userId: existingNote.userId
                })
            });

            if(!response.ok)
                throw new Error(t("notes.errupdt"));

            const updatedNote = await response.json();

            const updatedNoteWithProps =
            {
                ...updatedNote,
                color: editNoteData.color,
                pinned: editNoteData.pinned,
                shared: editNoteData.shared,
                ...(editNoteData.shared &&
                {
                    author:
                    {
                        name: user.fullName || 'Current User',
                        email: user.primaryEmailAddress?.emailAddress || 'user@example.com',
                        image: user.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com',
                    },
                    userId:
                    {
                        userId: existingNote.userId.userId,
                        username: existingNote.userId?.username || user.username || 'Current User',
                        profileImageUrl: existingNote.userId?.profileImageUrl || user.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com',
                    },
                }),
            };

            if(editNoteData.shared)
            {
                setNotes((prev) => prev.filter((note) => note.id !== updatedNoteWithProps.id));
                setSharedNotes((prev) =>
                {
                    const exists = prev.some((note) => note.id === updatedNoteWithProps.id);
                    if(exists)
                    {
                        return prev.map((note) =>
                            note.id === updatedNoteWithProps.id ? updatedNoteWithProps : note
                        );
                    }
                    return [...prev, updatedNoteWithProps];
                });
            }
            else
            {
                setSharedNotes((prev) => prev.filter((note) => note.id !== updatedNoteWithProps.id));
                setNotes((prev) =>
                {
                    const exists = prev.some((note) => note.id === updatedNoteWithProps.id);
                    if(exists)
                    {
                        return prev.map((note) =>
                            note.id === updatedNoteWithProps.id ? updatedNoteWithProps : note
                        );
                    }
                    return [...prev, updatedNoteWithProps];
                });
            }

            setShowEditNoteModal(false);
            setEditNoteData({ id: null, title: "", content: "", pinned: editNoteData.pinned, shared: false, color: editNoteData.color || "yellow" });
        }catch(err){
            setError(err.message);
        }
    };

    const deleteNote = async (noteId, shared) =>
    {
        try{
            const token = await getToken();
            const response = await fetch(`http://localhost:8080/api/notes/${noteId}`,
            {
                method: 'DELETE',
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                }
            });

            if(!response.ok)
                throw new Error(t("notes.errdel"));

            if(shared)
                setSharedNotes(prev => prev.filter(note => note.id !== noteId));
            else
                setNotes(prev => prev.filter(note => note.id !== noteId));
            setNoteToDelete(null);
        }catch(err){
            setError(err.message);
        }finally{
            setNoteToDelete(null);
        }
    };

    const colorVariants =
    {
        blue:
        {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-700",
            hover: "hover:bg-blue-100",
            button: "bg-blue-600 hover:bg-blue-700",
            icon: "text-blue-500",
            noteColor: "#e6f0fd"
        },
        green:
        {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            hover: "hover:bg-green-100",
            button: "bg-green-600 hover:bg-green-700",
            icon: "text-green-500",
            noteColor: "#e6faf0"
        },
        purple:
        {
            bg: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-700",
            hover: "hover:bg-purple-100",
            button: "bg-purple-600 hover:bg-purple-700",
            icon: "text-purple-500",
            noteColor: "#f3e6fd"
        },
        orange:
        {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-700",
            hover: "hover:bg-orange-100",
            button: "bg-orange-600 hover:bg-orange-700",
            icon: "text-orange-500",
            noteColor: "#fef2e6"
        },
        yellow:
        {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            hover: "hover:bg-yellow-100",
            button: "bg-yellow-600 hover:bg-yellow-700",
            icon: "text-yellow-500",
            noteColor: "#fffde7"
        },
        red:
        {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            hover: "hover:bg-red-100",
            button: "bg-red-600 hover:bg-red-700",
            icon: "text-red-500",
            noteColor: "#fee6e6"
        },
        default:
        {
            bg: "bg-gray-50",
            border: "border-gray-200",
            text: "text-gray-700",
            hover: "hover:bg-gray-100",
            button: "bg-gray-600 hover:bg-gray-700",
            icon: "text-gray-500",
            noteColor: "#f8f9fa"
        }
    };

    const filteredPersonalNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSharedNotes = sharedNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) =>
    {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const toggleMobileSidebar = () =>
    {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const openViewNoteModal = (note, shared) =>
    {
        setViewNoteModal({
            ...note,
            shared
        });
    };

    const NoteViewModal = ({ note, onClose }) =>
    {
        if(!note)
            return null;

        return(
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    style={{ zIndex: 1000 }} />
                <motion.div
                    className="fixed inset-0 flex items-center justify-center px-3 sm:px-4"
                    initial={{ y: "-20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    style={{ zIndex: 1001 }}>
                    <div className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-auto border ${colorVariants[note.color]?.border || colorVariants.default.border}`}>
                        <div className="flex justify-between items-center p-3 sm:p-5 border-b border-gray-200">
                            <div className="flex items-center gap-2 flex-wrap max-w-[75%]">
                                {note.pinned ? (
                                    <FaStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} size={18} />
                                ) : (
                                    <FaRegStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} size={18} />
                                )}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">{note.title}</h3>
                                {note.pinned && (
                                    <FaThumbtack className="text-amber-500" size={16} />
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6"
                            style={{
                                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                backgroundSize: "100% 32px",
                                lineHeight: "32px"
                            }}>
                            <div className="text-gray-700 break-words whitespace-pre-wrap mb-6"
                                style={{
                                    lineHeight: "32px",
                                    minHeight: "200px"
                                }}>
                                {note.content}
                            </div>

                            {note.shared && note.userId && (
                                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200">
                                    <img
                                        src={note.userId.profileImageUrl}
                                        alt={note.userId.username}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm text-gray-600">{note.userId.username}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                                <div>
                                    {t("dashboard.update")}: {formatDate(note.createdAt)}
                                </div>
                                <div>
                                    {t("procard.upd")}: {formatDate(note.updatedAt)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                            {note.shared && (
                                <button
                                    onClick={() => {
                                        onClose();
                                        handleEditNote(note, true);
                                    }}
                                    className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                                    <FaPencilAlt size={14} />
                                    {t("prode.edit")}
                                </button>
                            )}
                            {!note.shared && (
                                <>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            toggleShareStatus(note.id);
                                        }}
                                        className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                                        <FaShare size={14} />
                                        {t("notes.share")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            handleEditNote(note, false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100">
                                        <FaPencilAlt size={14} />
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    };

    const handleEditNote = (note, shared) =>
    {
        setEditNoteData({
            id: note.id,
            title: note.title,
            content: note.content,
            pinned: note.pinned,
            shared: note.shared,
            color: note.color || "yellow"
        });
        setShowEditNoteModal(true);
    };

    const togglePinStatus = async (noteId, shared) =>
    {
        try{
            const token = await getToken();
            const note = shared
                ? sharedNotes.find(note => note.id === noteId)
                : notes.find(note => note.id === noteId);

            if(!note)
                return;

            if(shared)
            {
                setSharedNotes(prev => prev.map(note =>
                    note.id === noteId ? { ...note, pinned: !note.pinned } : note
                ));
            }
            else
            {
                setNotes(prev => prev.map(note =>
                    note.id === noteId ? { ...note, pinned: !note.pinned } : note
                ));
            }
            
            const response = await fetch(`http://localhost:8080/api/notes/${noteId}`,
            {
                method: 'PATCH',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                },
                body: JSON.stringify({
                    pinned: !note.pinned
                })
            });

            if(!response.ok)
                throw new Error(t("notes.errpin"));

        }catch(err){
            if(shared)
            {
                setSharedNotes(prev => prev.map(note =>
                    note.id === noteId ? { ...note, pinned: note.pinned } : note
                ));
            }
            else
            {
                setNotes(prev => prev.map(note =>
                    note.id === noteId ? { ...note, pinned: note.pinned } : note
                ));
            }
            setError(err.message);
        }
    };

    const toggleShareStatus = async (noteId) => {
        let noteToShare = null;
        try {
            const token = await getToken();
            noteToShare = notes.find(note => note.id === noteId);
            if (!noteToShare) {
                throw new Error('Note not found');
            }

            setNotes(prev => prev.filter(note => note.id !== noteId));
            const sharedNote = {
                ...noteToShare,
                shared: true,
                author: {
                    name: user.fullName || "Current User",
                    email: user.primaryEmailAddress?.emailAddress || "user@example.com",
                    image: user.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com"
                }
            };
            setSharedNotes(prev => [...prev, sharedNote]);

            const response = await fetch(`http://localhost:8080/api/notes/${noteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'userId': user.id
                },
                body: JSON.stringify({
                    shared: true
                })
            });

            if (!response.ok) {
                throw new Error(t("notes.errshare"));
            }
        } catch (err) {
            if (noteToShare) {
                setSharedNotes(prev => prev.filter(note => note.id !== noteId));
                setNotes(prev => [...prev, noteToShare]);
            }
            setError(err.message);
        }
    };

    const customNavItems =
    [
        {
            id: 'dashboard',
            icon: Layout,
            label: t("sidebar.dash"),
            path: '/dashboard',
            iconColor: 'text-blue-600',
            defaultColor: true
        },
        {
            id: 'projects',
            icon: KanbanSquare,
            label: t("sidebar.this"),
            path: `/project/${projectId}`,
            state: { isOwner },
            color: 'bg-purple-100 text-purple-600',
            iconColor: 'text-purple-600'
        },
        {
            id: 'activity',
            icon: Activity,
            label: t("sidebar.act"),
            path: `/project/${projectId}/activity`,
            state: { isOwner },
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        {
            id: 'teams',
            icon: Users,
            label: t("sidebar.team"),
            path: `/project/${projectId}/teams`,
            state: { isOwner },
            color: 'bg-[var(--sidebar-teams-bg-color)] text-[var(--sidebar-teams-color)]',
            iconColor: 'text-[var(--sidebar-teams-color)]'
        },
        {
            id: 'chat',
            icon: MessageCircle,
            label: t("sidebar.chat"),
            path: `/project/${projectId}/chat`,
            state: { isOwner },
            color: 'bg-indigo-100 text-indigo-600',
            iconColor: 'text-indigo-600'
        },
        {
            id: 'notes',
            icon: BookOpen,
            label: t("notes.title"),
            path: `/project/${projectId}/notes`,
            state: { isOwner },
            color: 'bg-[var(--features-title-color)]/20 text-[var(--features-icon-color)]',
            iconColor: 'text-[var(--features-icon-color)]'
        },
        {
            id: 'settings',
            icon: Settings,
            label: t("sidebar.set"),
            path: `/project/${projectId}/settings`,
            state: { isOwner },
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

    const NoteDeleteConfirmation = ({ noteTitle, onConfirm, onCancel }) =>
    {
        if(!noteTitle || typeof noteTitle !== "string")
            return null;

        return (
            <AnimatePresence>
                {noteTitle && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onCancel}
                            style={{ zIndex: 10002 }}/>
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center"
                            initial={{ y: "-20%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 150, damping: 15 }}
                            style={{ zIndex: 10003 }}>
                            <div className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden">
                                <div className="bg-[var(--bug-report)] p-4 shadow-md">
                                    <h3 className="text-xl font-bold !text-white text-center">{t("notes.confirm")}</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    <p className="text-gray-700 text-center">{t("notes.conMess")} "{noteTitle}"?</p>
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-gray-500 !text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                                            onClick={onCancel}>
                                            {t("prode.can")}
                                        </button>
                                        <button
                                            className="bg-[var(--bug-report)]/90 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-32"
                                            onClick={onConfirm}>
                                            {t("prode.del")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    };

    const sortNotes = (notesToSort) =>
    {
        if(sortBy === "title")
            return [...notesToSort].sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === "color")
            return [...notesToSort].sort((a, b) => a.color.localeCompare(b.color));
        else
            return [...notesToSort].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    };

    const sortedPersonalNotes = sortNotes(filteredPersonalNotes);
    const sortedSharedNotes = sortNotes(filteredSharedNotes);

    useEffect(() =>
    {
        const handleResize = () =>
        {
            if(window.innerWidth >= 768)
                setIsMobileSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() =>
    {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    if(isLoading)
    {
        return(
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return(
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b border-[var(--features-icon-color)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--features-icon-color)]">{t("notes.title")}</span>}
                    action={{
                        onClick: () => setShowAddNoteModal(true),
                        icon: <FaPlus size={16} className="mr-2" />,
                        label: t("notes.addNote")
                    }}/>
            </div>
            <div className="flex flex-1 overflow-hidden relative">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-6 right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors">
                    {isMobileSidebarOpen ? <FaTimes size={24}/> : <FaBars size={24}/>}
                </button>
                <div className="hidden md:block bg-white shadow-md z-5 border-r border-blue-100">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} />
                </div>
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} isMobile={true} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />
                    </div>
                )}
                <div className="flex-1 overflow-auto bg-[var(--bg-color)] flex flex-col">
                    {error && (
                        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mx-3 sm:mx-6 mt-3 rounded-r">
                            <p className="font-medium">{t("notes.error")}</p>
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="sticky top-0 z-10 bg-[var(--gray-card1)] shadow-sm px-3 sm:px-6 py-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--features-icon-color)]/70" size={18} />
                                <input
                                    type="text"
                                    placeholder={t("notes.search")}
                                    className="w-full pl-10 pr-4 py-2 border bg-[var(--bg-color)] border-[var(--features-icon-color)]/30 rounded-lg text-[var(--features-text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setNoteType("personal")}
                                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-l-lg border border-gray-200 ${noteType === "personal" ? "bg-[var(--features-icon-color)] !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("notes.personal")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNoteType("shared")}
                                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-r-lg border border-gray-200 ${noteType === "shared" ? "bg-[var(--features-icon-color)] !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("notes.shared")}
                                    </button>
                                </div>
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("updated")}
                                        className={`px-2 sm:px-3 py-2 text-xs font-medium rounded-l-lg border border-gray-200 ${sortBy === "updated" ? "bg-[var(--gray-card2)] text-[var(--features-text-color)]" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("notes.recent")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("title")}
                                        className={`px-2 sm:px-3 py-2 text-xs font-medium border-t border-b border-gray-200 ${sortBy === "title" ? "bg-[var(--gray-card2)] text-[var(--features-text-color)]" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        A-Z
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("color")}
                                        className={`px-2 sm:px-3 py-2 text-xs font-medium rounded-r-lg border border-gray-200 ${sortBy === "color" ? "bg-[var(--gray-card2)] text-[var(--features-text-color)]" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("notes.color")}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowAddNoteModal(true)}
                                    className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[var(--features-icon-color)] !text-white rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
                                    <FaPlus size={14} />
                                    <span className="text-xs sm:text-sm">{t("notes.newnote")}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 sm:p-6 flex-grow">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                            {noteType === "personal" ? (
                                sortedPersonalNotes.length > 0 ? (
                                    <>
                                    {sortedPersonalNotes
                                        .filter(note => note.pinned)
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md relative`}
                                                style={{
                                                    transform: note.pinned ? "rotate(-1deg)" : "none"
                                                }}>
                                                {note.pinned && (
                                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 rounded-full z-10 shadow-md" />
                                                )}
                                                <div className="p-3 sm:p-5 relative z-0"
                                                    style={{
                                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                        backgroundSize: "100% 32px",
                                                        lineHeight: "32px"
                                                    }}>
                                                    <div className="flex justify-between items-center mb-2 sm:mb-4">
                                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                            <FaStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon} text-sm sm:text-base`} />
                                                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg"
                                                                style={{
                                                                    textShadow: "1px 1px 1px rgba(255,255,255,0.8)",
                                                                    lineHeight: "normal"
                                                                }}>
                                                                {note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => togglePinStatus(note.id, false)}
                                                                className="p-1.5 rounded hover:bg-white/80 text-amber-500"
                                                                title={note.pinned ? t("notes.unpin") : t("notes.pin")}>
                                                                <FaThumbtack size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mb-4 text-gray-700 text-sm break-words"
                                                        style={{
                                                            lineHeight: "32px",
                                                            textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
                                                            maxHeight: "160px",
                                                            overflow: "hidden"
                                                        }}>
                                                        {note.content.length > 160
                                                            ? `${note.content.substring(0, 160)}...`
                                                            : note.content}

                                                        {note.content.length > 160 && (
                                                            <button
                                                                onClick={() => openViewNoteModal(note, false)}
                                                                className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}>
                                                                <span>{t("notes.readmore")}</span>
                                                                <FaChevronDown className="ml-1" size={12} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-200">
                                                        <div>
                                                            {t("notes.updated") } {formatDate(note.updatedAt)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleShareStatus(note.id)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.sharenote")}>
                                                                <FaShare size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditNote(note, false)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.edit")}>
                                                                <FaPencilAlt size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setNoteToDelete({ id: note.id, title: note.title, shared: false })}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.delete")}>
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {sortedPersonalNotes
                                        .filter(note => !note.pinned)
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}>
                                                <div className="p-3 sm:p-5"
                                                    style={{
                                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                        backgroundSize: "100% 32px",
                                                        lineHeight: "32px",
                                                    }}>
                                                    <div className="flex justify-between items-center mb-2 sm:mb-4">
                                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                            <FaRegStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon} text-sm sm:text-base`} />
                                                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title}</h3>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => togglePinStatus(note.id, false)}
                                                                className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-amber-500"
                                                                title={t("notes.pin")}>
                                                                <FaThumbtack size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mb-4 text-gray-700 text-sm break-words"
                                                        style={{
                                                            lineHeight: "32px",
                                                            textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
                                                            maxHeight: "160px",
                                                            overflow: "hidden"
                                                        }}>
                                                        {note.content.length > 160
                                                            ? `${note.content.substring(0, 160)}...`
                                                            : note.content}

                                                        {note.content.length > 160 && (
                                                            <button
                                                                onClick={() => openViewNoteModal(note, false)}
                                                                className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}>
                                                                <span>{t("notes.readmore")}</span>
                                                                <FaChevronDown className="ml-1" size={12} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                                                        <div>
                                                            {t("notes.updated")} {formatDate(note.updatedAt)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleShareStatus(note.id)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.sharenote")}>
                                                                <FaShare size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditNote(note, false)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.edit")}>
                                                                <FaPencilAlt size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setNoteToDelete({ id: note.id, title: note.title, shared: false })}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title={t("notes.delete")}>
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-[var(--features-text-color)]">
                                        <FileText size={48} className="mb-4 opacity-50 text-[var(--features-text-color)]" />
                                        <p>{t("notes.nopersonal")}</p>
                                        <button
                                            onClick={() => setShowAddNoteModal(true)}
                                            className="mt-4 px-4 py-2 bg-[var(--features-icon-color)] !text-white rounded-lg hover:bg-[var(--hover-color)] transition-colors">
                                            {t("notes.createnote")}
                                        </button>
                                    </div>
                                )
                            )
                            :
                            (
                                sortedSharedNotes.length > 0 ? (
                                    <>
                                        {sortedSharedNotes
                                            .filter(note => note.pinned)
                                            .map((note) => (
                                                <div
                                                    key={note.id}
                                                    className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}
                                                >
                                                    <div
                                                        className="p-3 sm:p-5"
                                                        style={{
                                                            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                            backgroundSize: "100% 32px",
                                                            lineHeight: "32px",
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                                                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                                <FaStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon} text-sm sm:text-base`} />
                                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title}</h3>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {isOwner ? (
                                                                    <button
                                                                        onClick={() => togglePinStatus(note.id, true)}
                                                                        className="p-1.5 rounded hover:bg-white/80 text-amber-500"
                                                                        title={t("notes.unpin")}
                                                                    >
                                                                        <FaThumbtack size={16} />
                                                                    </button>
                                                                ) : (
                                                                    <FaThumbtack size={16} className="text-amber-500" title="Pinned note" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="mt-3 mb-4 text-gray-700 text-sm break-words"
                                                            style={{
                                                                lineHeight: "32px",
                                                                textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
                                                                maxHeight: "160px",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {note.content.length > 160
                                                                ? `${note.content.substring(0, 160)}...`
                                                                : note.content}

                                                            {note.content.length > 160 && (
                                                                <button
                                                                    onClick={() => openViewNoteModal(note, true)}
                                                                    className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}
                                                                >
                                                                    <span>{t("notes.readmore")}</span>
                                                                    <FaChevronDown className="ml-1" size={12} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-between items-center mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={note.userId.profileImageUrl}
                                                                    alt={note.userId.username}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <span className="text-xs text-gray-600">{note.userId.username}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">{formatDate(note.updatedAt)}</div>
                                                        </div>

                                                        {isOwner && (
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    onClick={() => handleEditNote(note, true)}
                                                                    className="p-1.5 rounded hover:bg-white/80"
                                                                    title={t("notes.edit")}
                                                                >
                                                                    <FaPencilAlt size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setNoteToDelete({ id: note.id, title: note.title, shared: true })}
                                                                    className="p-1.5 rounded hover:bg-white/80"
                                                                    title={t("notes.delete")}
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                        {sortedSharedNotes
                                            .filter(note => !note.pinned)
                                            .map((note) => (
                                                <div
                                                    key={note.id}
                                                    className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}
                                                >
                                                    <div
                                                        className="p-3 sm:p-5"
                                                        style={{
                                                            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                            backgroundSize: "100% 32px",
                                                            lineHeight: "32px",
                                                        }}>
                                                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                                                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                                <FaRegStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon} text-sm sm:text-base`} />
                                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title}</h3>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {isOwner && (
                                                                    <button
                                                                        onClick={() => togglePinStatus(note.id, true)}
                                                                        className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-amber-500"
                                                                        title={t("notes.pin")}>
                                                                        <FaThumbtack size={16}/>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="mt-3 mb-4 text-gray-700 text-sm break-words"
                                                            style={{
                                                                lineHeight: "32px",
                                                                textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
                                                                maxHeight: "160px",
                                                                overflow: "hidden",
                                                            }}>
                                                            {note.content.length > 160
                                                                ? `${note.content.substring(0, 160)}...`
                                                                : note.content}

                                                            {note.content.length > 160 && (
                                                                <button
                                                                    onClick={() => openViewNoteModal(note, true)}
                                                                    className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}>
                                                                    <span>{t("notes.readmore")}</span>
                                                                    <FaChevronDown className="ml-1" size={12} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-between items-center mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={note.userId.profileImageUrl}
                                                                    alt={note.userId.username}
                                                                    className="w-6 h-6 rounded-full"/>
                                                                <span className="text-xs text-gray-600">{note.userId.username}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">{formatDate(note.updatedAt)}</div>
                                                        </div>

                                                        {isOwner && (
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    onClick={() => handleEditNote(note, true)}
                                                                    className="p-1.5 rounded hover:bg-white/80"
                                                                    title={t("notes.edit")}>
                                                                    <FaPencilAlt size={14}/>
                                                                </button>
                                                                <button
                                                                    onClick={() => setNoteToDelete({ id: note.id, title: note.title, shared: true })}
                                                                    className="p-1.5 rounded hover:bg-white/80"
                                                                    title={t("notes.delete")}>
                                                                    <FaTrash size={14}/>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </>
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                                        <div className="relative">
                                            <FileText size={64} className="mb-4 opacity-30 text-[var(--features-icon-color)]/80 " />
                                            <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
                                                <X size={32} className="text-[var(--features-icon-color)] opacity-70" />
                                            </div>
                                        </div>
                                        <p className="text-lg text-[var(--features-text-color)] mb-2">{t("notes.nonotesttl")}</p>
                                        <p className="text-sm text-[var(--features-text-color)] mb-4">{t("notes.nonotes")}</p>
                                        <button
                                            onClick={() => setShowAddNoteModal(true)}
                                            className="mt-4 px-6 py-3 bg-[var(--features-icon-color)] !text-white rounded-lg hover:bg-[var(--hover-color)] transition-colors shadow-md flex items-center gap-2"
                                        >
                                            <FaPlus size={16} />
                                            {t("notes.createnote") }
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showAddNoteModal && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setShowAddNoteModal(false)}
                                style={{ zIndex: 1000 }}/>
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center px-3 sm:px-4"
                                initial={{ y: "-20%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                style={{ zIndex: 1001 }}>
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[85vh] overflow-auto">
                                    <div className="flex justify-between items-center p-5 bg-[var(--features-icon-color)] !text-white rounded-t-lg">
                                        <h3 className="text-xl font-semibold">{t("notes.createnote")}</h3>
                                        <button
                                            onClick={() => setShowAddNoteModal(false)}
                                            className="p-1 rounded-full hover:bg-[var(--hover-color)] transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-[var(--bg-color)]">
                                        <div className="mb-4">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("notes.ttl")}</label>
                                            <input
                                                type="text"
                                                value={newNoteTitle}
                                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                                placeholder={t("notes.editttlfield")}
                                                className="w-full px-3 py-2 border border-[var(--features-icon-color)] text-[var(--features-text-color)]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-text-color)]/50"/>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("notes.notecolor")}</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.keys(colorVariants).filter(color => color !== 'default').map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setNewNoteColor(color)}
                                                        className={`w-8 h-8 rounded-full border-2 ${newNoteColor === color ? 'border-[var(--features-icon-color)]' : 'border-[var(--features-text-color)]/30'}`}
                                                        style={{ backgroundColor: colorVariants[color].noteColor }}
                                                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("TCM.MarkCon")}</label>
                                            <textarea
                                                value={newNoteContent}
                                                onChange={(e) => setNewNoteContent(e.target.value)}
                                                placeholder={t("notes.content")}
                                                className="w-full px-3 py-2 border border-[var(--features-icon-color)] text-[var(--features-text-color)]/70 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]/50 min-h-[150px]"></textarea>
                                        </div>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="pin-note"
                                                    checked={newNotePinned}
                                                    onChange={() => setNewNotePinned(!newNotePinned)}
                                                    className="mr-2 h-4 w-4 text-[var(--features-icon-color)] focus:ring-[var(--features-icon-color)]/70 border-gray-300 rounded"/>
                                                <label htmlFor="pin-note" className="text-[var(--features-text-color)] text-sm">{t("notes.pinnote")}</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="share-note"
                                                    checked={newNoteShared}
                                                    onChange={() => setNewNoteShared(!newNoteShared)}
                                                    className="mr-2 h-4 w-4 text-[var(--features-text-color)] focus:ring-[var(--features-text-color)]/70 border-gray-300 rounded"/>
                                                <label htmlFor="share-note" className="text-[var(--features-text-color)] text-sm">{t("notes.sharewteam")}</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowAddNoteModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-[var(--features-text-color2)] bg-[var(--gray-card3)] rounded-md hover:bg-[var(--gray-card2)] focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                {t("prode.can")}
                                            </button>
                                            <button
                                                onClick={addNote}
                                                disabled={!newNoteTitle.trim()}
                                                className={`px-4 py-2 text-sm font-medium !text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--features-icon-color)]/50 ${newNoteTitle.trim()
                                                        ? "bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)]"
                                                        : "bg-[var(--features-icon-color)]/50 cursor-not-allowed"
                                                    }`}>
                                                {t("notes.create")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showEditNoteModal && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setShowEditNoteModal(false)}
                                style={{ zIndex: 10000 }} />
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center px-3 sm:px-4"
                                initial={{ y: "-20%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                style={{ zIndex: 10001 }}>
                                <div className="bg-[var(--bg-color)] rounded-lg shadow-xl w-full max-w-md max-h-[85vh] overflow-auto">
                                    <div className="flex justify-between items-center p-5 bg-[var(--features-icon-color)] text-white rounded-t-lg">
                                        <h3 className="text-xl font-semibold">{t("notes.editnotecptl")}</h3>
                                        <button
                                            onClick={() => setShowEditNoteModal(false)}
                                            className="p-1 rounded-full hover:bg-[var(--hover-color)] transition-colors">
                                            <X size={24} className="text-white" />
                                        </button>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <div className="mb-4">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("notes.ttl")}</label>
                                            <input
                                                type="text"
                                                value={editNoteData.title}
                                                onChange={(e) => setEditNoteData({ ...editNoteData, title: e.target.value })}
                                                placeholder={t("notes.editttlfield")}
                                                className="w-full px-3 py-2 border text-[var(--features-text-color)]/70 border-[var(--features-icon-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]/50" />
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("notes.notecolor")}</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.keys(colorVariants).filter(color => color !== 'default').map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setEditNoteData({ ...editNoteData, color })}
                                                        className={`w-8 h-8 rounded-full border-2 ${editNoteData.color === color ? 'border-[var(--features-icon-color)]' : 'border-[var(--features-text-color)]/30'}`}
                                                        style={{ backgroundColor: colorVariants[color].noteColor }}
                                                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-[var(--features-text-color)] text-sm font-medium mb-2">{t("TCM.MarkCon")}</label>
                                            <textarea
                                                value={editNoteData.content}
                                                onChange={(e) => setEditNoteData({ ...editNoteData, content: e.target.value })}
                                                placeholder={t("notes.content")}
                                                className="w-full px-3 py-2 border text-[var(--features-text-color)]/50 border-[var(--features-icon-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]/50 min-h-[150px]"></textarea>
                                        </div>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="edit-pin-note"
                                                    checked={editNoteData.pinned}
                                                    onChange={() => setEditNoteData({ ...editNoteData, pinned: !editNoteData.pinned })}
                                                    className="mr-2 h-4 w-4 text-[var(--features-icon-color)] focus:ring-[var(--features-icon-color)]/70 border-[var(--features-icon-color)]/30 rounded" />
                                                <label htmlFor="edit-pin-note" className="text-[var(--features-text-color)] text-sm">{t("notes.pin")}</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="edit-share-note"
                                                    checked={editNoteData.shared}
                                                    onChange={() => setEditNoteData({ ...editNoteData, shared: !editNoteData.shared })}
                                                    className="mr-2 h-4 w-4 text-[var(--features-icon-color)] focus:ring-[var(--features-icon-color)]/50 border-[var(--features-icon-color)]/30 rounded" />
                                                <label htmlFor="edit-share-note" className="text-[var(--features-text-color)] text-sm">{t("notes.sharewteam")}</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowEditNoteModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-[var(--features-text-color2)] bg-[var(--gray-card3)] rounded-md hover:bg-[var(--gray-card3)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--features-text-color)]/50">
                                                {t("prode.can")}
                                            </button>
                                            <button
                                                onClick={editNote}
                                                disabled={!editNoteData.title.trim()}
                                                className={`px-4 py-2 text-sm font-medium !text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--features-icon-color)]/50 ${editNoteData.title.trim()
                                                        ? "bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)]"
                                                        : "bg-[var(--features-icon-color)]/50 cursor-not-allowed"
                                                    }`}>
                                                {t("prode.edit.save")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {noteToDelete &&(
                    <NoteDeleteConfirmation
                        noteTitle={noteToDelete.title}
                        onConfirm={() => deleteNote(noteToDelete.id, noteToDelete.shared)}
                        onCancel={() => setNoteToDelete(null)}/>)
                }
            </div>
            {viewNoteModal && (
                <NoteViewModal
                    note={viewNoteModal}
                    onClose={() => setViewNoteModal(null)}/>
            )}
        </div>
    );
}

export default Notes;