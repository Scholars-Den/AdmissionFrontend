import { useDispatch } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";

const ApprovalRejectedComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // for popup content
  const [popupData, setPopupData] = useState(null); // fetched details
  const [showPopup, setShowPopup] = useState(false);

  const [filterData, setFilterData] = useState([]);
  const [filterByAckNumber, setFilterByAckNumber] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [approvalData, setApprovalData] = useState(null);

  // const dispatch = useDispatch

  const fetchApprovedData = async (page = 1) => {
    try {
      const response = await axios.get(
        `/approval/rejectedApproval?page=${page}`
      );

      const { data, totalPages } = response.data;
      console.log("response data from fetchApprovedData", response.data);
      setPendingApproval(data);
      setFilterData(data);
      setCurrentPage(page);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching pending approval data:", error);
    }
  };

  const fetchDetailsByAcknowledgement = async (ackNumber) => {
    try {
      const response = await axios.get(`/approval/details/${ackNumber}`);
      console.log("response from fetchDetailsByAcknowledge", response);

      console.log("response data data", response.data.data);

      setPopupData(response?.data?.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
    handleClickApproved(item);
  };

  const handleClickApproved = async (item) => {
    console.log("selectedItem", selectedItem);

    const response = await axios.post(
      "/approval/getAdmissionApprovalByAcknowledgementNumber",
      {
        acknowledgementNumber: item.acknowledgementNumber,
      }
    );

    setApprovalData(response.data.data);
    console.log("data form handleClcikApproval", response);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setPopupData(null);
  };

  useEffect(() => {
    fetchApprovedData();
  }, []);

  const filter = async () => {
    console.log("this filter is working");

    setFilterData((prev) =>
      pendingApproval.filter((item) =>
        item.acknowledgementNumber?.includes(filterByAckNumber)
      )
    );
  };
  useEffect(() => {
    if (filterByAckNumber) filter();
    else setFilterData(pendingApproval);
  }, [filterByAckNumber]);

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div className="p-6 pt-2 rounded w-full min-h-screen ">
        <div className="mb-6">
          <div className="flex flex-col ">
            <label className="text-base" htmlFor="">
              Search By Acknowledgement Number
            </label>
            <div className="flex items-center gap-2 w-full ">
              <input
                type="text"
                className="p-2 rounded-lg w-1/2"
                placeholder="Search By Acknowledgement Number"
                value={filterByAckNumber}
                onChange={(e) => setFilterByAckNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filterData.length === 0 ? (
          <p className="text-black text-center">No pending approvals</p>
        ) : (
          filterData.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item)}
              className="relative bg-white rounded p-4 mb-4 shadow-md text-gray-800 cursor-pointer hover:bg-gray-200 transition"
            >
              <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium shadow">
                ❌ Rejected
              </div>

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

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => fetchApprovedData(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => fetchApprovedData(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
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
                  <div className="flex justify-between pr-5 relative">
                    <h3 className="text-lg font-semibold mb-1">
                      Student Details
                    </h3>

                    <div
                      className={`absolute top-2 right-2  ${
                        approvalData?.studentDetails?.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700 "
                      } text-xs px-2 py-1 rounded-full font-medium shadow`}
                    >
                      {approvalData?.studentDetails?.status
                        ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                  </div>
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
                  <div className="flex justify-between pr-5 relative">
                    <h3 className="text-lg font-semibold mb-1">
                      Parent Details
                    </h3>
                    <div
                      className={`absolute top-2 right-2  ${
                        approvalData?.parentDetails?.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700 "
                      } text-xs px-2 py-1 rounded-full font-medium shadow`}
                    >
                      {approvalData?.parentDetails?.status
                        ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                  </div>
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
                  <div className="flex justify-between pr-5 relative">
                    <h3 className="text-lg font-semibold mb-1">Bank Details</h3>
                    <div
                      className={`absolute top-2 right-2  ${
                        approvalData?.bankDetails?.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700 "
                      } text-xs px-2 py-1 rounded-full font-medium shadow`}
                    >
                      {approvalData?.bankDetails?.status
                        ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                  </div>
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
{/* 
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
                </section> */}

                <section>
                  <div className="flex justify-between pr-5 relative">
                    <h3 className="text-lg font-semibold mb-1">Documents</h3>
                    <div
                      className={`absolute top-2 right-2  ${
                        approvalData?.documentsDetails?.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700 "
                      } text-xs px-2 py-1 rounded-full font-medium shadow`}
                    >
                      {approvalData?.documentsDetails?.status
                        ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {popupData.studentPhoto && (
                      <div>
                        <p className="font-medium">Student Photo</p>
                        <a
                          href={popupData.studentPhoto}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.studentPhoto}
                            alt="Cancelled Cheque"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
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
                  <div className="flex justify-between pr-5 relative">
                    <h3 className="text-lg font-semibold mb-1">Signatures</h3>
                    <div
                      className={`absolute top-2 right-2  ${
                        approvalData?.signatureDetails?.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700 "
                      } text-xs px-2 py-1 rounded-full font-medium shadow`}
                    >
                      {approvalData?.signatureDetails?.status
                        ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                  </div>
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

export default ApprovalRejectedComponent;
