// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../assets/VastufyLogo.png'


// const Header = () => {

//   // State to manage dropdown visibility
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);

//   // Toggle functions for dropdowns
//   const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
//   const toggleVendorDropdown = () => setVendorDropdownOpen(!vendorDropdownOpen);



//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-transparent  bg-opacity-70">
//        <nav className="flex justify-center items-center py-4 px-8 space-x-8">
//         {/* Logo */}



//        <div className="flex items-center space-x-8">
//           <Link to="/">
//             <img 
//               src={logo} 
//               alt="Vastufy Logo" 
//               className="h-20 w-auto" // Adjust the size as needed
//             />
//           </Link>
//         </div>


//         {/* Navigation Links */}
//         <ul className="flex space-x-8 text-blue">
//           <li>
//             <Link to="/" className="hover:text-blue-300">Home</Link>
//           </li>
//           <li>
//             <Link to="/properties" className="hover:text-blue-300">Properties</Link>
//           </li>
//           <li>
//             <Link to="/about" className="hover:text-blue-300">About Us</Link>
//           </li>
//           <li>
//             <Link to="/services" className="hover:text-blue-300">Services</Link>
//           </li>
//         </ul>

//         {/* Buttons */}
//         <div className="relative flex space-x-4 ml-8">
//           {/* User Dropdown */}
//           <div className="relative">
//             <button
//               onClick={toggleUserDropdown}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Be a User
//             </button>
//             {userDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
//                 <Link 
//                   to="/login"
//                   className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/signup"
//                   className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Vendor Dropdown */}
//           <div className="relative">
//             <button
//               onClick={toggleVendorDropdown}
//               className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
//             >
//               Be a Vendor
//             </button>
//             {vendorDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
//                 <Link 
//                   to="/login"
//                   className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/signup"
//                   className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaUser } from 'react-icons/fa';
// import { FiLogOut } from 'react-icons/fi';
// import logo from '../assets/VastufyLogo.png'; // Update the path as needed
// import { toast } from 'sonner'; // Make sure to install 'sonner' if not already installed
// import { clearUser, selectUser } from '../features/auth/authSlice';

// const Header = () => {
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);

//   const user = useSelector(selectUser); // Get user from the Redux store
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Toggle functions for dropdowns
//   const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
//   const toggleVendorDropdown = () => setVendorDropdownOpen(!vendorDropdownOpen);

//   // Handle Logout
//   const handleLogout = () => {
//     dispatch(clearUser());
//     navigate('/login');
//     toast.success('User Logout Successful');
//   };

//   // Navigate to Profile Page
//   const handleProfileClick = () => {
//     navigate('/profile');
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-transparent bg-opacity-70">
//       <nav className="flex justify-center items-center py-4 px-8 space-x-8">
//         {/* Logo */}
//         <div className="flex items-center space-x-8">
//           <Link to="/">
//             <img 
//               src={logo} 
//               alt="Vastufy Logo" 
//               className="h-20 w-auto" // Adjust the size as needed
//             />
//           </Link>
//         </div>

//         {/* Navigation Links */}
//         <ul className="flex space-x-8 text-blue">
//           <li>
//             <Link to="/" className="hover:text-blue-300">Home</Link>
//           </li>
//           <li>
//             <Link to="/properties" className="hover:text-blue-300">Properties</Link>
//           </li>
//           <li>
//             <Link to="/about" className="hover:text-blue-300">About Us</Link>
//           </li>
//           <li>
//             <Link to="/services" className="hover:text-blue-300">Services</Link>
//           </li>
//         </ul>

//         {/* User/Vendor or Login/Signup Buttons */}
//         <div className="relative flex space-x-4 ml-8">
//           {user ? (
//             <div className="flex items-center space-x-3 mr-5">
//               {user.picture ? (
//                 <img
//                   src={user.picture}
//                   alt="User profile"
//                   className="h-10 w-10 rounded-full cursor-pointer"
//                   onClick={handleProfileClick}
//                 />
//               ) : (
//                 <FaUser
//                   size={24}
//                   onClick={handleProfileClick}
//                   className="text-gray-700 cursor-pointer"
//                 />
//               )}
//               <span className="text-gray-700 font-medium cursor-pointer" onClick={handleProfileClick}>
//                 {user.name || 'Guest'}
//               </span>
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: 'black',
//                 }}
//                 onClick={handleLogout}
//               >
//                 <FiLogOut size={18} />
//               </button>
//             </div>
//           ) : (
//             <>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                 onClick={() => navigate('/login')}
//               >
//                 Login
//               </button>
//               <button
//                 className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
//                 onClick={() => navigate('/signup')}
//               >
//                 Sign Up
//               </button>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import logo from  '../assets/VastufyLogo2.png'
import { toast } from 'sonner'; // Make sure to install 'sonner' if not already installed
import { clearUser, selectUser } from '../features/auth/authSlice';

const Header = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);

  const user = useSelector(selectUser); // Get user from the Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle functions for dropdowns
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleVendorDropdown = () => setVendorDropdownOpen(!vendorDropdownOpen);

  // Handle Logout
  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
    toast.success('User Logout Successful');
  };

  // Navigate to Profile Page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent bg-opacity-70">
      <nav className="flex justify-center items-center py-4 px-8 space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img 
              src={logo} 
              alt="Vastufy Logo" 
              className="h-20 w-auto" // Adjust the size as needed
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-blue">
          <li>
            <Link to="/home" className="text-white hover:text-blue-300">Home</Link>
          </li>
          <li>
            <Link to="/properties" className="text-white hover:text-blue-300">Properties</Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-blue-300">About Us</Link>
          </li>
          <li>
            <Link to="/services" className="text-white hover:text-blue-300">Services</Link>
          </li>
        </ul>

        {/* User/Vendor Dropdowns or User Profile */}
        <div className="absolute right-0 flex items-center space-x-4 ">
          {user ? (
            <div className="flex items-center space-x-3 mr-5">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt="User profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
              ) : (
                <FaUser
                  size={24}
                  onClick={handleProfileClick}
                  className="text-white cursor-pointer"
                />
              )}
              <span className="text-white font-medium cursor-pointer" onClick={handleProfileClick}>
                {user.name || 'Guest'}
              </span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'red',
                }}
                onClick={handleLogout}
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="w-36 bg-blue-500 text-white px-4 py-2 text-center rounded-lg hover:bg-blue-600"
                >
                  Be a User
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Link 
                      to="/login"
                      className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup"
                      className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Vendor Dropdown */}
              <div className="relative pr-10">
                <button
                  onClick={toggleVendorDropdown}
                  className="w-36 bg-yellow-500 text-white px-4 py-2 text-center rounded-lg hover:bg-yellow-600"
                >
                  Be a Vendor
                </button>
                {vendorDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Link 
                      to="/vendor/login"
                      className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/vendor/signup"
                      className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
