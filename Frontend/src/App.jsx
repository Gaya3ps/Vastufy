import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css'
import UserRoutes from './routes/userRoutes/UserRoutes';
import VendorRoutes from './routes/vendorRoutes/VendorRoutes';
import AdminRoutes from './routes/adminRoutes/AdminRoutes';

function App() {
  return (
    <>
     <Toaster 
  position="top-center"  // Correct positioning prop
  toastOptions={{
    duration: 2000,
    style: {
      background: '#fff',   // Custom background color
      color: '#16a34a',     // Custom text color
      borderRadius: '8px',  // Custom border radius
      padding: '16px',      // Custom padding
      fontSize: '16px',     // Increase text size
    },
  }} 
/>
    <Routes>
    <Route path='/*' element={<UserRoutes/>} />
    <Route path='/vendor/*' element={<VendorRoutes/>} />
    <Route path='/admin/*' element={<AdminRoutes />} />
    
  </Routes>
  </>
  )
}

export default App
