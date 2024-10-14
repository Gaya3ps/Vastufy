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


import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateUser } from '../features/auth/authSlice';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    dispatch(updateUser({ userId: user.id, name }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-gray-200 p-3">
            <FaUser className="text-gray-600" size={36} />
          </div>
        </div>
        <div className="flex items-center justify-center mb-2">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 text-center focus:outline-none focus:border-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
          )}
          <button
            className="ml-3 bg-blue-500 text-white px-2 py-1 rounded-full focus:outline-none hover:bg-blue-600"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            <FaEdit />
          </button>
        </div>
        <div className="text-gray-500 mb-4">
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
