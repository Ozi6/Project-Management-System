import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, Search, X, Plus, Save, Trash2, Users, Loader2 } from "lucide-react";
import {
    FaUsers, FaCogs, FaLightbulb, FaChartBar, FaFolder, FaDatabase,
    FaServer, FaCode, FaCog, FaDesktop, FaPaintBrush, FaDragon,
    FaRocket, FaShieldAlt, FaGem, FaStar, FaMagic
} from "react-icons/fa";
import {
    MdGroupAdd, MdAssignment, MdWork, MdBuild, MdFolderOpen
} from "react-icons/md";
import { IoMdPeople, IoMdSettings } from "react-icons/io";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

const ICON_CATEGORIES =
{
    Basic:
    [
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

const iconMap = Object.values(ICON_CATEGORIES).reduce((acc, category) =>
{
    category.forEach(({ name, icon }) => {
        acc[name] = icon;
    });
    return acc;
}, {});

const allIcons = Object.entries(ICON_CATEGORIES).flatMap(([category, icons]) =>
    icons.map(icon => ({ ...icon, category }))
);

const IconPicker = ({ currentIcon, onSelect }) =>
{
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const pickerRef = useRef(null);
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleClickOutside = (event) =>
        {
            if (pickerRef.current && !pickerRef.current.contains(event.target))
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() =>
    {
        if (isOpen && inputRef.current)
        {
            inputRef.current.focus();

            if(pickerRef.current)
            {
                const rect = pickerRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX
                });
            }
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
                <span className="text-sm text-gray-600">{currentIcon}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed w-72 bg-white border rounded-lg shadow-lg z-[10020] max-h-96 overflow-y-auto"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            transformOrigin: 'top left'
                        }}
                    >
                        <div className="p-2 border-b sticky top-0 bg-white z-[10021]">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("icon.search")}
                                    className="w-full pl-8 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-2">
                            {Object.entries(groupedIcons).map(([category, icons]) => (
                                <div key={category} className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-500 mb-2 px-1">{category}</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {icons.map(({ name, icon: Icon }) => (
                                            <button
                                                key={name}
                                                onClick={() => {
                                                    onSelect(name);
                                                    setIsOpen(false);
                                                    setSearchTerm("");
                                                }}
                                                className={`p-2 rounded hover:bg-[var(--features-icon-color)]/10 transition-colors duration-150 flex items-center justify-center ${currentIcon === name ? "bg-[var(--features-icon-color)]/20 ring-2 ring-[var(--features-icon-color)]/40" : ""}`}
                                                title={name}
                                            >
                                                <Icon className="h-5 w-5 text-gray-700" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(groupedIcons).length === 0 && (
                                <div className="py-8 text-center text-gray-500">
                                    {t("icon.no_results")}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TeamDeleteConfirmation = ({ teamName, onConfirm, onCancel }) =>
{
    const { t } = useTranslation();

    if(!teamName || typeof teamName !== "string")
        return null;

    return (
        <AnimatePresence>
            {teamName && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                        style={{ zIndex: 10002 }}
                    />
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        style={{ zIndex: 10003 }}
                    >
                        <div className="bg-white rounded-lg w-80 flex flex-col shadow-xl overflow-hidden">
                            <div className="bg-[var(--bug-report)] p-4">
                                <h3 className="text-xl font-bold !text-white text-center">{t("adset.conf")}</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <p className="text-gray-700 text-center">
                                    {t("adset.remteam")} <span className="font-medium">"{teamName}"</span>?
                                </p>
                                <div className="flex justify-between gap-3 mt-2">
                                    <button
                                        className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium flex-1 border border-gray-300"
                                        onClick={onCancel}
                                    >
                                        {t("bug.can")}
                                    </button>
                                    <button
                                        className="bg-[var(--bug-report)]/90 !text-white py-2 px-4 rounded-md hover:bg-[var(--bug-report)] transition-all duration-200 font-medium flex-1"
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

const TeamCard = ({
    team,
    isEditing,
    editingTeamName,
    editingTeamIcon,
    localMemberTeams = [],
    onEdit,
    onSave,
    onDelete,
    onToggleTeam,
    onNameChange,
    onIconChange,
    onCancelEdit,
    inputRef
}) => {
    const { t } = useTranslation();
    const IconComponent = iconMap[team.icon] || FaUsers;
    const [isProcessing, setIsProcessing] = useState(false);
    const isMemberInTeam = localMemberTeams.includes(team.id);

    const handleToggle = async () => {
        setIsProcessing(true);
        try {
            await onToggleTeam(team.id);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 w-full p-4 bg-white border rounded-lg shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2">
                    <IconPicker
                        currentIcon={editingTeamIcon}
                        onSelect={onIconChange}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={editingTeamName}
                        onChange={(e) => onNameChange(e)}
                        className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                        onKeyDown={(e) => e.key === 'Enter' && onSave(team)}
                        placeholder={t("adset.team_name")}
                    />
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMemberInTeam}
                            onChange={handleToggle}
                            className="hidden"
                        />
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${isMemberInTeam
                            ? "bg-[var(--features-icon-color)]/50 border-[var(--features-icon-color)]/70"
                            : "bg-white border-gray-300 hover:border-gray-500"
                            }`}>
                            {isMemberInTeam && <Check size={16} className="text-white" />}
                        </span>
                    </label>
                </div>
                <div className="flex justify-between gap-2 mt-1">
                    <button
                        onClick={() => onSave(team)}
                        className="flex items-center justify-center gap-1 bg-[var(--features-icon-color)]/60 !text-white px-3 py-2 rounded hover:bg-[var(--features-icon-color)] flex-1 transition-all duration-200"
                    >
                        <Save size={16} />
                        {t("adset.save")}
                    </button>
                    <button
                        onClick={() => onDelete(team.id)}
                        className="flex items-center justify-center gap-1 bg-[var(--bug-report)]/90 !text-white px-3 py-2 rounded hover:bg-[var(--bug-report)] flex-1 transition-all duration-200"
                    >
                        <Trash2 size={16} />
                        {t("prode.del")}
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="flex items-center justify-center gap-1 bg-gray-500 !text-white px-3 py-2 rounded hover:bg-gray-600 flex-1 transition-all duration-200"
                    >
                        <X size={16} />
                        {t("bug.can")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between w-full p-4 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--features-icon-color)]/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-[var(--features-icon-color)]" />
                </div>
                <span className="text-gray-800 font-medium">{team.name}</span>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onEdit(team)}
                    className="border p-1.5 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200"
                    title={t("adset.edit_team")}
                    disabled={isProcessing}
                >
                    <Pencil size={16} />
                </button>

                <button
                    onClick={handleToggle}
                    disabled={isProcessing}
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${isMemberInTeam
                        ? "bg-[var(--features-icon-color)] border-[var(--features-icon-color)]"
                        : "bg-white border-gray-300 hover:border-gray-500"
                        }`}
                    title={isMemberInTeam ? t("adset.remove_from_team") : t("adset.add_to_team")}
                >
                    {isMemberInTeam ? (
                        isProcessing ? (
                            <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                            <Check size={16} className="text-white" />
                        )
                    ) : (
                        isProcessing ? (
                            <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : null
                    )}
                </button>
            </div>
        </div>
    );
};

const NewTeamForm = ({
    newTeamName,
    newTeamIcon,
    onNameChange,
    onIconChange,
    onAddTeam,
    onCancel
}) => {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    useEffect(() =>
    {
        if(inputRef.current)
            inputRef.current.focus();
    }, []);

    return(
        <div className="flex flex-col gap-3 p-4 bg-[var(--features-icon-color)]/5 border border-[var(--features-icon-color)]/20 rounded-lg">
            <div className="flex items-center gap-2 relative">
                <IconPicker
                    currentIcon={newTeamIcon}
                    onSelect={onIconChange}/>
                <input
                    ref={inputRef}
                    type="text"
                    value={newTeamName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)]"
                    placeholder={t("team.entertname")}
                    onKeyDown={(e) => e.key === 'Enter' && newTeamName.trim() && onAddTeam()}/>
            </div>
            <div className="flex justify-between gap-2">
                <button
                    onClick={onAddTeam}
                    disabled={!newTeamName.trim()}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded transition-all duration-200 flex-1 ${newTeamName.trim()
                            ? "bg-[var(--features-icon-color)]/70 hover:bg-[var(--features-icon-color)] !text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}>
                    <Plus size={16}/>
                    {t("team.crnewteam")}
                </button>
                <button
                    onClick={onCancel}
                    className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-all duration-200 flex-1">
                    <X size={16} />
                    {t("bug.can")}
                </button>
            </div>
        </div>
    );
};

const ModalHeader = ({ member }) =>
{
    const { t } = useTranslation();

    return(
        <div className="bg-[var(--features-icon-color)] p-4 shadow-md">
            <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                    {t("adset.teaman")} <span className="font-normal"></span>
                </h3>
            </div>
        </div>
    );
};

const ManageTeamsModal = ({ member, teams, onAddToTeam, onEditTeam, onDeleteTeam, onClose, projectId, onRemoveFromTeam }) =>
{
    const { t } = useTranslation();
    const [localMemberTeams, setLocalMemberTeams] = useState([]);
    const [localTeams, setLocalTeams] = useState([]);
    const [editingTeamId, setEditingTeamId] = useState(null);
    const [editingTeamName, setEditingTeamName] = useState("");
    const [editingTeamIcon, setEditingTeamIcon] = useState("");
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamIcon, setNewTeamIcon] = useState("Users");
    const [isAddingTeam, setIsAddingTeam] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const editInputRef = useRef(null);
    const { getToken } = useAuth();

    useEffect(() =>
    {
        const uniqueTeams = Array.isArray(teams)
            ? teams.map((team, index) => ({
                ...team,
                id: team.id || `${index}-${Date.now()}`
            }))
            : [];
        setLocalTeams(uniqueTeams);

        const memberTeamIds = uniqueTeams
            .filter(team => team.members && team.members.includes(member.id))
            .map(team => team.id);
        setLocalMemberTeams(memberTeamIds);
    }, [teams, member]);

    useEffect(() =>
    {
        if(editingTeamId && editInputRef.current)
            editInputRef.current.focus();
    }, [editingTeamId]);

    const handleEditTeam = (team) =>
    {
        if(editingTeamId === team.id)
            handleSaveTeam(team);
        else
        {
            setEditingTeamId(team.id);
            setEditingTeamName(team.name);
            setEditingTeamIcon(team.icon);
            setIsAddingTeam(false);
        }
    };

    const handleSaveTeam = async (oldTeam) =>
    {
        if(!editingTeamId || !editingTeamName.trim())
            return;

        const updatedTeam =
        {
            id: editingTeamId,
            name: editingTeamName.trim(),
            icon: editingTeamIcon || "Users"
        };

        try{
            setIsLoading(true);
            await onEditTeam(updatedTeam, oldTeam);

            setLocalTeams(prevTeams =>
                prevTeams.map(team =>
                    team.id === editingTeamId ? updatedTeam : team
                )
            );

            setMembers(prevMembers =>
                prevMembers.map(m =>
                    m.id === member.id && m.teams.includes(oldTeam.name)
                        ? { ...m, teams: m.teams.map(t => t === oldTeam.name ? updatedTeam.name : t) }
                        : m
                )
            );
        }catch(err){
            console.error('Failed to update team:', err);
        }finally{
            setIsLoading(false);
            setEditingTeamId(null);
            setEditingTeamName("");
            setEditingTeamIcon("");
        }
    };

    const handleToggleTeam = async (teamId) =>
    {
        if(!onAddToTeam || !member?.id)
            return;

        try{
            setIsLoading(true);
            const isCurrentlyInTeam = localMemberTeams.includes(teamId);

            if(isCurrentlyInTeam)
            {
                await axios.delete(
                    `http://localhost:8080/api/teams/${teamId}/members`,
                    {
                        params: { userId: member.id },
                        withCredentials: true,
                        headers:
                        {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    }
                );
                setLocalMemberTeams(prev => prev.filter(id => id !== teamId));
                setLocalTeams(prevTeams =>
                    prevTeams.map(team =>
                        team.id === teamId
                            ? { ...team, members: team.members?.filter(id => id !== member.id) || [] }
                            : team
                    )
                );

                onRemoveFromTeam(member.id, teamId);
            }
            else
            {
                await onAddToTeam(member.id, teamId);
                setLocalMemberTeams(prev => [...prev, teamId]);
                setLocalTeams(prevTeams =>
                    prevTeams.map(team =>
                        team.id === teamId
                            ? { ...team, members: [...(team.members || []), member.id] }
                            : team
                    )
                );
            }
        }catch(err){
            console.error('Failed to assign team to member:', err);
            alert(err.response?.data?.message || "Failed to update team assignment");
        }finally{
            setIsLoading(false);
        }
    };

    const handleDeleteTeam = (teamId) =>
    {
        const teamToDelete = localTeams.find(t => t.id === teamId);
        if(teamToDelete)
            setTeamToDelete(teamToDelete);
    };

    const handleNameChange = (e) =>
    {
        setEditingTeamName(e.target.value);
    };

    const handleCancelEdit = () =>
    {
        setEditingTeamId(null);
        setEditingTeamName("");
        setEditingTeamIcon("");
    };

    const handleAddTeam = async () =>
    {
        if(!newTeamName.trim())
            return;

        try{
            setIsLoading(true);
            const token = await getToken();
            const response = await axios.post(
                `http://localhost:8080/api/projects/${projectId}/teams`,
                {
                    teamName: newTeamName.trim(),
                    iconName: newTeamIcon
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newTeam =
            {
                id: response.data.teamId,
                name: response.data.teamName,
                icon: response.data.iconName,
                members: []
            };

            setLocalTeams(prev => [...prev, newTeam]);
            setNewTeamName("");
            setNewTeamIcon("Users");
            setIsAddingTeam(false);
        }catch(err){
            console.error('Error creating team:', err);
        }finally{
            setIsLoading(false);
        }
    };

    const confirmDeleteTeam = async (team) =>
    {
        if(!onDeleteTeam || !team?.id)
        return;

        try{
            setIsLoading(true);
            await onDeleteTeam(team.id);

            setLocalTeams(prev => prev.filter(t => t.id !== team.id));
            setLocalMemberTeams(prev => prev.filter(id => id !== team.id));
        }catch(err){
            console.error('Failed to delete team:', err);
        }finally{
            setTeamToDelete(null);
            setEditingTeamId(null);
            setIsLoading(false);
        }
    };

    const handleModalClose = () =>
    {
        setEditingTeamId(null);
        setIsAddingTeam(false);
        setTeamToDelete(null);
        onClose();
    };

    if(!member)
        return null;

    return(
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleModalClose}
                    style={{ zIndex: 10000 }}/>
                <motion.div
                    key="modal"
                    className="fixed inset-0 flex items-center justify-center"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    style={{ zIndex: 10001 }}>
                    <div className="bg-[var(--bg-color)] rounded-lg w-96 flex flex-col shadow-xl overflow-hidden max-h-[85vh]">
                        <ModalHeader member={member}/>

                        <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                            {localTeams.length === 0 && !isAddingTeam && (
                                <div className="py-8 text-center text-gray-500 italic">
                                    {t("adset.no_teams")}
                                </div>
                            )}

                            {localTeams.map((team) => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    isEditing={editingTeamId === team.id}
                                    editingTeamName={editingTeamName}
                                    editingTeamIcon={editingTeamIcon}
                                    localMemberTeams={localMemberTeams}
                                    onEdit={handleEditTeam}
                                    onSave={handleSaveTeam}
                                    onDelete={handleDeleteTeam}
                                    onToggleTeam={handleToggleTeam}
                                    onNameChange={handleNameChange}
                                    onIconChange={setEditingTeamIcon}
                                    onCancelEdit={handleCancelEdit}
                                    inputRef={editingTeamId === team.id ? editInputRef : null}
                                />
                            ))}

                            {isAddingTeam && (
                                <NewTeamForm
                                    newTeamName={newTeamName}
                                    newTeamIcon={newTeamIcon}
                                    onNameChange={setNewTeamName}
                                    onIconChange={setNewTeamIcon}
                                    onAddTeam={handleAddTeam}
                                    onCancel={() => setIsAddingTeam(false)}
                                />
                            )}
                        </div>

                        <div className="p-4 flex justify-between border-t">
                            <button
                                onClick={() => {
                                    setIsAddingTeam(true);
                                    setEditingTeamId(null);
                                }}
                                disabled={isAddingTeam || isLoading}
                                className={`flex items-center justify-center gap-1 px-4 py-2 rounded transition-all duration-200 ${isAddingTeam || isLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[var(--features-icon-color)] !text-white hover:bg-[var(--hover-color)]"
                                    }`}
                            >
                                <Plus size={18} />
                                {t("adset.add")}
                            </button>
                            <button
                                onClick={handleModalClose}
                                className="flex items-center justify-center gap-1 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-all duration-200 font-medium"
                            >
                                {t("adset.done")}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <TeamDeleteConfirmation
                teamName={teamToDelete?.name}
                onConfirm={() => confirmDeleteTeam(teamToDelete)}
                onCancel={() => setTeamToDelete(null)}
            />
        </>
    );
};
export default ManageTeamsModal;