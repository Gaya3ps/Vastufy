// import React from 'react'

// function Chat() {
//   return (
//     <div>
//                 {/* Message Area */}
//                 <div className="w-2/3 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 bg-green-600 text-white font-semibold text-center">
//             {selectedUserId ? `Chat with User ${selectedUserId}` : 'Select a chat to view messages'}
//           </div>

//           {/* Message List */}
//           <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div key={index} className={`flex ${msg.senderId === 'you' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${msg.senderId === 'you' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//                   <p>{typeof msg.message === 'string' ? msg.message : '[Invalid message]'}</p>
//                   <p className="text-xs mt-1 text-right text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           {selectedChatId && (
//             <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 bg-white">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Send a message..."
//                 className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
//               />
//               <button type="submit" className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600">
//                 Send
//               </button>
//             </form>
//           )}
//         </div>

//     </div>
//   )
// }

// export default Chat

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axiosInstanceVendor from "../../services/axiosInstanceVendor";
// import { useSelector } from "react-redux";
// import { selectVendor } from "../../features/vendor/vendorSlice";
// import { io } from "socket.io-client";

// function Chat() {
//   const location = useLocation();
//   const chatId = new URLSearchParams(location.search).get("chatId");
//   const userId = new URLSearchParams(location.search).get("userId");
//   const vendor = useSelector(selectVendor);
//   const vendorId = vendor.id;

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [socket, setSocket] = useState(null);

//   // Initialize Socket.IO connection and join room
//   useEffect(() => {
//     const newSocket = io("http://localhost:5000"); // Replace with your server URL
//     setSocket(newSocket);

//     // Join the room specific to this chat
//     if (chatId) {
//       newSocket.emit("joinRoom", { roomId: chatId });
//     }

//     // Listen for incoming messages from the server
//     newSocket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Clean up on component unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [chatId]);

//   // Fetch chat history
//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       if (!chatId) return;

//       try {
//         const response = await axiosInstanceVendor.get(`/chats/${chatId}`);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchChatHistory();
//   }, [chatId]);

//   // Vendor's Chat component (only the `handleSendMessage` function updated)
// const handleSendMessage = async (e) => {
//   e.preventDefault();
//   if (!newMessage.trim()) return;

//   const messageData = {
//     roomId: chatId,
//     senderId: vendorId,
//     recipientId: userId,
//     senderModel: "Vendor",
//     recipientModel: "User",
//     message: newMessage,
//   };

//   try {
//     // Save message to the database via API
//     await axiosInstanceVendor.post(`/chats/${chatId}/send`, messageData);

//     // Emit the message to the server through Socket.IO
//     socket.emit("message", messageData);

//     // Optimistically update message list
//     setMessages([
//       ...messages,
//       {
//         senderId: vendorId,
//         message: newMessage,
//         timestamp: new Date(),
//         senderModel: "Vendor",
//       },
//     ]);
//     setNewMessage("");
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

//   return (
//     <div className="flex flex-col h-screen w-full p-4 bg-gray-50">
//       {/* Chat Header */}
//       <div className="p-4 bg-green-600 text-white font-semibold text-center">
//         Chat with User {userId}
//       </div>

//       {/* Message List */}
//       <div className="flex-grow overflow-y-auto p-6 space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.senderId === vendorId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
//                 msg.senderId === vendorId
//                   ? "bg-green-500 text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//             >
//               <p>{msg.message}</p>
//               <p className="text-xs mt-1 text-right text-gray-400">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <form
//         onSubmit={handleSendMessage}
//         className="flex items-center p-4 border-t border-gray-200 bg-white"
//       >
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Send a message..."
//           className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Chat;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import { useSocket } from "../../services/socketProvider";

function Chat() {
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chatId");
  const userId = new URLSearchParams(location.search).get("userId");
  const { socket } = useSocket();

  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false); // add typing state

  // Fetch chat history when the chatId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!chatId) return;
      try {
        const response = await axiosInstanceVendor.get(`/chats/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, [chatId]);

  // Handle receiving messages and typing events
  useEffect(() => {
    if (socket && chatId) {
      // Join the room
      socket.emit("join_room", chatId);

      // Listen for incoming messages
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // Listen for typing indicator
      socket.on("typing", (data) => {
        if (data.roomId === chatId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      // Cleanup on component unmount
      return () => {
        socket.emit("leave_room", chatId);
        socket.off("receiveMessage");
        socket.off("typing");
      };
    }
  }, [socket, chatId]);

  // Handle typing event
  useEffect(() => {
    if (socket && chatId && newMessage) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: chatId, userId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [newMessage, socket, chatId, userId]);

  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    if (newMessage.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }

      const messageData = {
        roomId: chatId,
        senderId: vendorId,
        recipientId: userId,
        senderModel: "Vendor",
        recipientModel: "User",
        message: newMessage,
      };

      console.log("Sending message:", messageData);

      // Clear the input immediately after attempting to send
      setNewMessage("");

      // Emit the message to the server
      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          console.log("Message successfully sent to server");
          // Optimistically update the UI
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
          // Optionally reset the message input if you want to retry sending
          setNewMessage(messageData.message);
        }
      });
    } else {
      console.error(
        "Message not sent: either socket is disconnected or input is empty."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-green-600 text-white font-semibold text-center">
        Chat with User {userId}
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === vendorId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                msg.senderId === vendorId
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs mt-1 text-right text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typing && <p className="text-sm text-gray-500 p-2">User is typing...</p>}

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-4 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
          className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
        />
        <button
          type="submit"
          className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
