// import React from 'react';
// import Header from '../../components/Header';
// import ProfileSidebar from '../../components/ProfileSidebar';
// import ProfileEdit from '../../components/ProfileEdit';
// // import ProfileEdit from '../../components/ProfileEdit';


// function UserProfile() {
//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <Header />

//       {/* Main Content Container */}
//       <div className="flex flex-grow overflow-hidden">
        
//         {/* Sidebar */}
//         <div className="w-64 bg-white shadow-lg">
//           <ProfileSidebar />
//         </div>
        
//         {/* Profile Edit Section */}
//         <div className="flex-grow overflow-y-auto p-6 bg-white shadow-lg rounded-lg m-4">
//           <ProfileEdit />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;



import React from 'react';
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';
import ProfileEdit from '../../components/ProfileEdit';

function UserProfile() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Main Content Container */}
      <div className="flex flex-grow overflow-hidden mt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed top-20 left-0 h-full border-r">
          <ProfileSidebar />
        </div>

        {/* Profile Edit Section */}
        <div className="flex-grow ml-64 overflow-y-auto p-6 bg-white shadow-lg rounded-lg m-6">
          <ProfileEdit />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
