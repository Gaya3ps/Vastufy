import React, { useState } from 'react';

function AddSubscriptionModal({ closeModal }) {
  const [formData, setFormData] = useState({
    planName: '',
    price: '',
    validity: '',
    features: '',
    maxListings: '',  // Added max listings
    prioritySupport: 'no',  // Added priority support (default no)
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData,"llllllmmmmmm"); // Handle the form submission (e.g., send to backend)
    closeModal(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Subscription Plan</h2>

        <form onSubmit={handleSubmit}>
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
            <label className="block text-gray-700">Validity (in months)</label>
            <input
              type="number"
              name="validity"
              value={formData.validity}
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
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
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
  );
}

export default AddSubscriptionModal;
