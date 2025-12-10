// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import {
//   updateUserDetails,
//   submitFormData,
//   putFormData,
//   fetchUserDetails,
// } from "../../redux/formDataSlice";

// import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
// import { setLoading } from "../../redux/loadingSlice";
// import Spinner from "../../api/Spinner";
// import InputField from "../../utils/InputField";
// import SelectField from "../../utils/SelectField";
// import CheckboxField from "../../utils/CheckboxField";
// import {
//   validateAadhaar,
//   validateName,
//   validatePhoneNo,
//   validateSchoolName,
// } from "../../utils/validation/inputValidation";
// import YesNoField from "../../utils/YesNoField";

// const BasicDetailsForm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.userDetails);
//   const { existingStudent } = useSelector((state) => state.alreadyExistStudent);

//   const { studentAdmissionApprovalDetails } = useSelector(
//     (state) => state.alreadyExistStudent
//   );

//   const [submitMessage, setSubmitMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   // Aadhaar example: ¸

//   const handleChange = (e) => {
//     if (studentAdmissionApprovalDetails[0]?.studentDetails?.status) {
//       return;
//     }
//     const { name, value } = e.target;
//     if (name === "aadhaarID") {
//       if (value.length > 12) return;
//     }
//     if (name === "termsAndCondition") {
//       dispatch(updateUserDetails({ [e.target.name]: e.target.checked }));
//       return;
//     }

//     dispatch(updateUserDetails({ [name]: value }));

//     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//   };

//   const radioChange = (e) => {
//     const { name, value } = e.target;

//     let updatedData;

//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];
//       updatedData = {
//         address: {
//           ...userData?.address,
//           [field]: value,
//         },
//       };
//     } else {
//       updatedData = { [name]: value };
//     }

//     dispatch(updateUserDetails(updatedData));

//     if (value.trim()) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   // let subjectOptions =
//   //   userData?.studentClass >= 6 && userData?.studentClass <= 10
//   //     ? ["Foundation"]
//   //     : ["Engineering", "Medical"];

//   let subjectOptionsForClass = {
//     Foundation: ["VI", "VII", "VIII", "IX", "X"],
//     "JEE(Main & Adv)": [
//       "XI Engineering",
//       "XII Engineering",
//       "XII Passed Engineering",
//     ],

//     "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
//   };

//   // userData?.program === "Engineering" || userData?.program === "Medical"
//   //   ? [...Array.from({ length: 1 }, (_, i) => i + 11), "12 Passed"]
//   //   : [...Array.from({ length: 5 }, (_, i) => i + 6)];

//   const convertToRoman = (num) => {
//     const romanNumerals = {
//       6: "VI",
//       7: "VII",
//       8: "VIII",
//       9: "IX",
//       10: "X",
//       11: "XI",
//       12: "XII",
//     };
//     return romanNumerals[num] || num;
//   };

//   // let subjectOptionsRoman = subjectOptionsForClass.flatMap((item) => {
//   //   if (typeof item === "number") {
//   //     console.log("item", item);
//   //     return convertToRoman(item);
//   //   } else if (typeof item === "string") {
//   //     const match = item.match(/^(\d+)\s+(.*)/);
//   //     if (match) {
//   //       const roman = convertToRoman(parseInt(match[1]));
//   //       return [roman, `${roman} ${match[2]}`]; // Now in correct order
//   //     }
//   //   }
//   //   return item; // fallback
//   // });

//   // console.log(subjectOptionsRoman);

//   let subjectOptions = ["Foundation", "JEE(Main & Adv)", "NEET(UG)"];

//   const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

//   // const convertToRoman = (num) => {
//   //   const romanNumerals = {
//   //     6: "VI",
//   //     7: "VII",
//   //     8: "VIII",
//   //     9: "IX",
//   //     10: "X",
//   //     11: "XI",
//   //     12: "XII",
//   //   };
//   //   return romanNumerals[num];
//   // };

//   useEffect(() => {
//     if (userData?.studentName) {
//       dispatch(fetchAdmissionApprovalMessage(userData?.acknowledgementNumber));
//     }
//   }, [userData]);

//   useEffect(() => {
//     dispatch(fetchUserDetails());
//   }, []);
//   // Define form fields
//   const formFields = [
//     {
//       name: "studentName",
//       type: "text",
//       placeholder: "*Student Name",
//       required: true,
//       validation: validateName,
//       label: "*Student Name",
//     },
//     {
//       name: "aadhaarID",
//       type: "text",
//       placeholder: "*Aadhaar ID",
//       required: true,
//       validation: validateAadhaar,
//       label: "*Aadhaar ID",
//     },
//     { name: "email", type: "email", placeholder: "Email ID", label: "Email" },
//     { name: "dob", type: "date", placeholder: "Enter your Date Of Birth", label: "Date Of Birth" },
//     {
//       name: "schoolName",
//       type: "text",
//       placeholder: "Enter Your School Name",
//       required: true,
//       validation: validateSchoolName,
//       label: "Current/Last Attended School",
//     },
//   ];

