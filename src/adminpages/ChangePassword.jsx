import { GoDotFill } from "react-icons/go";
import { CiCircleInfo } from "react-icons/ci";
import { LuKey } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { LuShieldCheck } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuInfo } from "react-icons/lu";
import { useEffect, useState } from "react";
import { LuEyeOff } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/authSlice";
import { AiOutlineCloseCircle } from "react-icons/ai";


export function ChangePassword() {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    //admin not write all fields
    if (!form.currentPassword.trim()) {
      setToast({ type: "error", message: "Current password is required!" });
      return;
    }
    if (!form.newPassword.trim()) {
      setToast({ type: "error", message: "New password is required!" });
      return;
    }
    if (!form.confirmNewPassword.trim()) {
      setToast({ type: "error", message: "Confirm password is required!" });
      return;
    }

    // Frontend validation
    if (form.newPassword !== form.confirmNewPassword) {
      setToast({ type: "error", message: "New password and confirm password do not match!" });
      return;
    }

    if (form.newPassword.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters long!" });
      return;
    }

    //new password and current password cannot be same as
    if (form.currentPassword === form.newPassword) {
      setToast({ type: "error", message: "New password cannot be the same as current password!" });
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      })).unwrap();
      setToast({ type: "success", message: "Password changed successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      setToast({ type: "error", message: error || "Failed to change password. Please check your current password." });
    }
  }

 return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-600 border border-green-700' : 'bg-red-600 border border-red-700'
          }`}>
            {toast.type === 'success' ? (
              <IoMdCheckmarkCircleOutline className="w-6 h-6" />
            ) : (
              <AiOutlineCloseCircle className="w-6 h-6" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Manage your administrative credentials and security preferences.
        </p>
      </div>

        <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Secure Your Account
        </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-5 border-b border-orange-100 bg-orange-50/50 flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <LuShieldCheck className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Update Password</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 md:p-8 space-y-6">

                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                    <div className="pl-4 text-gray-400">
                      <LuKey size={20} />
                    </div>
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={form.currentPassword}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-4 outline-none text-gray-700 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      {showCurrent ? <LuEye size={20} /> : <LuEyeOff size={20} />}
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* New + Confirm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                      <input
                        type={showNew ? "text" : "password"}
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        placeholder="New password"
                        className="w-full px-4 py-4 outline-none text-gray-700 bg-transparent rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                      >
                        {showNew ? <LuEye size={20} /> : <LuEyeOff size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmNewPassword}
                        onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
                        placeholder="Confirm password"
                        className="w-full px-4 py-4 outline-none text-gray-700 bg-transparent rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                      >
                        {showConfirm ? <LuEye size={20} /> : <LuEyeOff size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-5 bg-orange-50/50 border-t border-orange-100 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-10 py-3 font-semibold rounded-xl transition-all cursor-pointer text-white ${
                    isLoading
                      ? 'bg-orange-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md'
                  }`}
                >
                  {isLoading ? 'Changing Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Requirements Card */}
          <div className="bg-orange-50 rounded-2xl border border-orange-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <LuInfo className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Requirements</h3>
            </div>
            <ul className="space-y-3">
              {[
                'At least 6 characters long',
                'Mix uppercase & lowercase letters',
                'Include numbers and symbols',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <GoDotFill className="mt-1 text-orange-400 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Need Help Card */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-50 p-2 rounded-xl">
                <LuShieldCheck className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              If you're having trouble changing your password, please contact the system administrator or visit our help center.
            </p>
            <a
              href="/support"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Contact Support →
            </a>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}