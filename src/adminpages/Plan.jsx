import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlan, deletePlan, fetchPlans, updatePlan } from "../store/plansSlice";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { BsBoxSeam } from "react-icons/bs";




// ─── Toast Icons ─────────────────────────────────────────────
const ToastIcons = {
  create: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  update: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  delete: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
};

const toastStyles = {
  create: { icon: "bg-green-100 text-green-700", bar: "bg-green-500" },
  update: { icon: "bg-blue-100  text-blue-700", bar: "bg-blue-500" },
  delete: { icon: "bg-red-100   text-red-700", bar: "bg-red-500" },
};

// ─── Toast Item ───────────────────────────────────────────────
function ToastItem({ id, action, message, duration = 4000, onRemove }) {

  const {t} = useTranslation();

  const [removing, setRemoving] = useState(false);
  const s = toastStyles[action] || toastStyles.create;

  const dismiss = useCallback(() => {
    setRemoving(true);
    setTimeout(() => onRemove(id), 220);
  }, [id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div className={`relative flex items-start gap-3 bg-white border border-gray-200
      rounded-xl shadow-md p-4 min-w-[280px] max-w-sm overflow-hidden
      transition-all duration-[220ms]
      ${removing ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.icon}`}>
        {ToastIcons[action]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{message}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {action === "create" ?  t("toastCreateDesc")
            : action === "update" ?  t("toastUpdateDesc")
              : t("toastDeleteDesc")}
        </p>
      </div>
      <button onClick={dismiss}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100
          rounded p-0.5 transition-colors flex-shrink-0 mt-0.5 border-0 bg-transparent cursor-pointer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" className="w-3 h-3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`}
        style={{ animation: `shrink ${duration}ms linear forwards` }} />
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// ─── useToast Hook ────────────────────────────────────────────
let _toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ action, message, duration = 4000 }) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, action, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}




export function Plan() {


  const dispatch = useDispatch();
  const { plans, isLoading, isCreating, isUpdating, error } = useSelector((state) => state.plans || {});


  const { toasts, showToast, removeToast } = useToast();

  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    duration: '1 month',
    priceMonthly: '',
    razorpayPlanId: '',
    planFeatures: {
      advancedAnalytics: false,
      prioritySupport: false,
    },
    isActive: true,
  });

  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  //search bar state
  const [searchQuery, setSearchQuery] = useState("");

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 6;


  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;


  const filteredPlans = plans.filter((plan) => {
    const query = searchQuery.toLowerCase();

    return (
      plan.planName?.toLowerCase().includes(query) ||
      plan.description?.toLowerCase().includes(query) ||
      plan.duration?.toLowerCase().includes(query) ||
      String(plan.priceMonthly)?.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan)

  // Check if navigated from Dashboard with openModal state
  useEffect(() => {
    if (location.state?.openModal) {
      openAddModal();
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  //modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Open modal for NEW plan
  const openAddModal = () => {
    setFormData({
      planName: '',
      description: '',
      duration: '1 month',
      priceMonthly: '',
      razorpayPlanId: '',
      planFeatures: { advancedAnalytics: false, prioritySupport: false },
      isActive: true,
    });
    setIsEditMode(false);
    setEditingPlanId(null);
    setIsModalOpen(true);
    setFormSuccess(null);
    setFormError(null);
  };

  //to show loading on specific time
  const [deletingPlanId, setDeletingPlanId] = useState(null);



  // Load all plans on mount
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);


  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("planFeatures.")) {
      const feature = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        planFeatures: {
          ...prev.planFeatures,
          [feature]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };


  // Submit handler – Create OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.planName.trim()) {
      setFormError(t("planNameRequired"));
      return;
    }


    if (!formData.duration) {
      setFormError(t("durationRequired"));
      return;
    }

    if (!formData.priceMonthly) {
      setFormError(t("priceRequired"));
      return;
    }

    if (Number(formData.priceMonthly) < 99) {
      setFormError(t("minPrice"));
      return;
    }

    if (Number(formData.priceMonthly) > 999999) {
      setFormError(t("maxPrice"));
      return;
    }

    if (!formData.priceMonthly || Number(formData.priceMonthly) <= 0) {
      setFormError(t("positivePrice"));
      return;
    }

    if (!formData.description.trim()) {
      setFormError(t("descriptionRequired"));
      return;
    }

    // atleast
    if (formData.description.trim().length < 5) {
      setFormError(t("descriptionMin"));
      return;
    }

    //maximum
    if (formData.description.trim().length > 200) {
      setFormError(t("descriptionMax"));
      return;
    }


    setFormError(null);
    setFormSuccess(null);

    try {
      if (isEditMode) {
        // UPDATE
        await dispatch(updatePlan({ planId: editingPlanId, updatedData: formData })).unwrap();
        showToast({ action: "update", message: t("planUpdated") })
      } else {
        // CREATE
        await dispatch(createPlan(formData)).unwrap();
        showToast({ action: "create", message: t("planAdded") })
      }

      // Reset & close modal
      setFormData({
        planName: '',
        description: '',
        duration: '1 month',
        priceMonthly: '',
        razorpayPlanId: '',
        planFeatures: { advancedAnalytics: false, prioritySupport: false },
        isActive: true,
      });
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message ||  t("saveFailed"));
    }
  };

  const handleDelete = (planId) => {
    setDeleteConfirm(planId);
  };

  // Open modal for EDIT (pre-fill selected plan data)
  const handleEdit = (planId) => {
    const planToEdit = plans.find(p => p._id === planId);
    if (!planToEdit) {
      alert("Plan not found!");
      return;
    }

    setFormData({
      planName: planToEdit.planName || '',
      description: planToEdit.description || '',
      duration: planToEdit.duration || '1 month',
      priceMonthly: planToEdit.priceMonthly || '',
      razorpayPlanId: planToEdit.razorpayPlanId || '',
      planFeatures: {
        advancedAnalytics: planToEdit.planFeatures?.advancedAnalytics || false,
        prioritySupport: planToEdit.planFeatures?.prioritySupport || false,
      },
      isActive: planToEdit.isActive ?? true,
    });

    setIsEditMode(true);
    setEditingPlanId(planId);
    setFormSuccess(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleViewPlan = (planId) => {
    navigate(`/plans/${planId}`);
  }

  if (isLoading) {
  return (
    <div className="flex items-center justify-center h-[60vh] bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      <span className="ml-4 text-lg text-gray-600 font-medium">
        {t("loadingPlans")}
      </span>
    </div>
  );
}


  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
       <div className="p-5 sm:p-6 lg:p-8">
  
     {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t("planManagement")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage subscription plans</p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-orange-200 transition-all cursor-pointer active:scale-95">
          <span className="text-lg leading-none">+</span>
          {t("createPlan")}
        </button>
      </div>
      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 bg-white rounded-xl border border-orange-100 shadow-sm p-3 max-w-4xl mx-auto">
        <IoIosSearch className="w-4 h-4 text-gray-500 flex-shrink-0" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}

          placeholder= {t("searchPlaceholder")}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
        />

       
      </div>

      {/* popup message including add,update,delete,edit*/}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-white/70 dark:border-gray-700 max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">

            {/* 1. Modal Header (Fixed) */}
            <div className="bg-orange-500 px-6 py-5 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                {isEditMode ? t("editPlan") : t("createNewPlan")}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-3xl font-light cursor-pointer transition-all"
              >
                ×
              </button>
            </div>

            {/* 2. Modal Body (Scrollable Content) */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar bg-white">

                {/* Laptop 2 columns, Mobile par 1 column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Plan Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">{t("planName")}<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="planName"
                      value={formData.planName}
                      onChange={handleChange}
                      placeholder={t("planNamePlaceholder")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-base"

                    />
                  </div>

                  {/* Duration Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">{t("duration")} <span className="text-red-500">*</span></label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white text-base cursor-pointer"

                    >
                      <option value="1 month">1 month</option>
                      <option value="2 months">2 months</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                    </select>
                  </div>

                  {/* Monthly Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">{t("monthlyPrice")} (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        name="priceMonthly"
                        value={formData.priceMonthly}
                        onChange={handleChange}
                        // min={99}
                        // max={999999}
                        placeholder={t("pricePlaceholder")}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-base"

                      />
                    </div>
                  </div>

                  {/* Razorpay Plan ID */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">{t("razorpayPlanId")}</label>
                    <input
                      type="text"
                      name="razorpayPlanId"
                      value={formData.razorpayPlanId}
                      onChange={handleChange}
                      placeholder={t("razorpayPlaceholder")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-base"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">{t("description")} <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder={t("descriptionPlaceholder")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-base"
                    />
                  </div>

                  {/* Features Section */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="block text-sm font-bold text-gray-700">{t("planFeatures")}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <input
                          type="checkbox"
                          name="planFeatures.advancedAnalytics"
                          checked={formData.planFeatures.advancedAnalytics}
                          onChange={handleChange}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium group-hover:text-orange-600 transition-colors">{t("advancedAnalytics")}</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <input
                          type="checkbox"
                          name="planFeatures.prioritySupport"
                          checked={formData.planFeatures.prioritySupport}
                          onChange={handleChange}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium group-hover:text-orange-600 transition-colors">{t("prioritySupport")}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Active Status Toggle */}
                <div className="flex items-center gap-4 p-4 border border-orange-100 rounded-2xl bg-orange-50/30">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-6 h-6 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{t("activeStatus")}</p>
                    <p className="text-xs text-gray-500">{t("activeStatusDesc")}</p>
                  </div>
                </div>

                {/* Alert Messages */}
                {(formError || formSuccess) && (
                  <div className={`p-4 rounded-xl text-center font-bold text-sm border ${formError ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"
                    }`}>
                    {formError || formSuccess}
                  </div>
                )}
              </div>

              {/* 3. Modal Footer (Fixed at bottom) */}
              <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 shrink-0 flex flex-row items-center justify-center sm:justify-end gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 max-w-[120px] sm:w-auto sm:px-8 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white 
  font-medium rounded-lg transition-all shadow-md cursor-pointer
  flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      {t("saving")}
                    </>
                  ) : isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      {t("updating")}
                    </>
                  ) : isEditMode ? (
                    t("updatePlan")
                  ) : (
                    t("createPlan")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden  border border-white/70 dark:border-gray-700">
            {/* Header */}
            <div className="bg-red-500 text-white px-6 py-5 border-b border-orange-200">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-red-600 text-2xl">!</span>
                {t("confirmDelete")}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t("deleteConfirmText")} <br />
                <span className="font-medium text-red-600">{t("deleteWarning")}</span>
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-200 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all cursor-pointer"
              >
                {t("cancel")}
              </button>

              <button
                onClick={() => {
                  setDeletingPlanId(deleteConfirm);
                  dispatch(deletePlan(deleteConfirm)).finally(() => setDeletingPlanId(null));
                  setDeleteConfirm(null);
                  showToast({ action: "delete", message: t("planDeleted") });
                }}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-md cursor-pointer"
              >
                {t("deletePlan")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
        {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-2xl">{error}</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/70 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500 font-medium">{t("noPlans")}</p>
          <p className="text-gray-400 text-sm mt-1">{t("createFirstPlan")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {currentPlans.map((plan) => (
            <div key={plan._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col group">

              {/* Top accent bar */}
              <div className={`h-1 w-full ${plan.isActive ? "bg-gradient-to-r from-orange-400 to-amber-400" : "bg-gradient-to-r from-gray-300 to-gray-400"}`} />

              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <BsBoxSeam className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${plan.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                    {plan.isActive ? t("active") : t("inactive")}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 plan-card-title">{plan.planName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 plan-card-desc mb-4">{plan.description || t("noDescription")}</p>

                <div className="grid grid-cols-2 gap-3 mb-4 cursor-pointer" onClick={() => handleViewPlan(plan._id)}>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{t("duration")}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{plan.duration}</p>
                  </div>
                  <div className="bg-orange-50/60 dark:bg-orange-900/20 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{t("monthlyPrice")}</p>
                    <p className="text-sm font-bold text-orange-600 mt-0.5">₹{plan.priceMonthly?.toLocaleString() || "0"}</p>
                  </div>
                </div>

                {/* Features */}
                {plan.planFeatures && (
                  <div className="space-y-1.5">
                    {Object.entries(plan.planFeatures).map(([key, val]) => (
                      val !== false && (
                        <div key={key} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${val ? "bg-green-50 dark:bg-green-900/20 text-green-700" : "bg-gray-50 dark:bg-gray-700/50 text-gray-400"}`}>
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          {val ? <IoCheckmarkCircleOutline className="w-4 h-4 flex-shrink-0" /> : <AiOutlineCloseCircle className="w-4 h-4 flex-shrink-0" />}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <button onClick={() => handleEdit(plan._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-medium text-xs rounded-xl hover:bg-blue-100 transition-all cursor-pointer border border-blue-100">
                  <FiEdit className="w-3.5 h-3.5" /> {t("edit")}
                </button>
                <button onClick={() => handleDelete(plan._id)} disabled={deletingPlanId === plan._id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 font-medium text-xs rounded-xl hover:bg-red-100 transition-all cursor-pointer border border-red-100 disabled:opacity-60">
                  {deletingPlanId === plan._id ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <MdDeleteOutline className="w-3.5 h-3.5" />}
                  {deletingPlanId === plan._id ? t("deleting") : t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  Pagination — after plans list*/}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm text-gray-600 dark:text-gray-300">← {t("prev")}</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === i+1 ? "bg-orange-500 text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-300"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 cursor-pointer hover:border-orange-300 transition-all text-sm text-gray-600 dark:text-gray-300">{t("next")} →</button>
        </div>
      )}
    </div>
    </div>
  );
}