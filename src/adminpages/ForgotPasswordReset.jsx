import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import axios from "axios";

export function ForgotPasswordReset() {
  const location = useLocation();
  const { email, otp } = location.state || {};
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgotpassword");
    }
  }, [email, otp, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if(!newPassword.trim()) {
      setError("New password is reaquired");
      return;
    }

    if(!confirmPassword.trim()) {
      setError("Confirm password is required");
      return;
    }

    // 1. Frontend validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (!email || !otp) {
      setError("Session expired. Please start over.");
      navigate("/forgotpassword");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://loan-backend-cv1k.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      setMessage(res.data.message || "Password reset successful!");

      // if success then waight 2 sec. then redirect login page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 py-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-orange-100 p-6 sm:p-10">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
            Create New Password
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Set a strong password that includes at least 6 characters with both letters and numbers.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xs sm:text-sm text-center mb-6">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xs sm:text-sm text-center mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5 sm:space-y-6">
          {/* New Password */}
          <div className="relative">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>

            <div className="relative group">
              {/* Left Lock Icon – placeholder ke andar left side */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none">
                <CiLock className="h-5 w-5 stroke-[0.5]" />
              </div>

              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-12 pr-12 py-3.5 border bg-orange-50 rounded-xl border-orange-100 outline-none text-sm sm:text-base text-gray-900 transition-all duration-200"
              />

              {/* Right Eye Icon – placeholder ke andar right side */}
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500  focus:outline-none z-10 cursor-pointer"
              >
                {showNew ? (
                  <FiEye className="w-5 h-5" />
                ) : (
                  <FiEyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none">
                <CiLock className="h-5 w-5 stroke-[0.5]" />
              </div>

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-12 pr-12 py-3.5 border text-sm sm:text-base bg-orange-50 rounded-xl border-orange-100 outline-none text-gray-900 transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 focus:outline-none z-10 cursor-pointer"
              >
                {showConfirm ? (
                  <FiEye className="w-5 h-5" />
                ) : (
                  <FiEyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 bg-orange-400 text-white font-semibold rounded-xl shadow-md hover:bg-orange-200 transition-all cursor-pointer ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-sm text-gray-600">
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
            <span className="text-gray-600">Back to</span> Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}