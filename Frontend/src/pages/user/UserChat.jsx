// // UserChat.jsx (Main Component)
// import { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { MessageCircle, Search, Mail } from "lucide-react";
// import { selectUser } from "../../features/auth/authSlice";
// import axiosInstanceUser from "../../services/axiosInstanceUser";
// import { useSocket } from "../../services/socketProvider";
// import ProfileSidebar from "../../components/ProfileSidebar";

// const UserChat = () => {
//   const [chatList, setChatList] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const messagesContainerRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const user = useSelector(selectUser);
//   const userId = user?.id;
//   const { socket } = useSocket();

//   useEffect(() => {
//     const fetchChatList = async () => {
//       try {
//         const response = await axiosInstanceUser.get(`/chatList/${userId}`);
//         setChatList(response.data);
//       } catch (error) {
//         console.error("Error fetching chat list:", error);
//       }
//     };

//     fetchChatList();
//   }, [userId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (socket && selectedChat) {
//       socket.on("typing", (data) => {
//         if (data.roomId === selectedChat._id && data.role === "Vendor") {
//           setTyping(true);
//           clearTimeout(typingTimeoutRef.current);
//           typingTimeoutRef.current = setTimeout(() => {
//             setTyping(false);
//           }, 2000);
//         }
//       });

//       socket.on("receiveMessage", (newMessage) => {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       });

//       return () => {
//         socket.off("typing");
//         socket.off("receiveMessage");
//         clearTimeout(typingTimeoutRef.current);
//       };
//     }
//   }, [socket, selectedChat]);

//   useEffect(() => {
//     if (socket && selectedChat && messageInput) {
//       socket.emit("typing", {
//         roomId: selectedChat._id,
//         userId,
//         role: "User",
//       });

//       clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit("stop_typing", {
//           roomId: selectedChat._id,
//           userId,
//         });
//       }, 2000);
//     }
//   }, [messageInput, socket, selectedChat, userId]);

//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       const { scrollHeight, clientHeight } = messagesContainerRef.current;
//       messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
//     }
//   };

//   const fetchChatHistory = async (chatId) => {
//     try {
//       const response = await axiosInstanceUser.get(`/chat/${chatId}`);
//       setMessages(response.data.messages);
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     }
//   };
  

//   const formatMessagesByDate = (messages) => {
//     let lastDate = null;

//     return messages.map((msg) => {
//       const currentDate = new Date(msg.timestamp).toLocaleDateString();
//       const isNewDay = currentDate !== lastDate;
//       lastDate = currentDate;

//       return {
//         ...msg,
//         isNewDay,
//       };
//     });
//   };

  


//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     fetchChatHistory(chat._id);

//     if (socket) {
//       socket.emit("join_room", chat._id);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     const trimmedMessage = messageInput.trim();

//     if (trimmedMessage && socket && selectedChat) {
//       const vendor = selectedChat.users.find((user) => user._id !== userId);
//       const messageData = {
//         roomId: selectedChat._id,
//         senderId: userId,
//         recipientId: vendor._id,
//         senderModel: "User",
//         recipientModel: "Vendor",
//         message: trimmedMessage,
//       };

//       // Clear input immediately for better UX
//       setMessageInput("");

//       socket.emit("sendMessage", messageData, (ack) => {
//         if (ack?.success) {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { ...messageData, timestamp: new Date() },
//           ]);
//         } else {
//           console.error("Message not acknowledged by server");
//           setMessageInput(trimmedMessage);
//         }
//       });
//     }
//   };
//   // ChatList.jsx
//   const ChatList = ({
//     chatList,
//     selectedChat,
//     handleChatSelect,
//     searchQuery,
//     setSearchQuery,
//     userId,
//   }) => {
//     const filteredChats = chatList.filter((chat) => {
//       const vendor = chat.users.find((user) => user._id !== userId);
//       return vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
//     });

