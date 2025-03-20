import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  const [codeVerified, setCodeVerified] = useState(true);
  // const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});




  // Aadhar example: 1234 5678 9012




  useEffect(()=>{
    console.log("userData", userData);
  },[userData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    if(name === "termsAndCondition"){

      console.log("e.target.checked", e.target.checked);

      dispatch(updateUserDetails({ [e.target.name]: e.target.checked}));
      return;
    }

    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Define form fields
  const formFields = [
    {
      name: "studentName",
      type: "text",
      placeholder: "*Student Name",
      required: true,
    },
    {
      name: "aadharID",
      type: "text",
      placeholder: "*Aadher ID",
      required: true,
    },
    // { name: "email", type: "email", placeholder: "Email ID", required: false },
    {
      name: "studentContactNumber",
      type: "tel",
      placeholder: "Enter Your Contact Number",
      required: true,
    },
    
  ];

  const selectFields = [
    // {
    //   name: "grade",
    //   label: "Select Grade",
    //   options: ["Nursery", "KG", "1st", "2nd", "3rd", "4th", "5th"],
    //   required: true,
    // },

    {
      name: "gender",
      label: "Select Gender",
      options: ["Male", "Female", "Other"],
      value: userData.gender,
      onChange: { handleChange },
      error: errors.gender,
    },

    {
      name: "category",
      label: "Select Category",
      options: ["General", "OBC", "SC", "ST", "ETS"],
      value: userData.category,
      onChange: {handleChange},
      error: errors.category
      
    },
  ];







  function validateAadhaar(aadhaarNumber) {
    // Check if the Aadhaar number is exactly 12 digits long and contains only numbers
    const aadhaarRegex = /^\d{12}$/;
    
    if (!aadhaarRegex.test(aadhaarNumber)) {
        return { isValid: false, message: "Aadhaar number must be 12 digits long and contain only numbers." };
    }
    
    // Optional: You can include a checksum validation like Luhn Algorithm for basic checks
    if (!luhnCheck(aadhaarNumber)) {
        return { isValid: false, message: "Aadhaar number failed checksum validation." };
    }
    
    return true;
}

// Optional: Luhn Algorithm for basic checksum validation
function luhnCheck(number) {
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through the digits from right to left
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9; // Sum of digits of the product
            }
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    // If the sum modulo 10 is 0, then it's valid
    return (sum % 10 === 0);
}




  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    formFields.forEach(({ name, required }) => {
      if (required && !userData[name]?.trim()) {
        formErrors[name] = `${name.replace(/([A-Z])/g, "$1")} is required`;
        isValid = false;
      }
    });

    if(userData.studentContactNumber && !/^\d{10}$/.test(userData.studentContactNumber)){
      formErrors.studentContactNumber = "Contact number must be 10 digits";
      isValid = false;
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    // if(userData.aadharID && validateAadhaar(userData.aadharID)){
    if(userData.aadharID && !validateAadhaar(userData.aadharID)){
      formErrors.aadharID = "Aadhar Id must be valid";
      isValid = false;
    }
console.log("userData.termsAndCondition",userData.termsAndCondition);
    if(!userData.termsAndCondition){
      formErrors.termsAndCondition = "Please accept terms and conditions";
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
      console.log("userData in onSumit ", userData);


      await dispatch(submitFormData(userData));
      navigate("/familyDetails")
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form className="flex flex-col px-4 items-center gap-2 py-2 text-white" onSubmit={onSubmit}>
        <h2 className="text-4xl text-white">Admission Form</h2>

      

        <div className="flex flex-col w-full md:w-2/3 gap-4 items-center">
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

          {selectFields?.map((field) => (
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

            
            
        

       

          {/* Phone Verification */}
          {/* <div className="flex gap-3 w-2/3">
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
          </div> */}

          {!showCodeBox && !codeVerified && (
            <button
              type="button"
              onClick={verifyPhoneNo}
              className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              Send OTP
            </button>
          )}

          {submitMessage && (
            <p className="text-sm text-[#ffdd00] text-center">
              {submitMessage}
            </p>
          )}

        <button
          type="submit"
          className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mt-4"
        >
          Next
        </button>
        <div className="flex gap-1 justify-center items-center">
        <input 
  type="checkbox"
  name="termsAndCondition"
  value={Boolean(userData?.termsAndCondition)}
  checked={Boolean(userData?.termsAndCondition)} // Ensure it's a boolean
  onChange={handleChange}
  className="cursor-pointer"
/>
      <label className="p-1">
        I agree to <Link to="/termsAndConditions" className="text-[#ffdd00] underline">Terms & Conditions</Link>
      </label>
    </div>
      {errors.termsAndCondition && <span className="text-white text-sm mt-1">{errors.termsAndCondition}</span>}

      </form>
        {/* <div className="w-24">
          <img src={scholarsDenLogo} alt="Scholars Den Logo" />
        </div> */}
    </div>
  );
};

export default SignupForm;