//   const selectFields = [
//     {
//       name: "gender",
//       label: "*Select Gender",
//       options: ["Male", "Female"],
//       value: userData.gender,
//       onChange: { handleChange },
//       error: errors.gender,
//       required: true,
//     },

//     {
//       name: "category",
//       label: "*Select Category",
//       options: ["General", "OBC", "SC", "ST", "ETS"],
//       value: userData.category,
//       onChange: { handleChange },
//       error: errors.category,
//       required: true,
//     },
//     {
//       name: "bloodGroup",
//       label: "*Select Your Blood Group",
//       options: bloodGroupOptions,
//       value: userData.category,
//       onChange: { handleChange },
//       error: errors.category,
//     },
//     {
//       name: "program",
//       label: "*Select Program",
//       options: subjectOptions,
//       value: userData.program,
//       onChange: { handleChange },
//       error: errors.program,
//       required: true,
//     },
//     {
//       name: "studentClass",
//       label: "*Select Class",
//       options: subjectOptionsForClass[userData?.program] || [],
//       onChange: handleChange, // Remove curly braces around handleChange
//       error: errors.class,
//       required: true,
//     },
//   ];

//     const dataField = [
//       {

//       }
//     ]

//   const checkboxFields = [
//     {
//       label: "Existing Student",
//       name: "existingStudent",
//       onChange: { handleChange },
//     },
//   ];

//   const validateForm = () => {
//     const formErrors = {};
//     let isValid = true;

//     formFields.forEach(({ name, required, validation }) => {
//       if (validation != undefined) {
//         const isValidInput = validation(userData[name]);
//         if (required && !isValidInput.isValid) {
//           formErrors[name] = isValidInput.message;
//           isValid = false;
//         }
//       }
//     });
//     selectFields.forEach(({ name, required }) => {
//       if (required && !userData[name]?.trim()) {
//         formErrors[name] = `${name
//           .replace(/([A-Z])/g, " $1") // Add space before capital letters
//           .replace(/^./, (char) => char.toUpperCase())} is required`;
//         isValid = false;
//       }
//     });

//     if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
//       formErrors.email = "Email must be valid";
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       dispatch(setLoading(true));

//       await dispatch(putFormData(userData));
//       if (document.cookie) {
//         navigate("/familyDetails");
//       }
//     } catch (error) {
//       console.log("Error submitting form:", error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <div className="w-full p-2 sm:p-6">
//       {/* {loading && <Spinner />} */}

//       <form
//         className="flex flex-col sm:px-2 items-center gap-2 sm:py-2 text-white w-full"
//         onSubmit={onSubmit}
//       >

//         {studentAdmissionApprovalDetails?.studentDetails &&
//           (studentAdmissionApprovalDetails?.studentDetails?.status ? (
//             <div className="flex flex-col w-full gap-4 items-end  ">
//               <span className="bg-green-500 p-2 rounded-xl">Approved</span>
//             </div>
//           ) : (
//             <div className="flex flex-col w-full gap-4 items-end  ">
//               <span className="text-[#c61d23] bg-white shadow-xl p-2 rounded-xl">
//                 {studentAdmissionApprovalDetails?.studentDetails?.message}
//               </span>
//             </div>
//           ))}

//         <fieldset className="text-white border-2 w-full px-2 py-2 sm:px-6 sm:py-4 pb-7">
//           <legend> Student Details </legend>
//           <div className="flex flex-col w-full gap-4 items-center">
//             {formFields?.map((field) => (
//               <InputField
//                 key={field.name}
//                 name={field.name}
//                 value={userData?.[field.name] || ""}
//                 onChange={handleChange}
//                 error={errors[field.name]}
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 label={field.label}
//               />
//             ))}

//             {selectFields?.map((field) => (
//               <SelectField
//                 key={field.name}
//                 name={field.name}
//                 value={userData?.[field.name] || ""}
//                 onChange={handleChange}
//                 options={field.options}
//                 error={errors[field.name]}
//                 label={field.label}
//               />
//             ))}

//             {checkboxFields?.map((field) => (
//               // <CheckboxField
//               //   key={field.name}
//               //   name={field.name}
//               //   type="radio"
//               //   value={userData?.[field.name] || ""}
//               //   onChange={handleChange}
//               //   error={errors[field.name]}
//               //   label={field.label}
//               // />

//               // console.log("field", field.name)
//               <YesNoField
//                 label={field.label}
//                 name={field.name}
//                 value={userData?.existingStudent || ""}
//                 onChange={radioChange}
//                 error={errors[field.name]}
//               />
//             ))}

//             {submitMessage && (
//               <p className="text-sm text-[#ffdd00] text-center">
//                 {submitMessage}
//               </p>
//             )}
//           </div>
//         </fieldset>

//         <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6 w-full">
//           <button
//             onClick={() => navigate(-1)}
//             type="button"
//             className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
//             disabled
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all"
//           >
//             Next
//           </button>
//         </div>
//       </form>

