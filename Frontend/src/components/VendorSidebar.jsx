import React from 'react';
import {useDispatch} from 'react-redux'
import { HomeIcon, PlusIcon, DocumentTextIcon, ChatBubbleBottomCenterTextIcon, CreditCardIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { clearVendor } from '../features/vendor/vendorSlice' ;
import logo from '../assets/VastufyLogo2.png'

const VendorSidebar = () => {


  const navigate = useNavigate();
  const dispatch = useDispatch()
  

  const handleLogout = () => {
    dispatch(clearVendor())
    Cookies.remove('vendortoken'); // Remove vendor token cookie
    navigate('/vendor/login'); // Redirect to vendor login page
  };

  return (
    <div className="h-screen w-64 bg-white border-r">
      <div className="flex items-center justify-center mt-8">
        <img src={logo} alt="Logo" className="h-28 w-auto mx-auto mb-3 -translate-x-14" />
      </div>
      
      <nav className="mt-0">
        {/* Dashboard */}
        <Link to="/vendor/home" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <HomeIcon className="w-6 h-6 mr-2" />
          Dashboard
        </Link>
        
        {/* Add New Property */}
        <Link to="/vendor/add-property" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <PlusIcon className="w-6 h-6 mr-2" />
          Add New
        </Link>

        {/* My Properties */}
        <Link to="/vendor/propertylist" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <DocumentTextIcon className="w-6 h-6 mr-2" />
          My Properties
        </Link>

        {/* Enquiries */}
        <Link to="/vendor/enquiries" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <ChatBubbleBottomCenterTextIcon className="w-6 h-6 mr-2" />
          Enquiries
        </Link>

        {/* Payment */}
        <Link to="/vendor/payment" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <CreditCardIcon className="w-6 h-6 mr-2" />
          Payment
        </Link>
      </nav>
     
        {/* My Profile */}
        <Link to="/vendor/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <UserIcon className="w-6 h-6 mr-2" />
          My Profile
        </Link>

 {/* Thin Line for Separation */}
 <hr className="my-4 border-t border-gray-300" />


        <nav className="mt-1">
        {/* Log Out */}
        <button
  className=" flex items-center  px-4 py-2 text-gray-700 hover:bg-gray-200"
  onClick={handleLogout}
>
  <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-2" />
  Logout
</button>

      </nav>

    </div>
  );
};

export default VendorSidebar;
