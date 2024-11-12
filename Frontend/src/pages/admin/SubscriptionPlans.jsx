import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Sidebar from '../../components/Sidebar'; // Import Sidebar component
import Table from '../../components/Table';
import { addSubscriptionPlan } from '../../features/admin/adminslice';
import axiosInstance from '../../services/axiosInstance';

function SubscriptionPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]); 
  const [formData, setFormData] = useState({
    planName: '',
    price: '',
    features: '',
    maxListings: '',  // Changed to include max listings
    prioritySupport: '',  // Added priority support (default no)
  });

  const dispatch = useDispatch();

  // Table headers (changed to show Max Listings instead of Validity)
  const tableHeaders = ['Plan Name', 'Price', 'Max Listings', 'Actions'];

  // Fetch subscription plans from the backend
  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axiosInstance.get('/getsubscriptionplans'); // Replace with your actual API URL
      setSubscriptionPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  };

  // UseEffect to fetch subscription plans on component mount
  useEffect(() => {
    fetchSubscriptionPlans(); // Call the function to fetch subscription plans
  }, []);

  // Transform subscription plans data into the format required by Table component
  const tableData = subscriptionPlans.map((plan) => ({
    planName: plan.planName,
    price: plan.price,
    maxListings: plan.maxListings, // Display maxListings instead of validity
    actions: (
      <div className="flex space-x-2">
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          List/Unlist
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          View Details
        </button>
      </div>
    ),
  }));

  // Function to toggle the add subscription modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for adding a subscription plan
  const handleAddSubscription = (e) => {
    e.preventDefault();
    dispatch(addSubscriptionPlan(formData)); // Dispatch action to add a new subscription plan
    toggleModal(); // Close the modal after adding
    fetchSubscriptionPlans();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Subscription Plans</h1>

          {/* Add New Subscription Button */}
          <button
            onClick={toggleModal} // Open modal on click
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add New Subscription
          </button>
        </div>

        {/* Subscription Plans Table */}
        <Table headers={tableHeaders} data={tableData} /> {/* Reusing the Table component */}
      </div>

      {/* Modal for Adding Subscription */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Subscription Plan</h2>

            <form onSubmit={handleAddSubscription}>
              <div className="mb-4">
                <label className="block text-gray-700">Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Maximum Listings Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Maximum Listings</label>
                <input
                  type="number"
                  name="maxListings"
                  value={formData.maxListings}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Priority Support Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Priority Support</label>
                <select
                  name="prioritySupport"
                  value={formData.prioritySupport}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Priority Support</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Add Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPlans;
