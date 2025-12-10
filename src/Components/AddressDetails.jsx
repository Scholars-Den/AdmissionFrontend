import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  submitAddressForm,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputField";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { setLoading } from "../../redux/loadingSlice";
import Spinner from "../../api/Spinner";
import SelectField from "../../utils/SelectField";

const AddressDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);

  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Andaman and Nicobar Islands",
    "Bihar",
    "Chhattisgarh",
    "Chandigarh",
    "Delhi",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Ladakh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Puducherry",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Fetch user details on mount
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Fetch admission approval message when acknowledgement number is available
  useEffect(() => {
    if (userData?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userData.acknowledgementNumber));
    }
  }, [userData?.acknowledgementNumber, dispatch]);

  // Update approval status when studentAdmissionApprovalDetails changes
  useEffect(() => {
    if (studentAdmissionApprovalDetails?.addressDetails) {
      setApprovalStatus({
        approved: studentAdmissionApprovalDetails.addressDetails.status,
        message: studentAdmissionApprovalDetails.addressDetails.message || 
                 (studentAdmissionApprovalDetails.addressDetails.status ? "Approved" : "Pending Review"),
      });
    }
  }, [studentAdmissionApprovalDetails]);

  const handleChange = (e) => {
    // If approval status exists and is approved, prevent changes
    if (approvalStatus?.approved) {
      return;
    }

    const { name, value } = e.target;

    let updatedData;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      updatedData = {
        address: {
          ...userData?.address,
          [field]: value,
        },
      };
    } else {
      updatedData = { [name]: value };
    }

    dispatch(updateUserDetails(updatedData));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = [
      { name: "address.line1", label: "Address Line 1" },
      { name: "address.city", label: "City" },
      { name: "address.state", label: "State" },
    ];

    requiredFields.forEach(({ name, label }) => {
      const keys = name.split(".");
      const value =
        keys.length === 2 ? userData?.[keys[0]]?.[keys[1]] : userData?.[name];

      if (!value || value.trim() === "") {
        formErrors[name] = `${label} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      const formData = { 
        ...userData,
        address: userData?.address 
      };

      await dispatch(submitAddressForm(formData)).unwrap();

      setSubmitMessage("Address details submitted successfully!");
      
      // Navigate to next page after successful submission
      setTimeout(() => {
        navigate("/siblingsDetails");
      }, 1000);
      
    } catch (error) {
      console.log("Error submitting form:", error);
      setSubmitMessage("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[768px] mx-auto bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Address Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Provide your residential information
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                Residential Address
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">
                Step 3 of 5
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "60%" }}
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
          <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-5">
            {/* Address Information */}
            <InputField
              label="Address Line 1"
              name="address.line1"
              placeholder="Enter your complete address"
              required
              value={userData?.address?.line1 || ""}
              onChange={handleChange}
              error={errors["address.line1"]}
              disabled={approvalStatus?.approved}
            />

            <InputField
              label="City"
              name="address.city"
              placeholder="Enter city name"
              required
              value={userData?.address?.city || ""}
              onChange={handleChange}
              error={errors["address.city"]}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="State"
              name="address.state"
              options={indianStates}
              required
              value={userData?.address?.state || ""}
              onChange={handleChange}
              error={errors["address.state"]}
              disabled={approvalStatus?.approved}
            />

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
                onClick={() => navigate("/familyDetails")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || approvalStatus?.approved}
                className="flex-[2] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>{isSubmitting ? "Processing..." : "Next"}</span>
                {!isSubmitting && <ChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <Spinner />}
    </div>
  );
};

export default AddressDetails;