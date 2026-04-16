import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiFilter, FiCheck, FiUsers, FiShield, FiAlertCircle, FiSearch } from "react-icons/fi";
import { fetchLendersWithPlans, impersonateLender } from "../store/lendersSlice";
import { startImpersonation } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export function Lenders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [planStatusFilter, setPlanStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lenders, isLoading, error, lastFetched } = useSelector((s) => s.lenders);
  const [impersonatingId, setImpersonatingId] = useState(null);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, planStatusFilter]);

  const handleImpersonate = async (lenderId) => {
    setImpersonatingId(lenderId);
    try {
      const result = await dispatch(impersonateLender(lenderId));
      if (impersonateLender.fulfilled.match(result)) {
        dispatch(startImpersonation(result.payload));
        setTimeout(() => navigate("/lender/dashboard", { replace: true }), 200);
      }
    } catch (err) { console.error(err); }
    finally { setImpersonatingId(null); }
  };

  useEffect(() => {
    const FIVE_MIN = 5 * 60 * 1000;
    if (!lastFetched || Date.now() - lastFetched > FIVE_MIN) dispatch(fetchLendersWithPlans());
  }, [dispatch, lastFetched]);

  if (isLoading && lenders.length === 0) return (
    <div className="flex justify-center items-center h-[65vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-300">{t("loadingLenders")}</span>
    </div>
  );

  const filteredLenders = lenders
    .filter(l => {
      const q = searchQuery.toLowerCase();
      return (l.userName||"").toLowerCase().includes(q) ||
        (l.email||"").toLowerCase().includes(q) ||
        (l.mobileNo||"").toLowerCase().includes(q);
    })
    .filter(l => {
      if (planStatusFilter === "active") return l.planPurchaseDetails?.isPlanActive === true;
      if (planStatusFilter === "expired") return l.planPurchaseDetails?.isPlanActive === false;
      return true;
    });

  const totalPages = Math.ceil(filteredLenders.length / itemsPerPage);
  const currentLenders = filteredLenders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalLenders = lenders.length;
  const activePlans = lenders.filter(l => l.planPurchaseDetails?.isPlanActive).length;
  const expiredPlans = lenders.filter(l => !l.planPurchaseDetails?.isPlanActive).length;

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t("lendersWithPlans")}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all lenders and their subscription plans</p>
          </div>
          <span className="text-xs text-gray-400 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 backdrop-blur">
            {totalLenders} total lenders
          </span>
        </div>

         {/* Search + Filter */}
        <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
          <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t("searchByNameEmailMobile")}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm" />
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />
          <button onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors px-2">
            <FiFilter className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: t("totalLenders"), value: totalLenders, color: "text-orange-600", bar: "bg-orange-400", icon: <FiUsers className="w-5 h-5" />, bg: "bg-orange-50" },
            { label: t("activePlans"),  value: activePlans,  color: "text-green-600",  bar: "bg-green-400",  icon: <FiShield className="w-5 h-5" />, bg: "bg-green-50" },
            { label: t("expiredPlans"), value: expiredPlans, color: "text-red-500",    bar: "bg-red-400",    icon: <FiAlertCircle className="w-5 h-5" />, bg: "bg-red-50" },
          ].map((s, i) => (
            <div key={i} className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white shadow-md border border-orange-100 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.45) 0%,transparent 60%)" }} />
              <div className="relative flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>{s.icon}</div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 relative">{s.label}</p>
              <p className={`text-2xl font-semibold relative ${s.color}`}>{s.value}</p>
              <div className="flex items-end gap-0.5 h-5 mt-3 relative">
                {[60,80,50,90,70,100,85].map((h, j) => (
                  <div key={j} className={`flex-1 rounded-sm opacity-60 ${s.bar}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

       

        {/* Section label */}
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Showing {currentLenders.length} of {filteredLenders.length} lenders
        </p>

        {/* Lender Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {currentLenders.length > 0 ? currentLenders.map((lender) => (
            <div key={lender._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1 transition-all duration-300">

              {/* Colored top bar */}
              <div className={`h-1 w-full ${lender.planPurchaseDetails?.isPlanActive ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                      {lender.userName?.charAt(0).toUpperCase() || "L"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{lender.userName || t("unknownLender")}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lender.email || "No Email"}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{lender.mobileNo || "No Mobile"}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${lender.planPurchaseDetails?.isPlanActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {lender.planPurchaseDetails?.isPlanActive ? t("activePlan") : t("expired")}
                  </span>
                </div>

                {/* Plan details */}
                <div className="bg-orange-50/60 dark:bg-gray-700/60 rounded-xl p-3 mb-4 border-l-3 border-orange-500">
                  <div className="flex items-center gap-2 mb-2">
                    <BsBoxSeam className="w-3 h-3 text-orange-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{t("currentPlan")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: t("plan"), value: lender.currentPlan?.planName || "N/A", highlight: true },
                      { label: t("price"), value: `₹${lender.currentPlan?.priceMonthly || 0}` },
                      { label: t("expires"), value: lender.planPurchaseDetails?.planExpiryDate ? new Date(lender.planPurchaseDetails.planExpiryDate).toLocaleDateString() : "N/A", red: true },
                      { label: t("remaining"), value: `${lender.planPurchaseDetails?.remainingDays ?? 0} days`, green: true },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{row.label}</span>
                        <span className={`text-[11px] font-bold ${row.highlight ? "text-orange-600" : row.red ? "text-red-500" : row.green ? "text-green-600" : "text-gray-700 dark:text-gray-300"}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400">Joined {lender.createdAt ? new Date(lender.createdAt).toLocaleDateString() : "N/A"}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleImpersonate(lender._id)} disabled={impersonatingId === lender._id}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all cursor-pointer disabled:opacity-60">
                      {impersonatingId === lender._id ? (
                        <><div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />Loading...</>
                      ) : "👤 Impersonate"}
                    </button>
                    <button onClick={() => navigate(`/lenders/${lender?._id}/borrowers`)}
                      className="text-[11px] font-bold px-2.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                      Borrowers
                    </button>
                    <button onClick={() => navigate(`/lenders/${lender._id}/details`, { state: { lender } })}
                      className="text-[11px] font-bold px-2.5 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all cursor-pointer">
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white/60 backdrop-blur-xl rounded-2xl border border-white/70">
              <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t("noLendersFound", { searchQuery })}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
              ← {t("prev")}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === i + 1 ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("next")} →
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
     {/* Filter Modal */}
{isFilterOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-400">
        <h3 className="text-2xl font-bold text-white">
          {t("filters")}
        </h3>

        <button
          onClick={() => setIsFilterOpen(false)}
          className="text-white text-3xl font-bold transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FiFilter className="w-6 h-6 text-orange-600" />
          {t("planStatus")}
        </h4>

        <div className="border-t border-orange-200 dark:border-orange-700 my-4"></div>

        <div className="space-y-4">
          {[
            { value: "all", label: t("allPlans") },
            { value: "active", label: t("active") },
            { value: "expired", label: t("expired") },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                planStatusFilter === opt.value
                  ? "border-orange-500 bg-orange-50/70 dark:bg-orange-900/20 shadow-md ring-1 ring-orange-300/30"
                  : "border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name="planStatus"
                value={opt.value}
                checked={planStatusFilter === opt.value}
                onChange={() => setPlanStatusFilter(opt.value)}
                className="w-5 h-5 accent-orange-600 cursor-pointer"
              />

              <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-orange-50/50 dark:bg-gray-800 dark:bg-gray-800">
        
        <button
          onClick={() => {
            setPlanStatusFilter("all");
            setIsFilterOpen(false);
          }}
          className="flex-1 max-w-[130px] flex items-center justify-center gap-2 px-3 sm:px-7 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer"
        >
          <span className="whitespace-nowrap">{t("clearAll")}</span>
        </button>

        <button
          onClick={() => setIsFilterOpen(false)}
          className="flex-[2] max-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-12 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer"
        >
          <span className="whitespace-nowrap">{t("applyFilters")}</span>
          <FiCheck className="w-5 h-5 flex-shrink-0" />
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}