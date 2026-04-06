import { GoDotFill } from "react-icons/go";
import { CiCircleInfo } from "react-icons/ci";
import { LuKey } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { LuShieldCheck } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuInfo } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { LuEyeOff } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/authSlice";
import { AiOutlineCloseCircle } from "react-icons/ai";


// ─── Toast Icons ─────────────────────────────────────────────
const ToastIcons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const toastStyles = {
  success: { icon: "bg-green-100 text-green-700", bar: "bg-green-500" },
  error:   { icon: "bg-red-100   text-red-700",   bar: "bg-red-500"   },
};

// ─── Toast Item ───────────────────────────────────────────────
function ToastItem({ id, type, message, duration = 4000, onRemove }) {
  const [removing, setRemoving] = useState(false);
  const s = toastStyles[type] || toastStyles.error;

  const dismiss = useCallback(() => {
    setRemoving(true);
    setTimeout(() => onRemove(id), 220);
  }, [id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div className={`relative flex items-start gap-3 bg-white border border-gray-200
      rounded-xl shadow-md p-4 min-w-[280px] max-w-sm overflow-hidden
      transition-all duration-[220ms]
      ${removing ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.icon}`}>
        {ToastIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{message}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {type === "success" ? "Your password has been updated." : "Please try again."}
        </p>
      </div>
      <button onClick={dismiss}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100
          rounded p-0.5 transition-colors flex-shrink-0 mt-0.5 border-0 bg-transparent cursor-pointer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" className="w-3 h-3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`}
        style={{ animation: `shrink ${duration}ms linear forwards` }} />
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// ─── useToast Hook ────────────────────────────────────────────
let _toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type, message, duration = 4000 }) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

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

  const {toasts, showToast, removeToast} = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();


    //admin not write all fields
    if (!form.currentPassword.trim()) {
      showToast({ type: "error", message: "Current password is required!" });
      return;
    }
    if (!form.newPassword.trim()) {
      showToast({ type: "error", message: "New password is required!" });
      return;
    }
    if (!form.confirmNewPassword.trim()) {
      showToast({ type: "error", message: "Confirm password is required!" });
      return;
    }

    // Frontend validation
    if (form.newPassword !== form.confirmNewPassword) {
      showToast({ type: "error", message: "New password and confirm password do not match!" });
      return;
    }

    if (form.newPassword.length < 6) {
      showToast({ type: "error", message: "Password must be at least 6 characters long!" });
      return;
    }

    //new password and current password cannot be same as
    if (form.currentPassword === form.newPassword) {
      showToast({ type: "error", message: "New password cannot be the same as current password!" });
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      })).unwrap();
      showToast({ type: "success", message: "Password changed successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      showToast({ type: "error", message: error || "Failed to change password. Please check your current password." });
    }
  }

 return (
    <>
    <div className="p-4 sm:p-6">
      {/* Toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast}/>

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
      </div>
    </>
  );
}