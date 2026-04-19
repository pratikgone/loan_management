import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";   // ← useEffect add kiya
import { CiLogout } from "react-icons/ci";
import { logout, stopImpersonation } from "../store/authSlice";
import { useDarkMode } from "../components/useDarkMode";
import { useTranslation } from "react-i18next";

export function LenderNavbar({ toggleSidebar, isCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const { user, isImpersonating: reduxIsImpersonating } = useSelector(s => s.auth);

  
    const { isDark, toggle } = useDarkMode();

    const {t} = useTranslation();

  // LocalStorage 
  const [isImpersonating, setIsImpersonating] = useState(false);

  

  useEffect(() => {
  const stored = localStorage.getItem("isImpersonating") === "true";
  setIsImpersonating(reduxIsImpersonating || stored);
}, [reduxIsImpersonating]);

  const displayName = user?.userName || user?.name || "Lender";
  const userInitials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleExitImpersonation = () => {
    dispatch(stopImpersonation());
    navigate("/lenders", { replace: true });
  };

  return (
    <>
      <header className={`bg-white border-b border-orange-100 shadow-sm fixed top-0 right-0 left-0 z-50
        ${isCollapsed ? "lg:left-20" : "lg:left-72"}`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <button onClick={toggleSidebar}
              className="text-gray-600 hover:text-orange-600 focus:outline-none cursor-pointer">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 
                  flex items-center justify-center text-white font-semibold shadow-md">
                  {userInitials}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500">Lender</p>
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

              {/* Exit Impersonation Button */}
              {isImpersonating && (
                <button
                  onClick={handleExitImpersonation}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-600 
                    hover:bg-amber-50 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-amber-200"
                >
                  ✕ Exit 
                </button>
              )}

              
            </div>
          </div>
        </div>
      </header>

    
    </>
  );
}

export default LenderNavbar;