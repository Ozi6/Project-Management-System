import React from 'react';
import { motion } from 'framer-motion';
import {
    Smile, ThumbsUp, Heart, Laugh, Frown, Reply, Edit, Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import CodeSnippet from './CodeSnippet';
import FileAttachment from './FileAttachment';
import PollComponent from './PollComponent';
import { useTranslation } from 'react-i18next';

const Message = React.memo(
    ({
        msg,
        userId,
        users,
        isCurrentUser,
        showMessageActions,
        setShowMessageActions,
        handleReactionClick,
        handleRemoveReaction,
        handleEditMessage,
        handleDeleteMessage,
        selectedChannel,
        showEmojiPicker,
        setShowEmojiPicker,
        editingMessage,
        editedContent,
        setEditedContent,
        saveEditedMessage,
        stompClient,
        connected,
        messageActionsRef,
        emojiPickerRef,
        setMessages,
        formatFileSize,
        handleReplyMessage,
        messages
    }) => {
        const {i18n} = useTranslation();
        const {t} = useTranslation();
        const localeMap = {
            en: enUS,
            tr: tr,
            // Add more locales as needed
        };

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

        
        const user = users.find((u) => u.id === msg.senderId) || {
            name: 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=Unknown+User&background=888888&color=fff`,
        };

        // Find the replied message (assuming it's included in messages or fetched)
        const repliedMessage = msg.replyToMessageId
            ? messages.find((m) => m.id === msg.replyToMessageId) // Adjust based on your data structure
            : null;

        const repliedUser = repliedMessage
            ? users.find((u) => u.id === repliedMessage.senderId) || {
                name: 'Unknown User',
            }
            : null;

        return (
            <div
                key={msg.id}
                onMouseEnter={() => setShowMessageActions(msg.id)}
                onMouseLeave={() => setShowMessageActions(null)}
                className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} relative mb-4`}
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
                <div className="flex flex-col max-w-[75%]">
                    <div
                        className={`rounded-lg px-4 py-3 ${isCurrentUser
                                ? 'bg-[var(--features-icon-color)] !text-white rounded-br-none'
                                : 'bg-[var(--gray-card3)] text-[var(--features-title-color)] rounded-bl-none'
                            }`}
                    >
                        {!isCurrentUser && (
                            <div className="font-medium text-xs mb-1 text-[var(--features-icon-color)]">
                                {msg.senderName || user?.name || 'Unknown User'}
                            </div>
                        )}
                        {/* Display Replied Message */}
                        {repliedMessage && (
                            <div className="mb-2 p-2 bg-[var(--gray-card3)]/30 rounded-md border-l-2 border-[var(--features-icon-color)]">
                                <div className="text-xs font-medium text-[var(--features-icon-color)]">
                                    {repliedUser?.name || 'Unknown User'}
                                </div>
                                <p className="text-xs text-[var(--features-text-color)] truncate">
                                    {repliedMessage.content.length > 50
                                        ? `${repliedMessage.content.substring(0, 50)}...`
                                        : repliedMessage.content}
                                </p>
                            </div>
                        )}
                        {editingMessage?.id === msg.id ? (
                            <div className="text-[var(--features-text-color)] bg-[var(--bg-color)] -mx-4 -my-3 p-3 rounded-lg">
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full p-2 border border-[var(--gray-card3)] rounded-md text-[var(--features-text-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--features-icon-color)]"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => setEditingMessage(null)}
                                        className="text-xs mr-2 py-1 px-3 bg-[var(--gray-card3)] text-[var(--features-text-color)] rounded-md hover:bg-[var(--gray-card3)]/80"
                                    >
                                        {t("chat.cancel")}
                                    </button>
                                    <button
                                        onClick={saveEditedMessage}
                                        className="text-xs py-1 px-3 bg-[var(--features-icon-color)] !text-white rounded-md hover:bg-[var(--hover-color)]"
                                    >
                                        {t("chat.save")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                {msg.codeSnippet && (
                                    <CodeSnippet language={msg.codeSnippet.language} code={msg.codeSnippet.code} />
                                )}
                                {msg.voiceMessage && (
                                    <div className="mt-2">
                                        <audio
                                            controls
                                            className="max-w-full"
                                            style={{
                                                background: isCurrentUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <source
                                                src={msg.voiceMessage.audioSrc}
                                                type={msg.voiceMessage.fileType || 'audio/webm'}
                                            />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <div className="text-xs text-white opacity-70 mt-1">
                                        {t("chat.voicemess")} ({formatFileSize(msg.voiceMessage.fileSize)})
                                            {msg.voiceMessage.durationSeconds && (
                                                <span> • {msg.voiceMessage.durationSeconds}s</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {msg.attachment && !msg.attachment.type.includes('audio') && (
                                    <FileAttachment attachment={msg.attachment} />
                                )}
                                {msg.poll && (
                                    <PollComponent
                                        poll={msg.poll}
                                        messageId={msg.id}
                                        selectedChannel={selectedChannel}
                                        userId={userId}
                                        stompClient={stompClient}
                                        connected={connected}
                                        setMessages={setMessages}
                                    />
                                )}
                                 <div
                                    className={`text-[0.65rem] mt-1 flex items-center gap-1 ${isCurrentUser ? 'text-white/70' : 'text-[var(--features-text-color)]'
                                        }`}
                                >
                                    {formatDistanceToNow(new Date(msg.timestamp), {
                                        addSuffix: true,
                                        locale: localeMap[i18n.language] || enUS
                                    })}
                                    {msg.isEdited && (
                                        <>
                                            <span>•</span>
                                            <span className="italic">{t("chat.edited")}</span>
                                        </>
                                    )}
                                    {msg.replyToMessageId && (
                                        <>
                                            <span>•</span>
                                            <span className="italic">{t("chat.replied")}</span>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {Object.keys(msg.reactions || {}).length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(msg.reactions || {}).map(([reactionName, count]) => {
                                const reaction = reactionTypes.find((r) => r.name === reactionName);
                                const emoji = reaction ? reaction.emoji : reactionName;
                                return (
                                    count > 0 && (
                                        <div
                                            key={reactionName}
                                            className={`rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer ${msg.userReactions?.includes(reactionName)
                                                    ? 'bg-[var(--features-icon-color)]/20 border border-[var(--features-icon-color)]'
                                                    : 'bg-[var(--gray-card3)]/50 hover:bg-[var(--gray-card3)]'
                                                }`}
                                            onClick={() => {
                                                if (msg.userReactions?.includes(reactionName))
                                                    handleRemoveReaction(msg.id, reactionName);
                                                else
                                                    handleReactionClick(msg.id, reactionName);
                                            }}
                                        >
                                            <span>{emoji}</span>
                                            <span className="text-[var(--features-text-color)]">{count}</span>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    )}
                    {showEmojiPicker.context === 'message' && showEmojiPicker.messageId === msg.id && (
                        <motion.div
                            ref={emojiPickerRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute ${isCurrentUser ? 'right-12' : 'left-12'} top-8 bg-[var(--bg-color)] rounded-lg shadow-lg p-4 w-80 z-10 border border-[var(--gray-card3)]`}
                        >
                            <div className="text-sm font-medium text-[var(--features-text-color)] mb-2">
                                {t("chat.emoji")}
                            </div>
                            {/* Common Emojis */}
                            <div className="mb-4">
                                <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-1">
                                    {t("chat.common")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {commonEmojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => {
                                                // Map emoji to reaction name for handleReactionClick
                                                const reactionName = reactionTypes.find((r) => r.emoji === emoji)?.name || emoji;
                                                handleReactionClick(msg.id, reactionName);
                                                setShowEmojiPicker({ context: null, messageId: null });
                                            }}
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
                                                onClick={() => {
                                                    // Map emoji to reaction name for handleReactionClick
                                                    const reactionName = reactionTypes.find((r) => r.emoji === emoji)?.name || emoji;
                                                    handleReactionClick(msg.id, reactionName);
                                                    setShowEmojiPicker({ context: null, messageId: null });
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                    {showMessageActions === msg.id && (
                        <motion.div
                            ref={messageActionsRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute ${isCurrentUser ? 'right-12' : 'left-12'} top-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-1 flex items-center gap-1 z-10 border border-[var(--gray-card3)]`}
                        >
                            {/* Existing action buttons */}
                            <button
                                onClick={() => setShowEmojiPicker({ context: 'message', messageId: msg.id })}
                                className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                title="Add reaction">
                                <Smile size={16}/>
                            </button>
                            <button
                                onClick={() => handleReplyMessage(msg)}
                                className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                title="Reply"
                            >
                                <Reply size={16} />
                            </button>
                            {isCurrentUser && (
                                <>
                                    <button
                                        onClick={() => handleEditMessage(msg)}
                                        className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
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
    }
);

Message.displayName = 'Message';

export default Message;