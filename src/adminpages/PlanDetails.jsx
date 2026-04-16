import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSinglePlan } from "../store/plansSlice";
import { BsBoxSeam } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { SlNote } from "react-icons/sl";
import { FiCreditCard } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import { useTranslation } from "react-i18next";



export function PlanDetails() {

  const {t} = useTranslation();


    const navigate = useNavigate();
    //url wise plan details
    const { planId } = useParams();

    const dispatch = useDispatch();
    const { singlePlan, isLoadingSingle, error } = useSelector((state) => state.plans || {});

    const [viewMode, setViewMode] = useState("card"); // card | table

    useEffect(() => {
        dispatch(fetchSinglePlan(planId));
    }, [dispatch, planId]);

    if (isLoadingSingle) {
        return (
          <div className="flex items-center justify-center h-[60vh] bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
            <span className="ml-4 font-medium text-lg text-gray-600">{t('planDetails.loading')}</span>
          </div>
        )
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">{t('planDetails.error')}: {error}</div>;
    }

    if (!singlePlan) {
        return <div className="p-6 text-center">{t('planDetails.notFound')}</div>;
    }

  return (
  <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
  <div className="p-5 sm:p-6 lg:p-8">
    

      {/* Back Button + Title + Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
          >
            ← {t('planDetails.backToPlans')}
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('planDetails.title')}</h2>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              viewMode === "card"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="hidden sm:inline">{t('planDetails.cards')}</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
            </svg>
            <span className="hidden sm:inline">{t('planDetails.table')}</span>
          </button>
        </div>
      </div>

     
      {/*    CARD VIEW   */}
   
      {viewMode === "card" && (
        <>
          {/* Hero Card */}
         <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-500" />
            <div className="px-6 py-6 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-orange-100">
                  <BsBoxSeam className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {singlePlan.planName}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <CiClock2 className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{singlePlan.duration || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  singlePlan.isActive
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}>
                  {singlePlan.isActive
                    ? <><IoMdCheckmarkCircleOutline className="w-4 h-4" /> {t('planDetails.active')}</>
                    : <><IoMdCloseCircleOutline className="w-4 h-4" /> {t("planDetails.inactive")}</>}
                </span>
                <div>
                  <span className="text-2xl font-extrabold text-orange-600">
                    ₹{singlePlan.priceMonthly?.toLocaleString() || "0"}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">/{t('planDetails.month')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: t('planDetails.stats.monthlyPrice'), value: `₹${singlePlan.priceMonthly?.toLocaleString() || "0"}`, icon: <FiDollarSign className="w-5 h-5" />, color: "bg-orange-100 text-orange-600" },
              { label: t('planDetails.stats.duration'),      value: singlePlan.duration || "N/A",                            icon: <CiClock2 className="w-5 h-5" />,     color: "bg-blue-100 text-blue-600"   },
              { label: t("planDetails.stats.status"),        value: singlePlan.isActive ? t('planDetails.active') : t("planDetails.inactive"),             icon: <IoMdCheckmarkCircleOutline className="w-5 h-5" />, color: singlePlan.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600" },
              { label: t('planDetails.stats.razorpayId'),   value: singlePlan.razorpayPlanId || t('planDetails.notSet'),                  icon: <FiCreditCard className="w-5 h-5" />, color: "bg-purple-100 text-purple-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-3 md:p-4 flex items-center gap-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Info + Features + Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plan Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <BsBoxSeam className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{t('planDetails.planInformation')}</h3>
              </div>
              <div className="p-5 space-y-1">
                {[
                  { label: t('planDetails.planName'),     value: singlePlan.planName },
                  { label: t("planDetails.duration"),      value: singlePlan.duration || t('planDetails.na')  },
                  { label: t("planDetails.monthlyPrice"), value: `₹${singlePlan.priceMonthly?.toLocaleString() || "0"}` },
                  { label: t("planDetails.createdAt"),    value: new Date(singlePlan.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: t("planDetails.lastUpdated"),  value: new Date(singlePlan.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: t('planDetails.razorpayPlanId'),   value: singlePlan.razorpayPlanId || t('planDetails.notConfigured') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                    <span className="text-sm font-bold text-gray-800 text-right max-w-[55%] truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features + Description */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <IoMdCheckmark className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{t('planDetails.planFeatures')}</h3>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: t('planDetails.features.unlimitedLoans'),    value: true,  desc: t('planDetails.features.unlimitedLoansDesc') },
                    { label: t('planDetails.features.advancedAnalytics'), value: singlePlan.planFeatures?.advancedAnalytics, desc: t('planDetails.features.advancedAnalyticsDesc') },
                    { label: t('planDetails.features.prioritySupport'),   value: singlePlan.planFeatures?.prioritySupport,   desc: t("planDetails.features.prioritySupportDesc") },
                  ].map((feature, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
                      feature.value ? "bg-green-50/60 border-green-300" : "bg-gray-50/60 border-gray-300"
                    }`}>
                      <div className="flex items-center gap-3">
                        {feature.value
                          ? <IoMdCheckmarkCircleOutline className="w-5 h-5 text-green-600 shrink-0" />
                          : <IoMdCloseCircleOutline className="w-5 h-5 text-red-400 shrink-0" />}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{feature.label}</p>
                          <p className="text-xs text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        feature.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                      }`}>
                        {feature.value ? t("planDetails.enabled") : t("planDetails.disabled")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <MdOutlineDescription className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{t('planDetails.description')}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {singlePlan.description || t('planDetails.noDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

  
      {/*   TABLE VIEW    */}
  
{viewMode === "table" && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">

    {/* Table Header */}
    <div className="px-6 py-4 border-b border-gray-300 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-orange-100 p-2 rounded-xl">
          <BsBoxSeam className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{singlePlan.planName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('planDetails.completePlanOverview')}</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
        singlePlan.isActive
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}>
        {singlePlan.isActive
          ? <><IoMdCheckmarkCircleOutline className="w-3.5 h-3.5" /> {t("planDetails.active")}</>
          : <><IoMdCloseCircleOutline className="w-3.5 h-3.5" /> {t("planDetails.inactive")}</>}
      </span>
    </div>

    {/* ── Section 1: Plan Information ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={2} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t('planDetails.planInformation')}
              </span>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
              {t('planDetails.field')}
            </th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("planDetails.value")}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { field: t("planDetails.planName"),     value: singlePlan.planName },
            { field: t("planDetails.duration"),      value: singlePlan.duration || "N/A" },
            { field: t("planDetails.monthlyPrice"), value: `₹${singlePlan.priceMonthly?.toLocaleString() || "0"}`, highlight: true },
            { field: t('planDetails.razorpayPlanId'),   value: singlePlan.razorpayPlanId || "Not Configured" },
            { field: t("planDetails.createdAt"),    value: new Date(singlePlan.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            { field: t("planDetails.lastUpdated"),  value: new Date(singlePlan.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          ].map((row, i) => (
            <tr key={i} className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {row.field}
              </td>
              <td className={`px-6 py-3.5 text-sm font-semibold ${row.highlight ? "text-orange-600" : "text-gray-800"}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ── Section 2: Plan Features ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={3} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t('planDetails.planFeatures')}
              </span>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
              {t('planDetails.feature')}
            </th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("planDetails.description")}
            </th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">
              {t("planDetails.status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: t('planDetails.features.unlimitedLoans'),    value: true,                                          desc: t('planDetails.features.unlimitedLoansDesc') },
            { label: t("planDetails.features.advancedAnalytics"), value: singlePlan.planFeatures?.advancedAnalytics,    desc:  t('planDetails.features.advancedAnalyticsDesc')  },
            { label: t("planDetails.features.prioritySupport"),   value: singlePlan.planFeatures?.prioritySupport,      desc:  t("planDetails.features.prioritySupportDesc") },
          ].map((feature, i) => (
            <tr key={i} className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">
                {feature.label}
              </td>
              <td className="px-6 py-3.5 text-sm text-gray-500">
                {feature.desc}
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  feature.value
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-500"
                }`}>
                  {feature.value
                    ? <><IoMdCheckmarkCircleOutline className="w-3 h-3" /> {t('planDetails.enabled')}</>
                    : <><IoMdCloseCircleOutline className="w-3 h-3" /> {t("planDetails.disabled")}</>}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ── Section 3: Description ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={2} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t('planDetails.description')}
              </span>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
              {t("planDetails.field")}
            </th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("planDetails.details")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide align-top">
              {t('planDetails.planDescription')}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {singlePlan.description || t('planDetails.noDescription')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
)}
 </div>
 </div>
);
}