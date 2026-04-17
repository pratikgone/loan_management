import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword } from "../store/authSlice";
import { FiUser, FiEdit, FiEdit2, FiCamera, FiShield, FiLock, FiCheck } from "react-icons/fi";
import { IoCallOutline, IoClose } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { LuKey, LuShieldCheck, LuEye, LuEyeOff } from "react-icons/lu";
import React from "react";
import axios from "axios";

// ── useToast (same as existing) ──────────────────────
let _id = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback(({ type, message }) => {
    const id = ++_id;
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, show };
}

function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium pointer-events-auto ${t.type === "success" ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-600"}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0 ${t.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {t.type === "success" ? "✓" : "!"}
          </div>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export  function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector(s => s.auth);
  const { toasts, show } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile"); // profile | security
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPic, setNewPic] = useState(null);

  const [form, setForm] = useState({ userName: "", mobileNo: "", email: "", address: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showPw, setShowPw] = useState({ cur: false, new: false, conf: false });

  const displayName = user?.userName || user?.name || "User";
  const userInitials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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
    if (!/^\d{10}$/.test(form.mobileNo)) { show({ type: "error", message: "Mobile must be exactly 10 digits" }); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { show({ type: "error", message: "Enter a valid email address" }); return; }
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
      show({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
      setNewPic(null); setPreviewUrl(null);
    } catch { show({ type: "error", message: "Failed to update profile" }); }
    finally { setIsSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmNewPassword) { show({ type: "error", message: "All fields are required" }); return; }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { show({ type: "error", message: "New passwords do not match" }); return; }
    if (pwForm.newPassword.length < 6) { show({ type: "error", message: "Password must be at least 6 characters" }); return; }
    if (pwForm.currentPassword === pwForm.newPassword) { show({ type: "error", message: "New password must differ from current" }); return; }
    try {
      await dispatch(changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword, confirmNewPassword: pwForm.confirmNewPassword })).unwrap();
      show({ type: "success", message: "Password changed successfully!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch { show({ type: "error", message: "Failed to change password. Check current password." }); }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser size={14} /> },
    { id: "security", label: "Security", icon: <FiShield size={14} /> },
  ];

  const fields = [
    { label: "Full Name", key: "userName", icon: <FiUser />, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20", type: "text" },
    { label: "Mobile Number", key: "mobileNo", icon: <IoCallOutline />, color: "text-green-500 bg-green-50 dark:bg-green-900/20", type: "tel" },
    { label: "Email Address", key: "email", icon: <MdOutlineEmail />, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20", type: "email" },
    { label: "Address", key: "address", icon: <CiLocationOn />, color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20", type: "text" },
  ];

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <Toast toasts={toasts} />
      <div className="p-5 sm:p-6 lg:p-8 max-w-3xl mx-auto">

        {/* Back + Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal info and account security</p>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-orange-500 to-orange-400 relative">
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute" style={{ width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)", top: -30, right: 40 }} />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-orange-100">
                  {previewUrl || profilePic ? (
                    <img src={previewUrl || profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-2xl font-bold">{userInitials}</div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors">
                      <FiCamera className="w-3.5 h-3.5 text-white" />
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                  </>
                )}
              </div>

              {/* Name + Role */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{displayName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${user?.roleId === 0 ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                  {user?.roleId === 0 ? "Admin" : "Lender"}
                </span>
              </div>

              {/* Edit / Save button */}
              {activeTab === "profile" && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => { setIsEditing(false); setNewPic(null); setPreviewUrl(null); }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        Cancel
                      </button>
                      <button onClick={handleSaveProfile} disabled={isSaving}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm cursor-pointer transition-all shadow-sm disabled:opacity-60 flex items-center gap-2 active:scale-95">
                        {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 border border-orange-200 dark:border-orange-700 font-medium rounded-xl text-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all">
                      <FiEdit className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-sm mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
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
                <p className="text-[11px] text-gray-400 mt-0.5">Update your name, contact and address</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {fields.map((field, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700 transition-all">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${field.color}`}>
                    {React.cloneElement(field.icon, { className: "w-4 h-4" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{field.label}</p>
                    {isEditing ? (
                      <input type={field.type} value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="mt-0.5 w-full bg-white dark:bg-gray-700 border border-orange-200 dark:border-orange-700 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all" />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 truncate">
                        {user?.[field.key] || <span className="text-gray-400 italic text-xs">Not set</span>}
                      </p>
                    )}
                  </div>
                  {!isEditing && user?.[field.key] && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === "security" && (
          <div className="space-y-5">
            {/* Change Password */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl">
                  <LuShieldCheck className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Keep your account secure with a strong password</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="p-5 space-y-4">
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
                      className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                      {showPw.cur ? <LuEye size={15} /> : <LuEyeOff size={15} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                      <input type={showPw.new ? "text" : "password"} value={pwForm.newPassword}
                        onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        placeholder="New password"
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl" />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                        className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                        {showPw.new ? <LuEye size={15} /> : <LuEyeOff size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all">
                      <input type={showPw.conf ? "text" : "password"} value={pwForm.confirmNewPassword}
                        onChange={e => setPwForm({ ...pwForm, confirmNewPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl" />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, conf: !p.conf }))}
                        className="mr-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                        {showPw.conf ? <LuEye size={15} /> : <LuEyeOff size={15} />}
                      </button>
                    </div>
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