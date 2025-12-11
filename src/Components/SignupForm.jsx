// SignupForm Component (similar to SignupRight but with VerificationPage logic)

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { updateUserDetails, submitFormData } from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";
import { fetchAlreadyExistingStudent, updateAlreadyExistStudent } from "../../redux/alreadyExistStudentSlice";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";
import {
  Phone,
  Shield,
  CheckCircle2,
  Loader2,
  ChevronRight,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

const SignupForm = ({ logoSrc }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, message } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

  // State management
  const [codeVerified, setCodeVerified] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [showReloading, setShowReloading] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [cooldownActive, setCooldownActive] = useState(false);

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    fatherContactNumber: "",
  });
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Clear cookies on mount
  useEffect(() => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("userData", userData);
  }, []);

  // Cooldown timer
  useEffect(() => {
    let timer;
    if (cooldownActive && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setCooldownActive(false);
    }
    return () => clearInterval(timer);
  }, [cooldownActive, resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fatherContactNumber" && value.length > 10) return;

    dispatch(updateUserDetails({ [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!userData?.fatherContactNumber) {
      formErrors.fatherContactNumber = "Contact Number is required";
      isValid = false;
    }

    if (
      userData?.fatherContactNumber &&
      userData.fatherContactNumber.length !== 10
    ) {
      formErrors.fatherContactNumber =
        "Contact Number must be exactly 10 digits";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Send OTP
  const verifyPhoneNo = async () => {
    if (userData?.fatherContactNumber?.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fatherContactNumber: "The length must be exactly 10 digits",
      }));
      return;
    }

    if (cooldownActive) return;

    try {
      setShowReloading(true);
      setSubmitMessage("");

      dispatch(setLoading(true));
      const response = await axios.post("/admissions/sendVerification", {
        mobileNumber: userData.fatherContactNumber,
      });

      if (response.status === 200) {
        setShowCodeBox(true);
        setCodeVerified(false);
        setSubmitMessage("OTP sent successfully!");

        const nextCooldown = 30 * Math.pow(2, resendAttempts);
        setResendCooldown(nextCooldown);
        setCooldownActive(true);
        setResendAttempts((prev) => prev + 1);
      }
    } catch (error) {
      console.log("error", error);
      setSubmitMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      dispatch(setLoading(false));
      setShowReloading(false);
      setCode("");
    }
  };

  // Verify OTP
  const checkVerificationCode = async () => {
    try {
      console.log("Verifying OTP for:", userData.fatherContactNumber);

      const response = await axios.post("/admissions/verifyNumber", {
        mobileNumber: userData.fatherContactNumber,
        otp: code,
      });

      console.log("OTP verification response:", response);

      if (response.status === 200) {
        setCodeVerified(true);
        setShowCodeBox(false);
        setSubmitMessage("Phone number verified successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP verification failed:", error);
      setSubmitMessage(
        error.response?.data?.message || "Error verifying phone number"
      );
      return false;
    }
  };

  // Form submission
  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     console.log("Form validation failed");
  //     return;
  //   }

  //   try {
  //     setIsSubmittingForm(true);
  //     setSubmitMessage("");

  //     // Check OTP if code box is shown and not yet verified
  //     if (showCodeBox && !codeVerified) {
  //       if (!code || code.length < 4) {
  //         setSubmitMessage("Please enter the 4-digit OTP");
  //         setIsSubmittingForm(false);
  //         return;
  //       }

  //       const otpVerified = await checkVerificationCode();

  //       console.log("otpVerified ", otpVerified);

  //       if (!otpVerified) {
  //         setCodeVerified(false);
  //         setCodeEntered(false);
  //         setSubmitMessage("Invalid OTP. Please try again.");
  //         setCode("");
  //         setIsSubmittingForm(false);
  //         return;
  //       }
  //     }

  //     console.log("Submitting form with userData:", userData);

  //     dispatch(setLoading(true));
  //     const resultAction = await dispatch(submitFormData(userData));

  //     // Check if the action was successful
  //     if (submitFormData.fulfilled.match(resultAction)) {
  //       const { message } = resultAction.payload;

  //       console.log("message from verification page:", message);
  //       console.log("userData from verification page:", userData);

  //       if (message) {
  //         console.log("Student already exists, redirecting...");
  //         navigate("/alreadyExist");
  //       } else {
  //         console.log("New student, redirecting to basic details...");
  //         navigate("/basicDetails");
  //       }
  //     } else {
  //       console.error("Form submission failed:", resultAction.payload);
  //     }

  //     // Additional check if cookie exists
  //     if (document.cookie) {
  //       const alreadyExistStudent = await axios.post(
  //         "/user/getStudentByPhone",
  //         { fatherContactNumber: userData.fatherContactNumber }
  //       );

  //       console.log("Existing student check:", alreadyExistStudent);

  //       if (
  //         alreadyExistStudent.data.data &&
  //         alreadyExistStudent.data.data.length > 0
  //       ) {
  //         const data = await dispatch(
  //           updateAlreadyExistStudent(alreadyExistStudent.data.data)
  //         );

  //         console.log("data from onSubmmit", data);
  //         navigate("/alreadyExist");
  //       } else {
  //         navigate("/basicDetails");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     let errorMsg = "Registration failed. Please try again.";

  //     if (error.response?.data?.message) {
  //       errorMsg = error.response.data.message;
  //     } else if (error.message) {
  //       errorMsg = error.message;
  //     }

  //     setSubmitMessage(errorMsg);
  //   } finally {
  //     dispatch(setLoading(false));
  //     setIsSubmittingForm(false);
  //   }
  // };


//   const onSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) {
//     console.log("Form validation failed");
//     return;
//   }
  
//   try {
//     setIsSubmittingForm(true);
//     setSubmitMessage("");
    
//     // Check OTP if code box is shown and not yet verified
//     if (showCodeBox && !codeVerified) {
//       if (!code || code.length < 4) {
//         setSubmitMessage("Please enter the 4-digit OTP");
//         setIsSubmittingForm(false);
//         return;
//       }
      
//       const otpVerified = await checkVerificationCode();
//       console.log("otpVerified ", otpVerified);
      
//       if (!otpVerified) {
//         setCodeVerified(false);
//         setCodeEntered(false);
//         setSubmitMessage("Invalid OTP. Please try again.");
//         setCode("");
//         setIsSubmittingForm(false);
//         return;
//       }
//     }
    
//     console.log("Submitting form with userData:", userData);
//     dispatch(setLoading(true));
    
//     const resultAction = await dispatch(submitFormData(userData));
    
//     // Check if the action was successful
//     if (submitFormData.fulfilled.match(resultAction)) {
//       const { message } = resultAction.payload;
//       console.log("message from verification page:", message);
//       console.log("userData from verification page:", userData);
      
//       if (message) {
//         console.log("Student already exists, redirecting...");
//         navigate("/alreadyExist");
//       } else {
//         console.log("New student, redirecting to basic details...");
//         navigate("/basicDetails");
//       }
//     } else {
//       console.error("Form submission failed:", resultAction.payload);
//       // Handle the error case properly
//       throw new Error(resultAction.payload || "Form submission failed");
//     }
    
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     let errorMsg = "Registration failed. Please try again.";
    
//     if (error.response?.data?.message) {
//       errorMsg = error.response.data.message;
//     } else if (error.message) {
//       errorMsg = error.message;
//     }
    
//     setSubmitMessage(errorMsg);
//   } finally {
//     dispatch(setLoading(false));
//     setIsSubmittingForm(false);
//   }
// };




// const onSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) {
//     console.log("Form validation failed");
//     return;
//   }
  
//   try {
//     setIsSubmittingForm(true);
//     setSubmitMessage("");
    
//     // Check OTP if code box is shown and not yet verified
//     if (showCodeBox && !codeVerified) {
//       if (!code || code.length < 4) {
//         setSubmitMessage("Please enter the 4-digit OTP");
//         setIsSubmittingForm(false);
//         return;
//       }
      
//       const otpVerified = await checkVerificationCode();
//       console.log("otpVerified ", otpVerified);
      
//       if (!otpVerified) {
//         setCodeVerified(false);
//         setCodeEntered(false);
//         setSubmitMessage("Invalid OTP. Please try again.");
//         setCode("");
//         setIsSubmittingForm(false);
//         return;
//       }
//     }
    
//     console.log("Submitting form with userData:", userData);
//     dispatch(setLoading(true));
    
//     const resultAction = await dispatch(submitFormData(userData));
    
//     // Check if the action was successful
//     if (submitFormData.fulfilled.match(resultAction)) {
//       const { message, token } = resultAction.payload;
//       console.log("message from verification page:", message);
//       console.log("userData from verification page:", userData);
      
//       // Store token in cookie
//       if (token) {
//         document.cookie = `token=${token}; path=/`;
//       }
      
//       if (message) {
//         console.log("Student already exists, fetching data before redirect...");
        
//         // Get the contact number
//         const number =  userData?.fatherContactNumber || userData?.studentContactNumber;
        
//         // Fetch existing student data and wait for it to complete
//         const fetchResult = await dispatch(fetchAlreadyExistingStudent(number)).unwrap();
//         console.log("Fetched existing students:", fetchResult);
        
//         // Store userData in Redux to ensure it's available after navigation
//         dispatch(updateUserDetails({
//           ...userData,
//           fatherContactNumber: number
//         }));
        
//         // Now navigate with data already loaded
//         navigate("/alreadyExist");
//       } else {
//         console.log("New student, redirecting to basic details...");
//         navigate("/basicDetails");
//       }
//     } else {
//       console.error("Form submission failed:", resultAction.payload);
//       throw new Error(resultAction.payload || "Form submission failed");
//     }
    
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     let errorMsg = "Registration failed. Please try again.";
    
//     if (error.response?.data?.message) {
//       errorMsg = error.response.data.message;
//     } else if (error.message) {
//       errorMsg = error.message;
//     }
    
//     setSubmitMessage(errorMsg);
//   } finally {
//     dispatch(setLoading(false));
//     setIsSubmittingForm(false);
//   }
// };



const onSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    console.log("Form validation failed");
    return;
  }
  
  try {
    setIsSubmittingForm(true);
    setSubmitMessage("");
    
    // Check OTP if code box is shown and not yet verified
    if (showCodeBox && !codeVerified) {
      if (!code || code.length < 4) {
        setSubmitMessage("Please enter the 4-digit OTP");
        setIsSubmittingForm(false);
        return;
      }
      
      // const otpVerified = await checkVerificationCode();
      const otpVerified = true;
      console.log("otpVerified ", otpVerified);
      
      if (!otpVerified) {
        setCodeVerified(false);
        setCodeEntered(false);
        setSubmitMessage("Invalid OTP. Please try again.");
        setCode("");
        setIsSubmittingForm(false);
        return;
      }
    }
    
    console.log("Submitting form with userData:", userData);
    dispatch(setLoading(true));
    
    const resultAction = await dispatch(submitFormData(userData));
    
    // Check if the action was successful
    if (submitFormData.fulfilled.match(resultAction)) {
      const { message, token, data } = resultAction.payload;
      console.log("message from verification page:", message);
      console.log("userData from verification page:", userData);
      console.log("data from resultAction:", data);
      
      // Store token in cookie
    
      
      if (message && message.includes("Already Exist")) {
        console.log("Student already exists, handling existing student data...");
        
        // Get the contact number
        const number = userData.fatherContactNumber || userData.studentContactNumber;
        
        // Update userData in Redux
        dispatch(updateUserDetails({
          ...userData,
          fatherContactNumber: number
        }));
        
        // If data is already returned from submitFormData, use it
        if (data && Array.isArray(data) && data.length > 0) {
          console.log("Using existing student data from response:", data);
          dispatch(updateAlreadyExistStudent(data));
        } else {
          // Otherwise fetch it
          console.log("Fetching existing student data...");
          try {
            await dispatch(fetchAlreadyExistingStudent(number)).unwrap();
          } catch (fetchError) {
            console.error("Error fetching existing students:", fetchError);
            // Continue to navigation even if fetch fails
          }
        }
        
        // Navigate to already exist page
        navigate("/alreadyExist");
      } else {
        console.log("New student, redirecting to basic details...");
        navigate("/basicDetails");
      }
    } else {
      console.error("Form submission failed:", resultAction.payload);
      throw new Error(resultAction.payload || "Form submission failed");
    }
    
  } catch (error) {
    console.error("Error submitting form:", error);
    let errorMsg = "Registration failed. Please try again.";
    
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    setSubmitMessage(errorMsg);
  } finally {
    dispatch(setLoading(false));
    setIsSubmittingForm(false);
  }
};








  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCode(value);
    }

    if (value.length === 4) {
      setCodeEntered(true);
      setSubmitMessage("");
    } else {
      setCodeEntered(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center px-4 py-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Branding Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative pt-5">
              <div className="w-48 h-20 sm:w-48 sm:h-20 rounded-2xl shadow-xl border-4 border-[#ffdd00]/40 flex items-center justify-center bg-[#c61d23] p-2">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt="Scholar's Den"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <GraduationCap className="w-full h-full text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ffdd00] to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Phone Number Verification
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Verify contact to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4">
          {/* Contact Number Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">
              <Phone className="w-4 h-4 text-[#c61d23]" />
              Contact No. (Parent)<span className="text-[#c61d23]">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-600 text-sm font-bold">+91</span>
                </div>
                <input
                  type="number"
                  name="fatherContactNumber"
                  value={userData?.fatherContactNumber || ""}
                  onChange={handleChange}
                  placeholder="10-digit Number"
                  className="w-full pl-12 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white disabled:bg-gray-50 font-medium"
                  maxLength={10}
                  disabled={showCodeBox || isSubmittingForm}
                  inputMode="numeric"
                />
              </div>

              {/* {!showCodeBox && !codeVerified && (
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  disabled={
                    showReloading ||
                    isSubmittingForm ||
                    !userData?.fatherContactNumber ||
                    userData.fatherContactNumber.length !== 10
                  }
                  className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {showReloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              )}

              {codeVerified && (
                <div className="flex items-center justify-center px-4 py-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              )} */}
            </div>

            {errors?.fatherContactNumber && (
              <div className="flex items-start gap-1.5 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-xs font-medium">
                  {errors.fatherContactNumber}
                </p>
              </div>
            )}
          </div>
          {/* OTP Input */}
          {/* {showCodeBox && !codeVerified && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900">
                Verification Code <span className="text-[#c61d23]">*</span>
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={code}
                onChange={handleOTPChange}
                placeholder="• • • •"
                className="w-full px-3 py-3 text-2xl border-2 border-gray-200 rounded-lg focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/20 transition-all outline-none bg-white text-center tracking-[0.5em] font-bold"
                maxLength={4}
                disabled={isSubmittingForm}
                inputMode="numeric"
                autoFocus
              />

              <div className="flex gap-1.5 justify-center">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 max-w-12 rounded-full transition-all ${
                      code.length > idx ? "bg-[#c61d23]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )} */}
          {/* Loading Spinner */}
          {showReloading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#c61d23]"></div>
            </div>
          )}
          {/* Submit Message */}
          {submitMessage && (
            <div
              className={`text-xs sm:text-sm text-center font-semibold p-3 rounded-lg border-2 ${
                submitMessage.includes("success") ||
                submitMessage.includes("verified")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {submitMessage}
            </div>
          )}
          {/* Submit Button */}
          {/* {showCodeBox && ( */}
          <button
            type="button"
            onClick={onSubmit}
            // disabled={isSubmittingForm || !codeEntered}
            // className={`w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${
            //   isSubmittingForm || !codeEntered
            //     ? "bg-gray-300 cursor-not-allowed text-gray-600"
            //     : "bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl"
            // }`}
            className={`w-full font-bold py-3 rounded-lg transition-all text-sm shadow-lg flex items-center justify-center gap-2 
                  bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white hover:shadow-xl
              `}
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
          {/* )} */}
          {/* Resend OTP */}
          {showCodeBox && !codeVerified && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-xs text-gray-600">Didn't receive code?</p>
              <button
                type="button"
                onClick={verifyPhoneNo}
                disabled={cooldownActive || isSubmittingForm}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                  cooldownActive || isSubmittingForm
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#ffdd00] hover:bg-amber-400 text-gray-900"
                }`}
              >
                {cooldownActive ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{resendCooldown}s</span>
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-4">
          <p className="text-xs text-gray-600">
            Need help?{" "}
            <a
              href="/contact"
              className="text-[#c61d23] hover:text-[#a01818] font-bold hover:underline cursor-pointer transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default SignupForm;








