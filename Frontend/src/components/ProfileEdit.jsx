// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaUser } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';

// import { selectUser, updateUser } from '../features/auth/authSlice';

// const ProfileEdit = () => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectUser);

//   // Sync the local state with the user data from Redux store when user changes
//   const [name, setName] = useState(user?.name || '');
//   const [isEditing, setIsEditing] = useState(false);

//   // Effect to sync the local state when the user data changes in the Redux store
//   useEffect(() => {
//     if (user) {
//       setName(user.name);
//     }
//   }, [user]);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = () => {
//     dispatch(updateUser({ userId: user.id, name }))
//       .unwrap()
//       .then(() => {
//         setIsEditing(false);
//       })
//       .catch((error) => {
//         console.error('Error updating user:', error);
//       });
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex-grow flex flex-col items-center p-6">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
//         <div className="flex items-center justify-center mb-4">
//           <div className="rounded-full bg-[#F8F4EF] p-3">
//             <FaUser className="text-[#a39f74]" size={24} />
//           </div>
//         </div>
//         <div className="flex items-center justify-center mb-2">
//           {isEditing ? (
//             <input
//               type="text"
//               className="border border-gray-300 rounded-md px-2 py-1 text-center"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           ) : (
//             <h2 className="text-2xl font-semibold">{name}</h2>
//           )}
//           <button
//             className="ml-2 bg-transparent border-none cursor-pointer"
//             onClick={isEditing ? handleSaveClick : handleEditClick}
//           >
//             <FaEdit className="text-[#a39f74]" />
//           </button>
//         </div>
//         <div className="text-gray-600 mb-4">
//           <p>{user.email}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileEdit;





// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaUser } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectUser, updateUser } from '../features/auth/authSlice';

// const ProfileEdit = () => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectUser);

//   const [name, setName] = useState(user?.name || '');
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setName(user.name);
//     }
//   }, [user]);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = () => {
//     dispatch(updateUser({ userId: user.id, name }))
//       .unwrap()
//       .then(() => {
//         setIsEditing(false);
//       })
//       .catch((error) => {
//         console.error('Error updating user:', error);
//       });
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex-grow flex flex-col items-center justify-center p-6">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
//         <div className="flex items-center justify-center mb-4">
//           <div className="rounded-full bg-gray-200 p-3">
//             <FaUser className="text-gray-600" size={36} />
//           </div>
//         </div>
//         <div className="flex items-center justify-center mb-2">
//           {isEditing ? (
//             <input
//               type="text"
//               className="border border-gray-300 rounded-md px-4 py-2 text-center focus:outline-none focus:border-blue-400"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           ) : (
//             <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
//           )}
//           <button
//             className="ml-3 bg-blue-500 text-white px-2 py-1 rounded-full focus:outline-none hover:bg-blue-600"
//             onClick={isEditing ? handleSaveClick : handleEditClick}
//           >
//             <FaEdit />
//           </button>
//         </div>
//         <div className="text-gray-500 mb-4">
//           <p>{user.email}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileEdit;




import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateUser } from '../features/auth/authSlice';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log("User Object:", user);
  // const userId = user?.id;
  const userId =  user?._id; 
  console.log("got it hereeee",userId);
  

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setMobileNumber(user.mobileNumber);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (!userId) {
      console.error("User ID is missing!");
      return; // Prevent update if userId is undefined
    }
    dispatch(updateUser({ userId, name, mobileNumber }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  if (!user) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="shadow-lg rounded-xl p-8 max-w-4xl w-full flex">
        {/* Left Section (User Info Display) */}
        <div className=" pr-6 border-r border-gray-200">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <FaUser className="text-white" size={48} />
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Profile Details</h2>
            <div className="text-gray-600 mt-4">
              <p className="text-lg"><strong>Name:</strong> {name}</p>
              <p className="text-lg"><strong>Email:</strong> {email}</p>
              <p className="text-lg"><strong>Phone:</strong> {mobileNumber}</p>
            </div>
          </div>
        </div>

        {/* Right Section (Editable Fields) */}
        <div className="w-1/2 pl-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
            <div className="mt-4">
              {isEditing ? (
                <div>
                  {/* Editable Input Fields */}
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Name</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md px-4 py-2 w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Phone</label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md px-4 py-2 w-full"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)} 
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-full focus:outline-none hover:bg-blue-600 transition ease-in-out duration-300"
                    onClick={handleSaveClick}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full focus:outline-none hover:bg-blue-600 transition ease-in-out duration-300"
                  onClick={handleEditClick}
                >
                  <FaEdit className="inline-block mr-2" size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

