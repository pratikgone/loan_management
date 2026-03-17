import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { clearError, login } from "../store/authSlice"
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

export function Login() {
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  //redux state and dispatch
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
  dispatch(clearError());
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(login({
        mobile: form.mobile,
        password: form.password
      })).unwrap();

      // If success → resultAction has token & user data
      if (resultAction.token) {
        navigate("/dashboard");
      }
    } catch (err) {
      // Error already handled in redux state → shown via {error}
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[360px] sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100/80 p-6 sm:p-8 md:p-10">

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">Sign in to manage your loans</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm text-center">
              {error}
            </div>
          )}

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
              Mobile Number
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                <IoCallOutline className="h-5 w-5 stroke-[0.5]" />
              </div>
              <input
                id="mobile"
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Enter your 10 digit number"
                required
                disabled={isLoading}
                className="w-full pl-12 px-4 py-3 border border-orange-100 text-sm sm:text-base rounded-lg text-gray-900 focus:outline-none bg-orange-50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                <CiLock className="h-5 w-5 stroke-[0.5]" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full pl-12 px-4 py-3 pr-12 border text-sm sm:text-base border-orange-100 rounded-lg text-gray-900 focus:outline-none bg-orange-50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500  focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <FiEye className="h-5 w-5" />
                ) : (
                  <FiEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-orange-400 text-white font-semibold rounded-xl hover:bg-orange-200 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign In"}

          </button>

          <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
            <div>
              <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-normal transition-colors cursor-pointer">
                Create New Account
              </Link>
            </div>
            <div>
              <Link to="/forgotpassword" className="text-orange-500 hover:text-orange-600 font-normal transition-colors cursor-pointer">
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}