import React from "react";
import { useDispatch } from "react-redux";
import {
  FaHome,
  FaPlus,
  FaFileAlt,
  FaComments,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa"; // Importing all icons from react-icons/fa
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearVendor } from "../features/vendor/vendorSlice";
import logo from '../assets/logo3.jpg'


const VendorSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearVendor());
    Cookies.remove("vendortoken");
    navigate("/vendor/login");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#B85042]">

      <div className="flex items-center justify-center mt-8">
        <img
          src={logo}
          alt="Logo"
          className="h-24 w-auto mx-auto mb-3 -translate-x-14"
        />
      </div>

      <nav className="mt-0">
        {/* Dashboard */}
        <Link
          to="/vendor/home"
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaHome className="w-6 h-6 mr-2" />
          Dashboard
        </Link>

        {/* Add New Property */}
        <Link
          to="/vendor/add-property"
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaPlus className="w-6 h-6 mr-2" />
          Add New
        </Link>

        {/* My Properties */}
        <Link
          to="/vendor/propertylist"
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaFileAlt className="w-6 h-6 mr-2" />
          My Properties
        </Link>

        {/* Bookings with FaCalendarAlt Icon */}
        <Link
          to="/vendor/bookings"
          className="flex items-center px-4 py-2 mt-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaCalendarAlt className="w-6 h-6 mr-2" />
          Bookings
        </Link>

        {/* Enquiries */}
        <Link
          to="/vendor/vendorChat"
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaComments className="w-6 h-6 mr-2" />
          Enquiries
        </Link>

        {/* Payment */}
        <Link
          to="/vendor/subscriptions"
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
        >
          <FaCreditCard className="w-6 h-6 mr-2" />
          Subscriptions
        </Link>
      </nav>

      {/* My Profile */}
      <Link
        to="/vendor/profile"
        className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
      >
        <FaUser className="w-6 h-6 mr-2" />
        My Profile
      </Link>

      {/* Thin Line for Separation */}
      <hr className="my-4 border-t border-gray-300" />

      <nav className="mt-1">
        {/* Log Out */}
        <button
          className="flex items-center px-4 py-2 text-white hover:bg-[#8B3D2F] font-bold"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="w-6 h-6 mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default VendorSidebar;
