import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Send, Search, ArrowLeft, Users, Hash, MessageSquare,
    PlusCircle, X, MessageCircle, Settings, Layout, Activity, KanbanSquare, UsersIcon, BookOpen,
    Smile, Paperclip, MoreHorizontal, Edit, Trash2, Reply, ThumbsUp, Heart, Laugh, Frown,
    Repeat, BarChart2, AtSign, Mic, PauseCircle, Code, CheckCircle, Clock, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { SearchProvider } from '../scripts/SearchContext';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { ALL_ICONS } from "../components/ICON_CATEGORIES";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ProjectChatWrapper = () =>
{
    return(
        <SearchProvider>
            <TempChatPage />
        </SearchProvider>
    );
};

const TempChatPage = () =>
{
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken, userId } = useAuth();
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [channelSearchTerm, setChannelSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState("chat");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [channels, setChannels] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [users, setUsers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMessageActions, setShowMessageActions] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [showCodeFormatting, setShowCodeFormatting] = useState(false);
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [showMentionMenu, setShowMentionMenu] = useState(false);
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messageActionsRef = useRef(null);

    const commonEmojis = ['👍', '❤️', '😂', '😊', '🎉', '👏', '🙌', '🔥', '✨', '🚀'];
    const emojiCategories =
    {
        'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉'],
        'Reactions': ['👍', '👎', '❤️', '🔥', '🎉', '👏', '🙌', '💯', '✅', '❌'],
        'Objects': ['💻', '📱', '📄', '📌', '⚙️', '🔧', '📦', '📚', '🔍', '🔑']
    };

    const reactionTypes =
    [
        { emoji: '👍', name: 'thumbs_up', icon: ThumbsUp },
        { emoji: '❤️', name: 'heart', icon: Heart },
        { emoji: '😂', name: 'laugh', icon: Laugh },
        { emoji: '😔', name: 'sad', icon: Frown }
    ];

    useEffect(() =>
    {
        const fetchProjectData = async () =>
        {
            try{
                const token = await getToken();
                const projectResponse = await axios.get(`http://localhost:8080/api/projects/${id}`, {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setProjectName(projectResponse.data.projectName);

                const ownerResponse = await axios.get(`http://localhost:8080/api/projects/${id}/isOwner`, {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                        'userId': userId
                    }
                });
                setIsOwner(ownerResponse.data);
            }catch(err){
                console.error('Error fetching project data:', err);
                setError('Failed to load project data');
            }
        };

        if (id && userId) {
            fetchProjectData();
        }
    }, [id, userId, getToken]);

    const fetchChannels = async () =>
    {
        try{
            setLoading(true);
            const token = await getToken();

            const response = await axios.get(
                `http://localhost:8080/api/messages/channels/project/${id}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const teamsResponse = await axios.get(
                `http://localhost:8080/api/projects/${id}/teams`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const teamMap = {};
            teamsResponse.data.forEach(team =>
            {
                teamMap[team.teamId] =
                {
                    teamName: team.teamName,
                    iconName: team.iconName
                };
            });

            const channelsWithUnread = await Promise.all(response.data.map(async (channel) =>
            {
                try{
                    const accessResponse = await axios.get(
                        `http://localhost:8080/api/messages/channel/${channel.channelId}/access/${userId}`,
                        {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }
                    );

                    if(!accessResponse.data)
                        return null;

                    const unreadResponse = await axios.get(
                        `http://localhost:8080/api/messages/channel/${channel.channelId}/unread/${userId}`,
                        {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }
                    );

                    let teamData = null;
                    if(channel.channelType === 'TEAM' && channel.teamId && teamMap[channel.teamId])
                        teamData = teamMap[channel.teamId];

                    return{
                        ...channel,
                        unreadCount: unreadResponse.data,
                        teamData: teamData
                    };
                }catch(err){
                    console.error(`Error processing channel ${channel.channelId}:`, err);
                    return null;
                }
            }));

            const accessibleChannels = channelsWithUnread.filter(channel => channel !== null);

            setChannels(accessibleChannels);
            setLoading(false);
        }catch(err){
            console.error('Error fetching channels:', err);
            setError('Failed to load channels');
            setLoading(false);
        }
    };

    useEffect(() =>
    {
        const fetchUsers = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(
                    `http://localhost:8080/api/projects/${id}/members`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                const formattedUsers = response.data.map(user => ({
                    id: user.userId,
                    name: user.username,
                    avatar: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0D8ABC&color=fff`
                }));

                setUsers(formattedUsers);
            }catch(err){
                console.error('Error fetching users:', err);
            }
        };

        if(id)
            fetchUsers();
    },[id, getToken]);

    const fetchMessages = async (channelId) =>
    {
        try{
            setLoading(true);
            const token = await getToken();

            const accessResponse = await axios.get(
                `http://localhost:8080/api/messages/channel/${channelId}/access/${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if(!accessResponse.data)
            {
                setError("You don't have access to this channel");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/messages/channel/${channelId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const enhancedMessages = response.data.map((msg, index) =>
            {
                const reactions = index % 3 === 0 ?
                {
                    '👍': Math.floor(Math.random() * 5) + 1,
                    '❤️': Math.floor(Math.random() * 3)
                } : {};

                const isEdited = msg.edited;

                const hasAttachment = index % 7 === 0;
                let attachment = null;
                if(hasAttachment)
                {
                    const attachmentTypes = ['image', 'document', 'code'];
                    const type = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)];
                    attachment =
                    {
                        type,
                        name: type === 'image' ? 'screenshot.png' :
                            type === 'document' ? 'report.pdf' : 'example.js',
                        size: '120KB'
                    };
                }

                const hasCodeSnippet = index % 11 === 0;
                let codeSnippet = null;
                if(hasCodeSnippet)
                {
                    codeSnippet =
                    {
                        language: 'javascript',
                        code: 'function sayHello() {\n  console.log("Hello, world!");\n}'
                    };
                }

                const hasPoll = index % 13 === 0;
                let poll = null;
                if(hasPoll)
                {
                    poll =
                    {
                        question: 'What feature should we implement next?',
                        options:
                        [
                            { text: 'Dark mode', votes: 5 },
                            { text: 'Mobile app', votes: 3 },
                            { text: 'Voice chat', votes: 2 }
                        ],
                        totalVotes: 10
                    };
                }

                return{
                    ...msg,
                    reactions,
                    isEdited,
                    attachment,
                    codeSnippet,
                    poll,
                    mentions: index % 9 === 0 ? [users[0]?.id] : []
                };
            });

            setMessages(enhancedMessages);

            try{
                await axios.post(
                    `http://localhost:8080/api/messages/channel/${channelId}/read`,
                    JSON.stringify(userId),
                    {
                        headers:
                        {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setChannels(prev =>
                    prev.map(channel =>
                        channel.channelId === channelId
                            ? { ...channel, unreadCount: 0 }
                            : channel
                    )
                );
            }catch(markReadErr){
                console.warn("Could not mark channel as read:", markReadErr);
            }

            setLoading(false);
            scrollToBottom();
        }catch(err){
            console.error('Error fetching messages:', err);
            setError('Failed to load messages');
            setLoading(false);
        }
    };

    useEffect(() =>
    {
        if(!userId || !id || !selectedChannel)
            return;

        const connectWebSocket = () =>
        {
            try{
                const socket = new SockJS('http://localhost:8080/ws');
                const client = new Client({
                    webSocketFactory: () => socket,
                    debug: function (str) {
                        console.log('STOMP: ' + str);
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000
                });

                client.onConnect = function (frame)
                {
                    setConnected(true);
                    console.log('Connected to WebSocket');

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}`, function (message)
                    {
                        const receivedMessage = JSON.parse(message.body);
                        setMessages(prevMessages => [...prevMessages, receivedMessage]);
                        scrollToBottom();
                        updateUnreadCount(receivedMessage);
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/edit`, function (message)
                    {
                        const editedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === editedMessage.id
                                    ? {
                                        ...msg,
                                        content: editedMessage.content,
                                        isEdited: true,
                                        editedAt: editedMessage.editedAt || new Date().toISOString(),
                                    }
                                    : msg
                            )
                        );
                    });

                    client.subscribe(`/topic/project/${id}/channels`, function (message)
                    {
                        fetchChannels();
                    });
                };

                client.onStompError = function (frame)
                {
                    console.error('STOMP error', frame);
                    setConnected(false);
                };

                client.onDisconnect = function ()
                {
                    setConnected(false);
                };

                client.activate();
                setStompClient(client);

                return () =>
                {
                    if(client && client.connected)
                    {
                        client.deactivate();
                        setConnected(false);
                    }
                };
            }catch(error){
                console.error('WebSocket connection error:', error);
            }
        };

        connectWebSocket();
    },[userId, id, selectedChannel?.channelId]);

    const updateUnreadCount = (message) => {
        if (message.senderId === userId ||
            (selectedChannel && message.channelId === selectedChannel.channelId)) {
            return;
        }

        setChannels(prev =>
            prev.map(channel =>
                channel.channelId === message.channelId
                    ? { ...channel, unreadCount: (channel.unreadCount || 0) + 1 }
                    : channel
            )
        );
    };

    useEffect(() =>
    {
        if(selectedChannel)
            fetchMessages(selectedChannel.channelId);
    },[selectedChannel]);

    useEffect(() =>
    {
        if(id && userId)
            fetchChannels();
    },[id, userId]);

    const scrollToBottom = () =>
    {
        if(!messagesEndRef.current)
            return;

        const messageContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if(messageContainer)
            messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!message.trim() && !selectedFile && !showCodeFormatting && !showPollCreator && !isRecordingAudio)
            return;
        if(!selectedChannel)
            return;

        try{
            let content = message;

            if(showCodeFormatting)
                content = `\`\`\`${codeLanguage}\n${message}\n\`\`\``;

            const newMessage =
            {
                senderId: userId,
                content: content,
                projectId: parseInt(id),
                channelId: selectedChannel.channelId,
                senderName: users.find(u => u.id === userId)?.name || 'Unknown User',
                timestamp: new Date().toISOString(),
                attachment: selectedFile ? {
                    name: selectedFile.name,
                    size: `${Math.round(selectedFile.size / 1024)}KB`,
                    type: selectedFile.type.includes('image') ? 'image' : 'document'
                } : null
            };

            if(stompClient && connected)
            {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/send`,
                    body: JSON.stringify(newMessage)
                });
            }
            else
            {
                const token = await getToken();
                await axios.post(
                    `http://localhost:8080/api/messages/channel/${selectedChannel.channelId}`,
                    newMessage,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                fetchMessages(selectedChannel.channelId);
            }

            setMessage('');
            setSelectedFile(null);
            setShowCodeFormatting(false);
            setShowPollCreator(false);
            setPollQuestion('');
            setPollOptions(['', '']);
        }catch(err){
            console.error('Error sending message:', err);
            alert('Failed to send message. Please try again.');
        }
    };

    useEffect(() =>
    {
        if(selectedChannel)
        {
            fetchMessages(selectedChannel.channelId);
            if(stompClient && stompClient.connected)
            {
                stompClient.deactivate();
                setConnected(false);
            }
        }
    }, [selectedChannel?.channelId]);

    const formatMessageTime = (timestamp) =>
    {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    const handleFileSelect = () =>
    {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) =>
    {
        if(e.target.files[0])
            setSelectedFile(e.target.files[0]);
    };

    const handleEmojiClick = (emoji) =>
    {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleReactionClick = (messageId, reaction) =>
    {
        setMessages(prev =>
            prev.map(msg =>
            {
                if(msg.id === messageId)
                {
                    const updatedReactions = { ...msg.reactions };
                    if(updatedReactions[reaction])
                        updatedReactions[reaction] += 1;
                    else
                        updatedReactions[reaction] = 1;
                    return { ...msg, reactions: updatedReactions };
                }
                return msg;
            })
        );

        setShowMessageActions(null);
    };

    const handleEditMessage = (message) =>
    {
        setEditingMessage(message);
        setEditedContent(message.content);
        setShowMessageActions(null);
    };

    const saveEditedMessage = async () =>
    {
        if(!editingMessage || !editedContent.trim())
            return;

        try{
            const editedMessageData =
            {
                id: editingMessage.id,
                senderId: userId,
                content: editedContent,
                channelId: selectedChannel.channelId,
                isEdited: true,
                editedAt: new Date().toISOString(),
            };

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === editingMessage.id
                        ? { ...msg, content: editedContent, isEdited: true, editedAt: editedMessageData.editedAt }
                        : msg
                )
            );

            if(stompClient && connected)
            {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/edit`,
                    body: JSON.stringify(editedMessageData),
                });
            }
            else
            {
                const token = await getToken();
                await axios.put(
                    `http://localhost:8080/api/messages/${editingMessage.id}`,
                    {
                        senderId: userId,
                        content: editedContent,
                        channelId: selectedChannel.channelId,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            setEditingMessage(null);
            setEditedContent('');
        }catch(err){
            console.error('Error editing message:', err);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === editingMessage.id ? { ...msg, content: editingMessage.content, isEdited: editingMessage.isEdited } : msg
                )
            );
            alert('Failed to edit message. Please try again.');
        }
    };

    const handleDeleteMessage = (messageId) =>
    {
        console.log(`Deleted message ${messageId}`);

        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setShowMessageActions(null);
    };

    const handleMention = (userId) =>
    {
        const user = users.find(u => u.id === userId);
        if(user)
            setMessage(prev => `${prev}@${user.name} `);
        setShowMentionMenu(false);
    };

    const handleCreatePoll = () => {
        if(!pollQuestion.trim() || pollOptions.some(option => !option.trim()))
        {
            alert("Please fill in all poll fields");
            return;
        }

        console.log("Creating poll:", { question: pollQuestion, options: pollOptions });

        const pollMessage =
        {
            id: Date.now().toString(),
            senderId: userId,
            senderName: users.find(u => u.id === userId)?.name || 'Unknown User',
            content: "📊 " + pollQuestion,
            projectId: parseInt(id),
            channelId: selectedChannel.channelId,
            timestamp: new Date().toISOString(),
            poll:
            {
                question: pollQuestion,
                options: pollOptions.map(option => ({ text: option, votes: 0 })),
                totalVotes: 0
            }
        };

        setMessages(prev => [...prev, pollMessage]);
        setPollQuestion('');
        setPollOptions(['', '']);
        setShowPollCreator(false);
        scrollToBottom();
    };

    const addPollOption = () =>
    {
        setPollOptions(prev => [...prev, '']);
    };

    const updatePollOption = (index, value) =>
    {
        setPollOptions(prev =>
        {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const removePollOption = (index) =>
    {
        if(pollOptions.length <= 2)
            return; //need at least 2 options for it to be a vote
        setPollOptions(prev => prev.filter((_, i) => i !== index));
    };

    const toggleRecordingAudio = () =>
    {
        setIsRecordingAudio(prev => !prev);
    };

    const toggleCodeFormatting = () =>
    {
        setShowCodeFormatting(prev => !prev);
    };

    useEffect(() =>
    {
        const handleClickOutside = (event) =>
        {
            if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target))
                setShowEmojiPicker(false);

            if(messageActionsRef.current && !messageActionsRef.current.contains(event.target))
                setShowMessageActions(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    const filteredMessages = searchTerm
        ? messages.filter(msg =>
            msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : messages;

    const filteredChannels = channelSearchTerm
        ? channels.filter(channel =>
            channel.channelName.toLowerCase().includes(channelSearchTerm.toLowerCase())
        )
        : channels;

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
            path: `/project/${id}`,
            state: { isOwner },
            color: 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]',
            iconColor: 'text-[var(--sidebar-projects-color)]'
        },
        {
            id: 'activity',
            icon: Activity,
            label: t("sidebar.act"),
            path: `/project/${id}/activity`,
            state: { isOwner },
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600'
        },
        {
            id: 'teams',
            icon: UsersIcon,
            label: t("sidebar.team"),
            path: `/project/${id}/teams`,
            state: { isOwner },
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        {
            id: 'chat',
            icon: MessageCircle,
            label: t("sidebar.chat"),
            path: `/project/${id}/chat`,
            color: 'bg-indigo-100 text-indigo-600',
            iconColor: 'text-indigo-600'
        },
        {
            id: 'notes',
            icon: BookOpen,
            label: t("notes.title"),
            path: `/project/${id}/notes`,
            state: { isOwner },
            color: 'bg-teal-100 text-teal-600',
            iconColor: 'text-teal-600'
        },
        {
            id: 'settings',
            icon: Settings,
            label: t("sidebar.set"),
            path: `/project/${id}/settings`,
            state: { isOwner },
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600'
        }
    ];

    const findUserForMessage = (userId) =>
    {
        return users.find(u => u.id === userId) ||
        {
            name: 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=Unknown+User&background=888888&color=fff`
        };
    };

    const projectChannels = filteredChannels
        .filter(channel => channel.channelType === 'PROJECT');

    const teamChannels = filteredChannels
        .filter(channel => channel.channelType === 'TEAM');

    const CodeSnippet = ({ language, code }) => (
        <div className="bg-gray-800 rounded-md overflow-hidden my-2">
            <div className="px-4 py-2 bg-gray-900 text-gray-400 flex justify-between items-center">
                <span className="text-xs font-mono">{language}</span>
                <button className="text-xs text-blue-400 hover:text-blue-300">Copy</button>
            </div>
            <pre className="p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );

    const PollComponent = ({ poll }) => (
        <div className="bg-[var(--gray-card3)]/30 rounded-lg p-3 my-2">
            <div className="font-medium mb-2 text-[var(--features-title-color)]">{poll.question}</div>
            <div className="space-y-2">
                {poll.options.map((option, index) => {
                    const percentage = poll.totalVotes > 0
                        ? Math.round((option.votes / poll.totalVotes) * 100)
                        : 0;

                    return (
                        <div key={index} className="relative">
                            <div className="flex justify-between mb-1 text-sm">
                                <span>{option.text}</span>
                                <span>{option.votes} votes ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                    className="bg-[var(--features-icon-color)] h-2.5 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 text-xs text-[var(--features-text-color)]">
                Total votes: {poll.totalVotes} • Poll created by {poll.creator || 'Unknown'}
            </div>
        </div>
    );

    const FileAttachment = ({ attachment }) => (
        <div className="flex items-center gap-2 p-2 mt-2 bg-[var(--gray-card3)]/30 rounded-lg">
            {attachment.type === 'image' ? (
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <img src="/api/placeholder/40/40" alt="Preview" className="w-6 h-6 object-cover" />
                </div>
            ) : attachment.type === 'document' ? (
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <Paperclip size={16} className="text-red-500" />
                </div>
            ) : (
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <Code size={16} className="text-purple-500" />
                </div>
            )}
            <div className="flex-1">
                <div className="text-sm font-medium text-[var(--features-title-color)]">{attachment.name}</div>
                <div className="text-xs text-[var(--features-text-color)] opacity-70">{attachment.size}</div>
            </div>
            <button className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]">
                <PlusCircle size={16} />
            </button>
        </div>
    );
    return (
        <div className="flex flex-col h-screen bg-[var(--bg-color)]">
            <Header
                title={
                    <div className="flex items-center">
                        <span
                            className="cursor-pointer mr-2"
                            onClick={() => navigate(`/project/${id || 1}`)}
                        >
                            <ArrowLeft size={20} className="text-[var(--features-icon-color)]" />
                        </span>
                        <span className="text-xl font-semibold text-[var(--sidebar-projects-color)]">
                            Chat: {projectName}
                        </span>
                    </div>
                }
            />

            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-[var(--sidebar-projects-bg-color)]">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        customNavItems={customNavItems}
                        onCollapseChange={setIsSidebarCollapsed}/>
                </div>
                <div className="flex-1 flex bg-[var(--projects-bg)] overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-[var(--sidebar-projects-bg-color)] bg-[var(--bg-color)] flex items-center justify-between">
                            <div className="flex items-center">
                                {selectedChannel?.channelType === 'PROJECT' ? (
                                    <Hash size={18} className="mr-2 text-[var(--features-icon-color)]" />
                                ) : (
                                    (() =>
                                    {
                                        let TeamIcon = Users;
                                        if (selectedChannel?.teamData && selectedChannel.teamData.iconName)
                                        {
                                            const IconComponent = ALL_ICONS[selectedChannel.teamData.iconName] ||
                                                ALL_ICONS[`Fa${selectedChannel.teamData.iconName}`] ||
                                                ALL_ICONS[`Md${selectedChannel.teamData.iconName}`];

                                            if(IconComponent)
                                                TeamIcon = IconComponent;
                                        }

                                        return <TeamIcon size={18} className="mr-2 text-[var(--features-icon-color)]" />;
                                    })()
                                )}
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--features-text-color)]">
                                        {selectedChannel?.channelName || 'Select a channel'}
                                    </h2>
                                    {selectedChannel?.channelType === 'TEAM' && (
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70">
                                            Team Channel • {selectedChannel.teamData?.teamName || 'Team'} • Members only
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {selectedChannel && (
                                    <>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search messages..."
                                                className="py-1 px-3 text-sm border border-[var(--gray-card3)] rounded-lg bg-[var(--bg-color)] text-[var(--features-text-color)] w-40 focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"
                                            />
                                            <Search size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--features-text-color)] opacity-50" />
                                        </div>

                                        <button className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]">
                                            <Users size={18} />
                                        </button>

                                        <button className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Messages container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading && !messages.length ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-[var(--features-text-color)] text-center">
                                        Loading messages...
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-full flex-col">
                                    <div className="text-red-500 text-center">
                                        {error}
                                    </div>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full flex-col">
                                    <MessageSquare size={48} className="text-[var(--gray-card3)] mb-4" />
                                    <p className="text-[var(--features-text-color)] text-center">
                                        {selectedChannel ? "No messages yet. Start the conversation!" : "Select a channel to start chatting"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {filteredMessages.map((msg) => {
                                        const user = findUserForMessage(msg.senderId);
                                        const isCurrentUser = msg.senderId === userId;
                                        return(
                                            <div
                                                key={msg.id}
                                                onMouseEnter={() => setShowMessageActions(msg.id)}
                                                onMouseLeave={() => setShowMessageActions(null)}
                                                className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} relative`}>
                                                {!isCurrentUser && (
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                                                        {user?.avatar ? (
                                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover"/>
                                                        ) : (
                                                            <div className="w-full h-full bg-[var(--sidebar-projects-bg-color)] flex items-center justify-center text-[var(--sidebar-projects-color)]">
                                                                {user?.name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex flex-col max-w-[75%]">
                                                    <div
                                                        className={`rounded-lg px-4 py-3 ${isCurrentUser
                                                                ? 'bg-[var(--features-icon-color)] text-white rounded-br-none'
                                                                : 'bg-[var(--gray-card3)] text-[var(--features-title-color)] rounded-bl-none'
                                                            }`}>
                                                        {!isCurrentUser && (
                                                            <div className="font-medium text-xs mb-1 text-[var(--features-icon-color)]">
                                                                {msg.senderName || user?.name || 'Unknown User'}
                                                            </div>
                                                        )}
                                                        {editingMessage?.id === msg.id ? (
                                                            <div className="text-[var(--features-text-color)] bg-[var(--bg-color)] -mx-4 -my-3 p-3 rounded-lg">
                                                                <textarea
                                                                    value={editedContent}
                                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                                    className="w-full p-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"
                                                                    rows={3}/>
                                                                <div className="flex justify-end mt-2">
                                                                    <button
                                                                        onClick={() => setEditingMessage(null)}
                                                                        className="text-xs mr-2 py-1 px-3 bg-[var(--gray-card3)] text-[var(--features-text-color)] rounded-md hover:bg-[var(--gray-card3)]/80">
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={saveEditedMessage}
                                                                        className="text-xs py-1 px-3 bg-[var(--features-icon-color)] text-white rounded-md hover:bg-[var(--hover-color)]">
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                                {msg.codeSnippet && (
                                                                    <CodeSnippet
                                                                        language={msg.codeSnippet.language}
                                                                        code={msg.codeSnippet.code}/>
                                                                )}
                                                                {msg.attachment && (
                                                                    <FileAttachment attachment={msg.attachment}/>
                                                                )}
                                                                {msg.poll && (
                                                                    <PollComponent poll={msg.poll}/>
                                                                )}
                                                                <div className={`text-[0.65rem] mt-1 flex items-center gap-1 ${isCurrentUser ? 'text-white/70' : 'text-[var(--features-text-color)]'}`}>
                                                                    {formatMessageTime(msg.timestamp)}
                                                                    {msg.isEdited && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span className="italic">edited</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    {Object.keys(msg.reactions || {}).length > 0 && (
                                                        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                                                                count > 0 && (
                                                                    <div
                                                                        key={emoji}
                                                                        className="bg-[var(--gray-card3)]/50 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer hover:bg-[var(--gray-card3)]"
                                                                        onClick={() => handleReactionClick(msg.id, emoji)}
                                                                    >
                                                                        <span>{emoji}</span>
                                                                        <span className="text-[var(--features-text-color)]">{count}</span>
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}

                                                    {showMessageActions === msg.id && (
                                                        <motion.div
                                                            ref={messageActionsRef}
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className={`absolute ${isCurrentUser ? 'right-12' : 'left-12'
                                                                } top-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-1 flex items-center gap-1 z-10 border border-[var(--gray-card3)]`}
                                                        >
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setShowEmojiPicker(msg.id)}
                                                                    className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                                                    title="Add reaction"
                                                                >
                                                                    <Smile size={16} />
                                                                </button>
                                                                {showEmojiPicker === msg.id && (
                                                                    <div
                                                                        ref={emojiPickerRef}
                                                                        className="absolute bottom-full mb-2 right-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-2 w-64 z-20 border border-[var(--gray-card3)]"
                                                                    >
                                                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                                                            Common reactions
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            {commonEmojis.map((emoji) => (
                                                                                <button
                                                                                    key={emoji}
                                                                                    onClick={() => handleReactionClick(msg.id, emoji)}
                                                                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                                                                >
                                                                                    {emoji}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                        <div className="border-t border-[var(--gray-card3)] pt-2">
                                                                            <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                                                                Categories
                                                                            </div>
                                                                            {Object.entries(emojiCategories).map(([category, emojis]) => (
                                                                                <div key={category} className="mb-2">
                                                                                    <div className="text-xs text-[var(--features-text-color)] mb-1">{category}</div>
                                                                                    <div className="flex flex-wrap gap-1">
                                                                                        {emojis.map((emoji) => (
                                                                                            <button
                                                                                                key={emoji}
                                                                                                onClick={() => handleReactionClick(msg.id, emoji)}
                                                                                                className="w-6 h-6 flex items-center justify-center text-sm hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                                                                            >
                                                                                                {emoji}
                                                                                            </button>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                                                title="Reply"
                                                            >
                                                                <Reply size={16} />
                                                            </button>
                                                            {isCurrentUser && (
                                                                <button
                                                                    onClick={() => handleEditMessage(msg)}
                                                                    className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                                                    title="Edit"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                            )}
                                                            {(isCurrentUser || isOwner) && (
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                                    className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {isCurrentUser && (
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ml-2">
                                                        {user?.avatar ? (
                                                            <img src={user.avatar} alt="Your profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-[var(--sidebar-projects-bg-color)] flex items-center justify-center text-[var(--sidebar-projects-color)]">
                                                                {user?.name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-[var(--gray-card3)] bg-[var(--bg-color)]">
                            {showPollCreator && (
                                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium text-[var(--features-text-color)]">
                                            Create Poll
                                        </h3>
                                        <button
                                            onClick={() => setShowPollCreator(false)}
                                            className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={pollQuestion}
                                        onChange={(e) => setPollQuestion(e.target.value)}
                                        placeholder="Poll question"
                                        className="w-full p-2 mb-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"
                                    />

                                    <div className="space-y-2 mb-3">
                                        {pollOptions.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updatePollOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="flex-1 p-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"
                                                />

                                                {pollOptions.length > 2 && (
                                                    <button
                                                        onClick={() => removePollOption(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            onClick={addPollOption}
                                            className="text-sm text-[var(--features-icon-color)] hover:text-[var(--hover-color)] flex items-center gap-1"
                                        >
                                            <PlusCircle size={16} />
                                            Add Option
                                        </button>

                                        <button
                                            onClick={handleCreatePoll}
                                            className="text-sm bg-[var(--features-icon-color)] text-white px-3 py-1 rounded-md hover:bg-[var(--hover-color)]"
                                        >
                                            Create Poll
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showCodeFormatting && (
                                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium text-[var(--features-text-color)]">
                                            Code Formatting
                                        </h3>
                                        <button
                                            onClick={() => setShowCodeFormatting(false)}
                                            className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <span className="text-sm mr-2 text-[var(--features-text-color)]">Language:</span>
                                        <select
                                            value={codeLanguage}
                                            onChange={(e) => setCodeLanguage(e.target.value)}
                                            className="text-sm p-1 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)]"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                            <option value="sql">SQL</option>
                                            <option value="typescript">TypeScript</option>
                                            <option value="csharp">C#</option>
                                            <option value="php">PHP</option>
                                            <option value="go">Go</option>
                                        </select>
                                    </div>

                                    <div className="text-xs text-[var(--features-text-color)] opacity-70">
                                        Add code below and it will be formatted as a code block
                                    </div>
                                </div>
                            )}

                            {isRecordingAudio && (
                                <div className="mb-4 p-3 bg-red-100 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-red-700">Recording audio...</span>
                                        <span className="text-xs text-red-500">0:12</span>
                                    </div>
                                    <button
                                        onClick={toggleRecordingAudio}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <PauseCircle size={20} />
                                    </button>
                                </div>
                            )}

                            {selectedFile && (
                                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {selectedFile.type.includes('image') ? (
                                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                <img src="/api/placeholder/40/40" alt="Preview" className="w-6 h-6 object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                <Paperclip size={16} className="text-blue-500" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-[var(--features-text-color)]">
                                                {selectedFile.name}
                                            </div>
                                            <div className="text-xs text-[var(--features-text-color)] opacity-70">
                                                {Math.round(selectedFile.size / 1024)}KB
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={
                                        showCodeFormatting ? "Type or paste code here..." :
                                            "Type a message..."
                                    }
                                    className="w-full p-3 rounded-lg border border-[var(--gray-card3)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] bg-[var(--bg-color)] text-[var(--features-text-color)] min-h-[100px] resize-y"
                                    disabled={!selectedChannel}/>

                                {showMentionMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 bg-[var(--bg-color)] rounded-lg shadow-lg p-2 w-64 z-10">
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                            Mention a user
                                        </div>
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                            {users.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => handleMention(user.id)}
                                                    className="flex items-center gap-2 p-2 hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded-md cursor-pointer"
                                                >
                                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-[var(--sidebar-projects-bg-color)] flex items-center justify-center text-xs text-[var(--sidebar-projects-color)]">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-[var(--features-text-color)]">{user.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker('input')}
                                            className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                            disabled={!selectedChannel}>
                                            <Smile size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleFileSelect}
                                            className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                            disabled={!selectedChannel}>
                                            <Paperclip size={20}/>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}/>
                                        <button
                                            type="button"
                                            onClick={toggleCodeFormatting}
                                            className={`p-1 rounded-md ${showCodeFormatting
                                                    ? 'bg-[var(--features-icon-color)]/20 text-[var(--features-icon-color)]'
                                                    : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                                                }`}
                                            disabled={!selectedChannel}>
                                            <Code size={20}/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={toggleRecordingAudio}
                                            className={`p-1 rounded-md ${isRecordingAudio
                                                    ? 'bg-red-100 text-red-500'
                                                    : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                                                }`}
                                            disabled={!selectedChannel}>
                                            <Mic size={20}/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowMentionMenu(prev => !prev)}
                                            className={`p-1 rounded-md ${showMentionMenu
                                                    ? 'bg-[var(--features-icon-color)]/20 text-[var(--features-icon-color)]'
                                                    : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                                                }`}
                                            disabled={!selectedChannel}>
                                            <AtSign size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPollCreator(prev => !prev)}
                                            className={`p-1 rounded-md ${showPollCreator
                                                    ? 'bg-[var(--features-icon-color)]/20 text-[var(--features-icon-color)]'
                                                    : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                                                }`}
                                            disabled={!selectedChannel}
                                        ><BarChart2 size={20}/>
                                        </button>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={
                                            !selectedChannel ||
                                            (!message.trim() && !selectedFile && !isRecordingAudio && !showPollCreator)
                                        }
                                        className={`p-3 rounded-lg ${(message.trim() || selectedFile || isRecordingAudio || showPollCreator) && selectedChannel
                                                ? 'bg-[var(--features-icon-color)] text-white hover:bg-[var(--hover-color)]'
                                                : 'bg-[var(--gray-card3)] text-[var(--text-color3)]'
                                            } transition-colors disabled:opacity-50`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}>
                                        <Send size={20}/>
                                    </motion.button>
                                </div>
                                {showEmojiPicker === 'input' && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute bottom-full mb-2 left-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-2 w-64 z-10">
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                            Common emojis
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {commonEmojis.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleEmojiClick(emoji)}
                                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded">
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t border-[var(--gray-card3)] pt-2">
                                            <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                                Categories
                                            </div>
                                            {Object.entries(emojiCategories).map(([category, emojis]) => (
                                                <div key={category} className="mb-2">
                                                    <div className="text-xs text-[var(--features-text-color)] mb-1">{category}</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {emojis.map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleEmojiClick(emoji)}
                                                                className="w-6 h-6 flex items-center justify-center text-sm hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="w-64 bg-[var(--bg-color)] border-l border-[var(--sidebar-projects-bg-color)] flex-shrink-0 flex flex-col">
                        <div className="p-4 border-b border-[var(--sidebar-projects-bg-color)]">
                            <h2 className="text-lg font-semibold text-[var(--features-text-color)] mb-3 flex items-center">
                                <MessageSquare size={18} className="mr-2 text-[var(--features-icon-color)]"/>
                                Channels
                            </h2>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-3 h-3 text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    className="bg-[var(--bg-color)] border border-[var(--gray-card3)] text-[var(--text-color3)] text-xs rounded-lg focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)] block w-full pl-8 p-2"
                                    placeholder="Search channels..."
                                    value={channelSearchTerm}
                                    onChange={(e) => setChannelSearchTerm(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="mb-4">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <h3 className="text-xs font-medium text-[var(--features-text-color)]">
                                        PROJECT
                                    </h3>
                                    {isOwner && (
                                        <button className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]">
                                            <PlusCircle size={14} />
                                        </button>
                                    )}
                                </div>
                                {projectChannels.map(channel => (
                                    <div
                                        key={channel.channelId}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${selectedChannel?.channelId === channel.channelId
                                                ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                                                : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                                            }`}>
                                        <Hash size={16} className="mr-2 flex-shrink-0" />
                                        <div className="flex-1 truncate">
                                            <div className="text-sm font-medium">{channel.channelName}</div>
                                            {channel.lastMessageContent && (
                                                <div className="text-xs opacity-70 truncate">
                                                    {channel.lastMessageSender}: {channel.lastMessageContent}
                                                </div>
                                            )}
                                        </div>
                                        {channel.unreadCount > 0 && (
                                            <div className="bg-[var(--features-icon-color)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                                {channel.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <h3 className="text-xs font-medium text-[var(--features-text-color)]">
                                        TEAM CHATS
                                    </h3>
                                </div>
                                {teamChannels.map(channel =>
                                {
                                    let TeamIcon = Users;

                                    if(channel.teamData && channel.teamData.iconName)
                                    {
                                        const IconComponent = ALL_ICONS[channel.teamData.iconName] ||
                                            ALL_ICONS[`Fa${channel.teamData.iconName}`] ||
                                            ALL_ICONS[`Md${channel.teamData.iconName}`];

                                        if(IconComponent)
                                            TeamIcon = IconComponent;
                                    }

                                    return(
                                        <div
                                            key={channel.channelId}
                                            onClick={() => setSelectedChannel(channel)}
                                            className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${selectedChannel?.channelId === channel.channelId
                                                    ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                                                    : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                                                }`}>
                                            <TeamIcon size={16} className="mr-2 flex-shrink-0" />
                                            <div className="flex-1 truncate">
                                                <div className="text-sm font-medium">{channel.channelName}</div>
                                                {channel.lastMessageContent && (
                                                    <div className="text-xs opacity-70 truncate">
                                                        {channel.lastMessageSender}: {channel.lastMessageContent}
                                                    </div>
                                                )}
                                            </div>
                                            {channel.unreadCount > 0 && (
                                                <div className="bg-[var(--features-icon-color)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                                    {channel.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectChatWrapper;