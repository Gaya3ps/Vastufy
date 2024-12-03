import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const UserOtp = () => {
  const inputRefs = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (user) {
//       navigate("/home");
//     }
//   }, [user, navigate]);

  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const intervalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("vvvvvvvvvvvv");
    const otp = inputRefs.current.map((input) => input.value).join("");
    const { email } = location.state || {};
    console.log("heyyyyyy", otp, email);

    if (!email) {
      return <div>Error: Email not provided</div>;
    }

    try {
      const response = await axios.post(
        "http://vastufy.site/api/users/otp-verification",
        { otp, email }
      );
      console.log(response.data);
      navigate("/login");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error response:", error);
      if (error.response && error.response.data) {
        toast.error(`${error.response.data.error}`);
      } else {
        console.error("Error message:", error.message);
        toast.error(error.message);
      }
    }
  };

    const handleResend = async () => {
      const { email } = location.state || {};
      try {
        await axios.post('http://vastufy.site/api/users/resend-otp', { email });
        toast.success('OTP resent successfully');
        setTimer(60);
        setIsResendEnabled(false);

          clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalRef.current);
            setIsResendEnabled(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          setIsResendEnabled(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your phone
            number.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !inputRefs.current[index].value
                  ) {
                    if (index > 0) {
                      inputRefs.current[index - 1].focus();
                    }
                  }
                }}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-150"
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{" "}
          <button
            onClick={handleResend}
            disabled={!isResendEnabled}
            className={`font-medium ${
              isResendEnabled
                ? "text-blue-600 hover:text-blue-500"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Resend {timer > 0 && `(${timer}s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOtp;
