import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

// Update the ChatBox component props to accept these additional props
const ChatBox = ({ 
  projectId, 
  projectMembers = [], 
  isInitiallyOpen = false,
  inHeader = false,
  onClose = null 
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch messages when component mounts and when projectId changes
  useEffect(() => {
    if (projectId && isOpen) {
      fetchMessages();
    }
  }, [projectId, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Set up polling for new messages
  useEffect(() => {
    if (!projectId || !isOpen) return;
    
    const intervalId = setInterval(() => {
      fetchMessages(false);
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [projectId, isOpen]);

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/messages/project/${projectId}`, {
        withCredentials: true
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(t('chat.error.loading') || 'Failed to load messages');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // Update the sendMessage function to match the new data types
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage = {
      projectId: parseInt(projectId), // Make sure projectId is an integer
      senderId: user.id,              // This should be a string (user_id from Clerk)
      content: message.trim()
    };
    
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/api/messages', newMessage, {
        withCredentials: true
      });
      
      // Add the new message to the list
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(t('chat.error.sending') || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update the toggle function to call onClose when provided
  const toggleChat = () => {
    if (isOpen && onClose) {
      onClose();
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchMessages();
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getMemberName = (userId) => {
    const member = projectMembers.find(m => m.userId === userId);
    return member ? member.username : 'Unknown User';
  };

  // Update the component's JSX to adapt to header mode
  return (
    <div className={`${inHeader ? '' : 'fixed bottom-4 right-4'} z-40`}>
      {/* Only show the toggle button if not in header mode */}
      {!inHeader && (
        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[var(--features-icon-color)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--hover-color)] transition-colors flex items-center justify-center"
        >
          {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </motion.button>
      )}

      {/* Chat box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${inHeader ? 'w-80 sm:w-96' : 'absolute bottom-16 right-0 w-80 sm:w-96'} bg-[var(--bg-color)] rounded-lg shadow-xl border border-[var(--features-icon-color)]/20 overflow-hidden`}
          >
            {/* Chat header with close button */}
            <div className="bg-[var(--features-icon-color)] text-white p-3 flex justify-between items-center">
              <h3 className="font-medium text-sm">
                {t('chat.title')}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    fetchMessages();
                    scrollToBottom();
                  }}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  title={t('chat.refresh') || "Refresh"}
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => scrollToBottom()}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  title={t('chat.scrollDown') || "Scroll to bottom"}
                >
                  <ChevronUp size={16} />
                </button>
                {inHeader && (
                  <button
                    onClick={toggleChat}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    title="Close chat"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-3 bg-[var(--gray-card3)]/20 flex flex-col gap-3"
            >
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[var(--features-text-color)] text-sm">
                  {t('chat.noMessages') || "No messages yet. Start the conversation!"}
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isCurrentUser = msg.senderId === user.id;
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            isCurrentUser 
                              ? 'bg-[var(--features-icon-color)] text-white rounded-br-none' 
                              : 'bg-[var(--gray-card3)] text-[var(--features-title-color)] rounded-bl-none'
                          }`}
                        >
                          {!isCurrentUser && (
                            <div className="font-medium text-xs mb-1 text-[var(--features-icon-color)]">
                              {getMemberName(msg.senderId)}
                            </div>
                          )}
                          <p>{msg.content}</p>
                          <div className={`text-[0.65rem] mt-1 ${isCurrentUser ? 'text-white/70' : 'text-[var(--features-text-color)]'}`}>
                            {formatMessageTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
              
              {error && (
                <div className="bg-red-100 text-red-800 p-2 rounded text-xs text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-[var(--gray-card3)]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('chat.placeholder') || "Type a message..."}
                  className="flex-1 p-2 rounded-lg border border-[var(--gray-card3)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] bg-[var(--bg-color)] text-[var(--features-text-color)]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className={`p-2 rounded-lg ${
                    message.trim() 
                      ? 'bg-[var(--features-icon-color)] text-white hover:bg-[var(--hover-color)]' 
                      : 'bg-[var(--gray-card3)] text-[var(--text-color3)]'
                  } transition-colors disabled:opacity-50`}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;