import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import VendorSidebar from "../../components/VendorSidebar";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;

  // Define the table headers
  const headers = ["Property", "User", "Vendor", "Visit Date", "Time Slot", "Actions"];

  // Fetch bookings data from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/bookings/${vendorId}`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };
    fetchBookings();
  }, [vendorId]);

  // Accept booking function
  const acceptBooking = async (bookingId) => {
    try {
      await axiosInstanceVendor.put(`/accept-booking/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "accepted" } : booking
        )
      );
    } catch (error) {
      console.error("Failed to accept booking:", error);
    }
  };

  // Reject booking function
  const rejectBooking = async (bookingId) => {
    try {
      await axiosInstanceVendor.put(`/reject-booking/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "rejected" } : booking
        )
      );
    } catch (error) {
      console.error("Failed to reject booking:", error);
    }
  };

  // Transform the bookings data to fit the table format
  const tableData = bookings.map((booking) => ({
    property: booking.propertyId?.title || "N/A",
    user: booking.userId?.name || booking.userId?._id || "Unknown User",
    vendor: booking.vendorId?.name || booking.vendorId?._id || "Unknown Vendor",
    visitDate: new Date(booking.visitDate).toLocaleDateString(),
    timeSlot: booking.timeSlot,
    actions: (
      <div className="flex gap-2">
        {booking.status === "accepted" ? (
          <button className="px-4 py-2 bg-gray-400 text-white rounded" disabled>
            Accepted
          </button>
        ) : booking.status === "rejected" ? (
          <button className="px-4 py-2 bg-gray-400 text-white rounded" disabled>
            Rejected
          </button>
        ) : (
          <>
            <button
              onClick={() => acceptBooking(booking._id)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Accept
            </button>
            <button
              onClick={() => rejectBooking(booking._id)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reject
            </button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div className="flex">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main content */}
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Bookings</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Table headers={headers} data={tableData} />
        )}
      </div>
    </div>
  );
}

export default Bookings;
