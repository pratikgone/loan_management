import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoIdCardOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { IoCardOutline } from "react-icons/io5";
import { FaCamera, FaImages, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearError, signup } from "../store/authSlice";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";


export function Signup(){


      const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    aadhaar: "",
    mobile: "",
    pan: "",
    profilePicture: null,
  });


  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
  dispatch(clearError());
}, []);

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleGallery = () => {
    stopStream();
    setIsCameraMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const handleCamera = async () => {
    stopStream(); // pehle purana stream band karo
    setIsCameraMode(true);
    setVideoReady(false); // reset ready state
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;

        // Play promise handle
        await videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
          setError("Failed to start video preview.");
        });

        // wait for Video loaded 
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
          console.log("Video metadata loaded – ready to capture");
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access camera. Please allow permission or use Gallery.");
      setIsCameraMode(false);
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;

    if (!video || !videoReady || video.videoWidth === 0) {
      setError("Camera is still loading. Please wait a moment and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Failed to get canvas context.");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Failed to capture image.");
          return;
        }

        const file = new File([blob], `profile-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        setForm((prev) => ({ ...prev, profilePicture: file }));

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        stopStream();
        setIsCameraMode(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetake = () => {
    setPreview(null);
    setForm(prev => ({ ...prev, profilePicture: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {

      if (!form.name.trim()) {
        setError("Full Name is required");
        return;
      }

      if (form.name.trim().length < 3) {
        setError("Full Name must be at least 3 characters");
        return;
      }

      if (!form.email.trim()) {
        setError("Email is required");
        return;
      }

      if(!form.address.trim()) {
        setError("Address is required");
        return;
      }

      if (!form.password) {
        setError("Password is required");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (!form.confirmPassword) {
        setError("Confirm Password is required");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!form.name || !form.email || !form.address || !form.password) {
        setError("Please fill all required fields");
        return;
      }

      setStep(2);
    } else if (step === 2) {

      if (!form.aadhaar.trim()) {
        setError("Aadhaar Card Number is required");
        return;
      }
      if (!/^\d{12}$/.test(form.aadhaar)) {
        setError("Aadhaar must be exactly 12 digits");
        return;
      }

      if (!form.mobile.trim()) {
        setError("Mobile Number is required");
        return;
      }
      if (!/^\d{10}$/.test(form.mobile)) {
        setError("Mobile Number must be exactly 10 digits");
        return;
      }

      if(!form.pan.trim()) {
        setError("Pancard Number is required");
        return;
      }

      if (form.pan && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(form.pan)) {
        setError("Invalid PAN format (e.g., ABCDE1234F)");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      stopStream();
      setIsCameraMode(false);
      setStep(step - 1);
      setError("");
    }
  };

  const [toast, setToast] = useState(false);

  const handleCreateAccount = async () => {
    setError("");

    try {
      const formData = new FormData();
      formData.append("userName", form.name || "");
      formData.append("email", form.email || "");
      formData.append("address", form.address || "");
      formData.append("password", form.password || "");
      formData.append("confirmPassword", form.confirmPassword || "");
      formData.append("aadharCardNo", form.aadhaar || "");
      formData.append("mobileNo", form.mobile || "");
      if (form.pan) formData.append("panCardNumber", form.pan);
      formData.append("roleId", "0");
      if (form.profilePicture) {
        formData.append("profileImage", form.profilePicture);
      }
      await dispatch(signup(formData)).unwrap();

      setToast({ type: "success", message: "Account created successfully! Please login to continue." })

      setTimeout(() => {
        navigate("/");
      },2000);

    } catch (error) {
       // Backend error message
    let errorMsg = error || "Signup failed";

     console.log("Signup Error:", err);

    // Specific friendly messages (backend compare message )
    const lowerMsg = errorMsg.toLowerCase();

    if (lowerMsg.includes("mobile") && lowerMsg.includes("already")) {
      errorMsg = "This mobile number is already in use. Please use a different mobile number.";
      document.getElementById("mobile")?.focus(); // mobile field pe focus
    } 
    else if (lowerMsg.includes("email") && lowerMsg.includes("already")) {
      errorMsg = "This email is already in use. Please use a different email or login.";
      document.getElementById("email")?.focus(); // email field pe focus
    } 
    else if (lowerMsg.includes("aadhar") || lowerMsg.includes("aadhaar")) {
      errorMsg = "This Aadhaar number is already registered. Please use a different Aadhaar.";
      document.getElementById("aadhaar")?.focus();
    } 
    else if (lowerMsg.includes("pan") || lowerMsg.includes("pan card")) {
      errorMsg = "This PAN card number is already in use. Please use a different PAN.";
      document.getElementById("pan")?.focus();
    }

    // Local form error dikhao (red box)
    setError(errorMsg);

    // Toast (user  clear message )
    setToast({
      type: "error",
      message: errorMsg
    });

      setTimeout(()=>{
         setToast(null)//after toast message waight 2 sec then invisible
      },2000);
    }
  };


     return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="w-full max-w-[420px] sm:max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100/80 p-6 sm:p-8 md:p-10 transform transition-all">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-1.5 sm:space-x-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? 'bg-orange-500' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}>
              3
            </div>
          </div>
        </div>

         {/* toast message */}
        {toast && (
          <div className="fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in 
                  w-[90%] sm:w-auto min-w-[280px] max-w-[400px] md:max-w-none">
            <div className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-3 ${toast.type === "success" ? "bg-green-600 border border-green-700" : "bg-red-600 border border-red-700"
              }`}>
              {toast.type === "success" ? (
                <FaCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <FiXCircle className="w-6 h-6 md:w-6 md:h-6" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
            {step === 1 ? "Basic Information" : step === 2 ? "Identity Details" : "Profile Picture"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            {step === 1
              ? "Enter your personal details"
              : step === 2
                ? "Enter your identification details"
                : "Add a profile picture (Optional)"}
          </p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <form onSubmit={handleNext} className="space-y-7">
          {(error || reduxError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error || reduxError}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <>
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <CiUser className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    
                    className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <MdOutlineEmail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                  
                    className="w-full pl-12 px-4 py-3 border border-gray-300 text-sm sm:text-base rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <CiLocationOn className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter your full address"
                    
                    className="w-full pl-12 px-4 py-3 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <CiLock className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Create password"
                    
                    className="w-full pl-12 px-4 py-3 pr-12 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                  {/* Right Eye Icon – placeholder in right side */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500  focus:outline-none z-10 cursor-pointer"
                  >
                    {showPassword ? (
                      <FiEye className="h-5 w-5" />
                    ) : (
                      <FiEyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <CiLock className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    
                    className="w-full pl-12 px-4 py-3 pr-12 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                  {/* Right Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500  focus:outline-none z-10 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <FiEye className="h-5 w-5" />
                    ) : (
                      <FiEyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Identity Details */}
          {step === 2 && (
            <>
              {/* Aadhaar Card Number */}
              <div>
                <label htmlFor="aadhaar" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Aadhaar Card Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <IoIdCardOutline className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="aadhaar"
                    type="text"
                    value={form.aadhaar}
                    onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
                    placeholder="Enter 12 digit Aadhar number"
                    
                    maxLength={12}
                    className="w-full pl-12 px-4 py-3 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <IoCallOutline className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="Enter 10 digit mobile number"
                    
                    maxLength={10}
                    className="w-full pl-12 px-4 py-3 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* PAN Card Number (Optional) */}
              <div>
                <label htmlFor="pan" className="block text-sm sm:text-sm font-medium text-gray-700 mb-1.5">
                  PAN Card Number (Optional)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <IoCardOutline className="h-5 w-5 stroke-[1]" />
                  </div>
                  <input
                    id="pan"
                    type="text"
                    value={form.pan}
                    onChange={(e) => setForm({ ...form, pan: e.target.value })}
                    placeholder="Enter 10 digit PAN"
                    maxLength={10}
                    className="w-full pl-12 px-4 py-3 border text-sm sm:text-base border-gray-300 rounded-lg bg-orange-50 text-gray-900 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Profile Picture */}
          {step === 3 && (
            <div className="space-y-8">
              {/* Camera Preview or Profile Picture Circle */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-dashed border-orange-100 bg-orange-50 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {isCameraMode ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      onLoadedMetadata={() => setVideoReady(true)}
                      onLoadedData={() => setVideoReady(true)} // extra safety
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : preview ? (
                    <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-orange-500 text-6xl" />
                  )}
                </div>
                <p className="mt-4 text-gray-600 text-base font-medium">
                  {preview ? "Profile picture added" : "No profile picture"}
                </p>
                <p className="mt-1 text-gray-500 text-sm">
                  Tap below to add
                </p>
              </div>

              {/* Camera Controls */}
              {isCameraMode ? (
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={!videoReady || isLoading}
                    className={`px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all cursor-pointer ${!videoReady || isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => { stopStream(); setIsCameraMode(false); }}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {/* Gallery & Camera Buttons */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={handleGallery}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-xl bg-orange-50 border-orange-100 transition-all duration-200 cursor-pointer"
                    >
                      <FaImages className="text-orange-500 text-3xl mb-1" />
                      <span className="text-gray-800 font-medium text-lg">Gallery</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCamera}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-xl bg-orange-50 border-orange-100 transition-all duration-200 cursor-pointer"
                    >
                      <FaCamera className="text-orange-500 text-3xl mb-1" />
                      <span className="text-gray-800 font-medium text-lg">Camera</span>
                    </button>
                  </div>

                  {/* Retake button if preview exists */}
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="w-full py-2 text-orange-500 font-medium hover:underline cursor-pointer"
                    >
                      Retake Photo
                    </button>
                  )}
                </>
              )}

              {/* Terms */}
              <div className="flex items-start text-sm text-gray-600 bg-orange-50 border-orange-100 p-4 rounded-lg">
                <FaCheckCircle className="text-green-500 text-lg mr-3 mt-1 flex-shrink-0" />
                <p>
                  By creating an account, you agree to our{" "}
                  <Link to="/terms" className="text-orange-500 hover:underline">
                    Terms of Services
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Back button sirf Step 2 aur Step 3 mein dikhega */}
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 py-3.5 px-4 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 transition-all duration-200 cursor-pointer"
              >
                Back
              </button>
            )}

            {/* Step 1 mein Next button full width */}
            {step === 1 ? (
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-orange-400 text-white font-semibold rounded-xl shadow-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Next..." : "Next"}
              </button>
            ) : step === 2 ? (
              <button
                type="submit"
                className="w-1/2 py-3.5 px-4 bg-orange-400 text-white font-semibold rounded-xl shadow-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Next..." : "Next"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-1/2 py-3.5 px-4 bg-orange-200 text-white font-semibold rounded-xl shadow-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            )}
          </div>

          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
