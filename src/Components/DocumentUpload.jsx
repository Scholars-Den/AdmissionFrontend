import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { submitUserDetails } from "../redux/slices/userDeailsSlice";
// import FormHeader from "./LoginSugnup/FormHeader";

const DocumentUpload = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [showError, setShowError] = useState("");
  const [cameraFacing, setCameraFacing] = useState("user"); // 'user' or 'environment'

  const navigate = useNavigate();
  const { userData: userDetails } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    profilePicture: userDetails?.profilePicture || null,
  });

  const getCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowError("Could not access camera.");
    }
  };

  useEffect(() => {
    getCamera();
  }, [cameraFacing]);

  const handleCapture = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");

    setCapturedImage(image);
    uploadToCloudinary(image);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        // uploadToCloudinary(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

//   const uploadToCloudinary = async (dataUrl) => {
//     setUploading(true);
//     try {
//       const blob = await (await fetch(dataUrl)).blob();
//       const formDataToSend = new FormData();
//       formDataToSend.append(
//         "file",
//         blob,
//         userDetails.name + "_" + userDetails.StudentsId + ".png"
//       );
//       formDataToSend.append("upload_preset", "ProfilePictures");
//       formDataToSend.append("cloud_name", "dtytgoj3f");
//       formDataToSend.append("folder", "SDAT270425Image");

//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/dtytgoj3f/image/upload`,
//         {
//           method: "POST",
//           body: formDataToSend,
//         }
//       );

//       const data = await response.json();
//       if (data.secure_url) {
//         const updatedFormData = {
//           ...formData,
//           profilePicture: data.secure_url,
//         };

//         setFormData(updatedFormData);
//         dispatch(submitUserDetails(updatedFormData));
//         setUploadedUrl(data.secure_url);
//       } else {
//         setShowError("Upload failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       setShowError("Something went wrong");
//     } finally {
//       setUploading(false);
//     }
//   };

  return (
    <div className="min-h-screen w-full bg-[#c61d23] px-2 md:px-8 py-2 overflow-auto">
      <div className="flex flex-col justify-center items-center gap-6 max-w-screen-md mx-auto">
        <div>
          {/* <FormHeader /> */}
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-4">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-xl w-full aspect-square object-cover"
              />

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleCapture}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                  Capture the student's selfie
                </button>

                <button
                  onClick={() =>
                    setCameraFacing((prev) =>
                      prev === "user" ? "environment" : "user"
                    )
                  }
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition"
                >
                  Switch Camera
                </button>

                <label className="w-full text-center cursor-pointer bg-gray-200 py-2 rounded-xl text-black hover:bg-gray-300 transition">
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="rounded-xl w-full aspect-square object-cover"
              />
              {uploading ? (
                <p className="text-center text-gray-500 mt-2">Uploading...</p>
              ) : uploadedUrl ? (
                <div className="text-center mt-2">
                  <p className="text-green-600">Upload successful!</p>
                  <button
                    className="mt-4 w-full bg-[#ffdd00] hover:bg-[#e2e242] text-black py-2 px-4 rounded-xl transition"
                    onClick={() => navigate("/registration/payment")}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <p className="text-center text-red-500 mt-2">Upload failed.</p>
              )}
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setUploadedUrl("");
                  getCamera();
                }}
                className="mt-4 w-full bg-[#ffdd00] text-black py-2 px-4 rounded-xl hover:bg-[#e2e242] transition"
              >
                Retake
              </button>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {showError && (
          <p className="text-xl mt-5 text-[#c61d23]">{showError}</p>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
