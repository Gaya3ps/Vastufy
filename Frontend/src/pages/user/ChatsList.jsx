// import React, { useEffect, useState } from 'react';
// import axiosInstanceUser from '../../services/axiosInstanceUser';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../../features/auth/authSlice';
// import ChatList from '../../components/ChatList'; 

// function ChatsList() {
//   const [chatList, setChatList] = useState([]);
//   const user = useSelector(selectUser);
//   const userId = user.id;

//   // Function to fetch the chat list
//   const fetchChatList = async () => {
//     try {
//       const response = await axiosInstanceUser.get(`/chatList/${userId}`);
//       console.log(response.data, 'Fetched Chat List');
//       setChatList(response.data);
//     } catch (error) {
//       console.error('Error fetching chat list:', error);
//     }
//   };

//   // Fetch chat list on component mount
//   useEffect(() => {
//     fetchChatList();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Pass chatList and userId to the ChatList component */}
//       <ChatList chatList={chatList} userId={userId} />
//     </div>
//   );
// }

// export default ChatsList;









import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import ProfileSidebar from '../../components/ProfileSidebar';
import Header from '../../components/Header';

function ChatsList() {
  const [chatList, setChatList] = useState([]);
  const user = useSelector(selectUser);
  const userId = user.id;
  const navigate = useNavigate();

  // Fetch chat list on component mount
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axiosInstanceUser.get(`/chatList/${userId}`);
        console.log(response.data, 'Fetched Chat List');
        setChatList(response.data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };
    fetchChatList();
  }, [userId]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-gray-200">
      {/* Header */}
      <Header title="Chats" className="bg-blue-600 text-white py-4 px-8 shadow-md " />

      {/* Main Content */}
      <div className="flex flex-grow mt-8">
        {/* Sidebar */}
        <div className="w-64">
          <ProfileSidebar />
        </div>

        {/* Chat Section */}
        <div className="flex flex-col flex-grow h-full p-8 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-12 text-center">Chats</h2>

          {/* Chat Grid with spacing adjustment */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {chatList.map((chat) => {
              const vendor = chat.users.find((user) => user._id !== userId);
              if (!vendor) return null;

              return (
                <div
                  key={chat._id}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105"
                  onClick={() => navigate(`/chat/${chat._id}?vendorId=${vendor._id}`)}
                >
                  {/* Profile Image */}
                  <div className="flex items-center mb-4">
                    <img
                      src={vendor.avatar || '/default-avatar.png'}
                      alt="Vendor"
                      className="w-14 h-14 rounded-full border border-gray-300 mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {vendor.name || 'Vendor'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {chat.latestMessage?.message || 'No messages yet'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="text-sm text-gray-500 mt-2">
                    <p>{vendor.role || 'Vendor Role'}</p>
                    <p>{vendor.location || 'Location'}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="mt-4 text-right text-xs text-gray-400">
                    {chat.latestMessage &&
                      new Date(chat.latestMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatsList;
