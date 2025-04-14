import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, Search, ArrowLeft, Users, Hash, MessageSquare, 
  PlusCircle, X, MessageCircle, Settings, Layout, Activity, KanbanSquare, UsersIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next'; // Add this import
import ViewportHeader from "../components/ViewportHeader";
import Sidebar from "../components/Sidebar";
import { SearchProvider } from '../scripts/SearchContext';

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
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelSearchTerm, setChannelSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({ id: 1, name: 'General', type: 'PROJECT' });
  const {t} = useTranslation();
  // Add near the top of your component with other state variables
  const [isOwner, setIsOwner] = useState(false);
  // Demo data
  const projectName = "Project Management System";
  
  const demoChannels = [
    { id: 1, name: 'General', type: 'PROJECT', unreadCount: 0, lastMessageContent: 'Welcome to the project chat!', lastMessageSender: 'John Doe' },
    { id: 2, name: 'Announcements', type: 'PROJECT', unreadCount: 3, lastMessageContent: 'Team meeting tomorrow at 10 AM', lastMessageSender: 'Project Manager' },
    { id: 3, name: 'Development Team', type: 'TEAM', unreadCount: 0, lastMessageContent: 'I pushed the latest changes', lastMessageSender: 'Developer' },
    { id: 4, name: 'Design Team', type: 'TEAM', unreadCount: 5, lastMessageContent: 'New mockups are ready for review', lastMessageSender: 'UI Designer' },
    { id: 5, name: 'QA Team', type: 'TEAM', unreadCount: 0, lastMessageContent: 'Found a bug in the login flow', lastMessageSender: 'QA Engineer' },
    { id: 6, name: 'Marketing', type: 'TEAM', unreadCount: 2, lastMessageContent: 'Launch campaign is scheduled for next week', lastMessageSender: 'Marketing Lead' },
  ];
  
  const demoUsers = [
    { id: 'user1', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff' },
    { id: 'user2', name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF5733&color=fff' },
    { id: 'user3', name: 'Robert Johnson', avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=27AE60&color=fff' },
    { id: 'user4', name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=8E44AD&color=fff' },
    { id: 'user5', name: 'Michael Wilson', avatar: 'https://ui-avatars.com/api/?name=Michael+Wilson&background=F39C12&color=fff' },
  ];
  
  const generateDemoMessages = (channelId) => {
    // Different messages for different channels
    const baseMessages = [
      { id: 1, content: "Hello everyone! Welcome to the channel.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 5) },
      { id: 2, content: "Thanks for the welcome! Excited to collaborate here.", senderId: 'user2', timestamp: new Date(Date.now() - 86400000 * 5 + 3600000) },
      { id: 3, content: "I've shared the project requirements in the documents section.", senderId: 'user3', timestamp: new Date(Date.now() - 86400000 * 4) },
      { id: 4, content: "Has anyone started working on the wireframes yet?", senderId: 'user4', timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: 5, content: "I'll be working on them today. Should have something to share by tomorrow.", senderId: 'user5', timestamp: new Date(Date.now() - 86400000 * 3 + 1800000) },
      { id: 6, content: "Great! Looking forward to seeing them.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000) },
      { id: 7, content: "I've encountered an issue with the database connection. Anyone available to help?", senderId: 'user3', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: 8, content: "What specific error are you getting? I might be able to help.", senderId: 'user2', timestamp: new Date(Date.now() - 86400000 * 2 + 900000) },
      { id: 9, content: "It's saying 'Connection refused'. I've checked the credentials and they seem correct.", senderId: 'user3', timestamp: new Date(Date.now() - 86400000 * 2 + 1800000) },
      { id: 10, content: "Make sure the database server is running and the port is correct. Also check if there's a firewall blocking the connection.", senderId: 'user2', timestamp: new Date(Date.now() - 86400000 * 2 + 2700000) },
      { id: 11, content: "That worked! Thanks for the help.", senderId: 'user3', timestamp: new Date(Date.now() - 86400000 * 2 + 3600000) },
      { id: 12, content: "Weekly progress update: We're on track with most tasks, but we might need to extend the deadline for the API integration.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 1) },
      { id: 13, content: "I agree. The third-party API documentation is not as comprehensive as we expected.", senderId: 'user4', timestamp: new Date(Date.now() - 86400000 * 1 + 1800000) },
      { id: 14, content: "Let's discuss this in tomorrow's meeting and adjust the timeline accordingly.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 1 + 3600000) },
      { id: 15, content: "Sounds good. I'll prepare a brief report on the challenges we're facing.", senderId: 'user4', timestamp: new Date(Date.now() - 86400000 * 1 + 5400000) },
      { id: 16, content: "I've pushed the latest UI changes to the repository. Please pull and test when you get a chance.", senderId: 'user5', timestamp: new Date(Date.now() - 3600000) },
      { id: 17, content: "Will do! I'll review it this afternoon.", senderId: 'user2', timestamp: new Date(Date.now() - 1800000) },
      { id: 18, content: "Don't forget about the client demo next week. We need to make sure everything is stable by then.", senderId: 'user1', timestamp: new Date() }
    ];
    
    // Add some channel-specific messages
    if (channelId === 1) { // General
      baseMessages.push({ id: 101, content: "Welcome to the General channel! This is where we discuss overall project coordination.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 7) });
    } else if (channelId === 2) { // Announcements
      baseMessages.push({ id: 102, content: "ANNOUNCEMENT: The new project timeline has been approved. Please check your email for details.", senderId: 'user1', timestamp: new Date(Date.now() - 86400000 * 6) });
      baseMessages.push({ id: 103, content: "REMINDER: Team meeting tomorrow at 10 AM. We'll be discussing the upcoming sprint.", senderId: 'user1', timestamp: new Date(Date.now() - 3600000 * 12) });
    } else if (channelId === 3) { // Development Team
      baseMessages.push({ id: 104, content: "Has anyone experienced issues with the new version of the framework?", senderId: 'user3', timestamp: new Date(Date.now() - 86400000 * 4) });
      baseMessages.push({ id: 105, content: "I've pushed the latest changes to the repo. Please review the PR when you get a chance.", senderId: 'user2', timestamp: new Date(Date.now() - 3600000 * 5) });
    } else if (channelId === 4) { // Design Team
      baseMessages.push({ id: 106, content: "The new mockups are ready for review in Figma.", senderId: 'user5', timestamp: new Date(Date.now() - 86400000 * 3) });
      baseMessages.push({ id: 107, content: "I've updated the color palette based on client feedback. What do you think?", senderId: 'user5', timestamp: new Date(Date.now() - 3600000 * 8) });
    }
    
    return baseMessages.sort((a, b) => a.timestamp - b.timestamp);
  };
  
  const [demoMessages] = useState(generateDemoMessages(selectedChannel.id));
  
  const filteredMessages = searchTerm 
    ? demoMessages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demoUsers.find(u => u.id === msg.senderId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : demoMessages;
    
  const filteredChannels = channelSearchTerm
    ? demoChannels.filter(channel => 
        channel.name.toLowerCase().includes(channelSearchTerm.toLowerCase())
      )
    : demoChannels;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, this would call an API
    // For demo purposes, we just clear the input
    setMessage('');
    alert(`Message sent: ${message}`);
  };
  
  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
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
                {selectedChannel.type === 'PROJECT' ? (
                  <Hash size={18} className="mr-2 text-[var(--features-icon-color)]" />
                ) : (
                  <Users size={18} className="mr-2 text-[var(--features-icon-color)]" />
                )}
                <h2 className="text-lg font-medium text-[var(--features-text-color)]">
                  {selectedChannel.name}
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
              {filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full flex-col">
                  <MessageSquare size={40} className="text-[var(--features-icon-color)] mb-4" />
                  <div className="text-[var(--features-text-color)] text-center">
                    {searchTerm 
                      ? "No messages match your search" 
                      : "No messages yet. Start the conversation!"}
                  </div>
                </div>
              ) : (
                <>
                  {filteredMessages.map((msg) => {
                    const user = demoUsers.find(u => u.id === msg.senderId);
                    const isCurrentUser = msg.senderId === 'user1'; // Assume user1 is current user
                    
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
                              {user?.name || 'Unknown User'}
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
                />
                <motion.button
                  type="submit"
                  disabled={!message.trim()}
                  className={`p-3 rounded-lg ${
                    message.trim() 
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
                  <button className="p-1 rounded-md hover:bg-[var(--gray-card3)]/50 text-[var(--features-icon-color)]">
                    <PlusCircle size={14} />
                  </button>
                </div>
                {filteredChannels
                  .filter(channel => channel.type === 'PROJECT')
                  .map(channel => (
                  <div 
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${
                      selectedChannel.id === channel.id
                        ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                        : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                    }`}
                  >
                    <Hash size={16} className="mr-2 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{channel.name}</div>
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
                  <button className="p-1 rounded-md hover:bg-[var(--gray-card3)]/50 text-[var(--features-icon-color)]">
                    <PlusCircle size={14} />
                  </button>
                </div>
                
                {filteredChannels
                  .filter(channel => channel.type === 'TEAM')
                  .map(channel => (
                  <div 
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center px-4 py-2 rounded-md cursor-pointer mb-1 ${
                      selectedChannel.id === channel.id
                        ? 'bg-[var(--sidebar-projects-bg-color)] text-[var(--sidebar-projects-color)]'
                        : 'hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-title-color)]'
                    }`}
                  >
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{channel.name}</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChatWrapper;