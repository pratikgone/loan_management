import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLenderStats, fetchLenderActivities } from "../store/dashboardSlice";
import { FiFileText, FiUsers, FiDollarSign, FiActivity, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export function LenderDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isImpersonating } = useSelector((s) => s.auth);
  const { lenderStats, lenderActivities, isLoading } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchLenderStats());
    dispatch(fetchLenderActivities(5));
  }, [dispatch]);

  const displayName = user?.userName || user?.name || (isImpersonating ? "Impersonated Lender" : "Lender");
  const userInitials = displayName.split(" ").map(n => n?.[0] || "").join("").toUpperCase().slice(0, 2);

  const stats = lenderStats ? [
    { title: "Total Loans", value: lenderStats.counts?.totalLoans || 0, icon: <FiFileText className="w-5 h-5" />, color: "text-orange-600", bar: "bg-orange-400", bg: "bg-orange-50" },
    { title: "Total Amount", value: `₹${(lenderStats.totalLoanAmount || 0).toLocaleString()}`, icon: <FiDollarSign className="w-5 h-5" />, color: "text-blue-600", bar: "bg-blue-400", bg: "bg-blue-50" },
    { title: "Amount Received", value: `₹${(lenderStats.totalPaidAmount || 0).toLocaleString()}`, icon: <FiTrendingUp className="w-5 h-5" />, color: "text-green-600", bar: "bg-green-400", bg: "bg-green-50" },
    { title: "Pending Amount", value: `₹${(lenderStats.totalPendingAmount || 0).toLocaleString()}`, icon: <FiAlertCircle className="w-5 h-5" />, color: "text-red-500", bar: "bg-red-400", bg: "bg-red-50" },
  ] : [];

  if (isLoading && !lenderStats) return (
    <div className="flex items-center justify-center h-[65vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Loading dashboard...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Lender Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isImpersonating ? "You are viewing this lender account as admin" : "Manage your loans & borrowers"}
            </p>
          </div>
          {isImpersonating && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 border border-purple-200 dark:border-purple-700 flex-shrink-0">
              🔄 Admin Session
            </span>
          )}
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8"
          style={{ background: "linear-gradient(130deg, #f97316, #fb923c, #fbbf24)" }}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute rounded-full" style={{ width: 180, height: 180, background: "rgba(255,255,255,0.08)", top: -50, right: 60 }} />
          <div className="absolute rounded-full" style={{ width: 90, height: 90, background: "rgba(255,255,255,0.05)", bottom: -20, right: 200 }} />

          <div className="relative px-6 py-8 md:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="inline-block text-[10px] font-bold text-white/80 bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                {isImpersonating ? "Impersonated Session" : "Lender Panel"}
              </span>
              <p className="text-white/75 text-sm">Welcome back,</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-0.5">{displayName}</h2>
              <p className="text-white/65 text-sm mt-2">
                {isImpersonating ? "Admin view — all actions are permitted" : "Here's your loan overview for today"}
              </p>

              {/* Quick stats inline */}
              {lenderStats && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  <span className="text-xs text-white/80 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                    {lenderStats.counts?.totalLoans || 0} total loans
                  </span>
                  <span className="text-xs text-white/80 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                    ₹{(lenderStats.totalPaidAmount || 0).toLocaleString()} received
                  </span>
                </div>
              )}
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0">
              {userInitials}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Loan Overview</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white shadow-md border border-orange-100 dark:bg-gray-800 dark:border-gray-700">
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.45) 0%,transparent 60%)" }} />
                  <div className="relative flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 relative">{stat.title}</p>
                  <p className={`text-xl font-semibold relative mt-1 ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-end gap-0.5 h-5 mt-3 relative">
                    {[40, 65, 50, 80, 60, 100, 75].map((h, j) => (
                      <div key={j} className={`flex-1 rounded-sm opacity-50 ${stat.bar}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick Actions */}
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div onClick={() => navigate("/lender/borrowers")}
            className="relative cursor-pointer rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 4px 20px rgba(59,130,246,0.2)" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: 90, height: 90, background: "rgba(255,255,255,0.1)", top: -25, right: -15 }} />
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm bg-white/20">↗</div>
            <h3 className="text-base font-semibold text-white relative z-10">My Borrowers</h3>
            <p className="text-sm mt-1 relative z-10 text-white/75">View and manage all borrowers</p>
          </div>

          <div onClick={() => navigate("/lender/loans")}
            className="relative cursor-pointer rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 20px rgba(16,185,129,0.2)" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: 90, height: 90, background: "rgba(255,255,255,0.1)", top: -25, right: -15 }} />
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm bg-white/20">↗</div>
            <h3 className="text-base font-semibold text-white relative z-10">My Loans</h3>
            <p className="text-sm mt-1 relative z-10 text-white/75">Track all loans and payments</p>
          </div>
        </div>

        {/* Recent Activity */}
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Recent Activity</p>
        <div className="bg-white/60 dark:bg-gray-800 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-gray-700 overflow-hidden">
          {lenderActivities?.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {lenderActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                    <FiActivity className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.shortMessage || "Activity"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{activity.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{activity.relativeTime}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center text-gray-400 text-sm">No recent activities yet.</div>
          )}
        </div>

      </div>
    </div>
  );
}