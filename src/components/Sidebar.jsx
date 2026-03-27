import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FiShield } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../store/authSlice";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdOutlineDashboardCustomize /> },
  { name: "Plans", path: "/plans", icon: <MdOutlineSubscriptions /> },
  { name: "Revenue", path: "/revenue", icon: <FiDollarSign /> },
  { name: "Lenders", path: "/lenders", icon: <FiUsers /> },
  { name: "Help & Support", path: "/support", icon: <IoIosHelpCircleOutline className="h-5.5 w-5.5 stroke-[1]"/> },
  { name: "Privacy & Security", path: "/security", icon: <FiShield /> },
  {
    name: "Change Password", path: "/password", icon: <CiLock className="h-5.5 w-5.5 stroke-[0.5]"/>
  },
];

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
}) {

  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);


  useEffect(()=>{
     if (toast) {
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
  },[toast]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-50 bg-white border-r border-orange-100
    shadow-xl
    
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    ${isCollapsed ? "lg:w-20" : "lg:w-72"}
    w-72
  `}
      >

       
        <div className="h-full flex flex-col">
          {/* Header / Logo */}
          <div className="p-6 border-b border-orange-100 flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                LoanAdmin
              </h2>
            )}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-500 hover:text-orange-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group flex items-center rounded-xl 
                  ${isCollapsed ? "justify-center py-4" : "px-4 py-3 gap-3"}
                  ${location.pathname === item.path
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }
                `}
              >
                <span
                  className={`
                    text-xl transition-colors
                    ${location.pathname === item.path ? "text-orange-600" : "text-gray-500 group-hover:text-orange-600"}
                  `}
                >
                  {item.icon}
                </span>
                <span
                  className={`
                  text-sm font-medium
                  ${isCollapsed ? "lg:hidden" : "block"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>


          <div className="p-4 border-t border-orange-100">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <FiLogOut className="text-lg" />

              <span
                className={`
        text-sm font-medium
        ${isCollapsed ? "lg:hidden" : "block"}
      `}
              >
                Logout
              </span>
            </button>
          </div>


          {/* Footer (optional subtle info) */}
          {!isCollapsed && (
            <div className="p-4 border-t border-orange-100 text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} LoanAdmin. All rights reserved
            </div>
          )}
        </div>
      </aside>
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
              localStorage.removeItem("token");
              localStorage.removeItem("user");
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

{toast && (
  <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[200] animate-fade-in 
            w-[92%] sm:w-auto min-w-[280px] max-w-[420px]">
    <div className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 border backdrop-blur-md ${
      toast.type === "success"
        ? "bg-green-600 border-green-700"
        : "bg-red-600 border-red-700"
    }`}>
      <div className="shrink-0">
        {toast.type === "success" ? (
          <IoMdCheckmarkCircleOutline className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <AiOutlineCloseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </div>
      <span className="text-sm sm:text-base">{toast.message}</span>

      <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress-shrink rounded-full" />
    </div>
  </div>
)}
    </>
  );
}