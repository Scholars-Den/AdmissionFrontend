import { useState, useEffect } from "react";
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

const BasicDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);
  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

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

  // Fetch user details on mount
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Sync userData from Redux to local formData state
  useEffect(() => {
    console.log("userData useEffect", userData);
    if (userData && Object.keys(userData).length > 0) {
      setFormData({
        studentName: userData.studentName || "",
        aadhaarID: userData.aadhaarID || "",
        email: userData.email || "",
        dob: userData.dob || "",
        schoolName: userData.schoolName || "",
        gender: userData.gender || "",
        category: userData.category || "",
        bloodGroup: userData.bloodGroup || "",
        program: userData.program || "",
        studentClass: userData.studentClass || "",
        existingStudent: userData.existingStudent || "",
      });
    }
  }, [userData]);

  // Fetch admission approval message when student name is available
  useEffect(() => {
    if (userData?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userData.acknowledgementNumber));
    }
  }, [userData?.acknowledgementNumber, dispatch]);

  // Update approval status when studentAdmissionApprovalDetails changes
  useEffect(() => {
    if (studentAdmissionApprovalDetails?.basicDetails) {
      setApprovalStatus({
        approved: studentAdmissionApprovalDetails.basicDetails.status,
        message: studentAdmissionApprovalDetails.basicDetails.message || 
                 (studentAdmissionApprovalDetails.basicDetails.status ? "Approved" : "Pending Review"),
      });
    }
  }, [studentAdmissionApprovalDetails]);

  const handleChange = (e) => {
    // If approval status exists and is approved, prevent changes
    if (approvalStatus?.approved) {
      return;
    }

    const { name, value } = e.target;

    // Aadhaar ID length restriction
    if (name === "aadhaarID" && value.length > 12) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const radioChange = (e) => {
    if (approvalStatus?.approved) {
      return;
    }

    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Validate name
    const nameValidation = validateName(formData.studentName);
    if (!nameValidation.isValid) {
      formErrors.studentName = nameValidation.message;
      isValid = false;
    }

    // Validate Aadhaar
    const aadhaarValidation = validateAadhaar(formData.aadhaarID);
    if (!aadhaarValidation.isValid) {
      formErrors.aadhaarID = aadhaarValidation.message;
      isValid = false;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate school name
    const schoolValidation = validateSchoolName(formData.schoolName);
    if (!schoolValidation.isValid) {
      formErrors.schoolName = schoolValidation.message;
      isValid = false;
    }

    // Required field validations
    if (!formData.gender) {
      formErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.category) {
      formErrors.category = "Category is required";
      isValid = false;
    }

    if (!formData.bloodGroup) {
      formErrors.bloodGroup = "Blood group is required";
      isValid = false;
    }

    if (!formData.program) {
      formErrors.program = "Program is required";
      isValid = false;
    }

    if (!formData.studentClass) {
      formErrors.studentClass = "Class is required";
      isValid = false;
    }

    console.log("formData from basicDetailsPage", formData);
    console.log("formErrors from basicDetailsPage", formErrors);

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      console.log("FormData from onSubmit", formData);
      await dispatch(putFormData(formData)).unwrap();

      setSubmitMessage("Form submitted successfully!");
      
      // Navigate to next page after successful submission
      setTimeout(() => {
        navigate("/familyDetails");
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
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Basic Details
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Complete your profile
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
                Basic Information
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">
                Step 1 of 5
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "20%" }}
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
            {/* Personal Information */}
            <InputField
              label="Student Name"
              name="studentName"
              placeholder="Enter full name"
              required
              value={formData.studentName}
              onChange={handleChange}
              error={errors.studentName}
              disabled={approvalStatus?.approved}
            />

            <InputField
              label="Aadhaar ID"
              name="aadhaarID"
              placeholder="12-digit Aadhaar number"
              required
              maxLength={12}
              value={formData.aadhaarID}
              onChange={handleChange}
              error={errors.aadhaarID}
              disabled={approvalStatus?.approved}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={approvalStatus?.approved}
            />

            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="Gender"
              name="gender"
              options={["Male", "Female"]}
              required
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroupOptions}
              required
              value={formData.bloodGroup}
              onChange={handleChange}
              error={errors.bloodGroup}
              disabled={approvalStatus?.approved}
            />

            {/* Academic Information */}
            <InputField
              label="Current/Last Attended School"
              name="schoolName"
              placeholder="Enter school name"
              required
              value={formData.schoolName}
              onChange={handleChange}
              error={errors.schoolName}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="Category"
              name="category"
              options={["General", "OBC", "SC", "ST", "ETS"]}
              required
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="Program"
              name="program"
              options={programOptions}
              required
              value={formData.program}
              onChange={handleChange}
              error={errors.program}
              disabled={approvalStatus?.approved}
            />

            <SelectField
              label="Class"
              name="studentClass"
              options={subjectOptionsForClass[formData.program] || []}
              required
              disabled={!formData.program || approvalStatus?.approved}
              value={formData.studentClass}
              onChange={handleChange}
              error={errors.studentClass}
            />

            <YesNoField
              label="Existing Student"
              name="existingStudent"
              value={formData.existingStudent}
              onChange={radioChange}
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
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 bg-gray-100 text-gray-400 text-sm sm:text-base font-semibold rounded-lg cursor-not-allowed transition-all"
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
    </div>
  );
};

export default BasicDetailsPage;