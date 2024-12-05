import React, { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, signupUser,GoogleAuth } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'sonner'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase/firebase';
import logo from '../../assets/logo3.jpg'






const Signup = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { loading, error,user} = useSelector((state) => state.auth);
console.log(user);

// useEffect(()=>{
//   if(user){
//     console.log("going  for otp verification")
//     navigate("/otp-verification")
//   }
// },[user])

const handleGoogleSignup = async () => {
  try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google user', user);

      dispatch(GoogleAuth({ email: user.email, name: user.displayName }))
          .then((response) => {
              console.log('GoogleAuth response:', response); 
              if (response.meta.requestStatus === 'fulfilled') {
                  const userId = response.payload.response.user?.id;
                  if (userId) {
                      console.log('Signup successful. User ID:', userId);
                      toast.success('User signed up with Google');
                      navigate('/');
                  } else {
                      console.error('User ID is undefined:', response.payload.user);
                      toast.error('Google signup failed');
                  }
              } else {
                  toast.error('Google signup failed');
              }
          });
  } catch (error) {
      console.error('Error during Google signup:', error);
      toast.error('Google signup failed');
  }
};

const handleSubmit = async(values,{setSubmitting})=>{
  try {
    const response = await dispatch(signupUser(values)).unwrap();
    toast.success("User Signup Success");
    navigate('/otp-verification',{state:{email:values.email}})
  } catch (error) {
    toast.error("User already Exists!");

  }finally{
    setSubmitting(false);
  }
}

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  });

  console.log("User is ",{user})
  return (
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('https://assets-news.housing.com/news/wp-content/uploads/2018/06/24201027/Kochi-Marine-Drive-NRIs%E2%80%99-top-pick-FB-1200x628-compressed.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center  min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          {/* <div className="p-6 space-y-4 sm:p-6 md:space-y-4"> */}
          <div className="flex justify-center mb-4">
          <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
          </div>
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign Up
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
                  <a href="/login" className="text-blue-500 hover:underline">
                    Sign in
                  </a>
                </div>


                <div className="flex items-center justify-center mt-4">
                  <div className="w-full border-t border-gray-300"></div>
                  <span className="px-3 text-gray-600 dark:text-gray-300">or</span>
                  <div className="w-full border-t border-gray-300"></div>
                </div>



                  <div className="flex items-center justify-center">
                    <div className="w-full px-6 sm:px-0 max-w-sm">
                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="text-white w-full bg-red-700 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
                      >
                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Sign up with Google
                      </button>
                    </div>
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

export default Signup;
