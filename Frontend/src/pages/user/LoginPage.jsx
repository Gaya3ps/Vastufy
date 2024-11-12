
import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  GoogleAuth,
  loginUser,
  selectUser,
  signupUser,
} from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { GoogleAuthProvider} from "firebase/auth";
import { auth, provider,signInWithPopup } from "../../firebase/firebase";
import logo from '../../assets/VastufyLogo2.png'



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  console.log(user);

  useEffect(() => {
    if (user && user.is_blocked === false) {
      navigate("/");
    }
  }, [user, navigate]);


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.accessToken;
      const user = result.user;

      const userData = {
        idToken,
        email: user.email,
        name: user.displayName,
      };

      dispatch(GoogleAuth(userData))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            const userId = response.payload.response.user?.id;
            if (userId) {
              console.log('Login successful. User ID:', userId);
              toast.success('User logged in with Google');
              navigate('/home');
            } else {
              console.error('User ID is undefined:', response.payload.user);
              toast.error('Google login failed');
            }
          } else {
            toast.error('Google login failed');
          }
        })
        .catch((error) => {
          console.error('Error dispatching Google login:', error);
          toast.error('Google login failed');
        });
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed');
    }
  };



  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      toast.success("User Login Successful");
      navigate("/");
    } catch (error) {
      const errorMessage = error.error?.message ||
        error.message ||
        error.data?.message ||
        "Login failed";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  console.log("User is ", { user });
  return (
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('https://assets-news.housing.com/news/wp-content/uploads/2018/06/24201027/Kochi-Marine-Drive-NRIs%E2%80%99-top-pick-FB-1200x628-compressed.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center  min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          {/* <div className="p-6 space-y-4 sm:p-6 md:space-y-4"> */}
          <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
            Login
          </h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4 md:space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`bg-gray-50 border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`bg-gray-50 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>


                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>

                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                    Sign up
                  </a>
                </div>


                <div className="flex items-center justify-center mt-4">
                  <div className="w-full border-t border-gray-300"></div>
                  <span className="px-2 text-sm text-gray-500 dark:text-gray-400">or</span>
                  <div className="w-full border-t border-gray-300"></div>
                </div>


                <div className="flex items-center justify-center">
                    <div className="w-full px-6 sm:px-0 max-w-sm">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="text-white w-full bg-red-700 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
                      >
                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                     Login with Google
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

export default Login;
