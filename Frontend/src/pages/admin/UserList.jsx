import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../services/axiosInstance";
import Switch from "react-switch";
import Modal from "react-modal";
import { FaSearch } from "react-icons/fa";

function UserList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockedStatus, setBlockedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Items per page for pagination
  const [totalPages, setTotalPages] = useState(1);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const fetchUsers = async () => {
    setStatus("loading");
    try {
      const response = await axiosInstance.get(`/userlist`);
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.users.length / itemsPerPage)); // Calculate total pages
      setStatus("succeeded");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message);
      setStatus("failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const initialBlockedStatus = {};
    if (Array.isArray(users)) {
      users.forEach((user) => {
        initialBlockedStatus[user._id] = user.is_blocked;
      });
    }
    setBlockedStatus(initialBlockedStatus);
  }, [users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search term changes
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const openConfirmModal = (user) => {
    setUserToToggle(user);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
    setUserToToggle(null);
  };

  const confirmToggleBlockedStatus = async () => {
    if (userToToggle) {
      const isBlocked = !blockedStatus[userToToggle._id];
      try {
        await axiosInstance.patch(`/blockUser/${userToToggle._id}`, {
          is_blocked: isBlocked,
        });
        setBlockedStatus((prevState) => ({
          ...prevState,
          [userToToggle._id]: isBlocked,
        }));
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userToToggle._id
              ? { ...user, is_blocked: isBlocked }
              : user
          )
        );
        closeConfirmModal();
      } catch (err) {
        console.error("Failed to update user status:", err);
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Filtered users based on search and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Slice users for current page
  const usersToDisplay = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#eef2ff] ml-64">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-[#2D2926FF]">
          User List
        </h1>

        <div className="flex justify-between mb-4">
          <div className="flex items-center bg-white rounded-lg shadow-md p-2">
            <input
              type="text"
              placeholder="Search users"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155e75] text-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="ml-2 p-2 rounded-lg bg-[#155e75] text-white">
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
              {status === "loading" ? (
                <tr>
                  <td colSpan="4" className="text-center p-5">
                    Loading...
                  </td>
                </tr>
              ) : status === "failed" ? (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : Array.isArray(usersToDisplay) && usersToDisplay.length > 0 ? (
                usersToDisplay.map((user) => {
                  const isBlocked = blockedStatus[user._id];

                  return (
                    <tr key={user._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        <span
                          className={`inline-block px-3 py-1 text-sm ${
                            !isBlocked ? "bg-green-500" : "bg-red-500"
                          } text-white rounded-full`}
                        >
                          {!isBlocked ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-black text-sm">
                        <Switch
                          onChange={() => openConfirmModal(user)}
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
                  <td colSpan="4" className="text-center p-5">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
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
                ? "bg-blue-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirmation Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
          },
        }}
        ariaHideApp={false}
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">
          Are you sure you want to{" "}
          {blockedStatus[userToToggle?._id] ? "unblock" : "block"} this user?
        </p>
        <div className="flex justify-end">
          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmToggleBlockedStatus}
            className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default UserList;
