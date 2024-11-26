// import React, { useEffect, useState } from "react";
// import Table from "../../components/Table";
// import ProfileSidebar from "../../components/ProfileSidebar";
// import axios from "axios";
// import axiosInstanceUser from "../../services/axiosInstanceUser";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../features/auth/authSlice";


// function BookingDetails() {
//   // Define table headers
//   const headers = ["Property Name", "Time Slot", "Status"];

//   // State to hold booking data
//   const [bookings, setBookings] = useState([]);
//   const user = useSelector(selectUser);

//   // Fetch bookings data from API
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axiosInstanceUser.get(`/bookingdetails?userId=${user.id}`);

//         // Check if bookings are inside response.data.bookings
//         const bookingData = response.data.bookings;

//         // Format the data as required
//         const formattedData = bookingData.map((booking) => ({
//           propertyName: booking.propertyId?.title,
//           timeSlot: booking.timeSlot,
//           status: booking.status,
//         }));

//         setBookings(formattedData);
//       } catch (error) {
//         console.error("Error fetching booking details:", error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg fixed top-0 left-0 h-full">
//         <ProfileSidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow ml-64 p-6">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//           Booking Details
//         </h1>
//         <Table headers={headers} data={bookings} />
//       </div>
//     </div>
//   );
// }

// export default BookingDetails;


import React, { useEffect, useState } from "react";
import ProfileSidebar from "../../components/ProfileSidebar";
import Header from "../../components/Header"; // Import Header component
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

function BookingDetails() {
  // Define table headers
  const headers = ["Property Name", "Time Slot", "Status"];

  // State to hold booking data
  const [bookings, setBookings] = useState([]);
  const user = useSelector(selectUser);

  // Fetch bookings data from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstanceUser.get(`/bookingdetails?userId=${user.id}`);

        // Check if bookings are inside response.data.bookings
        const bookingData = response.data.bookings;

        // Format the data as required
        const formattedData = bookingData.map((booking) => ({
          propertyName: booking.propertyId?.title,
          timeSlot: booking.timeSlot,
          status: booking.status,
        }));

        setBookings(formattedData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookings();
  }, [user.id]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed top-0 left-0 h-full">
        <ProfileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6">
        <Header /> {/* Add the Header component */}

        {/* Booking Details Heading */}
        <h1 className="text-3xl font-semibold text-blue-800 mb-8 mt-32 text-center">
          Booking Details
        </h1>

        {/* Table with enhanced styling */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-800 to-blue-600 text-white uppercase text-sm font-semibold leading-normal">
                {headers.map((header, index) => (
                  <th key={index} className="py-4 px-6 text-left text-lg font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {bookings.length > 0 ? (
                bookings.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-blue-100 transition-colors"
                  >
                    <td className="py-6 px-6 text-left text-lg font-medium">{row.propertyName}</td>
                    <td className="py-6 px-6 text-left text-lg font-medium">{row.timeSlot}</td>
                    <td className="py-6 px-6 text-left text-lg font-medium">{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                    No booking data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;

