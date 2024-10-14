import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import logo from "../../assets/VastufyLogo2.png";
import { forgotPassword } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(forgotPassword(values.email)).unwrap();

      // Log the response to verify if it's success
      console.log("Response:", response);

      // Show success message if email was sent
      if (response?.message === "Password reset email sent") {
        toast.success("Password reset link sent to your email");
      } else {
        // Handle unexpected responses
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      // Log the error to understand what is going wrong
      console.error("Error:", error);

      // Show error message
      toast.error("Failed to send password reset link");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('https://assets-news.housing.com/news/wp-content/uploads/2018/06/24201027/Kochi-Marine-Drive-NRIs%E2%80%99-top-pick-FB-1200x628-compressed.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-10 bg-white bg-opacity-90 rounded-lg shadow dark:bg-gray-800 dark:bg-opacity-40">
          <img
            src={logo}
            alt="Website Logo"
            className="h-28 w-auto mx-auto mb-3"
          />
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
            Forgot Password ?
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Enter your email address below, and we will send you instructions to
            reset your password.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#a39f74d6] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-[#1D4ED8] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Send Password Reset Link
                </button>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <a
                    href="/login"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Back to Login
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
