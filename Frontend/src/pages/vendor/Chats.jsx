// import React, { useEffect, useState } from 'react';
// import axiosInstanceVendor from '../../services/axiosInstanceVendor';
// import { useSelector } from 'react-redux';
// import VendorSidebar from '../../components/VendorSidebar';
// import { selectVendor } from '../../features/vendor/vendorSlice';

// function Chats() {
//   const [messages, setMessages] = useState([]);
//   const [chatList, setChatList] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedChatId, setSelectedChatId] = useState(null); // Store selected chat ID
//   const [selectedUserId, setSelectedUserId] = useState(null); // Store selected user ID
//   const vendor = useSelector(selectVendor);
//   const vendorId = vendor.id;

//   // Fetch chat list
//   useEffect(() => {
//     const fetchChatList = async () => {
//       try {
//         const response = await axiosInstanceVendor.get(`/chatList/${vendorId}`);
//         console.log(response.data, 'Vendor chat list response');
//         setChatList(response.data);
//       } catch (error) {
//         console.error('Error fetching chat list:', error);
//       }
//     };

//     fetchChatList();
//   }, [vendorId]);

//   // Fetch chat history
//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       if (!selectedChatId) return; // Don't fetch if no chat is selected

//       try {
//         const response = await axiosInstanceVendor.get(`/chats/${selectedChatId}`);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error('Error fetching chat history:', error);
//       }
//     };

//     fetchChatHistory();
//   }, [selectedChatId]); // Run whenever the selected chat ID changes

//   // Handle selecting a chat
//   const handleChatSelect = (chatId, userId) => {
//     setSelectedChatId(chatId);
//     setSelectedUserId(userId);
//   };

//   // Handle sending a new message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       await axiosInstanceVendor.post(`/chats/${selectedChatId}/send`, {
//         senderId: vendor.id,
//         recipientId: selectedUserId,
//         senderModel: "Vendor",
//         recipientModel: "User",
//         message: newMessage,
//       });

//       setMessages([...messages, { senderId: 'you', message: newMessage, timestamp: new Date() }]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Vendor Sidebar */}
//       <VendorSidebar />

//       {/* Main Chat Container */}
//       <div className="flex-grow flex bg-gray-100">
//         {/* Chat List Sidebar */}
//         <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//           <h2 className="text-lg font-semibold p-4 bg-green-600 text-white text-center">Chats</h2>
//           <ul className="overflow-y-auto p-4 space-y-4">
//             {chatList.map((chat) => {
//               const user = chat.users.find(u => u._id !== vendorId);

//               return (
//                 <li
//                   key={chat._id}
//                   className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-green-100 transition-all ${
//                     chat._id === selectedChatId ? 'bg-green-200' : ''
//                   }`}
//                   onClick={() => handleChatSelect(chat._id, user._id)} // Set selected chat and user
//                 >
//                   <img src={user.avatar || '/default-avatar.png'} alt="User" className="w-10 h-10 rounded-full mr-3" />
//                   <div>
//                     <p className="font-semibold text-green-900">{user.name || 'User'}</p>
//                     <p className="text-xs text-gray-500">
//                       {typeof chat.latestMessage === 'object' && chat.latestMessage !== null
//                         ? chat.latestMessage.message
//                         : 'No messages yet'}
//                     </p>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>













//       </div>
//     </div>
//   );
// }

// export default Chats;




import React, { useEffect, useState } from 'react';
import axiosInstanceVendor from '../../services/axiosInstanceVendor';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VendorSidebar from '../../components/VendorSidebar';
import { selectVendor } from '../../features/vendor/vendorSlice';

function Chats() {
  const [chatList, setChatList] = useState([]);
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;
  const navigate = useNavigate();

  // Fetch chat list
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/chatList/${vendorId}`);
        setChatList(response.data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChatList();
  }, [vendorId]);

  // Navigate to Chat page with selected chat
  const handleChatSelect = (chatId, userId) => {
    navigate(`/vendor/chat?chatId=${chatId}&userId=${userId}`);
  };

  return (
    <div className="flex h-screen">
      <VendorSidebar />

      {/* Main Chat Container */}
      <div className="flex-grow flex bg-gray-100">
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold p-4 bg-green-600 text-white text-center">Chats</h2>
          <ul className="overflow-y-auto p-4 space-y-4">
            {chatList.map((chat) => {
              const user = chat.users.find(u => u._id !== vendorId);

              return (
                <li
                  key={chat._id}
                  className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-green-100"
                  onClick={() => handleChatSelect(chat._id, user._id)}
                >
                  <img src={user.avatar || '/default-avatar.png'} alt="User" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-green-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">
                      {typeof chat.latestMessage === 'object' && chat.latestMessage !== null
                        ? chat.latestMessage.message
                        : 'No messages yet'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chats;
