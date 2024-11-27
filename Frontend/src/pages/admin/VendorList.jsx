import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../services/axiosInstance';
import Switch from 'react-switch';
import Modal from 'react-modal';
import { FaSearch } from "react-icons/fa";


const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockedStatus, setBlockedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // You can change the items per page here
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [vendorToToggle, setVendorToToggle] = useState(null);

  // Fetch vendors from the backend
  const fetchVendors = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get('/vendorlist');
      setVendors(response.data);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentPageVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const initialBlockedStatus = {};
    if (Array.isArray(vendors)) {
      vendors.forEach((vendor) => {
        initialBlockedStatus[vendor._id] = vendor.is_blocked || false;
      });
    }
    setBlockedStatus(initialBlockedStatus);
  }, [vendors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search term changes
  };

  const toggleBlockedStatus = async (vendorId) => {
    const isBlocked = !blockedStatus[vendorId];
    setBlockedStatus((prevState) => ({
      ...prevState,
      [vendorId]: isBlocked,
    }));
    try {
      await axiosInstance.patch(`/blockVendor/${vendorId}`, { is_blocked: isBlocked });
    } catch (err) {
      console.error('Failed to update vendor status:', err);
      setBlockedStatus((prevState) => ({
        ...prevState,
        [vendorId]: !isBlocked,
      }));
    }
  };

  const openConfirmModal = (vendor) => {
    setVendorToToggle(vendor);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
    setVendorToToggle(null);
  };

  const confirmToggleBlockedStatus = async () => {
    if (vendorToToggle) {
      const isBlocked = !blockedStatus[vendorToToggle._id];
      try {
        await axiosInstance.patch(`/blockVendor/${vendorToToggle._id}`, { is_blocked: isBlocked });
        setBlockedStatus((prevState) => ({
          ...prevState,
          [vendorToToggle._id]: isBlocked,
        }));
        setVendors((prevVendors) =>
          prevVendors.map((vendor) =>
            vendor._id === vendorToToggle._id ? { ...vendor, is_blocked: isBlocked } : vendor
          )
        );
        closeConfirmModal();
      } catch (err) {
        console.error('Failed to update vendor status:', err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef2ff]">
      <Sidebar />

      <div className="flex-1 p-6 overflow-auto ml-64">
        <h1 className="text-3xl font-semibold mb-6 text-[#2D2926FF]">Vendor List</h1>

        <div className="flex justify-between mb-4">
          <div className="flex items-center bg-white rounded-lg shadow-md p-2">
            <input
              type="text"
              placeholder="Search vendors"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155e75] text-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className=" ml-2  p-2 bg-[#155e75] rounded-r-md border-l border-gray-300">
            <FaSearch className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-[#155e75] to-[#083344] text-white text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageVendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-red-500">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                currentPageVendors.map((vendor) => {
                  const isBlocked = blockedStatus[vendor._id];

                  return (
                    <tr key={vendor._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">{vendor.name}</td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">{vendor.email}</td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        <span
                          className={`inline-block px-3 py-1 text-sm ${!isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full`}
                        >
                          {!isBlocked ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        <Switch
                          onChange={() => openConfirmModal(vendor)}
                          checked={isBlocked}
                          onColor="#EF4444"
                          offColor="#4CAF50"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          height={20}
                          width={40}
                          borderRadius={10}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          <button
            className={`mx-1 px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className={`mx-1 px-4 py-2 rounded ${currentPage === totalPages ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirmation Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '8px',
            maxWidth: '400px',
            padding: '20px',
          },
        }}
        ariaHideApp={false}
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">
          Are you sure you want to {vendorToToggle && !blockedStatus[vendorToToggle._id] ? 'block' : 'unblock'} this vendor?
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={confirmToggleBlockedStatus}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={closeConfirmModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VendorList;
