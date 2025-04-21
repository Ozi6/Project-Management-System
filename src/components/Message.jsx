import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Reply, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CodeSnippet from './CodeSnippet';
import FileAttachment from './FileAttachment';
import PollComponent from './PollComponent';

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
        formatFileSize
    }) =>
    {
        const user = users.find((u) => u.id === msg.senderId) ||
        {
            name: 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=Unknown+User&background=888888&color=fff`,
        };

        const commonEmojis = ['👍', '❤️', '😂', '😊', '🎉', '👏', '🙌', '🔥', '✨', '🚀'];
        const emojiCategories =
        {
            Smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉'],
            Reactions: ['👍', '👎', '❤️', '🔥', '🎉', '👏', '🙌', '💯', '✅', '❌'],
            Objects: ['💻', '📱', '📄', '📌', '⚙️', '🔧', '📦', '📚', '🔍', '🔑'],
        };

        return(
            <div
                key={msg.id}
                onMouseEnter={() => setShowMessageActions(msg.id)}
                onMouseLeave={() => setShowMessageActions(null)}
                className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} relative`}
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
                                    <CodeSnippet language={msg.codeSnippet.language} code={msg.codeSnippet.code} />
                                )}
                                {msg.voiceMessage ? (
                                    <div className="mt-2">
                                        <audio controls className="max-w-full">
                                            <source
                                                src={`data:${msg.voiceMessage.fileType};base64,${msg.voiceMessage.audioData}`}
                                                type={msg.voiceMessage.fileType}/>
                                            Your browser does not support the audio element.
                                        </audio>
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 mt-1">
                                            Voice message ({formatFileSize(msg.voiceMessage.fileSize)})
                                        </div>
                                    </div>
                                ) : msg.attachment && !msg.attachment.type.includes('audio') ? (
                                    <FileAttachment attachment={msg.attachment}/>
                                ) : null}
                                {msg.poll && (
                                    <PollComponent
                                        poll={msg.poll}
                                        messageId={msg.id}
                                        selectedChannel={selectedChannel}
                                        userId={userId}
                                        stompClient={stompClient}
                                        connected={connected}
                                        setMessages={setMessages}/>
                                )}
                                <div
                                    className={`text-[0.65rem] mt-1 flex items-center gap-1 ${isCurrentUser ? 'text-white/70' : 'text-[var(--features-text-color)]'
                                        }`}>
                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
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
                            {Object.entries(msg.reactions || {}).map(
                                ([emoji, count]) =>
                                    count > 0 && (
                                        <div
                                            key={emoji}
                                            className={`rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer ${msg.userReactions?.includes(emoji)
                                                    ? 'bg-[var(--features-icon-color)]/20 border border-[var(--features-icon-color)]'
                                                    : 'bg-[var(--gray-card3)]/50 hover:bg-[var(--gray-card3)]'
                                                }`}
                                            onClick={() =>
                                            {
                                                if(msg.userReactions?.includes(emoji))
                                                    handleRemoveReaction(msg.id, emoji);
                                                else
                                                    handleReactionClick(msg.id, emoji);
                                            }}>
                                            <span>{emoji}</span>
                                            <span className="text-[var(--features-text-color)]">{count}</span>
                                        </div>
                                    )
                            )}
                        </div>
                    )}
                    {showMessageActions === msg.id && (
                        <motion.div
                            ref={messageActionsRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute ${isCurrentUser ? 'right-12' : 'left-12'} top-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-1 flex items-center gap-1 z-10 border border-[var(--gray-card3)]`}
                            onMouseEnter={() => setShowMessageActions(msg.id)}
                            onMouseLeave={() => setShowMessageActions(null)}>
                            <div className="relative">
                                <button
                                    onClick={() => setShowEmojiPicker(msg.id)}
                                    className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                    title="Add reaction">
                                    <Smile size={16}/>
                                </button>
                                {showEmojiPicker === msg.id && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute bottom-full mb-2 right-0 bg-[var(--bg-color)] rounded-lg shadow-lg p-2 w-64 z-20 border border-[var(--gray-card3)]"
                                        onMouseEnter={() => setShowEmojiPicker(msg.id)}
                                        onMouseLeave={() => setShowEmojiPicker(null)}>
                                        <div className="text-xs text-[var(--features-text-color)] opacity-70 mb-2">
                                            Common reactions
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {commonEmojis.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleReactionClick(msg.id, emoji)}
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
                                                        {emojis.map((emoji) => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleReactionClick(msg.id, emoji)}
                                                                className="w-6 h-6 flex items-center justify-center text-sm hover:bg-[var(--sidebar-projects-bg-color)]/20 rounded">
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
                                title="Reply">
                                <Reply size={16}/>
                            </button>
                            {isCurrentUser && (
                                <button
                                    onClick={() => handleEditMessage(msg)}
                                    className="p-1 rounded-full hover:bg-[var(--sidebar-projects-bg-color)]/20 text-[var(--features-text-color)]"
                                    title="Edit">
                                    <Edit size={16}/>
                                </button>
                            )}
                            {isCurrentUser && (
                                <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                    title="Delete">
                                    <Trash2 size={16}/>
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
                {isCurrentUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ml-2">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Your profile" className="w-full h-full object-cover"/>
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