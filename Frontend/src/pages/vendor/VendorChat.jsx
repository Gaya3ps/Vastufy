// import { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { selectVendor } from "../../features/vendor/vendorSlice";
// import VendorSidebar from "../../components/VendorSidebar";
// import { MessageCircle, Search, Mail } from "lucide-react";
// import axiosInstanceVendor from "../../services/axiosInstanceVendor";
// import { useSocket } from "../../services/socketProvider";

// const VendorChat = () => {
//   const [chatList, setChatList] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [typing, setTyping] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const messagesEndRef = useRef(null);
//   const vendor = useSelector(selectVendor);
//   const vendorId = vendor.id;
//   const { socket } = useSocket();

//   useEffect(() => {
//     const fetchChatList = async () => {
//       try {
//         const response = await axiosInstanceVendor.get(`/chatList/${vendorId}`);
//         setChatList(response.data);
//       } catch (error) {
//         console.error("Error fetching chat list:", error);
//       }
//     };

//     fetchChatList();
//   }, [vendorId]);

//   const fetchChatHistory = async (chatId) => {
//     try {
//       const response = await axiosInstanceVendor.get(`/chats/${chatId}`);
//       setMessages(response.data.messages);
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     }
//   };

//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     fetchChatHistory(chat._id);

//     if (socket) {
//       socket.emit("join_room", chat._id);
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() && socket && selectedChat) {
//       const user = selectedChat.users.find((u) => u._id !== vendorId);
//       const messageData = {
//         roomId: selectedChat._id,
//         senderId: vendorId,
//         recipientId: user._id,
//         senderModel: "Vendor",
//         recipientModel: "User",
//         message: newMessage,
//       };
//       console.log("Sending message:", messageData);
//       setNewMessage("");

//       socket.emit("sendMessage", messageData, (ack) => {
//         if (ack?.success) {
//           console.log("Message successfully sent to server");
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { ...messageData, timestamp: new Date() },
//           ]);
//         } else {
//           console.error("Message not acknowledged by server");
//           setNewMessage(messageData.message);
//         }
//       });
//     }
//   };

//   // Emit typing event with role information
//   useEffect(() => {
//     if (socket && selectedChat && newMessage) {
//       const typingTimeout = setTimeout(() => {
//         socket.emit("typing", {
//           roomId: selectedChat._id,
//           userId: vendorId,
//           role: "Vendor",
//         });
//       }, 500);

//       return () => clearTimeout(typingTimeout);
//     }
//   }, [newMessage, socket, selectedChat, vendorId]);
//   let typingTimeout;
//   useEffect(() => {
//     if (socket && selectedChat) {
//       // Handle receiving new messages
//       socket.on("receiveMessage", (newMessage) => {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       });

//       // Handle typing indicator
//       socket.on("typing", (data) => {
//         console.log("VendorChat received typing event:", data);
//         if (data.roomId === selectedChat._id && data.role === "User") {
//           // Show typing indicator only if the role is User
//           setTyping("User is typing...");

//           // Clear typing indicator after 2 seconds
//           clearTimeout(typingTimeout); // Clear any existing timeout
//           typingTimeout = setTimeout(() => setTyping(""), 2000); // Reset timeout
//         }
//       });

//       return () => {
//         socket.emit("leave_room", selectedChat._id);
//         socket.off("receiveMessage");
//         socket.off("typing");
//         clearTimeout(typingTimeout);
//       };
//     }
//   }, [socket, selectedChat]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const filteredChats = chatList.filter((chat) => {
//     const user = chat.users.find((u) => u._id !== vendorId);
//     return user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <div className="hidden md:block">
//         <VendorSidebar />
//       </div>

//       <div className=" ml-64 flex-1 flex flex-col md:flex-row h-full overflow-hidden">
//         {/* Chat List Panel */}
//         <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Messages
//             </h2>
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search conversations..."
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="overflow-y-auto flex-1">
//             {filteredChats.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                 <Mail className="h-12 w-12 mb-2" />
//                 <p className="text-center">No conversations found</p>
//               </div>
//             ) : (
//               <div className="space-y-1">
//                 {filteredChats.map((chat) => {
//                   const user = chat.users.find((u) => u._id !== vendorId);
//                   const isSelected = selectedChat?._id === chat._id;

//                   return (
//                     <div
//                       key={chat._id}
//                       className={`flex items-center p-4 cursor-pointer transition-colors duration-150
//                         ${
//                           isSelected
//                             ? "bg-green-50 border-l-4 border-green-500"
//                             : "hover:bg-gray-50"
//                         }
//                       `}
//                       onClick={() => handleChatSelect(chat)}
//                     >
//                       <div className="relative">
//                         {user.avatar ? (
//                           <img
//                             src={user.avatar}
//                             alt={user.name}
//                             className="w-12 h-12 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-2xl">
//                             🧑
//                           </div>
//                         )}
//                         <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
//                       </div>
//                       <div className="ml-4 flex-1 min-w-0">
//                         <div className="flex justify-between items-start">
//                           <h3 className="font-medium text-gray-900 truncate">
//                             {user?.name || "User"}
//                           </h3>
//                           <span className="text-xs text-gray-500">
//                             {chat.latestMessage?.timestamp
//                               ? new Date(
//                                   chat.latestMessage.timestamp
//                                 ).toLocaleTimeString([], {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })
//                               : "--:--"}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 truncate">
//                           {chat.latestMessage?.message || "No messages yet"}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Message Area Panel */}
//         <div className="flex-1 flex flex-col bg-gray-50 p-4 overflow-hidden">
//           {selectedChat ? (
//             <div className="h-full bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
//               {/* Message List */}
//               <div className="flex-grow overflow-y-auto p-4 space-y-4">
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       msg.senderId === vendorId
//                         ? "justify-end"
//                         : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-xs px-4 py-2 rounded-lg shadow-sm break-words whitespace-normal ${
//                         msg.senderId === vendorId
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-200 text-gray-800"
//                       }`}
//                     >
//                       <p>{msg.message}</p>
//                       <p className="text-xs mt-1 text-right opacity-80">
//                         {new Date(msg.timestamp).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Typing Indicator */}
//               {typing && (
//                 <div className="text-sm text-gray-500 p-2 italic">{typing}</div>
//               )}

//               {/* Message Input */}
//               <form
//                 onSubmit={handleSendMessage}
//                 className="flex items-center p-4 border-t border-gray-200 bg-white"
//               >
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type your message here..."
//                   className="flex-grow p-3 border border-gray-300 rounded-l-full focus:outline-none"
//                 />
//                 <button
//                   type="submit"
//                   className="p-3 bg-green-500 text-white rounded-r-full"
//                 >
//                   Send
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-center">
//               <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   No conversation selected
//                 </h3>
//                 <p className="text-gray-600">
//                   Choose a conversation from the list to start messaging
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorChat;




import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import VendorSidebar from "../../components/VendorSidebar";
import { MessageCircle, Search, Mail } from "lucide-react";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useSocket } from "../../services/socketProvider";

