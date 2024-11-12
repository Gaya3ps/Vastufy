import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import ProfileSidebar from "../../components/ProfileSidebar";
import axios from "axios";
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
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed top-0 left-0 h-full">
        <ProfileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Booking Details
        </h1>
        <Table headers={headers} data={bookings} />
      </div>
    </div>
  );
}

export default BookingDetails;
