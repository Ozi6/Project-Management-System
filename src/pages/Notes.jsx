import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import
{
    FaSearch, FaBars, FaHeart, FaStickyNote, FaShare,
    FaTrash, FaPencilAlt, FaPlus, FaThumbtack, FaRegStickyNote, FaTimes, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import
{
    KanbanSquare, Layout, Settings, Users, Activity,
    BookOpen, X, FileText, Search as SearchIcon
} from "lucide-react";

const Notes = () =>
{
    const { id: projectId } = useParams();
    const { t } = useTranslation();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState("notes");
    const [noteType, setNoteType] = useState("personal");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showEditNoteModal, setShowEditNoteModal] = useState(false);
    const [editNoteData, setEditNoteData] = useState({ id: null, title: "", content: "", isPinned: false, isShared: false, color: "yellow" });
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
    const [expandedNote, setExpandedNote] = useState(null);
    const [viewNoteModal, setViewNoteModal] = useState(null);

    useEffect(() =>
    {
        setNotes(
        [
            {
                id: 1,
                title: "Project Requirements",
                content: "We need to finalize the user stories by Friday. Make sure to include acceptance criteria for each story.",
                createdAt: "2025-04-05T14:30:00Z",
                updatedAt: "2025-04-08T09:15:00Z",
                isPinned: true,
                isShared: false,
                color: "blue"
            },
            {
                id: 2,
                title: "Meeting Notes - April 2",
                content: "Discussed the timeline for the next sprint. We agreed to focus on the user authentication features first, followed by the dashboard components.",
                createdAt: "2025-04-02T16:00:00Z",
                updatedAt: "2025-04-02T18:45:00Z",
                isPinned: false,
                isShared: false,
                color: "green"
            },
            {
                id: 3,
                title: "Design Feedback",
                content: "The client liked the new color palette but requested changes to the navigation menu. Consider making it more accessible on mobile devices.",
                createdAt: "2025-03-28T11:20:00Z",
                updatedAt: "2025-03-30T13:10:00Z",
                isPinned: false,
                isShared: false,
                color: "purple"
            }
        ]);

        setSharedNotes(
        [
            {
                id: 101,
                title: "API Documentation",
                content: "Here's the documentation for the new API endpoints. Please review and provide feedback by April 15.",
                createdAt: "2025-04-07T10:00:00Z",
                updatedAt: "2025-04-07T10:00:00Z",
                author:
                {
                    name: "Alex Johnson",
                    email: "alex@example.com",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex@example.com"
                },
                isPinned: true,
                isShared: true,
                color: "orange"
            },
            {
                id: 102,
                title: "Sprint Planning",
                content: "Here are the tasks we'll be focusing on for the next two weeks. Please update your estimates and availability.",
                createdAt: "2025-04-05T13:45:00Z",
                updatedAt: "2025-04-06T09:30:00Z",
                author:
                {
                    name: "Sarah Williams",
                    email: "sarah@example.com",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah@example.com"
                },
                isPinned: false,
                isShared: true,
                color: "blue"
            },
            {
                id: 103,
                title: "Database Schema Updates",
                content: "I've updated the database schema to accommodate the new features. Check the attached diagram and let me know if you see any issues.",
                createdAt: "2025-04-01T16:20:00Z",
                updatedAt: "2025-04-03T11:15:00Z",
                author:
                {
                    name: "Michael Chen",
                    email: "michael@example.com",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael@example.com"
                },
                isPinned: false,
                isShared: true,
                color: "green"
            }
        ]);
    }, []);



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

    const [expandedNotes, setExpandedNotes] = useState({});
    const toggleNoteExpansion = (noteId) =>
    {
        setExpandedNotes(prev => ({
            ...prev,
            [noteId]: !prev[noteId]
        }));
    };

    const addNote = () =>
    {
        if (!newNoteTitle.trim()) return;

        const newNote =
        {
            id: Date.now(),
            title: newNoteTitle.trim(),
            content: newNoteContent.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: newNotePinned,
            isShared: newNoteShared,
            color: ["blue", "green", "purple", "orange"][Math.floor(Math.random() * 4)]
        };

        if(newNoteShared)
        {
            newNote.author =
            {
                name: "Current User",
                email: "user@example.com",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com"
            };
            setSharedNotes(prev => [...prev, newNote]);
        }
        else
            setNotes(prev => [...prev, newNote]);

        setNewNoteTitle("");
        setNewNoteContent("");
        setNewNotePinned(false);
        setNewNoteShared(false);
        setShowAddNoteModal(false);
    };

    const editNote = () =>
    {
        if (!editNoteData.title.trim()) return;

        const updatedNote =
        {
            ...editNoteData,
            updatedAt: new Date().toISOString()
        };

        if(editNoteData.isShared)
            setSharedNotes(prev => prev.map(note => note.id === editNoteData.id ? updatedNote : note));
        else
            setNotes(prev => prev.map(note => note.id === editNoteData.id ? updatedNote : note));

        setShowEditNoteModal(false);
        setEditNoteData({ id: null, title: "", content: "", isPinned: false, isShared: false });
    };

    const deleteNote = (noteId, isShared) =>
    {
        if(isShared)
            setSharedNotes(prev => prev.filter(note => note.id !== noteId));
        else
            setNotes(prev => prev.filter(note => note.id !== noteId));
        setNoteToDelete(null);
    };

    const handleEditNote = (note, isShared) =>
    {
        setEditNoteData({
            id: note.id,
            title: note.title,
            content: note.content,
            isPinned: note.isPinned,
            isShared: isShared
        });
        setShowEditNoteModal(true);
    };

    const togglePinStatus = (noteId, isShared) =>
    {
        if(isShared)
        {
            setSharedNotes(prev => prev.map(note =>
                note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
            ));
        }
        else
        {
            setNotes(prev => prev.map(note =>
                note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
            ));
        }
    };

    const toggleShareStatus = (noteId) =>
    {
        const noteToShare = notes.find(note => note.id === noteId);
        if(noteToShare)
        {
            setNotes(prev => prev.filter(note => note.id !== noteId));

            const sharedNote =
            {
                ...noteToShare,
                isShared: true,
                author:
                {
                    name: "Current User",
                    email: "user@example.com",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com"
                }
            };
            setSharedNotes(prev => [...prev, sharedNote]);
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
            id: 'notes',
            icon: BookOpen,
            label: "Notes",
            path: `/project/${projectId}/notes`,
            state: { isOwner },
            color: 'bg-indigo-100 text-indigo-600',
            iconColor: 'text-indigo-600'
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
                                    <h3 className="text-xl font-bold !text-white text-center">Confirmation</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    <p className="text-gray-700 text-center">Are you sure you want to delete "{noteTitle}"?</p>
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-gray-500 !text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                                            onClick={onCancel}>
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-[var(--bug-report)]/90 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-32"
                                            onClick={onConfirm}>
                                            Delete
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

    return(
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b border-indigo-300">
                <Header
                    title={<span className="text-xl font-semibold text-indigo-600">Notes</span>}
                    action={{
                        onClick: () => setShowAddNoteModal(true),
                        icon: <FaPlus size={16} className="mr-2" />,
                        label: "Add Note"
                    }}/>
            </div>
            <div className="flex flex-1 overflow-hidden relative">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                    aria-label="Toggle menu">
                    <FaBars size={24}/>
                </button>
                <div className="hidden md:block bg-white shadow-md z-5 border-r border-blue-100">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} />
                </div>
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} isMobile={true} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />
                    </div>
                )}
                <div className="flex-1 overflow-auto bg-indigo-50 flex flex-col">
                    <div className="sticky top-0 z-10 bg-white shadow-sm px-6 py-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setNoteType("personal")}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 ${noteType === "personal" ? "bg-indigo-600 !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        Personal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNoteType("shared")}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200 ${noteType === "shared" ? "bg-indigo-600 !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        Shared
                                    </button>
                                </div>
                                <div className="inline-flex rounded-md shadow-sm ml-2" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("updated")}
                                        className={`px-3 py-2 text-xs font-medium rounded-l-lg border border-gray-200 ${sortBy === "updated" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        Recent
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("title")}
                                        className={`px-3 py-2 text-xs font-medium border-t border-b border-gray-200 ${sortBy === "title" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        A-Z
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSortBy("color")}
                                        className={`px-3 py-2 text-xs font-medium rounded-r-lg border border-gray-200 ${sortBy === "color" ? "bg-gray-200 text-gray-800" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        Color
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowAddNoteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 !text-white rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
                                    <FaPlus size={16} />
                                    <span className="hidden sm:inline">New Note</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {noteType === "personal" ? (
                                sortedPersonalNotes.length > 0 ? (
                                    <>
                                    {sortedPersonalNotes
                                        .filter(note => note.isPinned)
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md relative`}
                                                style={{
                                                    transform: note.isPinned ? "rotate(-1deg)" : "none"
                                                }}>
                                                {note.isPinned && (
                                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 rounded-full z-10 shadow-md" />
                                                )}
                                                <div className="p-5 relative z-0"
                                                    style={{
                                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                        backgroundSize: "100% 32px",
                                                        lineHeight: "32px"
                                                    }}>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <FaStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} />
                                                            <h3 className="font-semibold text-gray-800 text-lg"
                                                                style={{
                                                                    textShadow: "1px 1px 1px rgba(255,255,255,0.8)",
                                                                    lineHeight: "normal"
                                                                }}>
                                                                {note.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => togglePinStatus(note.id, false)}
                                                                className="p-1.5 rounded hover:bg-white/80 text-amber-500"
                                                                title={note.isPinned ? "Unpin note" : "Pin note"}>
                                                                <FaThumbtack size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mb-4 text-gray-700 text-sm break-words"
                                                        style={{
                                                            lineHeight: "32px",
                                                            textShadow: "0px 0px 1px rgba(255,255,255,0.5)",
                                                            maxHeight: expandedNote === note.id ? "none" : "160px",
                                                            overflow: "hidden"
                                                        }}>
                                                        {note.content}
                                                        {note.content.length > 200 && (
                                                            <button
                                                                onClick={() => toggleNoteExpansion(note.id)}
                                                                className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}
                                                            >
                                                                {expandedNote === note.id ? (
                                                                    <>
                                                                        <span>Show less</span>
                                                                        <FaChevronUp className="ml-1" size={12} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Read more</span>
                                                                        <FaChevronDown className="ml-1" size={12} />
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-200">
                                                        <div>
                                                            Updated {formatDate(note.updatedAt)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleShareStatus(note.id)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Share note">
                                                                <FaShare size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditNote(note, false)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Edit note">
                                                                <FaPencilAlt size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setNoteToDelete({ id: note.id, title: note.title, isShared: false })}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Delete note">
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {sortedPersonalNotes
                                        .filter(note => !note.isPinned)
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}>
                                                <div className="p-5"
                                                    style={{
                                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                        backgroundSize: "100% 32px",
                                                        lineHeight: "32px",
                                                    }}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <FaRegStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} />
                                                            <h3 className="font-semibold text-gray-800">{note.title}</h3>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => togglePinStatus(note.id, false)}
                                                                className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-amber-500"
                                                                title="Pin note">
                                                                <FaThumbtack size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mb-4 text-gray-600 text-sm break-words"
                                                        style={{
                                                            lineHeight: "32px",
                                                            maxHeight: expandedNote === note.id ? "none" : "160px",
                                                            overflow: "hidden"
                                                        }}>
                                                        {note.content}
                                                        {note.content.length > 200 && (
                                                            <button
                                                                onClick={() => toggleNoteExpansion(note.id)}
                                                                className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}
                                                            >
                                                                {expandedNote === note.id ? (
                                                                    <>
                                                                        <span>Show less</span>
                                                                        <FaChevronUp className="ml-1" size={12} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Read more</span>
                                                                        <FaChevronDown className="ml-1" size={12} />
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                                                        <div>
                                                            Updated {formatDate(note.updatedAt)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleShareStatus(note.id)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Share note">
                                                                <FaShare size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditNote(note, false)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Edit note">
                                                                <FaPencilAlt size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setNoteToDelete({ id: note.id, title: note.title, isShared: false })}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Delete note">
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                                        <FileText size={48} className="mb-4 opacity-50" />
                                        <p>No personal notes found</p>
                                        <button
                                            onClick={() => setShowAddNoteModal(true)}
                                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                                            Create your first note
                                        </button>
                                    </div>
                                )
                            )
                            :
                            (
                                sortedSharedNotes.length > 0 ? (
                                    <>
                                    {sortedSharedNotes
                                        .filter(note => note.isPinned)
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}>
                                                <div className="p-5"
                                                    style={{
                                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                        backgroundSize: "100% 32px",
                                                        lineHeight: "32px"
                                                    }}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <FaStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} />
                                                            <h3 className="font-semibold text-gray-800">{note.title}</h3>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => togglePinStatus(note.id, true)}
                                                                className="p-1.5 rounded hover:bg-white/80 text-amber-500"
                                                                title="Unpin note">
                                                                <FaThumbtack size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mb-4 text-gray-600 text-sm break-words"
                                                        style={{
                                                            lineHeight: "32px",
                                                            maxHeight: expandedNote === note.id ? "none" : "160px",
                                                            overflow: "hidden"
                                                        }}>
                                                        {note.content}
                                                        {note.content.length > 200 && (
                                                            <button
                                                                onClick={() => toggleNoteExpansion(note.id)}
                                                                className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}
                                                            >
                                                                {expandedNote === note.id ? (
                                                                    <>
                                                                        <span>Show less</span>
                                                                        <FaChevronUp className="ml-1" size={12} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Read more</span>
                                                                        <FaChevronDown className="ml-1" size={12} />
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={note.author.image}
                                                                alt={note.author.name}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                            <span className="text-xs text-gray-600">{note.author.name}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatDate(note.updatedAt)}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleEditNote(note, true)}
                                                            className="p-1.5 rounded hover:bg-white/80"
                                                            title="Edit note">
                                                            <FaPencilAlt size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => setNoteToDelete({ id: note.id, title: note.title, isShared: true })}
                                                            className="p-1.5 rounded hover:bg-white/80"
                                                            title="Delete note">
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {sortedSharedNotes
                                            .filter(note => !note.isPinned)
                                            .map((note) => (
                                                <div
                                                    key={note.id}
                                                    className={`${colorVariants[note.color]?.bg || colorVariants.default.bg} ${colorVariants[note.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}>
                                                    <div className="p-5"
                                                        style={{
                                                            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e5f7 31px, #e5e5f7 32px)",
                                                            backgroundSize: "100% 32px",
                                                            lineHeight: "32px",
                                                        }}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaRegStickyNote className={`${colorVariants[note.color]?.icon || colorVariants.default.icon}`} />
                                                                <h3 className="font-semibold text-gray-800">{note.title}</h3>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => togglePinStatus(note.id, true)}
                                                                    className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-amber-500"
                                                                    title="Pin note">
                                                                    <FaThumbtack size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 mb-4 text-gray-600 text-sm break-words"
                                                            style={{
                                                                lineHeight: "32px",
                                                                maxHeight: expandedNote === note.id ? "none" : "160px",
                                                                overflow: "hidden"
                                                            }}>
                                                            {note.content}
                                                            {note.content.length > 200 && (
                                                                <button
                                                                    onClick={() => toggleNoteExpansion(note.id)}
                                                                    className={`${colorVariants[note.color]?.text || colorVariants.default.text} hover:underline text-xs ml-2 flex items-center`}
                                                                >
                                                                    {expandedNote === note.id ? (
                                                                        <>
                                                                            <span>Show less</span>
                                                                            <FaChevronUp className="ml-1" size={12} />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span>Read more</span>
                                                                            <FaChevronDown className="ml-1" size={12} />
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-between items-center mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={note.author.image}
                                                                    alt={note.author.name}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <span className="text-xs text-gray-600">{note.author.name}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {formatDate(note.updatedAt)}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleEditNote(note, true)}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Edit note">
                                                                <FaPencilAlt size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => setNoteToDelete({ id: note.id, title: note.title, isShared: true })}
                                                                className="p-1.5 rounded hover:bg-white/80"
                                                                title="Delete note">
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </>
                                )
                                :
                                (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                                        <div className="relative">
                                            <FileText size={64} className="mb-4 opacity-30" />
                                            <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
                                                <X size={32} className="text-gray-400 opacity-70" />
                                            </div>
                                        </div>
                                        <p className="text-lg mb-2">No notes found</p>
                                        <p className="text-sm text-gray-400 mb-4">Create your first note to get started</p>
                                        <button
                                            onClick={() => setShowAddNoteModal(true)}
                                            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-md flex items-center gap-2">
                                            <FaPlus size={16} />
                                            Create new note
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
                                className="fixed inset-0 flex items-center justify-center px-4"
                                initial={{ y: "-20%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                                style={{ zIndex: 1001 }}>
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
                                    <div className="flex justify-between items-center p-5 bg-indigo-600 text-white rounded-t-lg">
                                        <h3 className="text-xl font-semibold">Create New Note</h3>
                                        <button
                                            onClick={() => setShowAddNoteModal(false)}
                                            className="p-1 rounded-full hover:bg-indigo-700 transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={newNoteTitle}
                                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                                placeholder="Note title"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Note Color</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.keys(colorVariants).filter(color => color !== 'default').map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setNewNoteColor(color)}
                                                        className={`w-8 h-8 rounded-full border-2 ${newNoteColor === color ? 'border-gray-800' : 'border-transparent'}`}
                                                        style={{ backgroundColor: colorVariants[color].noteColor }}
                                                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Content</label>
                                            <textarea
                                                value={newNoteContent}
                                                onChange={(e) => setNewNoteContent(e.target.value)}
                                                placeholder="Note content"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"></textarea>
                                        </div>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="pin-note"
                                                    checked={newNotePinned}
                                                    onChange={() => setNewNotePinned(!newNotePinned)}
                                                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                                <label htmlFor="pin-note" className="text-gray-700 text-sm">Pin Note</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="share-note"
                                                    checked={newNoteShared}
                                                    onChange={() => setNewNoteShared(!newNoteShared)}
                                                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                                <label htmlFor="share-note" className="text-gray-700 text-sm">Share with Team</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowAddNoteModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={addNote}
                                                disabled={!newNoteTitle.trim()}
                                                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${newNoteTitle.trim()
                                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                                        : "bg-indigo-400 cursor-not-allowed"
                                                    }`}>
                                                Create Note
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
                                style={{ zIndex: 1000 }}/>
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center px-4"
                                initial={{ y: "-20%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15 }}>
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
                                    <div className="flex justify-between items-center p-5 bg-indigo-600 text-white rounded-t-lg">
                                        <h3 className="text-xl font-semibold">Edit Note</h3>
                                        <button
                                            onClick={() => setShowEditNoteModal(false)}
                                            className="p-1 rounded-full hover:bg-indigo-700 transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={editNoteData.title}
                                                onChange={(e) => setEditNoteData({ ...editNoteData, title: e.target.value })}
                                                placeholder="Note title"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Content</label>
                                            <textarea
                                                value={editNoteData.content}
                                                onChange={(e) => setEditNoteData({ ...editNoteData, content: e.target.value })}
                                                placeholder="Note content"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"></textarea>
                                        </div>
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="edit-pin-note"
                                                    checked={editNoteData.isPinned}
                                                    onChange={() => setEditNoteData({ ...editNoteData, isPinned: !editNoteData.isPinned })}
                                                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                                <label htmlFor="edit-pin-note" className="text-gray-700 text-sm">Pin Note</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowEditNoteModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={editNote}
                                                disabled={!editNoteData.title.trim()}
                                                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${editNoteData.title.trim()
                                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                                        : "bg-indigo-400 cursor-not-allowed"}`}>
                                                Save Changes
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
                        onConfirm={() => deleteNote(noteToDelete.id, noteToDelete.isShared)}
                        onCancel={() => setNoteToDelete(null)}/>)
                }
            </div>
        </div>
    );
}

export default Notes;