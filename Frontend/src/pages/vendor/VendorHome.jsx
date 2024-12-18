// import React from "react";
// import VendorSidebar from "../../components/VendorSidebar"; // Make sure the path is correct
// import {
//   BuildingOfficeIcon,
//   ChatBubbleBottomCenterTextIcon,
  
// } from "@heroicons/react/24/outline";
// import { UserIcon } from "@heroicons/react/24/solid";


// import { useSelector } from "react-redux";
// import { selectVendor } from "../../features/vendor/vendorSlice";
// import VendorHeader from "../../components/VendorHeader";

// const VendorDashboard = () => {
//   const vendor = useSelector(selectVendor);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <VendorSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-10 bg-gray-100">
//         <header className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-semibold">
//               Welcome back,{vendor.name}!
//             </h1>
//             <p className="text-gray-500">
//               Maximize your business with our platform. Utilize our offerings.
//             </p>
//           </div>
//           <VendorHeader />
//         </header>

//         {/* Statistics Section */}
//         <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Total Properties */}
//           <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
//             <BuildingOfficeIcon className="w-12 h-12 text-blue-500" />
//             <div className="ml-4">
//               <h2 className="text-xl font-semibold">Total Properties</h2>
//               <p className="text-gray-500">0</p>
//             </div>
//           </div>

//           {/* Total Enquiries */}
//           <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
//             <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-yellow-500" />
//             <div className="ml-4">
//               <h2 className="text-xl font-semibold">Total Enquiries</h2>
//               <p className="text-gray-500">0</p>
//             </div>
//           </div>
//         </div>

//         {/* View more link */}
//         <div className="mt-6">
//           <a href="#" className="text-blue-600 hover:underline">
//             View more &rarr;
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;








import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/VendorSidebar"; // Make sure the path is correct
import {
  BuildingOfficeIcon,
  ChatBubbleBottomCenterTextIcon,
  
} from "@heroicons/react/24/outline";
import axiosInstanceVendor from '../../services/axiosInstanceVendor'


import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import VendorHeader from "../../components/VendorHeader";

const VendorDashboard = () => {
  const vendor = useSelector(selectVendor);
   const vendorId = vendor.id;
  const [propertyCount, setPropertyCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);


    // Fetch counts on component mount
    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const propertyResponse = await axiosInstanceVendor.get(`/propertyCount/${vendorId}`);
          console.log(propertyResponse.data,"haaaiiiii");
          
          setPropertyCount(propertyResponse.data.count);

  
          const chatResponse = await axiosInstanceVendor.get(`/chatCount/${vendorId}`);
          console.log(chatResponse.data,"hellooooooo");
          
          setChatCount(chatResponse.data.count);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      };
  
      fetchCounts();
    }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main Content */}
      <div className=" ml-64 flex-1 p-10 bg-gray-100">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#B85042] ">
              Welcome back,{vendor.name}!
            </h1>
            <p className="text-gray-500">
              Maximize your business with our platform. Utilize our offerings.
            </p>
          </div>
          <VendorHeader />
        </header>

        {/* Statistics Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Properties */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <BuildingOfficeIcon className="w-12 h-12 text-blue-500" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Total Properties</h2>
              <p className="text-gray-500">{propertyCount}</p>
            </div>
          </div>

          {/* Total Enquiries */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-yellow-500" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Total Enquiries</h2>
              <p className="text-gray-500">{chatCount}</p>
            </div>
          </div>
        </div>

        {/* View more link */}
        {/* <div className="mt-6">
          <a href="#" className="text-blue-600 hover:underline">
            View more &rarr;
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default VendorDashboard;
