import React, { useEffect, useState } from "react";
import SignupDetailsPage from "../SignupDetailsPage";
import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadingSlice";

import {
  validateAadhaar,
  validateName,
  validatePhoneNo,
} from "../../../utils/validation/inputValidation";
import {
  submitAdminDetails,
  updateAdminDetails,
} from "../../../redux/adminDetailsSlice";

const AdminSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminDetails } = useSelector((state) => state.adminDetails);
  const { loading } = useSelector((state) => state.loadingDetails);
  const [showReloading, setShowReloading] = useState(false);

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);

  // For enable OTP
  // const [codeVerified, setCodeVerified] = useState(true);
  const [codeVerified, setCodeVerified] = useState(false);

  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Aadhar example: 835824268440

  useEffect(() => {
    console.log("adminDetails", adminDetails);
  }, [adminDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      if (value.length > 10) {
        return;
      }
    }
    dispatch(updateAdminDetails({ [name]: value }));
    //   dispatch(updateUserDetails({ [name]: value }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  // Define form fields
  const formFields = [
    {
      name: "email",
      type: "email",
      placeholder: "Enter Your Email ",
      required: true,
    },
    {
      name: "password",
      type: "text",
      placeholder: "Enter Password ",
      required: true,
    },
  ];

  //   const validateForm = () => {
  //     const formErrors = {};
  //     let isValid = true;

  //     formFields.forEach(({ name, required, validation }) => {
  //       console.log("adminDetails[name]", validation(adminDetails[name]));

  //       const isValidInput = validation(adminDetails[name]);
  //       console.log("isValidInput", isValidInput);
  //       if (required && !isValidInput.isValid) {
  //         formErrors[name] = isValidInput.message;
  //         console.log("formErrors[name]", formErrors[name]);
  //         isValid = false;
  //       }
  //     });

  //     console.log("formErrors", formErrors);
  //     setErrors(formErrors);
  //     return isValid;
  //   };

  const validateForm = () => {

    console.log("Password", adminDetails);
    const formErrors = {};
    let isValid = true;

    if (!adminDetails.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    if (!adminDetails.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    if (
      adminDetails.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminDetails.email)
    ) {
      formErrors.email = "Email must be a valid email address";
      isValid = false;
    }

    setErrors(formErrors);

    console.log("FormErrors", formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    console.log("onsUBMIT click");
    e.preventDefault();

    // For enable OTP

    if (!validateForm()) return;

    console.log("adminDetails in onSumit ", adminDetails);
    try {
      dispatch(setLoading(true));

      console.log("adminDetails in onSumit ", adminDetails);

      await dispatch(submitAdminDetails(adminDetails));
      if (document.cookie) {

         


        // const alreadyExistStudent = await axios.post(
        //   "/user/getStudentByPhone",
        //   { contactNumber: adminDetails.contactNumber }
        // );

        // console.log("contactNumber", alreadyExistStudent);

        // if (alreadyExistStudent.length === 0) {
        //   navigate("/basicDetails");
        // } else {
        //   dispatch(
        //     updateAlreadyExistStudent(alreadyExistStudent.data.data )
        //   );

        // }
        // navigate("/alredyExist");
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOTPChange = async (e) => {
    if (e.target.value.length <= 4) {
      setCode(e.target.value);
    }

    if (e.target.value.length >= 4) {
      setCodeEntered(true);
      return;
    } else {
      setCodeEntered(false);
    }

    console.log("e.target.value", e.target.value.length);
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
            Admin Login
          </h2>

          {/* Phone Field */}
          <div className="space-y-4">
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium"
            >
              Enter Admin Email
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={adminDetails?.email || ""}
                onChange={handleChange}
                placeholder="Enter Admin Email"
                className="border-b-2 py-2 focus:outline-none w-full p-4  "
                style={{ backgroundColor: "#c61d23" }}
              />
              {/* {!showCodeBox && !codeVerified && (
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Send OTP
                </button>
              )} */}
            </div>
            {errors.contactNumber && (
              <p className="text-[#ffdd00] mt-1">{errors.contactNumber}</p>
            )}
          </div>
          {/* password */}
          <div className="space-y-4">
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="password"
                id="password"
                name="password"
                value={adminDetails.password}
                onChange={handleChange}
                placeholder="Password"
                className="border-b-2 border-gray-300 py-2 focus:outline-none w-full"
                style={{ backgroundColor: "#c61d23" }}
              />
            </div>
            {errors.contactNumber && (
              <p className="text-[#ffdd00] mt-1">{errors.contactNumber}</p>
            )}
          </div>

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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl transition-all disabled:bg-yellow-800"
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

export default AdminSignup;
