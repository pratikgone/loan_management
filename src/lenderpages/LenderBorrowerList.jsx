import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { FiUsers, FiFilter } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

const BASE_URL = "https://loan-backend-cv1k.onrender.com/api";

export default function LenderBorrowersList() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const lenderId = user?._id;

  const [borrowers, setBorrowers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!lenderId) return;
    fetchBorrowers();
  }, [lenderId, search, statusFilter]);

  const fetchBorrowers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: 1, limit: 50 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      const res = await axios.get(`${BASE_URL}/admin/lenders/${lenderId}/borrowers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setBorrowers(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch borrowers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[65vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Loading borrowers...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Borrowers</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All borrowers linked to your loans</p>
          </div>
          <span className="text-xs text-gray-400 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 backdrop-blur">
            {borrowers.length} borrowers
          </span>
        </div>

              {/* Search + Filter */}
  {/* Search + Filter - Exact same as Lenders page */}
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

        {/* Summary Stats */}
        {summary && (
          <>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Summary</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Unique Borrowers", value: summary.totalUniqueBorrowers, color: "text-gray-900 dark:text-white", bar: "bg-gray-400" },
                { label: "Total Loans", value: summary.totalLoans, color: "text-blue-600", bar: "bg-blue-400" },
                { label: "Active Loans", value: summary.activeLoans, color: "text-green-600", bar: "bg-green-400" },
                { label: "Overdue Loans", value: summary.overdueLoans, color: "text-red-500", bar: "bg-red-400" },
              ].map((s, i) => (
                <div key={i} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-5 hover:-translate-y-0.5 transition-all overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.45) 0%,transparent 60%)" }} />
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest relative">{s.label}</p>
                  <p className={`text-2xl font-semibold mt-1 relative ${s.color}`}>{s.value}</p>
                  <div className="flex items-end gap-0.5 h-5 mt-3 relative">
                    {[50, 70, 45, 85, 60, 100, 75].map((h, j) => <div key={j} className={`flex-1 rounded-sm opacity-40 ${s.bar}`} style={{ height: `${h}%` }} />)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

  

        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          {borrowers.length} results
        </p>

        {/* Borrowers Grid */}
        {error ? (
          <div className="text-center py-16 text-red-500 dark:text-red-400">{error}</div>
        ) : borrowers.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-gray-800 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-gray-700">
            <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No borrowers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowers.map((borrower, i) => (
              <div key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >

                {/* Top accent */}
                {/* <div className={`h-0.5 w-full mb-4 rounded-full ${borrower.hasOverdueLoan ? "bg-red-400" : borrower.hasActiveLoan ? "bg-green-400" : "bg-gray-200"}`} /> */}

                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {borrower.borrowerName?.charAt(0).toUpperCase() || "B"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{borrower.borrowerName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{borrower.mobileNo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {borrower.hasOverdueLoan && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Overdue</span>}
                    {borrower.hasActiveLoan && !borrower.hasOverdueLoan && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-orange-50/60 dark:bg-gray-700/40 rounded-xl p-3 mb-4">
                  {[
                    { label: "Loans", value: borrower.totalLoansCount, color: "text-gray-900 dark:text-white" },
                    { label: "Amount", value: `₹${borrower.totalLoanAmount?.toLocaleString()}`, color: "text-orange-600" },
                    { label: "Remaining", value: `₹${borrower.totalRemainingAmount?.toLocaleString()}`, color: "text-red-500" },
                  ].map((s, j) => (
                    <div key={j} className="text-center">
                      <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
                      <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {borrower.loans.slice(0, 2).map((loan, j) => (
                    <div key={j} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">₹{loan.amount?.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${loan.paymentStatus === "paid" ? "bg-green-100 text-green-700" : loan.paymentStatus === "overdue" ? "bg-red-100 text-red-600" : loan.paymentStatus === "part paid" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-600"}`}>
                        {loan.paymentStatus}
                      </span>
                    </div>
                  ))}
                  {borrower.loans.length > 2 && <p className="text-[10px] text-gray-400 text-center pt-1">+{borrower.loans.length - 2} more loans</p>}
                </div>
              </div>
            ))}
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
      <div className="flex-shrink-0 flex flex-row items-center justify-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-orange-50/50 dark:bg-gray-800 dark:bg-gray-800">
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