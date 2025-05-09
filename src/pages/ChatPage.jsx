import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Send, Search, ArrowLeft, Users, Hash, MessageSquare,
    PlusCircle, X, MessageCircle, Settings, Layout, Activity, KanbanSquare, UsersIcon, BookOpen,
    Smile, Paperclip, MoreHorizontal, Edit, Trash2, Reply, ThumbsUp, Heart, Laugh, Frown,
    Repeat, BarChart2, AtSign, Mic, PauseCircle, Code, CheckCircle, Clock, ChevronDown, Download, MicOff, PhoneCall, PhoneOff, Volume2, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { SearchProvider } from '../scripts/SearchContext';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { ALL_ICONS } from '../components/ICON_CATEGORIES';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Message from '../components/Message';
//import SimplePeer from 'simple-peer';
import { FaBars } from 'react-icons/fa';

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
    const [activeTab, setActiveTab] = useState('chat');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [channels, setChannels] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [users, setUsers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    
    const messagesEndRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState({ context: null, messageId: null });
    const [showMessageActions, setShowMessageActions] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const [showCodeFormatting, setShowCodeFormatting] = useState(false);
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messageActionsRef = useRef(null);
    const [filesToUpload, setFilesToUpload] = useState(null);


    const [voiceChannels, setVoiceChannels] = useState([]);
    const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
    const [isInVoiceChannel, setIsInVoiceChannel] = useState(false);
    const [peers, setPeers] = useState({});
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [voiceUsers, setVoiceUsers] = useState({});
    const audioRef = useRef(null);

    const { t } = useTranslation();

    const commonEmojis = ['👍', '❤️', '😂', '😊', '🎉', '👏', '🙌', '🔥', '✨', '🚀'];
    const emojiCategories = {
        [t("chat.smile")]: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉'],
        [t("chat.react")]: ['👍', '👎', '❤️', '🔥', '🎉', '👏', '🙌', '💯', '✅', '❌'],
        [t("chat.obj")]: ['💻', '📱', '📄', '📌', '⚙️', '🔧', '📦', '📚', '🔍', '🔑']
    };
    const reactionTypes = [
        { emoji: '👍', name: 'thumbs_up', icon: ThumbsUp },
        { emoji: '❤️', name: 'heart', icon: Heart },
        { emoji: '😂', name: 'laugh', icon: Laugh },
        { emoji: '😔', name: 'sad', icon: Frown },
        { emoji: '😊', name: 'smile', icon: Smile },
        { emoji: '🎉', name: 'party', icon: null },
        { emoji: '👏', name: 'clap', icon: null },
        { emoji: '🙌', name: 'hands', icon: null },
        { emoji: '🔥', name: 'fire', icon: null },
        { emoji: '✨', name: 'sparkles', icon: null },
        { emoji: '🚀', name: 'rocket', icon: null },
        { emoji: '😀', name: 'grinning', icon: null },
        { emoji: '😃', name: 'smiley', icon: null },
        { emoji: '😄', name: 'smile_open', icon: null },
        { emoji: '😁', name: 'beam', icon: null },
        { emoji: '😆', name: 'laughing', icon: null },
        { emoji: '😅', name: 'sweat_smile', icon: null },
        { emoji: '🤣', name: 'rofl', icon: null },
        { emoji: '🙂', name: 'slight_smile', icon: null },
        { emoji: '😉', name: 'wink', icon: null },
        { emoji: '👎', name: 'thumbs_down', icon: null },
        { emoji: '💯', name: 'hundred', icon: null },
        { emoji: '✅', name: 'check', icon: null },
        { emoji: '❌', name: 'cross', icon: null },
        { emoji: '💻', name: 'laptop', icon: null },
        { emoji: '📱', name: 'phone', icon: null },
        { emoji: '📄', name: 'document', icon: null },
        { emoji: '📌', name: 'pin', icon: null },
        { emoji: '⚙️', name: 'gear', icon: null },
        { emoji: '🔧', name: 'wrench', icon: null },
        { emoji: '📦', name: 'package', icon: null },
        { emoji: '📚', name: 'books', icon: null },
        { emoji: '🔍', name: 'search', icon: null },
        { emoji: '🔑', name: 'key', icon: null },
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
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjectName(projectResponse.data.projectName);

                const ownerResponse = await axios.get(`http://localhost:8080/api/projects/${id}/isOwner`, {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                        userId: userId,
                    },
                });
                setIsOwner(ownerResponse.data);
            }catch(err){
                console.error('Error fetching project data:', err);
                setError('Failed to load project data');
            }
        };

        if(id && userId)
            fetchProjectData();
    }, [id, userId, getToken]);

    const fetchChannels = async () =>
    {
        try{
            setLoading(true);
            const token = await getToken();

            const response = await axios.get(
                `http://localhost:8080/api/messages/channels/project/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const teamsResponse = await axios.get(`http://localhost:8080/api/projects/${id}/teams`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const teamMap = {};
            teamsResponse.data.forEach((team) =>
            {
                teamMap[team.teamId] =
                {
                    teamName: team.teamName,
                    iconName: team.iconName,
                };
            });

            const channelsWithUnread = await Promise.all(
                response.data.map(async (channel) =>
                {
                    try{
                        const accessResponse = await axios.get(
                            `http://localhost:8080/api/messages/channel/${channel.channelId}/access/${userId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );

                        if(!accessResponse.data)
                            return null;

                        const unreadResponse = await axios.get(
                            `http://localhost:8080/api/messages/channel/${channel.channelId}/unread/${userId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );

                        let teamData = null;
                        if(channel.channelType === 'TEAM' && channel.teamId && teamMap[channel.teamId])
                            teamData = teamMap[channel.teamId];

                        return{
                            ...channel,
                            unreadCount: unreadResponse.data,
                            teamData: teamData,
                        };
                    }catch(err){
                        console.error(`Error processing channel ${channel.channelId}:`, err);
                        return null;
                    }
                })
            );

            const accessibleChannels = channelsWithUnread.filter((channel) => channel !== null);

            setChannels(accessibleChannels);

            const generalChannel = accessibleChannels.find(
                (channel) => channel.channelName.toLowerCase() === 'general'
            );
            if(generalChannel && !selectedChannel)
                setSelectedChannel(generalChannel);

            setLoading(false);
        }catch(err){
            console.error('Error fetching channels:', err);
            setError('Failed to load channels');
            setLoading(false);
        }
    };
    /*
    useEffect(() =>
    {
        const fetchVoiceChannels = async () =>
        {
            try{
                setLoading(true);
                const token = await getToken();

                const response = await axios.get(
                    `http://localhost:8080/api/messages/channels/project/${id}?type=VOICE`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const mockVoiceChannels = channels
                    .filter(channel => channel.channelType === 'TEAM')
                    .map(channel => ({
                        channelId: `voice-${channel.channelId}`,
                        channelName: `${channel.channelName} (Voice)`,
                        channelType: 'VOICE',
                        teamId: channel.teamId,
                        teamData: channel.teamData,
                        participants: []
                    }));

                mockVoiceChannels.unshift({
                    channelId: `voice-project-${id}`,
                    channelName: `${projectName} (Voice)`,
                    channelType: 'VOICE',
                    participants: []
                });

                setVoiceChannels(mockVoiceChannels);
                setLoading(false);
            }catch(err){
                console.error('Error fetching voice channels:', err);
                setError('Failed to load voice channels');
                setLoading(false);
            }
        };

        if(id && userId && channels.length > 0)
            fetchVoiceChannels();
    }, [id, userId, channels, projectName]);
    */
    // Add a state to manage channel sidebar visibility on mobile
    const [showChannelSidebar, setShowChannelSidebar] = useState(false);
    
    // Function to toggle channels sidebar on mobile
    const toggleChannelSidebar = () => {
        setShowChannelSidebar(prev => !prev);
    };

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };
    /*
    const joinVoiceChannel = async (channel) =>
    {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

            setLocalStream(stream);
            setActiveVoiceChannel(channel);
            setIsInVoiceChannel(true);

            console.log('Joining voice channel:', channel.channelId);
            console.log('Local stream:', stream);
            console.log(users);

            if(stompClient && connected)
            {
                stompClient.publish({
                    destination: `/app/voice/${channel.channelId}/join`,
                    body: JSON.stringify({
                        userId,
                        username: users.find(u => u.id === userId)?.name || 'Unknown User',
                        channelId: channel.channelId
                    }),
                });
            }

            if(stompClient)
            {
                stompClient.subscribe(`/topic/voice/${channel.channelId}/signal`, handleVoiceSignal);
                stompClient.subscribe(`/topic/voice/${channel.channelId}/users`, handleVoiceUsers);
            }
        }catch(err){
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const leaveVoiceChannel = () =>
    {
        if(activeVoiceChannel && stompClient && connected)
        {
            stompClient.publish({
                destination: `/app/voice/${activeVoiceChannel.channelId}/leave`,
                body: JSON.stringify({
                    userId,
                    channelId: activeVoiceChannel.channelId
                }),
            });

            stompClient.unsubscribe(`/topic/voice/${activeVoiceChannel.channelId}/signal`);
            stompClient.unsubscribe(`/topic/voice/${activeVoiceChannel.channelId}/users`);
        }

        if(localStream)
            localStream.getTracks().forEach(track => track.stop());

        Object.values(peers).forEach(peer =>
        {
            if (peer) peer.destroy();
        });

        setPeers({});
        setLocalStream(null);
        setActiveVoiceChannel(null);
        setIsInVoiceChannel(false);
        setVoiceUsers({});
    };

    const handleVoiceSignal = (message) =>
    {
        const data = JSON.parse(message.body);
        const { from, to, signal, type } = data;

        if(to !== userId)
            return;

        if(type === 'offer')
        {
            const peer = new SimplePeer({
                initiator: false,
                trickle: false,
                stream: localStream
            });

            peer.on('signal', signal =>
            {
                stompClient.publish({
                    destination: `/app/voice/${activeVoiceChannel.channelId}/signal`,
                    body: JSON.stringify({
                        from: userId,
                        to: from,
                        signal,
                        type: 'answer'
                    }),
                });
            });

            peer.on('stream', stream =>
            {
                const audio = new Audio();
                audio.srcObject = stream;
                audio.play();
            });
            peer.signal(signal);
            setPeers(prev => ({ ...prev, [from]: peer }));
        }
        else if(type === 'answer')
        {
            const peer = peers[from];
            if(peer)
                peer.signal(signal);
        }
    };

    const handleVoiceUsers = (message) =>
    {
        const data = JSON.parse(message.body);
        setVoiceUsers(data);

        Object.keys(data).forEach(remoteUserId =>
        {
            if(
                remoteUserId !== userId &&
                !peers[remoteUserId] &&
                localStream)
            {
                const peer = new SimplePeer({
                    initiator: true,
                    trickle: false,
                    stream: localStream
                });

                peer.on('signal', signal =>
                {
                    stompClient.publish({
                        destination: `/app/voice/${activeVoiceChannel.channelId}/signal`,
                        body: JSON.stringify({
                            from: userId,
                            to: remoteUserId,
                            signal,
                            type: 'offer'
                        }),
                    });
                });

                peer.on('stream', stream =>
                {
                    const audio = new Audio();
                    audio.srcObject = stream;
                    audio.play();
                });

                setPeers(prev => ({ ...prev, [remoteUserId]: peer }));
            }
        });
    };

    const toggleMute = () =>
    {
        if(localStream)
        {
            localStream.getAudioTracks().forEach(track =>
            {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };
    */

    useEffect(() =>
    {
        const fetchUsers = async () =>
        {
            try{
                const token = await getToken();
                const response = await axios.get(`http://localhost:8080/api/projects/${id}/members`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedUsers = response.data.map((user) => ({
                    id: user.userId,
                    name: user.username,
                    avatar:
                        user.profileImageUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.username
                        )}&background=0D8ABC&color=fff`,
                }));

                setUsers(formattedUsers);
            }catch(err){
                console.error('Error fetching users:', err);
            }
        };
        if(id)
            fetchUsers();
    }, [id, getToken]);

    const fetchMessages = async (channelId) =>
    {
        try{
            setLoading(true);
            const token = await getToken();

            const accessResponse = await axios.get(
                `http://localhost:8080/api/messages/channel/${channelId}/access/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
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
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const userReactionsResponse = await axios.get(
                `http://localhost:8080/api/messages/channel/${channelId}/userreactions/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const userReactionsMap = {};
            userReactionsResponse.data.forEach((reaction) =>
            {
                if (!userReactionsMap[reaction.messageId]) userReactionsMap[reaction.messageId] = [];
                userReactionsMap[reaction.messageId].push(reaction.reactionType);
            });

            const enhancedMessages = response.data.map((msg, index) =>
            {
                const reactions = msg.reactions;
                const isEdited = msg.edited;
                const messageId = msg.id;

                let voiceMessage = null;
                if(msg.voiceMessage)
                {
                    let audioSrc = null;
                    if(msg.voiceMessage.audioData)
                    {
                        try{
                            const byteCharacters = atob(msg.voiceMessage.audioData);
                            const byteNumbers = new Array(byteCharacters.length);
                            for(let i = 0; i < byteCharacters.length; i++)
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: msg.voiceMessage.fileType || 'audio/webm' });
                            audioSrc = URL.createObjectURL(blob);
                        }catch(error){
                            console.error('Error converting audio data:', error);
                        }
                    }

                    voiceMessage =
                    {
                        fileType: msg.voiceMessage.fileType,
                        audioSrc,
                        fileSize: msg.voiceMessage.fileSize,
                        durationSeconds: msg.voiceMessage.durationSeconds,
                        waveformData: msg.voiceMessage.waveformData,
                    };
                }

                let attachment = null;
                if(!msg.voiceMessage && msg.attachments && msg.attachments.length > 0)
                {
                    const firstAttachment = msg.attachments[0];
                    attachment =
                    {
                        type: firstAttachment.fileType.toLowerCase(),
                        name: firstAttachment.fileName,
                        size: formatFileSize(firstAttachment.fileSize),
                        fileData: firstAttachment.fileData,
                        id: firstAttachment.id,
                        uploadedAt: firstAttachment.uploadedAt,
                    };
                }

                let codeSnippet = null;
                if(msg.codeSnippet)
                {
                    console.log(msg);
                    codeSnippet =
                    {
                        language: msg.codeSnippet.language,
                        code: msg.codeSnippet.codeContent,
                    };
                    msg.content = "";
                }

                let poll = null;
                if(msg.poll)
                {
                    poll =
                    {
                        id: msg.poll.id,
                        question: msg.poll.question,
                        options: msg.poll.options.map((opt) => ({
                            id: opt.id,
                            text: opt.optionText,
                            votes: opt.votes,
                        })),
                        totalVotes: msg.poll.totalVotes,
                    };
                }

                return{
                    ...msg,
                    messageId,
                    reactions,
                    userReactions: userReactionsMap[messageId] || [],
                    isEdited,
                    voiceMessage,
                    attachment,
                    codeSnippet,
                    poll,
                    repliedMessage: msg.repliedMessage,
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
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                setChannels((prev) =>
                    prev.map((channel) =>
                        channel.channelId === channelId ? { ...channel, unreadCount: 0 } : channel
                    )
                );
            }catch(markReadErr){
                console.warn(t("chat.reaf"), markReadErr);
            }
            setLoading(false);
            scrollToBottom();
        }catch(err){
            console.error(t("chat.fetcherr"), err);
            setError(t("chat.loaderr"));
            setLoading(false);
        }
    };

    function formatFileSize(bytes)
    {
        if(bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

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
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    maxWebSocketFrameSize: 8192 * 1024,
                });

                client.onConnect = function (frame)
                {
                    setConnected(true);

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}`, function (message)
                    {
                        const receivedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                        {
                            const existingMessage = prevMessages.find(
                                (msg) =>
                                    msg.id &&
                                    msg.senderId === receivedMessage.senderId &&
                                    msg.content === receivedMessage.content &&
                                    msg.timestamp.split('.')[0] === receivedMessage.timestamp.split('.')[0]
                            );
                            if(existingMessage)
                            {
                                return prevMessages.map((msg) =>
                                    msg.id === existingMessage.id ? { ...receivedMessage, voiceMessage: receivedMessage.voiceMessage } : msg
                                );
                            }
                            else
                                return [...prevMessages, { ...receivedMessage, voiceMessage: receivedMessage.voiceMessage }];
                        });
                        scrollToBottom();
                        updateUnreadCount(receivedMessage);
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/edit`, function (message)
                    {
                        const editedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === editedMessage.id
                                    ?
                                    {
                                        ...msg,
                                        content: editedMessage.content,
                                        isEdited: true,
                                        editedAt: editedMessage.editedAt || new Date().toISOString(),
                                    }
                                    : msg
                            )
                        );
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/delete`, function (message)
                    {
                        const deletedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.filter((msg) => msg.id !== deletedMessage.id)
                        );
                    });

                    client.subscribe(`/topic/project/${id}/channels`, function (message)
                    {
                        fetchChannels();
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/reaction`, function (message) {
                        const updatedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === updatedMessage.id
                                    ? {
                                        ...msg,
                                        reactions: updatedMessage.reactions || msg.reactions,
                                        userReactions: updatedMessage.userReactions ||
                                            (updatedMessage.userId === userId && updatedMessage.reactionType
                                                ? updatedMessage.action === 'remove'
                                                    ? msg.userReactions.filter((r) => r !== updatedMessage.reactionType)
                                                    : [...(msg.userReactions || []), updatedMessage.reactionType]
                                                : msg.userReactions || []),
                                        isProcessingReaction: false,
                                    }
                                    : msg
                            )
                        );
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/attachment`, function (message)
                    {
                        const attachmentUpdate = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === attachmentUpdate.messageId
                                    ?
                                    {
                                        ...msg,
                                        attachment:
                                        {
                                            type: attachmentUpdate.fileType.toLowerCase(),
                                            name: attachmentUpdate.fileName,
                                            size: formatFileSize(attachmentUpdate.fileSize),
                                            fileData: attachmentUpdate.fileData,
                                            id: attachmentUpdate.id,
                                            uploadedAt: attachmentUpdate.uploadedAt,
                                        },
                                    }
                                    : msg
                            )
                        );
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/poll`, function (message)
                    {
                        const pollData = JSON.parse(message.body);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === pollData.messageId
                                    ?
                                    {
                                        ...msg,
                                        poll:
                                        {
                                            id: pollData.id,
                                            question: pollData.question,
                                            options: pollData.options.map((opt) => ({
                                                id: opt.id,
                                                text: opt.optionText,
                                                votes: opt.votes,
                                            })),
                                            totalVotes: pollData.totalVotes,
                                        },
                                    }
                                    : msg
                            )
                        );
                    });

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}`, function (message)
                    {
                        const receivedMessage = JSON.parse(message.body);

                        let enhancedMessage = { ...receivedMessage };
                        if(receivedMessage.voiceMessage)
                        {
                            const audioData = receivedMessage.voiceMessage.audioData;
                            let audioSrc = null;
                            if(audioData)
                            {
                                try{
                                    const byteCharacters = atob(audioData);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for(let i = 0; i < byteCharacters.length; i++)
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const blob = new Blob([byteArray], { type: receivedMessage.voiceMessage.fileType || 'audio/webm' });
                                    audioSrc = URL.createObjectURL(blob);
                                }catch(error){
                                    console.error('Error converting audio data:', error);
                                }
                            }

                            enhancedMessage.voiceMessage =
                            {
                                fileType: receivedMessage.voiceMessage.fileType,
                                audioSrc,
                                fileSize: receivedMessage.voiceMessage.fileSize,
                                durationSeconds: receivedMessage.voiceMessage.durationSeconds,
                                waveformData: receivedMessage.voiceMessage.waveformData,
                            };
                        }

                        setMessages((prevMessages) =>
                        {
                            const existingMessage = prevMessages.find(
                                (msg) =>
                                    msg.id &&
                                    msg.senderId === receivedMessage.senderId &&
                                    msg.content === receivedMessage.content &&
                                    msg.timestamp.split('.')[0] === receivedMessage.timestamp.split('.')[0]
                            );
                            if(existingMessage)
                            {
                                return prevMessages.map((msg) =>
                                    msg.id === existingMessage.id ? enhancedMessage : msg
                                );
                            }
                            else
                                return [...prevMessages, enhancedMessage];
                        });
                        scrollToBottom();
                        updateUnreadCount(receivedMessage);
                    });
                    /*
                    if(activeVoiceChannel)
                    {
                        client.subscribe(`/topic/voice/${activeVoiceChannel.channelId}/signal`, handleVoiceSignal);
                        client.subscribe(`/topic/voice/${activeVoiceChannel.channelId}/users`, handleVoiceUsers);
                    }
                    */

                    client.subscribe(`/topic/channel/${selectedChannel.channelId}/codesnippet`, function (message) {
                        const updatedMessage = JSON.parse(message.body);
                        console.log(updatedMessage);
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === updatedMessage.id
                                    ? {
                                        ...msg,
                                        codeSnippet: updatedMessage.codeSnippet,
                                        content: "",
                                    }
                                    : msg
                            )
                        );
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
    }, [userId, id, selectedChannel?.channelId, activeVoiceChannel?.channelId]);

    const [replyingTo, setReplyingTo] = useState(null);

    const handleReplyMessage = (message) =>
    {
        setReplyingTo(message);
        document.querySelector('textarea').focus();
    };

    const updateUnreadCount = (message) =>
    {
        if(message.senderId === userId || (selectedChannel && message.channelId === selectedChannel.channelId))
            return;

        setChannels((prev) =>
            prev.map((channel) =>
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
    }, [selectedChannel]);

    useEffect(() =>
    {
        if(id && userId)
            fetchChannels();
    }, [id, userId]);

    const scrollToBottom = () =>
    {
        if(!messagesEndRef.current)
            return;

        const messageContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if(messageContainer)
            messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const handleSendMessage = async (e) =>
    {
        e.preventDefault();
        if(!message.trim() && !selectedFile && !showCodeFormatting && !showPollCreator && !audioBlob)
            return;
        if(!selectedChannel)
            return;

        try{
            let content = message;
            let codeSnippet = null;
            if(showCodeFormatting)
            {
                codeSnippet =
                {
                    language: codeLanguage,
                    codeContent: message
                };
                content = `\`\`\`${codeLanguage}\n${message}\n\`\`\``;
            }

            const newMessage =
            {
                senderId: userId,
                content: content || (audioBlob ? t("chat.voice") : ''),
                projectId: parseInt(id),
                channelId: selectedChannel.channelId,
                senderName: users.find((u) => u.id === userId)?.name || 'Unknown User',
                timestamp: new Date().toISOString(),
                codeSnippet: codeSnippet,
                replyToMessageId: replyingTo?.id || null
            };

            if(audioBlob)
                await uploadAudioMessage(audioBlob, selectedChannel.channelId);
            else
            {
                if(stompClient && connected)
                {
                    stompClient.publish({
                        destination: `/app/chat/${selectedChannel.channelId}/send`,
                        body: JSON.stringify(newMessage),
                    });

                    if(selectedFile)
                    {
                        setFilesToUpload({
                            file: selectedFile,
                            channelId: selectedChannel.channelId,
                        });
                    }
                }
                else
                {
                    const token = await getToken();
                    const messageResponse = await axios.post(
                        `http://localhost:8080/api/messages/channel/${selectedChannel.channelId}`,
                        newMessage,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if(selectedFile)
                    {
                        await uploadAttachment(
                            selectedFile,
                            messageResponse.data.id,
                            parseInt(id),
                            selectedChannel.channelId
                        );
                    }
                }
            }

            setMessage('');
            setSelectedFile(null);
            setAudioBlob(null);
            setShowCodeFormatting(false);
            setShowPollCreator(false);
            setPollQuestion('');
            setPollOptions(['', '']);
            scrollToBottom();
        }catch(err){
            console.error(t("chat.messerr"), err);
            alert(t("chat.messerr2"));
        }
    };

    const uploadAudioMessage = async (audioBlob, channelId) =>
    {
        if(!stompClient || !connected)
        {
            alert('WebSocket not connected. Please try again.');
            return;
        }

        try{
            const base64Audio = await new Promise((resolve) =>
            {
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () =>
                {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
            });

            const chunkSize = 10000;
            const chunks = [];
            for(let i = 0; i < base64Audio.length; i += chunkSize)
                chunks.push(base64Audio.substring(i, i + chunkSize));

            const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            const audioMessage =
            {
                senderId: userId,
                channelId: channelId,
                projectId: parseInt(id),
                content: t("chat.voice"),
                fileType: 'audio/webm',
                fileSize: audioBlob.size,
                durationSeconds: recordingTime,
                waveformData: '',
                messageId: messageId,
                totalChunks: chunks.length,
            };

            const destination = `/app/audio/${channelId}/send`;

            const sendChunksSequentially = async (index = 0) =>
            {
                if(index >= chunks.length)
                {
                    console.log('All chunks sent successfully');
                    return;
                }

                const payload = JSON.stringify({
                    ...audioMessage,
                    audioDataChunk: chunks[index],
                    chunkIndex: index,
                });

                console.log(`Sending chunk ${index + 1}/${chunks.length}, size: ${chunks[index].length} chars`);

                await new Promise((resolve) => {
                    stompClient.publish({
                        destination: destination,
                        body: payload,
                        headers: {},
                        skipContentLengthHeader: true,
                    });
                    resolve();
                });
                await new Promise(resolve => setTimeout(resolve, 50));

                await sendChunksSequentially(index + 1);
            };
            await sendChunksSequentially();

            console.log(t("chat.chunk"), destination);
        }catch(err){
            console.error(t("chat.chunkerr"), err);
            alert(t("chat.chunkerr2"));
        }
    };

    const uploadAttachment = async (file, messageId, projectId, channelId) =>
    {
        try{
            const token = await getToken();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('messageId', messageId);
            formData.append('projectId', projectId);
            formData.append('channelId', channelId);
            formData.append('userId', userId);

            await axios.post('http://localhost:8080/api/messages/upload-attachment', formData,
            {
                headers:
                {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }catch(error){
            console.error(t("chat.fileerr"), error);
        }
    };

    const uploadCallCount = useRef(0);

    useEffect(() => {
        const handlePendingFileUploads = async () => {
            uploadCallCount.current += 1;

            if (uploadCallCount.current % 2 !== 0) {
                console.log(`Skipping odd call #${uploadCallCount.current} to handlePendingFileUploads`);
                return;
            }

            if (!filesToUpload || !messages.length) return;

            const latestMessage = [...messages]
                .reverse()
                .find((msg) => msg.senderId === userId);

            if (latestMessage && latestMessage.id) {
                await uploadAttachment(
                    filesToUpload.file,
                    latestMessage.id,
                    parseInt(id),
                    filesToUpload.channelId
                );

                setFilesToUpload(null);
            }
        };

        handlePendingFileUploads();
    }, [messages, filesToUpload]);

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

    const handleFileSelect = () =>
    {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) =>
    {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleEmojiClick = (emoji) =>
    {
        setMessage((prev) => prev + emoji);
        setShowEmojiPicker({ context: null, messageId: null });
    };

    const handleReactionClick = async (messageId, reaction) => {
        if (!selectedChannel || !stompClient || !connected) return;

        try {
            const message = messages.find((msg) => msg.id === messageId);
            if (!message) return;

            const hasReacted = message.userReactions?.includes(reaction);

            if (message.isProcessingReaction) return;

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, isProcessingReaction: true } : msg
                )
            );

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: {
                                ...msg.reactions,
                                [reaction]: hasReacted
                                    ? (msg.reactions[reaction] || 1) - 1
                                    : (msg.reactions[reaction] || 0) + 1,
                            },
                            userReactions: hasReacted
                                ? msg.userReactions.filter((r) => r !== reaction)
                                : [...(msg.userReactions || []), reaction],
                        }
                        : msg
                )
            );

            const reactionDTO = {
                messageId: messageId,
                userId: userId,
                reactionType: reaction,
                channelId: selectedChannel.channelId,
            };

            if (hasReacted) {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/reaction/remove`,
                    body: JSON.stringify(reactionDTO),
                });
            } else {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/reaction/add`,
                    body: JSON.stringify(reactionDTO),
                });
            }

            setTimeout(() => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId ? { ...msg, isProcessingReaction: false } : msg
                    )
                );
            }, 1000);
        } catch (err) {
            console.error(t("chat.reacterr3"), err);
            alert(t("chat.reacterr4"));
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            isProcessingReaction: false,
                        }
                        : msg
                )
            );
        }
    };

    const handleRemoveReaction = async (messageId, reaction) =>
    {
        if(!selectedChannel || !stompClient || !connected)
            return;

        try{
            const message = messages.find((msg) => msg.id === messageId);
            if(!message || !message.userReactions?.includes(reaction))
                return;

            if(message.isProcessingReaction)
                return;

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, isProcessingReaction: true } : msg
                )
            );

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: {
                                ...msg.reactions,
                                [reaction]: Math.max((msg.reactions[reaction] || 1) - 1, 0),
                            },
                            userReactions: msg.userReactions.filter((r) => r !== reaction),
                        }
                        : msg
                )
            );

            const reactionDTO =
            {
                messageId: messageId,
                userId: userId,
                reactionType: reaction,
                channelId: selectedChannel.channelId,
            };

            stompClient.publish({
                destination: `/app/chat/${selectedChannel.channelId}/reaction/remove`,
                body: JSON.stringify(reactionDTO),
            });

            setTimeout(() => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId ? { ...msg, isProcessingReaction: false } : msg
                    )
                );
            }, 1000);
        }catch(err){
            console.error(t("chat.reacterr"), err);
            alert(t("chat.reacterr2"));
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            isProcessingReaction: false,
                            userReactions: [...(msg.userReactions || []), reaction],
                            reactions: {
                                ...msg.reactions,
                                [reaction]: (msg.reactions[reaction] || 0) + 1,
                            },
                        }
                        : msg
                )
            );
        }
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
            console.error(t("chat.editerr"), err);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === editingMessage.id
                        ? { ...msg, content: editingMessage.content, isEdited: editingMessage.isEdited }
                        : msg
                )
            );
            alert(t("chat.editerr2"));
        }
    };

    const handleDeleteMessage = async (messageId) =>
    {
        try{
            const messageToDelete = messages.find((msg) => msg.id === messageId);
            if(!messageToDelete)
                return;

            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

            const deleteMessageData =
            {
                id: messageId,
                senderId: userId,
                channelId: selectedChannel.channelId,
            };

            if(stompClient && connected)
            {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/delete`,
                    body: JSON.stringify(deleteMessageData),
                });
            }
            else
            {
                const token = await getToken();
                await axios.delete(`http://localhost:8080/api/messages/${messageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { senderId: userId },
                });
            }
            setShowMessageActions(null);
        }catch(err){
            console.error(t("chat.delerr"), err);
            const messageToRestore = messages.find((msg) => msg.id === messageId);
            if(messageToRestore)
                setMessages((prev) => [...prev, messageToRestore].sort((a, b) => a.id - b.id));
            alert(t("chat.delerr2"));
        }
    };

    const handleCreatePoll = async () =>
    {
        if(!pollQuestion.trim() || pollOptions.some((option) => !option.trim()))
        {
            alert(t("chat.fill"));
            return;
        }

        try{
            const token = await getToken();

            const pollMessage =
            {
                senderId: userId,
                content: '📊 ' + pollQuestion,
                projectId: parseInt(id),
                channelId: selectedChannel.channelId,
                senderName: users.find((u) => u.id === userId)?.name || t("chat.unknown"),
                timestamp: new Date().toISOString(),
                poll: {
                    question: pollQuestion,
                    options: pollOptions.map((opt, index) => ({
                        id: index,
                        optionText: opt,
                        votes: 0,
                    })),
                    isMultipleChoice: false,
                    expiresAt: null,
                },
            };

            if(stompClient && connected)
            {
                stompClient.publish({
                    destination: `/app/chat/${selectedChannel.channelId}/send`,
                    body: JSON.stringify(pollMessage),
                });
            }
            else
            {
                await axios.post(
                    `http://localhost:8080/api/messages/channel/${selectedChannel.channelId}`,
                    pollMessage,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setPollQuestion('');
            setPollOptions(['', '']);
            setShowPollCreator(false);
            scrollToBottom();
        }catch(err){
            console.error(t("chat.errpoll"), err);
            alert(t("chat.errpoll2"));
        }
    };

    const addPollOption = () =>
    {
        setPollOptions((prev) => [...prev, '']);
    };

    const updatePollOption = (index, value) =>
    {
        setPollOptions((prev) =>
        {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const removePollOption = (index) =>
    {
        if(pollOptions.length <= 2)
            return;
        setPollOptions((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleRecordingAudio = async () =>
    {
        if(!isRecordingAudio)
        {
            try{
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) =>
                {
                    if(event.data.size > 0)
                        audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () =>
                {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setAudioBlob(audioBlob);
                    stream.getTracks().forEach((track) => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecordingAudio(true);

                setRecordingTime(0);
                timerRef.current = setInterval(() =>
                {
                    setRecordingTime((prev) => prev + 1);
                },1000);
            }catch(err){
                console.error(t("chat.error"), err);
                alert(t("chat.error2"));
            }
        }
        else
        {
            mediaRecorderRef.current.stop();
            setIsRecordingAudio(false);
            clearInterval(timerRef.current);
        }
    };

    const toggleCodeFormatting = () =>
    {
        setShowCodeFormatting((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) &&
                !event.target.closest('button svg')
            ) {
                setShowEmojiPicker({ context: null, messageId: null });
            }

            if (
                messageActionsRef.current &&
                !messageActionsRef.current.contains(event.target)
            ) {
                setShowMessageActions(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredMessages = searchTerm
        ? messages.filter(
            (msg) =>
                msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : messages;

    const filteredChannels = channelSearchTerm
        ? channels.filter((channel) =>
            channel.channelName.toLowerCase().includes(channelSearchTerm.toLowerCase())
        )
        : channels;
/*
    const renderVoiceChannels = () => (
        <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-500">VOICE CHANNELS</h3>
            <ul>
                {voiceChannels.map((channel) =>(
                    <li
                        key={channel.channelId}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${activeVoiceChannel?.channelId === channel.channelId ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                        onClick={() =>
                        {
                            if(isInVoiceChannel && activeVoiceChannel?.channelId !== channel.channelId)
                            {
                                leaveVoiceChannel();
                                setTimeout(() => joinVoiceChannel(channel), 500);
                            }
                            else if(!isInVoiceChannel)
                                joinVoiceChannel(channel);
                        }}>
                        <div className="flex items-center">
                            <Volume2 size={16} className="mr-2 text-gray-500" />
                            <span>{channel.channelName}</span>
                        </div>
                        {activeVoiceChannel?.channelId === channel.channelId && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMute();
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>
                                <button
                                    onClick={(e) =>
                                    {
                                        e.stopPropagation();
                                        leaveVoiceChannel();
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <PhoneOff size={16} className="text-red-500" />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderVoiceParticipants = () =>
    {
        if(!isInVoiceChannel || !activeVoiceChannel)
            return null;

        return(
            <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50 max-w-[calc(100%-32px)] md:max-w-xs">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm truncate mr-2">{activeVoiceChannel.channelName}</h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleMute}
                            className={`p-1 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}>
                            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                        </button>
                        <button
                            onClick={leaveVoiceChannel}
                            className="p-1 rounded-full bg-red-500">
                            <PhoneOff size={16}/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center bg-gray-700 rounded-full px-2 py-1">
                        <User size={14} className="mr-1" />
                        <span className="text-xs">{users.find(u => u.id === userId)?.name || 'You'}</span>
                        {isMuted && <MicOff size={12} className="ml-1 text-red-500" />}
                    </div>

                    {Object.entries(voiceUsers || {}).map(([id, username]) =>
                    {
                        if(id === userId)
                            return null;
                        return(
                            <div key={id} className="flex items-center bg-gray-700 rounded-full px-2 py-1">
                                <User size={14} className="mr-1" />
                                <span className="text-xs truncate max-w-[80px]">{username}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    */

    const customNavItems =
    [
        {
            id: 'dashboard',
            icon: Layout,
            label: t('sidebar.dash'),
            path: '/dashboard',
            iconColor: 'text-blue-600',
            defaultColor: true,
        },
        {
            id: 'projects',
            icon: KanbanSquare,
            label: t('sidebar.this'),
            path: `/project/${id}`,
            state: { isOwner },
            color: 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]',
            iconColor: 'text-[var(--sidebar-projects-color)]',
        },
        {
            id: 'activity',
            icon: Activity,
            label: t('sidebar.act'),
            path: `/project/${id}/activity`,
            state: { isOwner },
            color: 'bg-yellow-100 text-yellow-600',
            iconColor: 'text-amber-600',
        },
        {
            id: 'teams',
            icon: UsersIcon,
            label: t('sidebar.team'),
            path: `/project/${id}/teams`,
            state: { isOwner },
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600',
        },
        {
            id: 'chat',
            icon: MessageCircle,
            label: t('sidebar.chat'),
            path: `/project/${id}/chat`,
            color: 'bg-[var(--features-icon-color)]/10 text-[var(--features-icon-color)]',
            iconColor: 'text-[var(--features-icon-color)]',
        },
        {
            id: 'notes',
            icon: BookOpen,
            label: t('notes.title'),
            path: `/project/${id}/notes`,
            state: { isOwner },
            color: 'bg-teal-100 text-teal-600',
            iconColor: 'text-teal-600',
        },
        {
            id: 'settings',
            icon: Settings,
            label: t('sidebar.set'),
            path: `/project/${id}/settings`,
            state: { isOwner },
            color: 'bg-gray-100 text-gray-600',
            iconColor: 'text-gray-600',
        },
    ];

    const projectChannels = filteredChannels.filter((channel) => channel.channelType === 'PROJECT');

    const teamChannels = filteredChannels.filter((channel) => channel.channelType === 'TEAM');

    const renderChatInput = () => (
        <div className="p-2 md:p-4 border-t border-[var(--gray-card3)] bg-[var(--bg-color)]">
            {replyingTo && (
                <div className="mb-2 p-2 bg-[var(--gray-card3)]/30 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Reply size={16} className="text-[var(--features-icon-color)]" />
                        <div>
                            <div className="text-xs font-medium text-[var(--features-text-color)]">
                                {t("chat.reply")} {users.find((u) => u.id === replyingTo.senderId)?.name || 'Unknown User'}
                            </div>
                            <p className="text-xs text-[var(--features-text-color)] truncate">
                                {replyingTo.content.length > 50
                                    ? `${replyingTo.content.substring(0, 50)}...`
                                    : replyingTo.content}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setReplyingTo(null)}
                        className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            {showPollCreator && (
                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-[var(--features-text-color)]">
                            {t("chat.poll")}
                        </h3>
                        <button
                            onClick={() => setShowPollCreator(false)}
                            className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]">
                            <X size={16}/>
                        </button>
                    </div>
                    <input
                        type="text"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder={t("chat.poll2")}
                        className="w-full p-2 mb-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"/>
                    <div className="space-y-2 mb-3">
                        {pollOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updatePollOption(index, e.target.value)}
                                    placeholder={`${t("chat.option")} ${index + 1}`}
                                    className="flex-1 p-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"/>
                                {pollOptions.length > 2 && (
                                    <button
                                        onClick={() => removePollOption(index)}
                                        className="text-red-500 hover:text-red-700">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={addPollOption}
                            className="text-sm text-[var(--features-icon-color)] hover:text-[var(--hover-color)] flex items-center gap-1">
                            <PlusCircle size={16} />
                            {t("chat.opp")}
                        </button>
                        <button
                            onClick={handleCreatePoll}
                            className="text-sm bg-[var(--features-icon-color)] !text-white px-3 py-1 rounded-md hover:bg-[var(--hover-color)]">
                                {t("chat.create")}
                        </button>
                    </div>
                </div>
            )}
            {showCodeFormatting && (
                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-[var(--features-text-color)]">
                            {t("chat.format")}
                        </h3>
                        <button
                            onClick={() => setShowCodeFormatting(false)}
                            className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-sm mr-2 text-[var(--features-text-color)]">{t("chat.language")}:</span>
                        <select
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            className="text-sm p-1 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)]">
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
                        {t("chat.text")}
                    </div>
                </div>
            )}
            {isRecordingAudio && (
                <div className="mb-4 p-3 bg-red-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-700">{t("chat.record")}...</span>
                        <span className="text-xs text-red-500">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    <button
                        onClick={toggleRecordingAudio}
                        className="text-red-500 hover:text-red-700">
                        <PauseCircle size={20} />
                    </button>
                </div>
            )}
            {audioBlob && !isRecordingAudio && (
                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Mic size={16} className="text-blue-500"/>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-[var(--features-text-color)]">
                                {t("chat.voice")}
                            </div>
                            <div className="text-xs text-[var(--features-text-color)] opacity-70">
                                {(audioBlob.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setAudioBlob(null)}
                        className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]">
                        <X size={16}/>
                    </button>
                </div>
            )}
            {selectedFile && (
                <div className="mb-4 p-3 bg-[var(--gray-card3)]/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {selectedFile.type.includes('image') ? (
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <img
                                    src="/api/placeholder/40/40"
                                    alt="Preview"
                                    className="w-6 h-6 object-cover"/>
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <Paperclip size={16} className="text-blue-500"/>
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
                        className="text-[var(--features-text-color)] hover:text-[var(--hover-color)]">
                        <X size={16}/>
                    </button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="relative">
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*, application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                    {
                        if(e.key === 'Enter' && !e.shiftKey)
                        {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    placeholder={
                        showCodeFormatting ? t("chat.paste") : t("chat.type")
                    }
                    className="w-full p-3 rounded-lg border border-[var(--gray-card3)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] bg-[var(--bg-color)] text-[var(--features-text-color)] min-h-[80px] md:min-h-[100px] resize-y"
                    disabled={!selectedChannel}/>
                {showEmojiPicker.context === 'input' && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute bottom-full left-0 mb-2 bg-[var(--bg-color)] rounded-lg shadow-lg p-4 w-80 z-10 border border-[var(--gray-card3)]"
                    >
                        <div className="text-sm font-medium text-[var(--features-text-color)] mb-2">
                            {t("chat.emoji")}
                        </div>
                        {/* Common Emojis */}
                        <div className="mb-4">
                            <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-1">
                                {t("chat.emoji")}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {commonEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Categorized Emojis */}
                        {Object.entries(emojiCategories).map(([category, emojis]) => (
                            <div key={category} className="mb-4">
                                <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-1">
                                    {category}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {emojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 md:space-x-2 overflow-x-auto">
                        {/* Essential buttons always visible */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker({ context: 'input', messageId: null })}
                            className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                            disabled={!selectedChannel}>
                            <Smile size={18}/>
                        </button>
                        <button
                            type="button"
                            onClick={handleFileSelect}
                            className="p-1 rounded-md hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                            disabled={!selectedChannel}>
                            <Paperclip size={18}/>
                        </button>
                        <button
                            type="button"
                            onClick={toggleCodeFormatting}
                            className={`p-1 rounded-md ${showCodeFormatting
                                ? 'bg-[var(--features-icon-color)]/20 text-[var(--features-icon-color)]'
                                : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                            }`}
                            disabled={!selectedChannel}>
                            <Code size={18}/>
                        </button>
                        <button
                            type="button"
                            onClick={toggleRecordingAudio}
                            className={`p-1 rounded-md ${isRecordingAudio
                                ? 'bg-red-100 text-red-500'
                                : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                            }`}
                            disabled={!selectedChannel}>
                            <Mic size={18}/>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPollCreator((prev) => !prev)}
                            className={`p-1 rounded-md ${showPollCreator
                                ? 'bg-[var(--features-icon-color)]/20 text-[var(--features-icon-color)]'
                                : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]'
                            }`}
                            disabled={!selectedChannel}>
                            <BarChart2 size={18}/>
                        </button>
                    </div>
                    <motion.button
                        type="submit"
                        disabled=
                        {
                            !selectedChannel ||
                            (!message.trim() && !selectedFile && !isRecordingAudio && !showPollCreator && !audioBlob)
                        }
                        className={`ml-2 p-2 md:p-3 rounded-lg ${(message.trim() || selectedFile || audioBlob || showPollCreator) && selectedChannel
                            ? 'bg-[var(--features-icon-color)] !text-white hover:bg-[var(--hover-color)]'
                            : 'bg-[var(--gray-card3)] text-[var(--features-text-color)]/50 cursor-not-allowed'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <Send size={20}/>
                    </motion.button>
                </div>
            </form>
        </div>
    );

    return(
        <div className="flex flex-col h-screen bg-[var(--bg-color)]">
            <Header
                title={
                    <div className="flex items-center">
                        <span
                            className="cursor-pointer mr-2"
                            onClick={() => navigate(`/project/${id || 1}`)}>
                            <ArrowLeft size={20} className="text-[var(--features-icon-color)]" />
                        </span>
                        <span className="text-xl font-semibold text-[var(--sidebar-projects-color)]">
                            {t("chat.chat")}: {projectName}
                        </span>
                    </div>
                }/>
            <div className="flex flex-1 overflow-hidden relative">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden fixed bottom-4 right-4 z-50 bg-green-600 !text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                    aria-label="Toggle menu">
                    <FaBars size={24}/>
                </button>
                <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-[var(--sidebar-projects-bg-color)]">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        customNavItems={customNavItems}
                        onCollapseChange={setIsSidebarCollapsed}/>
                </div>
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            customNavItems={customNavItems} 
                            isMobile={true} 
                            closeMobileMenu={() => setIsMobileSidebarOpen(false)} />
                    </div>
                )}
                <div className="flex-1 flex bg-[var(--projects-bg)] overflow-hidden">
                    {/* Mobile channel toggle button */}
                    <button 
                        className="md:hidden fixed bottom-4 left-4 z-40 bg-[var(--features-icon-color)] !text-white p-3 rounded-full shadow-lg"
                        onClick={toggleChannelSidebar}
                    >
                        {showChannelSidebar ? <X size={20} /> : <MessageCircle size={20} />}
                    </button>
                    
                    {/* Channel sidebar with mobile responsiveness */}
                    <div className={`${showChannelSidebar ? 'absolute inset-0 z-30' : 'hidden'} md:static md:block md:w-64 bg-[var(--bg-color)] border-r border-[var(--gray-card3)] p-4 overflow-y-auto`}>
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={channelSearchTerm}
                                    onChange={(e) => setChannelSearchTerm(e.target.value)}
                                    placeholder={t("chat.search")}
                                    className="w-full py-1 px-3 text-sm border border-[var(--gray-card3)] rounded-lg bg-[var(--bg-color)] text-[var(--features-text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"/>
                                <Search
                                    size={14}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--features-text-color)] opacity-50"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-[var(--features-text-color)] opacity-70 uppercase">
                                {t("chat.channels")}
                            </h3>
                            {projectChannels.map((channel) => (
                                <div
                                    key={channel.channelId}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${selectedChannel?.channelId === channel.channelId
                                            ? 'bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-icon-color)]'
                                            : 'hover:bg-[var(--gray-card3)]/10 text-[var(--features-text-color)]'
                                        }`}>
                                    <Hash size={16} className="text-[var(--features-icon-color)]" />
                                    <span className="text-sm">{channel.channelName}</span>
                                    {channel.unreadCount > 0 && (
                                        <span className="ml-auto bg-red-500 !text-white text-xs rounded-full px-2 py-0.5">
                                            {channel.unreadCount}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 space-y-2">
                            <h3 className="text-xs font-semibold text-[var(--features-text-color)] opacity-70 uppercase">
                                {t("chat.teamchan")}
                            </h3>
                            {teamChannels.map((channel) =>
                            {
                                let TeamIcon = Users;
                                if(channel.teamData && channel.teamData.iconName)
                                {
                                    const IconComponent =
                                        ALL_ICONS[channel.teamData.iconName] ||
                                        ALL_ICONS[`Fa${channel.teamData.iconName}`] ||
                                        ALL_ICONS[`Md${channel.teamData.iconName}`];
                                    if(IconComponent)
                                        TeamIcon = IconComponent;
                                }

                                const teamName = channel.channelName.endsWith(' Chat')
                                    ? channel.channelName.slice(0, -5)
                                    : channel.channelName;

                                const displayName = `${teamName} ${t("chat.teamchati")}`;

                                return(
                                    <div
                                        key={channel.channelId}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${selectedChannel?.channelId === channel.channelId
                                                ? 'bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-icon-color)]'
                                                : 'hover:bg-[var(--gray-card3)]/10 text-[var(--features-text-color)]'
                                            }`}>
                                        <TeamIcon size={16} className="text-[var(--features-icon-color)]"/>
                                        <span className="text-sm">{displayName}</span>
                                        {channel.unreadCount > 0 && (
                                            <span className="ml-auto bg-red-500 !text-white text-xs rounded-full px-2 py-0.5">
                                                {channel.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-[var(--sidebar-projects-bg-color)] bg-[var(--bg-color)] flex items-center justify-between">
                            <div className="flex items-center">
                                {/* Mobile channel toggle button inside header */}
                                <button 
                                    className="mr-2 md:hidden"
                                    onClick={toggleChannelSidebar}
                                >
                                    <MessageCircle size={18} className="text-[var(--features-icon-color)]" />
                                </button>
                                
                                {selectedChannel?.channelType === 'PROJECT' ? (
                                    <Hash size={18} className="mr-2 text-[var(--features-icon-color)]"/>
                                ) : (
                                    (() =>
                                    {
                                        let TeamIcon = Users;
                                        if(selectedChannel?.teamData && selectedChannel.teamData.iconName)
                                        {
                                            const IconComponent =
                                                ALL_ICONS[selectedChannel.teamData.iconName] ||
                                                ALL_ICONS[`Fa${selectedChannel.teamData.iconName}`] ||
                                                ALL_ICONS[`Md${selectedChannel.teamData.iconName}`];

                                            if(IconComponent)
                                                TeamIcon = IconComponent;
                                        }

                                        return <TeamIcon size={18} className="mr-2 text-[var(--features-icon-color)]" />;
                                    })()
                                )}
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--features-text-color)] truncate max-w-[150px] md:max-w-full">
                                        {selectedChannel?.channelName || t("chat.select")}
                                    </h2>
                                    {selectedChannel?.channelType === 'TEAM' && (
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 truncate max-w-[150px] md:max-w-full">
                                            Team Channel • {selectedChannel.teamData?.teamName || 'Team'} • {t("chat.only")}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {selectedChannel && (
                                    <>
                                        {/* Search is hidden on smallest screens */}
                                        <div className="relative hidden sm:block">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder={t("chat.searchmess")}
                                                className="py-1 px-3 text-sm border border-[var(--gray-card3)] rounded-lg bg-[var(--bg-color)] text-[var(--features-text-color)] w-40 focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"/>
                                            <Search
                                                size={14}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--features-text-color)] opacity-50"/>
                                        </div>
                                        
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading && !messages.length ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-[var(--features-text-color)] text-center">
                                        {t("chat.loading")}...
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-full flex-col">
                                    <div className="text-red-500 text-center">{error}</div>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full flex-col">
                                    <MessageSquare size={48} className="text-[var(--gray-card3)] mb-4" />
                                    <p className="text-[var(--features-text-color)] text-center">
                                        {selectedChannel
                                            ? t("chat.empty")
                                            : t("chat.select")}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {filteredMessages.map((msg) => (
                                        <Message
                                            key={msg.id}
                                            msg={msg}
                                            userId={userId}
                                            users={users}
                                            isCurrentUser={msg.senderId === userId}
                                            showMessageActions={showMessageActions}
                                            setShowMessageActions={setShowMessageActions}
                                            handleReactionClick={handleReactionClick}
                                            handleRemoveReaction={handleRemoveReaction}
                                            handleEditMessage={handleEditMessage}
                                            handleDeleteMessage={handleDeleteMessage}
                                            selectedChannel={selectedChannel}
                                            setShowEmojiPicker={setShowEmojiPicker}
                                            editingMessage={editingMessage}
                                            editedContent={editedContent}
                                            setEditedContent={setEditedContent}
                                            saveEditedMessage={saveEditedMessage}
                                            stompClient={stompClient}
                                            connected={connected}
                                            messageActionsRef={messageActionsRef}
                                            emojiPickerRef={emojiPickerRef}
                                            setMessages={setMessages}
                                            showEmojiPicker={showEmojiPicker}
                                            formatFileSize={formatFileSize}
                                            handleReplyMessage={handleReplyMessage}
                                            messages = { messages }
                                        />
                                    ))}
                                    <div ref={messagesEndRef}/>
                                </>
                            )}
                        </div>
                        {renderChatInput()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectChatWrapper;