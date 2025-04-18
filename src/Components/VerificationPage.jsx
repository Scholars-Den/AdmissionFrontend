import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { updateUserDetails, submitFormData } from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";
import Spinner from "../../api/Spinner";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";

import {
  validateAadhaar,
  validateName,
  validatePhoneNo,
} from "../../utils/validation/inputValidation";
import SignupDetailsPage from "./SignupDetailsPage";

const VerificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);
  const [showReloading, setShowReloading] = useState(false);

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  // const [codeVerified, setCodeVerified] = useState(true);
  const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Aadhar example: 835824268440

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fatherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    dispatch(updateUserDetails({ [name]: value }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  // Define form fields
  const formFields = [
    {
      name: "fatherContactNumber",
      type: "number",
      placeholder: "Enter Your Contact Number",
      required: true,
      validation: validatePhoneNo,
    },
  ];

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    formFields.forEach(({ name, required, validation }) => {
      console.log("userData[name]", validation(userData[name]));

      const isValidInput = validation(userData[name]);
      console.log("isValidInput", isValidInput);
      if (required && !isValidInput.isValid) {
        formErrors[name] = isValidInput.message;
        console.log("formErrors[name]", formErrors[name]);
        isValid = false;
      }
    });

    console.log("formErrors", formErrors);
    setErrors(formErrors);
    return isValid;
  };

  const verifyPhoneNo = async () => {
    try {
      if (userData?.fatherContactNumber.length != 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          fatherContactNumber: `The length must be exactly 10.`,
        }));
        return;
      }

      setShowReloading(true);

      dispatch(setLoading(true));
      const response = await axios.post("/admissions/sendVerification", {
        mobileNumber: userData.fatherContactNumber,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully");
      }
    } catch (error) {
      console.log("error", error);
      setSubmitMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      dispatch(setLoading(false));
      setShowReloading(false);
    }
  };

  // const checkVerificationCode = async () => {
  //   try {
  //     dispatch(setLoading(true));
  //     const response = await axios.post("/admissions/verifyNumber", {
  //       mobileNumber: userData.fatherContactNumber,
  //       otp: code,
  //     });
  //     if (response.status === 200) {
  //       setSubmitMessage("Phone number verified successfully!");
  //       setCodeVerified(true);
  //       setShowCodeBox(false);
  //     }
  //   } catch (error) {
  //     setSubmitMessage("Error verifying phone number");
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };




  const checkVerificationCode = async () => {
    try {
      const response = await axios.post("/admissions/verifyNumber", {
        mobileNumber: userData.fatherContactNumber,
        otp: code,
      });
      if (response.status === 200) {
        // setSubmitMessage("Phone number verified successfully!");

        console.log("ITs working ,,,,,,,,,,,,,");
        setCodeVerified(true);
        setShowCodeBox(false);
      }
      console.log("ITs working ,,,,,,,,,,,,,");

      console.log("codeVerified form checkVerification", codeVerified);
      // setCodeVerified(true);
      // setShowCodeBox(false);
      return true;
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
      console.log("Error verifying phone number", error);
      return false;
    }
  };



  const onSubmit = async (e) => {
    console.log("onsUBMIT click");
    e.preventDefault();
    let codeChecked = await checkVerificationCode();

    console.log("codeChecked", codeChecked);
    if (codeChecked === false) {
      setShowCodeBox(false);

      // Remove OTP
      setCodeVerified(false);
      setSubmitMessage("Please Verify Your Phone Number");
      // setIsSubmittingForm(false); // ⬅️ reset if verification fails
      return;
    }

    if (!validateForm()) return;

    console.log("userData in onSumit ", userData);
    try {
      dispatch(setLoading(true));
    
      console.log("userData in onSumit ", userData);

      await dispatch(submitFormData(userData));
      if (document.cookie) {
        navigate("/basicDetails");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col  bg-[#c61d23]">
      <div className="mb-5">
        <SignupDetailsPage />
      </div>

      <div className=" flex-grow w-full bg-[#c61d23] flex flex-col items-center justify-between   px-4 py-1">
        {/* {loading && <Spinner />} */}
        <form
          onSubmit={onSubmit}
          className="bg-white/10 backdrop-blur-md shadow-lg p-6 rounded-xl w-full max-w-lg space-y-6 text-white"
        >
          <h2 className="text-center text-2xl md:text-3xl font-semibold">
            Phone Number Verification
          </h2>
                                                                                                 
          {/* Phone Field */}
          <div className="space-y-4">
            <label
              htmlFor="fatherContactNumber"
              className="block text-sm font-medium"
            >
              *Contact Number (Parent)
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="number"
                name="fatherContactNumber"
                value={userData.fatherContactNumber || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="border-b-2 py-2 focus:outline-none w-full p-4  "
                style={{ backgroundColor: "#c61d23" }}
                maxLength={10}
                inputMode="numeric"
              />
              {!showCodeBox && !codeVerified && (
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Send OTP
                </button>
              )}
            </div>
            {errors.fatherContactNumber && (
              <p className="text-[#ffdd00] mt-1">
                {errors.fatherContactNumber}
              </p>
            )}
          </div>

          {/* OTP Field */}
          {showCodeBox && (
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium">
                *Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter OTP"
                className="w-full bg-white/5 text-white border border-white px-4 py-2 focus:outline-none placeholder-gray-400"
              />
              {/* <button
              type="button"
              onClick={checkVerificationCode}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
            >
              Verify
            </button> */}
            </div>
          )}
          {showReloading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {/* Submit Message */}
          {submitMessage && (
            <p className="text-sm text-center text-[#ffdd00]">
              {submitMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl transition-all"
          >
            Next
          </button>
        </form>
      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
      </div>

    </div>
  );
};

export default VerificationPage;
