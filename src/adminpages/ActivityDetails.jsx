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

// Activity style per type 
function getActivityStyle(type = "") {
  switch (type) {
    case "plan_created":
      return {
        icon: <GrAddCircle className="w-5 h-5" />,
        iconBg: "bg-orange-100", iconColor: "text-orange-600",
        borderColor: "border-orange-400",
        badgeBg: "bg-orange-100", badgeText: "text-orange-700",
        label: "Plan Created",
      };
    case "plan_updated":
      return {
        icon: <PiNotePencilDuotone className="w-5 h-5" />,
        iconBg: "bg-blue-100", iconColor: "text-blue-600",
        borderColor: "border-blue-400",
        badgeBg: "bg-blue-100", badgeText: "text-blue-700",
        label: "Plan Updated",
      };
    case "subscription_purchased":
      return {
        icon: <MdOutlineLocalGroceryStore className="w-5 h-5" />,
        iconBg: "bg-green-100", iconColor: "text-green-600",
        borderColor: "border-green-400",
        badgeBg: "bg-green-100", badgeText: "text-green-700",
        label: "Purchased",
      };
    default:
      return {
        icon: <FiActivity className="w-5 h-5" />,
        iconBg: "bg-amber-100", iconColor: "text-amber-600",
        borderColor: "border-amber-400",
        badgeBg: "bg-amber-100", badgeText: "text-amber-700",
        label: "Activity",
      };
  }
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Created", value: "plan_created" },
  { label: "Updated", value: "plan_updated" },
  { label: "Purchase", value: "subscription_purchased" },
];

export function ActivityDetails() {

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
        <span className="ml-4 text-lg text-gray-600 font-medium">Loading Activities...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Back + Title */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
        >
          ← Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-400 mt-1">Complete log of all recent actions</p>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {[
          { label: "Total", value: total, bg: "bg-white border border-gray-200", color: "text-gray-800", icon: <FiActivity className="w-5 h-5 text-gray-400" /> },
          { label: "Created", value: created, bg: "border border-orange-100", color: "text-orange-600", icon: <GrAddCircle className="w-5 h-5 text-orange-400" /> },
          { label: "Updated", value: updated, bg: "bg-blue-50 border border-blue-100", color: "text-blue-600", icon: <PiNotePencilDuotone className="w-5 h-5 text-blue-400" /> },
          { label: "Purchase", value: purchase, bg: "bg-green-50 border border-green-100", color: "text-green-600", icon: <MdOutlineLocalGroceryStore className="w-5 h-5 text-green-400" /> },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 flex items-center justify-between shadow-sm`}>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm">{s.icon}</div>
          </div>
        ))}
      </div>

      {/*  Search + Filter  */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 md:p-4 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by plan, user, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${filter === f.value
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Activity List ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Table header */}
        <div className="px-6 py-3.5 border-b border-gray-100 bg-gray-50 grid grid-cols-12 gap-4">
          <div className="col-span-1" />
          <div className="col-span-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Activity</div>
          <div className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">Type</div>
          <div className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">Time</div>
        </div>
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            No activities found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((activity, i) => {
              const s = getActivityStyle(activity.type);
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
                        {activity.shortMessage || "Activity"}
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
                            : "N/A"}
                        </span>
                      </div>

                      {/* Detail body */}
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Full message */}
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Description</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{activity.message || "No details available."}</p>
                        </div>

                        {/* Plan details — always shown if available */}
                        {activity.planName && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BsBoxSeam className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Plan</p>
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
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Price</p>
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
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Duration</p>
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
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lender</p>
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
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment ID</p>
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
              Showing {filtered.length} of {total} activities
            </p>
            {search || filter !== "all" ? (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>

    </div>

  );
}