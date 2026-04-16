import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLenderStats, fetchLenderActivities } from "../store/dashboardSlice";
import { FiFileText, FiUsers, FiDollarSign, FiActivity } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export function LenderDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user, isImpersonating } = useSelector((state) => state.auth);
  const { lenderStats, lenderActivities, isLoading, lastFetched } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const FIVE_MIN = 5 * 60 * 1000;
    const shouldRefetch = !lastFetched || Date.now() - lastFetched > FIVE_MIN;

    if (shouldRefetch) {
      dispatch(fetchLenderStats());
      dispatch(fetchLenderActivities(5));
    }
  }, [dispatch, lastFetched]);

  // Strong displayName for impersonation + normal lender
  const displayName = user?.userName || 
                     user?.name || 
                     user?.fullName || 
                     user?.lenderName || 
                     (isImpersonating ? "Impersonated Lender" : "Lender");

  const userInitials = displayName 
    ? displayName.split(" ").map(n => n?.[0] || "").join("").toUpperCase().slice(0, 2) 
    : "LH";

  const stats = lenderStats ? [
    {
      title: t("lenderDashboard.totalLoans") || "Total Loans Given",
      value: lenderStats.counts?.totalLoans || 0,
      icon: <FiFileText className="w-6 h-6" />,
      color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100"
    },
    {
      title: t("lenderDashboard.totalAmount") || "Total Loan Amount",
      value: `₹${(lenderStats.totalLoanAmount || 0).toLocaleString()}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100"
    },
    {
      title: t("lenderDashboard.amountReceived") || "Amount Received",
      value: `₹${(lenderStats.totalPaidAmount || 0).toLocaleString()}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "text-green-600", bg: "bg-green-50", border: "border-green-100"
    },
    {
      title: t("lenderDashboard.pendingAmount") || "Pending Amount",
      value: `₹${(lenderStats.totalPendingAmount || 0).toLocaleString()}`,
      icon: <FiActivity className="w-6 h-6" />,
      color: "text-red-500", bg: "bg-red-50", border: "border-red-100"
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
        <span className="ml-4 text-gray-600 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">

      {/* Welcome Hero - Improved */}
      <div className="mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 shadow-xl">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 right-16 w-24 h-24 bg-white/10 rounded-full" />

          <div className="relative px-6 py-8 md:px-10 md:py-10 pr-28 md:pr-36">
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg border-4 border-white/30">
                {userInitials}
              </div>
            </div>

            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-3">
              {isImpersonating ? "🔄 Impersonated Session" : "Lender Panel"}
            </span>

            <p className="text-white/80 text-sm md:text-base">Welcome back,</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
              {displayName}
            </h2>
            <p className="mt-2 text-white/70 text-sm">
              {isImpersonating ? "You are viewing this account as admin" : "Manage your loans & borrowers"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate("/lender/borrowers")}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-black text-white mb-1">My Borrowers</h3>
              <p className="text-white/70 text-sm">View all borrowers</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUsers className="w-7 h-7 text-white" />
            </div>
          </div>

          <div 
            onClick={() => navigate("/lender/loans")}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-black text-white mb-1">My Loans</h3>
              <p className="text-white/70 text-sm">View all loans</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiFileText className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Loan Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`bg-white rounded-2xl border ${stat.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}>
                <div className="p-5">
                  <div className="h-1 w-8 bg-orange-400 rounded-full mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                        {stat.title}
                      </p>
                      <p className={`text-2xl font-black mt-1 ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 ${stat.bg} rounded-xl flex-shrink-0 ml-3`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {lenderActivities?.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {lenderActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-l-4 border-orange-200">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-100 text-orange-600">
                    <FiActivity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {activity.shortMessage || "Activity"}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {activity.relativeTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16 text-sm">
              No recent activities yet.
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}