import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { FiFileText } from "react-icons/fi";

const BASE_URL = "https://loan-backend-cv1k.onrender.com/api";

export default function LenderLoans() {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLoans();
  }, [search, statusFilter, currentPage]);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);

      const res = await axios.get(
        `${BASE_URL}/lender/loans/my-loans?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoans(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const statusStyle = (status) => {
    if (status === "paid")      return "bg-green-100 text-green-700 border-green-200";
    if (status === "overdue")   return "bg-red-100 text-red-600 border-red-200";
    if (status === "part paid") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-600 border-blue-200";
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" />
      <span className="ml-4 text-gray-600 font-medium">Loading loans...</span>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">My Loans</h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-3 bg-white rounded-xl border border-orange-100
          shadow-sm p-3 flex-1">
          <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by borrower name..."
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm" />
        </div>
        <select value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
            text-gray-700 outline-none cursor-pointer">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="part paid">Part Paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Loans List */}
      {loans.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No loans found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100
              p-5 md:p-6 hover:shadow-md transition-shadow">

              <div className="flex flex-col md:flex-row md:items-center
                justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{loan.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{loan.mobileNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-black text-orange-600">
                    ₹{loan.amount?.toLocaleString()}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border
                    ${statusStyle(loan.paymentStatus)}`}>
                    {loan.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 rounded-xl p-3">
                {[
                  { label: "Total Paid",  value: `₹${(loan.totalPaid || 0).toLocaleString()}`,      color: "text-green-600" },
                  { label: "Remaining",   value: `₹${(loan.remainingAmount || 0).toLocaleString()}`, color: "text-red-500"   },
                  { label: "Given Date",  value: formatDate(loan.loanGivenDate),                     color: "text-gray-700"  },
                  { label: "End Date",    value: formatDate(loan.loanEndDate),                       color: "text-gray-700"  },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">{s.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Payment Progress</span>
                  <span>{loan.amount > 0
                    ? Math.round(((loan.totalPaid || 0) / loan.amount) * 100)
                    : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500
                    h-2 rounded-full transition-all"
                    style={{ width: `${loan.amount > 0
                      ? Math.min(Math.round(((loan.totalPaid || 0) / loan.amount) * 100), 100)
                      : 0}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer">
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                ? "bg-orange-600 text-white" : "bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer">
            Next
          </button>
        </div>
      )}
    </div>
  );
}