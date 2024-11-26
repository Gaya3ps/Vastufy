// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axiosInstance from '../../services/axiosInstance';
// import Switch from 'react-switch';
// import Modal from 'react-modal';

// const VendorList = () => {
//   const [vendors, setVendors] = useState([]);
//   const [status, setStatus] = useState('idle');
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [blockedStatus, setBlockedStatus] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
//   const [vendorToToggle, setVendorToToggle] = useState(null);
  

//   const fetchVendors = async (page = 1, limit = 5) => {
//     setStatus('loading');
//     try {
//       const response = await axiosInstance.get(`/vendorlist?page=${page}&limit=${limit}`);
//       setVendors(response.data);
//       setTotalPages(response.data.totalPages);
//       setStatus('succeeded');
//     } catch (err) {
//       console.error('Failed to fetch vendors:', err);
//       setError(err.message);
//       setStatus('failed');
//     }
//   };

//   useEffect(() => {
//     fetchVendors(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     const initialBlockedStatus = {};
//     if (Array.isArray(vendors)) {
//       vendors.forEach(vendor => {
//         initialBlockedStatus[vendor._id] = vendor.is_blocked || false;
//       });
//     }
//     setBlockedStatus(initialBlockedStatus);
//   }, [vendors]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const toggleBlockedStatus = async (vendorId) => {
//     const isBlocked = !blockedStatus[vendorId];
//     setBlockedStatus((prevState) => ({
//       ...prevState,
//       [vendorId]: isBlocked,
//     }));
//     try {
//       await axiosInstance.patch(`/blockVendor/${vendorId}`, { is_blocked: isBlocked });
//     } catch (err) {
//       console.error('Failed to update vendor status:', err);
//       setBlockedStatus((prevState) => ({
//         ...prevState,
//         [vendorId]: !isBlocked,
//       }));
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const openConfirmModal = (vendor) => {
//     setVendorToToggle(vendor);
//     setConfirmModalIsOpen(true);
//   };

//   const closeConfirmModal = () => {
//     setConfirmModalIsOpen(false);
//     setVendorToToggle(null);
//   };

//   const confirmToggleBlockedStatus = async () => {
//     if (vendorToToggle) {
//       const isBlocked = !blockedStatus[vendorToToggle._id];
//       try {
//         await axiosInstance.patch(`/blockVendor/${vendorToToggle._id}`, { is_blocked: isBlocked });
//         setBlockedStatus((prevState) => ({
//           ...prevState,
//           [vendorToToggle._id]: isBlocked,
//         }));
//         setVendors((prevVendors) =>
//           prevVendors.map((vendor) =>
//             vendor._id === vendorToToggle._id ? { ...vendor, is_blocked: isBlocked } : vendor
//           )
//         );
//         closeConfirmModal();
//       } catch (err) {
//         console.error('Failed to update vendor status:', err);
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-['#155e75']">
//       <Sidebar />

//       <div className="flex-1 p-6 overflow-auto ml-64">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center bg-white rounded shadow-md">
//             <input
//               type="text"
//               placeholder="Search vendors"
//               className="px-4 py-2 w-64 border-none focus:outline-none"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <button className="px-4 py-2 bg-gray-200 border-l border-gray-300">
//               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 0 0 0 1 1h3m-4-6h4" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
//           <table className="min-w-full leading-normal">
//             <thead>
//               <tr>
//                 <th className="px-5 py-3 bg-[#155e75] text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-5 py-3 bg-[#155e75] text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-5 py-3 bg-[#155e75] text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-5 py-3 bg-[#155e75] text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {status === 'loading' ? (
//                 <tr>
//                   <td colSpan="4" className="text-center p-5">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : status === 'failed' ? (
//                 <tr>
//                   <td colSpan="4" className="text-center p-5 text-red-500">
//                     {error}
//                   </td>
//                 </tr>
//               ) : Array.isArray(vendors) && vendors.length > 0 ? (
//                 vendors
//                   .filter((vendor) =>
//                     vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
//                   )
//                   .map((vendor) => {
//                     const isBlocked = blockedStatus[vendor._id];

//                     return (
//                       <tr key={vendor._id}>
//                         <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white  text-sm">
//                           <div className="flex items-center">
//                             <div className="ml-3">
//                               <p className="whitespace-no-wrap" style={{ color: '#155e75' }}>{vendor.name}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white  text-sm">
//                           <p className="whitespace-no-wrap" style={{ color: '#155e75' }}>{vendor.email}</p>
//                         </td>
//                         <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white text-sm">
//                           <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${!isBlocked ? 'text-green-900' : 'text-red-900'}`}>
//                             <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${!isBlocked ? 'bg-[#A39F74] dark:bg-[#A39F74]' : 'bg-red-200 dark:bg-red-600'}`}></span>
//                             <span className="relative">{!isBlocked ? 'Active' : 'Blocked'}</span>
//                           </span>
//                         </td>
//                         <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white  text-sm">
//                           <Switch
//                             onChange={() => openConfirmModal(vendor)}
//                             checked={isBlocked}
//                             onColor="#EF4444"
//                             offColor="#4CAF50"
//                             uncheckedIcon={false}
//                             checkedIcon={false}
//                             height={20}
//                             width={40}
//                             borderRadius={10}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center p-5 text-red-500">
//                     No vendors found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination controls */}
//         <div className="flex justify-center mt-4">
//           <button
//             className={`mx-1 px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <button
//             className={`mx-1 px-4 py-2 rounded ${currentPage === totalPages ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <Modal
//         isOpen={confirmModalIsOpen}
//         onRequestClose={closeConfirmModal}
//         contentLabel="Confirmation Modal"
//         style={{
//           overlay: {
//             backgroundColor: 'rgba(0, 0, 0, 0.75)',
//           },
//           content: {
//             top: '50%',
//             left: '50%',
//             right: 'auto',
//             bottom: 'auto',
//             marginRight: '-50%',
//             transform: 'translate(-50%, -50%)',
//             backgroundColor: '#fff',
//             borderRadius: '8px',
//             maxWidth: '400px',
//             padding: '20px',
//           },
//         }}
//         ariaHideApp={false}
//       >
//         <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
//         <p className="mb-4">
//           Are you sure you want to {vendorToToggle && !blockedStatus[vendorToToggle._id] ? 'block' : 'unblock'} this vendor?
//         </p>
//         <div className="flex justify-end">
//           <button
//             className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
//             onClick={confirmToggleBlockedStatus}
//           >
//             Confirm
//           </button>
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             onClick={closeConfirmModal}
//           >
//             Cancel
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default VendorList;



import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../services/axiosInstance';
import Switch from 'react-switch';
import Modal from 'react-modal';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockedStatus, setBlockedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [vendorToToggle, setVendorToToggle] = useState(null);

  const fetchVendors = async (page = 1, limit = 5) => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get(`/vendorlist?page=${page}&limit=${limit}`);
      setVendors(response.data);
      setTotalPages(response.data.totalPages);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    fetchVendors(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const initialBlockedStatus = {};
    if (Array.isArray(vendors)) {
      vendors.forEach(vendor => {
        initialBlockedStatus[vendor._id] = vendor.is_blocked || false;
      });
    }
    setBlockedStatus(initialBlockedStatus);
  }, [vendors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
              className="px-4 py-2 w-64 rounded-md focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="px-4 py-2 bg-gray-200 rounded-r-md border-l border-gray-300">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 0 0 0 1 1h3m-4-6h4" />
              </svg>
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
              {status === 'loading' ? (
                <tr>
                  <td colSpan="4" className="text-center p-5">Loading...</td>
                </tr>
              ) : status === 'failed' ? (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-red-500">{error}</td>
                </tr>
              ) : Array.isArray(vendors) && vendors.length > 0 ? (
                vendors
                  .filter((vendor) => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((vendor) => {
                    const isBlocked = blockedStatus[vendor._id];

                    return (
                      <tr key={vendor._id} className="hover:bg-gray-100">
                        <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">{vendor.name}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">{vendor.email}</td>
                        <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                          <span className={`inline-block px-3 py-1 text-sm ${!isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full`}>
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
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-red-500">No vendors found.</td>
                </tr>
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





