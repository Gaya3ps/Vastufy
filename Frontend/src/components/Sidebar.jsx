import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaStore,
  FaUsers,
  FaChartBar,
  FaAdjust,
  FaServicestack,
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Cookies from "js-cookie";
import { clearAdmin } from "../features/admin/adminslice";
import logo from "../assets/VastufyLogo2.png";

function Sidebar() {
  const [vendorMenuOpen, setVendorMenuOpen] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false); // State for property management dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = Cookies.get("admintoken");
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const toggleVendorMenu = () => {
    setVendorMenuOpen(!vendorMenuOpen);
  };

  const togglePropertyMenu = () => {
    setPropertyMenuOpen(!propertyMenuOpen); // Toggle property management menu
  };

  const adminLogout = () => {
    clearAdmin();
    Cookies.remove("admintoken");
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-[#155e75] shadow-lg z-10 overflow-y-auto">
      {/* Updated background color */}
      <div className="p-6 flex items-center justify-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" /> {/* Added logo */}
      </div>
      <nav className="mt-6">
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#083344]"
          to="/admin/dashboard"
        >
          <FaChartBar className="w-5 h-5" />
          <span className="mx-4 font-medium">Dashboard</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
          to="/admin/userlist"
        >
          <FaUsers className="w-5 h-5" />
          <span className="mx-4 font-medium">Users</span>
        </Link>

        {/* Vendors Section */}
        <div className="mt-2">
          <div
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344] cursor-pointer"
            onClick={toggleVendorMenu}
          >
            <FaStore className="w-5 h-5" />
            <span className="mx-4 font-medium">Vendors</span>
            {vendorMenuOpen ? (
              <MdKeyboardArrowUp className="w-5 h-5 ml-auto" />
            ) : (
              <MdKeyboardArrowDown className="w-5 h-5 ml-auto" />
            )}
          </div>
          {vendorMenuOpen && (
            <div className="ml-8">
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
                to="/admin/vendorlist"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">All Vendors</span>
              </Link>
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
                to="/admin/vendorverify"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">Verification Request</span>
              </Link>
            </div>
          )}
        </div>

        {/* Property Management Section */}
        <div className="mt-2">
          <div
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344] cursor-pointer"
            onClick={togglePropertyMenu}
          >
            <FaServicestack className="w-5 h-5" />
            <span className="mx-4 font-medium">Property Management</span>
            {propertyMenuOpen ? (
              <MdKeyboardArrowUp className="w-5 h-5 ml-auto" />
            ) : (
              <MdKeyboardArrowDown className="w-5 h-5 ml-auto" />
            )}
          </div>
          {propertyMenuOpen && (
            <div className="ml-8">
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
                to="/admin/properties"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">All Properties</span>
              </Link>
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
                to="/admin/propertyverify"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">Property Verification Requests</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
          to="/admin/category"
        >
          <FaUsers className="w-5 h-5" />
          <span className="mx-4 font-medium">Category</span>
        </Link>



    



  {/* Subscription Plans */}
  <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
          to="/admin/subscriptionplans"
        >
          <FaServicestack className="w-5 h-5" />
          <span className="mx-4 font-medium">Subscription Plans</span>
        </Link>



        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-[#083344]"
          to="/admin/login"
          onClick={adminLogout}
        >
          <BiLogOut className="w-5 h-5" />
          <span className="mx-4 font-medium">Logout</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
