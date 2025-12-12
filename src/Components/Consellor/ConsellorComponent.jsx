import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import {
  Search,
  X,
  CheckCircle,
  FileText,
  User,
  MapPin,
  Image,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Building,
  Send
} from 'lucide-react';

// Reusable Components
const Section = ({ title, icon: Icon, children, status, showCheckbox, onStatusChange }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
    {status !== undefined && (
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {showCheckbox && (
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-gray-700">Approved</span>
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => onStatusChange?.(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500/20 cursor-pointer"
            />
          </label>
        )}
        {!showCheckbox && (
          <div className={`${
            status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } text-xs px-2 py-1 rounded-full font-medium shadow`}>
            {status ? "✅ Approved" : "❌ Not Approved"}
          </div>
        )}
      </div>
    )}
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
      <Icon className="w-5 h-5 text-[#c61d23]" />
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
    <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
  </div>
);

const DocumentCard = ({ title, src, status, onStatusChange }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold text-gray-700">{title}</p>
      <input
        type="checkbox"
        checked={status}
        onChange={(e) => onStatusChange?.(e.target.checked)}
        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500/20 cursor-pointer"
      />
    </div>
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={title}
        className="w-full h-32 object-cover rounded border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
      />
    </a>
  </div>
);

const ConsellorComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { adminDetails } = useSelector((state) => state.adminDetails);

  const [studentDetailsStatus, setStudentDetailsStatus] = useState(false);
  const [parentDetailsStatus, setParentDetailsStatus] = useState(false);
  const [addressDetailsStatus, setAddressDetailsStatus] = useState(false);
  const [documentsDetailsStatus, setDocumentsDetailsStatus] = useState({
    studentAadhaar: false,
    parentAadhaar: false,
    studentPhoto: false,
  });
  const [signatureDetailsStatus, setSignatureDetailsStatus] = useState(false);

  const [showMessagePopup, setShowMessagePopup] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [filterByAckNumber, setFilterByAckNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const approvalByAssignedConsellor = async (page = 1) => {
    try {
      const response = await axios.get(
        `/approval/approvalByAssignedConsellor?page=${page}`
      );

      const { data, totalPages } = response.data;
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
      setPopupData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setAddressDetailsStatus(item?.addressDetails?.status);
    setParentDetailsStatus(item?.parentDetails?.status);
    setStudentDetailsStatus(item?.studentDetails?.status);
    setSignatureDetailsStatus(item?.signatureDetails?.status);
    setDocumentsDetailsStatus({
      studentAadhaar: item?.documentsDetails?.studentAadhaar?.status || false,
      parentAadhaar: item?.documentsDetails?.parentAadhaar?.status || false,
      studentPhoto: item?.documentsDetails?.studentPhoto?.status || false,
    });
    setShowPopup(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const submitMessage = async () => {
    if (message.length < 10) {
      setError("Message must be longer than 10 characters");
      return;
    }

    const unverifiedDocs = [];
    if (!documentsDetailsStatus.studentAadhaar) unverifiedDocs.push("Student Aadhar");
    if (!documentsDetailsStatus.parentAadhaar) unverifiedDocs.push("Parent Aadhar");
    if (!documentsDetailsStatus.studentPhoto) unverifiedDocs.push("Student Photo");

    const allDocumentsApproved = unverifiedDocs.length === 0;
    const documentDetailsMessage = allDocumentsApproved
      ? "The student document has been verified successfully."
      : `Some document could not be verified due to missing or invalid files`;

    const response = await axios.post("/approval/editAdmissionApproval", {
      status: showMessagePopup === "approved" ? "approved" : "rejected",
      acknowledgementNumber: selectedItem.acknowledgementNumber,
      message,
      studentDetails: {
        status: studentDetailsStatus,
        message: studentDetailsStatus ? "Student info verified" : "Student info not verified",
      },
      parentDetails: {
        status: parentDetailsStatus,
        message: parentDetailsStatus ? "Parent info verified" : "Parent info not verified",
      },
      addressDetails: {
        status: addressDetailsStatus,
        message: addressDetailsStatus ? "Bank info verified" : "Bank info not verified",
      },
      documentsDetails: {
        studentAadhaar: {
          status: documentsDetailsStatus.studentAadhaar,
          message: documentsDetailsStatus.studentAadhaar ? "Student info verified" : "Student info not verified",
        },
        parentAadhaar: {
          status: documentsDetailsStatus.parentAadhaar,
          message: documentsDetailsStatus.parentAadhaar ? "Student info verified" : "Student info not verified",
        },
        studentPhoto: {
          status: documentsDetailsStatus.studentPhoto,
          message: documentsDetailsStatus.studentPhoto ? "Student info verified" : "Student info not verified",
        },
        status: allDocumentsApproved,
        message: documentDetailsMessage,
      },
      signatureDetails: {
        status: signatureDetailsStatus,
        message: signatureDetailsStatus ? "Student info verified" : "Student info not verified",
      },
    });

    setShowMessagePopup("");
    setMessage("");
    await approvalByAssignedConsellor();
    setSelectedItem(null);
    setPopupData(null);
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setPopupData(null);
  };

  const submitButtonClickHandler = () => {
    const allDocumentsApproved = Object.values(documentsDetailsStatus).every(Boolean);
    setShowMessagePopup(
      parentDetailsStatus &&
        studentDetailsStatus &&
        addressDetailsStatus &&
        signatureDetailsStatus &&
        allDocumentsApproved
        ? "approved"
        : "rejected"
    );
  };

  const filter = async (page = 1) => {
    const response = await axios.get(
      `/approval/approvalByAssignedConsellor?page=${page}`
    );

    const { data, totalPages } = response.data;
    setPendingApproval(data);
    setFilterData(data);
    setCurrentPage(page);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    approvalByAssignedConsellor();
  }, []);

  useEffect(() => {
    filter();
  }, [filterByAckNumber]);

  const allDocumentsApproved = Object.values(documentsDetailsStatus).every(Boolean);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assigned Applications</h1>
              <p className="text-sm text-gray-600 mt-0.5">Review and approve student applications</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c61d23] to-red-700 rounded-lg shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">{filterData.length} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Acknowledgement Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] transition-all text-gray-900 placeholder-gray-400"
                placeholder="Enter acknowledgement number..."
                value={filterByAckNumber}
                onChange={(e) => setFilterByAckNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Approvals Table */}
          {filterData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
              <p className="text-gray-600">There are no applications assigned to you at the moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acknowledgement Number
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filterData.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handleCardClick(item)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#c61d23] transition-colors" />
                            <span className="text-sm font-medium text-gray-900">{item.acknowledgementNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <CheckCircle className="w-3 h-3" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => filterData ? filter(currentPage - 1) : approvalByAssignedConsellor(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => filterData ? filter(currentPage + 1) : approvalByAssignedConsellor(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showPopup && popupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#c61d23] to-red-700 px-6 py-4 flex items-center justify-between border-b border-white/10 z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Application Review</h2>
                <p className="text-white/80 text-sm mt-0.5">{popupData.acknowledgementNumber}</p>
              </div>
              <button onClick={closePopup} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Student Details */}
              <Section
                title="Student Details"
                icon={User}
                status={studentDetailsStatus}
                showCheckbox={true}
                onStatusChange={setStudentDetailsStatus}
              >
                <InfoGrid>
                  <InfoItem label="Acknowledgement Number" value={popupData.acknowledgementNumber} />
                  <InfoItem label="Aadhaar ID" value={popupData.aadhaarID} />
                  <InfoItem label="Student Name" value={popupData.studentName} />
                  <InfoItem label="Class" value={popupData.studentClass} />
                  <InfoItem label="Gender" value={popupData.gender} />
                  <InfoItem label="Program" value={popupData.program} />
                  <InfoItem label="Category" value={popupData.category} />
                </InfoGrid>
              </Section>

              {/* Parent Details */}
              <Section
                title="Parent Details"
                icon={User}
                status={parentDetailsStatus}
                showCheckbox={true}
                onStatusChange={setParentDetailsStatus}
              >
                <InfoGrid>
                  <InfoItem label="Contact Number" value={popupData.studentContactNumber} />
                  <InfoItem label="Father's Name" value={popupData.fatherName} />
                  <InfoItem label="Father's Aadhaar" value={popupData.fatherAadhaarID} />
                  <InfoItem label="Father's Occupation" value={popupData.fatherOccupations} />
                  <InfoItem label="Mother's Name" value={popupData.motherName} />
                  <InfoItem label="Mother's Aadhaar" value={popupData.motherAadhaarID} />
                  <InfoItem label="Mother's Occupation" value={popupData.motherOccupations} />
                </InfoGrid>
              </Section>

              {/* Bank Details */}
              <Section
                title="Bank Details"
                icon={Building}
                status={addressDetailsStatus}
                showCheckbox={true}
                onStatusChange={setAddressDetailsStatus}
              >
                <InfoGrid>
                  <InfoItem label="Bank Name" value={popupData.bankName} />
                  <InfoItem label="Account Holder" value={popupData.accountHolder} />
                  <InfoItem label="Account Number" value={popupData.accountNumber} />
                  <InfoItem label="IFSC Code" value={popupData.ifscCode} />
                </InfoGrid>
              </Section>

              {/* Documents */}
              <Section
                title="Documents"
                icon={Image}
                status={allDocumentsApproved}
                showCheckbox={false}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popupData.studentPhoto && (
                    <DocumentCard
                      title="Student Photo"
                      src={popupData.studentPhoto}
                      status={documentsDetailsStatus.studentPhoto}
                      onStatusChange={(checked) =>
                        setDocumentsDetailsStatus((prev) => ({ ...prev, studentPhoto: checked }))
                      }
                    />
                  )}
                  {popupData.studentAadhaar && (
                    <DocumentCard
                      title="Student Aadhaar"
                      src={popupData.studentAadhaar}
                      status={documentsDetailsStatus.studentAadhaar}
                      onStatusChange={(checked) =>
                        setDocumentsDetailsStatus((prev) => ({ ...prev, studentAadhaar: checked }))
                      }
                    />
                  )}
                  {popupData.parentAadhaar && (
                    <DocumentCard
                      title="Parent Aadhaar"
                      src={popupData.parentAadhaar}
                      status={documentsDetailsStatus.parentAadhaar}
                      onStatusChange={(checked) =>
                        setDocumentsDetailsStatus((prev) => ({ ...prev, parentAadhaar: checked }))
                      }
                    />
                  )}
                </div>
              </Section>

              {/* Signatures */}
              <Section
                title="Signatures"
                icon={PenTool}
                status={signatureDetailsStatus}
                showCheckbox={true}
                onStatusChange={setSignatureDetailsStatus}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Student Signature</p>
                    <img
                      src={popupData.signatures?.student}
                      alt="Student Signature"
                      className="w-full h-20 object-contain bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Parent Signature</p>
                    <img
                      src={popupData.signatures?.parent}
                      alt="Parent Signature"
                      className="w-full h-20 object-contain bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>
              </Section>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={submitButtonClickHandler}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c61d23] to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-red-500/30 active:scale-95"
              >
                <Send className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`px-6 py-4 flex items-center justify-between border-b ${
              showMessagePopup === "approved"
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-red-600 to-red-700"
            }`}>
              <h2 className="text-xl font-bold text-white">
                {showMessagePopup === "approved" ? "Approve Application" : "Reject Application"}
              </h2>
              <button
                onClick={() => setShowMessagePopup("")}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter your message (minimum 10 characters)..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] transition-all text-gray-900 placeholder-gray-400 resize-none"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                  }}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={submitMessage}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${
                  showMessagePopup === "approved"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                } text-white font-semibold rounded-lg transition-all shadow-lg active:scale-95`}
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsellorComponent;