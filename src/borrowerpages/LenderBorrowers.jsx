import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBorrowersByLender } from "../store/lendersSlice";
import { IoIosSearch } from "react-icons/io";
import { FiDollarSign } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export function LenderBorrowers() {
  const { id: lenderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const { lenderBorrowers, borrowersLoading, borrowersError } = useSelector(s => s.lenders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBorrowersByLender({ lenderId, page: currentPage, search, status: statusFilter }));
  }, [dispatch, lenderId, currentPage, search, statusFilter]);

  const lender = lenderBorrowers?.lender;
  const summary = lenderBorrowers?.summary;
  const borrowers = lenderBorrowers?.data || [];

  if (borrowersLoading) return (
     <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <span className="ml-4 text-lg text-gray-600 font-medium">{t("borrowersPage.loading")}</span>
      </div>
  );

  return (
    <div className="p-4 md:p-8">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer">
        ← {t("borrowersPage.backToLenders")}
      </button>

      {/* Page title + lender info */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t("borrowersPage.title")}</h2>
        {lender && (
          <p className="text-sm text-gray-500 mt-1">
            {t("borrowersPage.labels.loansBy")}  <span className="font-bold text-orange-600">{lender.userName}</span>
          </p>
        )}
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:  t("borrowersPage.summary.uniqueBorrowers"), value: summary.totalUniqueBorrowers,  color: "text-gray-900",   bg: "bg-white",       border: "border-fuchsia-100" },
            { label: t("borrowersPage.summary.totalLoans"), value: summary.totalLoans, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: t("borrowersPage.summary.activeLoans"), value: summary.activeLoans, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
            { label: t("borrowersPage.summary.overdueLoans"), value: summary.overdueLoans, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 border border-gray-200`}>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
       <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">     
          <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={t("borrowersPage.searchPlaceholder")}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
     
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 outline-none cursor-pointer">
          <option value="">{t("borrowersPage.allStatus")}</option>
          <option value="pending">{t("borrowersPage.pending")}</option>
          <option value="part paid">{t("borrowersPage.partPaid")}</option>
          <option value="paid">{t("borrowersPage.paid")}</option>
          <option value="overdue">{t("borrowersPage.overdue")}</option>
        </select>
     
      </div>

      {/* Borrowers list */}
      {borrowersError ? (
        <div className="text-center py-16 text-red-500">{borrowersError}</div>
      ) : borrowers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{t("borrowersPage.noBorrowers")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {borrowers.map((borrower, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(
                `/lenders/${lenderId}/borrowers/${borrower.borrowerId || borrower.aadhaarNumber}/details`,
                { state: { borrower, lenderName: lender?.userName } }
              )}>

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center
                    text-white font-black text-sm flex-shrink-0">
                    {borrower.borrowerName?.charAt(0).toUpperCase() || "B"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{borrower.borrowerName}</h3>
                    <p className="text-xs text-gray-500">{borrower.email}</p>
                    <p className="text-xs text-gray-400">{borrower.mobileNo}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {borrower.hasOverdueLoan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                      {t("borrowersPage.labels.overdue")}
                    </span>
                  )}
                  {borrower.hasActiveLoan && !borrower.hasOverdueLoan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                      {t("borrowersPage.labels.active")}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 bg-fuchsia-50 rounded-xl p-3 mb-4">
                {[
                  { label:  t("borrowersPage.stats.totalLoans"), value: borrower.totalLoansCount, color: "text-gray-900" },
                  { label: t("borrowersPage.stats.totalAmount"), value: `₹${borrower.totalLoanAmount?.toLocaleString()}`, color: "text-orange-600" },
                  { label: t("borrowersPage.stats.remaining"), value: `₹${borrower.totalRemainingAmount?.toLocaleString()}`, color: "text-red-500" },
                ].map((s, i) => (
                  <div key={i} className="text-center border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{s.label}</p>
                    <p className={`text-sm font-black ${s.color} mt-0.5`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Loans list */}
              <div className="space-y-2">
                {borrower.loans.slice(0, 3).map((loan, j) => (
                  <div key={j} className="flex items-center justify-between text-xs py-1.5
                    border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 font-medium">
                      ₹{loan.amount?.toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${loan.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        loan.paymentStatus === "overdue" ? "bg-red-100 text-red-600" :
                          loan.paymentStatus === "part paid" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-blue-600"
                      }`}>
                      {loan.paymentStatus}
                    </span>
                  </div>
                ))}
                {borrower.loans.length > 3 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    {t("borrowersPage.labels.moreLoans", { count: borrower.loans.length - 3 })}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}