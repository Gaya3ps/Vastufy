import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatList({ chatList, userId, chatId }) {
  const navigate = useNavigate();

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      <h2 className="text-lg font-semibold p-4 bg-blue-600 text-white text-center">Chats</h2>
      <ul className="overflow-y-auto p-4 space-y-4">
        {chatList.map((chat) => {
          const vendor = chat.users.find((user) => user._id !== userId);
          return (
            <li
              key={chat._id}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-all ${chat._id === chatId ? 'bg-blue-200' : ''}`}
              onClick={() => navigate(`/chat/${chat._id}?vendorId=${vendor._id}`)}
            >
              <img src={vendor.avatar || '/default-avatar.png'} alt="Vendor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold text-blue-900">{vendor.name || 'Vendor'}</p>
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
  );
}

export default ChatList;
