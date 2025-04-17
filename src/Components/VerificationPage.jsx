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

    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
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
    }
  };

  const checkVerificationCode = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/admissions/verifyNumber", {
        mobileNumber: userData.fatherContactNumber,
        otp: code,
      });
      if (response.status === 200) {
        setSubmitMessage("Phone number verified successfully!");
        setCodeVerified(true);
        setShowCodeBox(false);
      }
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onSubmit = async (e) => {
    console.log("onsUBMIT click");
    e.preventDefault();
    if (!validateForm()) return;
    console.log("userData in onSumit ", userData);
    try {
      dispatch(setLoading(true));
      if (!codeVerified) {
        return setSubmitMessage("Please Verify Your Phone Number");
      }
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
      <div className="flex-grow">
        <SignupDetailsPage />
      </div>
      <div className="flex-grow text-center w-full flex flex-col  items-center">
        {loading && <Spinner />}
        <form
          className="bg-white/10 backdrop-blur-md shadow-lg p-6 rounded-xl max-w-2xl  space-y-6 text-white"
          onSubmit={onSubmit}
        >
          <h2 className="text-center text-2xl md:text-3xl font-semibold">
            Phone Number Verification
          </h2>

          {/* <h2 className="text-4xl text-white">Admission Form</h2> */}

          <div className="flex flex-col justify-center w-full  gap-4 items-center">
            {formFields?.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                value={userData?.[field.name] || ""}
                onChange={handleChange}
                error={errors[field.name]}
                type={field.type}
                placeholder={field.placeholder}
              />
            ))}

            {/* Phone Verification */}
            {showCodeBox && (
              <div className="flex gap-3 w-full">
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="*Verification Code"
                  className="border-b-2 border-gray-300 py-2 focus:outline-none w-4/5 bg-[#c61d23] placeholder-white"
                />
                <button
                  type="button"
                  onClick={checkVerificationCode}
                  className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  Verify
                </button>
              </div>
            )}

            {!showCodeBox && !codeVerified && (
              <button
                type="button"
                onClick={verifyPhoneNo}
                className="px-4 py-2 border-2 text-white   rounded-full"
              >
                Send OTP
              </button>
            )}

            {submitMessage && (
              <p className="text-sm text-[#ffdd00] text-center">
                {submitMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-2/5 py-2 border-2 rounded-full text-white hover:bg-[#ffdd00] hover:text-black mt-2"
          >
            Next
          </button>
        </form>
      </div>
      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default VerificationPage;
