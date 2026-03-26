// (Lenders Page)

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiFilter } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { fetchLendersWithPlans } from "../store/lendersSlice";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";

export function Lenders() {



    //search bar state
    const [searchQuery, setSearchQuery] = useState("");

    //filter click modal open
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    //filter icon search state
    const [planStatusFilter, setPlanStatusFilter] = useState("all");

    //pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;


 

useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, planStatusFilter]);



    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { lenders, isLoading, error, lastFetched } = useSelector((state) => state.lenders)

    useEffect(() => {
        const FIVE_MIN = 5 * 60 * 1000;
        const shouldRefetch = !lastFetched || Date.now() - lastFetched > FIVE_MIN;

        if (shouldRefetch) {
            dispatch(fetchLendersWithPlans());
        }
    }, [dispatch, lastFetched]);

    if (isLoading && lenders.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                <span className="ml-4 text-lg text-gray-600 font-medium">Loading lenders data...</span>
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


    const filteredLenders = lenders.filter(lender => {
        const query = searchQuery.toLowerCase();
        return (
            (lender.userName || " ").toLowerCase().includes(query) ||
            (lender.email || " ").toLowerCase().includes(query) ||
            (lender.mobileNo || " ").toLowerCase().includes(query)
        );
    });

    const statusFilteredLenders = filteredLenders.filter(lender => {
        if (planStatusFilter === "all") return true;
        if (planStatusFilter === "active") return lender.planPurchaseDetails?.isPlanActive === true;
        if (planStatusFilter === "expired") return lender.planPurchaseDetails?.isPlanActive === false;
        return true;
    });

       // Pagination logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentLenders = statusFilteredLenders.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(statusFilteredLenders.length / itemsPerPage);

    // Stats calculation (redux se direct)
    const totalLenders = lenders.length;
    const activePlans = lenders.filter((l) => l.planPurchaseDetails?.isPlanActive === true).length;
    const expiredPlans = lenders.filter((l) => l.planPurchaseDetails?.isPlanActive === false).length;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 md:mb-8 text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lenders with Plans</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
                <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or mobile"
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                />

                <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors flex-shrink-0 px-1"
                >

                    <FiFilter className="w-5 h-5 cursor-pointer" />
                </button>
            </div>



            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* Modal Container: flex-col aur max-h set kiya hai taaki screen se bahar na jaye */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">

                        {/* Header: flex-shrink-0 taaki ye upar fix rahe */}
                        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="text-gray-500 hover:text-orange-600 text-3xl font-bold transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body: flex-grow aur overflow-y-auto because long list scroll */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <FiFilter className="w-5 h-5 text-orange-600" />
                                    <h4 className="text-lg font-semibold text-gray-900">Plan Status</h4>
                                </div>

                                <div className="border-b border-gray-200 mb-6"></div>

                                <div className="space-y-4">
                                    {[
                                        { value: 'all', label: 'All Plans' },
                                        { value: 'active', label: 'Active' },
                                        { value: 'expired', label: 'Expired' },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${planStatusFilter === option.value
                                                ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-300/30'
                                                : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50/80 hover:shadow-sm'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="planStatus"
                                                value={option.value}
                                                checked={planStatusFilter === option.value}
                                                onChange={() => setPlanStatusFilter(option.value)}
                                                className="w-5 h-5 accent-orange-600 border-2 border-gray-300 rounded-full cursor-pointer transition-all duration-200"
                                            />
                                            <span className="text-base font-medium text-gray-800">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer: flex-col (mobile pe) aur sm:flex-row (badi screen pe) */}
                        <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-2.5 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gray-50/70">
                            <button
                                onClick={() => {
                                    setPlanStatusFilter('all');
                                    setIsFilterOpen(false);
                                }}
                                className="flex-1 max-w-[130px] sm:w-auto flex items-center justify-center gap-1.5 px-3 sm:px-7 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm cursor-pointer"
                            >
                                <IoIosCloseCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="whitespace-nowrap">Clear All</span>
                            </button>

                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-[1.5] max-w-[180px] sm:w-auto flex items-center justify-center gap-1.5 px-4 sm:px-12 py-2.5 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-md cursor-pointer"
                            >
                                <span className="whitespace-nowrap">Apply Filters</span>
                                <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Stats White Card - Search bar ke niche */}
            <div className="mb-8 bg-white rounded-2xl border border-orange-100 shadow-sm p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {/* Total Lenders */}
                    <div className="py-2 sm:py-0 text-center">
                        <p className="text-xs text-gray-500 font-bold tracking-wider">Total Lenders</p>
                        <h3 className="text-2xl font-bold text-orange-600">
                            {totalLenders}
                        </h3>
                    </div>

                    {/* Active Plans */}
                    <div className="py-2 sm:py-0 sm:pl-4 text-center">
                        <p className="text-xs text-gray-500 font-bold tracking-wider">Active Plans</p>
                        <h3 className="text-2xl font-bold text-green-600">
                            {activePlans}
                        </h3>

                    </div>
                    {/* Expired Plans */}
                    <div className="py-2 sm:py-0 sm:pl-4 text-center">
                        <p className="text-sm text-gray-600 mt-1">Expired Plans</p>
                        <h3 className="text-2xl font-bold text-red-600">
                            {expiredPlans}
                        </h3>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {currentLenders.length > 0 ? (
                    currentLenders.map((lender) => {
                        return (
                            <div key={lender._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">

                                {/* Top Header Section */}
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-5 p-2 md:p-0">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {/* Small Orange Circle with IMG */}
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0 shadow-sm">
                                            IMG
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-800 truncate leading-tight">
                                                {lender.userName || "Unknown Lender"}
                                            </h3>
                                            <p className="text-[11px] md:text-xs text-gray-500 truncate max-w-[180px] md:max-w-full">
                                                {lender.email || "No Email"}
                                            </p>
                                            <p className="text-[11px] md:text-xs text-gray-400 font-medium">
                                                {lender.mobileNo || "No Mobile"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dynamic Status Tag */}
                                    <div className={`
                                      text-[9px] md:text-[10px] lg:text-[10px] xl:text-[11px] font-bold 
    px-2 lg:px-1.5 xl:px-2.5 py-1 rounded-full uppercase tracking-tighter border
    whitespace-nowrap shrink-0
    ml-2 lg:ml-1 xl:ml-3
                                    ${lender.planPurchaseDetails?.isPlanActive
                                            ? "text-green-600 bg-green-50 border-green-200"
                                            : "text-red-600 bg-red-50 border-red-200"
                                        }
                                       `}>
                                        {lender.planPurchaseDetails?.isPlanActive ? "Active Plan" : "Expired"}
                                    </div>
                                </div>

                                {/* Faint Orange Square Section */}

                                <div className="bg-orange-50/90 rounded-lg p-4 mb-4 mx-auto w-[96%] border-l-4 border-orange-600">
                                    <h4 className="text-sm font-bold mb-4 tracking-wide flex items-center gap-3">
                                        <BsBoxSeam className="w-3 h-3 text-orange-600 flex-shrink-0" />
                                        Current Plan
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-700">

                                        {/* Har row mein 'flex justify-between' hai taaki gap maintain rahe */}
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-sm text-gray-500">Plan:</span>
                                            <span className=" text-gray-800 font-bold text-sm">{lender.currentPlan?.planName || "N/A"}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-sm text-gray-500">Price:</span>
                                            <span className=" text-gray-800 font-bold text-sm">₹{lender.currentPlan?.priceMonthly || 0}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-sm text-gray-500">Purchased:</span>
                                            <span className="text-gray-800 font-bold text-sm">
                                                {lender.planPurchaseDetails?.planPurchaseDate
                                                    ? new Date(lender.planPurchaseDetails.planPurchaseDate).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500 text-sm">Expires:</span>
                                            <span className="text-red-600 font-bold text-sm">
                                                {lender.planPurchaseDetails?.planExpiryDate
                                                    ? new Date(lender.planPurchaseDetails.planExpiryDate).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500 text-sm">Remaining:</span>
                                            <span className="text-green-600 font-bold font-bold text-sm">
                                                {lender.planPurchaseDetails?.remainingDays ?? 0} Days
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* Bottom Footer Section */}
                                <div className="mt-auto pt-3 flex justify-between items-center text-xs border-t border-gray-50">
                                    <span className="text-gray-500">
                                        Joined: {lender.createdAt ? new Date(lender.createdAt).toLocaleDateString() : "N/A"}
                                    </span>
                                    <button className="text-orange-600 font-bold hover:underline cursor-pointer"
                                        onClick={() => navigate(`/lenders/${lender._id}/details`, { state: { lender } })}>
                                        View Details
                                    </button>
                                </div>

                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No lenders found matching "{searchQuery}"
                    </div>
                )}
            </div>
            {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded-lg text-sm font-medium ${page === currentPage ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        {page}
      </button>
    ))}
  </div>
)}
        </div>
    );
}