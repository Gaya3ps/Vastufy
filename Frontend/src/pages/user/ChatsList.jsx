import React, { useEffect, useState } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import ChatList from '../../components/ChatList'; 

function ChatsList() {
  const [chatList, setChatList] = useState([]);
  const user = useSelector(selectUser);
  const userId = user.id;

  // Function to fetch the chat list
  const fetchChatList = async () => {
    try {
      const response = await axiosInstanceUser.get(`/chatList/${userId}`);
      console.log(response.data, 'Fetched Chat List');
      setChatList(response.data);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };

  // Fetch chat list on component mount
  useEffect(() => {
    fetchChatList();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Pass chatList and userId to the ChatList component */}
      <ChatList chatList={chatList} userId={userId} />
    </div>
  );
}

export default ChatsList;



// import React from 'react'

// function ChatsList() {
//   return (
//     <div>
//       hy chatssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss here
//     </div>
//   )
// }

// export default ChatsList
