// import React from "react";
// import SignupForm from "./BasicDetailsForm";
// import SignupDetailsPage from "./SignupDetailsPage";
// import FamilyDetails from "./FamilyDetails";
// import SiblingsDetails from "./SiblingsDetails";
// import scholarsDenLogo from "../assets/scholarsdenLogo.png";

// const SiblingsDetailsComponents = () => {
//   return (
//     <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
//       {/* Signup Details Page (Top Section) */}
//       <div className="flex-grow">
//         <SignupDetailsPage />
//       </div>

//       {/* Signup Form (Middle Section) */}
//       <div className="flex-grow">
//         <SiblingsDetails />
//       </div>

//       {/* Footer (Logo at Bottom) */}
//       <div className="flex justify-center items-center py-4">
//         <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
//       </div>
//     </div>
//   );
// };

// export default SiblingsDetailsComponents;










import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loadingSlice";
import {
  fetchUserDetails,
  submitSiblingsDetails,
  updateUserDetails,
} from "../../redux/formDataSlice";
import SignatureCanvas from "react-signature-canvas";
import Spinner from "../../api/Spinner";
import SelectField from "../../utils/SelectField";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  PenTool,
} from "lucide-react";

const SiblingsDetails = () => {
  const { loading } = useSelector((state) => state.loadingDetails);
  const [siblingsTable, setSiblingsTable] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);

  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
  });

  const signatureRefs = {
    student: useRef(null),
    parent: useRef(null),
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  const [siblings, setSiblings] = useState(
    userData?.siblings || []
  );

  const siblingsData = [
    {
      name: "noOfBrother",
      label: "No. of Brothers",
      type: "number",
    },
    {
      name: "noOfSister",
      label: "No. of Sisters",
      type: "number",
    },
    {
      name: "siblingsPosition",
      label: "Your position among siblings",
      type: "number",
    },
  ];

  // Fetch user details on mount
  useEffect(() => {
    dispatch(fetchUserDetails()).then((action) => {
      const fetchedUserData = action.payload;
      if (fetchedUserData?.userData?.signatures) {
        setSignatures(fetchedUserData?.userData?.signatures);
      }
      if (fetchedUserData?.userData?.siblings) {
        setSiblings(fetchedUserData?.userData?.siblings);
      }
    });
  }, [dispatch]);

  // Fetch admission approval message
  useEffect(() => {
    if (userData?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userData.acknowledgementNumber));
    }
  }, [userData?.acknowledgementNumber, dispatch]);

  // Update approval status
  useEffect(() => {
    if (studentAdmissionApprovalDetails?.signatureDetails) {
      setApprovalStatus({
        approved: studentAdmissionApprovalDetails.signatureDetails.status,
        message: studentAdmissionApprovalDetails.signatureDetails.message || 
                 (studentAdmissionApprovalDetails.signatureDetails.status ? "Approved" : "Pending Review"),
      });
    }
  }, [studentAdmissionApprovalDetails]);

  // Load signatures into canvas
  useEffect(() => {
    Object.keys(signatures).forEach((key) => {
      if (signatures[key] && signatureRefs[key]?.current) {
        setTimeout(() => {
          signatureRefs[key]?.current?.fromDataURL(signatures[key]);
        }, 300);
      }
    });
  }, [signatures]);

  // Update siblings array when count changes
  useEffect(() => {
    if (siblingsTable > 0) {
      const newSiblings = Array.from(
        { length: siblingsTable },
        (_, i) =>
          siblings[i] || {
            relation: "",
            name: "",
            occupation: "",
            studyingIn: "",
          }
      );
      setSiblings(newSiblings);
    }
  }, [siblingsTable]);

  const handleChange = (e) => {
    if (approvalStatus?.approved) return;

    const { name, value } = e.target;
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSiblingChange = (index, event) => {
    if (approvalStatus?.approved) return;

    const { name, value, type, checked } = event.target;
    setSiblings((prevSiblings) =>
      prevSiblings.map((sibling, i) =>
        i === index
          ? {
              ...sibling,
              [name]: type === "checkbox" ? checked : value,
            }
          : sibling
      )
    );
  };

  const handleSiblingOccupationChange = (index, event) => {
    if (approvalStatus?.approved) return;

    const { value } = event.target;
    const newSiblings = [...siblings];
    newSiblings[index].occupation = value;
    setSiblings(newSiblings);
  };

  const handleRemoveSibling = (indexToRemove) => {
    if (approvalStatus?.approved) return;

    setSiblings((prevSiblings) => {
      const newSiblings = prevSiblings.filter((_, index) => index !== indexToRemove);
      setSiblingsTable(newSiblings.length);
      return newSiblings;
    });
  };

  const handleSignatureEnd = (key) => {
    if (approvalStatus?.approved) return;

    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key]?.current?.toDataURL(),
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  const clearSignature = (key) => {
    if (approvalStatus?.approved) return;

    signatureRefs[key]?.current?.clear();
    setSignatures((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    const newSignatures = { ...signatures };

    // Validate signatures
    Object.keys(signatureRefs).forEach((key) => {
      const sigRef = signatureRefs[key]?.current;

      if (!sigRef || sigRef.isEmpty()) {
        formErrors[key] = "Signature is required";
        isValid = false;
      } else {
        const signatureData = sigRef.toDataURL();
        newSignatures[key] = signatureData;
      }
    });

    setSignatures(newSignatures);
    setErrors(formErrors);

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      const formData = { ...userData, signatures, siblings };
      await dispatch(submitSiblingsDetails(formData)).unwrap();

      setSubmitMessage("Siblings details submitted successfully!");

      setTimeout(() => {
        navigate("/documentUpload");
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
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Siblings & Signatures
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Family information and signatures
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
                Family Details & Signatures
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">Step 4 of 5</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "80%" }}
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
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
              ) : (
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
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
          <div className="flex flex-col gap-6">
            {/* Siblings Count Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Sibling Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {siblingsData.map((field) => (
                  <SelectField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    options={["0", "1", "2", "3", "4", "5"]}
                    value={userData?.[field.name] || "0"}
                    onChange={handleChange}
                    disabled={approvalStatus?.approved}
                  />
                ))}
              </div>

              {/* Add Sibling Button */}
              <button
                type="button"
                onClick={() => setSiblingsTable((prev) => prev + 1)}
                disabled={approvalStatus?.approved}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#c61d23] hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add Sibling Details
              </button>
            </div>

            {/* Siblings Table */}
            {siblings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Sibling Details
                </h3>
                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">S.No</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">Relation</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">Occupation</th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">Details</th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {siblings.map((sibling, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-3 py-3">
                              <select
                                name="relation"
                                value={sibling.relation}
                                onChange={(e) => handleSiblingChange(index, e)}
                                disabled={approvalStatus?.approved}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c61d23] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              >
                                <option value="">Select</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                name="name"
                                value={sibling.name}
                                onChange={(e) => handleSiblingChange(index, e)}
                                disabled={approvalStatus?.approved}
                                placeholder="Enter name"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c61d23] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex flex-col gap-1">
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="radio"
                                    name={`occupation-${index}`}
                                    value="student"
                                    checked={sibling.occupation === "student"}
                                    onChange={(e) => handleSiblingOccupationChange(index, e)}
                                    disabled={approvalStatus?.approved}
                                    className="text-[#c61d23] focus:ring-[#c61d23]"
                                  />
                                  Student
                                </label>
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="radio"
                                    name={`occupation-${index}`}
                                    value="working"
                                    checked={sibling.occupation === "working"}
                                    onChange={(e) => handleSiblingOccupationChange(index, e)}
                                    disabled={approvalStatus?.approved}
                                    className="text-[#c61d23] focus:ring-[#c61d23]"
                                  />
                                  Working
                                </label>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              {sibling.occupation === "working" ? (
                                <input
                                  type="text"
                                  name="studyingIn"
                                  value={sibling.studyingIn}
                                  onChange={(e) => handleSiblingChange(index, e)}
                                  disabled={approvalStatus?.approved}
                                  placeholder="Company/Org"
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c61d23] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                              ) : (
                                <select
                                  name="studyingIn"
                                  value={sibling.studyingIn}
                                  onChange={(e) => handleSiblingChange(index, e)}
                                  disabled={approvalStatus?.approved}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c61d23] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                  <option value="">Select Class</option>
                                  {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSibling(index)}
                                disabled={approvalStatus?.approved}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Signature Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PenTool size={18} className="text-[#c61d23]" />
                Digital Signatures
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "student", label: "Student Signature" },
                  { key: "parent", label: "Parent Signature (Should match with PAN)" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      {label}
                    </label>
                    <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                      <SignatureCanvas
                        ref={signatureRefs[key]}
                        penColor="black"
                        canvasProps={{
                          className: "w-full h-40 sm:h-48",
                          style: {
                            pointerEvents: approvalStatus?.approved ? "none" : "auto",
                          },
                        }}
                        onEnd={() => handleSignatureEnd(key)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => clearSignature(key)}
                      disabled={approvalStatus?.approved}
                      className="mt-2 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear Signature
                    </button>
                    {errors[key] && (
                      <span className="text-red-600 text-sm mt-1">{errors[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
                    submitMessage.includes("success") ? "text-emerald-500" : "text-red-500"
                  }`}
                />
                <p
                  className={`text-xs sm:text-sm font-semibold ${
                    submitMessage.includes("success") ? "text-emerald-700" : "text-red-700"
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
                onClick={() => navigate("/addressDetails")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || approvalStatus?.approved}
                className="flex-[2] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>{isSubmitting ? "Processing..." : "Next"}</span>
                {!isSubmitting && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <Spinner />}
    </div>
  );
};

export default SiblingsDetails;