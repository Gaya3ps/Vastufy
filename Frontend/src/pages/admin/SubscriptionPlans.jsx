import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import { addSubscriptionPlan } from '../../features/admin/adminslice';
import axiosInstance from '../../services/axiosInstance';

function SubscriptionPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [formData, setFormData] = useState({
    planName: '',
    price: '',
    features: '',
    maxListings: '',
    prioritySupport: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();

  const tableHeaders = ['Plan Name', 'Price', 'Max Listings', 'Actions'];

  // Fetch subscription plans from the backend
  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axiosInstance.get('/getsubscriptionplans');
      setSubscriptionPlans(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Calculate total pages based on items
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  // Handle modal toggling
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addSubscriptionPlan(formData));
      toggleModal();
      fetchSubscriptionPlans();
    } catch (error) {
      console.error('Failed to add subscription plan:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Get the subscription plans for the current page
  const currentPlans = subscriptionPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen ml-64">
      <Sidebar />
      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Subscription Plans</h1>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add New Subscription
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-[#155e75] to-[#083344]">
                {tableHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-white font-semibold text-lg">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPlans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No subscription plans available.
                  </td>
                </tr>
              ) : (
                currentPlans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-100 transition duration-300">
                    <td className="px-4 py-3 text-gray-700">{plan.planName}</td>
                    <td className="px-4 py-3 text-gray-700">₹{plan.price}</td>
                    <td className="px-4 py-3 text-gray-700">{plan.maxListings}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 rounded w-20 ${
                            plan.status ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {plan.status ? 'Unlist' : 'List'}
                        </button>
                        {/* <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          View Details
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-blue-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Subscription Modal */}
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Maximum Listings</label>
                <input
                  type="number"
                  name="maxListings"
                  value={formData.maxListings}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Priority Support</label>
                <select
                  name="prioritySupport"
                  value={formData.prioritySupport}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
