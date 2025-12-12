import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  CreditCard,
  DollarSign,
  Receipt,
  Eye
} from 'lucide-react';

// Reusable Components
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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

const DocumentCard = ({ title, src }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={title}
        className="w-full h-32 object-cover rounded border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
      />
    </a>
  </div>
);

const CashierComponent = () => {
  const [approval, setApproval] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [filterByAckNumber, setFilterByAckNumber] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [receiptId, setReceiptId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");

  const fetchApprovedData = async (page = 1) => {
    try {
      const response = await axios.get(`/approval/completedApproval?page=${page}`);
      const { data, totalPages } = response.data;
      setApproval(data);
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

  const handleProfileClick = (item) => {
    setShowProfile(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const handleCardClick = (item) => {
    setShowPopup(true);
    setSelectedItem(item);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowProfile(false);
    setPopupData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admission-admin/update-student", {
        receiptId,
        amountPaid,
        acknowledgementNumber: selectedItem.acknowledgementNumber,
      });

      toast.success("Amount and Receipt ID updated successfully!");

      fetchApprovedData();
      setShowProfile(false);
      setShowPopup(false);
      setReceiptId("");
      setAmountPaid("");
      setFormattedAmount("");
    } catch (error) {
      console.error("Error updating admission:", error);
      toast.error("Failed to update admission. Please try again.");
    }
  };

  const formatWithCommas = (value) => {
    const number = parseInt(value.replace(/,/g, ""), 10);
    if (isNaN(number)) return "";
    return number.toLocaleString();
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    setAmountPaid(raw);
    setFormattedAmount(formatWithCommas(raw));
  };

  const filter = async (page = 1) => {
    try {
      const data = await axios.post(`/approval/filterAdmissionApproval?page=${page}`, {
        status: "approved",
        acknowledgementNumber: filterByAckNumber,
      });
      setFilterData(data.data.data);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error filtering approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovedData();
  }, []);

  useEffect(() => {
    if (filterByAckNumber) filter();
    else setFilterData(approval);
  }, [filterByAckNumber]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Processing</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage approved student payments</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">{filterData.length} Approved</span>
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
          {filterData?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Approved Applications</h3>
              <p className="text-gray-600">There are no approved applications pending payment</p>
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
                      <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filterData?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#c61d23] transition-colors" />
                            <span className="text-sm font-medium text-gray-900">{item.acknowledgementNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {item.status.toLowerCase() === "approved" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProfileClick(item);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Profile
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(item);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              Add Payment
                            </button>
                          </div>
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
                    onClick={() => filterByAckNumber ? filter(currentPage - 1) : fetchApprovedData(currentPage - 1)}
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
                    onClick={() => filterByAckNumber ? filter(currentPage + 1) : fetchApprovedData(currentPage + 1)}
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

      {/* Profile Modal */}
      {showProfile && popupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-white/10 z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Student Profile</h2>
                <p className="text-white/80 text-sm mt-0.5">{popupData.acknowledgementNumber}</p>
              </div>
              <button onClick={closePopup} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Student Details */}
              <Section title="Student Details" icon={User}>
                <InfoGrid>
                  <InfoItem label="Acknowledgement Number" value={popupData.acknowledgementNumber} />
                  <InfoItem label="Aadhaar ID" value={popupData.aadhaarID} />
                  <InfoItem label="Student Name" value={popupData.studentName} />
                  <InfoItem label="Class" value={popupData.studentClass} />
                  <InfoItem label="Gender" value={popupData.gender} />
                  <InfoItem label="Contact" value={popupData.studentContactNumber} />
                  <InfoItem label="Program" value={popupData.program} />
                  <InfoItem label="Category" value={popupData.category} />
                </InfoGrid>
              </Section>

              {/* Parent Details */}
              <Section title="Parent Details" icon={User}>
                <InfoGrid>
                  <InfoItem label="Father's Name" value={popupData.fatherName} />
                  <InfoItem label="Father's Aadhaar" value={popupData.fatherAadhaarID} />
                  <InfoItem label="Father's Occupation" value={popupData.fatherOccupations} />
                  <InfoItem label="Mother's Name" value={popupData.motherName} />
                  <InfoItem label="Mother's Aadhaar" value={popupData.motherAadhaarID} />
                  <InfoItem label="Mother's Occupation" value={popupData.motherOccupations} />
                </InfoGrid>
              </Section>

              {/* Bank Details */}
              <Section title="Bank Details" icon={Building}>
                <InfoGrid>
                  <InfoItem label="Bank Name" value={popupData.bankName} />
                  <InfoItem label="Account Holder" value={popupData.accountHolder} />
                  <InfoItem label="Account Number" value={popupData.accountNumber} />
                  <InfoItem label="IFSC Code" value={popupData.ifscCode} />
                </InfoGrid>
              </Section>

              {/* Student Photo */}
              <Section title="Student Photo" icon={Image}>
                <a href={popupData.studentPhoto} target="_blank" rel="noreferrer">
                  <img
                    src={popupData.studentPhoto}
                    alt="Student"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                  />
                </a>
              </Section>

              {/* Documents */}
              <Section title="Documents" icon={Image}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popupData.studentAadhaar && (
                    <DocumentCard title="Student Aadhaar" src={popupData.studentAadhaar} />
                  )}
                  {popupData.parentAadhaar && (
                    <DocumentCard title="Parent Aadhaar" src={popupData.parentAadhaar} />
                  )}
                </div>
              </Section>

              {/* Signatures */}
              <Section title="Signatures" icon={PenTool}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Student Signature</p>
                    <img
                      src={popupData.signatures.student}
                      alt="Student Signature"
                      className="w-full h-20 object-contain bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Parent Signature</p>
                    <img
                      src={popupData.signatures.parent}
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
                onClick={closePopup}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-gray-500/30 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPopup && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Payment Details</h2>
                <p className="text-white/80 text-sm mt-0.5">{selectedItem.acknowledgementNumber}</p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="receiptId" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-gray-500" />
                    Receipt ID <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="receiptId"
                  value={receiptId}
                  onChange={(e) => setReceiptId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter receipt ID..."
                  required
                />
              </div>

              <div>
                <label htmlFor="amountPaid" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Amount Paid <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="amountPaid"
                  value={formattedAmount}
                  onChange={handleAmountChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter amount..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-green-500/30 active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierComponent;