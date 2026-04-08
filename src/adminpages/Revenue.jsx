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
import { IoIosSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";


//pie chart
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";
import { exportRevenuePDF } from '../utils/exportRevenuePDF';
import { useTranslation } from 'react-i18next';

export function Revenue() {
  const dispatch = useDispatch();
  const { revenueData, isLoading, error } = useSelector((state) => state.revenue);

  const [selectedCard, setSelectedCard] = useState(null);

  //filter modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState("card");

  const [searchQuery, setSearchQuery] = useState("");


  const {t} = useTranslation();



  // Filters state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState('all');
  const [tempGroupBy, setTempGroupBy] = useState(groupBy); //temporary selection in modal

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;


  // Fetch revenue on mount + filter change
  useEffect(() => {
    dispatch(fetchRevenue({ startDate, endDate, groupBy }));
  }, [dispatch, startDate, endDate, groupBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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



  // SEARCH + FILTER LOGIC 
  const filteredData = {
    plans: plans.filter(plan =>
      plan.planName?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    monthly: monthly.filter(month =>
      month.monthName?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    yearly: yearly.filter(year =>
      String(year.year).includes(searchQuery)
    ),
    purchases: purchases.filter(item =>
      item.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile?.toString().includes(searchQuery)
    )
  };

  // Pagination for Recent Purchases only
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginatedPurchases = filteredData.purchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.purchases.length / itemsPerPage);



  const filteredPurchases = purchases.filter((item) =>
    item.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mobile?.toString().includes(searchQuery)
  );



  //filter functionality
  // Show sections based on groupBy
  const showByPlan = groupBy === 'all' || groupBy === 'plan';
  const showByMonth = groupBy === 'all' || groupBy === 'month';
  const showByYear = groupBy === 'all' || groupBy === 'year';


  const summaryCards = [
    {
      title: t("totalRevenue"),
      value: `₹${summary.totalRevenue?.toLocaleString() || "0"}`,
      icon: <MdCurrencyRupee className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      color: "text-green-600",
      description: t("totalRevenueDesc")
    },
    {
      title: t("totalPurchases"),
      value: summary.totalPurchases || "0",
      icon: <FiShoppingCart className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      color: "text-blue-600",
      description: t("totalPurchasesDesc")
    },
    {
      title: t("avgPerPurchase"),
      value: `₹${summary.averageRevenuePerPurchase?.toLocaleString() || "0"}`,
      icon: <HiMiniArrowTrendingUp className="w-5 h-5 text-orange-600" />,
      // bg: "bg-orange-50",
      color: "text-orange-600",
      description: t("avgPerPurchaseDesc")
    },
    {
      title: t("activePlans"),
      value: summary.activePlansCount || "0",
      icon: <FiCheckCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      color: "text-green-600",
      description: t("activePlansDesc")
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">{t("loadingRevenue")}</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-6 font-medium">{t("error")}: {error}</div>;
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
    <div className="p-4 md:p-6 lg:p-8">

      {/* Title + Toggle */}
      <div className="flex items-center w-full sm:w-auto gap-1 justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl mb-6 font-bold text-gray-900">{t("revenueReport")}</h2>

        <div className='flex items-center gap-3'>
          <button  onClick={() =>
        exportRevenuePDF({ summary, plans, monthly, yearly, purchases, groupBy })
      } className='flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600
        text-white text-sm font-semibold rounded-xl shadow-sm
        transition-all cursor-pointer active:scale-95'>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
           <span className=''>{t("exportPDF")}</span> 
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${viewMode === "card"
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
            <span className="hidden sm:inline">{t("cards")}</span>
          </button>
          <button
            onClick={() => setViewMode("chart")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${viewMode === "chart"
              ? "bg-orange-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="3" width="4" height="18" rx="1" />
              <rect x="10" y="8" width="4" height="13" rx="1" />
              <rect x="17" y="5" width="4" height="16" rx="1" />
            </svg>
            <span className="hidden sm:inline">{t("charts")}</span>
          </button>
        </div>
      </div>


      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
        <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholderRevenue")}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
        />

        <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors flex-shrink-0 px-1"
        >

          <FiFilter className="w-5 h-5 cursor-pointer" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 ">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            onClick={() => setSelectedCard(card)}
            className={`bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md cursor-pointer transition-all ${card.bg} hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-4 md:gap-5">
              <div className={`p-3 md:p-4 rounded-lg ${card.bg}`}>{card.icon}</div>
              <div className="overflow-hidden">
                <p className="text-xs md:text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-xl md:text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
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
                <div className={`p-4 rounded-lg ${selectedCard.bg}`}>{selectedCard.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 selected-card-title">{selectedCard.title}</h3>
              </div>
              <button onClick={() => setSelectedCard(null)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors cursor-pointer">×</button>
            </div>
            <div className="p-8 text-center">
              <p className={`text-2xl font-bold ${selectedCard.color} mb-4`}>{selectedCard.value}</p>
              <p className="text-sm font-semibold text-gray-400 leading-relaxed selected-card-desc">{selectedCard.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-2xl font-bold text-gray-900 selected-card-title">{t("filters")}</h3>
              <button onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-500 hover:text-orange-600 text-3xl font-bold transition-colors cursor-pointer">×</button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <CiFilter className="w-6 h-6 text-orange-600" /> {t("groupBy")}
              </h4>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-4">
                {[
                  { value: "all", label: t("allData") },
                  { value: "plan", label: t("byPlan") },
                  { value: "month", label: t("byMonth") },
                  { value: "year", label: t("byYear") },
                ].map((option) => (
                  <label key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${tempGroupBy === option.value
                      ? "border-orange-500 bg-orange-50/70 shadow-md ring-1 ring-orange-300/30"
                      : "border-gray-200 hover:border-orange-300 hover:bg-gray-50 hover:shadow-sm"
                      }`}>
                    <input type="radio" name="groupBy" value={option.value}
                      checked={tempGroupBy === option.value}
                      onChange={() => setTempGroupBy(option.value)}
                      className="w-5 h-5 accent-orange-600 cursor-pointer" />
                    <span className="text-base font-medium text-gray-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gray-50/70">
              <button
                onClick={() => { setTempGroupBy("all"); setIsFilterModalOpen(false); }}
                className="flex-1 max-w-[130px] flex items-center justify-center gap-2 px-3 sm:px-7 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer">
                <IoIosCloseCircleOutline className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{t("clearAll")}</span>
              </button>
              <button
                onClick={() => { setGroupBy(tempGroupBy); setIsFilterModalOpen(false); }}
                className="flex-[2] max-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-12 py-2.5 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer">
                <span className="whitespace-nowrap">{t("applyFilters")}</span>
                <FiCheck className="w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}


      {/*  CARD VIEW   */}

      {viewMode === "card" && (
        <>
          {/* Revenue by Plan — Cards */}
          {showByPlan && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("revenueByPlan")} {searchQuery && `(${filteredData.plans.length} results)`}</h2>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredData.plans.length > 0 ? filteredData.plans.map((plan, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-7 hover:border-orange-300 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <BsBoxSeam className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <h3 className="text-lg font-bold text-gray-900">{plan.planName}</h3>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          ₹{plan.priceMonthly?.toLocaleString() || "0"} / {plan.duration}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-green-600">₹{plan.totalRevenue?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="mt-6">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getProgress(plan.totalRevenue)}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{getProgress(plan.totalRevenue)}% of total revenue</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 py-4 border-y border-gray-50">
                      {[
                        { label: "Purchases", value: plan.totalPurchases, color: "text-gray-900" },
                        { label: "Active", value: plan.activePurchases, color: "text-green-600" },
                        { label: "Expired", value: plan.expiredPurchases, color: "text-red-500" },
                        { label: "Avg.", value: `₹${plan.averageRevenuePerPurchase?.toLocaleString() || "0"}`, color: "text-gray-900" },
                      ].map((s, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{s.label}</p>
                          <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : <div className="text-center text-gray-500 py-10">{t("noPlanRevenue")}</div>}
              </div>
            </div>
          )}

          {/* Monthly Revenue — Cards */}
          {showByMonth && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("monthlyRevenue")} {searchQuery && `(${filteredData.monthly.length} results)`}</h2>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredData.monthly.length > 0 ? filteredData.monthly.map((month, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">{month.monthName}</h3>
                      <p className="text-xl md:text-2xl font-bold text-green-600">₹{month.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getMonthlyProgress(month.totalRevenue)}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{getMonthlyProgress(month.totalRevenue)}% of total revenue</p>
                    </div>
                    <p className="text-sm text-gray-600 font-bold flex items-center gap-2 mt-4">
                      <MdOutlineLocalGroceryStore className="w-5 h-5 text-blue-600" />
                      {month.totalPurchases} Purchases
                    </p>
                  </div>
                )) : <div className="text-center text-gray-500 py-10">{t("noMonthlyRevenue")}</div>}
              </div>
            </div>
          )}

          {/* Yearly Revenue — Cards */}
          {showByYear && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("yearlyRevenue")} {searchQuery && `(${filteredData.yearly.length} results)`}</h2>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredData.yearly.length > 0 ? filteredData.yearly.map((year, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">{year.year}</h3>
                      <p className="text-2xl font-bold text-green-600">₹{year.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getYearlyProgress(year.totalRevenue)}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{getYearlyProgress(year.totalRevenue)}% of total revenue</p>
                    </div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2 mt-4">
                      <MdOutlineLocalGroceryStore className="w-5 h-5 text-blue-600" />
                      {year.totalPurchases} Purchases
                    </p>
                  </div>
                )) : <div className="text-center text-gray-500 py-10">No yearly revenue data available</div>}
              </div>
            </div>
          )}

          {/* Recent Purchases — Cards */}
          {groupBy === "all" && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("recentPurchases")}</h2>
              <div className="space-y-4">
                {paginatedPurchases.length > 0 ? paginatedPurchases.map((purchase, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all">
                    <div className="p-5 md:p-6 flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-3 h-3 rounded-full ${purchase.remainingDays > 0 ? "bg-green-500 animate-pulse" : "bg-gray-500 animate-pulse"}`} />
                          <h3 className="font-bold text-gray-900 text-lg">{purchase.planName}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                            <FiCalendar className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-[10px] uppercase text-gray-400 font-bold">Purchase Date</p>
                              <p className="text-xs font-bold">{formatDate(purchase.purchaseDate)}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                            <CiClock2 className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-[10px] uppercase text-gray-400 font-bold">Expires On</p>
                              <p className="text-xs font-bold">{formatDate(purchase.expiryDate)}</p>
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg flex items-center gap-3 ${purchase.remainingDays > 30 ? "bg-green-50" :
                            purchase.remainingDays > 0 ? "bg-yellow-50" : "bg-red-50"
                            }`}>
                            <CiCalendar className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-[10px] uppercase text-gray-400 font-bold">Status</p>
                              <p className={`text-xs font-bold ${purchase.remainingDays > 30 ? "text-green-700" :
                                purchase.remainingDays > 0 ? "text-yellow-700" : "text-red-700"
                                }`}>
                                {purchase.remainingDays > 0 ? `${purchase.remainingDays} days remaining` : "Expired"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:border-l border-gray-300 lg:pl-8 flex items-center justify-between lg:justify-end lg:min-w-[150px]">
                        <p className="text-2xl font-black text-green-600">₹{purchase.price?.toLocaleString() || "0"}</p>
                      </div>
                    </div>
                  </div>
                )) : <div className="text-center text-gray-500 py-10">{t("noPurchases")}</div>}
              </div>
            </div>

          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-300 transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}




      {/*    Pie      CHART VIEW    */}

      {viewMode === "chart" && (
        <>

          {/* Revenue by Plan — Pie Chart */}
          {showByPlan && plans.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("revenueByPlan")}</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">

                {/* Summary row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                  {[
                    { label: t("totalRevenue"), value: `₹${plans.reduce((s, p) => s + (p.totalRevenue || 0), 0).toLocaleString()}`, color: "text-orange-600", bg: "bg-blue-50" },
                    { label: t("totalPurchases"), value: plans.reduce((s, p) => s + (p.totalPurchases || 0), 0), color: "text-blue-600", bg: "bg-blue-50" },
                    { label: t("active"), value: plans.reduce((s, p) => s + (p.activePurchases || 0), 0), color: "text-green-600", bg: "bg-green-50" },
                    { label: t("expired"), value: plans.reduce((s, p) => s + (p.expiredPurchases || 0), 0), color: "text-red-500", bg: "bg-red-50" },
                  ].map((s, i) => (
                    <div key={i} className={`stats-card ${s.bg} rounded-xl p-4`}>
                      <p className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
                      <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Two Pie Charts side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Pie 1 — Revenue share */}
                  <div className='w-full h-[240px] md:h-[300px]'>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">{t("revenueShareByPlan")}</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={plans.map(p => ({ name: p.planName, value: p.totalRevenue || 0 }))}
                          cx="50%" cy="50%"
                          innerRadius="50%"
                          outerRadius="75%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {plans.map((_, i) => (
                            <Cell key={i} fill={["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308"][i % 6]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                          formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Legend

                          iconType="circle"
                          iconSize={6}
                          wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie 2 — Active vs Expired */}
                  <div className='w-full h-[240px] md:h-[300px]'>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">{t("activeVsExpired")}</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Active", value: plans.reduce((s, p) => s + (p.activePurchases || 0), 0) },
                            { name: "Expired", value: plans.reduce((s, p) => s + (p.expiredPurchases || 0), 0) },
                          ]}
                          cx="50%" cy="50%"
                          innerRadius="50%"
                          outerRadius="75%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                          formatter={(value, name) => [value, name]}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={6}
                          wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Plan wise breakdown table below charts */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("plan")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("revenue")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("purchases")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("active")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("expired")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("average")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {plans.map((plan, i) => (
                        <tr key={i} className={`hover:bg-orange-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308"][i % 6] }} />
                              <span className="text-sm font-bold text-gray-900">{plan.planName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-black text-orange-600">₹{plan.totalRevenue?.toLocaleString() || "0"}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{plan.totalPurchases}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">{plan.activePurchases}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-red-500">{plan.expiredPurchases}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">₹{plan.averageRevenuePerPurchase?.toLocaleString() || "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* Monthly Revenue — Pie Chart */}
          {showByMonth && monthly.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("monthlyRevenue")}</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">

                {/* Summary row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label:  t("totalRevenue"), value: `₹${monthly.reduce((s, m) => s + (m.totalRevenue || 0), 0).toLocaleString()}`, color: "text-orange-600", bg: "bg-blue-50" },
                    { label: t("totalPurchases"), value: monthly.reduce((s, m) => s + (m.totalPurchases || 0), 0), color: "text-blue-600", bg: "bg-blue-50" },
                  ].map((s, i) => (
                    <div key={i} className={`stats-card ${s.bg} rounded-xl p-4`}>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
                      <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className='w-full h-[220px] md:h-[320px]'>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">
                    {t("revenueShareByMonth")}
                  </p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={monthly.map(m => ({ name: m.monthName?.slice(0, 3), value: m.totalRevenue || 0 }))}
                        cx="50%"
                        cy="50%"
                        /* FIXED: Pixels ki jagah percentage taaki side se na chipe */
                        innerRadius="50%"
                        outerRadius="75%"
                        paddingAngle={2}
                        dataKey="value"
                        /* MOBILE OPTIMIZATION: Mobile par labels hide kar diye (clipping se bachne ke liye) */
                        label={window.innerWidth > 768 ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                        labelLine={window.innerWidth > 768}
                      >
                        {monthly.map((_, i) => (
                          <Cell key={i} fill={[
                            "#f97316", "#3b82f6", "#22c55e", "#a855f7",
                            "#ef4444", "#eab308", "#06b6d4", "#ec4899",
                            "#10b981", "#6366f1", "#f43f5e", "#84cc16"
                          ][i % 12]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={6}
                        verticalAlign="bottom"
                        /* Mobile pe Legend compact rakha hai */
                        wrapperStyle={{ fontSize: "10px", fontWeight: 600, paddingTop: "5px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("month")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("revenue")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("purchases")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("share")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(() => {
                        const total = monthly.reduce((s, m) => s + (m.totalRevenue || 0), 0);
                        return monthly.map((month, i) => (
                          <tr key={i} className={`hover:bg-orange-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ background: ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308", "#06b6d4", "#ec4899", "#10b981", "#6366f1", "#f43f5e", "#84cc16"][i % 12] }} />
                                <span className="text-sm font-bold text-gray-900">{month.monthName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-black text-orange-600">₹{month.totalRevenue?.toLocaleString() || "0"}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{month.totalPurchases}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs font-bold text-gray-500">
                                {total ? `${((month.totalRevenue / total) * 100).toFixed(1)}%` : "0%"}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* Yearly Revenue — Pie Chart */}
          {showByYear && yearly.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("yearlyRevenue")}</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">

                {/* Summary row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label:  t("totalRevenue"), value: `₹${yearly.reduce((s, y) => s + (y.totalRevenue || 0), 0).toLocaleString()}`, color: "text-orange-600", bg: "bg-blue-50" },
                    { label: t("totalPurchases"), value: yearly.reduce((s, y) => s + (y.totalPurchases || 0), 0), color: "text-blue-600", bg: "bg-blue-50" },
                  ].map((s, i) => (
                    <div key={i} className={`stats-card ${s.bg} rounded-xl p-4`}>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
                      <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className='w-full h-[220px] md:h-[300px]'>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">
                    {t("revenueShareByYear")}
                  </p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yearly.map(y => ({ name: String(y.year), value: y.totalRevenue || 0 }))}
                        cx="50%"
                        cy="50%"
                        /* Percentage radius side clipping rokne ke liye */
                        innerRadius="50%"
                        outerRadius="75%"
                        paddingAngle={4}
                        dataKey="value"
                        /* Mobile pe labels ko off rakha hai taaki circle bada aur clean dikhe */
                        label={typeof window !== 'undefined' && window.innerWidth > 768
                          ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`
                          : false
                        }
                        labelLine={typeof window !== 'undefined' && window.innerWidth > 768}
                      >
                        {yearly.map((_, i) => (
                          <Cell key={i} fill={["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444"][i % 5]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={6}
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "10px", fontWeight: 600, paddingTop: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Yearly table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("year")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("revenue")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("purchases")}</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("share")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(() => {
                        const total = yearly.reduce((s, y) => s + (y.totalRevenue || 0), 0);
                        return yearly.map((year, i) => (
                          <tr key={i} className={`hover:bg-orange-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ background: ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444"][i % 5] }} />
                                <span className="text-sm font-bold text-gray-900">{year.year}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-black text-orange-600">₹{year.totalRevenue?.toLocaleString() || "0"}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{year.totalPurchases}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs font-bold text-gray-500">
                                {total ? `${((year.totalRevenue / total) * 100).toFixed(1)}%` : "0%"}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* Recent Purchases — Table */}
          {groupBy === "all" && (
            <div className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t("recentPurchases")}</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("plan")}</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("purchaseDate")}</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("expiresOn")}</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("status")}</th>
                        <th className="text-right px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("amount")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {purchases.length > 0 ? purchases.map((purchase, index) => (
                        <tr key={index} className={`hover:bg-orange-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                          <td className="px-6 py-4 text-sm text-gray-400 font-semibold">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${purchase.remainingDays > 0 ? "bg-green-500" : "bg-gray-400"}`} />
                              <span className="text-sm font-bold text-gray-900">{purchase.planName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDate(purchase.purchaseDate)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDate(purchase.expiryDate)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${purchase.remainingDays > 30 ? "bg-green-100 text-green-700" :
                              purchase.remainingDays > 0 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-600"
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${purchase.remainingDays > 30 ? "bg-green-500" :
                                purchase.remainingDays > 0 ? "bg-yellow-500" : "bg-red-500"
                                }`} />
                              {purchase.remainingDays > 0 ? `${purchase.remainingDays}d left` : "Expired"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-green-600">
                              ₹{purchase.price?.toLocaleString() || "0"}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                            No recent purchases found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {purchases.length > 0 && (
                      <tfoot>
                        <tr className="bg-gray-50 border-t-2 border-gray-200">
                          <td colSpan={5} className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Total ({purchases.length} {t("purchases")})
                          </td>
                          <td className="px-6 py-3.5 text-right text-sm font-black text-green-600">
                            ₹{purchases.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}