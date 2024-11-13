import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatList({ chatList, userId, chatId }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Chats
        </h2>

        {/* Grid container for chat cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {chatList.map((chat) => {
            const vendor = chat.users.find((user) => user._id !== userId);
            if (!vendor) return null;

            return (
              <div
                key={chat._id}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-105"
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
  );
}

export default ChatList;