const VendorChat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;
  const { socket } = useSocket();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/chatList/${vendorId}`);
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChatList();
  }, [vendorId]);

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await axiosInstanceVendor.get(`/chats/${chatId}`);
      const formattedMessages = formatMessagesByDate(response.data.messages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const formatMessagesByDate = (messages) => {
    let lastDate = null;

    return messages.map((msg) => {
      const currentDate = new Date(msg.timestamp).toLocaleDateString();
      const isNewDay = currentDate !== lastDate;
      lastDate = currentDate;

      return {
        ...msg,
        isNewDay,
        formattedDate: new Date(msg.timestamp).toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
    });
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchChatHistory(chat._id);

    if (socket) {
      socket.emit("join_room", chat._id);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && selectedChat) {
      const user = selectedChat.users.find((u) => u._id !== vendorId);
      const messageData = {
        roomId: selectedChat._id,
        senderId: vendorId,
        recipientId: user._id,
        senderModel: "Vendor",
        recipientModel: "User",
        message: newMessage,
      };
      setNewMessage("");

      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
          setNewMessage(messageData.message);
        }
      });
    }
  };

  // Emit typing event with role information
  useEffect(() => {
    if (socket && selectedChat && newMessage) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", {
          roomId: selectedChat._id,
          userId: vendorId,
          role: "Vendor",
        });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [newMessage, socket, selectedChat, vendorId]);

  let typingTimeout;
  useEffect(() => {
    if (socket && selectedChat) {
      // Handle receiving new messages
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // Handle typing indicator
      socket.on("typing", (data) => {
        if (data.roomId === selectedChat._id && data.role === "User") {
          const user = selectedChat.users.find((u) => u._id !== vendorId);
          if (user) {
            setTyping(`${user.name} is typing...`); 
          clearTimeout(typingTimeout); // Clear any existing timeout
          typingTimeout = setTimeout(() => setTyping(""), 2000); // Reset timeout
          }
        }
      });

      return () => {
        socket.emit("leave_room", selectedChat._id);
        socket.off("receiveMessage");
        socket.off("typing");
        clearTimeout(typingTimeout);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredChats = chatList.filter((chat) => {
    const user = chat.users.find((u) => u._id !== vendorId);
    return user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:block">
        <VendorSidebar />
      </div>

      <div className="ml-64 flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {/* Chat List Panel */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Mail className="h-12 w-12 mb-2" />
                <p className="text-center">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => {
                  const user = chat.users.find((u) => u._id !== vendorId);
                  const isSelected = selectedChat?._id === chat._id;

                  return (
                    <div
                      key={chat._id}
                      className={`flex items-center p-4 cursor-pointer transition-colors duration-150
                        ${isSelected ? "bg-green-50 border-l-4 border-blue-500" : "hover:bg-gray-50"}
                      `}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-2xl">
                            🧑
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 truncate">{user?.name || "User"}</h3>
                          <span className="text-xs text-gray-500">
                            {chat.latestMessage?.timestamp
                              ? new Date(chat.latestMessage.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "--:--"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.latestMessage?.message || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message Area Panel */}
        <div className="flex-1 flex flex-col bg-gray-50   h-full overflow-hidden  ">
          {selectedChat ? (
            <div className="h-full bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
             <div className="p-4 bg-blue-800 text-white font-semibold text-center">
                Chat with{" "}
                {selectedChat?.users.find((u) => u._id !== vendorId)?.name || "User"}
              </div>
              {/* Message List */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <>
                    {msg.isNewDay && (
                      <div key={`date-separator-${index}`} className="flex justify-center items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <div className="text-gray-500 text-xs mx-4">{msg.formattedDate}</div>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                    )}
                    <div
                      key={index}
                      className={`flex ${msg.senderId === vendorId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg shadow-sm break-words whitespace-normal ${
                          msg.senderId === vendorId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 text-right opacity-80">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // Ensure 12-hour format
                          })}
                        </p>
                      </div>
                    </div>
                  </>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              {typing && (
                <div className="text-sm text-gray-500 p-2 italic">{typing}</div>
              )}

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                <div className="flex items-center gap-2">  
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
             className="flex-1 p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="p-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  Send
                </button>
                </div> 
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorChat;
