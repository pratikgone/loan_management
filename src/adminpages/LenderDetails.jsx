// src/pages/LenderDetails.jsx (Static Design Preview Version)
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchLenderDetails, clearSelectedLender } from '../store/lendersSlice';
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { FiCreditCard } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineShield } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { BsBoxSeam } from "react-icons/bs";
import { LuDollarSign } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CiViewTable } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";

export function LenderDetails() {


  const {t} = useTranslation();

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [viewMode, setViewMode] = useState("card");
  const [isLoading, setIsLoading] = useState(true);

  // Get lender data from navigation state (passed from Lenders page)
  const lenderFromState = location.state?.lender;

  const dispatch = useDispatch();
  const { selectedLender, isLoadingDetails, error } = useSelector(state => state.lenders);

  useEffect(() => {
    // First, try to use data from navigation state
    // If not available, fetch from API

    if (!lenderFromState && id) {
      // Clear previous lender data before fetching new details
      dispatch(clearSelectedLender());
      console.log("Fetching details for ID:", id);
      dispatch(fetchLenderDetails(id));
    } else if (lenderFromState) {
      // Clear to ensure we use the passed data
      dispatch(clearSelectedLender());
      console.log("Using lender data from navigation:", lenderFromState.userName);
    }

    // Hide loading after minimum delay when data ready
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dispatch, id, lenderFromState]);

  // Use data from navigation state if available, otherwise fall back to Redux
  const lenderData = lenderFromState || selectedLender?.lender;
  const currentPlan = lenderFromState?.currentPlan || selectedLender?.currentPlan;
  const planPurchaseDetails = lenderFromState?.planPurchaseDetails || selectedLender?.planPurchaseDetails;

  // Log for debugging
  if (lenderData) {
    console.log("Loaded lender:", lenderData.userName, lenderData._id);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        <span className='ml-4 text-lg font-medium text-gray-600'>{t('lenderDetails.loading')}</span>
      </div>
    );
  }

  if (error && !lenderFromState) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        {error}
      </div>
    );
  }


  if (!lenderData) {
    return (
      <div className="text-center text-gray-500 py-10">
        {t('lenderDetails.notFound')}
      </div>
    );
  }


 return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <div className="p-5 sm:p-6 lg:p-8">

      {/* Back + Title + Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-medium transition-all hover:gap-2.5 cursor-pointer">
            ← {t('lenderDetails.backToLenders')}
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('lenderDetails.title')}</h1>
        </div>
        {/* Same toggle as PlanDetails */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
          {["card", "table"].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${viewMode === mode ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
              {mode === "card" ? (
                <RxDashboard className="w-3.5 h-3.5" />
              ) : (
              <CiViewTable className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{mode === "card" ? t('lenderDetails.cards') : t('lenderDetails.table')}</span>
            </button>
          ))}
        </div>
      </div>

     
      {/*   CARD VIEW   */}
        {viewMode === "card" && (
        <>
          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 p-6 md:p-8"
            style={{ background: "linear-gradient(130deg, #f97316, #fb923c, #fbbf24)" }}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute rounded-full" style={{ width: 160, height: 160, background: "rgba(255,255,255,0.08)", top: -50, right: 60 }} />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-md overflow-hidden flex-shrink-0">
                  {lenderData.profileImage ? <img src={lenderData.profileImage} alt="" className="w-full h-full object-cover" /> : lenderData.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/70 bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-widest">Lender</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{lenderData.userName || t('lenderDetails.na')}</h2>
                  <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1">
                    <CiLocationOn className="flex-shrink-0" />{lenderData.address || t('lenderDetails.addressNotProvided')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${lenderData?.isActive ? "bg-green-400/30 text-white border border-green-300/50" : "bg-red-400/30 text-white border border-red-300/50"}`}>
                  {lenderData?.isActive ? <><IoCheckmarkCircleOutline className="w-4 h-4" />{t('lenderDetails.active')}</> : <><AiOutlineCloseCircle className="w-4 h-4" />{t("lenderDetails.inactive")}</>}
                </span>
                <p className="text-white/70 text-xs">{lenderData.email}</p>
              </div>
            </div>
          </div>

      {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: t('lenderDetails.mobileNumber'), value: lenderData.mobileNo || t('lenderDetails.na'), icon: <IoCallOutline className="w-4 h-4" />, color: "bg-orange-50 text-orange-600" },
              { label: t("lenderDetails.planName"), value: currentPlan?.planName || t('lenderDetails.noPlan'), icon: <BsBoxSeam className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" },
              { label: t("lenderDetails.planStatus"), value: planPurchaseDetails?.planStatus || t('lenderDetails.na'), icon: <IoCheckmarkCircleOutline className="w-4 h-4" />, color: planPurchaseDetails?.isPlanActive ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600" },
              { label: t("lenderDetails.remaining"), value: `${planPurchaseDetails?.remainingDays ?? "0"} Days`, icon: <CiClock2 className="w-4 h-4" />, color: planPurchaseDetails?.remainingDays > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-all">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>{stat.icon}</div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

   {/* Info grid — 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Personal Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl"><FiUser className="w-4 h-4 text-orange-600" /></div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('lenderDetails.personalInformation')}</h3>
              </div>
              <div className="p-5 space-y-0">
                {[
                  [t('lenderDetails.fullName'), lenderData.userName],
                  [t('lenderDetails.emailAddress'), lenderData.email],
                  [t('lenderDetails.mobileNumber'), lenderData.mobileNo],
                  [t('lenderDetails.aadhaarNumber'), lenderData.aadharCardNo],
                  [t('lenderDetails.address'), lenderData.address],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[55%] truncate">{value || t('lenderDetails.na')}</span>
                  </div>
                ))}
              </div>
            </div>
            
 {/* Account Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/20 p-2 rounded-xl"><MdOutlineShield className="w-4 h-4 text-slate-600" /></div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('lenderDetails.accountStatus')}</h3>
              </div>
              <div className="p-5 space-y-0">
                {[
                  { label: t('lenderDetails.status'), isStatus: true },
                  { label: t('lenderDetails.accountCreated'), value: new Date(lenderData.createdAt).toLocaleDateString("en-IN") },
                  { label: t('lenderDetails.lastUpdated'), value: new Date(lenderData.updatedAt).toLocaleDateString("en-IN") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{item.label}</span>
                    {item.isStatus ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${lenderData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {lenderData?.isActive ? <><IoCheckmarkCircleOutline className="w-3 h-3" />{t('lenderDetails.active')}</> : <><AiOutlineCloseCircle className="w-3 h-3" />{t("lenderDetails.inactive")}</>}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

       {/* Subscription plan card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl"><BsBoxSeam className="w-4 h-4 text-blue-600" /></div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('lenderDetails.subscriptionPlan')}</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('lenderDetails.planInformation')}</p>
                {[[t('lenderDetails.planName'), currentPlan?.planName, true], [t("lenderDetails.duration"), currentPlan?.duration], [t("lenderDetails.price"), `₹${currentPlan?.priceMonthly?.toLocaleString() || "0"}`]].map(([label, value, hl], i) => (
                  <div key={i} className="flex justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className={`text-sm font-semibold ${hl ? "text-orange-600" : "text-gray-800 dark:text-gray-200"}`}>{value || "N/A"}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('lenderDetails.purchaseDetails')}</p>
                {[
                  [t('lenderDetails.purchaseDate'), planPurchaseDetails?.planPurchaseDate ? new Date(planPurchaseDetails.planPurchaseDate).toLocaleDateString("en-IN") : "N/A", "text-gray-800 dark:text-gray-200"],
                  [t("lenderDetails.expiryDate"), planPurchaseDetails?.planExpiryDate ? new Date(planPurchaseDetails.planExpiryDate).toLocaleDateString("en-IN") : "N/A", "text-rose-600"],
                  [t("lenderDetails.planStatus"), planPurchaseDetails?.planStatus || "N/A", planPurchaseDetails?.isPlanActive ? "text-green-600" : "text-amber-600"],
                  [t("lenderDetails.remaining"), `${planPurchaseDetails?.remainingDays ?? "0"} Days`, planPurchaseDetails?.remainingDays > 0 ? "text-green-600" : "text-red-600"],
                ].map(([label, value, color], i) => (
                  <div key={i} className="flex justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className={`text-sm font-semibold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

      
       {/* Plan Features — full width */}
<div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700">
  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3bg-green-50/60 border-green-100">
    {t('lenderDetails.planFeatures')}
  </p>

  {currentPlan?.planFeatures ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {["unlimitedLoans", "advancedAnalytics", "prioritySupport"].map((key) => {
        const value = currentPlan.planFeatures?.[key];
        const isEnabled = value === true;

        const label = t(`lenderDetails.features.${key}`, key);
        const desc = t(
          `lenderDetails.features.${key}Desc`,
          t('lenderDetails.features.defaultDesc')
        );

        return (
          <div
            key={key}
            className={`p-3 rounded-xl border ${
              isEnabled
                ? "bg-green-50/60 dark:bg-green-900/20 border-green-100 dark:border-green-800"
                : "bg-gray-50/60 dark:bg-gray-700/40 border-gray-100 dark:border-gray-600"
            }`}
          >
            <div className="flex items-start justify-between gap-3">

              {/* Left */}
              <div className="flex items-start gap-2">
                {isEnabled ? (
                  <IoCheckmarkCircleOutline className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <AiOutlineCloseCircle className="w-4 h-4 text-red-400 mt-0.5" />
                )}

                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Right Badge */}
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {isEnabled
                  ? t('lenderDetails.enabled')
                  : t('lenderDetails.disabled')}
              </span>
            </div>
          </div>
        );
      })}

    </div>
  ) : (
    <div className="text-center py-6 text-gray-400">
      <AiOutlineCloseCircle className="mx-auto mb-2 text-xl" />
      {t('lenderDetails.noFeaturesAvailable')}
    </div>
  )}
</div>

      </div>
    </div>
  </>
)}

    
      {/*    TABLE VIEW     */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">

          {/* Table Header — Profile Summary */}
          <div className="px-6 py-4 border-b border-gray-300 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
                {lenderData.profileImage ? (
                  <img src={lenderData.profileImage} alt={lenderData.userName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg">
                    {lenderData.userName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{lenderData.userName || t('lenderDetails.na')}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{lenderData.email || t('lenderDetails.na')}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              lenderData?.isActive
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}>
              {lenderData?.isActive
                ? <><IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> {t("lenderDetails.active")}</>
                : <><AiOutlineCloseCircle className="w-3.5 h-3.5" /> {t("lenderDetails.inactive")}</>}
            </span>
          </div>

          {/* Personal Information */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={2} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{t('lenderDetails.personalInformation')}</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">{t("lenderDetails.field")}</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("lenderDetails.value")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: t('lenderDetails.fullName'),      value: lenderData.userName },
                  { field: t('lenderDetails.emailAddress'),  value: lenderData.email },
                  { field: t('lenderDetails.mobileNumber'),  value: lenderData.mobileNo },
                  { field: t('lenderDetails.aadhaarNumber'), value: lenderData.aadharCardNo },
                  { field: t('lenderDetails.address'),        value: lenderData.address },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">{row.value || t('lenderDetails.na')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Account Status */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={2} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{t('lenderDetails.accountStatus')}</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">{t("lenderDetails.field")}</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("lenderDetails.value")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: t('lenderDetails.accountStatus'), value: lenderData?.isActive ? t('lenderDetails.active') : t("lenderDetails.inactive"), isStatus: true },
                  { field: t('lenderDetails.accountCreated'), value: new Date(lenderData.createdAt).toLocaleDateString("en-IN") },
                  { field: t('lenderDetails.lastUpdated'),    value: new Date(lenderData.updatedAt).toLocaleDateString("en-IN") },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className="px-6 py-3.5">
                      {row.isStatus ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          lenderData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {lenderData?.isActive
                            ? <><IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> {t("lenderDetails.active")}</>
                            : <><AiOutlineCloseCircle className="w-3.5 h-3.5" /> {t("lenderDetails.inactive")}</>}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subscription Plan */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={2} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{t('lenderDetails.subscriptionPlan')}</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">{t("lenderDetails.field")}</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("lenderDetails.value")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: t('lenderDetails.planName'), value: currentPlan?.planName, highlight: true },
                  { field: t('lenderDetails.duration'),  value: currentPlan?.duration },
                  { field: t('lenderDetails.price'),     value: `₹${currentPlan?.priceMonthly?.toLocaleString() || "0"}` },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className={`px-6 py-3.5 text-sm font-semibold ${row.highlight ? "text-orange-600" : "text-gray-800"}`}>{row.value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan Features */}
    {/* Plan Features */}
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-orange-50 border-y border-orange-300">
        <td colSpan={3} className="px-6 py-2.5">
          <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
            {t('lenderDetails.planFeatures')}
          </span>
        </td>
      </tr>
      <tr className="bg-gray-50 border-b border-gray-300">
        <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
          {t('lenderDetails.feature')}
        </th>
        <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
          {t('lenderDetails.description')}
        </th>
        <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">
          {t('lenderDetails.status')}
        </th>
      </tr>
    </thead>
    <tbody>
      {currentPlan?.planFeatures ? (
        ["unlimitedLoans", "advancedAnalytics", "prioritySupport"].map((key, i) => {
          const value = currentPlan.planFeatures?.[key] ?? false; // default false if undefined
          const isEnabled = value === true;

          return (
            <tr key={key} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">
                {t(`lenderDetails.features.${key}`)}
              </td>
              <td className="px-6 py-3.5 text-sm text-gray-500">
                {t(`lenderDetails.features.${key}Desc`, t('lenderDetails.features.defaultDesc'))}
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                }`}>
                  {isEnabled 
                    ? <><IoCheckmarkCircleOutline className="w-3 h-3" /> {t('lenderDetails.enabled')}</> 
                    : <><AiOutlineCloseCircle className="w-3 h-3" /> {t('lenderDetails.disabled')}</>}
                </span>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={3} className="px-6 py-4 text-sm text-gray-400 text-center">
            {t('lenderDetails.noFeaturesAvailable')}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          {/* ── Section 5: Purchase Details ── */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={2} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{t('lenderDetails.purchaseDetails')}</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">{t("lenderDetails.field")}</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("lenderDetails.value")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: t('lenderDetails.purchaseDate'), value: planPurchaseDetails?.planPurchaseDate ? new Date(planPurchaseDetails.planPurchaseDate).toLocaleDateString("en-IN") : "N/A", color: "text-gray-800" },
                  { field: t('lenderDetails.expiryDate'),   value: planPurchaseDetails?.planExpiryDate   ? new Date(planPurchaseDetails.planExpiryDate).toLocaleDateString("en-IN")   : "N/A", color: "text-rose-600" },
                  { field: t('lenderDetails.planStatus'),   value: planPurchaseDetails?.planStatus || "N/A", color: planPurchaseDetails?.isPlanActive ? "text-green-600" : "text-amber-600" },
                  { field: t('lenderDetails.remaining'),value: `${planPurchaseDetails?.remainingDays ?? "0"} Days`, color: planPurchaseDetails?.remainingDays > 0 ? "text-green-600" : "text-red-600" },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className={`px-6 py-3.5 text-sm font-semibold ${row.color}`}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  </div>
);
}