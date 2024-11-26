
// import React, { useEffect, useState } from 'react';
// import { FaStore, FaUsers } from 'react-icons/fa';
// import Sidebar from '../../components/Sidebar';
// import axiosInstanceUser from '../../services/axiosInstanceUser';
// import axiosInstanceVendor from '../../services/axiosInstanceVendor';
// import BookingChart from './BookingChart';
// import ActiveUsersVendorsChart from './ActiveUsersVendorsChart';
// import PropertyListingsChart from './PropertyListingsChart';

// const Dashboard = () => {
//   const [userCount, setUserCount] = useState(0);
//   const [vendorCount, setVendorCount] = useState(0);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const userResponse = await axiosInstanceUser.get('/userCount');
//         console.log('userResponseeeeeeeeee:', userResponse.data);
//         setUserCount(userResponse.data);

//         const vendorResponse = await axiosInstanceVendor.get('/vendorCount');
//         console.log('vendorrrrrrrResponseeeeeee:', vendorResponse.data);

        
//         setVendorCount(vendorResponse.data.count);
//       } catch (error) {
//         console.error('Error fetching counts:', error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div className="flex bg-[#eef2ff]  min-h-screen">
//       <Sidebar />
//       <div className="flex-1 p-6">
//         {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1> */}
//         <h1 className="text-2xl font-bold mb-6" style={{ color: '#155e75' }}>
//   Dashboard
// </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {/* User Count Card */}
//           <div className="bg-[#155e75]  shadow-lg rounded-lg p-6 flex items-center">
//             <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
//               <FaUsers className="w-6 h-6" />
//             </div>
//             <div className="ml-4">
//               <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Users</h2>
//               <p className="text-xl font-bold text-gray-900 dark:text-white">{userCount}</p>
//             </div>
//           </div>

//           {/* Vendor Count Card */}
//           <div className="bg-[#155e75] shadow-lg rounded-lg p-6 flex items-center">
//             <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
//               <FaStore className="w-6 h-6" />
//             </div>
//             <div className="ml-4">
//               <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Vendors</h2>
//               <p className="text-xl font-bold text-gray-900 dark:text-white">{vendorCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Adding the BookingsChart below the user and vendor counts */}
//         <div className="mt-8">
//           <BookingChart />
//         </div>

//         <div className="mt-8">
//           <ActiveUsersVendorsChart />
//         </div>

//         <div className="mt-8">
//           <PropertyListingsChart />
//         </div>



//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import { FaStore, FaUsers } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import axiosInstanceVendor from '../../services/axiosInstanceVendor';
import BookingChart from './BookingChart';
import ActiveUsersVendorsChart from './ActiveUsersVendorsChart';
import PropertyListingsChart from './PropertyListingsChart';
import SubscriptionRevenueChart from './SubscriptionRevenueChart';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userResponse = await axiosInstanceUser.get('/userCount');
        setUserCount(userResponse.data);

        const vendorResponse = await axiosInstanceVendor.get('/vendorCount');
        setVendorCount(vendorResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex bg-[#eef2ff] min-h-screen ml-64 ">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#2D2926FF]">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* User Count Card */}
          <div className="bg-[#155e75]  shadow-lg rounded-lg p-6 flex items-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Users</h2>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{userCount}</p>
            </div>
          </div>

          {/* Vendor Count Card */}
          <div className="bg-[#155e75] shadow-lg rounded-lg p-6 flex items-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
              <FaStore className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Vendors</h2>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{vendorCount}</p>
            </div>
          </div>
        </div>



        {/* Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-8 mt-16">
          {/* Side-by-Side Charts: Booking Chart and Active Users & Vendors Chart */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <BookingChart />
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <ActiveUsersVendorsChart />
          </div>
        </div>

        {/* Centered Property Listings Chart */}
        <div className="flex justify-center mt-8">
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl">
            <PropertyListingsChart />
          </div>
        </div>



        <div className="flex justify-center mt-16">
        <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl">
            <SubscriptionRevenueChart />
            </div>
          </div>


      </div>
    </div>
  );
};

export default Dashboard;
