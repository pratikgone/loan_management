import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiActivity, FiCheckCircle, FiDollarSign, FiShoppingCart, FiAlertCircle, FiFileText } from "react-icons/fi";
import { HiMiniArrowTrendingDown } from "react-icons/hi2";
import { fetchRecentActivities, fetchRevenue } from "../store/dashboardSlice";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { revenue, dashboardActivities, isLoading, error, lastFetched } = useSelector(
    (state) => state.dashboard
  );
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const FIVE_MIN = 5 * 60 * 1000;
    const shouldRefetch = !lastFetched || Date.now() - lastFetched > FIVE_MIN;
    if (shouldRefetch) {
      dispatch(fetchRevenue());
      dispatch(fetchRecentActivities(5));
    }
  }, [dispatch, lastFetched]);

  const displayName = user?.userName || user?.name || "User";
  const profilePic = user?.profileImage || user?.profilePicture || null;
  const userInitials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  if (isLoading && !revenue) {
    return (
      <div className="flex items-center justify-center h-[65vh] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
        <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-300">{t("dashboard.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 p-6 rounded-2xl text-center">
        {error}
      </div>
    );
  }

  const stats = revenue
    ? [
        {
          title: t("dashboard.stats.totalRevenue"),
          value: `₹ ${revenue.totalRevenue.toLocaleString()}`,
          change: "+14.8%",
          trend: "up",
          iconBg: "bg-orange-50",
          iconColor: "text-orange-500",
          barColor: "bg-orange-400",
          icon: <FiDollarSign className="w-5 h-5" />,
        },
        {
          title: t("dashboard.stats.totalPurchases"),
          value: revenue.totalPurchases.toLocaleString(),
          change: "+9.3%",
          trend: "up",
          iconBg: "bg-green-50",
          iconColor: "text-green-600",
          barColor: "bg-green-400",
          icon: <FiShoppingCart className="w-5 h-5" />,
        },
        {
          title: t("dashboard.stats.avgPerPurchase"),
          value: `₹ ${revenue.averageRevenuePerPurchase.toLocaleString()}`,
          change: "-3.2%",
          trend: "down",
          iconBg: "bg-red-50",
          iconColor: "text-red-500",
          barColor: "bg-red-400",
          icon: <HiMiniArrowTrendingDown className="w-5 h-5" />,
        },
        {
          title: t("dashboard.stats.activePlans"),
          value: revenue.activePlansCount.toLocaleString(),
          change: "+22%",
          trend: "up",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          barColor: "bg-blue-400",
          icon: <FiCheckCircle className="w-5 h-5" />,
        },
      ]
    : [];

  const activityIconMap = (activity, i) => {
    const icons = [
      { bg: "bg-orange-50", color: "text-orange-500", icon: <FiActivity className="w-4 h-4" /> },
      { bg: "bg-green-50",  color: "text-green-600",  icon: <FiDollarSign className="w-4 h-4" /> },
      { bg: "bg-blue-50",   color: "text-blue-500",   icon: <FiFileText className="w-4 h-4" /> },
      { bg: "bg-red-50",    color: "text-red-500",    icon: <FiAlertCircle className="w-4 h-4" /> },
    ];
    return icons[i % icons.length];
  };

  return (
   <div
  className="min-h-screen pb-12 
  bg-gradient-to-br from-orange-50 via-white to-green-50 
  dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
>
      <div className="p-5 sm:p-6 lg:p-8 w-full">

        {/* ── Header ── */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back 👋 Here's what's happening today</p>
          </div>
          <span
           className="text-xs text-gray-400 px-3 py-1.5 rounded-full mt-1 
bg-white/70 border border-gray-200 
dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 backdrop-blur"
          >
            Last updated · Today
          </span>
        </div>

        {/*  Hero Banner  */}
        <div
          className="relative rounded-3xl overflow-hidden mb-10 p-8"
          style={{ background: "linear-gradient(130deg, #f97316, #fb923c, #fbbf24)" }}
        >
          {/* Glass overlay */}
          <div
           className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"
          />
          {/* Decorative orbs */}
          <div
            className="absolute rounded-full"
            style={{ width: 200, height: 200, background: "rgba(255,255,255,0.1)", top: -70, right: 80 }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: 110, height: 110, background: "rgba(255,255,255,0.07)", bottom: -30, right: 24 }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-white text-2xl font-semibold">
                Welcome back, <span className="font-bold">{displayName}</span>
              </h2>
              <p className="text-orange-100 text-sm mt-2 max-w-md leading-relaxed">
                {t("dashboard.manageText")}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {revenue && (
                  <>
                    <span
                      className="text-xs text-white px-3 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)", border: "0.5px solid rgba(255,255,255,0.3)" }}
                    >
                      {revenue.activePlansCount} active plans
                    </span>
                    <span
                      className="text-xs text-white px-3 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)", border: "0.5px solid rgba(255,255,255,0.3)" }}
                    >
                      +14.8% this month
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              {profilePic ? (
                <img
                  src={profilePic}
                  className="w-16 h-16 rounded-2xl object-cover"
                  style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}
                  alt={displayName}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {userInitials}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-10">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            {t("dashboard.revenueOverview")}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
               className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1
bg-white shadow-md border border-orange-100 
dark:bg-gray-800 dark:border-gray-700 dark:shadow-black/20
backdrop-blur-xl"
              >
                {/* Inner glass sheen */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 60%)" }}
                />

                <div className="relative">
                  {/* Icon + trend */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                      {stat.icon}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        stat.trend === "up"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-500">{stat.title}</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>

                  {/* Mini sparkline */}
                  <div className="flex items-end gap-0.5 h-6 mt-3">
                    {[40, 55, 45, 70, 60, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm opacity-60 ${stat.barColor}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-10">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Quick Actions
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => navigate("/plans", { state: { openModal: true } })}
              className="relative cursor-pointer rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                boxShadow: "0 4px 20px rgba(16,185,129,0.2)",
              }}
            >
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 100, height: 100, background: "rgba(255,255,255,0.1)", top: -30, right: -20 }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 60, height: 60, background: "rgba(255,255,255,0.07)", bottom: -10, right: 30 }}
              />
              <div
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                ↗
              </div>
              <h3 className="text-base font-semibold text-white relative z-10">{t("dashboard.addPlan")}</h3>
              <p className="text-sm mt-1 relative z-10" style={{ color: "rgba(255,255,255,0.8)" }}>
                {t("dashboard.addPlanDesc")}
              </p>
            </div>

            <div
              onClick={() => navigate("/lenders")}
              className="relative cursor-pointer rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                boxShadow: "0 4px 20px rgba(249,115,22,0.2)",
              }}
            >
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 100, height: 100, background: "rgba(255,255,255,0.1)", top: -30, right: -20 }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 60, height: 60, background: "rgba(255,255,255,0.07)", bottom: -10, right: 30 }}
              />
              <div
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                ↗
              </div>
              <h3 className="text-base font-semibold text-white relative z-10">{t("dashboard.lenderList")}</h3>
              <p className="text-sm mt-1 relative z-10" style={{ color: "rgba(255,255,255,0.8)" }}>
                Manage all lenders and their activity
              </p>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            {t("dashboard.recentActivity")}
          </p>

          <div
  className="rounded-2xl overflow-hidden 
  bg-white/60 border border-white/70 
  dark:bg-gray-800 dark:border-gray-700 backdrop-blur-xl"
>
            {dashboardActivities.length > 0 ? (
              dashboardActivities.map((activity, i) => {
                const { bg, color, icon } = activityIconMap(activity, i);
                return (
                  <div
                    key={i}
                   className="flex items-start gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-white/50 dark:hover:bg-gray-700"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.shortMessage}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{activity.relativeTime}</span>
                  </div>
                );
              })
            ) : (
              <div className="py-14 text-center text-gray-400 text-sm">{t("dashboard.noActivity")}</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}