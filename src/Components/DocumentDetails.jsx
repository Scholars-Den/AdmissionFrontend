// import DocumentUpload from "./DocumentUpload";
// import SignupDetailsPage from "./SignupDetailsPage";
// import scholarsDenLogo from "../assets/scholarsdenLogo.png";

// const DocumentDetails = () => {
//   const documentRequired = [
//     { label: "Student Aadhaar Card", name: "studentAadhaar" },
//     { label: "Student Photo", name: "studentPhoto" },
//     {
//       label: "Guardian Aadhaar Card (Upload the Aadhaar card of one of the parents or guardian mentioned in the student’s Aadhaar.)",
//       name: "parentAadhaar",
//     },
//     // { label: "Passbook", name: "passbookPhoto" },
//     // { label: "Cancelled Cheque", name: "cancelledCheque" },
//   ];

//   return (
//     <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
//       <div className="flex-grow">
//         <SignupDetailsPage />
//       </div>

//       <div className="flex-grow">
//         <DocumentUpload documentRequired={documentRequired} />
//       </div>

//       <div className="flex justify-center items-center py-4">
//         <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
//       </div>
//     </div>
//   );
// };

// export default DocumentDetails;















import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchUserDetails,
  updateUserDetails,
  putFormData,
  submitBankRefundForm,
} from "../../redux/formDataSlice";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";
import DocumentCarousel from "./Swiper";
import { setLoading } from "../../redux/loadingSlice";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Camera,
  Upload,
  Loader2,
  SwitchCamera,
  X,
} from "lucide-react";

// const DocumentUpload = ({ documentRequired }) => {
const DocumentUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData: userDetails } = useSelector((state) => state.userDetails);
  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

    const documentRequired = [
    { label: "Student Aadhaar Card", name: "studentAadhaar" },
    { label: "Student Photo", name: "studentPhoto" },
    {
      label: "Guardian Aadhaar Card (Upload the Aadhaar card of one of the parents or guardian mentioned in the student’s Aadhaar.)",
      name: "parentAadhaar",
    },
    // { label: "Passbook", name: "passbookPhoto" },
    // { label: "Cancelled Cheque", name: "cancelledCheque" },
  ];

  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [showError, setShowError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [isCapturing, setIsCapturing] = useState(false);

  const isAnyUploading = Object.values(uploading).some((v) => v);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userDetails?.acknowledgementNumber));
    }
  }, [userDetails, dispatch]);

  useEffect(() => {
    if (studentAdmissionApprovalDetails?.documentsDetails) {
      setApprovalStatus({
        approved: studentAdmissionApprovalDetails.documentsDetails.status,
        message: studentAdmissionApprovalDetails.documentsDetails.message || 
                 (studentAdmissionApprovalDetails.documentsDetails.status ? "Approved" : "Pending Review"),
      });
    }
  }, [studentAdmissionApprovalDetails]);

  useEffect(() => {
    if (activeDoc) getCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacing, activeDoc]);

  const getCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setShowError("Could not access camera.");
    }
  };

  const handleCapture = async () => {
    if (!activeDoc) return;
    setIsCapturing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");

    await uploadToCloudinary(image, activeDoc);
    setIsCapturing(false);
  };

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadToCloudinary(reader.result, docType);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    if (approvalStatus?.approved) return;

    const { name, checked } = e.target;

    if (name === "termsAndCondition") {
      dispatch(updateUserDetails({ [name]: checked }));
    }
  };

  const uploadToCloudinary = async (dataUrl, docType) => {
    setUploading((prev) => ({ ...prev, [docType]: true }));
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, `${userDetails.studentName}_${docType}.png`);
      formData.append("upload_preset", "ProfilePictures");
      formData.append("cloud_name", "dtytgoj3f");
      formData.append("folder", `admissionsDoc/${userDetails.acknowledgementNumber}`);

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtytgoj3f/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        const updated = { ...uploads, [docType]: data.secure_url };
        setUploads(updated);

        await dispatch(updateUserDetails({ [docType]: data.secure_url }));
        await dispatch(putFormData({ ...userDetails, [docType]: data.secure_url }));
      } else {
        setShowError("Upload failed. Try again.");
      }
    } catch (err) {
      console.log("error in uploading", err);
      setShowError("Error uploading. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
      setActiveDoc(null);
    }
  };

  const allUploaded = documentRequired?.every(
    (doc) => uploads[doc.name] || userDetails[doc.name]
  );

  const onClickNext = async () => {
    if (!allUploaded || !userDetails.termsAndCondition) return;

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      await dispatch(putFormData(userDetails));
      await dispatch(submitBankRefundForm());

      setSubmitMessage("Documents submitted successfully!");

      setTimeout(() => {
        navigate("/admissionComplete");
      }, 1000);
    } catch (error) {
      console.log("Error submitting:", error);
      setSubmitMessage("Error submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const activeDocLabel =
    documentRequired?.find((doc) => doc.name === activeDoc)?.label || activeDoc;

  return (
    <div className="min-h-screen w-full max-w-[768px] mx-auto bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c61d23] to-[#a01818]">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c61d23] to-[#a01818]">
                  Document Upload
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Upload required documents
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
                Required Documents
              </h3>
              <div className="text-xs sm:text-sm text-gray-600">Step 5 of 5</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] h-2 rounded-full transition-all duration-300"
                style={{ width: "100%" }}
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

          {/* Document Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Upload Documents
            </h3>
            
            <DocumentCarousel
              documentRequired={documentRequired}
              uploads={uploads}
              userDetails={userDetails}
              studentAdmissionApprovalDetails={studentAdmissionApprovalDetails}
              uploading={uploading}
              handleFileUpload={handleFileUpload}
              setActiveDoc={setActiveDoc}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="termsAndCondition"
                checked={Boolean(userDetails?.termsAndCondition)}
                onChange={handleChange}
                disabled={approvalStatus?.approved}
                className="mt-1 w-4 h-4 text-[#c61d23] border-gray-300 rounded focus:ring-2 focus:ring-[#c61d23] disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                I agree to{" "}
                <Link
                  to="/termsAndConditions"
                  className="text-[#c61d23] font-semibold hover:underline"
                >
                  Terms & Conditions
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div
              className={`mb-4 p-3 sm:p-4 rounded-xl border-2 flex items-start gap-2 sm:gap-3 ${
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
              onClick={() => navigate("/siblingsDetails")}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              type="button"
              onClick={onClickNext}
              disabled={!allUploaded || !userDetails.termsAndCondition || isSubmitting || approvalStatus?.approved}
              className="flex-[2] flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span>{isSubmitting ? "Processing..." : "Submit"}</span>
              {!isSubmitting && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {activeDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Capture {activeDocLabel}
              </h3>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover rounded-lg bg-gray-900 mb-4"
            />
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Capture Photo
                  </>
                )}
              </button>
              
              <button
                onClick={() => setCameraFacing(prev => prev === "user" ? "environment" : "user")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
              >
                <SwitchCamera size={18} />
                Switch Camera ({cameraFacing === "user" ? "Front" : "Back"})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Loading Overlay */}
      {isAnyUploading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 size={48} className="text-[#c61d23] animate-spin" />
            <p className="text-gray-900 text-lg font-semibold text-center">
              Uploading Document...
            </p>
            <p className="text-gray-600 text-sm text-center">
              Please wait while we upload your document
            </p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentUpload;