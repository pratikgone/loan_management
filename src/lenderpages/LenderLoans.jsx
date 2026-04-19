import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { FiFileText } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

const BASE_URL = "https://loan-backend-cv1k.onrender.com/api";

export default function LenderLoans() {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchLoans(); }, [search, statusFilter, currentPage]);
   const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      const res = await axios.get(`${BASE_URL}/lender/loans/my-loans?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setLoans(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const statusStyle = (s) => {
    if (s === "paid") return "bg-green-100 text-green-700 border-green-200";
    if (s === "overdue") return "bg-red-100 text-red-600 border-red-200";
    if (s === "part paid") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-600 border-blue-200";
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[65vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Loading loans...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Loans</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track all your loan records and payment status</p>
          </div>
          <span className="text-xs text-gray-400 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 backdrop-blur">
            {loans.length} loans
          </span>
        </div>

        {/* Search + Filter */}
      <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
        <IoIosSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search borrower by name or Aadhaar..." 
          className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm" 
        />
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors px-2"
        >
          <FiFilter className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Filter</span>
        </button>
      </div>

        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {loans.length} results
        </p>

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-gray-800 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-gray-700">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No loans found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan, i) => {
              const pct = loan.amount > 0 ? Math.min(Math.round(((loan.totalPaid || 0) / loan.amount) * 100), 100) : 0;
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden hover:-translate-y-0.5 transition-all duration-300">
                  {/* Top accent based on status */}
                  <div className={`h-0.5 w-full ${loan.paymentStatus === "paid" ? "bg-green-400" : loan.paymentStatus === "overdue" ? "bg-red-400" : loan.paymentStatus === "part paid" ? "bg-yellow-400" : "bg-blue-400"}`} />

                  <div className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                          {loan.name?.charAt(0).toUpperCase() || "B"}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{loan.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{loan.mobileNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-start">
                        <p className="text-xl font-bold text-orange-600">₹{loan.amount?.toLocaleString()}</p>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle(loan.paymentStatus)}`}>
                          {loan.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 mb-4">
                      {[
                        { label: "Total Paid", value: `₹${(loan.totalPaid || 0).toLocaleString()}`, color: "text-green-600" },
                        { label: "Remaining", value: `₹${(loan.remainingAmount || 0).toLocaleString()}`, color: "text-red-500" },
                        { label: "Given Date", value: formatDate(loan.loanGivenDate), color: "text-gray-700 dark:text-gray-300" },
                        { label: "End Date", value: formatDate(loan.loanEndDate), color: "text-gray-700 dark:text-gray-300" },
                      ].map((s, j) => (
                        <div key={j}>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
                          <p className={`text-sm font-semibold mt-0.5 ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                        <span>Payment Progress</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-700 ${loan.paymentStatus === "paid" ? "bg-green-500" : loan.paymentStatus === "overdue" ? "bg-red-500" : "bg-gradient-to-r from-orange-400 to-orange-500"}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === i + 1 ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
              Next →
            </button>
          </div>
        )}

      </div>
           {/* Filter Modal - Same as Lenders page */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">
      
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-400">
              <h3 className="text-2xl font-bold text-white">Filters</h3>
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
                Loan Status
              </h4>
      
              <div className="border-t border-orange-200 dark:border-orange-700 my-4"></div>
      
              <div className="space-y-4">
                {[
                  { value: "", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "part paid", label: "Part Paid" },
                  { value: "paid", label: "Paid" },
                  { value: "overdue", label: "Overdue" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      statusFilter === opt.value
                        ? "border-orange-500 bg-orange-50/70 dark:bg-orange-900/20 shadow-md ring-1 ring-orange-300/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="statusFilter"
                      value={opt.value}
                      checked={statusFilter === opt.value}
                      onChange={() => setStatusFilter(opt.value)}
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
            <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-orange-50/50 dark:bg-gray-800">
              <button
                onClick={() => {
                  setStatusFilter("");
                  setIsFilterOpen(false);
                }}
                className="flex-1 max-w-[130px] flex items-center justify-center gap-2 px-3 sm:px-7 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer"
              >
                 <span className="whitespace-nowrap">Clear All</span> 
              </button>
      
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-[2] max-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-12 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer"
              >
               <span className="whitespace-nowrap">Apply Filters</span> 
                <FiCheck className="w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}