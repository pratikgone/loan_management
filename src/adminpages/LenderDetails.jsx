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

export function LenderDetails() {

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
        <span className='ml-4 text-lg font-medium text-gray-600'>Loading Lender Details...</span>
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
        Lender details not found.
      </div>
    );
  }


 return (
  <div className="p-4 md:p-8">

   

      {/* Back Button + Title + Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
          >
            ← Back to Lenders
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Lender Details</h2>
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
            <span className="hidden sm:inline">Cards</span>
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
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

     
      {/*   CARD VIEW   */}
     
    
   {viewMode === "card" && (
  <>
    {/* ── Hero Card ── */}
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-500" />
      <div className="p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left — Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-50 shadow-md shrink-0">
            {lenderData.profileImage ? (
              <img src={lenderData.profileImage} alt={lenderData.userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-black">
                {lenderData.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {lenderData.userName || "N/A"}
            </h1>
            <p className="text-orange-600 font-bold flex items-center gap-1 mt-1 text-sm">
              <CiLocationOn className="stroke-2 flex-shrink-0" />
              {lenderData.address || "Address not provided"}
            </p>
          </div>
        </div>

        {/* Right — Status + Email */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            lenderData?.isActive
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}>
            {lenderData?.isActive
              ? <><IoCheckmarkCircleOutline className="w-4 h-4" /> Active</>
              : <><AiOutlineCloseCircle className="w-4 h-4" /> Inactive</>}
          </span>
          <p className="text-sm text-gray-400 font-medium">{lenderData.email || "N/A"}</p>
        </div>
      </div>
    </div>

    {/* ── Stats Row ── */}
    <div className='mb-10'>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { label: "Mobile",       value: lenderData.mobileNo || "N/A",                                    icon: <IoCallOutline className="w-5 h-5" />,          color: "bg-orange-100 text-orange-600" },
        { label: "Plan",         value: currentPlan?.planName || "No Plan",                              icon: <BsBoxSeam className="w-5 h-5" />,              color: "bg-blue-100 text-blue-600"     },
        { label: "Plan Status",  value: planPurchaseDetails?.planStatus || "N/A",                        icon: <IoCheckmarkCircleOutline className="w-5 h-5" />, color: planPurchaseDetails?.isPlanActive ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600" },
        { label: "Remaining",    value: `${planPurchaseDetails?.remainingDays ?? "0"} Days`,             icon: <CiClock2 className="w-5 h-5" />,               color: planPurchaseDetails?.remainingDays > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600" },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4 flex items-center gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-xl ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">{stat.label}</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
    </div>

    {/* ── 2 Column Layout ── */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-xl">
            <FiUser className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
        </div>
        <div className="p-5 space-y-1">
          {[
            { label: "Full Name",      value: lenderData.userName },
            { label: "Email Address",  value: lenderData.email },
            { label: "Mobile Number",  value: lenderData.mobileNo },
            { label: "Aadhaar Number", value: lenderData.aadharCardNo },
            { label: "Address",        value: lenderData.address },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
              <span className="text-sm font-bold text-gray-800 text-right max-w-[55%] truncate">{item.value || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl">
            <MdOutlineShield className="w-4 h-4 text-slate-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Account Status</h3>
        </div>
        <div className="p-5 space-y-1">
          {[
            { label: "Status",          value: lenderData?.isActive ? "Active" : "Inactive", isStatus: true },
            { label: "Account Created", value: new Date(lenderData.createdAt).toLocaleDateString("en-IN") },
            { label: "Last Updated",    value: new Date(lenderData.updatedAt).toLocaleDateString("en-IN") },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
              {item.isStatus ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  lenderData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {lenderData?.isActive
                    ? <><IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> Active</>
                    : <><AiOutlineCloseCircle className="w-3.5 h-3.5" /> Inactive</>}
                </span>
              ) : (
                <span className="text-sm font-bold text-gray-800">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Subscription Plan Card ── */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-xl">
          <BsBoxSeam className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">Subscription Plan</h3>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Plan Info */}
        <div className="space-y-1">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Plan Information</p>
          {[
            { label: "Plan Name", value: currentPlan?.planName, highlight: true },
            { label: "Duration",  value: currentPlan?.duration },
            { label: "Price",     value: `₹${currentPlan?.priceMonthly?.toLocaleString() || "0"}` },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.label}</span>
              <span className={`text-sm font-bold ${row.highlight ? "text-orange-600" : "text-gray-800"}`}>
                {row.value || "N/A"}
              </span>
            </div>
          ))}
        </div>

        {/* Purchase Details */}
        <div className="space-y-1">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Purchase Details</p>
          {[
            { label: "Purchase Date", value: planPurchaseDetails?.planPurchaseDate ? new Date(planPurchaseDetails.planPurchaseDate).toLocaleDateString("en-IN") : "N/A", color: "text-gray-800" },
            { label: "Expiry Date",   value: planPurchaseDetails?.planExpiryDate   ? new Date(planPurchaseDetails.planExpiryDate).toLocaleDateString("en-IN")   : "N/A", color: "text-rose-600" },
            { label: "Plan Status",   value: planPurchaseDetails?.planStatus || "N/A", color: planPurchaseDetails?.isPlanActive ? "text-green-600" : "text-amber-600" },
            { label: "Remaining",     value: `${planPurchaseDetails?.remainingDays ?? "0"} Days`, color: planPurchaseDetails?.remainingDays > 0 ? "text-green-600" : "text-red-600" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.label}</span>
              <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Plan Features — full width */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Plan Features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPlan?.planFeatures
              ? Object.entries(currentPlan.planFeatures)
                  .filter(([key]) => key !== "prioritySupport")
                  .map(([key, value]) => (
                    <div key={key} className={`flex items-center justify-between p-3 rounded-xl border ${
                      value ? "bg-green-50/60 border-green-100" : "bg-gray-50/60 border-gray-100"
                    }`}>
                      <div className="flex items-center gap-2">
                        {value
                          ? <IoCheckmarkCircleOutline className="w-4 h-4 text-green-600 shrink-0" />
                          : <AiOutlineCloseCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        <span className="text-sm font-bold text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                      }`}>
                        {value ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))
              : <p className="text-sm text-gray-400">No features available</p>}
          </div>
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
                <h3 className="text-sm font-bold text-gray-900">{lenderData.userName || "N/A"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{lenderData.email || "N/A"}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              lenderData?.isActive
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}>
              {lenderData?.isActive
                ? <><IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> Active</>
                : <><AiOutlineCloseCircle className="w-3.5 h-3.5" /> Inactive</>}
            </span>
          </div>

          {/* Personal Information */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={2} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Personal Information</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Field</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Full Name",      value: lenderData.userName },
                  { field: "Email Address",  value: lenderData.email },
                  { field: "Mobile Number",  value: lenderData.mobileNo },
                  { field: "Aadhaar Number", value: lenderData.aadharCardNo },
                  { field: "Address",        value: lenderData.address },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">{row.value || "N/A"}</td>
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
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Account Status</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Field</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Account Status", value: lenderData?.isActive ? "Active" : "Inactive", isStatus: true },
                  { field: "Account Created", value: new Date(lenderData.createdAt).toLocaleDateString("en-IN") },
                  { field: "Last Updated",    value: new Date(lenderData.updatedAt).toLocaleDateString("en-IN") },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.field}</td>
                    <td className="px-6 py-3.5">
                      {row.isStatus ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          lenderData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {lenderData?.isActive
                            ? <><IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> Active</>
                            : <><AiOutlineCloseCircle className="w-3.5 h-3.5" /> Inactive</>}
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
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Subscription Plan</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Field</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Plan Name", value: currentPlan?.planName, highlight: true },
                  { field: "Duration",  value: currentPlan?.duration },
                  { field: "Price",     value: `₹${currentPlan?.priceMonthly?.toLocaleString() || "0"}` },
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-50 border-y border-orange-300">
                  <td colSpan={3} className="px-6 py-2.5">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Plan Features</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Feature</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentPlan?.planFeatures
                  ? Object.entries(currentPlan.planFeatures)
                      .filter(([key]) => key !== "prioritySupport")
                      .map(([key, value], i) => (
                        <tr key={key} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                          <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-gray-500">
                            {key === "advancedAnalytics" ? "Access detailed analytics dashboard" : "Feature included in plan"}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                            }`}>
                              {value
                                ? <><IoCheckmarkCircleOutline className="w-3 h-3" /> Enabled</>
                                : <><AiOutlineCloseCircle className="w-3 h-3" /> Disabled</>}
                            </span>
                          </td>
                        </tr>
                      ))
                  : (
                    <tr><td colSpan={3} className="px-6 py-4 text-sm text-gray-400 text-center">No features available</td></tr>
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
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Purchase Details</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Field</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Purchase Date", value: planPurchaseDetails?.planPurchaseDate ? new Date(planPurchaseDetails.planPurchaseDate).toLocaleDateString("en-IN") : "N/A", color: "text-gray-800" },
                  { field: "Expiry Date",   value: planPurchaseDetails?.planExpiryDate   ? new Date(planPurchaseDetails.planExpiryDate).toLocaleDateString("en-IN")   : "N/A", color: "text-rose-600" },
                  { field: "Plan Status",   value: planPurchaseDetails?.planStatus || "N/A", color: planPurchaseDetails?.isPlanActive ? "text-green-600" : "text-amber-600" },
                  { field: "Remaining Days",value: `${planPurchaseDetails?.remainingDays ?? "0"} Days`, color: planPurchaseDetails?.remainingDays > 0 ? "text-green-600" : "text-red-600" },
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
  
);
}