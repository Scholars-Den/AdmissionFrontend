// DocumentCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const DocumentCarousel = ({
  documentRequired,
  uploads,
  userDetails,
  studentAdmissionApprovalDetails,
  uploading,
  handleFileUpload,
  setActiveDoc,
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}  
      className="max-w-lg p-7"
    >
      {documentRequired.map((doc) => {
        const uploadedImage = uploads[doc.name] || userDetails[doc.name]
        const isDisabled =
          studentAdmissionApprovalDetails?.documentsDetails?.[doc.name]
            ?.status

        return (
          <SwiperSlide key={doc.name}>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="w-full">
                {doc.label.length > 10 ? (
                  <h3 className="text-lg font-semibold text-[#c61d23] mb-2">
                    {doc.label.split(" ").map((item, index) => (
                      <span
                        key={index}
                        className={index < 3 ? "text-xl" : "text-sm"}
                      >{`${item} `}</span>
                    ))}
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
                  {!isDisabled && (
                    <div className="flex gap-2 mt-3" disabled={isDisabled}>
                      <label
                        className={`flex-1 text-center py-2 rounded cursor-pointer transition text-sm font-medium
                          ${
                            isDisabled
                              ? "bg-gray-300 cursor-not-allowed text-white"
                              : "bg-yellow-400 hover:bg-yellow-300"
                          }
                        `}
                      >
                        📁 Change from Device
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, doc.name)}
                          disabled={isDisabled}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => setActiveDoc(doc.name)}
                        className={`flex-1 text-white py-2 rounded transition text-sm font-medium 
                          ${
                            isDisabled
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }
                        `}
                        disabled={isDisabled}
                      >
                        📸 Retake Photo
                      </button>
                    </div>
                  )}
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
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
};

export default DocumentCarousel;