//     return (
//       <div className="w-full md:w-80 bg-white border-r border-blue-400 flex flex-col h-full">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="overflow-y-auto flex-1">
//           {filteredChats.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-500">
//               <Mail className="h-12 w-12 mb-2" />
//               <p className="text-center">No conversations found</p>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {filteredChats.map((chat) => {
//                 const vendor = chat.users.find((user) => user._id !== userId);
//                 const isSelected = selectedChat?._id === chat._id;

//                 return (
//                   <div
//                     key={chat._id}
//                     className={`flex items-center p-4 cursor-pointer transition-colors
//                     ${
//                       isSelected
//                         ? "bg-blue-50 border-l-4 border-blue-500"
//                         : "hover:bg-gray-50"
//                     }
//                   `}
//                     onClick={() => handleChatSelect(chat)}
//                   >
//                     <div className="relative">
//                       {vendor?.avatar ? (
//                         <img
//                           src={vendor.avatar}
//                           alt={vendor.name || "Vendor"}
//                           className="w-12 h-12 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-2xl">
//                           🧑
//                         </div>
//                       )}
//                       <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
//                     </div>
//                     <div className="ml-4 flex-1 min-w-0">
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-gray-900 truncate">
//                           {vendor?.name || "Vendor"}
//                         </h3>
//                         <span className="text-xs text-gray-500">
//                           {chat.latestMessage &&
//                             new Date(
//                               chat.latestMessage.timestamp
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500 truncate">
//                         {chat.latestMessage?.message || "No messages yet"}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };
//   // ChatMessage.jsx
//   const ChatMessage = ({ message, isUser }) => {
//     return (
//       <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//         <div
//           className={`max-w-xs px-4 py-2 rounded-lg shadow-sm break-words whitespace-normal ${
//             isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//           }`}
//         >
//           <p className="break-words whitespace-pre-wrap">{message.message}</p>
//           <p className="text-xs mt-1 text-right opacity-80">
//             {new Date(message.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </p>
//         </div>
//       </div>
//     );
//   };
//   // MessageInput.jsx
//   const MessageInput = ({
//     messageInput,
//     setMessageInput,
//     handleSendMessage,
//     typing,
//   }) => {
//     const inputRef = useRef(null);

//     useEffect(() => {
//       // Focus input every time the component renders or messageInput changes
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }, [messageInput]);

//     return (
//       <>
//         {typing && (
//           <div className="px-6 py-2 text-sm text-gray-500 italic bg-gray-50">
//             Vendor is typing...
//           </div>
//         )}
//         <form
//           onSubmit={handleSendMessage}
//           className="p-4 border-t border-gray-200 bg-white"
//         >
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               ref={inputRef} // Set ref to input element
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               placeholder="Send a message..."
//               className="flex-1 p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
//               maxLength={1000}
//             />
//             <button
//               type="submit"
//               disabled={!messageInput.trim()}
//               className="p-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
//             >
//               Send
//             </button>
//           </div>
//         </form>
//       </>
//     );
//   };
//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <div className="hidden md:block w-64">
//         <ProfileSidebar />
//       </div>

//       <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
//         <ChatList
//           chatList={chatList}
//           selectedChat={selectedChat}
//           handleChatSelect={handleChatSelect}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           userId={userId}
//         />

//         <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
//           {selectedChat ? (
//             <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
//               <div className="p-4 bg-blue-800 text-white font-semibold text-center">
//                 Chat with{" "}
//                 {selectedChat?.users.find((u) => u._id !== userId)?.name ||
//                   "Vendor"}
//               </div>

//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
//               >
//                 {messages.map((msg, index) => (
//                   <ChatMessage
//                     key={index}
//                     message={msg}
//                     isUser={msg.senderModel === "User"}
//                   />
//                 ))}
//               </div>

//               <MessageInput
//                 messageInput={messageInput}
//                 setMessageInput={setMessageInput}
//                 handleSendMessage={handleSendMessage}
//                 typing={typing}
//               />
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
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

// export default UserChat;




