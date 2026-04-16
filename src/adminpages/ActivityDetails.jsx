import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { FiActivity, FiDollarSign, FiUser, FiCreditCard } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { fetchRecentActivities } from "../store/dashboardSlice";
import { FiChevronDown } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { IoIosSearch } from "react-icons/io";


// Activity style per type 
function getActivityStyle(type = "", t) {
  switch (type) {
    case "plan_created":
      return {
        icon: <GrAddCircle className="w-5 h-5" />,
        iconBg: "bg-orange-100", iconColor: "text-orange-600",
        borderColor: "border-orange-400",
        badgeBg: "bg-orange-100", badgeText: "text-orange-700",
        label: t('activityDetails.types.planCreated'),
      };
    case "plan_updated":
      return {
        icon: <PiNotePencilDuotone className="w-5 h-5" />,
        iconBg: "bg-blue-100", iconColor: "text-blue-600",
        borderColor: "border-blue-400",
        badgeBg: "bg-blue-100", badgeText: "text-blue-700",
        label: t('activityDetails.types.planUpdated'),
      };
    case "subscription_purchased":
      return {
        icon: <MdOutlineLocalGroceryStore className="w-5 h-5" />,
        iconBg: "bg-green-100", iconColor: "text-green-600",
        borderColor: "border-green-400",
        badgeBg: "bg-green-100", badgeText: "text-green-700",
        label: t('activityDetails.types.subscriptionPurchased'),
      };
    default:
      return {
        icon: <FiActivity className="w-5 h-5" />,
        iconBg: "bg-amber-100", iconColor: "text-amber-600",
        borderColor: "border-amber-400",
        badgeBg: "bg-amber-100", badgeText: "text-amber-700",
        label: t('activityDetails.types.default'),
      };
  }
}



