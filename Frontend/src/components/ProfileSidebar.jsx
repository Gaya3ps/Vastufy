import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaBook, FaLock, FaHeart,FaComments  } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

function ProfileSidebar() {
  const user = useSelector(selectUser);
  const location = useLocation();

  const sidebarItems = [
    { icon: FaUser, label: 'Profile', path: '/profile' },
    { icon: FaBook, label: 'Booking Details', path: '/bookingdetails' },
    { icon: FaLock, label: 'Change Password', path: '/change-password' },
    { icon: FaComments, label: 'Chats', path: '/chatList' }, 
    { icon: FaHeart, label: 'Favorites', path: '#' },
  ];

  return (
    <div className="w-64 fixed top-0 h-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg rounded-r-lg z-10">
      <div className="text-2xl font-semibold text-gray-800 p-6 border-b bg-white shadow-md">
        My Account
      </div>
      <ul className="space-y-2 mt-6 px-4">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <li
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Icon className={`${isActive ? 'text-white' : 'text-blue-500'} mr-3`} />
              <Link 
                to={item.path} 
                className={`font-medium ${isActive ? 'text-white' : 'text-gray-700 hover:text-blue-500'} transition-colors`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProfileSidebar;
