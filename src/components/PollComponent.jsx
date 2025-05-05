import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const PollComponent = React.memo(
    ({ poll, messageId, selectedChannel, userId, stompClient, connected, setMessages }) =>
    {
        const { getToken } = useAuth();
        const [votedOption, setVotedOption] = useState(null);
        const [percentages, setPercentages] = useState([]);
        const {t} = useTranslation();

        useEffect(() =>
        {
            if(poll && poll.options)
            {
                const newPercentages = poll.options.map((option) =>
                    poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
                );
                setPercentages(newPercentages);
            }
        },[poll]);

        const handleVote = async (optionIndex) =>
        {
            try{
                const optionId = poll.options[optionIndex].id;
                const pollId = poll.id;

                setVotedOption(optionIndex);

                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId
                            ?
                            {
                                ...msg,
                                poll: {
                                    ...msg.poll,
                                    options: msg.poll.options.map((opt, idx) =>
                                        idx === optionIndex ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
                                    ),
                                    totalVotes: (msg.poll.totalVotes || 0) + 1,
                                },
                            }
                            : msg
                    )
                );

                if(stompClient && connected)
                {
                    stompClient.publish({
                        destination: `/app/poll/${selectedChannel.channelId}/vote`,
                        body: JSON.stringify({
                            pollId,
                            optionId,
                            userId,
                        }),
                    });
                }
                else
                {
                    const token = await getToken();
                    await axios.post(
                        `http://localhost:8080/api/polls/${pollId}/vote`,
                        { optionId, userId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }

                setTimeout(() => setVotedOption(null), 700);
            }catch(err){
                console.error('Error voting:', err);
                alert('Failed to vote. You may have already voted or the poll is invalid.');
                setVotedOption(null);
            }
        };

        if(!poll || !poll.options)
            return null;

        return(
            <div className="bg-[var(--gray-card3)]/30 rounded-lg p-3 my-2">
                <div className="font-medium mb-2 text-[var(--features-title-color)]">
                    {poll.question || 'Poll'}
                </div>
                <div className="space-y-2">
                    {poll.options.map((option, index) => {
                        const percentage = percentages[index] || 0;
                        const isVoted = votedOption === index;

                        return(
                            <div key={index} className="relative">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span>{option.optionText || option.text || `Option ${index + 1}`}</span>
                                    <span>
                                        {option.votes || 0} {t("chat.votes")} ({percentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
                                    <motion.div
                                        className="h-2.5 rounded-full"
                                        style={{ backgroundColor: 'var(--features-icon-color)' }}
                                        initial={{ width: '0%' }}
                                        animate={{
                                            width: `${percentage}%`,
                                            boxShadow: isVoted
                                                ? [
                                                    '0 0 0 rgba(0, 0, 0, 0)',
                                                    '0 0 8px 2px rgba(var(--features-icon-rgb), 0.6)',
                                                    '0 0 0 rgba(0, 0, 0, 0)',
                                                ]
                                                : 'none',
                                        }}
                                        transition={{
                                            width: { duration: 0.5, ease: 'easeOut' },
                                            boxShadow: isVoted ? { duration: 0.7, times: [0, 0.5, 1] } : {},
                                        }}/>
                                </div>
                                <button
                                    onClick={() => handleVote(index)}
                                    className="text-xs text-white hover:text-[var(--hover-color)]">
                                    {t("chat.vote")}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3 text-xs text-[var(--features-text-color)]">
                    {t("chat.total")} {poll.totalVotes || 0} {'\u00A0'.repeat(60)}
                </div>
            </div>
        );
    }
);

PollComponent.displayName = 'PollComponent';

export default PollComponent;