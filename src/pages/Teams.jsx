import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
    FaUsers, FaTasks, FaHome, FaCog, FaChartLine, FaPencilAlt, FaTrash,
    FaUserPlus, FaBars, FaHeart, FaSearch, FaUserFriends, FaDragon, FaCode,
    FaPalette, FaServer, FaCogs, FaLightbulb, FaChartBar, FaFolder, FaDatabase,
    FaDesktop, FaPaintBrush, FaRocket, FaShieldAlt, FaGem, FaStar, FaMagic,
} from "react-icons/fa";

import { MdGroupAdd, MdAssignment, MdWork, MdBuild, MdFolderOpen } from "react-icons/md";
import { IoMdPeople, IoMdSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { KanbanSquare, Layout, Settings, Users, Activity,MessageCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, BookOpen } from "lucide-react";


const ICON_CATEGORIES = {
    Basic: [
        { name: "Users", icon: FaUsers },
        { name: "Cogs", icon: FaCogs },
        { name: "Lightbulb", icon: FaLightbulb },
        { name: "ChartBar", icon: FaChartBar },
        { name: "Folder", icon: FaFolder },
    ],
    Project: [
        { name: "AddGroup", icon: MdGroupAdd },
        { name: "Assignment", icon: MdAssignment },
        { name: "Work", icon: MdWork },
        { name: "Build", icon: MdBuild },
        { name: "FolderOpen", icon: MdFolderOpen },
    ],
    Tech: [
        { name: "Database", icon: FaDatabase },
        { name: "Server", icon: FaServer },
        { name: "Code", icon: FaCode },
        { name: "Cog", icon: FaCog },
        { name: "Desktop", icon: FaDesktop },
        { name: "PaintBrush", icon: FaPaintBrush },
    ],
    Fancy: [
        { name: "Dragon", icon: FaDragon },
        { name: "Rocket", icon: FaRocket },
        { name: "Shield", icon: FaShieldAlt },
        { name: "Gem", icon: FaGem },
        { name: "Star", icon: FaStar },
        { name: "Magic", icon: FaMagic },
    ],
};

const iconMap = Object.values(ICON_CATEGORIES).reduce((acc, category) => {
    category.forEach(({ name, icon }) => {
        acc[name] = icon;
    });
    return acc;
}, {});

const allIcons = Object.entries(ICON_CATEGORIES).flatMap(([category, icons]) =>
    icons.map(icon => ({ ...icon, category }))
);

// IconPicker Component
const IconPicker = ({ currentIcon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const pickerRef = useRef(null);
    const inputRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filteredIcons = allIcons.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedIcons = filteredIcons.reduce((acc, icon) => {
        acc[icon.category] = acc[icon.category] || [];
        acc[icon.category].push(icon);
        return acc;
    }, {});

    const IconComponent = iconMap[currentIcon] || FaUsers;

    return (
        <div className="relative" ref={pickerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="border p-2 rounded hover:bg-gray-100 flex items-center gap-2 transition-all duration-150"
                aria-label="Select icon"
                title={t("icon.select")}
            >
                <IconComponent className="h-5 w-5 text-gray-700" />
                <span className="text-sm text-[var(--features-icon-color)]">{currentIcon}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-[10010] max-h-96 overflow-y-auto"
                    >
                        <div className="p-2 border-b sticky top-0 bg-white z-[10011]">
                            <div className="relative">
                                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--features-icon-color)]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("icon.search") || "Search icons..."}
                                    className="w-full pl-8 p-2 border rounded text-sm !text-[var(--features-icon-color)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-teams-color)]"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <X className="h-4 w-4 text-[var(--features-icon-color)] hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-2">
                            {Object.entries(groupedIcons).map(([category, icons]) => (
                                <div key={category} className="mb-4">
                                    <h4 className="text-xs font-semibold text-[var(--text-color3)] mb-2 px-1">{category}</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {icons.map(({ name, icon: Icon }) => (
                                            <button
                                                key={name}
                                                onClick={() => {
                                                    onSelect(name);
                                                    setIsOpen(false);
                                                    setSearchTerm("");
                                                }}
                                                className={`p-2 rounded hover:bg-[var(--sidebar-teams-color)]/10 transition-colors duration-150 flex items-center justify-center ${currentIcon === name ? "bg-[var(--sidebar-teams-color)]/20 ring-2 ring-[var(--sidebar-teams-color)]/40" : ""}`}
                                                title={name}
                                            >
                                                <Icon className="h-5 w-5 text-[var(--features-icon-color)]" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(groupedIcons).length === 0 && (
                                <div className="py-8 text-center text-gray-500">
                                    {t("icon.no_results") || "No icons found"}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// TeamDeleteConfirmation Component (unchanged)
const TeamDeleteConfirmation = ({ teamName, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    if (!teamName || typeof teamName !== "string") return null;

    return (
        <AnimatePresence>
            {teamName && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onCancel}
                        style={{ zIndex: 10002 }}
                    />
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center"
                        initial={{ y: "-20%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15 }}
                        style={{ zIndex: 10003 }}
                    >
                        <div className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden">
                            <div className="bg-[var(--bug-report)] p-4 shadow-md">
                                <h3 className="text-xl font-bold !text-white text-center">{t("adset.conf")}</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <p className="text-gray-700 text-center">{t("adset.remteam")} "{teamName}"?</p>
                                <div className="flex justify-between">
                                    <button
                                        className="bg-gray-500 !text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 w-32"
                                        onClick={onCancel}
                                    >
                                        {t("bug.can")}
                                    </button>
                                    <button
                                        className="bg-[var(--bug-report)]/90 !text-white py-2 px-6 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 hover:scale-105 w-32"
                                        onClick={() => onConfirm(teamName)}
                                    >
                                        {t("adset.del")}
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

const Teams = () =>
{
    const { id: projectId } = useParams();
    const { t } = useTranslation();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState("teams");
    const [teams, setTeams] = useState([]);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editTeamData, setEditTeamData] = useState({ id: null, name: "", icon: "Users" });
    const [viewMode, setViewMode] = useState("grid");
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamIcon, setNewTeamIcon] = useState("Users");
    const [teamToDelete, setTeamToDelete] = useState(null);
    const location = useLocation();
    const isOwner = location.state?.isOwner || false;
    const [projectMembers, setProjectMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const colorVariants =
    {
        blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", hover: "hover:bg-blue-100", button: "bg-blue-600 hover:bg-blue-700", icon: "text-blue-500" },
        green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", hover: "hover:bg-green-100", button: "bg-green-600 hover:bg-green-700", icon: "text-green-500" },
        purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", hover: "hover:bg-purple-100", button: "bg-purple-600 hover:bg-purple-700", icon: "text-purple-500" },
        orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", hover: "hover:bg-orange-100", button: "bg-orange-600 hover:bg-orange-700", icon: "text-orange-500" },
        default: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", hover: "hover:bg-gray-100", button: "bg-gray-600 hover:bg-gray-700", icon: "text-gray-500" }
    };

    useEffect(() =>
    {
        fetchTeams();
    }, [projectId, getToken]);

    const fetchProjectMembers = async () =>
    {
        setIsLoading(true);
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

            const membersData = response.data.map(member => ({
                id: member.userId,
                username: member.username || 'No username',
                email: member.email,
                profileImageUrl: member.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`
            }));

            setProjectMembers(membersData);
        }catch(err){
            console.error('Error fetching project members:', err);
        }finally{
            setIsLoading(false);
        }
    };

    const fetchTeams = async () =>
    {
        try{
            const token = await getToken();
            const response = await axios.get(
                `http://localhost:8080/api/projects/${projectId}/teams`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const teamsData = response.data.map((team, index) => ({
                id: team.teamId,
                name: team.teamName,
                icon: iconMap[team.iconName] || FaCode,
                color: ["blue", "green", "purple", "orange"][index % 4],
                members: team.members ? team.members.map(m => ({
                    id: m.userId,
                    name: m.username || m.email,
                    email: m.email,
                    image: m.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.email}`
                })) : []
            }));

            setTeams(teamsData);
        }catch(err){
            console.error('Error fetching teams:', err);
        }
    };

    const addTeam = async () =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can create teams.");
            return;
        }
        if(!newTeamName.trim())
            return;

        try{
            const token = await getToken();
            const response = await axios.post(
                `http://localhost:8080/api/projects/${projectId}/teams`,
                {
                    teamName: newTeamName.trim(),
                    iconName: newTeamIcon
                },
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newTeam =
            {
                id: response.data.teamId,
                name: response.data.teamName,
                icon: iconMap[response.data.iconName] || FaCode,
                color: Object.keys(colorVariants)[teams.length % 4],
                members: []
            };

            setTeams(prev => [...prev, newTeam]);
            setNewTeamName("");
            setNewTeamIcon("Users");
            setShowAddTeamModal(false);
        }catch(err){
            console.error('Error creating team:', err);
            alert("Failed to create team. Please try again.");
        }
    };

    const editTeam = async () =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can edit teams.");
            return;
        }
        if(!editTeamData.name.trim())
            return;

        try{
            const token = await getToken();
            await axios.put(
                `http://localhost:8080/api/projects/${projectId}/teams/${editTeamData.id}`,
                {
                    teamName: editTeamData.name.trim(),
                    iconName: editTeamData.icon
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team.id === editTeamData.id ? { ...team, name: editTeamData.name, icon: iconMap[editTeamData.icon] || FaCode } : team
                )
            );
            setShowEditTeamModal(false);
            setEditTeamData({ id: null, name: "", icon: "Users" });
        }catch(err){
            console.error('Error updating team:', err);
            alert("Failed to update team. Please try again.");
        }
    };

    const deleteTeam = async (teamId) =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can delete teams.");
            return;
        }
        try{
            const token = await getToken();
            await axios.delete(
                `http://localhost:8080/api/projects/${projectId}/teams/${teamId}`,
                {
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            setTeamToDelete(null);
        }catch(err){
            console.error('Error deleting team:', err);
            alert("Failed to delete team. Please try again.");
        }
    };

    const toggleMemberSelection = (memberId) =>
    {
        setSelectedMembers(prev =>
        {
            if(prev.includes(memberId))
                return prev.filter(id => id !== memberId);
            else
                return [...prev, memberId];
        });
    };

    const addMembersToTeam = async (teamId, memberIds) =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can add members to teams.");
            return;
        }

        try{
            const token = await getToken();

            const addPromises = memberIds.map(memberId =>
                axios.post(
                    `http://localhost:8080/api/teams/${teamId}/members`,
                    null,
                    {
                        params: { userId: memberId },
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                )
            );

            await Promise.all(addPromises);

            await fetchTeams();
            setShowAddMemberModal(false);
        }catch(err){
            console.error('Error adding members to team:', err);
            alert(err.response?.data?.message || "Failed to add members. Please try again.");
        }
    };

    const removeMemberFromTeam = async (teamId, memberId) =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can remove members from teams.");
            return;
        }
        try{
            const token = await getToken();

            await axios.delete(
                `http://localhost:8080/api/teams/${teamId}/members`,
                {
                    params: { userId: memberId },
                    withCredentials: true,
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            await fetchTeams();
        }catch(err){
            console.error('Error removing member from team:', err);
            alert(err.response?.data?.message || "Failed to remove member. Please try again.");
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.members.some(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const toggleTeamExpansion = (teamId) =>
    {
        setExpandedTeam(expandedTeam === teamId ? null : teamId);
    };

    const handleAddMember = (teamId) => {
        if(!isOwner)
        {
            alert("Only the project owner can add members.");
            return;
        }
        setSelectedTeam(teamId);
        setSelectedMembers([]);
        fetchProjectMembers();
        setShowAddMemberModal(true);
    };

    const handleEditTeam = (teamId) =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can edit teams.");
            return;
        }
        const team = teams.find(t => t.id === teamId);
        setEditTeamData({
            id: team.id,
            name: team.name,
            icon: Object.keys(iconMap).find(key => iconMap[key] === team.icon) || "Users"
        });
        setShowEditTeamModal(true);
    };

    const handleDeleteTeam = (team) =>
    {
        if(!isOwner)
        {
            alert("Only the project owner can delete teams.");
            return;
        }
        setTeamToDelete(team);
    };

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

    const toggleMobileSidebar = () =>
    {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
            id: 'chat',
            icon: MessageCircle,
            label: t("sidebar.chat"),
            path: `/project/${projectId}/temp-chat`,
            state: { isOwner },
            color: 'bg-indigo-100 text-indigo-600', //değiş
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

    return(
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b border-[var(--sidebar-teams-color)]">
                <Header
                    title={<span className="text-xl font-semibold text-[var(--sidebar-teams-color)]">{t("sidebar.team")}</span>}
                    action={{
                        onClick: () => isOwner && setShowAddTeamModal(true),
                        icon: <FaUsers size={16} className="mr-2" />,
                        label: "Add Team",
                        disabled: !isOwner
                    }} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                    aria-label="Toggle menu">
                    <FaBars size={24} />
                </button>

                <div className="hidden md:block bg-white shadow-md z-5 border-r border-blue-100">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} />
                </div>

                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customNavItems={customNavItems} isMobile={true} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />
                    </div>
                )}

                <div className="flex-1 overflow-auto bg-[var(--sidebar-teams-bg-color)] flex flex-col">
                    <div className="sticky top-0 z-10 bg-white shadow-sm px-6 py-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--features-icon-color)]" size={18} />
                                <input
                                    type="text"
                                    placeholder={t("team.search_placeholder") || "Search teams or members..."}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-[var(--text-color3)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-teams-color)] text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 ${viewMode === "grid" ? "bg-[var(--sidebar-teams-color)] !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("team.grid") }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200 ${viewMode === "list" ? "bg-[var(--sidebar-teams-color)] !text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                                        {t("team.list")}
                                    </button>
                                </div>

                                <button
                                    onClick={() => isOwner && setShowAddTeamModal(true)}
                                    className={`flex items-center gap-2 px-4 py-2 bg-[var(--sidebar-teams-color)] !text-white rounded-lg hover:bg-opacity-90 transition-all shadow-sm ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!isOwner}>
                                    <FaUserPlus size={16} />
                                    <span className="hidden sm:inline">{t("team.newteam")}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex-grow">
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTeams.length > 0 ? (
                                    filteredTeams.map((team) => (
                                        <div
                                            key={team.id}
                                            className={`${colorVariants[team.color]?.bg || colorVariants.default.bg} ${colorVariants[team.color]?.border || colorVariants.default.border} border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}>
                                            <div className="p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${colorVariants[team.color]?.icon || colorVariants.default.icon} bg-white/80`}>
                                                            {React.createElement(team.icon, { size: 20 })}
                                                        </div>
                                                        <h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleEditTeam(team.id)} className="p-1.5 rounded hover:bg-white/80" disabled={!isOwner}>
                                                            <FaPencilAlt size={16} className="text-gray-500" />
                                                        </button>
                                                        <button onClick={() => handleDeleteTeam(team)} className="p-1.5 rounded hover:bg-white/80" disabled={!isOwner}>
                                                            <FaTrash size={16} className="text-gray-500" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="text-sm text-gray-600">
                                                        {team.members.length} {team.members.length === 1 ? t("team.singlemem") : t("team.multimem")}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddMember(team.id)}
                                                        className={`text-xs px-2 py-1 rounded ${colorVariants[team.color]?.text || colorVariants.default.text} bg-white/60 ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        disabled={!isOwner}>
                                                        {t("team.addmem")}
                                                    </button>
                                                </div>

                                                <div className="flex -space-x-2 mb-4">
                                                    {team.members.slice(0, 5).map((member) => (
                                                        <img
                                                            key={member.id}
                                                            src={member.image}
                                                            alt={member.name}
                                                            title={member.name}
                                                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white" />
                                                    ))}
                                                    {team.members.length > 5 && (
                                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-600">
                                                            +{team.members.length - 5}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => toggleTeamExpansion(team.id)}
                                                    className={`w-full py-2 text-center text-sm font-medium rounded ${expandedTeam === team.id ? "bg-white text-gray-700" : `${colorVariants[team.color]?.button || colorVariants.default.button} !text-white`}`}>
                                                    {expandedTeam === team.id ? t("team.hidemems") : t("team.viewmems")}
                                                </button>

                                                {expandedTeam === team.id && (
                                                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pt-3 border-t border-gray-200">
                                                        {team.members.map((member) => (
                                                            <div key={member.id} className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full" />
                                                                    <div>
                                                                        <div className="font-medium text-sm">{member.name}</div>
                                                                        <div className="text-xs text-gray-500">{member.email}</div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeMemberFromTeam(team.id, member.id)}
                                                                    className={`text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                    disabled={!isOwner}>
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-[var(--features-icon-color)]">
                                        <FaUserFriends size={48} className="mb-4 opacity-50" />
                                        <p>{t("team.nosearchfnd")}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {filteredTeams.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {filteredTeams.map((team) => (
                                            <div key={team.id} className="hover:bg-gray-50 transition-colors">
                                                <div className="px-6 py-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${colorVariants[team.color]?.icon || colorVariants.default.icon} bg-gray-50`}>
                                                                {React.createElement(team.icon, { size: 20 })}
                                                            </div>
                                                            <h3 className="font-medium text-[var(--features-icon-color)]">{team.name}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-sm text-gray-500 hidden sm:block">
                                                                {team.members.length} {team.members.length === 1 ? t("team.singlemem") : t("team.multimem")}
                                                            </div>
                                                            <div className="flex -space-x-2">
                                                                {team.members.slice(0, 3).map((member) => (
                                                                    <img
                                                                        key={member.id}
                                                                        src={member.image}
                                                                        alt={member.name}
                                                                        title={member.name}
                                                                        className="inline-block h-8 w-8 rounded-full ring-1 ring-white" />
                                                                ))}
                                                                {team.members.length > 3 && (
                                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 ring-1 ring-white text-xs font-medium text-gray-600">
                                                                        +{team.members.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleAddMember(team.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={t(team.addmem)} disabled={!isOwner}>
                                                                    <FaUserPlus size={16} />
                                                                </button>
                                                                <button onClick={() => handleEditTeam(team.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={t(team.editmem)} disabled={!isOwner}>
                                                                    <FaPencilAlt size={16} />
                                                                </button>
                                                                <button onClick={() => handleDeleteTeam(team)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={t(team.deletmem)} disabled={!isOwner}>
                                                                    <FaTrash size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => toggleTeamExpansion(team.id)}
                                                                    className={`p-1.5 rounded ${expandedTeam === team.id ? "bg-gray-100" : "hover:bg-gray-100"} text-gray-500`}
                                                                    title={expandedTeam === team.id ? "Hide members" : "View members"}>
                                                                    {expandedTeam === team.id ? <span className="text-xs font-medium">Hide</span> : <span className="text-xs font-medium">View</span>}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {expandedTeam === team.id && (
                                                        <div className="mt-4 pl-12 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {team.members.map((member) => (
                                                                <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full" />
                                                                        <div>
                                                                            <div className="font-medium text-sm text-[var(--features-icon-color)]">{member.name}</div>
                                                                            <div className="text-xs text-black">{member.email}</div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeMemberFromTeam(team.id, member.id)}
                                                                        className={`text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                        disabled={!isOwner}>
                                                                        <FaTrash size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <FaUserFriends size={48} className="mb-4 opacity-50" />
                                        <p>No teams found matching your search criteria</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6 mt-auto">
                        <div className="flex flex-row justify-between items-center text-xs text-[var(--featureas-icon-color)]">
                            <div>
                                <span className="text-[var(--sidebar-teams-color)]">© 2025 PlanWise</span>
                                <span className="hidden sm:inline text-[var(--sidebar-teams-color)]"> • {t("dashboard.rights")}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/terms" className="text-[var(--sidebar-teams-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.terms")}</Link>
                                <Link to="/privacy" className="text-[var(--sidebar-teams-color)] hover:text-[var(--hover-color)] transition-colors">{t("dashboard.pri")}</Link>
                                <span className="flex items-center text-[var(--sidebar-teams-color)]">
                                    {t("dashboard.made")} <FaHeart size={12} className="mx-1 text-red-500" /> {t("dashboard.by")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg text-[var(--features-icon-color)] font-semibold mb-4">{t("team.crnewteam")}</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[var(--features-icon-color)] ">
                                <IconPicker
                                    currentIcon={newTeamIcon}
                                    onSelect={setNewTeamIcon}
                                />
                                <input
                                    type="text"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    className="w-full px-3 py-2 border text-[var(--features-icon-color)] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-teams-color)]"
                                    placeholder={t("team.entertname")} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowAddTeamModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                    {t("team.tpcancel")}
                                </button>
                                <button
                                    onClick={addTeam}
                                    className="px-4 py-2 text-sm font-medium !text-white bg-[var(--sidebar-teams-color)] rounded-md hover:bg-opacity-90">
                                    {t("team.crnewteam") }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-[var(--features-icon-color)] mb-4">{t("team.editteamcapt")}</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <IconPicker
                                    currentIcon={editTeamData.icon}
                                    onSelect={(icon) => setEditTeamData(prev => ({ ...prev, icon }))}
                                />
                                <input
                                    type="text"
                                    value={editTeamData.name}
                                    onChange={(e) => setEditTeamData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-[var(--features-icon-color)] focus:ring-2 focus:ring-[var(--sidebar-teams-color)]"
                                    placeholder={t("team.entertname")} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowEditTeamModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                    {t("team.tpcancel")}
                                </button>
                                <button
                                    onClick={editTeam}
                                    className="px-4 py-2 text-sm font-medium !text-white bg-[var(--sidebar-teams-color)] rounded-md hover:bg-opacity-90">
                                    {t("team.crteam")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg text-[var(--features-icon-color)] font-semibold mb-4">{t("team.addtmems")}</h3>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--sidebar-teams-color)]"></div>
                            </div>
                        ) : (
                            <>
                                {projectMembers.length > 0 ? (
                                    <div className="mb-4">
                                        <div className="mb-2 flex justify-between items-center">
                                            <label className="block text-sm font-medium text-gray-700">{t("team.selecmems")}</label>
                                            <span className="text-xs text-gray-500">{selectedMembers.length} {t("team.slctd")}</span>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                                            {projectMembers.map(member =>
                                                {
                                                const currentTeam = teams.find(t => t.id === selectedTeam);
                                                const isAlreadyInTeam = currentTeam?.members.some(m => m.id === member.id);

                                                if (isAlreadyInTeam) return null;

                                                return (
                                                    <div
                                                        key={member.id}
                                                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${selectedMembers.includes(member.id) ? 'bg-blue-50' : ''
                                                            }`}
                                                        onClick={() => toggleMemberSelection(member.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={member.profileImageUrl}
                                                                alt={member.username}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <div className="font-medium">{member.username}</div>
                                                                <div className="text-sm text-gray-500">{member.email}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMembers.includes(member.id)}
                                                                onChange={() => { }}
                                                                className="h-5 w-5 text-[var(--sidebar-teams-color)] rounded border-gray-300 focus:ring-[var(--sidebar-teams-color)]"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {projectMembers.length === 0 && (
                                                <div className="p-4 text-center text-gray-500">
                                                    No available members to add
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No members available in this project
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowAddMemberModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                {t("team.tpcancel")}
                            </button>
                            <button
                                onClick={() => addMembersToTeam(selectedTeam, selectedMembers)}
                                disabled={selectedMembers.length === 0 || isLoading}
                                className={`px-4 py-2 text-sm font-medium !text-white rounded-md ${selectedMembers.length === 0 || isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[var(--sidebar-teams-color)] hover:bg-opacity-90'
                                    }`}>
                                {t("team.add")} {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TeamDeleteConfirmation
                teamName={teamToDelete?.name}
                onConfirm={() => deleteTeam(teamToDelete.id)}
                onCancel={() => setTeamToDelete(null)}
            />
        </div>
    );
};

export default Teams;