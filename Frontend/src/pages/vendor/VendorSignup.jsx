import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/logo3.jpg'
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { vendorSignup } from '../../features/vendor/vendorSlice';
import axios from 'axios';
import { toast } from 'sonner';

const VendorSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 





  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(vendorSignup(values));
      console.log(response,"✅✅✅✅")
      console.log(response.payload.vendor.redirectTo, "😘😘😘😘😘")
      if (response.payload.vendor && response.payload.vendor.redirectTo) {
        navigate(response.payload.vendor.redirectTo, { state: { email: values.email } });
      } else if (response.otpGenerated) {
        toast.success('OTP sent to your email');
        navigate('/vendor/otp-verification', { state: { email: values.email } });
      } else {
        toast.success('Signup success');
        navigate('/vendor/otp-verification', { state: { email: values.email } });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };




  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  });




  return (

<section className="relative bg-cover bg-center bg-no-repeat bg-[url('/RE1.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center  min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          {/* <div className="p-6 space-y-4 sm:p-6 md:space-y-4"> */}
          <div className="flex justify-center mb-4">
          <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
          </div>
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Vendor Sign Up
            </h1>
            <Formik
              initialValues={{
                name: '',
                email: '',
                mobileNumber: '',
                password: '',
                confirmPassword: ''
                
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4 md:space-y-4 mt-5">
                  <div>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`bg-gray-50 border ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                      placeholder="Your Name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`bg-gray-50 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                      placeholder="Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <Field
                      type="text"
                      name="mobileNumber"
                      id="mobileNumber"
                      className={`bg-gray-50 border ${errors.mobileNumber && touched.mobileNumber ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                      placeholder="Mobile Number"
                    />
                    <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className={`bg-gray-50 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className={`bg-gray-50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
 
                  <button
                    type="submit"
                    className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  >
                    Sign Up
                  </button>

                  <div className="text-center text-gray-700 dark:text-gray-300 mt-4">
                  Already have an account?{' '}
                  <a href="/vendor/login" className="text-blue-500 hover:underline">
                    Sign in
                  </a>
                </div>


                </Form>
              )}
            </Formik>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};


export default VendorSignup;
