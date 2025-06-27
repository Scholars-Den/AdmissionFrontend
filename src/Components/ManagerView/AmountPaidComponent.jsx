import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AmountPaidComponent = () => {
  const [approval, setApproval] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [popupData, setPopupData] = useState(null); // fetched details
  const [showPopup, setShowPopup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [filterByAckNumber, setFilterByAckNumber] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // for popup content

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdmissionFeePaid = async (page = 1) => {
    try {
      const response = await axios.get(
        `/approval/paid?page=${page}`
      );
      const { data, totalPages } = response.data;
      console.log("response data from fetchAdmissionFeePaid", response.data);
      setApproval(data);
      setFilterData(data);
      setCurrentPage(page);
      setTotalPages(totalPages);
      // optionally store current page or total pages
    } catch (error) {
      console.error("Error fetching pending approval data:", error);
    }
  };

  const fetchDetailsByAcknowledgement = async (ackNumber) => {
    try {
      console.log("ackNumber", ackNumber);
      const response = await axios.get(`/approval/details/${ackNumber}`);

      console.log("response data data", response.data.data);

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

  const [receiptId, setReceiptId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admission-admin/update-student", {
        receiptId,
        amountPaid,
        acknowledgementNumber: selectedItem.acknowledgementNumber,
      });

      toast.success("Amount and RereceiptId updated successfully!");

      fetchAdmissionFeePaid();
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

  const [formattedAmount, setFormattedAmount] = useState("");

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

  useEffect(() => {
    fetchAdmissionFeePaid();
  }, []);

  const filter = async (page = 1) => {
    console.log("this filter is working");

    const data = await axios.post(
      `/approval/filterAdmissionApproval?page=${page}`,
      {
        status: "successful",
        acknowledgementNumber: filterByAckNumber,
      }
    );

    console.log("filterApproval from filter", data);

    setFilterData(data.data.data);
    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
  };

  useEffect(() => {
    if (filterByAckNumber) filter();
    else setFilterData(approval);
  }, [filterByAckNumber]);

  useEffect(() => {
    console.log("filterData from useEffect", filterData);
  }, [filterData]);
  return (
    <div className="flex h-screen  justify-center bg-gray-100">
      <div className="p-6 pt-2 rounded w-full min-h-screen overflow-auto ">
        <>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
          />
        </>
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

        {filterData?.length === 0 ? (
          <p className="text-black text-center">No pending approvals</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
    <tr>
      <th className="py-3 px-6 text-left">Acknowledgement Number</th>
      <th className="py-3 px-6 text-left">Status</th>
      <th className="py-3 px-6 text-left">Actions</th>
    </tr>
  </thead>
  <tbody className="text-gray-800 text-sm">
    {filterData?.map((item, index) => (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-200 cursor-pointer ">
        <td className="py-3 px-6 ">
          {item.acknowledgementNumber}
          {/* Badge positioned absolutely inside this cell */}
          
        </td>
        <td>
          {item.status.toLowerCase() === "successful" && (
            <span className=" bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium shadow select-none whitespace-nowrap">
              ✅ Admission Successful 
            </span>
          )}
        </td>

        <td className="py-3 px-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick(item);
            }}
            className="text-sky-600 p-2 bg-gray-300 rounded-lg hover:text-black hover:bg-white"
          >
            Profile
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                if (filterData) {
                  filter(currentPage - 1);
                } else {
                  fetchAdmissionFeePaid(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => {
                if (filterData) {
                  filter(currentPage + 1);
                } else {
                  fetchAdmissionFeePaid(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showProfile && (
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
                    <strong>Amount Paid:</strong>{" "}
                    {popupData.amountPaid}
                  </p>
                  <p>
                    <strong>Receipt Id:</strong>{" "}
                    {popupData.receiptId}
                  </p>
                  <p>
                    <strong>Aadhaar ID:</strong> {popupData.aadhaarID}
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
                    {popupData.fatherAadhaarID}
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
                    {popupData.motherAadhaarID}
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
                    {popupData.studentAadhaar && (
                      <div>
                        <p className="font-medium">Student Aadhar</p>
                        <a
                          href={popupData.studentAadhaar}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.studentAadhaar}
                            alt="Student Aadhar"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )}
                    {popupData.parentAadhaar && (
                      <div>
                        <p className="font-medium">Parent Aadhar</p>
                        <a
                          href={popupData.parentAadhaar}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.parentAadhaar}
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Enter Payment Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="receiptId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Receipt ID
                </label>
                <input
                  type="text"
                  id="receiptId"
                  value={receiptId}
                  onChange={(e) => setReceiptId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="amountPaid"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount Paid
                </label>
                <input
                  type="text"
                  id="amountPaid"
                  value={formattedAmount}
                  onChange={handleAmountChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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

export default AmountPaidComponent;
