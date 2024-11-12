import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { clearUser, selectUser } from "../../features/auth/authSlice";
import Header from "../../components/Header";

function Home() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if the user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // useEffect(() => {
  //   if (!user) {
  //     // Redirect to login if the user is not authenticated
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  // const handleLogout = () => {
  //   dispatch(clearUser());
  //   navigate("/login");
  // };

  return (
    <div>
      {/* Header should be used here as a self-contained component */}
      <Header/>


      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 select-none">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hey, hello <span className="text-blue-600">{user.name||user.user.name}</span>!
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back! We hope you have a great experience.
        </p>
      </div>

      <div className="container">
        
{/* 
        <button
  style={{
    display: "flex",
    alignItems: "center",
    background: "blue",
    border: "none",
    cursor: "pointer",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "16px",
    position: "fixed", // Add fixed positioning
    bottom: "20px", // Distance from the bottom
    right: "20px", // Distance from the right
    zIndex: 1000, // Ensure it appears on top of other content
  }}
  onClick={handleLogout}
>
  <FiLogOut size={18} style={{ marginRight: "8px" }} />
  Logout
</button> */}

      </div>
    </div>
  );
}

export default Home;
