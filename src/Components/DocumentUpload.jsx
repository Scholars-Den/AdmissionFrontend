import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserDetails,
  updateUserDetails,
  putFormData,
} from "../../redux/formDataSlice";

const DocumentUpload = ({ documentRequired }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData: userDetails } = useSelector((state) => state.userDetails);

  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [showError, setShowError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [cameraFacing, setCameraFacing] = useState("user");

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

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
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    await uploadToCloudinary(image, activeDoc);
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

  const uploadToCloudinary = async (dataUrl, docType) => {
    setUploading((prev) => ({ ...prev, [docType]: true }));
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, `${userDetails.name}_${docType}.png`);
      formData.append("upload_preset", "ProfilePictures");
      formData.append("cloud_name", "dtytgoj3f");
      formData.append("folder", "SDAT270425Image");

      const oldImageUrl = userDetails[docType];

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

  const activeDocLabel =
    documentRequired.find((doc) => doc.name === activeDoc)?.label || activeDoc;

  return (
    <div className="w-full min-h-screen bg-[#c61d23] px-4 py-6 flex flex-col items-center">
      <h2 className="text-white text-2xl mb-6 font-semibold">
        Upload Required Documents
      </h2>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentRequired.map((doc) => {
          const uploadedImage = uploads[doc.name] || userDetails[doc.name] || userDetails?.documents?.[doc.name];

          return (
            <div key={doc.name} className="bg-white rounded-xl p-4 shadow">
              <div className="w-1/2">
                {doc.label.length > 10 ? (
                  <h3 className="text-lg font-semibold text-[#c61d23] mb-2">
                    {doc.label.split(" ").map((item, index) => {
                      return index < 3 ? (
                        <span
                          key={index}
                          className="text-xl"
                        >{`${item} `}</span>
                      ) : (
                        <span
                          key={index}
                          className="text-sm"
                        >{`${item} `}</span>
                      );
                    })}
                  </h3>
                ) : (
                  <h3 className="text-lg font-semibold text-[#c61d23] mb-2">
                    {doc.label}
                  </h3>
                )}
              </div>

              {uploadedImage !== "" ? (
                <>
                  <img
                    src={uploadedImage}
                    alt={doc.label}
                    className="w-full aspect-video object-cover rounded"
                  />

                  {uploads[doc.name] && (
                    <p className="text-green-600 mt-2 text-sm">
                      Uploaded successfully
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <label className="flex-1 bg-yellow-400 text-center py-2 rounded cursor-pointer hover:bg-yellow-300 transition text-sm font-medium">
                      📁 Change from Device
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, doc.name)}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => setActiveDoc(doc.name)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                    >
                      📸 Retake Photo
                    </button>
                  </div>
                </>
              ) : uploading[doc.name] ? (
                <p className="text-gray-600 text-sm">Uploading...</p>
              ) : (
                <>
                  <label className="block w-full cursor-pointer bg-yellow-400 text-center py-2 rounded hover:bg-yellow-300 transition">
                    📁 Upload from device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, doc.name)}
                      className="hidden"
                    />
                  </label>
                  <button
                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => setActiveDoc(doc.name)}
                  >
                    📸 Capture via Camera
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* {allUploaded && ( */}
      <div className="flex w-full justify-between ">
        <button
          type="button"
          className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
          onClick={() => navigate("/siblingsDetails")}
        >
          Back
        </button>
        <button
          className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
          type="button"
          onClick={() => navigate("/bankRefund")}
        >
          Next
        </button>
      </div>
      {/* )} */}

      {/* Camera Modal */}
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
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                ✅ Capture
              </button>
              <button
                onClick={() =>
                  setCameraFacing((prev) =>
                    prev === "user" ? "environment" : "user"
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

      {/* {showError && (
        <p className="text-center text-red-500 text-sm mt-4">{showError}</p>
      )} */}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentUpload;
