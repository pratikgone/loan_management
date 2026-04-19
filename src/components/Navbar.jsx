
import { Link } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { FiLogOut } from "react-icons/fi";
import React from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDarkMode } from "./useDarkMode";
import { useTranslation } from "react-i18next";
import { t } from "i18next";



//  Toast Icons 
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
          {type === "success" ? t("toast.success") : t("toast.error")}
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


export function Navbar({ toggleSidebar, isCollapsed }) {

  const dispatch = useDispatch();


  const navigate = useNavigate();

  // Auth slice to real user data  (login time save )
  const { isLoading, user } = useSelector((state) => state.auth || {});

  const { toasts, showToast, removeToast } = useToast();


  const [isEditing, setIsEditing] = useState(false);



  




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
  const fileInputRef = useRef(null);


  const { isDark, toggle } = useDarkMode();


  // Sync form with user data when modal opens
  useEffect(() => {
    if (isProfileModalOpen && user) {
      let mobile = user.mobileNo || "";

      //remove the country code
      mobile = mobile.replace(/^\+91/, "").slice(-10);

      setEditForm({
        userName: user.userName || user.name || "",
        mobileNo: mobile,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setNewProfilePic(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const validateProfile = (data) => {

    if (!/^\d{10}$/.test(data.mobileNo)) {
      return "Mobile number must be exactly 10 digits";
    }

    // basic email check
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      return "Enter valid email";
    }

    return null; // no error
  };

  const handleSave = async () => {


    const validationError = validateProfile(editForm);

    if (validationError) {
      showToast({ type: "error", message: validationError });
      return;
    }

    setIsSaving(true);
    // console.log("Uploading image...", newProfilePic);

    try {
      const payload = {
        userData: {
          userName: editForm.userName,
          email: editForm.email,
          mobileNo: editForm.mobileNo,
          address: editForm.address,
        },
      };

      await dispatch(updateProfile(payload)).unwrap();

      //  image upload 
      if (newProfilePic) {
        const imgData = new FormData();
        imgData.append("profileImage", newProfilePic);

        const token = localStorage.getItem("token");

        const res = await axios.post(
          "https://loan-backend-cv1k.onrender.com/api/user/uploadProfileImage",
          imgData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //  update redux + localStorage
        dispatch({
          type: "auth/updateProfile/fulfilled",
          payload: res.data.user,
        });

        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setIsEditing(false);
      setNewProfilePic(null);
      setPreviewUrl(null);

      showToast({ type: "success", message: t("toast.profileUpdated") });
      setIsProfileModalOpen(false);

    } catch (error) {
      console.log(error);
      showToast({ type: "error", message: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const { t, i18n } = useTranslation();


  return (
    <>
      {/* // src/components/Navbar.jsx */}
      <header className={`bg-white border-b border-orange-100 dark:bg-gray-900 dark:border-gray-700 shadow-sm fixed top-0 right-0 left-0 z-50
  ${isCollapsed ? "lg:left-20" : "lg:left-72"}
`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover-text-orange-400 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle sidebar"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Right: Notification + Profile + Logout */}
            <div className="flex items-center gap-6">
              {/* username Profile */}
              <div onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 dark:ring-orange-500/30 ring-orange-100">
                  {userInitials}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("navbar.admin")}</p>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggle}
                className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none flex-shrink-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, #1e1b4b, #3730a3)"
                    : "linear-gradient(135deg, #fed7aa, #f97316)",
                }}
                title={isDark ? t("navbar.lightMode") : t("navbar.darkMode")}
              >
                {/* Track icons */}
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px]">
                  ☀️
                </span>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px]">
                  🌙
                </span>

                {/* Thumb */}
                <span
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md
      transition-transform duration-300 flex items-center justify-center text-xs
      ${isDark ? "translate-x-7" : "translate-x-0.5"}`}
                >
                  {isDark ? "🌙" : "☀️"}
                </span>
              </button>

               
             {/* Language */}
            <select onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="hidden sm:block bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer outline-none">
              <option value="en">EN</option>
              <option value="hi">हि</option>
              <option value="mr">म</option>
            </select>
             

           
            </div>
          </div>
        </div>
      </header>


      {/* toast message */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

     

      {/* Profile Details Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-white/70 dark:border-gray-700 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden transform transition-all">

            <div className="bg-orange-500 px-6 py-5 text-white font-bold flex justify-between items-center shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("profileModal.title")}</h2>
              <button onClick={() => { setIsProfileModalOpen(false); setIsEditing(false); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-3xl font-light cursor-pointer">×</button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-orange-50 shadow-xl overflow-hidden mb-4 bg-orange-100 flex items-center justify-center">
                  {newProfilePic || previewUrl ? (
                    <img src={previewUrl || URL.createObjectURL(newProfilePic)} alt="Preview" className="w-full h-full object-cover" />
                  ) : profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-4xl sm:text-5xl font-bold">{userInitials}</div>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                  )}


                  {/*  Edit Icon */}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-orange-100 transition cursor-pointer"
                    >
                      <FiEdit2 className="text-orange-600 w-4 h-4" />
                    </button>
                  )}

                  {/*  Cancel Icon */}
                  {isEditing && newProfilePic && (
                    <button
                      onClick={handleRetake}
                      className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full shadow-md hover:bg-red-600 transition cursor-pointer"
                    >
                      <IoClose className="text-white w-4 h-4" />
                    </button>
                  )}

                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{displayName}</h3>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg"><CiCircleInfo className="w-5 h-5 text-indigo-600" /></div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white"><h4>{t("profileModal.personalInfo")}</h4></h4>
                </div>

                <div className="space-y-3">
                  {[
                    { label: t("profileModal.name"), key: "userName", icon: <FiUser />, color: "bg-blue-100 text-blue-600" },
                    { label: t("profileModal.phone"), key: "mobileNo", icon: <IoCallOutline />, color: "bg-green-100 text-green-600" },
                    { label: t("profileModal.email"), key: "email", icon: <MdOutlineEmail />, color: "bg-orange-100 text-orange-600" },
                    { label: t("profileModal.address"), key: "address", icon: <CiLocationOn />, color: "bg-rose-100 text-rose-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm transition-all gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                          {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.label}</span>
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          name={item.key}
                          value={editForm[item.key]}
                          onChange={handleChange}
                          className="text-sm font-bold text-gray-900 dark:text-white bg-orange-50/50 dark:bg-gray-800 border border-orange-200 dark:border-gray-600 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-orange-400 w-full sm:w-auto sm:text-right"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 break-words sm:text-right pl-10 sm:pl-0">
                          {user?.[item.key] || t("profileModal.notAvailable")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {isEditing ? (
                <>
                  <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                    {isSaving ? t("profileModal.saveChanges") : t("profileModal.saveChanges")}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-all active:scale-95 cursor-pointer">
                    {t("profileModal.cancel")}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full mt-1">
                    <button onClick={() => setIsEditing(true)} className="flex-1 max-w-[160px] py-2.5 px-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                      <FiEdit className="w-4 h-4 flex-shrink-0" /><span className="whitespace-nowrap">{t("profileModal.editProfile")}</span>
                    </button>
                    <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 max-w-[120px] py-2.5 px-3 text-sm font-semibold rounded-lg border bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                      <FiXCircle className="w-4 h-4 flex-shrink-0" /> {t("profileModal.close")}
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

export default Navbar;