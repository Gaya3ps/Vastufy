// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaUser, FaBook, FaLock, FaHeart, FaPowerOff , FaWallet} from 'react-icons/fa';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../features/auth/authSlice';

// function ProfileSidebar() {
//   const user = useSelector(selectUser)
//   const userId = user.id
//   return (
//     <div className="w-64 bg-[#F8F4EF] flex flex-col justify-between fixed top-0 left-0 h-full shadow-lg">
//       <div>
//         <div className="text-2xl gray-800 font-bold p-4">My Account</div>
//         <ul>
//           <li className="flex items-center p-4 hover:bg-[#eae7e1]">
//             <FaUser className="mr-2 text-[#a39f74]" />
//             <Link to="/profile" className="text-gray-700 hover:text-gray-900">Profile</Link>
//           </li>
//           <li className="flex items-center p-4 hover:bg-[#eae7e1]">
//             <FaBook className="mr-2 text-[#a39f74]" />
//             <Link to="" className="text-gray-700 hover:text-gray-900">Booking Details</Link>
//           </li>
//           <li className="flex items-center p-4 hover:bg-[#eae7e1]">
//             <FaLock className="mr-2 text-[#a39f74]" />
//             <Link to="/change-password" className="text-gray-700 hover:text-gray-900">Change Password</Link>
//           </li>
//           <li className="flex items-center p-4 hover:bg-[#eae7e1]">
//             <FaHeart className="mr-2 text-[#a39f74]" />
//             <Link to="" className="text-gray-700 hover:text-gray-900">Favorites</Link>
//           </li>
//           <li className="flex items-center p-4 hover:bg-[#eae7e1]">
//             <FaWallet className="mr-2 text-[#a39f74]" />
//             <Link to="" className="text-gray-700 hover:text-gray-900">Wallet</Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default ProfileSidebar;



import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBook, FaLock, FaHeart, FaWallet } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

function ProfileSidebar() {
  const user = useSelector(selectUser);

  return (
    <div className="w-64 h-full bg-gray-100 flex flex-col shadow-lg">
      <div className="text-2xl font-semibold text-gray-800 p-4 border-b">
        My Account
      </div>
      <ul className="space-y-1 mt-4">
        <li className="flex items-center p-4 hover:bg-gray-200 transition-colors">
          <FaUser className="mr-2 text-gray-600" />
          <Link to="/profile" className="text-gray-700 hover:text-gray-900">
            Profile
          </Link>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-200 transition-colors">
          <FaBook className="mr-2 text-gray-600" />
          <Link to="#" className="text-gray-700 hover:text-gray-900">
            Booking Details
          </Link>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-200 transition-colors">
          <FaLock className="mr-2 text-gray-600" />
          <Link to="/change-password" className="text-gray-700 hover:text-gray-900">
            Change Password
          </Link>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-200 transition-colors">
          <FaHeart className="mr-2 text-gray-600" />
          <Link to="#" className="text-gray-700 hover:text-gray-900">
            Favorites
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileSidebar;
