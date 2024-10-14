import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import { UserIcon } from '@heroicons/react/24/solid';

function VendorVerify() {
  const [vendors, setVendors] = useState([]);
  const [licenseData, setLicenseData] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
     <div className="flex h-screen bg-['#155e75'] overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-white rounded shadow-md">
            <input
              type="text"
              placeholder="Search vendors"
              className="px-4 py-2 w-64 border-none focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="px-4 py-2 bg-gray-200 border-l border-gray-300">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 1 0 0 0 1 1h3m-4-6h4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {status === 'loading' ? (
            <p className="text-center">Loading...</p>
          ) : status === 'failed' ? (
            <p className="text-center text-red-500">{error}</p>
          ) : vendors.length > 0 ? (
            vendors
              .filter((vendor) =>
                vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((vendor) => {
                const vendorLicense = licenseData[vendor.email];
                if (!vendorLicense) {
                  fetchLicenseData(vendor.email);
                }
                return (
                  <Link to={`/admin/vendor/${vendor._id}`} key={vendor._id}>
                     <div className="bg-[#0e7490]  shadow-md rounded-lg p-6 flex items-center space-x-4 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">

                         <UserIcon className="w-12 h-12 text-white"/>
                        <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {vendor.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">{vendor.email}</p>
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
}

export default VendorVerify;
