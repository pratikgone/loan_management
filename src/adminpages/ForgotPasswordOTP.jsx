import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function ForgotPasswordOTP() {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const BASE_URL = "https://loan-backend-cv1k.onrender.com/api/auth";


  // email is not enter the return email page
  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword");
    }
  }, [email, navigate]);



  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length === 0) {
    setError("Please enter OTP");
    return;
  }

    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp: otpString,
      });

      setMessage(res.data.message || "OTP verified successfully!");

      // Success hone pe reset password page pe jao
      setTimeout(() => {
        navigate("/forgotpassword/reset", { state: { email, otp: otpString } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleResend = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/resend-otp`, { email });
      setMessage(res.data.message || "Verification code sent to your email!");
      setOtp(["", "", "", "", "", ""]);

      //first box focus
      setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 p-6 sm:p-8 md:p-10">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
            Enter OTP
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
We sent a 6-digit verification code to <br />
            <span className="font-semibold text-orange-600 break-all">{email || "your email address"}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm text-center mb-6 animate-pulse">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs sm:text-sm text-center mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 6 OTP Boxes */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-xl font-bold border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none bg-orange-50/30 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 bg-orange-400 text-white font-semibold rounded-xl shadow-md hover:bg-orange-200 transition-all cursor-pointer ${isLoading || otp.join("").length !== 6 ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="text-sm sm:text-base group"
            >
              <span className="text-gray-500">Didn't receive the code?</span>{" "}
              <span className="text-orange-600 font-semibold group-hover:text-orange-700 transition-colors cursor-pointer">
                Resend OTP
              </span>
            </button>

            <div className="p-2">
              <Link
                to="/forgotpassword"
                className="text-xs sm:text-sm text-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center gap-1"
              >
                <span className="text-gray-600">Wrong email?</span> Go Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}