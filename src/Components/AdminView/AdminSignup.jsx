// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendOtp, verifyOtp } from "../../../redux/adminOtpSlice";
// import { useNavigate } from "react-router-dom";
// import { submitAdminDetails } from "../../../redux/adminDetailsSlice";

// const AdminSignup = () => {
//   const [contactNumber, setContactNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   // const [otpSent, setOtpSent] = useState(true);
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState("");
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [showReloading, setShowReloading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { adminDetails } = useSelector((state) => state.adminDetails);
//   const handleSendOtp = async () => {
//     if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
//       setError("Please enter a valid 10-digit contact number.");
//       return;
//     }

//     setShowReloading(true);

//     try {
//       setError("");
//       const result = await dispatch(sendOtp({ contactNumber }));
//       console.log("result", result);
//       if (sendOtp.fulfilled.match(result)) {
//         setOtpSent(true);
//         setSubmitMessage("OTP sent successfully.");
//       } else {
//         setError(result.payload?.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setShowReloading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (otp.length !== 4 || !/^\d+$/.test(otp)) {
//       setError("Enter a valid 4-digit OTP.");
//       return;
//     }

//     try {
//       setError("");
//       const result = await dispatch(verifyOtp({ contactNumber, otp }));
//       console.log(
//         "verifyOTP.fullfilled.match(result)",
//         verifyOtp.fulfilled.match(result)
//       );
//       console.log("result", result);
//       if (verifyOtp.fulfilled.match(result)) {
//         setSubmitMessage("OTP verified successfully.");
//         const isLogin = await dispatch(submitAdminDetails(contactNumber));
//         console.log(
//           "verify.fullfilled",
//           submitAdminDetails.fulfilled.match(isLogin)
//         );
//         console.log("isLogin", isLogin);

//         console.log("adminDetails", adminDetails);
//         const role = isLogin.payload.adminDetails.role;
//         console.log("role from handleVerifyOTP", role);
//         if (role === "admin") {
//           navigate("/adminDashboard");
//         } else if (role === "cashier") {
//           navigate("/cashierDashboard");
//         } else if (role === "counsellor") {
//           navigate("/consellorDashboard");
//         } else if (role === "admissionHead") {
//           navigate("/admissionHeadDasboard");
//         } else if (role === "accounts") {
//           navigate("/accountsDashboard");
//         }
//       } else {
//         setError(result.payload?.message || "Invalid OTP.");
//       }
//     } catch (error) {
//       console.log("error", error);
//       setError("Verification failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-red-700 text-white px-4">
//       <div className="bg-white/10 backdrop-blur p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

//         <div className="mb-4">
//           <label htmlFor="contactNumber" className="block mb-1">
//             Contact Number
//           </label>
//           <input
//             type="text"
//             id="contactNumber"
//             value={contactNumber}
//             onChange={(e) => setContactNumber(e.target.value)}
//             className="w-full px-4 py-2 rounded bg-red-700 border border-white text-white"
//             maxLength={10}
//             placeholder="Enter 10-digit number"
//           />
//         </div>
//         {showReloading && (
//           <div className="flex justify-center items-center m-3">
//             <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
//           </div>
//         )}

//         {otpSent && (
//           <div className="mb-4">
//             <label htmlFor="otp" className="block mb-1">
//               Enter OTP
//             </label>
//             <input
//               type="text"
//               id="otp"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full px-4 py-2 rounded bg-red-700 border border-white text-white"
//               maxLength={4}
//               placeholder="Enter OTP"
//             />
//           </div>
//         )}

//         {error && <p className="text-yellow-300 text-sm mb-4">{error}</p>}
//         {submitMessage && (
//           <p className="text-green-300 text-sm mb-4">{submitMessage}</p>
//         )}

//         <div className="flex flex-col gap-4">
//           {!otpSent ? (
//             <button
//               type="button"
//               onClick={handleSendOtp}
//               className="bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600"
//             >
//               Send OTP
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
//             >
//              Login
//             </button>
//           )} 
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSignup;










import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../../redux/adminOtpSlice";
import { useNavigate } from "react-router-dom";
import { submitAdminDetails } from "../../../redux/adminDetailsSlice";
import {
  Phone,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  KeyRound,
} from "lucide-react";

const AdminSignup = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  // const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showReloading, setShowReloading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminDetails } = useSelector((state) => state.adminDetails);

  const handleSendOtp = async () => {
    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      setError("Please enter a valid 10-digit contact number.");
      return;
    }

    setShowReloading(true);

    try {
      setError("");
      const result = await dispatch(sendOtp({ contactNumber }));
      console.log("result", result);
      if (sendOtp.fulfilled.match(result)) {
        setOtpSent(true);
        setSubmitMessage("OTP sent successfully.");
      } else {
        setError(result.payload?.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setShowReloading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // if (otp.length !== 4 || !/^\d+$/.test(otp)) {
    //   setError("Enter a valid 4-digit OTP.");
    //   return;
    // }

    setShowReloading(true);

    try {
      setError("");
      // const result = await dispatch(verifyOtp({ contactNumber, otp }));
      const result = true;
      console.log(
        "verifyOTP.fullfilled.match(result)",
        verifyOtp.fulfilled.match(result)
      );
      console.log("result", result);
      if (verifyOtp.fulfilled.match(result)) {
        setSubmitMessage("OTP verified successfully.");
        const isLogin = await dispatch(submitAdminDetails(contactNumber));
        console.log(
          "verify.fullfilled",
          submitAdminDetails.fulfilled.match(isLogin)
        );
        console.log("isLogin", isLogin);

        console.log("adminDetails", adminDetails);
        const role = isLogin.payload.adminDetails.role;
        console.log("role from handleVerifyOTP", role);
        if (role === "admin") {
          navigate("/adminDashboard");
        } else if (role === "cashier") {
          navigate("/cashierDashboard");
        } else if (role === "counsellor") {
          navigate("/consellorDashboard");
        } else if (role === "admissionHead") {
          navigate("/admissionHeadDasboard");
        } else if (role === "accounts") {
          navigate("/accountsDashboard");
        }
      } else {
        setError(result.payload?.message || "Invalid OTP.");
      }
    } catch (error) {
      console.log("error", error);
      setError("Verification failed.");
    } finally {
      setShowReloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0] flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#c61d23]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ffdd00]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#c61d23] to-[#a01818] rounded-2xl mb-4 shadow-lg">
            <Shield size={32} className="text-white sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818] mb-2">
            Admin Portal
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Secure access for authorized personnel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#fdf5f6] to-[#f5eff0] px-6 sm:px-8 py-6 border-b-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <KeyRound size={24} className="text-[#c61d23]" />
              Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            {/* Contact Number Input */}
            <div className="mb-4 sm:mb-5">
              <label
                htmlFor="contactNumber"
                className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <Phone size={16} className="text-[#c61d23]" />
                Contact Number
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    setError("");
                    setSubmitMessage("");
                  }}
                  // disabled={otpSent}
                  className={`w-full pl-3 pr-3 py-2.5 text-sm text-gray-900 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    error && !otpSent ? "border-red-500" : "border-gray-200"
                  }`}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            {/* Loading Spinner */}
            {showReloading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 size={32} className="text-[#c61d23] animate-spin" />
              </div>
            )}

            {/* OTP Input */}
            {otpSent && !showReloading && (
              <div className="mb-4 sm:mb-5 animate-fadeIn">
                <label
                  htmlFor="otp"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Lock size={16} className="text-[#c61d23]" />
                  Enter OTP
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError("");
                      setSubmitMessage("");
                    }}
                    className={`w-full pl-3 pr-3 py-2.5 text-sm text-gray-900 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 placeholder:text-gray-400 tracking-widest text-center text-lg font-semibold ${
                      error ? "border-red-500" : "border-gray-200"
                    }`}
                    maxLength={4}
                    placeholder="• • • •"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  Didn't receive the code?
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                      setSubmitMessage("");
                    }}
                    className="text-[#c61d23] font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 sm:p-4 rounded-xl border-2 border-red-200 bg-red-50 flex items-start gap-2 sm:gap-3 animate-fadeIn">
                <AlertCircle
                  size={16}
                  className="text-red-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
                />
                <p className="text-xs sm:text-sm font-semibold text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {submitMessage && (
              <div className="mb-4 p-3 sm:p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 flex items-start gap-2 sm:gap-3 animate-fadeIn">
                <CheckCircle2
                  size={16}
                  className="text-emerald-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
                />
                <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={showReloading}
              className="w-full group relative px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-red-500/30 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {showReloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : otpSent ? (
                <>
                  <span>Verify & Login</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        {/* <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            For technical support, contact IT department
          </p>
        </div> */}
      </div>

    
    </div>
  );
};

export default AdminSignup;