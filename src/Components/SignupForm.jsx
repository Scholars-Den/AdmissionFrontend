import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import scholarsDenLogo from "../assets/scholarsDenLogo.png";
import {
  fetchUserDetails,
  submitFormData,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loadingSlice";
import Spinner from "../../api/Spinner";
import InputField from "../../utils/InputField";
// import ScholarsDenLogo from "../assets/scholarsDenLogo.png";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const { userData, dataExist, error } = useSelector(
    (state) => state.userDetails
  );

  const { loading } = useSelector((state) => state.loadingDetails);

  const [submitMessage, setSubmitMessage] = useState("");

  const phoneRegex = /^\+91[0-9]{10}$/;
  // const [codeVerified, setCodeVerified] = useState(true);
  const [codeVerified, setCodeVerified] = useState(false);

  // State hooks
  const [errors, setErrors] = useState({
    studentName: "",
    fatherContactNumber: "",
    fatherName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  useEffect(() => {
    console.log("userData from useEffect", userData);
  }, [userData]);

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Field validation
    ["studentName", "fatherContactNumber", "fatherName"].forEach((field) => {
      if (!userData[field]?.trim()) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        formErrors[field] = `${formattedField} is required`;
        isValid = false;
      }
    });

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    if (!phoneRegex.test(`+91${userData.fatherContactNumber}`)) {
      formErrors.fatherContactNumber =
        "fatherContactNumber must be a valid 10-digit number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // useEffect(() => {
  //   dispatch(fetchUserDetails());
  // }, []);

  // useEffect(() => {
  //   console.log("error in useEffect", error);
  // }, [error]);

  // useEffect(() => {
  //   if (document.cookie !== "") {
  //     navigate("/enquiryform");
  //   }
  // }, [dataExist, userData]);

  const verifyPhoneNo = async () => {
    try {
      dispatch(setLoading(true));
      // setShowCodeBox(true);

      const response = await axios.post("/user/sendVerification", {
        mobileNumber: `${userData.fatherContactNumber}`,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully"); // Update the message to "OTP sent successfully" in the set
      }
    } catch (error) {
      console.log("Error message", error);
      setSubmitMessage(`${error.response.data.message}`);
    } finally {
      dispatch(setLoading(false));
      // setShowCodeBox(true);
    }
  };

  const checkVerificationCode = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/user/verifyNumber", {
        mobileNumber: `${userData.fatherContactNumber}`,
        otp: code,
      });
      console.log("response from checkVerificationCode", response);
      if (response.status === 200) {
        setSubmitMessage("fatherContactNumber number verified successfully!");
        setCodeVerified(true);
        setShowCodeBox(false);
        return true;
      }
      // setCodeVerified(true);
      // setShowCodeBox(false);
      // return true;
    } catch (error) {
      console.log("Error messagefor checkVerificationCode", error);
      setSubmitMessage("Error verifying fatherContactNumber number");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let codeChecked = await checkVerificationCode();

      console.log("codeChecked", codeChecked);
      dispatch(setLoading(true));
      setSubmitMessage("");
      console.log("Button Clicked");
      if (codeChecked === false) {
        setShowCodeBox(false);
        setCodeVerified(false);
        return setSubmitMessage("Please Verify Your Phone Number");
      }

      // if (validateForm() && codeChecked === true) {
      if (validateForm()) {
        await dispatch(submitFormData(userData));

        if (document.cookie !== "") {
          navigate("/enquiryform");
        }

        console.log("userData for onSubmit", userData);
        console.log("dataExist for onSubmit", dataExist);
      }
    } catch (error) {
      console.log("error from onSubmit", error);
    } finally {
      await dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form
        className="flex flex-col justify-center px-12 items-center gap-2 py-2 text-white "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-4xl text-white ">Admission Form</h2>
        </div>

        {/* Name Field */}
        <div className="flex flex-col justify-center items-center w-full gap-4">
          <div className="flex flex-col items-center w-2/3 appearance-none">
            <InputField
              name="studentName"
              value={userData?.studentName}
              onChange={handleChange}
              error={errors.studentName}
              type="text"
              placeholder="*Student Name"
            />
            <div className="w-full">
              <input
                autoComplete="off"
                type="text"
                id="studentName"
                name="studentName"
                value={userData?.studentName || ""}
                onChange={handleChange}
                placeholder="*Student Name"
                className="border-b-2 border-gray-300  py-2 focus:outline-none w-full p-1 placeholder-white "
                style={{ backgroundColor: "#c61d23" }}
              />
              {errors.studentName && (
                <p className="text-white text-xs">{errors.studentName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center w-2/3 appearance-none">
            <div className="w-full">
              <div className="flex-1 flex flex-col">
                <input
                  autoComplete="off"
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={userData?.fatherName || ""}
                  onChange={handleChange}
                  placeholder="*Parents Name"
                  className="border-b-2 border-gray-300  py-2 focus:outline-none w-full p-1 placeholder-white"
                  style={{ backgroundColor: "#c61d23" }}
                />
                {errors.fatherName && (
                  <p className="text-white text-xs mt-1">{errors.fatherName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col items-center w-2/3 appearance-none">
            <div className="w-full">
              <input
                autoComplete="off"
                type="email"
                id="email"
                name="email"
                value={userData?.email || ""}
                onChange={handleChange}
                placeholder="Email ID"
                className="border-b-2 border-gray-300  py-2 focus:outline-none w-full p-1 placeholder-white"
                style={{ backgroundColor: "#c61d23" }}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex gap-3 flex-col w-2/3">
            <div className="flex-1 flex justify-center items-center w-full">
              <input
                autoComplete="off"
                type="tel"
                id="phone"
                name="fatherContactNumber"
                value={userData?.fatherContactNumber || ""}
                onChange={handleChange}
                placeholder="*Contact no (Parents)"
                className="border-b-2 border-gray-300 py-2 focus:outline-none flex-1 my-auto placeholder-white"
                style={{ backgroundColor: "#c61d23" }}
              />
              {!showCodeBox && !codeVerified && (
                <div className="flex">
                  <button
                    type="button"
                    onClick={verifyPhoneNo}
                    className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                    style={{ backgroundColor: "#c61d23" }}
                  >
                    Send OTP
                  </button>
                </div>
              )}
            </div>
            {errors.fatherContactNumber && (
              <p className="text-white text-xs mt-1">
                {errors.fatherContactNumber}
              </p>
            )}
          </div>

          <div className="flex gap-3   justify-center w-2/3">
            <div className="flex-1 flex flex-col">
              <input
                autoComplete="off"
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="*Verification Code"
                className="border-b-2 border-gray-300  py-2 focus:outline-none w-4/5 placeholder-white"
                style={{ backgroundColor: "#c61d23" }}
              />
              {/* <button
                    type="button"
                    onClick={checkVerificationCode}
                    className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                    style={{ backgroundColor: "#c61d23" }}
                  >
                    Verify
                  </button> */}
            </div>
          </div>

          <div className="flex flex-col items-center w-2/3 appearance-none">
            <div
              className={`flex justify-end items-end ${
                showCodeBox ? "flex-col" : "flex-row"
              } gap-1`}
            >
              {/* <input
            type="password"
            id="password"
            name="password"
            value={userData?.password || ""}
            onChange={handleChange}
            placeholder="Enter your password"
            className="border-b-2 border-gray-300 py-2 focus:outline-none w-2/3 "
            style={{ backgroundColor: "#c61d23" }}
          /> */}
            </div>
          </div>
        </div>
        {/* {errors.password && (
          <p className="text-white text-xs">{errors.password}</p>
        )} */}

        {/* Submit Message */}
        {submitMessage && (
          <p className={`text-sm text-center ${"text-[#ffdd00]"}`}>
            {submitMessage}
          </p>
        )}
        {error && <p className="text-sm text-center text-white">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all mt-4"
          style={{ backgroundColor: "#c61d23" }}
        >
          Next
        </button>

        <div className="w-full h-full flex justify-center items-center">
          <div className=" w-24 mt-4">
            <img src={scholarsDenLogo} alt="" />
          </div>
        </div>

        {/* Login Link */}
        {/* <div className="text-gray-300 mt-20 flex justify-between items-center">
        <p className="text-sm">Already have an account?</p>
        <Link
          to="/"
          className=" border-2 rounded-full py-2 px-5 font-medium hover:underline"
        >
          Log in
        </Link>
      </div> */}
      </form>
    </div>
  );
};

export default SignupForm;
