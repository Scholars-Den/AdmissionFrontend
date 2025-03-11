import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { updateUserDetails, submitFormData } from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";
import Spinner from "../../api/Spinner";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import scholarsDenLogo from "../assets/scholarsDenLogo.png";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Define form fields
  const formFields = [
    { name: "studentName", type: "text", placeholder: "*Student Name", required: true },
    { name: "fatherName", type: "text", placeholder: "*Parents Name", required: true },
    { name: "email", type: "email", placeholder: "Email ID", required: false },
    { name: "fatherContactNumber", type: "tel", placeholder: "*Contact no (Parents)", required: true },
  ];

  const selectFields = [
    {
      name: "grade",
      label: "Select Grade",
      options: ["Nursery", "KG", "1st", "2nd", "3rd", "4th", "5th"],
      required: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    formFields.forEach(({ name, required }) => {
      if (required && !userData[name]?.trim()) {
        formErrors[name] = `${name.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const verifyPhoneNo = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/user/sendVerification", {
        mobileNumber: userData.fatherContactNumber,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully");
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const checkVerificationCode = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/user/verifyNumber", {
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
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      if (!codeVerified) {
        return setSubmitMessage("Please Verify Your Phone Number");
      }

      await dispatch(submitFormData(userData));
      navigate("/enquiryform");
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form className="flex flex-col px-12 items-center gap-2 py-2 text-white" onSubmit={onSubmit}>
        <h2 className="text-4xl text-white">Admission Form</h2>

        <div className="flex flex-col w-full gap-4 items-center">
          {formFields.map((field) => (
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

          {selectFields.map((field) => (
            <SelectField
              key={field.name}
              name={field.name}
              value={userData?.[field.name] || ""}
              onChange={handleChange}
              options={field.options}
              error={errors[field.name]}
              label={field.label}
            />
          ))}

          {/* Phone Verification */}
          <div className="flex gap-3 w-2/3">
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="*Verification Code"
              className="border-b-2 border-gray-300 py-2 focus:outline-none w-4/5 bg-[#c61d23] placeholder-white"
            />
            {showCodeBox && (
              <button
                type="button"
                onClick={checkVerificationCode}
                className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
              >
                Verify
              </button>
            )}
          </div>

          {!showCodeBox && !codeVerified && (
            <button
              type="button"
              onClick={verifyPhoneNo}
              className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              Send OTP
            </button>
          )}

          {submitMessage && <p className="text-sm text-[#ffdd00] text-center">{submitMessage}</p>}
        </div>

        <button type="submit" className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mt-4">
          Next
        </button>

        <div className="w-24 mt-4">
          <img src={scholarsDenLogo} alt="Scholars Den Logo" />
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
