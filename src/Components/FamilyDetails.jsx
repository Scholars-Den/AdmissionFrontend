import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import Spinner from "../../api/Spinner";
import {
  fetchUserDetails,
  putFormData,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";
import {
  validateAadhaar,
  validateDateOfBirth,
  validateName,
  validatePhoneNo,
} from "../../utils/validation/inputValidation";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
import {
  User,
  Phone,
  Briefcase,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Users,
  Heart,
} from "lucide-react";

const FamilyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);
  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );
  const { loading } = useSelector((state) => state.loadingDetails);

  const [errors, setErrors] = useState({});
  const occupationOptions = ["Business", "Service", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const familySections = [
    [
      {
        title: "Father's Details",
        fields: [
          {
            name: "fatherName",
            type: "text",
            placeholder: "Enter father's full name",
            required: true,
            validation: validateName,
            label: "Father's Name",
            icon: User,
          },
          {
            name: "fatherAadhaarID",
            type: "text",
            placeholder: "12-digit Aadhaar number",
            validation: validateAadhaar,
            label: "Father's Aadhaar ID",
            icon: CreditCard,
          },
          {
            name: "fatherOccupations",
            type: "select",
            options: occupationOptions,
            required: true,
            label: "Father's Occupation",
            icon: Briefcase,
          },
          {
            name: "fatherContactNumber",
            type: "number",
            required: true,
            label: "Father's Contact Number",
            placeholder: "10-digit mobile number",
            validation: validatePhoneNo,
            icon: Phone,
          },
        ],
      },
    ],
    [
      {
        title: "Mother's Details",
        fields: [
          {
            name: "motherName",
            type: "text",
            placeholder: "Enter mother's full name",
            validation: validateName,
            label: "Mother's Name",
            icon: User,
          },
          {
            name: "motherAadhaarID",
            type: "text",
            placeholder: "12-digit Aadhaar number",
            validation: validateAadhaar,
            label: "Mother's Aadhaar ID",
            icon: CreditCard,
          },
          {
            name: "motherOccupations",
            type: "select",
            options: ["Business", "Service", "Housemaker", "Other"],
            label: "Mother's Occupation",
            icon: Briefcase,
          },
          {
            name: "motherContactNumber",
            type: "number",
            required: true,
            label: "Mother's Contact Number",
            placeholder: "10-digit mobile number",
            validation: validatePhoneNo,
            icon: Phone,
          },
        ],
      },
    ],
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log("name value from handleChange", name, value);

    console.log(
      "studentAdmissionApprovalDetailsv from handleChange",
      studentAdmissionApprovalDetails
    );

    if (studentAdmissionApprovalDetails?.parentDetails?.status) {
      return;
    }

    if (name === "fatherContactNumber" || name === "motherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    console.log("name", name, "value", value);
    dispatch(updateUserDetails({ [name]: value }));
    if (value.trim())
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("onsUBMIT click");
    if (!validateForm()) return;
    try {
      dispatch(setLoading(true));

      console.log("userData in onSumit ", userData);

      const result = await dispatch(putFormData(userData));
      navigate("/addressDetails");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    familySections.forEach((sectionArray) => {
      sectionArray.forEach((section) => {
        section.fields?.forEach(({ name, required, validation }) => {
          const value = userData[name];

          if (typeof validation === "function") {
            const result = validation(value);

            if (required && !result.isValid) {
              formErrors[name] = result.message || `${name} is invalid`;
              isValid = false;
            }
          } else {
            if (required && (!value || value.toString().trim() === "")) {
              const label = name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());
              formErrors[name] = `${label} is required`;
              isValid = false;
            }
          }
        });
      });
    });

    setErrors(formErrors);
    console.log("formErrors", formErrors);
    return isValid;
  };

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);

  useEffect(() => {
    if (userData?.fatherName) {
      dispatch(fetchAdmissionApprovalMessage(userData?.acknowledgementNumber));
    }
  }, [userData]);

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
          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                Family Information
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">
                Step 2 of 3
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "66%" }}
              ></div>
            </div>
          </div>

          {/* Approval Status */}
          {studentAdmissionApprovalDetails?.parentDetails && (
            <div
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 flex items-start gap-2 sm:gap-3 ${
                studentAdmissionApprovalDetails?.parentDetails?.status
                  ? "bg-emerald-50 border-emerald-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              {studentAdmissionApprovalDetails?.parentDetails?.status ? (
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
                  studentAdmissionApprovalDetails?.parentDetails?.status
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {studentAdmissionApprovalDetails?.parentDetails?.status
                  ? "Approved"
                  : studentAdmissionApprovalDetails?.parentDetails?.message}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-6 sm:gap-8">
            {/* Father's Details Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#c61d23] to-[#a01818] rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Father's Details
                </h3>
              </div>

              <div className="flex flex-col gap-4 sm:gap-5">
                {familySections[0][0].fields.map((field, fieldIndex) =>
                  field.type === "select" ? (
                    <SelectField
                      key={fieldIndex}
                      icon={field.icon}
                      name={field.name}
                      options={field.options}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                      value={userData?.[field.name] || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <InputField
                      key={fieldIndex}
                      icon={field.icon}
                      name={field.name}
                      type={field.type}
                      label={field.label}
                      required={field.required}
                      value={userData?.[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                      maxLength={
                        field.name === "fatherContactNumber" ? 10 : undefined
                      }
                    />
                  )
                )}
              </div>
            </div>

            {/* Mother's Details Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#c61d23] to-[#a01818] rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart size={20} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Mother's Details
                </h3>
              </div>

              <div className="flex flex-col gap-4 sm:gap-5">
                {familySections[1][0].fields.map((field, fieldIndex) =>
                  field.type === "select" ? (
                    <SelectField
                      key={fieldIndex}
                      icon={field.icon}
                      name={field.name}
                      options={field.options}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                      value={userData?.[field.name] || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <InputField
                      key={fieldIndex}
                      icon={field.icon}
                      name={field.name}
                      type={field.type}
                      label={field.label}
                      required={field.required}
                      value={userData?.[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      error={errors[field.name]}
                      maxLength={
                        field.name === "motherContactNumber" ? 10 : undefined
                      }
                    />
                  )
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => navigate("/basicDetails")}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>{loading ? "Processing..." : "Next"}</span>
                {!loading && <ChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetails;
