// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import { updateUserDetails, submitFormData } from "../../redux/formDataSlice";
// import { setLoading } from "../../redux/loadingSlice";
// import Spinner from "../../api/Spinner";
// import scholarsDenLogo from "../assets/scholarsdenLogo.png";
// import { updateAlreadyExistStudent } from "../../redux/alreadyExistStudentSlice";
// import SignupDetailsPage from "./SignupDetailsPage";
// import {
//   Phone,
//   Shield,
//   CheckCircle2,
//   Loader2,
//   ChevronRight,
//   AlertCircle,
// } from "lucide-react";

// import SignupDetailsPage from "./SignupDetailsPage";

// const VerificationPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userData, message } = useSelector((state) => state.userDetails);
//   const { loading } = useSelector((state) => state.loadingDetails);
//   const [showReloading, setShowReloading] = useState(false);

//   const [code, setCode] = useState("");
//   const [showCodeBox, setShowCodeBox] = useState(false);
//   const [codeEntered, setCodeEntered] = useState(false);
//   const [codeVerified, setCodeVerified] = useState(false);

//   const [submitMessage, setSubmitMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     console.log("userData", userData);
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "fatherContactNumber") {
//       if (value.length > 10) {
//         return;
//       }
//     }

//     dispatch(updateUserDetails({ [name]: value }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: value ? "" : `${name} is required`,
//     }));
//   };

//   const validateForm = () => {
//     const formErrors = {};
//     let isValid = true;

//     if (!userData?.fatherContactNumber) {
//       formErrors.fatherContactNumber = "Contact Number is required";
//       isValid = false;
//     }

//     if (
//       userData?.fatherContactNumber &&
//       userData.fatherContactNumber.length !== 10
//     ) {
//       formErrors.fatherContactNumber =
//         "Contact Number must be exactly 10 digits";
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const verifyPhoneNo = async () => {
//     try {
//       if (userData?.fatherContactNumber?.length !== 10) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           fatherContactNumber: `The length must be exactly 10 digits`,
//         }));
//         return;
//       }

//       setShowReloading(true);
//       setSubmitMessage("");

//       dispatch(setLoading(true));
//       const response = await axios.post("/admissions/sendVerification", {
//         mobileNumber: userData.fatherContactNumber,
//       });
//       if (response.status === 200) {
//         setShowCodeBox(true);
//         setCodeVerified(false);
//         setSubmitMessage("OTP sent successfully!");
//       }
//     } catch (error) {
//       console.log("error", error);
//       setSubmitMessage(error.response?.data?.message || "Error sending OTP");
//     } finally {
//       dispatch(setLoading(false));
//       setShowReloading(false);
//     }
//   };

//   const checkVerificationCode = async () => {
//     try {
//       const response = await axios.post("/admissions/verifyNumber", {
//         mobileNumber: userData.fatherContactNumber,
//         otp: code,
//       });
//       if (response.status === 200) {
//         console.log("OTP verified successfully");
//         setCodeVerified(true);
//         setShowCodeBox(false);
//         setSubmitMessage("Phone number verified successfully!");
//       }
//       return true;
//     } catch (error) {
//       setSubmitMessage("Error verifying phone number");
//       console.log("Error verifying phone number", error);
//       return false;
//     }
//   };

//   const onSubmit = async (e) => {
//     console.log("onSubmit click");
//     e.preventDefault();

//     let codeChecked = true;

//     console.log("codeChecked", codeChecked);
//     if (codeChecked === false) {
//       setShowCodeBox(false);
//       setCodeVerified(false);
//       setSubmitMessage("Please Verify Your Phone Number");
//       return;
//     }

//     if (!validateForm()) return;

//     console.log("userData in onSubmit ", userData);
//     try {
//       dispatch(setLoading(true));

//       const resultAction = await dispatch(submitFormData(userData));

//       if (submitFormData.fulfilled.match(resultAction)) {
//         const { message } = resultAction.payload;

//         console.log("message from verification page ", message);
//         console.log("userData verification page ", userData);

//         if (message) {
//           console.log("message exists", message);
//           navigate("/alreadyExist");
//         } else {
//           navigate("/basicDetails");
//         }
//       } else {
//         console.error("Form submission failed:", resultAction.payload);
//       }

//       if (document.cookie) {
//         const alreadyExistStudent = await axios.post(
//           "/user/getStudentByPhone",
//           { fatherContactNumber: userData.fatherContactNumber }
//         );

//         console.log("fatherContactNumber", alreadyExistStudent);

//         if (alreadyExistStudent.length === 0) {
//           navigate("/basicDetails");
//         } else {
//           dispatch(
//             updateAlreadyExistStudent(alreadyExistStudent.data.data)
//           );
//         }

//         navigate("/alreadyExist");

//         if (message !== "") {
//           navigate("/alreadyExist");
//         } else {
//           navigate("/basicDetails");
//         }
//       }
//     } catch (error) {
//       console.log("Error submitting form:", error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   useEffect(() => {
//     console.log("message from already exist", message);
//     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   }, []);

//   const handleOTPChange = async (e) => {
//     const value = e.target.value;
//     if (value.length <= 4 && /^\d*$/.test(value)) {
//       setCode(value);
//     }

//     if (value.length === 4) {
//       setCodeEntered(true);
//       setSubmitMessage("");
//     } else {
//       setCodeEntered(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#c61d23] via-[#a01818] to-[#8f1515]">
//       {/* Header Section */}
//       <div className="mb-5">
//         <SignupDetailsPage />
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow w-full flex flex-col items-center justify-between px-4 py-4">
//         <div className="w-full max-w-md">
//           {/* Branding Section */}
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center mb-4">
//               <div className="relative">
//                 <div className="w-20 h-20 rounded-2xl shadow-2xl border-4 border-[#ffdd00]/40 flex items-center justify-center bg-white p-2">
//                   <Shield className="w-12 h-12 text-[#c61d23]" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ffdd00] to-amber-400 rounded-full flex items-center justify-center shadow-lg">
//                   <CheckCircle2 className="w-4 h-4 text-gray-900" />
//                 </div>
//               </div>
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//               Phone Verification
//             </h2>
//             <p className="text-sm text-white/80">
//               Verify parent's contact to continue
//             </p>
//           </div>

//           {/* Form Card */}
//           <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 p-6 rounded-2xl space-y-5">
//             {/* Contact Number Field */}
//             <div className="space-y-3">
//               <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
//                 <Phone className="w-4 h-4 text-[#c61d23]" />
//                 Contact Number (Parent)
//                 <span className="text-[#c61d23]">*</span>
//               </label>

//               <div className="flex flex-col sm:flex-row gap-2">
//                 <div className="relative flex-1">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <span className="text-gray-600 text-sm font-bold">+91</span>
//                   </div>
//                   <input
//                     type="number"
//                     name="fatherContactNumber"
//                     value={userData?.fatherContactNumber || ""}
//                     onChange={handleChange}
//                     placeholder="10-digit Number"
//                     className="w-full pl-12 pr-3 py-3 text-sm border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white disabled:bg-gray-50 font-medium"
//                     maxLength={10}
//                     inputMode="numeric"
//                     disabled={showCodeBox}
//                   />
//                 </div>

//                 {!showCodeBox && !codeVerified && (
//                   <button
//                     type="button"
//                     onClick={verifyPhoneNo}
//                     disabled={
//                       showReloading ||
//                       !userData?.fatherContactNumber ||
//                       userData.fatherContactNumber.length !== 10
//                     }
//                     className="w-full sm:w-auto whitespace-nowrap px-5 py-3 text-sm rounded-lg bg-gradient-to-r from-[#ffdd00] to-amber-400 hover:from-amber-400 hover:to-[#ffdd00] text-gray-900 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
//                   >
//                     {showReloading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         <span>Sending...</span>
//                       </>
//                     ) : (
//                       <span>Send OTP</span>
//                     )}
//                   </button>
//                 )}

//                 {codeVerified && (
//                   <div className="flex items-center justify-center px-4 py-3 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
//                     <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//                   </div>
//                 )}
//               </div>

//               {errors.fatherContactNumber && (
//                 <div className="flex items-start gap-2 p-2 bg-red-50 border-l-4 border-red-500 rounded">
//                   <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
//                   <p className="text-red-700 text-xs font-medium">
//                     {errors.fatherContactNumber}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* OTP Input */}
//             {showCodeBox && !codeVerified && (
//               <div className="space-y-3">
//                 <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
//                   Verification Code <span className="text-[#c61d23]">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="otp"
//                   name="otp"
//                   value={code}
//                   onChange={handleOTPChange}
//                   placeholder="• • • •"
//                   className="w-full px-3 py-4 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white text-center tracking-[0.5em] font-bold"
//                   maxLength={4}
//                   inputMode="numeric"
//                   autoFocus
//                 />

//                 {/* OTP Progress */}
//                 <div className="flex gap-2 justify-center">
//                   {[...Array(4)].map((_, idx) => (
//                     <div
//                       key={idx}
//                       className={`h-2 flex-1 max-w-14 rounded-full transition-all ${
//                         code.length > idx ? "bg-[#c61d23]" : "bg-gray-200"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={checkVerificationCode}
//                   disabled={!codeEntered}
//                   className="w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span>Verify Code</span>
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             {/* Loading Spinner */}
//             {showReloading && (
//               <div className="flex justify-center items-center py-2">
//                 <Loader2 className="w-6 h-6 animate-spin text-[#c61d23]" />
//               </div>
//             )}

//             {/* Message */}
//             {submitMessage && (
//               <div
//                 className={`text-sm text-center font-semibold p-3 rounded-lg border-2 ${
//                   submitMessage.includes("success") ||
//                   submitMessage.includes("verified")
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                     : "bg-red-50 text-red-700 border-red-200"
//                 }`}
//               >
//                 {submitMessage}
//               </div>
//             )}

//             {/* Submit Button */}
//             {showCodeBox && codeVerified && (
//               <button
//                 type="button"
//                 onClick={onSubmit}
//                 className="w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl"
//               >
//                 <span>Continue</span>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Footer Logo */}
//         <div className="flex justify-center items-center py-6 mt-4">
//           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
//             <img
//               className="w-24 h-auto"
//               src={scholarsDenLogo}
//               alt="Scholars Den Logo"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerificationPage;



import SignupForm from "./SignupForm";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";
import SignupDetailsPage from "./SignupDetailsPage";
import FormHeader from "./FormHeader";



const Signup = () => {
  return (
    <div className="mx-auto max-w-3xl h-screen flex flex-col bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0] overflow-hidden">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          {/* <SignupDetailsPage /> */}
          <FormHeader/>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <SignupForm logoSrc={scholarsDenLogo} />
      </div>
    </div>
  );
};

export default Signup;









