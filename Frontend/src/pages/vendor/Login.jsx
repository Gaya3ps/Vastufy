
import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {loginVendor} from "../../features/vendor/vendorSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import logo from '../../assets/VastufyLogo2.png'; 



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  console.log(user);


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(loginVendor(values)).unwrap();
      toast.success('Login success');
      navigate('/vendor/home');
    } catch (error) {
        toast.error(error.error || error.message || 'Login failed');
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
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('/RE1.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center  min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          {/* <div className="p-6 space-y-4 sm:p-6 md:space-y-4"> */}
          <img src={logo} alt="Website Logo" className="h-28 w-auto mx-auto mb-3" />
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
             Vendor Login
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


                <button
                  type="submit"
                  className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>

                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <a href="/vendor/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                    Sign up
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

export default Login;
