import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  updateUserDetails,
  submitFormData,
  putFormData,
  fetchUserDetails,
} from "../../redux/formDataSlice";

import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
import { setLoading } from "../../redux/loadingSlice";
import Spinner from "../../api/Spinner";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import {
  validateAadhaar,
  validateName,
  validatePhoneNo,
} from "../../utils/validation/inputValidation";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);

  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );
  const { loading } = useSelector((state) => state.loadingDetails);

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeVerified, setCodeVerified] = useState(true);
  // const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Aadhaar example: 835824268440

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  const handleChange = (e) => {
    if (studentAdmissionApprovalDetails[0]?.studentDetails?.status) {
      return;
    }
    const { name, value } = e.target;
    if (name === "aadharID") {
      if (value.length > 12) return;
    }
    if (name === "termsAndCondition") {
      dispatch(updateUserDetails({ [e.target.name]: e.target.checked }));
      return;
    }

    dispatch(updateUserDetails({ [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // let subjectOptions =
  //   userData?.studentClass >= 6 && userData?.studentClass <= 10
  //     ? ["Foundation"]
  //     : ["Engineering", "Medical"];

  let subjectOptionsForClass = {
    Foundation: ["VI", "VII", "VIII", "IX", "X"],
    "JEE(Main & Adv)": [
      "XI Engineering",
      "XII Engineering",
      "XII Passed Engineering",
    ],

    "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
  };

  // userData?.program === "Engineering" || userData?.program === "Medical"
  //   ? [...Array.from({ length: 1 }, (_, i) => i + 11), "12 Passed"]
  //   : [...Array.from({ length: 5 }, (_, i) => i + 6)];

  const convertToRoman = (num) => {
    const romanNumerals = {
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
      11: "XI",
      12: "XII",
    };
    return romanNumerals[num] || num;
  };

  // let subjectOptionsRoman = subjectOptionsForClass.flatMap((item) => {
  //   if (typeof item === "number") {
  //     console.log("item", item);
  //     return convertToRoman(item);
  //   } else if (typeof item === "string") {
  //     const match = item.match(/^(\d+)\s+(.*)/);
  //     if (match) {
  //       const roman = convertToRoman(parseInt(match[1]));
  //       return [roman, `${roman} ${match[2]}`]; // Now in correct order
  //     }
  //   }
  //   return item; // fallback
  // });

  // console.log(subjectOptionsRoman);

  let subjectOptions = ["Foundation", "JEE(Main & Adv)", "NEET(UG)"];
  // const convertToRoman = (num) => {
  //   const romanNumerals = {
  //     6: "VI",
  //     7: "VII",
  //     8: "VIII",
  //     9: "IX",
  //     10: "X",
  //     11: "XI",
  //     12: "XII",
  //   };
  //   return romanNumerals[num];
  // };

  useEffect(() => {
    if (userData)
      dispatch(fetchAdmissionApprovalMessage(userData?.acknowledgementNumber));
  }, [userData]);

  useEffect(() => {
    console.log(
      "studentAdmissionApprovalDetails",
      studentAdmissionApprovalDetails
    );
  }, [studentAdmissionApprovalDetails]);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);
  // Define form fields
  const formFields = [
    {
      name: "studentName",
      type: "text",
      placeholder: "*Student Name",
      required: true,
      validation: validateName,
      label: "*Student Name",
    },
    {
      name: "aadharID",
      type: "text",
      placeholder: "*Aadhaar ID",
      required: true,
      validation: validateAadhaar,
      label: "*Aadhaar ID",
    },
    // { name: "email", type: "email", placeholder: "Email ID", required: false },
    // {
    //   name: "studentContactNumber",
    //   type: "number",
    //   placeholder: "Enter Your Contact Number",
    //   required: true,
    //   validation: validatePhoneNo,
    // },
  ];

  const selectFields = [
    {
      name: "gender",
      label: "*Select Gender",
      options: ["Male", "Female"],
      value: userData.gender,
      onChange: { handleChange },
      error: errors.gender,
      required: true,
    },

    {
      name: "category",
      label: "*Select Category",
      options: ["General", "OBC", "SC", "ST", "ETS"],
      value: userData.category,
      onChange: { handleChange },
      error: errors.category,
      required: true,
    },
    {
      name: "program",
      label: "*Select Program",
      options: subjectOptions,
      value: userData.program,
      onChange: { handleChange },
      error: errors.program,
      required: true,
    },
    {
      name: "studentClass",
      label: "*Select Class",
      options: subjectOptionsForClass[userData?.program] || [],
      onChange: handleChange, // Remove curly braces around handleChange
      error: errors.class,
      required: true,
    },
  ];

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    formFields.forEach(({ name, required, validation }) => {
      const isValidInput = validation(userData[name]);
      if (required && !isValidInput.isValid) {
        formErrors[name] = isValidInput.message;
        isValid = false;
      }
    });
    selectFields.forEach(({ name, required }) => {
      if (required && !userData[name]?.trim()) {
        formErrors[name] = `${name
          .replace(/([A-Z])/g, " $1") // Add space before capital letters
          .replace(/^./, (char) => char.toUpperCase())} is required`;
        isValid = false;
      }
    });

    // if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    //   formErrors.email = "Email must be valid";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      if (!codeVerified) {
        return setSubmitMessage("Please Verify Your Phone Number");
      }

      await dispatch(putFormData(userData));
      if (document.cookie) {
        navigate("/familyDetails");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full p-2 sm:p-6">
      {/* {loading && <Spinner />} */}

      <form
        className="flex flex-col sm:px-2 items-center gap-2 sm:py-2 text-white w-full"
        onSubmit={onSubmit}
      >

        {console.log("studentAdmissionApprovalDetaisl", studentAdmissionApprovalDetails)}
        {console.log("studentAdmissionApprovalDetaisl",studentAdmissionApprovalDetails !== undefined )}
        {  studentAdmissionApprovalDetails?.studentDetails  &&
        (
         studentAdmissionApprovalDetails?.studentDetails?.status ? (
          <div className="flex flex-col w-full gap-4 items-end  ">
            <span className="bg-green-500 p-2 rounded-xl">Approved</span>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 items-end  ">
            <span className="text-[#c61d23] bg-white shadow-xl p-2 rounded-xl">{studentAdmissionApprovalDetails?.studentDetails?.message}</span>
          </div>
        )
      )}

        <fieldset className="text-white border-2 w-full px-2 py-2 sm:px-6 sm:py-4 pb-7">
          <legend> Student Details </legend>
          <div className="flex flex-col w-full gap-4 items-center">
            {formFields?.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                value={userData?.[field.name] || ""}
                onChange={handleChange}
                error={errors[field.name]}
                type={field.type}
                placeholder={field.placeholder}
                label={field.label}
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

            {submitMessage && (
              <p className="text-sm text-[#ffdd00] text-center">
                {submitMessage}
              </p>
            )}
          </div>
        </fieldset>

        {/* <div className="flex gap-1 justify-center items-center">
          <input
            type="checkbox"
            name="termsAndCondition"
            value={Boolean(userData?.termsAndCondition)}
            checked={Boolean(userData?.termsAndCondition)} // Ensure it's a boolean
            onChange={handleChange}
            className="cursor-pointer"
          />
          <label className="p-1">
            I agree to{" "}
            <Link to="/termsAndConditions" className="text-[#ffdd00] underline">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.termsAndCondition && (
          <span className="text-white text-sm">{errors.termsAndCondition}</span>
        )} */}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6 w-full">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
            disabled
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all"
          >
            Next
          </button>
        </div>
      </form>

      {/* <div className="w-24">
          <img src={scholarsDenLogo} alt="Scholars Den Logo" />
        </div> */}
    </div>
  );
};

export default SignupForm;
