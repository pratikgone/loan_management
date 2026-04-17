import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiPhone, FiMail, FiUser } from "react-icons/fi";
import { MdOutlineCreditCard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchBorrowerDetails } from "../store/lendersSlice";
import { useTranslation } from "react-i18next";

export function BorrowerDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { borrowerId } = useParams();

  const dispatch = useDispatch();

  const {t} = useTranslation();

const {
  selectedBorrower,
  borrowerDetailsLoading,
  borrowerDetailsError
} = useSelector((state) => state.lenders);

const [viewMode , setViewMode] = useState("card");

useEffect(() => {
  if (borrowerId) {
    dispatch(fetchBorrowerDetails(borrowerId));
  }
}, [borrowerId, dispatch]);

const borrower = selectedBorrower || state?.borrower;
  

 
  const lenderName = state?.lenderName;

  if (borrowerDetailsLoading) {
  return (
   
    <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">{t("borrowerDetails.loading")}</span>
      </div>
  );
}

  // if not state then (direct URL access) to back 
  if (!borrower) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <p className="text-gray-500 text-lg">{t("borrowerDetails.notFound")}</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl
            hover:bg-orange-600 transition-colors cursor-pointer">
          ← {t("borrowerDetails.goBack")}
        </button>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">

    <div className="p-5 sm:p-6 lg:p-8">
     
      {/* Back */}
     <div className="flex items-center justify-between mb-6">

  <div>
    <button
      onClick={() => navigate(-1)}
      className="mb-2 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
    >
      ← {t("borrowerDetails.backToBorrowers")}
    </button>

    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
      {t("borrowerDetails.title")}
    </h2>
  </div>

  {/* Toggle */}
  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">

    <button
      onClick={() => setViewMode("card")}
     className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
  viewMode === "card"
    ? "bg-orange-500 text-white"
    : "text-gray-500"
}`}
    >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
      {t("borrowerDetails.card")}
    </button>

    <button
      onClick={() => setViewMode("table")}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
  viewMode === "table"
          ? "bg-orange-500 text-white"
          : "text-gray-500"
      }`}
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
            </svg>
      {t("borrowerDetails.table")}
    </button>

  </div>
