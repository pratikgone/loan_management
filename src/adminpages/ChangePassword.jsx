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
import { useTranslation } from "react-i18next";


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
  error: { icon: "bg-red-100   text-red-700", bar: "bg-red-500" },
};

// ─── Toast Item ───────────────────────────────────────────────
function ToastItem({ id, type, message, duration = 4000, onRemove, t }) {
  const [removing, setRemoving] = useState(false);
  const s = toastStyles[type] || toastStyles.error;

  const dismiss = useCallback(() => {
    setRemoving(true);
    setTimeout(() => onRemove(id), 220);
  }, [id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
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
{type === "success" ? t('changePassword.toast.successSubtitle') : t('changePassword.toast.errorSubtitle')}
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
function ToastContainer({ toasts, onRemove, t }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
{toasts.map((toastItem) => (
        <div key={toastItem.id} className="pointer-events-auto">
          <ToastItem {...toastItem} onRemove={onRemove} t={t} />
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

  const { t } = useTranslation();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const { toasts, showToast, removeToast } = useToast();


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.currentPassword.trim()) {
    showToast({ type: "error", message: t('changePassword.toast.currentPasswordRequired') });
    return;
  }
  if (!form.newPassword.trim()) {
    showToast({ type: "error", message: t('changePassword.toast.newPasswordRequired') });
    return;
  }
  if (!form.confirmNewPassword.trim()) {
    showToast({ type: "error", message: t('changePassword.toast.confirmPasswordRequired') });
    return;
  }

  if (form.newPassword !== form.confirmNewPassword) {
    showToast({ type: "error", message: t('changePassword.toast.passwordsDoNotMatch') }); // ← Sahi key
    return;
  }

  if (form.newPassword.length < 6) {
    showToast({ type: "error", message: t('changePassword.toast.passwordTooShort') });
    return;
  }

  if (form.currentPassword === form.newPassword) {
    showToast({ type: "error", message: t('changePassword.toast.passwordSameAsCurrent') });
    return;
  }

  try {
    await dispatch(changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword,
    })).unwrap();

    showToast({ type: "success", message: t('changePassword.toast.passwordChangedSuccess') });
    setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

  } catch (error) {
    showToast({ type: "error", message: t('changePassword.toast.passwordChangeFailed') });
  }
};

 return (
  <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <div className="p-5 sm:p-6 lg:p-8">

      <ToastContainer toasts={toasts} onRemove={removeToast} t={t} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('changePassword.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('changePassword.subtitle')}</p>
      </div>

      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
        {t('changePassword.secureYourAccount')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
            
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl">
                <LuShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('changePassword.updatePassword')}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-5 sm:p-6 space-y-5">

                {/* Current Password */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    {t('changePassword.currentPassword')}
                  </label>
                  <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                    <LuKey size={16} className="ml-4 text-gray-400 flex-shrink-0" />
                    <input type={showCurrent ? "text" : "password"} value={form.currentPassword}
                      onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder={t('changePassword.currentPassword')}
                      className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                      {showCurrent ? <LuEye size={16} /> : <LuEyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('changePassword.newPassword')}</label>
                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                      <input type={showNew ? "text" : "password"} value={form.newPassword}
                        onChange={e => setForm({ ...form, newPassword: e.target.value })}
                        placeholder={t('changePassword.newPassword')}
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl" />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                        {showNew ? <LuEye size={16} /> : <LuEyeOff size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('changePassword.confirmNewPassword')}</label>
                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                      <input type={showConfirm ? "text" : "password"} value={form.confirmNewPassword}
                        onChange={e => setForm({ ...form, confirmNewPassword: e.target.value })}
                        placeholder={t('changePassword.placeholder.confirmNewPassword')}
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                        {showConfirm ? <LuEye size={16} /> : <LuEyeOff size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
                <button type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all cursor-pointer">
                  {t('changePassword.cancel')}
                </button>
                <button type="submit" disabled={isLoading}
                  className={`px-8 py-2.5 text-sm font-medium text-white rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 ${isLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 active:scale-95"}`}>
                  {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isLoading ? t('changePassword.changingPassword') : t('changePassword.updatePasswordButton')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-4">
          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl"><LuInfo className="w-4 h-4 text-orange-500" /></div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">{t('changePassword.requirements')}</h3>
            </div>
            <ul className="space-y-2.5">
              {[t('changePassword.requirement1'), t('changePassword.requirement2'), t('changePassword.requirement3')].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Need Help */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl"><LuShieldCheck className="w-4 h-4 text-orange-500" /></div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('changePassword.needHelp')}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{t('changePassword.needHelpDesc')}</p>
            <a href="/support" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              {t('changePassword.contactSupport')} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}