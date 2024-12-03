// import React, { useState, useEffect } from 'react';
// import { useSearchParams , useNavigate } from 'react-router-dom';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { toast } from 'sonner';
// import logo from '../../assets/Vastufy logo.png'; 
// import { resetPassword } from '../../features/auth/authSlice';
// import { useDispatch } from 'react-redux';


// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();



//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       await dispatch(resetPassword({ token, password: values.password })).unwrap();
//       navigate('/login');
//       toast.success('Password reset successfully');
//     } catch (error) {
//       toast.error('Failed to reset password');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const validationSchema = Yup.object({
//     password: Yup.string()
//       .min(6, 'Password must be at least 6 characters')
//       .required('Password is required'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Confirm password is required'),
//   });

//   return (
//     <section className="relative bg-cover bg-center bg-no-repeat bg-[url('https://assets-news.housing.com/news/wp-content/uploads/2018/06/24201027/Kochi-Marine-Drive-NRIs%E2%80%99-top-pick-FB-1200x628-compressed.jpg')] bg-gray-50 dark:bg-gray-900">
//       <div className="absolute inset-0 bg-black opacity-50"></div>
//       <div className="relative flex flex-col items-center justify-center min-h-screen">
//         <div className="w-full max-w-md p-10 bg-white bg-opacity-90 rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
//         <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
//         <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
//           Reset Password
//         </h1>
//         <Formik
//           initialValues={{ password: '', confirmPassword: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {() => (
//             <Form className="space-y-4 md:space-y-4">
//               <div>
//                 <Field
//                   type="password"
//                   name="password"
//                   id="password"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   placeholder="New Password"
//                 />
//                 <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div>
//                 <Field
//                   type="password"
//                   name="confirmPassword"
//                   id="confirmPassword"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
//                   placeholder="Confirm Password"
//                 />
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Reset Password'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//       </div>
//     </section>
//   );
// };

// export default ResetPassword;


// import React from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');

//   // Validation schema for the form
//   const validationSchema = Yup.object({
//     password: Yup.string()
//       .min(8, 'Password must be at least 8 characters')
//       .required('Password is required'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Confirm Password is required'),
//   });

//   // Handle form submission
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       // Send the token and new password to the backend
//       const response = await axios.post('https://vastufy.site/api/users/reset-password', {token, password: values.password });

//       const result = await response.json();
//       if (response.ok) {
//         alert('Password has been reset successfully.');
//       } else {
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error('Error resetting password:', error);
//       alert('Failed to reset password.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>

//         <Formik
//           initialValues={{ password: '', confirmPassword: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-4">
//               <div>
//                 <label htmlFor="password" className="block text-gray-700 mb-2">
//                   New Password
//                 </label>
//                 <Field
//                   type="password"
//                   name="password"
//                   id="password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="Enter your new password"
//                 />
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
//                   Confirm New Password
//                 </label>
//                 <Field
//                   type="password"
//                   name="confirmPassword"
//                   id="confirmPassword"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="Confirm your new password"
//                 />
//                 <ErrorMessage
//                   name="confirmPassword"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
//               >
//                 {isSubmitting ? 'Resetting...' : 'Reset Password'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;






import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import logo from '../../assets/VastufyLogo2.png'; 
import { resetPassword } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      console.error('Reset token is missing.');
    } else {
      console.log('Received reset token:', token);
    }
  }, [token]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(resetPassword({ token, password: values.password })).unwrap();
      navigate('/login');
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('https://assets-news.housing.com/news/wp-content/uploads/2018/06/24201027/Kochi-Marine-Drive-NRIs%E2%80%99-top-pick-FB-1200x628-compressed.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90 rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
            Reset Password
          </h1>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-4">
                <div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="New Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