</div>

    

        {/* ── Profile Hero Card ── */}
      {viewMode === "card" && (
        <>
          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 p-6 md:p-8"
            style={{ background: "linear-gradient(130deg, #f97316, #fb923c, #fbbf24)" }}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute rounded-full" style={{ width: 160, height: 160, background: "rgba(255,255,255,0.08)", top: -50, right: 60 }} />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {borrower.borrowerName?.charAt(0).toUpperCase() || "B"}
              </div>
              <div>
                <span className="text-[10px] font-bold text-white/70 bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-widest">Borrower</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{borrower.borrowerName}</h2>
                {lenderName && <p className="text-white/70 text-sm mt-0.5">{t("borrowerDetails.loansFromLender")} <span className="text-white font-semibold">{lenderName}</span></p>}
                <div className="flex flex-wrap gap-3 mt-3">
                  {borrower.mobileNo && borrower.mobileNo !== "N/A" && <span className="text-xs text-white/80 flex items-center gap-1"><FiPhone size={11} />{borrower.mobileNo}</span>}
                  {borrower.email && borrower.email !== "N/A" && <span className="text-xs text-white/80 flex items-center gap-1"><FiMail size={11} />{borrower.email}</span>}
                </div>
              </div>
            </div>
          </div>
        

        {/* ── Stats Row ── */}
        <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t("borrowerDetails.totalLoans"),    value: borrower.totalLoansCount,                              color: "text-gray-900",   bg: "bg-white",       border: "border-fuchsia-100" },
            { label: t("borrowerDetails.totalAmount"),   value: `₹${borrower.totalLoanAmount?.toLocaleString()}`,      color: "text-orange-600", bg: "bg-fuchsia-50",   border: "border-fuchsia-100" },
            { label: t("borrowerDetails.totalPaid"),     value: `₹${borrower.totalPaidAmount?.toLocaleString()}`,      color: "text-green-600",  bg: "bg-green-50",    border: "border-green-100" },
            { label: t("borrowerDetails.remaining"),      value: `₹${borrower.totalRemainingAmount?.toLocaleString()}`, color: "text-red-500",    bg: "bg-red-50",      border: "border-red-100" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 border border-gray-200 shadow-sm`}>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl md:text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        </div>

        {/* ── Loan History Table ── */}
       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t("borrowerDetails.loanHistory")}</h3>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                {borrower.loans?.length || 0} {t("borrowerDetails.loans")}
              </span>
            </div>

           {borrower.loans?.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        {["#", t("borrowerDetails.amount"), t("borrowerDetails.totalPaid"), t("borrowerDetails.remaining"), t("borrowerDetails.endDate"), t("borrowerDetails.status")].map((h, i) => (
                          <th key={i} className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {borrower.loans.map((loan, i) => (
                        <tr key={i} className="hover:bg-orange-50/30 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3.5 text-xs text-gray-400">{i + 1}</td>
                          <td className="px-5 py-3.5 text-sm font-bold text-gray-900 dark:text-white">₹{loan.amount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-green-600">₹{loan.totalPaid?.toLocaleString() || "0"}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-red-500">₹{(loan.remainigAmount ?? loan.remainingAmount)?.toLocaleString() || "0"}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{formatDate(loan.loanEndDate)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle(loan.paymentStatus)}`}>{loan.paymentStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-t-2 border-gray-200 dark:border-gray-600">
                        <td className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Total</td>
                        <td className="px-5 py-3 text-sm font-bold text-gray-900 dark:text-white">₹{borrower.totalLoanAmount?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm font-bold text-green-600">₹{borrower.totalPaidAmount?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm font-bold text-red-500">₹{borrower.totalRemainingAmount?.toLocaleString()}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {borrower.loans.map((loan, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-black text-gray-900">
                        ₹{loan.amount?.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyle(loan.paymentStatus)}`}>
                        {loan.paymentStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold">{t("borrowerDetails.paid")}</span>
                        <p className="font-black text-green-600">₹{loan.totalPaid?.toLocaleString() || "0"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold">{t("borrowerDetails.remaining")}</span>
                        <p className="font-black text-red-500">
                          ₹{(loan.remainigAmount ?? loan.remainingAmount)?.toLocaleString() || "0"}
                        </p>
                      </div>
                      {/* <div>
                        <span className="text-gray-400 font-semibold">Given</span>
                        <p className="font-semibold text-gray-700">{formatDate(loan.loanGivenDate)}</p>
                      </div> */}
                      <div>
                        <span className="text-gray-400 font-semibold">{t("borrowerDetails.ends")}</span>
                        <p className="font-semibold text-gray-700">{formatDate(loan.loanEndDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm">{t("borrowerDetails.noLoans")}</div>
          )}
          
        </div>
        </>
        )}

        {/* ── Table View Mode ── */}
{viewMode === "table" && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">

    {/* ── Header Profile ── */}
    <div className="px-6 py-4 border-b border-gray-300 bg-white flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg">
          {borrower.borrowerName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{borrower.borrowerName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{borrower.email || "N/A"}</p>
        </div>
      </div>

      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
        borrower.hasOverdueLoan
          ? "bg-red-100 text-red-700 border-red-300"
          : borrower.hasActiveLoan
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-gray-100 text-gray-600 border-gray-300"
      }`}>
        {borrower.hasOverdueLoan
          ?  t("borrowerDetails.overdue")
          : borrower.hasActiveLoan
          ? t("borrowerDetails.active")
          : t("borrowerDetails.inactive")}
      </span>
    </div>

    {/* ── Personal Info ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={2} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t("borrowerDetails.personalInfo")}
              </span>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase w-2/5">{t("borrowerDetails.field")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.value")}</th>
          </tr>
        </thead>

        <tbody>
          {[
            { field:  t("borrowerDetails.fullName"), value: borrower.borrowerName },
            { field: t("borrowerDetails.mobile"), value: borrower.mobileNo },
            { field: t("borrowerDetails.email"), value: borrower.email },
            { field: t("borrowerDetails.aadhaar"), value: borrower.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3") },
            { field: t("borrowerDetails.lender"), value: lenderName },
          ].map((row, i) => (
            <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase">{row.field}</td>
              <td className="px-6 py-3 text-sm font-semibold text-gray-800">{row.value || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ── Loan Summary ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={2} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t("borrowerDetails.loanSummary")}
              </span>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase w-2/5">{t("borrowerDetails.field")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.value")}</th>
          </tr>
        </thead>

        <tbody>
          {[
            { field: t("borrowerDetails.totalLoans"), value: borrower.totalLoansCount },
            { field: t("borrowerDetails.totalAmount"), value: `₹${borrower.totalLoanAmount?.toLocaleString()}`, color: "text-orange-600" },
            { field: t("borrowerDetails.totalPaid"), value: `₹${borrower.totalPaidAmount?.toLocaleString()}`, color: "text-green-600" },
            { field: t("borrowerDetails.remaining"), value: `₹${borrower.totalRemainingAmount?.toLocaleString()}`, color: "text-red-500" },
          ].map((row, i) => (
            <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase">{row.field}</td>
              <td className={`px-6 py-3 text-sm font-semibold ${row.color || "text-gray-800"}`}>
                {row.value || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ── Loan History ── */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50 border-y border-orange-300">
            <td colSpan={6} className="px-6 py-2.5">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {t("borrowerDetails.loanHistory")}
              </span>
            </td>
  
          </tr>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.index")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.amount")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.totalPaid")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.remaining")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.endDate")}</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{t("borrowerDetails.status")}</th>
          </tr>
        </thead>

        <tbody>
          {borrower.loans?.map((loan, i) => (
            <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <td className="px-6 py-3">{i + 1}</td>
              <td className="px-6 py-3 font-bold">₹{loan.amount?.toLocaleString()}</td>
              <td className="px-6 py-3 text-green-600">₹{loan.totalPaid?.toLocaleString() || "0"}</td>
              <td className="px-6 py-3 text-red-500">
                ₹{(loan.remainigAmount ?? loan.remainingAmount)?.toLocaleString() || "0"}
              </td>
              <td className="px-6 py-3">{formatDate(loan.loanEndDate)}</td>
              <td className="px-6 py-3">
                <span className={`px-2 py-1 text-xs rounded-full border ${statusStyle(loan.paymentStatus)}`}>
                  {loan.paymentStatus}
                </span>
              </td>
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