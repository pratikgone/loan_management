import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { FiUsers } from "react-icons/fi";

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

      const res = await axios.get(
        `${BASE_URL}/admin/lenders/${lenderId}/borrowers?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBorrowers(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch borrowers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-gray-600 font-medium">Loading borrowers...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">My Borrowers</h2>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Unique Borrowers", value: summary.totalUniqueBorrowers, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Total Loans",      value: summary.totalLoans,           color: "text-blue-600",   bg: "bg-blue-50"   },
            { label: "Active Loans",     value: summary.activeLoans,          color: "text-green-600",  bg: "bg-green-50"  },
            { label: "Overdue Loans",    value: summary.overdueLoans,         color: "text-red-500",    bg: "bg-red-50"    },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 flex-1">
          <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search borrower by name or Aadhaar"
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm" />
        </div>
        <select value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
            text-gray-700 outline-none cursor-pointer">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="part paid">Part Paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Borrowers Grid */}
      {error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : borrowers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No borrowers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {borrowers.map((borrower, i) => (
            <div key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
                hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(
                `/lenders/${lenderId}/borrowers/${borrower.borrowerId || borrower.aadhaarNumber}/details`,
                { state: { borrower, lenderName: user?.userName } }
              )}>

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center
                    justify-center text-white font-black text-sm flex-shrink-0">
                    {borrower.borrowerName?.charAt(0).toUpperCase() || "B"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{borrower.borrowerName}</h3>
                    <p className="text-xs text-gray-500">{borrower.mobileNo}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {borrower.hasOverdueLoan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                      bg-red-100 text-red-600 border border-red-200">Overdue</span>
                  )}
                  {borrower.hasActiveLoan && !borrower.hasOverdueLoan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                      bg-green-100 text-green-700 border border-green-200">Active</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 bg-orange-50/60 rounded-xl p-3 mb-4">
                {[
                  { label: "Loans",     value: borrower.totalLoansCount,                              color: "text-gray-900"   },
                  { label: "Amount",    value: `₹${borrower.totalLoanAmount?.toLocaleString()}`,      color: "text-orange-600" },
                  { label: "Remaining", value: `₹${borrower.totalRemainingAmount?.toLocaleString()}`, color: "text-red-500"    },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{s.label}</p>
                    <p className={`text-sm font-black ${s.color} mt-0.5`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent loans */}
              <div className="space-y-2">
                {borrower.loans.slice(0, 2).map((loan, j) => (
                  <div key={j} className="flex items-center justify-between text-xs
                    py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 font-medium">
                      ₹{loan.amount?.toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      loan.paymentStatus === "paid"     ? "bg-green-100 text-green-700" :
                      loan.paymentStatus === "overdue"  ? "bg-red-100 text-red-600" :
                      loan.paymentStatus === "part paid"? "bg-yellow-100 text-yellow-700" :
                                                          "bg-blue-100 text-blue-600"
                    }`}>{loan.paymentStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}