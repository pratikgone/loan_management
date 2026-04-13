import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FiUsers, FiFileText, FiLogOut } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../store/authSlice";

const lenderMenuItems = [
  { label: "Dashboard", path: "/lender/dashboard", icon: <MdOutlineDashboardCustomize /> },
  { label: "Borrowers",  path: "/lender/borrowers",  icon: <FiUsers /> },
  { label: "My Loans",   path: "/lender/loans",      icon: <FiFileText /> },
  { label: "Settings",   path: "/password",          icon: <CiSettings /> },
];

export default function LenderSidebar({ isMobileOpen, setIsMobileOpen, isCollapsed }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-orange-100 shadow-xl
        transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-72"} w-72
      `}>
        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className={`border-b border-orange-100 flex items-center
            ${isCollapsed ? "justify-center p-3" : "justify-between px-5 py-4"}`}>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400
                  to-orange-600 flex items-center justify-center shadow-md">
                  <span style={{ fontFamily: "system-ui", fontSize: "14px",
                    fontWeight: 900, color: "white", letterSpacing: "-1px" }}>LH</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white
                  rounded-full border-2 border-orange-500" />
              </div>
              {!isCollapsed && (
                <div>
                  <p style={{ margin: 0, lineHeight: 1.2 }}>
                    <span style={{ fontFamily: "system-ui", fontSize: "17px", fontWeight: 900,
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loan</span>
                    <span style={{ fontFamily: "system-ui", fontSize: "17px",
                      fontWeight: 900, color: "#0f172a" }}>Hub</span>
                  </p>
                  <p style={{ fontFamily: "system-ui", fontSize: "8px", fontWeight: 600,
                    color: "#f97316", letterSpacing: "2.5px", margin: 0 }}>LENDER PANEL</p>
                </div>
              )}
            </div>
            <button onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-500 hover:text-orange-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            {lenderMenuItems.map((item) => (
              <Link key={item.path} to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex relative items-center rounded-xl
                  ${isCollapsed ? "justify-center py-4" : "px-4 py-3 gap-3"}
                  ${location.pathname === item.path
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}>
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <span className="fixed left-[70px] bg-gray-900 text-white text-xs
                    font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-all z-[9999]">
                    {item.label}
                  </span>
                )}
                <span className={`text-xl ${location.pathname === item.path
                  ? "text-orange-600" : "text-gray-500 group-hover:text-orange-600"}`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-medium ${isCollapsed ? "lg:hidden" : "block"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-orange-100">
            <button onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600
                hover:bg-red-50 rounded-xl transition-all cursor-pointer">
              <FiLogOut className="text-lg flex-shrink-0" />
              <span className={`text-sm font-medium ${isCollapsed ? "lg:hidden" : "block"}`}>
                Logout
              </span>
            </button>
          </div>

          {!isCollapsed && (
            <div className="p-4 border-t border-orange-100 text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} LoanHub Lender
            </div>
          )}
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <FiLogOut className="w-6 h-6 text-orange-600" /> Confirm Logout
              </h3>
            </div>
            <div className="p-6 text-center text-gray-700">Are you sure you want to logout?</div>
            <div className="flex gap-4 px-6 py-5 border-t bg-gray-50">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800
                  font-medium rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                dispatch(logout());
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white
                font-medium rounded-xl cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}