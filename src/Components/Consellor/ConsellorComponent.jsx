import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import SelectField from "../../../utils/SelectField";

const ConsellorComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // for popup content
  const [popupData, setPopupData] = useState(null); // fetched details
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [onSubmitError, setOnSubmitError] = useState("");
  const { adminDetails } = useSelector((state) => state.adminDetails);

  const [studentDetailsStatus, setStudentDetailsStatus] = useState(false);
  const [parentDetailsStatus, setParentDetailsStatus] = useState(false);
  const [addressDetailsStatus, setAddressDetailsStatus] = useState(false);
  const [documentsDetailsStatus, setDocumentsDetailsStatus] = useState({
    // cancelledCheque: false,
    // passbookPhoto: false,
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

  // const dispatch = useDispatch

  const [consellorAssign, setConsellorAssign] = useState("");

  // const []

  // const onChangeOptions = (e) => {
  //   setConsellorAssign(e.target.value);
  // };

  const [options, setOptions] = useState([]);

  const approvalByAssignedConsellor = async (page = 1) => {
    try {
      const response = await axios.get(
        `/approval/approvalByAssignedConsellor?page=${page}`
      );

      console.log("response dataq data ", response);

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
      console.log("response from fetchDetailsByAcknowledge", response);

      console.log("response data data", response.data.data);

      setPopupData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);

    console.log("handleCick", item);
    console.log("handleCick", item);
    setaddressDetailsStatus(item?.addressDetails?.status);
    setParentDetailsStatus(item?.parentDetails?.status);
    setStudentDetailsStatus(item?.studentDetails?.status);
    setSignatureDetailsStatus(item?.signatureDetails?.status);
    setDocumentsDetailsStatus({
      // cancelledCheque: item?.documentsDetails?.cancelledCheque?.status || false,
      // passbookPhoto: item?.documentsDetails?.passbookPhoto?.status || false,
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
    console.log("selectedItem", selectedItem);
    console.log("message", message);
    let response = "";

    console.log("ShowMessagePopup", showMessagePopup);
    // Collect unverified document names
    const unverifiedDocs = [];
    // if (!documentsDetailsStatus.cancelledCheque)
    //   unverifiedDocs.push("Cancelled Cheque");
    // if (!documentsDetailsStatus.passbookPhoto)
    //   unverifiedDocs.push("Passbook Photo");
    if (!documentsDetailsStatus.studentAadhaar)
      unverifiedDocs.push("Student Aadhar");
    if (!documentsDetailsStatus.parentAadhaar)
      unverifiedDocs.push("Parent Aadhar");
    if (!documentsDetailsStatus.studentPhoto)
      unverifiedDocs.push("Student Photo");

    console.log("documentDetailsstatus", documentsDetailsStatus);

    const allDocumentsApproved = unverifiedDocs.length === 0;
    const documentDetailsMessage = allDocumentsApproved
      ? "The student document has been verified successfully."
      : `Some document could not be verified due to missing or invalid files`;
    // const documentDetailsMessage = allDocumentsApproved
    //   ? "The student document has been verified successfully."
    //   : `The student document could not be verified due to missing or invalid files: ${unverifiedDocs.map((docName) =>` ${docName}`)}.`;

    const documentDetailsStructure = {
      // cancelledCheque: {
      //   status: documentsDetailsStatus.cancelledCheque,
      //   message: documentsDetailsStatus.cancelledCheque
      //     ? "Student info verified"
      //     : "Student info not verified",
      // },
      // passbookPhoto: {
      //   status: documentsDetailsStatus.passbookPhoto,
      //   message: documentsDetailsStatus.passbookPhoto
      //     ? "Student info verified"
      //     : "Student info not verified",
      // },
      studentAadhaar: {
        status: documentsDetailsStatus.studentAadhaar,
        message: documentsDetailsStatus.studentAadhaar
          ? "Student info verified"
          : "Student info not verified",
      },
      parentAadhaar: {
        status: documentsDetailsStatus.parentAadhaar,
        message: documentsDetailsStatus.parentAadhaar
          ? "Student info verified"
          : "Student info not verified",
      },
      studentPhoto: {
        status: documentsDetailsStatus.studentPhoto,
        message: documentsDetailsStatus.studentPhoto
          ? "Student info verified"
          : "Student info not verified",
      },

      status: allDocumentsApproved,
      message: documentDetailsMessage,
    };

    console.log("test documentdetailsData ", documentDetailsStructure);
    console.log("test documentdetailsData ", showMessagePopup);

    response = await axios.post("/approval/editAdmissionApproval", {
      status: showMessagePopup === "approved" ? "approved" : "rejected",
      acknowledgementNumber: selectedItem.acknowledgementNumber,
      message,
      studentDetails: {
        status: studentDetailsStatus,
        message: studentDetailsStatus
          ? "Student info verified"
          : "Student info not verified",
      },
      parentDetails: {
        status: parentDetailsStatus,
        message: parentDetailsStatus
          ? "Parent info verified"
          : "Parent info not verified",
      },
      addressDetails: {
        status: addressDetailsStatus,
        message: addressDetailsStatus
          ? "Bank info verified"
          : "Bank info not verified",
      },
      documentsDetails: {
        // cancelledCheque: {
        //   status: documentsDetailsStatus.cancelledCheque,
        //   message: documentsDetailsStatus.cancelledCheque
        //     ? "Student info verified"
        //     : "Student info not verified",
        // },
        // passbookPhoto: {
        //   status: documentsDetailsStatus.passbookPhoto,
        //   message: documentsDetailsStatus.passbookPhoto
        //     ? "Student info verified"
        //     : "Student info not verified",
        // },
        studentAadhaar: {
          status: documentsDetailsStatus.studentAadhaar,
          message: documentsDetailsStatus.studentAadhaar
            ? "Student info verified"
            : "Student info not verified",
        },
        parentAadhaar: {
          status: documentsDetailsStatus.parentAadhaar,
          message: documentsDetailsStatus.parentAadhaar
            ? "Student info verified"
            : "Student info not verified",
        },
        studentPhoto: {
          status: documentsDetailsStatus.studentPhoto,
          message: documentsDetailsStatus.studentPhoto
            ? "Student info verified"
            : "Student info not verified",
        },

        status: allDocumentsApproved,
        message: documentDetailsMessage,
      },
      signatureDetails: {
        status: signatureDetailsStatus,
        message: signatureDetailsStatus
          ? "Student info verified"
          : "Student info not verified",
      },
    });

    console.log("Response FOR SUBMITmESSAGE", response);

    console.log(
      "studentDetailsStatus parentDetailsStatus addressDetailsStatus documentsDetailsStatus",
      studentDetailsStatus,
      parentDetailsStatus,
      addressDetailsStatus,
      documentsDetailsStatus
    );
    console.log(
      "studentDetailsStatus parentDetailsStatus addressDetailsStatus documentsDetailsStatus",
      response
    );

    setShowMessagePopup("");
    setMessage("");

    await approvalByAssignedConsellor();

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

  const submitButtonClickHandler = () => {
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

  useEffect(() => {
    approvalByAssignedConsellor();
  }, []);
  useEffect(() => {
    console.log("selectedItem", selectedItem);
  }, [selectedItem]);

  // useEffect(() => {
  //   fetchAdmissionMessage();
  // }, []);

  const filter = async (page = 1) => {
    console.log("this filter is working");

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
    filter();
  }, [filterByAckNumber]);

  const allDocumentsApproved = Object.values(documentsDetailsStatus).every(
    Boolean
  );

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div className="p-6 pt-2 rounded w-full min-h-screen overflow-auto">
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
          <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Acknowledgement Number</th>
                <th className="py-3 px-6 text-left">Status</th>
                {/* <th className="py-3 px-6 text-left">Action</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {filterData.map((item, index) => (
              
                <tr
                  key={index}
                  onClick={() => handleCardClick(item)}
                  className="border-b border-gray-200 hover:bg-gray-200 cursor-pointer transition"
                >
                  <td className="py-3 px-6">{item.acknowledgementNumber}</td>
                  <td className="py-3 px-6">
                    <span className="bg-green-200 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium shadow">
                      {item.status}
                    </span>
                  </td>
                  {/* <td className="py-3 px-6">
                    <button className="text-blue-600 hover:underline">
                      View Details
                    </button>
                  </td> */}
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
                  approvalByAssignedConsellor(currentPage - 1);
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
                  approvalByAssignedConsellor(currentPage + 1);
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-3 rounded shadow-lg max-w-md w-full relative">
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
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">
                      Student Details
                    </h3>
                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={studentDetailsStatus}
                        type="checkbox"
                      
                      />
                    </div>
                  </div>
                  <p>
                    <strong>Acknowledgement Number:</strong>{" "}
                    {popupData.acknowledgementNumber}
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
                </section>

                <section>
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">
                      Parent Details
                    </h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={parentDetailsStatus}
                        type="checkbox"
                      />
                    </div>
                  </div>
                  <p>
                    <strong>Parent's Contact:</strong>{" "}
                    {popupData.parentsContactNumber}
                  </p>

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
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">Bank Details</h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={addressDetailsStatus}
                        type="checkbox"
                      />
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

                <section></section>

                <section>
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">Documents</h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer"
                        checked={allDocumentsApproved}
                        type="checkbox"
                        
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {popupData.studentPhoto && (
                      <div>
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Student Photo</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.studentPhoto}
                          
                          />
                        </div>
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
                      </div>
                    )}
                    {/* {popupData.cancelledCheque && (
                      <div>
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Cancelled Cheque</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.cancelledCheque}
                         
                          />
                        </div>
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
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Passbook Photo</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.passbookPhoto}
                         
                          />
                        </div>
                        <a
                          href={popupData.passbookPhoto}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={popupData.passbookPhoto}
                            alt="Passbook Photo"
                            className="w-full h-24 object-cover border rounded hover:scale-105 transition"
                          />
                        </a>
                      </div>
                    )} */}

                    {popupData.studentAadhaar && (
                      <div>
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Student Aadhar</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.studentAadhaar}
                          
                          />
                        </div>
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
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Parent Aadhar</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.parentAadhaar}
                    
                          />
                        </div>
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
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">Signatures</h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={signatureDetailsStatus}
                        type="checkbox"
                     
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div>
                      <p className="font-medium">Student</p>
                      <img
                        src={popupData?.signatures?.student}
                        alt="Student Signature"
                        className="w-28 h-12 border rounded object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Parent</p>
                      <img
                        src={popupData?.signatures?.parent}
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

      {showMessagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowMessagePopup("")}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add Message </h2>
            <label htmlFor="message">Message</label>
            <input
              type="text"
              placeholder="Enter Mesage"
              className="border-2 w-full p-2 my-3 text-black outline-none"
              onChange={(e) => setMessage(e.target.value)}
            />
            <div>
              {error && <span className="text-[#c61d23]">{error}</span>}
            </div>
            <button
              onClick={submitMessage}
              className="p-3 hover:bg[#ffdd00] bg-[#f1df68] rounded-xl"
            >
              {" "}
              Submit Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsellorComponent;
