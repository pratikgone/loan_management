// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { logout, updateProfile } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { CiCircleInfo } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import React from "react";
import axios from "axios";




export function Navbar({ toggleSidebar, isCollapsed }) {

  const dispatch = useDispatch();


  const navigate = useNavigate();

  // Auth slice to real user data  (login time save )
  const { isLoading, user } = useSelector((state) => state.auth || {});


  const [isEditing, setIsEditing] = useState(false);

  const [toast, setToast] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);



  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000)
      return () => clearTimeout(timer);
    }
  }, [toast]);




  // Real username (fallback bhi rakha hai)
  const displayName = user?.userName || user?.name || "Admin";
  const profilePic = user?.profileImage || user?.profilePicture || null;
  const userInitials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // const fileInputRef = useRef(null);

  // Sync form with user data when modal opens
  useEffect(() => {
    if (isProfileModalOpen && user) {
      setEditForm({
        userName: user.userName || user.name || "",
        mobileNo: user.mobileNo || "",
        email: user.email || "",
        address: user.address || "",
      });
      setNewProfilePic(null);
      setPreviewUrl(null);
    }
  }, [isProfileModalOpen, user]);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setNewProfilePic(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => setPreviewUrl(reader.result);
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRetake = () => {
  //   setNewProfilePic(null);
  //   setPreviewUrl(null);
  //   if (fileInputRef.current) fileInputRef.current.value = null;
  // };

  const handleSave = async () => {
    setIsSaving(true);
    try {

      const payload = {
        userData: {
          userName: editForm.userName,
          email: editForm.email,
          mobileNo: editForm.mobileNo,
          address: editForm.address
        }
      };

      await dispatch(updateProfile(payload)).unwrap();

      setIsEditing(false);
      setNewProfilePic(null);
      setPreviewUrl(null);
      setToast({ type: "success", message: "Profile Updated Successfully!" });
      setIsProfileModalOpen(false);

    } catch (error) {
      setToast({ type: "error", message: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);


  return (
    <>
      {/* // src/components/Navbar.jsx */}
      <header className={`bg-white border-b border-orange-100 shadow-sm fixed top-0 right-0 left-0 z-50
  ${isCollapsed ? "lg:left-20" : "lg:left-72"}
`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-orange-600 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle sidebar"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo: navbar*/}
              <Link to="/dashboard" className="flex items-center gap-2">
                <img 
                src="/logo.png"
                alt="Loan Admin Logo"
                className="h-9 w-auto rounded-lg object-contain bg-gradient-to-br from-orange-500 to-orange-600 flex item shadow-md">
                  
                </img>
                {/* Full name optional - in mobile small view */}
                <span className="text-xl font-bold text-orange-600 tracking-tight hidden">
                  LoanAdmin
                </span>
              </Link>
            </div>

            {/* Right: Notification + Profile + Logout */}
            <div className="flex items-center gap-6">
              {/* username Profile */}
              <div onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-orange-100">
                  {userInitials}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>

              {/* Logout */}
              <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50  transition-colors focus:outline-none cursor-pointer">
                <CiLogout className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* toast message */}
      {toast && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in 
                  w-[92%] sm:w-auto min-w-[280px] max-w-[420px]">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 border backdrop-blur-md ${toast.type === "success" ? "bg-green-600 border border-green-700" : "bg-red-600 border border-red-700"
            }`}>
            <div className="shrink-0">
              {toast.type === "success" ? (
                <IoMdCheckmarkCircleOutline className="w-5 h-5 sm:w-6 sm:h-6 " />
              ) : (
                <AiOutlineCloseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <span className="text-sm sm:text-base leading-tight">{toast.message}</span>

            {/* Optional: Close line/timer effect */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress-shrink rounded-full" />
          </div>
        </div>
      )}

      {/* Logout confirmation popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-orange-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <FiLogOut className="w-6 h-6 text-orange-600" />
                Confirm Logout
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-center">
                Are you sure you want to logout?
              </p>
              <p className="text-sm text-gray-500 text-center">
                You'll need to sign in again to access your account.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 px-6 py-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-all cursor-pointer"
              >
                No, Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setToast({ type: "success", message: "Logout successfully!" });

                  setTimeout(() => {
                    dispatch(logout());
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate("/");
                  }, 1500);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden transform transition-all">

            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-5 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Profile Details</h2>
              <button onClick={() => { setIsProfileModalOpen(false); setIsEditing(false); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-3xl font-light cursor-pointer">×</button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-orange-50 shadow-xl overflow-hidden mb-4 bg-orange-100 flex items-center justify-center">
                  {newProfilePic || previewUrl ? (
                    <img src={previewUrl || URL.createObjectURL(newProfilePic)} alt="Preview" className="w-full h-full object-cover" />
                  ) : profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-4xl sm:text-5xl font-bold">{userInitials}</div>
                  )}
                  {/* {isEditing && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )} */}
                  {/* {newProfilePic && (
                    <button
                      onClick={handleRetake}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  )} */}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">{displayName}</h3>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg"><CiCircleInfo className="w-5 h-5 text-indigo-600" /></div>
                  <h4 className="text-lg font-bold text-gray-900">Personal Information</h4>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Name", key: "userName", icon: <FiUser />, color: "bg-blue-100 text-blue-600" },
                    { label: "Phone Number", key: "mobileNo", icon: <IoCallOutline />, color: "bg-green-100 text-green-600" },
                    { label: "Email Address", key: "email", icon: <MdOutlineEmail />, color: "bg-orange-100 text-orange-600" },
                    { label: "Address", key: "address", icon: <CiLocationOn />, color: "bg-rose-100 text-rose-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                          {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{item.label}</span>
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          name={item.key}
                          value={editForm[item.key]}
                          onChange={handleChange}
                          className="text-sm font-bold text-gray-900 bg-orange-50/50 border border-orange-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-orange-400 w-full sm:w-auto sm:text-right"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-800 break-words sm:text-right pl-10 sm:pl-0">
                          {user?.[item.key] || "Not available"}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Aadhar Row - Non editable for safety */}
                  {!isEditing && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><FiCreditCard className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Aadhar Number</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 sm:text-right pl-10 sm:pl-0">{user?.aadharCardNo || "Not available"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {isEditing ? (
                <>
                  <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all active:scale-95 cursor-pointer">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full mt-1">
                    <button onClick={() => setIsEditing(true)} className="flex-1 max-w-[160px] py-2.5 px-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                      <FiEdit className="w-4 h-4 flex-shrink-0" /><span className="whitespace-nowrap">Edit Profile</span>
                    </button>
                    <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 max-w-[120px] py-2.5 px-3 bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg border border-gray-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                      <FiXCircle className="w-4 h-4 flex-shrink-0" /> Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

}