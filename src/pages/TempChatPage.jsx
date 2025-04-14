import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, Search, ArrowLeft, Users, Hash, MessageSquare, 
  PlusCircle, X, MessageCircle, Settings, Layout, Activity, KanbanSquare, UsersIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next'; 
import ViewportHeader from "../components/ViewportHeader";
import Sidebar from "../components/Sidebar";
import { SearchProvider } from '../scripts/SearchContext';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const ProjectChatWrapper = () => {
    return(
        <SearchProvider>
            <TempChatPage/>
        </SearchProvider>
    );
};

const TempChatPage = () => {
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
  const {t} = useTranslation();
  const messagesEndRef = useRef(null);
  
  // Fetch project data (for name and check if user is owner)
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = await getToken();
        // Fetch project details to get name
        const projectResponse = await axios.get(`http://localhost:8080/api/projects/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          }
        });
        setProjectName(projectResponse.data.projectName);
        
        // Check if current user is owner
        const ownerResponse = await axios.get(`http://localhost:8080/api/projects/${id}/isOwner`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'userId': userId 
          }
        });
        setIsOwner(ownerResponse.data);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data');
      }
    };
    
    if (id && userId) {
      fetchProjectData();
    }
  }, [id, userId, getToken]);
  
  // Fetch channels for the project
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:8080/api/messages/channels/project/${id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        // For each channel, get unread count
        const channelsWithUnread = await Promise.all(response.data.map(async (channel) => {
          try {
            const unreadResponse = await axios.get(
              `http://localhost:8080/api/messages/channel/${channel.channelId}/unread/${userId}`,
              {
                headers: { 'Authorization': `Bearer ${token}` }
              }
            );
            return {
              ...channel,
              unreadCount: unreadResponse.data
            };
          } catch (err) {
            console.error('Error getting unread count:', err);
            return {
              ...channel,
              unreadCount: 0
            };
          }
        }));
        
        setChannels(channelsWithUnread);
        
        // Select first channel by default if none selected
        if (!selectedChannel && channelsWithUnread.length > 0) {
          setSelectedChannel(channelsWithUnread[0]);
          fetchMessages(channelsWithUnread[0].channelId);
        } else if (channelsWithUnread.length === 0) {
          // No channels exist - this shouldn't happen if you create a General channel for each project
          setError("No channels available for this project");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels');
        setLoading(false);
      }
    };
    
    if (id && userId) {
      fetchChannels();
      
      // Set up polling for channel updates (every 30 seconds)
      const intervalId = setInterval(fetchChannels, 2000);
      return () => clearInterval(intervalId);
    }
  }, [id, userId, getToken]);
  
  // Fetch users in project (for displaying avatars and names)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:8080/api/projects/${id}/members`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        // Transform to format needed for messages
        const formattedUsers = response.data.map(user => ({
          id: user.userId,
          name: user.username,
          avatar: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0D8ABC&color=fff`
        }));
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    
    if (id) {
      fetchUsers();
    }
  }, [id, getToken]);
  
  // Fetch messages for the selected channel
  const fetchMessages = async (channelId) => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:8080/api/messages/channel/${channelId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setMessages(response.data);
      
      // Mark channel as read
      await axios.post(
        `http://localhost:8080/api/messages/channel/${channelId}/read`,
        userId,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain'
          }
        }
      );
      
      // Update unread count in channels list
      setChannels(prev => 
        prev.map(channel => 
          channel.channelId === channelId 
            ? { ...channel, unreadCount: 0 } 
            : channel
        )
      );
      
      setLoading(false);
      
      // Scroll to bottom of messages
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setLoading(false);
    }
  };
  
  // When channel changes, fetch messages
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.channelId);
      
      // Set up polling for message updates (every 10 seconds)
      const intervalId = setInterval(() => fetchMessages(selectedChannel.channelId), 10000);
      return () => clearInterval(intervalId);
    }
  }, [selectedChannel]);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChannel) return;
    
    try {
      const token = await getToken();
      await axios.post(
        `http://localhost:8080/api/messages/channel/${selectedChannel.channelId}`, 
        {
          senderId: userId,
          content: message,
          projectId: parseInt(id)
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Clear input and refetch messages
      setMessage('');
      fetchMessages(selectedChannel.channelId);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };
  
  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
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

  const customNavItems = [
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
      path: `/project/${id}/temp-chat`,
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

  // Find corresponding user for a message
  const findUserForMessage = (userId) => {
    return users.find(u => u.id === userId) || { 
      name: 'Unknown User', 
      avatar: `https://ui-avatars.com/api/?name=Unknown+User&background=888888&color=fff` 
    };
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-color)]">
      <ViewportHeader
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
        {/* Navigation Sidebar */}
        <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-[var(--sidebar-projects-bg-color)]">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            customNavItems={customNavItems}
            onCollapseChange={setIsSidebarCollapsed}
          />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex bg-[var(--projects-bg)] overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Channel header */}
            <div className="p-4 border-b border-[var(--sidebar-projects-bg-color)] bg-[var(--bg-color)] flex items-center justify-between">
              <div className="flex items-center">
                {selectedChannel?.channelType === 'PROJECT' ? (
                  <Hash size={18} className="mr-2 text-[var(--features-icon-color)]" />
                ) : (
                  <Users size={18} className="mr-2 text-[var(--features-icon-color)]" />
                )}
                <h2 className="text-lg font-medium text-[var(--features-text-color)]">
                  {selectedChannel?.channelName || 'Select a channel'}
                </h2>
              </div>
              
              <div className="relative">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      className="bg-[var(--bg-color)] border border-[var(--gray-card3)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)] w-48 pl-10 p-2"
                      placeholder="Search in chat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && !messages.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-[var(--features-text-color)] text-center">
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
                  
                </div>
              ) : (
                <>
                  {filteredMessages.map((msg) => {
                    const user = findUserForMessage(msg.senderId);
                    const isCurrentUser = msg.senderId === userId;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                            {user?.avatar ? (
                              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[var(--sidebar-projects-bg-color)] flex items-center justify-center text-[var(--sidebar-projects-color)]">
                                {user?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                        )}
                        <div 
                          className={`max-w-[75%] rounded-lg px-4 py-3 ${
                            isCurrentUser 
                              ? 'bg-[var(--features-icon-color)] text-white rounded-br-none' 
                              : 'bg-[var(--gray-card3)] text-[var(--features-title-color)] rounded-bl-none'
                          }`}
                        >
                          {!isCurrentUser && (
                            <div className="font-medium text-xs mb-1 text-[var(--features-icon-color)]">
                              {msg.senderName || user?.name || 'Unknown User'}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className={`text-[0.65rem] mt-1 ${isCurrentUser ? 'text-white/70' : 'text-[var(--features-text-color)]'}`}>
                            {formatMessageTime(msg.timestamp)}
                          </div>
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
            
            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--gray-card3)] bg-[var(--bg-color)]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 rounded-lg border border-[var(--gray-card3)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] bg-[var(--bg-color)] text-[var(--features-text-color)]"
                  disabled={!selectedChannel}
                />
                <motion.button
                  type="submit"
                  disabled={!message.trim() || !selectedChannel}
                  className={`p-3 rounded-lg ${
                    message.trim() && selectedChannel
                      ? 'bg-[var(--features-icon-color)] text-white hover:bg-[var(--hover-color)]' 
                      : 'bg-[var(--gray-card3)] text-[var(--text-color3)]'
                  } transition-colors disabled:opacity-50`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </form>
          </div>
          
          {/* Chat Channels Sidebar (on the right) */}
          <div className="w-64 bg-[var(--bg-color)] border-l border-[var(--sidebar-projects-bg-color)] flex-shrink-0 flex flex-col">
            <div className="p-4 border-b border-[var(--sidebar-projects-bg-color)]">
              <h2 className="text-lg font-semibold text-[var(--features-text-color)] mb-3 flex items-center">
                <MessageSquare size={18} className="mr-2 text-[var(--features-icon-color)]" />
                Channels
              </h2>
              
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-3 h-3 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="bg-[var(--bg-color)] border border-[var(--gray-card3)] text-[var(--text-color3)] text-xs rounded-lg focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)] block w-full pl-8 p-2"
                  placeholder="Search channels..."
                  value={channelSearchTerm}
                  onChange={(e) => setChannelSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <h3 className="text-xs font-medium text-[var(--features-text-color)]">
                    PROJECT
                  </h3>
                </div>
                {filteredChannels
                  .filter(channel => channel.channelType === 'PROJECT')
                  .map(channel => (
                  <div 
                    key={channel.channelId}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${
                      selectedChannel?.channelId === channel.channelId
                        ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                        : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                    }`}
                  >
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
                
                {filteredChannels
                  .filter(channel => channel.channelType === 'TEAM')
                  .map(channel => (
                  <div 
                    key={channel.channelId}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${
                      selectedChannel?.channelId === channel.channelId
                        ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                        : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                    }`}
                  >
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{channel.channelName}</div>
                      {channel.lastMessageContent && (
                        <div className="text-xs opacity-70 truncate">
                          {channel.lastMessageSender}: {channel.lastMessageContent}
                        </div>
                      )}
                    </div>
                    {channel.unreadCount > 0 && (
                      <div className="bg-[var(--features-icon-color)] text-white text-xs rounded-full w-5 h-5 flex items=center justify-center ml-2">
                        {channel.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChatWrapper;