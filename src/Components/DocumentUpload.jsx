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

const DocumentUpload = ({ documentRequired }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData: userDetails } = useSelector((state) => state.userDetails);
  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [showError, setShowError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [cameraFacing, setCameraFacing] = useState("Front");
  const [isCapturing, setIsCapturing] = useState(false);

  const isAnyUploading = Object.values(uploading).some((v) => v);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails?.acknowledgementNumber) {
      dispatch(
        fetchAdmissionApprovalMessage(userDetails?.acknowledgementNumber)
      );
    }

    console.log("userDetaisls", userDetails);
  }, [userDetails]);

  useEffect(() => {
    if (activeDoc) getCamera();
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
    setLoading(true);
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
    if (studentAdmissionApprovalDetails[0]?.studentDetails?.status) {
      return;
    }
    const { name, value, checked } = e.target;

    console.log("name, checked", name, checked);

    if (name === "termsAndCondition") {
      dispatch(updateUserDetails({ [name]: e.target.checked }));
      return;
    }

    dispatch(updateUserDetails({ [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const uploadToCloudinary = async (dataUrl, docType) => {
    setUploading((prev) => ({ ...prev, [docType]: true }));
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append(
        "file",
        blob,
        `${userDetails.studentName}_${docType}.png`
      );
      formData.append("upload_preset", "ProfilePictures");
      formData.append("cloud_name", "dtytgoj3f");
      formData.append(
        "folder",
        `admissionsDoc/${userDetails.acknowledgementNumber}`
      );

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
        await dispatch(
          putFormData({ ...userDetails, [docType]: data.secure_url })
        );
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

  const allUploaded = documentRequired.every(
    (doc) => uploads[doc.name] || userDetails[doc.name]
  );

  const onClickNext = async () => {
    console.log("ONCLickNext");
    await dispatch(putFormData(userDetails));
    const responseData = await dispatch(submitBankRefundForm());

    console.log("responseData", responseData);

    navigate("/admissionComplete");
  };

  const activeDocLabel =
    documentRequired.find((doc) => doc.name === activeDoc)?.label || activeDoc;

  return (
    <div className="w-full min-h-screen bg-[#c61d23] px-4 py-6 flex flex-col items-center relative">
      {isAnyUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-12 w-12 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="text-white text-lg font-semibold">
              Uploading Document...
            </p>
          </div>
        </div>
      )}

      {/* Your rest of the UI */}

      {/* <div className="w-full min-h-screen bg-[#c61d23] px-4 py-6 flex flex-col items-center"> */}
      {studentAdmissionApprovalDetails?.documentsDetails && (
        <div className="flex flex-col w-full gap-4 justify-end items-end mb-4">
          <span
            className={`${
              studentAdmissionApprovalDetails?.documentsDetails.status
                ? "bg-green-500"
                : "bg-red-500 text-white"
            } p-2 rounded-xl`}
          >
            {studentAdmissionApprovalDetails?.documentsDetails.status
              ? "Approved"
              : studentAdmissionApprovalDetails?.documentsDetails?.message}
          </span>
        </div>
      )}

      <h2 className="text-white text-2xl m-1 font-semibold">
        Upload Required Documents
      </h2>

      <DocumentCarousel
        documentRequired={documentRequired}
        uploads={uploads}
        userDetails={userDetails}
        studentAdmissionApprovalDetails={studentAdmissionApprovalDetails}
        uploading={uploading}
        handleFileUpload={handleFileUpload}
        setActiveDoc={setActiveDoc}
      />

      {/* <div className="flex w-full justify-between">
        <button
          type="button"
          className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
          onClick={() => navigate("/siblingsDetails")}
        >
          Back
        </button>
        <button
          className={`mt-6 border-2 px-4 py-2 rounded font-medium transition ${
            allUploaded
              ? "bg-[#ffd700] text-black hover:bg-[#ffdd00]"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          type="button"
          onClick={() => onClickNext()}
          disabled={!allUploaded}
        >
          Next
        </button>
      </div> */}

      <div className="flex gap-1 text-xl mt-5  justify-center items-center">
        <input
          type="checkbox"
          name="termsAndCondition"
          value={Boolean(userDetails?.termsAndCondition)}
          checked={Boolean(userDetails?.termsAndCondition)} // Ensure it's a boolean
          onChange={handleChange}
          className="cursor-pointer"
        />
        <label className="p-1 text-white ">
          I agree to{" "}
          <Link to="/termsAndConditions" className="text-[#ffdd00]  underline">
            Terms & Conditions
          </Link>
        </label>
      </div>
      {/* {errors.termsAndCondition && (
          <span className="text-white text-sm">{errors.termsAndCondition}</span>
        )} */}

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6 w-full">
        <button
          onClick={() => navigate("/siblingsDetails")}
          type="button"
          className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
        >
          Back
        </button>

        {console.log(
          "userDetaisl.termsAndConditions",
          userDetails.termsAndCondition
        )}
        <button
          className={`w-full sm:w-2/3 border  hover:bg-yellow-600 text-black py-2 rounded-xl transition-all  ${
            allUploaded && userDetails.termsAndCondition
              ? "bg-[#ffd700] text-black hover:bg-[#ffdd00]"
              : "bg-yellow-600 text-gray-600 cursor-not-allowed"
          }`}
          type="button"
          onClick={() => {

            console.log("allUploaded userDetails.termsAndCondition", allUploaded, userDetails.termsAndCondition)
            if (allUploaded && userDetails.termsAndCondition) onClickNext();
          }}
          disabled={!allUploaded && !userDetails.termsAndCondition}
        >
          Next
        </button>
      </div>

      {activeDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <h3 className="text-center text-lg font-bold text-[#c61d23] mb-2">
              Capture {activeDocLabel}
            </h3>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded w-full aspect-video object-cover"
            />
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={handleCapture}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Capturing...
                  </>
                ) : (
                  "✅ Capture"
                )}
              </button>
              <button
                onClick={() =>
                  setCameraFacing((prev) =>
                    prev === "Front" ? "Back" : "Front"
                  )
                }
                className="bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                🔄 Switch Camera ({cameraFacing})
              </button>
              <button
                onClick={() => setActiveDoc(null)}
                className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentUpload;
