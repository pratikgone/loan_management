import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRevenue } from '../store/revenueSlice';
import { FiDollarSign, FiShoppingCart, FiActivity, FiUsers } from 'react-icons/fi';
import { CiClock2 } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { FiCheck } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FiCheckCircle } from "react-icons/fi";

export function Revenue() {
    const dispatch = useDispatch();
    const { revenueData, isLoading, error } = useSelector((state) => state.revenue);

    const [selectedCard, setSelectedCard] = useState(null);

    //filter modal
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


    // Filters state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupBy, setGroupBy] = useState('all');
    const [tempGroupBy, setTempGroupBy] = useState(groupBy); //temporary selection in modal


    // Fetch revenue on mount + filter change
    useEffect(() => {
        dispatch(fetchRevenue({ startDate, endDate, groupBy }));
    }, [dispatch, startDate, endDate, groupBy]);

    // Real data from API
    const summary = revenueData?.summary || {
        totalRevenue: 0,
        totalPurchases: 0,
        averageRevenuePerPurchase: 0,
        activePlansCount: 0,
    };

    const plans = revenueData?.revenueByPlan || [];
    const monthly = revenueData?.revenueByMonth || [];
    const yearly = revenueData?.revenueByYear || [];
    const purchases = revenueData?.purchaseDetails || [];

    //filter functionality
    // Show sections based on groupBy
    const showByPlan = groupBy === 'all' || groupBy === 'plan';
    const showByMonth = groupBy === 'all' || groupBy === 'month';
    const showByYear = groupBy === 'all' || groupBy === 'year';


    const summaryCards = [
        {
            title: "Total Revenue",
            value: `₹${summary.totalRevenue?.toLocaleString() || "0"}`,
            icon: <FiDollarSign className="w-5 h-5 text-green-600" />,
            bg: "bg-green-50",
            color: "text-green-600",
            description: "Total revenue generated from all plan purchases."
        },
        {
            title: "Total Purchases",
            value: summary.totalPurchases || "0",
            icon: <FiShoppingCart className="w-5 h-5 text-blue-600" />,
            bg: "bg-blue-50",
            color: "text-blue-600",
            description: "Total number of plan purchases made."
        },
        {
            title: "Avg. Per Purchase",
            value: `₹${summary.averageRevenuePerPurchase?.toLocaleString() || "0"}`,
            icon: <HiMiniArrowTrendingUp className="w-5 h-5 text-orange-600" />,
            bg: "bg-orange-50",
            color: "text-orange-600",
            description: "Average revenue per purchase transaction."
        },
        {
            title: "Active Plans",
            value: summary.activePlansCount || "0",
            icon: <FiCheckCircle className="w-5 h-5 text-green-600" />,
            bg: "bg-green-50",
            color: "text-green-600",
            description: "Number of currently active subscription plans."
        }
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                <span className="ml-4 text-lg text-gray-600 font-medium">Loading revenue data...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center p-6 font-medium">Error: {error}</div>;
    }

    const formatDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Overall total revenue
    const overallTotalRevenue = summary.totalRevenue || 1; // 1 avoid divide by zero

    // each plan to progress percentage
    const getProgress = (planRevenue) => {
        if (!planRevenue || overallTotalRevenue === 0) return 0;
        return Math.min(Math.round((planRevenue / overallTotalRevenue) * 100), 100);
    };

    // each month  progress percentage
    const getMonthlyProgress = (monthRevenue) => {
        if (!monthRevenue || overallTotalRevenue === 0) return 0;
        return Math.min(Math.round((monthRevenue / overallTotalRevenue) * 100), 100);
    };

    //each year progress percentage
    const getYearlyProgress = (yearRevenue) => {
        if (!yearRevenue || overallTotalRevenue === 0) return 0;
        return Math.min(Math.round((yearRevenue / overallTotalRevenue) * 100), 100);
    }

    return (

        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Revenue Report
        </h2>
            {/* Horizontal "All Data" Card */}
            <div className="mb-6 md:mb-8 max-w-7xl mx-auto">
                <div
                    onClick={() => setIsFilterModalOpen(true)}
                    className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 hover:shadow-md cursor-pointer transition-all hover:border-orange-300 flex items-center justify-center text-center"
                >
                    <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-3">
                        <CiFilter className="w-5 h-5 md:w-6 md:h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                        All Data
                    </h2>
                </div>
            </div>
            {/* Summary Cards with Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-7xl mx-auto">
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedCard(card)}
                        className={`bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md cursor-pointer transition-all ${card.bg} hover:scale-[1.02]`}
                    >
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className={`p-3 md:p-4 rounded-lg ${card.bg}`}>
                                {card.icon}
                            </div>
                            <div className='overflow-hidden'>
                                <p className="text-xs md:text-sm text-gray-600 font-medium">{card.title}</p>
                                <p className={`text-xl md:text-2xl font-bold  ${card.color} mt-1`}>{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Modal */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-lg ${selectedCard.bg}`}>
                                    {selectedCard.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {selectedCard.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 text-center">
                            <p className={`text-2xl md:text-2xl font-bold ${selectedCard.color} mb-4`}>
                                {selectedCard.value}
                            </p>
                            <p className="text-sm font-semibold text-gray-400 leading-relaxed">
                                {selectedCard.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* Modal Container: Added flex and flex-col */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">

                        {/* Header: Fixed */}
                        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="text-gray-500 hover:text-orange-600 text-3xl font-bold transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body: Scrollable area (flex-grow) */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <CiFilter className="w-6 h-6 text-orange-600" />
                                Group By
                            </h4>

                            <div className="border-t border-gray-200 my-4"></div>

                            <div className="space-y-4">
                                {[
                                    { value: 'all', label: 'All Data' },
                                    { value: 'plan', label: 'By Plan' },
                                    { value: 'month', label: 'By Month' },
                                    { value: 'year', label: 'By Year' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${tempGroupBy === option.value
                                            ? 'border-orange-500 bg-orange-50/70 shadow-md ring-1 ring-orange-300/30'
                                            : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50 hover:shadow-sm'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="groupBy"
                                            value={option.value}
                                            checked={tempGroupBy === option.value}
                                            onChange={() => setTempGroupBy(option.value)}
                                            className="w-5 h-5 accent-orange-600 border-2 border-gray-300 rounded-full cursor-pointer"
                                        />
                                        <span className="text-base font-medium text-gray-800">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Footer Buttons: Fixed at bottom */}
                        <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gray-50/70">
                            <button
                                onClick={() => {
                                    setTempGroupBy('all');
                                    setIsFilterModalOpen(false);
                                }}
                                className="flex-1 max-w-[130px] sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-7 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm cursor-pointer"
                            >
                                <IoIosCloseCircleOutline className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className='whitespace-nowrap'>Clear All</span>
                            </button>

                            <button
                                onClick={() => {
                                    setGroupBy(tempGroupBy);
                                    setIsFilterModalOpen(false);
                                }}
                                className="flex-[2] max-w-[200px] sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-12 py-2.5 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-md cursor-pointer"
                            >
                               <span className='whitespace-nowrap'>Apply Filters</span> 
                                <FiCheck className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Revenue by Plan */}
            {showByPlan && (
                <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Revenue by Plan</h2>
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {plans.length > 0 ? (
                            plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-7 group hover:border-orange-300 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-3 mb-2">
                                                <div className="flex items-start gap-3">
                                                    <BsBoxSeam className="w-4 h-4 md:w-4 md:h-4 text-orange-600 flex-shrink-0" />
                                                </div>
                                                <h3 className='text-lg font-bold text-gray-900'>
                                                    {plan.planName}
                                                </h3>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-gray-700 mt-2">
                                                <div className="flex items-center gap-2 text-center">

                                                    <span className="text-sm text-gray-500 font-medium">
                                                        ₹{plan.priceMonthly?.toLocaleString() || "0"} / {plan.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:text-right">
                                            <p className="text-2xl font-black text-green-600">
                                                ₹{plan.totalRevenue?.toLocaleString() || "0"}
                                            </p>
                                        </div>
                                    </div>



                                    {/* Progress Bar by plan */}
                                    <div className="mt-10">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${getProgress(plan.totalRevenue)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                            {getProgress(plan.totalRevenue)}% of total revenue
                                        </p>
                                    </div>


                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 py-4 border-y border-gray-50">
                                        <div className="text-center ">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Purchases</p>
                                            <p className="text-base font-bold text-gray-900">{plan.totalPurchases}</p>
                                        </div>
                                        <div className="text-center ">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active</p>
                                            <p className="text-base font-bold text-green-600">{plan.activePurchases}</p>
                                        </div>
                                        <div className="text-center ">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expired</p>
                                            <p className="text-base font-bold text-red-500">{plan.expiredPurchases}</p>
                                        </div>
                                        <div className="text-center ">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg.</p>
                                            <p className="text-base font-bold text-gray-900">
                                                ₹{plan.averageRevenuePerPurchase?.toLocaleString() || "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">No plan revenue data available</div>
                        )}
                    </div>
                </div>
            )}
            {/* Monthly Revenue */}
            {showByMonth && (
                <div className="mb-10 max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 px-2 md:px-0">Monthly Revenue</h2>
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {monthly.length > 0 ? (
                            monthly.map((month, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-300"
                                >
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-800">{month.monthName}</h3>

                                            <div className="text-right">
                                                <p className="text-xl md:text-2xl font-bold text-green-600">
                                                    ₹{month.totalRevenue.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>


                                        {/* Progress Bar - Month Revenue */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${getMonthlyProgress(month.totalRevenue)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                {getMonthlyProgress(month.totalRevenue)}% of total revenue
                                            </p>
                                        </div>


                                        <div className="flex items-center gap-6">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-bold flex items-center gap-2">
                                                    <MdOutlineLocalGroceryStore className="w-5 h-5 text-blue-600" />
                                                    {month.totalPurchases} Purchases
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))

                        ) : (
                            <div className="text-center text-gray-500 py-10">No monthly revenue data available</div>
                        )}

                    </div>
                </div>
            )}
            {/* Yearly Revenue */}
            {showByYear && (
                <div className="mb-10 max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 px-2 md:px-0">Yearly Revenue</h2>
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {yearly.length > 0 ? (
                            yearly.map((year, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-300 group"
                                >
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-800">{year.year}</h3>

                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-600">
                                                    ₹{year.totalRevenue.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar - Year Revenue  */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${getYearlyProgress(year.totalRevenue)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                {getYearlyProgress(year.totalRevenue)}% of total revenue
                                            </p>
                                        </div>


                                        <div className="flex items-center gap-6">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                    <MdOutlineLocalGroceryStore className="w-5 h-5 text-blue-600" />
                                                    {year.totalPurchases} Purchases
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">No yearly revenue data available</div>
                        )}
                    </div>
                </div>
            )}


            {/* Recent Purchases */}
            {groupBy === 'all' && (
                <div className="mb-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                        Recent Purchases
                    </h2>

                    <div className="space-y-4">
                        {purchases.length > 0 ? (
                            purchases.map((purchase, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all"
                                >
                                    <div className="p-5 md:p-6 flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-3 h-3 rounded-full ${purchase.remainingDays > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500 animate-pulse'
                                                    }`} />
                                                <h3 className="font-bold text-gray-900 text-lg">
                                                    {purchase.planName}
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                                    <div className="flex items-center gap-3 mb-2 ">
                                                        <FiCalendar className="w-5 h-5 text-orange-600" />
                                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Purchase Date</p>
                                                    </div>
                                                    <p className="text-xs font-bold">{formatDate(purchase.purchaseDate)}</p>
                                                </div>

                                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <CiClock2 className="w-5 h-5 text-orange-600" />
                                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Expires On</p>
                                                    </div>
                                                    <p className="text-xs font-bold">{formatDate(purchase.expiryDate)}</p>
                                                </div>

                                                <div className={`p-3 rounded-lg flex items-center gap-3  ${purchase.remainingDays > 30 ? 'bg-green-50 border-green-200' :
                                                    purchase.remainingDays > 0 ? 'bg-yellow-50 border-yellow-200' :
                                                        'bg-red-50 border-red-200 text-center'
                                                    }`}>
                                                    <div className="flex items-center gap-3 mb-2 ">
                                                        <CiCalendar className="w-5 h-5 text-orange-600" />
                                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Status</p>
                                                    </div>
                                                    <p className={`text-xs font-bold ${purchase.remainingDays > 30 ? 'text-green-700' :
                                                        purchase.remainingDays > 0 ? 'text-yellow-700' : 'text-red-700'
                                                        }`}>
                                                        {purchase.remainingDays > 0
                                                            ? `${purchase.remainingDays} days remaining`
                                                            : 'Expired'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:border-l border-gray-300 lg:pl-8 flex items-center justify-between lg:justify-end lg:min-w-[150px]">
                                            <div className="text-center md:text-right">
                                                <p className="text-2xl font-black text-green-600">
                                                    ₹{purchase.price?.toLocaleString() || "0"}
                                                </p>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">No recent purchases found</div>
                        )}
                    </div>
                </div>
            )}
        </div>

    );
}