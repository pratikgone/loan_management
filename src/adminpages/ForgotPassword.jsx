import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = "https://loan-backend-cv1k.onrender.com/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email });

      setMessage(res.data.message || "Verification code sent to your email!");

      // if Success then going to OTP page + email passing
      setTimeout(() => {
        navigate("/forgotpassword/otp", { state: { email } });
      }, 1500); // delay to show message
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 sm:px-8 lg:px-12">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100/80 p-6 sm:p-10 md:p-12 transform transition-all duration-300 hover:shadow-xl">

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
            Forgot Password
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Enter your Registered email address to receive a one time password(OTP).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-xs sm:text-sm text-center">
              {message}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                <MdOutlineEmail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your email"
                
                className="w-full pl-12 px-4 py-3 text-sm sm:text-base border border-orange-100 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 sm:py-4 px-4 text-white text-sm sm:text-base font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer ${isLoading
                ? "bg-orange-400 opacity-70 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-200"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>

          <div className="text-center text-xs sm:text-sm text-gray-600 mt-4 md:mt-6">
            Remembered your password?{" "}
            <Link
              to="/"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}