import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import logo from '../assets/VastufyLogo2.png';
import { clearUser, selectUser } from '../features/auth/authSlice';
import { toast } from 'sonner';

const Header = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const vendorDropdownRef = useRef(null);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleVendorDropdown = () => setVendorDropdownOpen(!vendorDropdownOpen);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
    toast.success('User Logout Successful');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const gradientStyle = {
    backgroundImage: 'linear-gradient(to right, #000046 0%, #1CB5E0 51%, #000046 100%)',
    backgroundSize: '200% auto',
    transition: '0.5s',
    color: 'white',
    padding: '10px 25px',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    width: '140px',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        vendorDropdownRef.current &&
        !vendorDropdownRef.current.contains(event.target)
      ) {
        setVendorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="max-w-4xl mx-auto bg-white shadow-lg py-3 px-8 rounded-lg mt-4">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center w-full space-x-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Vastufy Logo" className="h-14 w-auto" />
            </Link>
            <ul className="flex space-x-4 text-gray-800 font-medium">
              <li className="hover:text-blue-500 transition duration-300">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:text-blue-500 transition duration-300">
                <Link to="/properties">Properties</Link>
              </li>
              <li className="hover:text-blue-500 transition duration-300">
                <Link to="/aboutus">About Us</Link>
              </li>
              <li className="hover:text-blue-500 transition duration-300">
                <Link to="/services">Services</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2 text-gray-700">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="User profile"
                    className="h-10 w-10 rounded-full cursor-pointer hover:shadow-lg"
                    onClick={handleProfileClick}
                  />
                ) : (
                  <FaUserCircle
                    size={28}
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:text-blue-500"
                  />
                )}
                <span
                  className="cursor-pointer font-bold hover:text-blue-500"
                  onClick={handleProfileClick}
                >
                  {user.name || 'Guest'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-black hover:text-gray-600 transition duration-300"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out whitespace-nowrap"
                    style={gradientStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundPosition = 'right center')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundPosition = 'left center')
                    }
                  >
                    Be a User
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out">
                      <Link
                        to="/login"
                        className="block px-6 py-3 font-bold text-gray-800 text-lg hover:bg-blue-50 hover:text-blue-600 transition duration-200 rounded-t-lg"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-6 py-3 font-bold text-gray-800 text-lg hover:bg-blue-50 hover:text-blue-600 transition duration-200 rounded-b-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative" ref={vendorDropdownRef}>
                  <button
                    onClick={toggleVendorDropdown}
                    className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out whitespace-nowrap"
                    style={gradientStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundPosition = 'right center')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundPosition = 'left center')
                    }
                  >
                    Be a Vendor
                  </button>
                  {vendorDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out">
                      <Link
                        to="/vendor/login"
                        className="block px-6 py-3 font-bold text-gray-800 text-lg hover:bg-blue-50 hover:text-blue-600 transition duration-200 rounded-t-lg"
                      >
                        Login
                      </Link>
                      <Link
                        to="/vendor/signup"
                        className="block px-6 py-3 font-bold text-gray-800 text-lg hover:bg-blue-50 hover:text-blue-600 transition duration-200 rounded-b-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
