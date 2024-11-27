import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import { UserIcon } from '@heroicons/react/24/solid';
import { FaSearch } from 'react-icons/fa';

const VendorVerify = () => {
  const [vendors, setVendors] = useState([]);
  const [licenseData, setLicenseData] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch vendors
  const fetchVendors = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get('/verifyvendor');
      setVendors(response.data.vendors);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  // Fetch license data
  const fetchLicenseData = async (email) => {
    try {
      if (!licenseData[email]) {
        const response = await axiosInstance.get(`/license/${email}`);
        setLicenseData(prevData => ({
          ...prevData,
          [email]: response.data
        }));
      }
    } catch (err) {
      console.error('Failed to fetch license:', err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-[#f4f4f9] overflow-hidden ml-64">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-[#2D2926FF] mb-6">Vendor Verification</h1>

        {/* Search Bar */}
        <div className="flex items-center mb-6 bg-white rounded-lg shadow-lg p-4 max-w-lg mx-0">
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155e75] text-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="ml-2 p-2 rounded-lg bg-[#155e75] text-white">
          <FaSearch className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {status === 'loading' ? (
            <p className="text-center">Loading...</p>
          ) : status === 'failed' ? (
            <p className="text-center text-red-500">{error}</p>
          ) : vendors.length > 0 ? (
            vendors
              .filter((vendor) => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((vendor) => {
                const vendorLicense = licenseData[vendor.email];
                if (!vendorLicense) {
                  fetchLicenseData(vendor.email);
                }
                return (
                  <Link to={`/admin/vendor/${vendor._id}`} key={vendor._id}>
                    <div className="bg-[#0e7490] shadow-lg rounded-lg p-6 flex items-center space-x-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl cursor-pointer">
                      <UserIcon className="w-16 h-16 text-white" />
                      <div className="text-white">
                        <h2 className="text-xl font-semibold">{vendor.name}</h2>
                        <p className="text-lg">{vendor.email}</p>
                        <p className="text-lg">{vendor.mobileNumber}</p>


                      </div>
                    </div>
                  </Link>
                );
              })
          ) : (
            <p className="text-center text-red-500">No vendors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorVerify;
