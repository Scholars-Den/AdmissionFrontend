
// import scholarsDenLogo from "../assets/scholarsdenLogo.png";
// import SignupDetailsPage from "./SignupDetailsPage";
// import SuccessContent from "./SuccessContent";

// const FormSubmitted = () => {
  

//   return (
//     <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
//       <div className="flex-grow">
//         <SignupDetailsPage />
//       </div>

//       <div className="flex-grow">
//        <SuccessContent/>
//       </div>
//       <div className="flex justify-center items-center py-4">
//         <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
//       </div>
//     </div>
//   );
// };

// export default FormSubmitted;









import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, updateUserDetails } from "../../redux/formDataSlice";
import axios from "../../api/axios";
import {
  CheckCircle2,
  FileText,
  Home,
  PartyPopper,
  Sparkles,
} from "lucide-react";

const SuccessContent = () => {
  const navigate = useNavigate();
  const [tokenNumber, setTokenNumber] = useState("");
  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const [time, setTime] = useState(3);
  const userdata = {};

  const clickHandler = async () => {
    await dispatch(updateUserDetails(userdata));
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    console.log("userData from useEffect", userData);
  }, [userData]);

  return (
    <div className="min-h-screen w-full max-w-[768px] mx-auto bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none max-w-[768px] mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#ffdd00]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tr from-[#c61d23]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Icon Animation */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-4 sm:p-6 shadow-2xl">
            <CheckCircle2 size={48} className="text-white sm:w-16 sm:h-16" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles size={24} className="text-[#ffdd00] animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles size={20} className="text-[#c61d23] animate-bounce delay-150" />
          </div>
        </div>

        {/* Success Card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-gray-100 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-6 sm:px-8 py-6 sm:py-8 border-b-2 border-emerald-200">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Submission Successful! 🎉
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Your admission form has been received
            </p>
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            {/* Success Message */}
            <div className="bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#c61d23] to-[#a01818] rounded-full flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Form Submitted Successfully
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Thank you for completing your admission form. Your application
                    is now being processed.
                  </p>
                </div>
              </div>

              {/* Acknowledgement Number */}
              {userData?.acknowledgementNumber && (
                <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#c61d23]/20 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Acknowledgement Number
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                        {userData.acknowledgementNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(userData.acknowledgementNumber);
                      }}
                      className="self-start sm:self-center px-4 py-2 text-xs sm:text-sm font-semibold text-[#c61d23] bg-[#c61d23]/5 hover:bg-[#c61d23]/10 rounded-lg transition-all duration-200 border border-[#c61d23]/20"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Enrollment Number (if available) */}
              {userData?.enrollmentNumber && (
                <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#ffdd00]/30 shadow-sm mt-4">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Enrollment Number
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userData.enrollmentNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
              <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  i
                </span>
                Important Information
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Please save your acknowledgement number for future reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>You will receive updates via email and SMS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Check your application status using the acknowledgement number</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={clickHandler}
              className="w-full group relative px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-red-500/30 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
            >
              <Home size={20} />
              <span>Return to Home</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#c61d23] to-[#a01818] opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-xs sm:text-sm text-gray-500">
            For any queries, please contact our admission office
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessContent;