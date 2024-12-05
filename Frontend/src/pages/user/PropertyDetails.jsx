import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'; // Use a carousel for images
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { FaBed, FaBath, FaRulerCombined, FaBuilding, FaCouch, FaCar, FaTag, FaMapMarkerAlt, FaBolt, FaListUl } from 'react-icons/fa'; // Icons for property details
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'; // Checkmark icon for success
import Modal from 'react-modal';
import DatePicker from 'react-datepicker'; // Date picker for selecting the visit date
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import {  toast, Toaster } from 'sonner';

Modal.setAppElement('#root'); // Set the app element for accessibility

function PropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate(); 
  const [property, setProperty] = useState(null); // Store property details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for booking
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Modal state for confirmation
  const [selectedDate, setSelectedDate] = useState(null); // Date selected by the user
  const [timeSlot, setTimeSlot] = useState(''); // Time slot selected by the user
  const [isBooking, setIsBooking] = useState(false);
  const [availableTimeSlots] = useState([
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ]); // Available time slots
  const user = useSelector(selectUser);
  console.log(user,"userrrrrrrrrrrrrrrrrrr");
  

  // Fetch property details when the component mounts
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstanceUser.get(`/propertydetails/${propertyId}`);
        console.log(response.data);
        
        setProperty(response.data); // Assuming the API returns the property details
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        setError('Error fetching property details');
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails(); // Fetch property details based on the ID in the URL
    }
  }, [propertyId]);

  // Open modal for booking a visit
  const openBookingModal = () => {
    setIsModalOpen(true);
  };

  // Close the booking modal
  const closeBookingModal = () => {
    setIsModalOpen(false);
  };

  // Open the confirmation modal
  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  // Handle booking submission
  const handleBookVisit = async (e) => {
    e.preventDefault();

    if (isBooking) return; // Prevent multiple submissions

    setIsBooking(true); // Start the booking process
    const userId = user.id; // Replace with actual user ID
    const vendorId = property.vendor._id; // Assuming property has vendorId

    const bookingData = {
      propertyId: propertyId,    // Property ID from the current property
      userId: userId,            // Replace with actual user ID
      vendorId: vendorId,        // Replace with actual vendor ID (optional)
      visitDate: selectedDate,   // The date selected by the user
      timeSlot: timeSlot,        // The time slot selected by the user
    };

    try {
      const response = await axiosInstanceUser.post('/bookings', bookingData);

      if (response.status === 201) {
        console.log('Booking successful:', response.data);
        closeBookingModal(); // Close the booking modal
        openConfirmationModal(); // Open the confirmation modal
      }
    }  catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('You have already booked a visit for this date and time.');
      } else {
        toast.error('An error occurred while booking the visit.');
      }
    } finally {
      setIsBooking(false); // Reset the booking status
    }
  };



 // Handle starting a chat with the vendor
 const handleChat = async () => {
  try {
    console.log("Initiatingggggggggg chat with user ID:", user.id, "and vendor ID:", property.vendor._id);
    const response = await axiosInstanceUser.post('/chat/initiate', {
      userId: user.id,
      vendorId: property.vendor._id,
    });
    const chatId = response.data.chatId;
    console.log("Chat initiatedddddd successfully, chat ID:", chatId);
    navigate(`/userChat/${chatId}?vendorId=${property.vendor._id}`);
  } catch (error) {
    console.error('Error initiating chat:', error);
    toast.error('Failed to initiate chat. Please try again.');
  }
};



  

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg font-semibold text-gray-700">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content container with more spacing from the top */}
      <div className="max-w-7xl mx-auto p-8 mt-24">
        {/* Property title */}
        <h1 className="text-4xl font-bold mb-10 text-gray-800">{property.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            {property.mediaUrls && property.mediaUrls.length > 0 ? (
              <Carousel showThumbs={false} infiniteLoop useKeyboardArrows>
                {property.mediaUrls.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center text-gray-500">
                No Images Available
              </div>
            )}

            {/* Property Description below image */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Description</h2>
              <p className="text-gray-600 text-justify ">{property.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Property Details */}
            <h2 className="text-3xl font-bold text-gray-800">Property Details</h2>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-center"><FaTag className="mr-2 text-blue-600" /> <strong>Price:</strong> ₹{new Intl.NumberFormat('en-IN').format(property.expectedPrice)}</li>
              <li className="flex items-center"><FaBed className="mr-2 text-blue-600" /> <strong>Bedrooms:</strong> {property.bedrooms}</li>
              <li className="flex items-center"><FaBath className="mr-2 text-blue-600" /> <strong>Bathrooms:</strong> {property.washrooms}</li>
              <li className="flex items-center"><FaBuilding className="mr-2 text-blue-600" /> <strong>Balconies:</strong> {property.balconies}</li>
              <li className="flex items-center"><FaRulerCombined className="mr-2 text-blue-600" /> <strong>Carpet Area:</strong> {property.carpetArea} sq.ft.</li>
              <li className="flex items-center"><FaCouch className="mr-2 text-blue-600" /> <strong>Furnishing Status:</strong> {property.furnishingStatus}</li>
              <li className="flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-600" /> <strong>Location:</strong> {property.address}, {property.city}, {property.district}</li>
              <li className="flex items-center"><FaCar className="mr-2 text-blue-600" /> <strong>Road Accessibility:</strong> {property.roadAccessibility}</li>
              <li className="flex items-center"><FaBolt className="mr-2 text-blue-600" /> <strong>Power Backup:</strong> {property.powerBackup}</li>
              <li className="flex items-center"><FaListUl className="mr-2 text-blue-600" /> <strong>Amenities:</strong> {property.amenities?.join(', ')}</li>
              <li><strong>Category:</strong> {property.category?.name}</li>
            </ul>

            {/* Book a Visit Button */}
            <div className="mt-8 flex gap-4"> 
              <button
                onClick={openBookingModal}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-300 ease-in-out"
              >
                Book a Visit
              </button>
              <button
                onClick={handleChat}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300 ease-in-out"
              >
                Message Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Booking a Visit */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeBookingModal}
        contentLabel="Book a Visit"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
        style={{ overlay: { zIndex: 1000 }}} // Ensure modal is above other content
      >
        <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Book a Visit</h2>

          <form onSubmit={handleBookVisit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Select a Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Start from tomorrow
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Select a Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a time slot</option>
                {availableTimeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeBookingModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
  type="submit"
  disabled={isBooking} // Disable button while booking is in progress
  className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition-all duration-200 ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {isBooking ? 'Booking...' : 'Confirm Booking'}
</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={closeConfirmationModal}
        contentLabel="Booking Confirmation"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
        style={{ overlay: { zIndex: 1001 }}} // Higher z-index than the booking modal
      >
        <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 max-w-md mx-auto text-center">
          <IoMdCheckmarkCircleOutline className="text-green-500 text-6xl mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">Your visit has been successfully booked.</p>
          <button
            onClick={closeConfirmationModal}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition-all duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PropertyDetails;
