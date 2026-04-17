import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FiShield } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../store/authSlice";
import { PiClockCounterClockwise } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import { MdCurrencyRupee } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FiUser } from "react-icons/fi";

const menuItems = [
  { key: "dashboard", path: "/dashboard", icon: <MdOutlineDashboardCustomize /> },
  { key: "plans", path: "/plans", icon: <MdOutlineSubscriptions /> },
  { key: "revenue", path: "/revenue", icon: <MdCurrencyRupee /> },
  { key: "lenders", path: "/lenders", icon: <FiUsers /> },
  { key: "activity", path: "/activityDetails", icon: <PiClockCounterClockwise /> },
  { key: "settings", path: "/password", icon: <CiSettings className="h-5.5 w-5.5" /> },
  { key: "profile", path: "/profile", icon: <FiUser /> }
];



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
          {type === "success" ? "Action completed successfully." : "Something went wrong."}
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

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
}) {

  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  const { t } = useTranslation();


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
    fixed inset-y-0 left-0 z-50 bg-white border-r border-orange-100 dark:bg-gray-900 dark:border-gray-700
    shadow-xl overflow-visible
    
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    ${isCollapsed ? "lg:w-20" : "lg:w-72"}
    w-72
  `}
      >


        <div className="h-full flex flex-col">
          {/* Header / Logo */}

          <div className={`border-b border-orange-100 flex items-center dark:border-gray-700
           ${isCollapsed
              ? "justify-center p-3"
              : "justify-between px-5 py-4"
            }`}>

            {isCollapsed ? (
              // ── Collapsed: orange gradient LH icon ──
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                  <span style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "14px",
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}>LH</span>
                </div>
                {/* White dot accent */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-orange-500" />
              </div>

            ) : (
              // ── Expanded: full LoanHub logo ──
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                    <span style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "14px",
                      fontWeight: 900,
                      color: "white",
                      letterSpacing: "-1px",
                      lineHeight: 1,
                    }}>LH</span>
                  </div>
                  {/* White dot accent */}
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-orange-500" />
                </div>

                {/* Text */}
                <div>
                  <p style={{ margin: 0, lineHeight: 1.2 }}>
                    <span style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "17px",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>Loan</span>
                    <span style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "17px",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                      color: "#0f172a",
                    }}>Hub</span>
                  </p>
                  <p style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "8px",
                    fontWeight: 600,
                    color: "#f97316",
                    letterSpacing: "2.5px",
                    margin: 0,
                    opacity: 0.8,
                  }}>LENDING PLATFORM</p>
                </div>
              </div>
            )}

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-500 dark:text-gray-400 dark:hover-text-orange-400 hover:text-orange-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto dark:bg-gray-900">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex relative items-center rounded-xl 
      ${isCollapsed ? "justify-center py-4" : "px-4 py-3 gap-3"}
      ${location.pathname === item.path
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400 hover:bg-orange-50 hover:text-orange-700"
                  }`}
              >
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <span className="fixed left-[70px] bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all z-[9999]">
                    {t(`sidebar.${item.key}`)}
                  </span>
                )}

                {/* Icon */}
                <span className={`text-xl transition-colors ${location.pathname === item.path ? "text-orange-600" : "text-gray-500 group-hover:text-orange-600 dark:text-gray-400 dark:group-hover:text-orange-400"}`}>
                  {item.icon}
                </span>

                {/* Menu Name - Translated */}
                <span className={`text-sm font-medium ${isCollapsed ? "lg:hidden" : "block"}`}>
                  {t(`sidebar.${item.key}`)}
                </span>
              </Link>
            ))}
          </nav>


          <div className="p-4 border-t border-orange-100 dark:border-gray-700">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 dark:hover:bg-red-900/30 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <FiLogOut className="text-lg" />

              <span
                className={`
        text-sm font-medium
        ${isCollapsed ? "lg:hidden" : "block"}
      `}
              >
                {t("sidebar.logout")}
              </span>
            </button>
          </div>


          {/* Footer (optional subtle info) */}
          {!isCollapsed && (
            <div className="p-4 border-t border-orange-100 dark:border-gray-700 dark:text-gray-400 text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} LoanAdmin. All rights reserved
            </div>
          )}
        </div>
      </aside>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-white/70 dark:border-gray-700">

            {/* Header */}
            <div className="bg-orange-500 px-6 py-5 border-b border-orange-200">
              <h3 className="text-xl font-bold !text-white flex items-center gap-3">
                <FiLogOut className="w-6 h-6 text-white" />
                {t("sidebar.confirmLogout")}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-800 dark:text-gray-200 text-center font-medium">
                {t("sidebar.logoutQuestion")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t("sidebar.logoutNote")}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-all cursor-pointer"
              >
                {t("sidebar.cancel")}
              </button>

              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  showToast({ type: "success", message: "Logout successfully!" });
                  setTimeout(() => {
                    dispatch(logout());
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                  }, 1500);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t("sidebar.confirm")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}