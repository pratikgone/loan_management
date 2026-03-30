import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSinglePlan } from "../store/plansSlice";
import { BsBoxSeam } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { SlNote } from "react-icons/sl";
import { FiCreditCard } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";



export function PlanDetails(){


        const navigate = useNavigate();
    //url wise plan details
    const { planId } = useParams();

    const dispatch = useDispatch();
    const { singlePlan, isLoadingSingle, error } = useSelector((state) => state.plans || {});

    useEffect(() => {
        dispatch(fetchSinglePlan(planId));
    }, [dispatch, planId]);

    if (isLoadingSingle) {
        return <div className="p-6 text-center">Loading plan details...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    if (!singlePlan) {
        return <div className="p-6 text-center">Plan not found</div>;
    }
    
       return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 sm:mb-8 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all cursor-pointer"
                >
                    ← Back to Plans
                </button>

                
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Plan Details
        </h2>
               

                {/* First Card – Hero Section */}

                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6 md:mb-8">
                    

                    <div className="bg-gradient-to-r from-orange-50 via-orange-50 to-orange-100 px-6 py-8 md:px-8 md:py-10">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">

                            {/* LEFT SIDE */}
                            <div className="space-y-4">

                                {/* Plan Name */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-orange-100">
                                        <BsBoxSeam className="w-5 h-5 text-orange-600" />
                                    </div>

                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                        {singlePlan.planName}
                                    </h1>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CiClock2 className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm md:text-base font-medium">
                                        {singlePlan.duration || "N/A"}
                                    </span>
                                </div>

                            </div>


                            {/* RIGHT SIDE */}
                            <div className="flex flex-col items-start md:items-end gap-4 md:gap-5">

                                {/* Status */}
                                <span
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${singlePlan.isActive
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                        }`}
                                >
                                    {singlePlan.isActive ? (
                                        <>
                                            <IoMdCheckmarkCircleOutline className="w-4 h-4 md:w-5 md:h-5" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <IoMdCloseCircleOutline className="w-4 h-4 md:w-5 md:h-5" />
                                            Inactive
                                        </>
                                    )}
                                </span>


                                {/* Price */}
                                <div className="md:text-right">
                                    <span className="text-2xl font-extrabold text-orange-600">
                                        ₹{singlePlan.priceMonthly?.toLocaleString() || "0"}
                                    </span>
                                    <span className="text-lg text-gray-500 ml-1">/month</span>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                {/* Second Card – Plan Information */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8 mb-6 md:mb-8">
                    <h2 className=" flex items-center gap-3  text-lg md:text-xl font-bold text-gray-900 mb-6">

                        Plan Information
                    </h2>

                    {/* Responsive Grid: 1 col on mobile, 2 on tablet/laptop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        {[
                            { icon: <BsBoxSeam className="h-5 w-5 stroke-[-1.5]" />, label: "Plan Name", value: singlePlan.planName },
                            { icon: <CiClock2 className="h-5 w-5 stroke-[0.5]" />, label: "Duration", value: singlePlan.duration || "N/A" },
                            { icon: <FiDollarSign className="h-5 w-5 stroke-[-1.5]" />, label: "Monthly Price", value: `₹${singlePlan.priceMonthly?.toLocaleString() || "0"}` },
                            { icon: <CiCalendar className="h-5 w-5 stroke-[0.5]" />, label: "Created At", value: new Date(singlePlan.createdAt).toLocaleString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) },
                            { icon: <SlNote className="h-5 w-5 stroke-[0.5]" />, label: "Last Updated", value: new Date(singlePlan.updatedAt).toLocaleString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) },
                            { icon: <FiCreditCard />, label: "Razorpay Plan ID", value: singlePlan.razorpayPlanId || "Not Configured" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3">
                                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</span>
                                    <span className="text-sm font-semibold text-gray-800 truncate block">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Third Card – Plan Features */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8 mb-6 md:mb-8">
                    <h2 className=" flex items-center gap-3  text-lg md:text-xl font-bold text-gray-900 mb-6">

                        Plan Features
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                            <CiClock2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">Unlimited Loans</span>
                                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                                    Create unlimited loans with this plan
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                            <IoMdCheckmark className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">Advanced Analytics</span>
                                <span className={`text-sm font-bold ${singlePlan.planFeatures?.advancedAnalytics ? "text-green-600" : "text-red-600"}`}>
                                    {singlePlan.planFeatures?.advancedAnalytics}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fourth Card – Description */}
                <div className="bg-white rouded-2xl md:rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8 mb-6 md:mb-8">
                    <h2 className=" flex items-center gap-3  text-lg md:text-xl font-bold text-gray-900 mb-4">
                        <MdOutlineDescription className="w-5 h-5 text-orange-600" />
                        Description
                    </h2>
                    <p className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {singlePlan.description || "No description provided for this plan."}
                    </p>
                </div>
            </div>
        </div>
    );
}