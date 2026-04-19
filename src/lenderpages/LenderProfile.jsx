import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword } from "../store/authSlice";
import { FiUser, FiEdit, FiCamera, FiShield, FiCheck, FiFileText } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { LuKey, LuShieldCheck, LuEye, LuEyeOff } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import React from "react";
import axios from "axios";

// Toast Icons
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
  error: { icon: "bg-red-100 text-red-700", bar: "bg-red-500" },
};

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
    <div className={`relative flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-md p-4 min-w-[280px] max-w-sm overflow-hidden transition-all duration-[220ms] ${removing ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.icon}`}>
        {ToastIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{message}</p>
      </div>
      <button
        onClick={dismiss}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-0.5 transition-colors flex-shrink-0 mt-0.5 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`} style={{ animation: `shrink ${duration}ms linear forwards` }} />
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

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

export function LenderProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isImpersonating, adminName, isLoading } = useSelector(s => s.auth);
  const { toasts, showToast, removeToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPic, setNewPic] = useState(null);

  const [form, setForm] = useState({ userName: "", mobileNo: "", email: "", address: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showPw, setShowPw] = useState({ cur: false, new: false, conf: false });

  const displayName = user?.userName || user?.name || "Lender";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const profilePic = user?.profileImage || user?.profilePicture || null;

  useEffect(() => {
    if (user) {
      const mobile = (user.mobileNo || "").replace(/^\+91/, "").slice(-10);
      setForm({ userName: user.userName || "", mobileNo: mobile, email: user.email || "", address: user.address || "" });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPic(file);
    const r = new FileReader();
    r.onloadend = () => setPreviewUrl(r.result);
    r.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!/^\d{10}$/.test(form.mobileNo)) { showToast({ type: "error", message: "Mobile must be exactly 10 digits" }); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { showToast({ type: "error", message: "Enter a valid email address" }); return; }
    setIsSaving(true);
    try {
      await dispatch(updateProfile({ userData: { userName: form.userName, email: form.email, mobileNo: form.mobileNo, address: form.address } })).unwrap();
      if (newPic) {
        const fd = new FormData();
        fd.append("profileImage", newPic);
        const res = await axios.post("https://loan-backend-cv1k.onrender.com/api/user/uploadProfileImage", fd, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        dispatch({ type: "auth/updateProfile/fulfilled", payload: res.data.user });
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      showToast({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false); setNewPic(null); setPreviewUrl(null);
    } catch { showToast({ type: "error", message: "Failed to update profile" }); }
    finally { setIsSaving(false); }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmNewPassword) { showToast({ type: "error", message: "All fields are required" }); return; }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { showToast({ type: "error", message: "New passwords do not match" }); return; }
    if (pwForm.newPassword.length < 6) { showToast({ type: "error", message: "Password must be at least 6 characters" }); return; }
    if (pwForm.currentPassword === pwForm.newPassword) { showToast({ type: "error", message: "New password must differ from current" }); return; }
    try {
      await dispatch(changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword, confirmNewPassword: pwForm.confirmNewPassword })).unwrap();
      showToast({ type: "success", message: "Password changed successfully!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch { showToast({ type: "error", message: "Failed to change password" }); }
  };

  const fields = [
    { label: "Full Name", key: "userName", icon: <FiUser />, color: "text-blue-500 bg-blue-50" },
    { label: "Mobile Number", key: "mobileNo", icon: <IoCallOutline />, color: "text-green-500 bg-green-50" },
    { label: "Email Address", key: "email", icon: <MdOutlineEmail />, color: "text-orange-500 bg-orange-50" },
    { label: "Address", key: "address", icon: <CiLocationOn />, color: "text-rose-500 bg-rose-50" },
  ];

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="p-5 sm:p-6 lg:p-8 max-w-3xl mx-auto">

        {/* Impersonation notice */}
        {isImpersonating && (
          <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                Admin Session Active
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                {adminName || "An admin"} is viewing this lender's profile. Changes here will affect the actual lender account.
              </p>
            </div>
            <span className="text-[9px] font-black text-purple-600 bg-purple-100 dark:bg-purple-800 px-2.5 py-1 rounded-full uppercase tracking-widest flex-shrink-0">
              Impersonating
            </span>
          </div>
        )}

        {/* Back + Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {isImpersonating ? `${displayName}'s Profile` : "My Profile"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isImpersonating ? "Viewing as admin — all info belongs to this lender" : "Manage your personal info and account security"}
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-20 relative" style={{ background: isImpersonating ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "linear-gradient(135deg,#f97316,#fb923c)" }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-orange-100 dark:bg-orange-900/20">
                  {previewUrl || profilePic ? (
                    <img src={previewUrl || profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-2xl font-bold">{initials}</div>
                  )}
                </div>
                {isEditing && !isImpersonating && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors">
                      <FiCamera className="w-3.5 h-3.5 text-white" />
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                  </>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{displayName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wide">
                    Lender
                  </span>
                  {isImpersonating && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 uppercase tracking-wide">
                      Admin View
                    </span>
                  )}
                </div>
              </div>

              {/* Edit button — only if not impersonating OR allow admin to edit */}
              {activeTab === "profile" && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => { setIsEditing(false); setNewPic(null); setPreviewUrl(null); }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        Cancel
                      </button>
                      <button onClick={handleSaveProfile} disabled={isSaving}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm cursor-pointer transition-all shadow-sm disabled:opacity-60 flex items-center gap-1.5 active:scale-95">
                        {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 border border-orange-200 dark:border-orange-700 font-medium rounded-xl text-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all">
                      <FiEdit className="w-3.5 h-3.5" />
                      {isImpersonating ? "Edit (Admin)" : "Edit Profile"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-sm mb-6">
          {[
            { id: "profile", label: "Profile", icon: <FiUser size={13} /> },
            // { id: "plan", label: "Plan Info", icon: <BsBoxSeam size={13} /> },
            { id: "security", label: "Security", icon: <FiShield size={13} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl">
                <FiUser className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Contact details and address</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {fields.map((field, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${field.color}`}>
                    {React.cloneElement(field.icon, { className: "w-4 h-4" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{field.label}</p>
                    {isEditing ? (
                      <input value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="mt-0.5 w-full bg-white dark:bg-gray-700 border border-orange-200 dark:border-orange-700 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-100 transition-all" />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 truncate">
                        {user?.[field.key] || <span className="text-gray-400 italic text-xs">Not set</span>}
                      </p>
                    )}
                  </div>
                  {!isEditing && user?.[field.key] && <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Account meta */}
            <div className="px-5 pb-5">
              <div className="bg-orange-50/60 dark:bg-gray-700/30 rounded-xl p-4 border border-orange-100 dark:border-gray-700">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Account Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Account Type", value: "Lender" },
                    { label: "User ID", value: user?._id?.slice(-8).toUpperCase() || "N/A" },
                  ].map((info, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[11px] font-medium text-gray-400">{info.label}</span>
                      <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Plan Tab ── */}
        {activeTab === "plan" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                <BsBoxSeam className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Subscription Plan</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Your current plan and validity</p>
              </div>
            </div>

            <div className="p-5">
              {user?.currentPlan || user?.planPurchaseDetails ? (
                <div className="space-y-3">
                  {/* Plan name banner */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Current Plan</p>
                    <h3 className="text-xl font-bold">{user?.currentPlan?.planName || "Active Plan"}</h3>
                    <p className="text-white/70 text-sm mt-0.5">₹{user?.currentPlan?.priceMonthly?.toLocaleString() || "—"}/month · {user?.currentPlan?.duration || "—"}</p>
                  </div>

                  {/* Purchase details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Purchase Date", value: user?.planPurchaseDetails?.planPurchaseDate ? new Date(user.planPurchaseDetails.planPurchaseDate).toLocaleDateString("en-IN") : "N/A", color: "text-gray-800 dark:text-gray-200" },
                      { label: "Expiry Date", value: user?.planPurchaseDetails?.planExpiryDate ? new Date(user.planPurchaseDetails.planExpiryDate).toLocaleDateString("en-IN") : "N/A", color: "text-rose-600" },
                      { label: "Status", value: user?.planPurchaseDetails?.planStatus || "N/A", color: user?.planPurchaseDetails?.isPlanActive ? "text-green-600" : "text-amber-600" },
                      { label: "Days Remaining", value: `${user?.planPurchaseDetails?.remainingDays ?? 0} days`, color: (user?.planPurchaseDetails?.remainingDays || 0) > 0 ? "text-green-600" : "text-red-600" },
                    ].map((row, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{row.label}</p>
                        <p className={`text-sm font-semibold mt-0.5 ${row.color}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  {user?.currentPlan?.planFeatures && (
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Plan Features</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["unlimitedLoans", "advancedAnalytics", "prioritySupport"].map(key => {
                          const val = user.currentPlan.planFeatures?.[key] ?? false;
                          return (
                            <div key={key} className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium ${val ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-700" : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700 text-gray-400"}`}>
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black ${val ? "bg-green-500 text-white" : "bg-gray-300 text-white"}`}>
                                {val ? "✓" : "×"}
                              </span>
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <BsBoxSeam className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No active plan found</p>
                  <p className="text-xs text-gray-400 mt-1">Plan information will appear here once subscribed</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === "security" && (
          <div className="space-y-5">
            {/* Impersonation notice in security tab */}
            {isImpersonating && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-5 py-4">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  ⚠️ Admin cannot change this lender's password from impersonation mode.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  This section is read-only while impersonating. Ask the lender to change their own password.
                </p>
              </div>
            )}

            {/* Change Password */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden ${isImpersonating ? "opacity-60 pointer-events-none" : ""}`}>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl">
                  <LuShieldCheck className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Keep your account secure</p>
                </div>
              </div>

              <form onSubmit={handleChangePw} className="p-5 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                  <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                    <LuKey size={15} className="ml-4 text-gray-400 flex-shrink-0" />
                    <input type={showPw.cur ? "text" : "password"} value={pwForm.currentPassword}
                      onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400" />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, cur: !p.cur }))}
                      className="mr-4 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors">
                      {showPw.cur ? <LuEye size={15} /> : <LuEyeOff size={15} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "New Password", key: "newPassword", show: showPw.new, toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
                    { label: "Confirm New Password", key: "confirmNewPassword", show: showPw.conf, toggle: () => setShowPw(p => ({ ...p, conf: !p.conf })) },
                  ].map(({ label, key, show: s, toggle }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                      <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                        <input type={s ? "text" : "password"} value={pwForm[key]}
                          onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                          placeholder={label}
                          className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl" />
                        <button type="button" onClick={toggle}
                          className="mr-4 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors">
                          {s ? <LuEye size={15} /> : <LuEyeOff size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Password strength */}
                <div className="bg-orange-50/60 dark:bg-gray-700/30 rounded-xl p-3 border border-orange-100 dark:border-gray-700">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Requirements</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {[
                      { label: "Min 6 characters", met: pwForm.newPassword.length >= 6 },
                      { label: "Has uppercase", met: /[A-Z]/.test(pwForm.newPassword) },
                      { label: "Has number", met: /\d/.test(pwForm.newPassword) },
                    ].map((req, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-[11px] font-medium ${req.met ? "text-green-600" : "text-gray-400"}`}>
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${req.met ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"}`}>
                          {req.met && <FiCheck className="w-2 h-2 text-white" />}
                        </div>
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={isLoading}
                    className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm cursor-pointer transition-all shadow-sm active:scale-95 disabled:opacity-60 flex items-center gap-2">
                    {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LuShieldCheck size={14} />}
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}