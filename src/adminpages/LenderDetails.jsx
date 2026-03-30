// src/pages/LenderDetails.jsx (Static Design Preview Version)
import { useEffect } from 'react';
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
  }, [dispatch, id, lenderFromState]);

  // Use data from navigation state if available, otherwise fall back to Redux
  const lenderData = lenderFromState || selectedLender?.lender;
  const currentPlan = lenderFromState?.currentPlan || selectedLender?.currentPlan;
  const planPurchaseDetails = lenderFromState?.planPurchaseDetails || selectedLender?.planPurchaseDetails;

  // Log for debugging
  if (lenderData) {
    console.log("Loaded lender:", lenderData.userName, lenderData._id);
  }


  if (isLoadingDetails && !lenderFromState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
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
     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      {/* 1. Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 sm:mb-8 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
      >
        ← Back to Lenders
      </button>

      
        
         <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Lender Details
        </h2>

        {/* 2. TOP PROFILE CARD */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6 md:mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8'>
          <div className="flex items-center gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg flex-shrink-0 z-10">
            {lenderData.profileImage ? (
              <img src={lenderData.profileImage} alt={lenderData.userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-black">
                {lenderData.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lenderData.userName || 'N/A'}
            </h1>
            <p className="text-orange-600 font-bold flex items-center justify-center md:justify-start gap-1 mt-1 text-sm sm:text-base">
              <CiLocationOn className="stroke-2 flex-shrink-0" /> {lenderData.address || 'Address not provided'}
            </p>
          </div>
          </div>
          </div>
        </div>

        {/* 3. PERSONAL INFORMATION CARD */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><FiUser /></div>
            Personal Information
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              { icon: <FiUser className="h-5 w-5" />, label: 'Full Name', value: lenderData.userName },
              { icon: <MdOutlineEmail className="h-5 w-5 stroke-[-1]" />, label: 'Email Address', value: lenderData.email },
              { icon: <IoCallOutline className="h-5 w-5 stroke-[0.5]" />, label: 'Mobile Number', value: lenderData.mobileNo },
              { icon: <FiCreditCard className="h-5 w-5 stroke-[1.5]" />, label: 'Aadhaar Number', value: lenderData.aadharCardNo },
              { icon: <CiLocationOn className="h-5 w-5 stroke-[0.5]" />, label: 'Permanent Address', value: lenderData.address }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group border-b border-slate-50 pb-4 last:border-0">
                <div className="text-orange-400 group-hover:text-orange-600 transition-colors text-xl mt-1">{item.icon}</div>
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className="text-slate-800 font-bold break-words">{item.value || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACCOUNT STATUS CARD */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] shadow-xl p-6 sm:p-8 text-white p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-3 text-orange-400">
            <MdOutlineShield /> Account Status
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 sm:gap-4">
                <IoCheckmarkCircleOutline className="text-green-400 text-xl sm:text-2xl" />
                <span className="font-bold text-slate-300 text-sm sm:text-base tracking-wide">Account Status</span>
              </div>
              <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-tighter ${lenderData?.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {lenderData?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Created</p>
                <p className="font-bold text-slate-200 text-xs sm:text-base">{new Date(lenderData.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Updated</p>
                <p className="font-bold text-slate-200 text-xs sm:text-base">{new Date(lenderData.updatedAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SUBSCRIPTION PLANS CARD */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-orange-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black mb-6 text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><BsBoxSeam /></div>
            Subscription Plans
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-50/50 rounded-2xl p-5 sm:p-6 border border-slate-100">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-orange-100 pb-2">Plan Information</h4>
              <div className="space-y-2">
                {[
                  { label: 'Plan Name ', value: currentPlan?.planName },
                  { label: 'Duration', value: currentPlan?.duration },
                  { label: 'Price', value: `₹${currentPlan?.priceMonthly?.toLocaleString()}` }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">{row.label}</span>
                    <span className={`text-slate-800 font-black ${row.label === 'Plan Name' ? 'text-orange-600' : ''}`}>
                      {row.value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-3">
              <p className="text-sm font-black text-slate-800 px-1">Plan Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPlan?.planFeatures && Object.entries(currentPlan.planFeatures)
                  .filter(([key]) => key !== 'prioritySupport')
                  .map(([key, value]) => (
                    <div key={key} className={`flex items-center justify-between p-3 rounded-xl border ${value ? 'bg-green-50/70 border-green-200' : 'bg-red-50/70 border-red-200 opacity-80'}`}>
                      <span className="text-xs font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      {value ? <IoCheckmarkCircleOutline className="text-green-600" /> : <AiOutlineCloseCircle className="text-red-500" />}
                    </div>
                  ))}
              </div>
            </div>

            {/* Purchase Details Footer */}
            {/* Purchase Details Footer */}
            <div className="pt-8 mt-8 border-t-2 border-dashed border-slate-100">
              {/* Title Yahan Add Kiya Hai */}
              <h3 className="text-sm font-black text-slate-800 px-1">
                Purchase Details
              </h3>

              <div className="pt-6 border-t-2 border-dashed border-slate-100">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><CiCalendar className="h-5 w-5 stroke-[0.5]" /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Purchase Date</p>
                      <p className="text-sm font-bold text-gray-800">{planPurchaseDetails?.planPurchaseDate ? new Date(planPurchaseDetails.planPurchaseDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><CiClock2 className="h-5 w-5 stroke-[0.5]" /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Expiry Date</p>
                      <p className="text-sm font-bold text-rose-600">{planPurchaseDetails?.planExpiryDate ? new Date(planPurchaseDetails.planExpiryDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                    </div>
                  </div>
                  {/* Plan Status */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600 flex-shrink-0"><IoCheckmarkCircleOutline className="h-5 w-5 stroke-[0.5]" /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Status</p>
                      <span className={`text-[10px] font-black uppercase ${planPurchaseDetails?.isPlanActive ? 'text-green-600' : 'text-amber-600'}`}>
                        {planPurchaseDetails?.planStatus || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Remaining Days - FIXED & ADDED BACK */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600 flex-shrink-0"><CiClock2 className="h-5 w-5 stroke-[0.5]" /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Remaining</p>
                      <p className={`text-xs sm:text-sm font-bold ${planPurchaseDetails?.remainingDays > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {planPurchaseDetails?.remainingDays ?? '0'} Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
     
      </div>
    </div>
    </div>
  );
}