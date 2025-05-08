

import { useDispatch } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";

const ApprovalCompleteComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // for popup content
  const [popupData, setPopupData] = useState(null); // fetched details
  const [showPopup, setShowPopup] = useState(false);

  // const dispatch = useDispatch

  const fetchApprovedData = async () => {
    try {
      const response = await axios.get("/approval/completedApproval");



      console.log("response data from fetchApprovedData", response);
      setPendingApproval(response.data.data);
    } catch (error) {
      console.error("Error fetching pending approval data:", error);
    }
  };

  const fetchDetailsByAcknowledgement = async (ackNumber) => {
    try {
      const response = await axios.get(`/approval/details/${ackNumber}`);

      console.log("response data data", response.data.data);

      setPopupData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const handleClickApproved = async() => {
    console.log("selectedItem", selectedItem);

    const response = await axios.post("/approval/editAdmissionApproval", {
      status: "approved",
      acknowledgementNumber: selectedItem.acknowledgementNumber,
    });

    await fetchApprovedData();

    setSelectedItem(null);
    setPopupData(null);
    setShowPopup(false);

    console.log("handleClickApproved response", response);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setPopupData(null);
  };

  useEffect(() => {
    fetchApprovedData();
  }, []);

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div className="p-6 rounded w-full min-h-screen overflow-auto ">
        {pendingApproval.length === 0 ? (
          <p className="text-black text-center">No pending approvals</p>
        ) : (
          pendingApproval.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded p-4 mb-4 shadow-md text-gray-800 cursor-pointer hover:bg-gray-200 transition"
            >
              <div>
                <strong>Acknowledgement Number:</strong>{" "}
                {item.acknowledgementNumber}
              </div>
              <div>
                <strong>Status:</strong> {item.status}
              </div>
              <div>
                <strong>Message:</strong> {item.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Details</h2>
            {popupData ? (
              <div className="space-y-4 overflow-y-auto max-h-[70vh] text-sm text-gray-800">
                <section>
                  <h3 className="text-lg font-semibold mb-1">
                    Student Details
                  </h3>
                  <p>
                    <strong>Acknowledgement Number:</strong>{" "}
                    {popupData.acknowledgementNumber}
                  </p>
                  <p>
                    <strong>Aadhaar ID:</strong> {popupData.aadharID}
                  </p>
                  <p>
                    <strong>Student Name:</strong> {popupData.studentName}
                  </p>
                  <p>
                    <strong>Class:</strong> {popupData.studentClass}
                  </p>
                  <p>
                    <strong>Gender:</strong> {popupData.gender}
                  </p>
                  <p>
                    <strong>Program:</strong> {popupData.program}
                  </p>
                  <p>
                    <strong>Category:</strong> {popupData.category}
                  </p>
                  <p>
                    <strong>Parent's Contact:</strong>{" "}
                    {popupData.parentsContactNumber}
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-1">Parent Details</h3>
                  <p>
                    <strong>Father's Name:</strong> {popupData.fatherName}
                  </p>
                  <p>
                    <strong>Father's Aaadhaar Card:</strong>{" "}
                    {popupData.fatherAadharId}
                  </p>
                  <p>
                    <strong>Father's Occupations:</strong>{" "}
                    {popupData.fatherOccupations}
                  </p>
                  <p>
                    <strong>Mother's Name:</strong> {popupData.motherName}
                  </p>
                  <p>
                    <strong>Mother's Aaadhaar Card:</strong>{" "}
                    {popupData.motherAadharId}
                  </p>
                  <p>
                    <strong>Mother's Occupations:</strong>{" "}
                    {popupData.motherOccupations}
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-1">Bank Details</h3>
                  <p>
                    <strong>Bank Name:</strong> {popupData.bankName}
                  </p>
                  <p>
                    <strong>Account Holder:</strong> {popupData.accountHolder}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {popupData.accountNumber}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong> {popupData.ifscCode}
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-1">Student Photo</h3>
                  <a
                    href={popupData.studentPhoto}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={popupData.studentPhoto}
                      alt="Student"
                      className="w-28 h-28 object-cover border rounded hover:scale-105 transition"
                    />
                  </a>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-1">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {popupData.cancelledCheque && (
                      <div>
                        <p className="font-medium">Cancelled Cheque</p>
                        <a
                          href={popupData.cancelledCheque}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.cancelledCheque}
                            alt="Cancelled Cheque"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
                    {popupData.passbookPhoto && (
                      <div>
                        <p className="font-medium">Passbook</p>
                        <a
                          href={popupData.passbookPhoto}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.passbookPhoto}
                            alt="Passbook"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
                    {popupData.studentAadhar && (
                      <div>
                        <p className="font-medium">Student Aadhar</p>
                        <a
                          href={popupData.studentAadhar}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.studentAadhar}
                            alt="Student Aadhar"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
                    {popupData.parentAadhar && (
                      <div>
                        <p className="font-medium">Parent Aadhar</p>
                        <a
                          href={popupData.parentAadhar}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.parentAadhar}
                            alt="Parent Aadhar"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-1">Signatures</h3>
                  <div className="flex space-x-4">
                    <div>
                      <p className="font-medium">Student</p>
                      <img
                        src={popupData.signatures.student}
                        alt="Student Signature"
                        className="w-28 h-12 border rounded object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Parent</p>
                      <img
                        src={popupData.signatures.parent}
                        alt="Parent Signature"
                        className="w-28 h-12 border rounded object-contain"
                      />
                    </div>
                  </div>
                </section>

              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalCompleteComponent;
