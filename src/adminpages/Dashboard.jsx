

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PiNotePencilDuotone } from "react-icons/pi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { FiActivity } from "react-icons/fi";
import { fetchRecentActivities, fetchRevenue } from "../store/dashboardSlice";
import { FiUsers } from "react-icons/fi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FiCheckCircle } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Dashboard() {


  const dispatch = useDispatch();
  const { revenue, dashboardActivities, isLoading, error, lastFetched } = useSelector(state => state.dashboard);

  // User data from auth slice (login ke time save hua hai)
  const { user } = useSelector(state => state.auth);

  const navigate = useNavigate();

    const { t } = useTranslation();

  useEffect(() => {

    // Optional: only refetch if data is older than ~5 minutes
    const FIVE_MIN = 5 * 60 * 1000;
    const shouldRefetch = !lastFetched || (Date.now() - lastFetched > FIVE_MIN);

    if (shouldRefetch) {
      dispatch(fetchRevenue());
      dispatch(fetchRecentActivities(5));
    }

  }, [dispatch, lastFetched]);

  // Real user data
  const displayName = user?.userName || user?.name || "User";
  const profilePic = user?.profileImage || user?.profilePicture || null;
  const userInitials = displayName
    ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  if (isLoading && !revenue) {           // show spinner only on first load
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">{t("dashboard.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        {error}
      </div>
    );
  }

  //Real data API use data in cards 
  const stats = revenue ?
    [
      {
        title: t("dashboard.stats.totalRevenue"),
        value: `₹ ${revenue.totalRevenue.toLocaleString()}`,
        icon: (
          <FiDollarSign className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />

        ),
        bg: "bg-orange-50",
      },
      {
        title: t("dashboard.stats.totalPurchases"),
        value: revenue.totalPurchases.toLocaleString(),
        icon: (
          <FiShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
        ),
        bg: "bg-orange-50",
      },
      {
        title: t("dashboard.stats.avgPerPurchase"),
        value: `₹ ${revenue.averageRevenuePerPurchase.toLocaleString()}`,
        icon: (
          <HiMiniArrowTrendingUp className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />

        ),
        bg: "bg-orange-50",
      },
      {
        title: t("dashboard.stats.activePlans"),
        value: revenue.activePlansCount.toLocaleString(),
        icon: (
          <FiCheckCircle className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />

        ),
        bg: "bg-orange-50",
      }
    ] : [
      // fallback fake data if API fails
      // ...stats array
    ];

    


 return (
  <>
<div className="p-4 sm:p-6 transition-colors duration-300">

      {/* ── Dashboard Overview ── */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        {t("dashboard.title")}
      </h2>

      {/* ── Welcome Hero Card ── */}
      <div className="mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 shadow-xl">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 right-16 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute top-4 right-32 w-10 h-10 bg-white/10 rounded-full" />

          <div className="relative px-6 py-8 md:px-10 md:py-10 pr-28 md:pr-36 lg:pr-40">
            {/* Profile */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
              {profilePic ? (
                <img src={profilePic} alt="Profile"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/30 shadow-lg ring-2 ring-white/20"
                  onError={(e) => { e.target.src = ""; }} />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg border-4 border-white/30">
                  {userInitials}
                </div>
              )}
            </div>

            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-3 backdrop-blur-sm">
              {t("dashboard.adminPanel")}
            </span>
            <p className="text-white/80 text-sm md:text-base">{t("dashboard.welcome")},</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
              {displayName}
            </h2>
            <p className="mt-2 text-white/70 text-sm md:text-base">
              {t("dashboard.manageText")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Add Plan */}
          <div onClick={() => navigate("/plans", { state: { openModal: true } })}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600
              rounded-2xl shadow-md p-6 md:p-8 cursor-pointer
              hover:shadow-xl hover:scale-[1.02] transition-all duration-300
              flex items-center justify-between">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            <div>
              <h3 className="text-lg md:text-xl font-black text-white mb-1">{t("dashboard.addPlan")}</h3>
              <p className="text-white/70 text-sm">{t("dashboard.addPlanDesc")}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <GrAddCircle className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Lender List */}
          <div onClick={() => navigate("/lenders")}
            className="group relative overflow-hidden bg-gradient-to-br from-rose-400 to-rose-600
              rounded-2xl shadow-md p-6 md:p-8 cursor-pointer
              hover:shadow-xl hover:scale-[1.02] transition-all duration-300
              flex items-center justify-between">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            <div>
              <h3 className="text-lg md:text-xl font-black text-white mb-1">{t("dashboard.lenderList")}</h3>
              <p className="text-white/70 text-sm">{t("dashboard.lenderList")}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FiUsers className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Overview ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {t("dashboard.revenueOverview")}
          </h2>
          <button onClick={() => navigate("/revenue")}
            className="text-sm font-semibold text-orange-600
              hover:text-orange-700
              transition-colors flex items-center gap-1 cursor-pointer">
            {t("dashboard.viewDetails")} →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index}
              className="group bg-white
                rounded-2xl border border-gray-100
                shadow-sm hover:shadow-lg 
                transition-all duration-300 overflow-hidden">
              <div className="p-5">
                {/* Top colored bar */}
                <div className="h-1 w-8 bg-orange-400 rounded-full mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl flex-shrink-0 ml-3
                    group-hover:bg-orange-100 transition-colors">
                    <div className="text-orange-500">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {t("dashboard.recentActivity")}
          </h2>
          <button onClick={() => navigate("/activityDetails")}
            className="text-sm font-semibold text-orange-600
              hover:text-orange-700
              transition-colors cursor-pointer">
            {t("dashboard.seeAll")} →
          </button>
        </div>

        <div className="bg-white
          rounded-2xl border border-gray-100
          shadow-sm overflow-hidden">

          {dashboardActivities.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {dashboardActivities.map((activity, i) => {
                const type = activity.type?.toLowerCase() || "";

                let iconComponent = <FiActivity className="w-4 h-4" />;
                let iconBg    = "bg-amber-100";
                let iconColor = "text-amber-600";
                let borderColor = "border-gray-300";
                let dotColor  = "bg-amber-400";

                if (type.includes("updated") || type.includes("edit")) {
                  iconComponent = <PiNotePencilDuotone className="w-4 h-4" />;
                  iconBg    = "bg-blue-100";
                  iconColor = "text-blue-600";
                  borderColor = "border-blue-300";
                  dotColor  = "bg-blue-400";
                } else if (type.includes("purchase") || type.includes("subscribed") || type.includes("payment")) {
                  iconComponent = <MdOutlineLocalGroceryStore className="w-4 h-4" />;
                  iconBg    = "bg-green-100";
                  iconColor = "text-green-600";
                  borderColor = "border-green-300";
                  dotColor  = "bg-green-400";
                } else if (type.includes("created") || type.includes("create") || type.includes("added")) {
                  iconComponent = <GrAddCircle className="w-4 h-4" />;
                  iconBg    = "bg-orange-100";
                  iconColor = "text-orange-600";
                  borderColor = "border-orange-300";
                  dotColor  = "bg-orange-400";
                }

                return (
                  <div key={activity._id || i}
                    className={`flex items-start gap-4 px-5 py-4
                      hover:bg-gray-50
                      transition-colors border-l-4 ${borderColor}`}>

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
                      {iconComponent}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {activity.shortMessage || t("dashboard.activity")}
                        </p>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                        {activity.message || t("dashboard.noDescription")}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {activity.relativeTime || new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16 text-sm">
              {t("dashboard.noActivity")}
            </div>
          )}
        </div>
      </div>

    </div>
  </>
);
}