export function ActivityDetails() {

    const {t} = useTranslation();

    const FILTERS = [
  { label: t('activityDetails.filters.all'), value: "all" },
  { label: t('activityDetails.filters.created'), value: "plan_created" },
  { label: t('activityDetails.filters.updated'), value: "plan_updated" },
  { label: t('activityDetails.filters.purchase'), value: "subscription_purchased" },
];

  const dispatch = useDispatch();

  const { allActivities, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchRecentActivities(10));
  }, [dispatch]);

  const navigate = useNavigate();


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);



  // Filter + Search 
  const filtered = allActivities.filter((a) => {
    const query = search.toLowerCase();
    const message = (a.message || "").toLowerCase();
    const short = (a.shortMessage || "").toLowerCase();
    const name = (a.planName || "").toLowerCase();
    const user = (a.userName || "").toLowerCase();

    const matchSearch = !query ||
      message.includes(query) ||
      short.includes(query) ||
      name.includes(query) ||
      user.includes(query);

    const matchFilter = filter === "all" ? true : a.type === filter;

    return matchSearch && matchFilter;
  });

  // Stats 
  const total = allActivities.length;
  const created = allActivities.filter(a => a.type === "plan_created").length;
  const updated = allActivities.filter(a => a.type === "plan_updated").length;
  const purchase = allActivities.filter(a => a.type === "subscription_purchased").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">{t('activityDetails.loading')}</span>
      </div>
    );
  }

  return (
   <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <div className="p-5 sm:p-6 lg:p-8">

      <button onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm transition-all hover:gap-3 cursor-pointer">
        ← {t('activityDetails.backToDashboard')}
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('activityDetails.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('activityDetails.subtitle')}</p>
        </div>
        <span className="text-xs text-gray-400 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 backdrop-blur">
          {total} activities
        </span>
      </div>

        {/* Search + Filter bar */}
     <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
  
  <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />

  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder={t("activityDetails.searchPlaceholder")}
    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
  />

</div>

      {/* Stats — same cards as dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('activityDetails.stats.total'), value: total, color: "text-gray-700", bar: "bg-gray-400", icon: <FiActivity className="w-5 h-5" />, bg: "bg-gray-50" },
          { label: t('activityDetails.stats.created'), value: created, color: "text-orange-600", bar: "bg-orange-400", icon: <GrAddCircle className="w-5 h-5" />, bg: "bg-orange-50" },
          { label: t('activityDetails.stats.updated'), value: updated, color: "text-blue-600", bar: "bg-blue-400", icon: <PiNotePencilDuotone className="w-5 h-5" />, bg: "bg-blue-50" },
          { label: t('activityDetails.stats.purchase'), value: purchase, color: "text-green-600", bar: "bg-green-400", icon: <MdOutlineLocalGroceryStore className="w-5 h-5" />, bg: "bg-green-50" },
        ].map((s, i) => (
          <div key={i} className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white shadow-md border border-orange-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.45) 0%,transparent 60%)" }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>{s.icon}</div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 relative">{s.label}</p>
            <p className={`text-2xl font-semibold relative ${s.color}`}>{s.value}</p>
            <div className="flex items-end gap-0.5 h-5 mt-3 relative">
              {[40,70,50,90,60,100,75].map((h, j) => (
                <div key={j} className={`flex-1 rounded-sm opacity-50 ${s.bar}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

    


      {/* ── Activity List ── */}
      <div className="bg-white/60 dark:bg-gray-800 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-gray-700 overflow-hidden">

        {/* Table header */}
        <div className="px-6 py-3.5 border-b border-gray-100 bg-gray-50 grid grid-cols-12 gap-4">
          <div className="col-span-1" />
          <div className="col-span-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('activityDetails.activity')}</div>
          <div className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">{t('activityDetails.type')}</div>
          <div className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">{t('activityDetails.time')}</div>
        </div>
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            {t('activityDetails.noActivitiesFound')}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((activity, i) => {
              const s = getActivityStyle(activity.type, t);
              const isOpen = expanded === i;

              return (
                <div key={activity._id || i}>

                  {/* Main Row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className={`px-4 md:px-6 py-4 flex md:grid md:grid-cols-12 items-center gap-3 md:gap-4 cursor-pointer transition-colors hover:bg-orange-50/30 ${isOpen ? "bg-orange-50/40" : ""}`}
                  >
                    {/* Icon */}
                    <div className="col-span-1">
                      <div className={`w-9 h-9 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center border-l-2 ${s.borderColor}`}>
                        {s.icon}
                      </div>
                    </div>

                    {/* Short message */}
                    <div className="col-span-8 md:col-span-5 min-w-0 flex-1">
                      <p className="text-sm md:text-base font-bold text-gray-900 truncate">
                        {activity.shortMessage || t('activityDetails.activityFallback')}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5 md:hidden">
                        {activity.relativeTime}
                      </p>
                    </div>

                    {/* Type badge */}
                    <div className="col-span-3 hidden md:flex">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${s.badgeBg} ${s.badgeText}`}>
                        {s.label}
                      </span>
                    </div>

                    {/* Time + expand */}
                    <div className="col-span-2 hidden md:flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">
                        {activity.relativeTime}
                      </span>
                      <FiChevronDown
                        className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />

                    </div>

                    {/* Mobile expand */}
                    <div className="col-span-3 flex justify-end md:hidden">
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* ── Expanded Detail Panel ── */}
                  {isOpen && (
                    <div className={`mx-4 mb-4 rounded-2xl border-l-4 ${s.borderColor} bg-gray-50/60 border border-blue-400 overflow-hidden`}>

                      {/* Detail header */}
                      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.badgeBg} ${s.badgeText}`}>
                          {s.icon} {s.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                          <CiClock2 className="w-3.5 h-3.5" />
                          {activity.timestamp
                            ? new Date(activity.timestamp).toLocaleString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            })
                            : t('lenderDetails.na')}
                        </span>
                      </div>

                      {/* Detail body */}
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Full message */}
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{t('activityDetails.details.description')}</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{activity.message || t('activityDetails.details.noDetailsAvailable')}</p>
                        </div>

                        {/* Plan details — always shown if available */}
                        {activity.planName && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BsBoxSeam className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('activityDetails.details.plan')}</p>
                              <p className="text-sm font-bold text-gray-900">{activity.planName}</p>
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        {activity.priceMonthly && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MdCurrencyRupee className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('activityDetails.details.price')}</p>
                              <p className="text-sm font-bold text-gray-900">₹{activity.priceMonthly}/month</p>
                            </div>
                          </div>
                        )}

                        {/* Duration */}
                        {activity.duration && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CiClock2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('activityDetails.details.duration')}</p>
                              <p className="text-sm font-bold text-gray-900">{activity.duration}</p>
                            </div>
                          </div>
                        )}

                        {/* User — only for subscription_purchased */}
                        {activity.userName && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiUser className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('activityDetails.details.lender')}</p>
                              <p className="text-sm font-bold text-gray-900">{activity.userName}</p>
                              {activity.userEmail && (
                                <p className="text-xs text-gray-400">{activity.userEmail}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment ID — only for subscription_purchased */}
                        {activity.paymentId && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiCreditCard className="w-4 h-4 text-teal-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('activityDetails.details.paymentId')}</p>
                              <p className="text-xs font-bold text-gray-700 truncate">{activity.paymentId}</p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              {t('activityDetails.showing', { count: filtered.length, total: total })}
            </p>
            {search || filter !== "all" ? (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                {t('activityDetails.clearFilters')}
              </button>
            ) : null}
          </div>
        )}
      </div>

    </div>
    </div>

  );
}