//       {/* <div className="w-24">
//           <img src={scholarsDenLogo} alt="Scholars Den Logo" />
//         </div> */}
//     </div>
//   );
// };

// export default BasicDetailsForm;

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
import CheckboxField from "../../utils/CheckboxField";
import {
  validateAadhaar,
  validateName,
  validatePhoneNo,
  validateSchoolName,
} from "../../utils/validation/inputValidation";
import YesNoField from "../../utils/YesNoField";

import {
  User,
  Mail,
  Calendar,
  School,
  Droplet,
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  UserCheck,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

const BasicDetailsForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    aadhaarID: "",
    email: "",
    dob: "",
    schoolName: "",
    gender: "",
    category: "",
    bloodGroup: "",
    program: "",
    studentClass: "",
    existingStudent: "",
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const { userData } = useSelector((state) => state.userDetails);

  const subjectOptionsForClass = {
    Foundation: ["VI", "VII", "VIII", "IX", "X"],
    "JEE(Main & Adv)": [
      "XI Engineering",
      "XII Engineering",
      "XII Passed Engineering",
    ],
    "NEET(UG)": ["XI Medical", "XII Medical", "XII Passed Medical"],
  };

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const programOptions = ["Foundation", "JEE(Main & Adv)", "NEET(UG)"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadhaarID" && value.length > 12) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim())
      newErrors.studentName = "Student name is required";
    if (!formData.aadhaarID || formData.aadhaarID.length !== 12) {
      newErrors.aadhaarID = "Aadhaar must be 12 digits";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.schoolName.trim())
      newErrors.schoolName = "School name is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.category) newErrors.category = "Please select category";
    if (!formData.bloodGroup)
      newErrors.bloodGroup = "Please select blood group";
    if (!formData.program) newErrors.program = "Please select program";
    if (!formData.studentClass) newErrors.studentClass = "Please select class";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitMessage("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    setTimeout(() => {
      setSubmitMessage("Form submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  useEffect(() => {
    console.log("userData form USeffect", userData);
    if (userData?.studentName) {
      dispatch(fetchAdmissionApprovalMessage(userData?.acknowledgementNumber));
    }
  }, [userData]);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[768px] mx-auto bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none max-w-[768px] mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-xl border-4 border-[#ffdd00]/40 flex items-center justify-center bg-[#c61d23]">
                  <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ffdd00] to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-gray-900" />
                </div>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Student Details
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Complete your registration information
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">
                Step 1 of 5
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>

          {/* Approval Status */}
          {approvalStatus && (
            <div
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 flex items-start gap-2 sm:gap-3 ${
                approvalStatus.approved
                  ? "bg-emerald-50 border-emerald-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              {approvalStatus.approved ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
                />
              ) : (
                <AlertCircle
                  size={16}
                  className="text-red-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
                />
              )}
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  approvalStatus.approved ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {approvalStatus.message}
              </span>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Personal Information */}
            <InputField
              icon={User}
              label="Student Name"
              name="studentName"
              placeholder="Enter full name"
              required
            />

            <InputField
              icon={CreditCard}
              label="Aadhaar ID"
              name="aadhaarID"
              placeholder="12-digit Aadhaar number"
              required
              maxLength={12}
            />

            <InputField
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              placeholder="student@example.com"
            />

            <InputField
              icon={Calendar}
              label="Date of Birth"
              name="dob"
              type="date"
            />

            <SelectField
              icon={Users}
              label="Gender"
              name="gender"
              options={["Male", "Female"]}
              required
            />

            <SelectField
              icon={Droplet}
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroupOptions}
              required
            />

            {/* Academic Information */}
            <InputField
              icon={School}
              label="Current/Last Attended School"
              name="schoolName"
              placeholder="Enter school name"
              required
            />

            <SelectField
              icon={Users}
              label="Category"
              name="category"
              options={["General", "OBC", "SC", "ST", "ETS"]}
              required
            />

            <SelectField
              icon={BookOpen}
              label="Program"
              name="program"
              options={programOptions}
              required
            />

            <SelectField
              icon={GraduationCap}
              label="Class"
              name="studentClass"
              options={subjectOptionsForClass[formData.program] || []}
              required
              disabled={!formData.program}
            />

            <YesNoField label="Existing Student" name="existingStudent" />

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-3 sm:p-4 rounded-xl border-2 flex items-start gap-2 sm:gap-3 ${
                  submitMessage.includes("success")
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <AlertCircle
                  size={16}
                  className={`flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px] ${
                    submitMessage.includes("success")
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                />
                <p
                  className={`text-xs sm:text-sm font-semibold ${
                    submitMessage.includes("success")
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 sm:mt-6 md:mt-8">
              <button
                type="button"
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 bg-gray-100 text-gray-400 text-sm sm:text-base font-semibold rounded-lg cursor-not-allowed transition-all"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-[2] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>{isSubmitting ? "Processing..." : "Next"}</span>
                {!isSubmitting && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