import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, Search, Mail } from "lucide-react";
import { selectUser } from "../../features/auth/authSlice";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSocket } from "../../services/socketProvider";
import ProfileSidebar from "../../components/ProfileSidebar";

const UserChat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const user = useSelector(selectUser);
  const userId = user?.id;
  const { socket } = useSocket();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axiosInstanceUser.get(`/chatList/${userId}`);
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChatList();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.on("typing", (data) => {
        if (data.roomId === selectedChat._id && data.role === "Vendor") {
          const vendor = selectedChat.users.find((user) => user._id !== userId);
          if (vendor) {
            setTyping(`${vendor.name} is typing...`); // Use the vendor's name
          }
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
          }, 2000);
        }
      });

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("typing");
        socket.off("receiveMessage");
        clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (socket && selectedChat && messageInput) {
      socket.emit("typing", {
        roomId: selectedChat._id,
        userId,
        role: "User",
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", {
          roomId: selectedChat._id,
          userId,
        });
      }, 2000);
    }
  }, [messageInput, socket, selectedChat, userId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await axiosInstanceUser.get(`/chat/${chatId}`);
      const formattedMessages = formatMessagesByDate(response.data.messages);
      setMessages(formattedMessages);
      scrollToBottom();
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();

    if (trimmedMessage && socket && selectedChat) {
      const vendor = selectedChat.users.find((user) => user._id !== userId);
      const messageData = {
        roomId: selectedChat._id,
        senderId: userId,
        recipientId: vendor._id,
        senderModel: "User",
        recipientModel: "Vendor",
        message: trimmedMessage,
      };

      setMessageInput("");

      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
          setMessageInput(trimmedMessage);
        }
      });
    }
  };

  const ChatList = ({
    chatList,
    selectedChat,
    handleChatSelect,
    searchQuery,
    setSearchQuery,
    userId,
  }) => {
    const filteredChats = chatList.filter((chat) => {
      const vendor = chat.users.find((user) => user._id !== userId);
      return vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="w-full md:w-80 bg-white border-r border-blue-400 flex flex-col h-full">
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
                const vendor = chat.users.find((user) => user._id !== userId);
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    className={`flex items-center p-4 cursor-pointer transition-colors
                    ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"}`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="relative">
                      {vendor?.avatar ? (
                        <img
                          src={vendor.avatar}
                          alt={vendor.name || "Vendor"}
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
                        <h3 className="font-medium text-gray-900 truncate">{vendor?.name || "Vendor"}</h3>
                        <span className="text-xs text-gray-500">
                          {chat.latestMessage &&
                            new Date(chat.latestMessage.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
    );
  };

  const ChatMessage = ({ message, isUser }) => {
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs px-4 py-2 rounded-lg shadow-sm break-words whitespace-normal ${
            isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          <p>{message.message}</p>
          <p className="text-xs mt-1 text-right opacity-80">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    );
  };

  const MessageInput = ({ messageInput, setMessageInput, handleSendMessage, typing }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [messageInput]);

    return (
      <>
        {typing && (
          <div className="px-6 py-2 text-sm text-gray-500 italic bg-gray-50">
         {typing}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:block w-64">
        <ProfileSidebar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        <ChatList
          chatList={chatList}
          selectedChat={selectedChat}
          handleChatSelect={handleChatSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userId={userId}
        />

        <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
          {selectedChat ? (
            <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
              <div className="p-4 bg-blue-800 text-white font-semibold text-center">
                Chat with{" "}
                {selectedChat?.users.find((u) => u._id !== userId)?.name || "Vendor"}
              </div>

              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                  <>
                    {msg.isNewDay && (
                      <div key={`date-separator-${index}`} className="flex justify-center items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <div className="text-gray-500 text-xs mx-4">{msg.formattedDate}</div>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                    )}
                    <ChatMessage key={index} message={msg} isUser={msg.senderModel === "User"} />
                  </>
                ))}
              </div>

              <MessageInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
                typing={typing}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
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

export default UserChat;

