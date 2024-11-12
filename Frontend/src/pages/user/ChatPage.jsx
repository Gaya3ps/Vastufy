// import React, { useEffect, useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import axiosInstanceUser from '../../services/axiosInstanceUser';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../../features/auth/authSlice';

// const useQuery = () => new URLSearchParams(useLocation().search);

// function ChatPage() {
//   const { chatId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const user = useSelector(selectUser);
//   const query = useQuery();
//   const vendorId = query.get('vendorId');
//   const userId = user.id;

//   // Fetch chat history and chat list
//   useEffect(() => {
//     const fetchChatList = async () => {
//       try {
//         const response = await axiosInstanceUser.get(`/chatList/${userId}`);
//         console.log(response.data, 'Chat list response');

//         setChatList(response.data);
//       } catch (error) {
//         console.error('Error fetching chat list:', error);
//       }
//     };

//     const fetchChatHistory = async () => {
//       try {
//         const response = await axiosInstanceUser.get(`/chat/${chatId}`);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error('Error fetching chat history:', error);
//       }
//     };

//     fetchChatList();
//     if (chatId) fetchChatHistory();
//   }, [chatId]);

//   // Handle sending a new message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       await axiosInstanceUser.post(`/chat/${chatId}/send`, {
//         senderId: user.id,
//         recipientId: vendorId,
//         senderModel: "User",
//         recipientModel: "Vendor",
//         message: newMessage,
//       });

//       setMessages([...messages, { senderId: 'you', message: newMessage, timestamp: new Date() }]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Chat List Sidebar */}
//       <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//         <h2 className="text-lg font-semibold p-4 bg-blue-600 text-white text-center">Chats</h2>
//         <ul className="overflow-y-auto p-4 space-y-4">
//           {chatList.map((chat) => {
//             // Find the vendor within the users array
//             const vendor = chat.users.find(user => user._id !== userId);

//             return (
//               <li
//                 key={chat._id}
//                 className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-all ${chat._id === chatId ? 'bg-blue-200' : ''}`}
//                 onClick={() => window.location.href = `/chat/${chat._id}?vendorId=${vendor._id}`}
//               >
//                 <img src={vendor.avatar || '/default-avatar.png'} alt="Vendor" className="w-10 h-10 rounded-full mr-3" />
//                 <div>
//                   <p className="font-semibold text-blue-900">{vendor.name || 'Vendor'}</p>
//                   <p className="text-xs text-gray-500">
//                     {typeof chat.latestMessage === 'object' && chat.latestMessage !== null
//                       ? chat.latestMessage.message
//                       : 'No messages yet'}
//                   </p>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       {/* Message Area */}
//       <div className="w-2/3 flex flex-col">
//         {/* Chat Header */}
//         <div className="p-4 bg-blue-600 text-white font-semibold text-center">Chat with Vendor {vendorId}</div>

//         {/* Message List */}
//         <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
//           {messages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.senderId === 'you' ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${msg.senderId === 'you' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//                 <p>{typeof msg.message === 'string' ? msg.message : '[Invalid message]'}</p>
//                 <p className="text-xs mt-1 text-right text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-200 bg-white">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Send a message..."
//             className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none"
//           />
//           <button type="submit" className="p-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600">
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;

// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axiosInstanceUser from "../../services/axiosInstanceUser";
// import MessageArea from "../../components/MessageArea";
// import Header from "../../components/Header";
// import ProfileSidebar from "../../components/ProfileSidebar";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../features/auth/authSlice";
// import { io } from "socket.io-client";
// const useQuery = () => new URLSearchParams(useLocation().search);

// function ChatPage() {
//   const { chatId } = useParams();
//   const [messages, setMessages] = useState([]);
//   // Initialize socket connection
//   const [socket, setSocket] = useState(null);
//   const user = useSelector(selectUser);
//   const query = useQuery();
//   const vendorId = query.get("vendorId");
//   const userId = user.id;

//   useEffect(() => {
//     // Connect to the Socket.IO server
//     const newSocket = io("http://localhost:5000"); // Adjust this to your server URL
//     setSocket(newSocket);

