import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessageArea = ({ 
  messages, 
  onSendMessage, 
  recipientName,
  typing 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  // Format message with proper line breaks
  const formatMessage = (text) => {
    if (!text || typeof text !== 'string') return '[Invalid message]';
    
    // Split long words that exceed 30 characters
    const words = text.split(' ');
    const formattedWords = words.map(word => {
      if (word.length > 30) {
        const chunks = [];
        for (let i = 0; i < word.length; i += 30) {
          chunks.push(word.slice(i, i + 30));
        }
        return chunks.join(' ');
      }
      return word;
    });
    
    return formattedWords.join(' ');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full max-w-full">
      {/* Chat Header */}
      <div className="p-4 bg-green-600 text-white font-semibold text-center">
        Chat with {recipientName}
      </div>

      {/* Message List */}
      <div 
        ref={messageListRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50"
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            {/* Date Separator */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <div className="mx-4 text-sm text-gray-500 bg-gray-50 px-2">
                {date}
              </div>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderModel === 'User' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm overflow-hidden ${
                    msg.senderModel === 'User'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {formatMessage(msg.message)}
                  </p>
                  <p className={`text-xs mt-1 text-right ${
                    msg.senderModel === 'User' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        {/* Invisible div for scrolling reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typing && (
        <div className="px-6 py-2 text-sm text-gray-500 italic bg-gray-50">
          {recipientName} is typing...
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
          className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500"
          maxLength={1000}
        />
        <button 
          type="submit" 
          className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
        >
          Send
        </button>
      </form>
    </div>
  );
};

MessageArea.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      senderId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      senderModel: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  recipientName: PropTypes.string.isRequired,
  typing: PropTypes.bool
};

export default MessageArea;