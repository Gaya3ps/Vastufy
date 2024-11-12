// import React, { useState } from 'react';
// import PropTypes from 'prop-types';

// function MessageArea({ messages, onSendMessage, recipientName }) {
//   const [newMessage, setNewMessage] = useState('');

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;
//     onSendMessage(newMessage);
//     setNewMessage(''); // Clear input after sending
//   };

//   return (
//     <div className="w-2/3 flex flex-col">
//       {/* Chat Header */}
//       <div className="p-4 bg-green-600 text-white font-semibold text-center">
//         Chat with {recipientName}
//       </div>

//       {/* Message List */}
//       <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex ${msg.senderId === 'you' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${msg.senderId === 'you' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//               <p>{typeof msg.message === 'string' ? msg.message : '[Invalid message]'}</p>
//               <p className="text-xs mt-1 text-right text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 bg-white">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Send a message..."
//           className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
//         />
//         <button type="submit" className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// MessageArea.propTypes = {
//   messages: PropTypes.arrayOf(
//     PropTypes.shape({
//       senderId: PropTypes.string.isRequired,
//       message: PropTypes.string.isRequired,
//       timestamp: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   onSendMessage: PropTypes.func.isRequired,
//   recipientName: PropTypes.string.isRequired,
// };

// export default MessageArea;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MessageArea({ messages, onSendMessage, recipientName }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    onSendMessage(newMessage); // Pass the text to the ChatPage handleSendMessage
    setNewMessage(''); // Clear input after sending
  };
  

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 bg-green-600 text-white font-semibold text-center">
        Chat with {recipientName}
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderModel === 'User' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                msg.senderModel === 'User'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{typeof msg.message === 'string' ? msg.message : '[Invalid message]'}</p>
              <p className="text-xs mt-1 text-right text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
          className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
        />
        <button type="submit" className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600">
          Send
        </button>
      </form>
    </div>
  );
}

MessageArea.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      senderId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      senderModel: PropTypes.string.isRequired, // Ensure senderModel is defined
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  recipientName: PropTypes.string.isRequired,
};

export default MessageArea;