//     // Join the room for this chat
//     if (chatId) {
//       newSocket.emit("joinRoom", { roomId: chatId });
//     }

//     // Listen for new messages from the server
//     newSocket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Clean up when the component unmounts
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [chatId]);

//   // Fetch chat history when chatId changes
//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         const response = await axiosInstanceUser.get(`/chat/${chatId}`);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     if (chatId) fetchChatHistory();
//   }, [chatId]);

//   // Handle sending a new message
//   const handleSendMessage = (messageContent) => {
//     const messageData = {
//       roomId: chatId,
//       senderId: userId,
//       recipientId: vendorId,
//       senderModel: "User",
//       recipientModel: "Vendor",
//       message: messageContent,
//     };

//     // Emit the message to the server through Socket.IO
//     socket.emit("message", messageData);

//     // Update the message list optimistically
//     setMessages([
//       ...messages,
//       {
//         senderId: userId,
//         message: messageContent,
//         timestamp: new Date(),
//         senderModel: "User",
//       },
//     ]);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 fixed top-0 left-0 h-full z-10">
//         <ProfileSidebar className="h-full bg-gradient-to-b from-gray-800 to-gray-600 text-white shadow-lg" />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-grow ml-64 h-full">
//         {/* Header */}
//         <div className="flex-none">
//           <Header
//             title="Vastufy"
//             className="bg-blue-600 text-white p-4 shadow-md"
//           />
//         </div>

//         {/* Chat Content */}
//         <div className="flex-grow p-6 overflow-y-auto mt-20">
//           {" "}
//           {/* Adjusted margin-top */}
//           <div className="h-full bg-white rounded-lg shadow-lg flex flex-col justify-between">
//             <MessageArea
//               messages={messages}
//               onSendMessage={handleSendMessage}
//               recipientName={`Vendor ${vendorId}`}
//               className="flex-grow overflow-y-auto"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import MessageArea from "../../components/MessageArea";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/ProfileSidebar";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useSocket } from "../../services/socketProvider";

const useQuery = () => new URLSearchParams(useLocation().search);

function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { socket } = useSocket();
  const user = useSelector(selectUser);
  const query = useQuery();
  const vendorId = query.get("vendorId");
  const userId = user.id;
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  console.log(socket,"jjjjjlllllllllllll");
  

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstanceUser.get(`/chat/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    if (chatId) fetchChatHistory();
  }, [chatId]);

  // Handle receiving messages
  useEffect(() => {
    if (socket) {
      socket.emit("join_room", chatId);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("typing", (data) => {
        if (data.roomId === chatId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      return () => {
        socket.emit("leave_room", chatId);
        socket.off("receiveMessage");
        socket.off("typing");
      };
    }
  }, [socket, chatId]);

  // Handle typing event
  useEffect(() => {
    if (socket && chatId && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: chatId, userId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, chatId, userId]);

  const handleSendMessage = (messageContent) => {
    if (messageContent.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }
  
      const messageData = {
        roomId: chatId,
        senderId: userId,
        recipientId: vendorId,
        senderModel: "User",
        recipientModel: "Vendor",
        message: messageContent, // Use messageContent from MessageArea
      };
  
      console.log("Sending message:", messageData);
  
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
        }
      });
    } else {
      console.error("Message not sent: either socket is disconnected or input is empty.");
    }
  };
  

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <ProfileSidebar className="h-full bg-gradient-to-b from-gray-800 to-gray-600 text-white shadow-lg" />
      </div>

      <div className="flex flex-col flex-grow ml-64 h-full">
        <div className="flex-none">
          <Header
            title="Vastufy"
            className="bg-blue-600 text-white p-4 shadow-md"
          />
        </div>

        <div className="flex-grow p-6 overflow-y-auto mt-20">
          <div className="h-full bg-white rounded-lg shadow-lg flex flex-col justify-between">
            <MessageArea
              messages={messages}
              onSendMessage={handleSendMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              typing={typing}
              recipientName={`Vendor ${vendorId}`}
              className="flex-grow overflow-y-auto"
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
