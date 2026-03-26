

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

export default function Dashboard() {


  const dispatch = useDispatch();
  const { revenue, activities, isLoading, error, lastFetched } = useSelector(state => state.dashboard);

  // User data from auth slice (login ke time save hua hai)
  const { user } = useSelector(state => state.auth);

  const navigate = useNavigate();

  useEffect(() => {

    // Optional: only refetch if data is older than ~5 minutes
    const FIVE_MIN = 5 * 60 * 1000;
    const shouldRefetch = !lastFetched || (Date.now() - lastFetched > FIVE_MIN);

    if (shouldRefetch) {
      dispatch(fetchRevenue());
      dispatch(fetchRecentActivities());
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">Loading revenue data & activities...</span>
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
        title: "Total Revenue",
        value: `₹ ${revenue.totalRevenue.toLocaleString()}`,
        icon: (
          <FiDollarSign className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />

        ),
        bg: "bg-orange-50",
      },
      {
        title: "Total Purchases",
        value: revenue.totalPurchases.toLocaleString(),
        icon: (
          <FiShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
        ),
        bg: "bg-orange-50",
      },
      {
        title: "Avg. Per Purchase",
        value: `₹ ${revenue.averageRevenuePerPurchase.toLocaleString()}`,
        icon: (
          <HiMiniArrowTrendingUp className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />

        ),
        bg: "bg-orange-50",
      },
      {
        title: "Active Plans",
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
      {/* Welcome back Card */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-orange-400 to-orange-300 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 pr-28 md:pr-36 lg:pr-40">
            {/* Profile Circle */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-10">
              <div className="relative">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-2 border-orange-100 shadow-md overflow-hidden ring-2 ring-orange-100"
                    onError={(e) => { e.target.src = ''; }}
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg border-4 border-white ring-2 ring-orange-100">
                    {userInitials}
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            <p className="mt-2 text-orange-50 text-sm md:text-xl">
              Welcome back,
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {displayName}
            </h2>
            <p className="mt-2 text-orange-50 text-sm md:text-xl">
              Manage your Subscriptions
            </p>
          </div>
        </div>
      </div>
      {/* Quick Actions Section */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Card - Add Plan (Green) */}
          <div
            onClick={() => navigate('/plans', { state: { openModal: true } })}
            className="bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-2xl shadow-lg p-6 md:p-8 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-1xl md:text-2xl font-bold mb-2">Add Plan</h3>
              <p className=" text-sm">Create a new subscription plan</p>
            </div>
            <div className="p-2 bg-emerald-200 rounded md:rounded-lg">
              <GrAddCircle className="w-5 h-5 md:w-7 md:h-7 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right Card - Lender List (Faint Red) */}
          <div
            onClick={() => navigate('/lenders')} // ya jo route hai lender list ka
            className="bg-gradient-to-br from-rose-200 to-rose-300 rounded-2xl shadow-lg p-6 md:p-8 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-between border border-red-200 group"
          >
            <div>
              <h3 className="text-1xl md:text-2xl font-bold text-red-800 mb-2">Lender List</h3>
              <p className="text-red-700 text-sm">View and manage all lenders</p>
            </div>
            <div className="p-2 bg-rose-200 rounded md:rounded-lg">
              <FiUsers className="w-5 h-5 md:w-7 md:h-7 text-rose-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview Section */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Revenue Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-orange-100 ${stat.bg} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600  tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl md:text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-4 bg-white/90 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
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

      {/* Recent Activity - Full Width */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h2>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, i) => {
                const type = activity.type?.toLowerCase() || "";

                // Har type ke liye alag color + background + icon
                let iconComponent = null;
                let iconBg = "bg-gray-100";
                let iconColor = "text-gray-600";
                let borderColor = "border-gray-200";

                if (type.includes("plan updated") || type.includes("updated") || type.includes("edit")) {
                  iconComponent = <PiNotePencilDuotone className="w-5 h-5" />;
                  iconBg = "bg-blue-100";
                  iconColor = "text-blue-600";
                  borderColor = "border-blue-200";
                } else if (
                  type.includes("subscription purchased") ||
                  type.includes("purchase") ||
                  type.includes("subscribed") ||
                  type.includes("payment")
                ) {
                  iconComponent = <MdOutlineLocalGroceryStore className="w-5 h-5" />;
                  iconBg = "bg-green-100";
                  iconColor = "text-green-600";
                  borderColor = "border-green-200";
                } else if (
                  type.includes("plan created") ||
                  type.includes("create") ||
                  type.includes("added plan") ||
                  type.includes("new plan")
                ) {
                  iconComponent = <GrAddCircle className="w-5 h-5" />;
                  iconBg = "bg-orange-100";
                  iconColor = "text-orange-600";
                  borderColor = "border-orange-200";
                } else {
                  iconComponent = <FiActivity className="w-5 h-5" />;
                  iconBg = "bg-amber-100";
                  iconColor = "text-amber-600";
                  borderColor = "border-amber-200";
                }

                return (
                  <div key={activity._id}>
                    <div
                      className={`flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-l-4 ${borderColor}`}
                    >
                      <div
                        className={`h-10 w-10 rounded md:rounded-lg ${iconBg} flex items-center justify-center ${iconColor} shadow-sm`}
                      >
                        {iconComponent}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {activity.shortMessage || "Activity"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {activity.message || "No description available"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.relativeTime || new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>


                    {/* Faint divider line between activities */}
                    {i < activities.length - 1 && (
                      <div className="mx-4 mt-2 border-t border-gray-200"></div>
                    )}
                  </div>

                );
              })}
            </div>

          ) : (
            <div className="text-center text-gray-500 py-10">
              No recent activities found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}