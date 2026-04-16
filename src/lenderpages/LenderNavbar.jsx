import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";   // ← useEffect add kiya
import { CiLogout } from "react-icons/ci";
import { logout, stopImpersonation } from "../store/authSlice";

export function LenderNavbar({ toggleSidebar, isCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const { user, isImpersonating: reduxIsImpersonating } = useSelector(s => s.auth);

  // LocalStorage se bhi check karo (refresh ke baad button dikhane ke liye)
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const storedImpersonating = localStorage.getItem("isImpersonating") === "true";
    setIsImpersonating(reduxIsImpersonating || storedImpersonating);
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

              {/* Impersonation Indicator */}
              <div className="flex items-center gap-3">
                {isImpersonating && (
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1
                    bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    🔄 Impersonating
                  </span>
                )}

                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1
                  bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
                  🏦 Lender Account
                </span>
              </div>

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

              {/* Exit Impersonation Button */}
              {isImpersonating && (
                <button
                  onClick={handleExitImpersonation}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-600 
                    hover:bg-amber-50 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-amber-200"
                >
                  ✕ Exit Impersonation
                </button>
              )}

              {/* Normal Logout */}
              <button 
                onClick={() => setShowLogout(true)}
                className="flex items-center gap-2 text-sm font-medium text-red-600 
                  hover:bg-red-50 transition-colors cursor-pointer px-3 py-2 rounded-xl"
              >
                <CiLogout className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b">
              <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
            </div>
            <div className="p-6 text-center text-gray-700">Are you sure you want to logout?</div>
            <div className="flex gap-4 px-6 py-5 border-t bg-gray-50">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                dispatch(logout());
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }} className="flex-1 py-3 bg-red-600 text-white font-medium rounded-xl cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LenderNavbar;