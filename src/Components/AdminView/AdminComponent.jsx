import { useDispatch } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";

const AdminComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // for popup content
  const [popupData, setPopupData] = useState(null); // fetched details
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [studentDetailsStatus, setStudentDetailsStatus] = useState(false);
  const [parentDetailsStatus, setParentDetailsStatus] = useState(false);
  const [bankDetailsStatus, setBankDetailsStatus] = useState(false);
  const [documentsDetailsStatus, setDocumentsDetailsStatus] = useState({
    cancelledCheque: false,
    passbookPhoto: false,
    studentAadhar: false,
    parentAadhar: false,
    studentPhoto: false,
  });
  const [signatureDetailsStatus, setSignatureDetailsStatus] = useState(false);

  const [showMessagePopup, setShowMessagePopup] = useState("");

  // const dispatch = useDispatch

  const fetchApprovalRemaining = async () => {
    try {
      const response = await axios.get("/approval/pendingApproval");
      setPendingApproval(response.data.data);

      console.log("response dataq data ", response.data.data[0]);
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
    setBankDetailsStatus(item?.bankDetails?.status);
    setParentDetailsStatus(item?.parentDetails?.status);
    setStudentDetailsStatus(item?.studentDetails?.status);
    setDocumentsDetailsStatus({
      cancelledCheque: item.documentDetails?.cancelledCheque?.status || false,
      passbookPhoto: item.documentDetails?.passbookPhoto?.status || false,
      studentAadhar: item.documentDetails?.studentAadhar?.status || false,
      parentAadhar: item.documentDetails?.parentAadhar?.status || false,
      studentPhoto: item.documentDetails?.studentPhoto?.status || false,
    });
    setShowPopup(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const submitMessage = async () => {
    console.log("selectedItem", selectedItem);
    console.log("message", message);
    let response = "";






    console.log("ShowMessagePopup", showMessagePopup);
    // Collect unverified document names
    const unverifiedDocs = [];
    if (!documentsDetailsStatus.cancelledCheque)
      unverifiedDocs.push("Cancelled Cheque");
    if (!documentsDetailsStatus.passbookPhoto)
      unverifiedDocs.push("Passbook Photo");
    if (!documentsDetailsStatus.studentAadhar)
      unverifiedDocs.push("Student Aadhar");
    if (!documentsDetailsStatus.parentAadhar)
      unverifiedDocs.push("Parent Aadhar");
    if (!documentsDetailsStatus.studentPhoto)
      unverifiedDocs.push("Student Photo");

    console.log("documentDetailsstatus", documentsDetailsStatus);

    const allDocumentsApproved = unverifiedDocs.length === 0;
    const documentDetailsMessage = allDocumentsApproved
      ? "The student document has been verified successfully."
      : `The student document could not be verified: ${unverifiedDocs[0]}.`;


    const  documentDetailsStructure =  {
        cancelledCheque: {
          status: documentsDetailsStatus.cancelledCheque,
          message: documentsDetailsStatus.cancelledCheque
            ? "Student info verified"
            : "Student info not verified",
        },
        passbookPhoto: {
          status: documentsDetailsStatus.passbookPhoto,
          message: documentsDetailsStatus.passbookPhoto
            ? "Student info verified"
            : "Student info not verified",
        },
        studentAadhar: {
          status: documentsDetailsStatus.studentAadhar,
          message: documentsDetailsStatus.studentAadhar
            ? "Student info verified"
            : "Student info not verified",
        },
        parentAadhar: {
          status: documentsDetailsStatus.parentAadhar,
          message: documentsDetailsStatus.parentAadhar
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
      }


      console.log("test documentdetailsData ", documentDetailsStructure)













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
      bankDetails: {
        status: bankDetailsStatus,
        message: bankDetailsStatus
          ? "Bank info verified"
          : "Bank info not verified",
      },
      documentsDetails: {
        cancelledCheque: {
          status: documentsDetailsStatus.cancelledCheque,
          message: documentsDetailsStatus.cancelledCheque
            ? "Student info verified"
            : "Student info not verified",
        },
        passbookPhoto: {
          status: documentsDetailsStatus.passbookPhoto,
          message: documentsDetailsStatus.passbookPhoto
            ? "Student info verified"
            : "Student info not verified",
        },
        studentAadhar: {
          status: documentsDetailsStatus.studentAadhar,
          message: documentsDetailsStatus.studentAadhar
            ? "Student info verified"
            : "Student info not verified",
        },
        parentAadhar: {
          status: documentsDetailsStatus.parentAadhar,
          message: documentsDetailsStatus.parentAadhar
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
      "studentDetailsStatus parentDetailsStatus bankDetailsStatus documentsDetailsStatus",
      studentDetailsStatus,
      parentDetailsStatus,
      bankDetailsStatus,
      documentsDetailsStatus
    );
    console.log(
      "studentDetailsStatus parentDetailsStatus bankDetailsStatus documentsDetailsStatus",
      response
    );

    setShowMessagePopup("");
    setMessage("");

    await fetchApprovalRemaining();

    setSelectedItem(null);
    setPopupData(null);
    setShowPopup(false);

    console.log("handleClickApproved response", response);
  };
  const handleClickRejected = async () => {
    console.log("selectedItem", selectedItem);

    const response = await axios.post("/approval/editAdmissionApproval", {
      status: "rejected",
      acknowledgementNumber: selectedItem.acknowledgementNumber,
    });

    await fetchApprovalRemaining();

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
    fetchApprovalRemaining();
  }, []);
  useEffect(() => {
    console.log("selectedItem", selectedItem);
  }, [selectedItem]);

  const fetchAdmissionMessage = async (ackNumber) => {
    try {
      console.log("AckNumber", ackNumber);
      const response = await axios.post(
        "/approval/getAdmissionApprovalByAcknowledgementNumber",
        { acknowledgementNumber: ackNumber }
      );

      console.log("Testdata ", response);

      console.log("RESPONSE FETCHaDMISSIONmEWSSAGE", response);
      setAdmissionStatus(response.data);
    } catch (error) {
      // setAdmissionStatusMap((prev) => ({
      //   ...prev,
      //   [ackNumber]: "Error fetching status",
      // }));
    }
  };

  useEffect(() => {
    fetchAdmissionMessage();
  }, []);

  const allDocumentsApproved = Object.values(documentsDetailsStatus).every(
    Boolean
  );

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div className="p-6 rounded w-full max-w-md min-h-screen overflow-auto">
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
            </div>
          ))
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
                        onChange={() =>
                          setStudentDetailsStatus((prev) => !prev)
                        }
                      />
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
                        onChange={() => setParentDetailsStatus((prev) => !prev)}
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
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">Bank Details</h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={bankDetailsStatus}
                        type="checkbox"
                        onChange={() => setBankDetailsStatus((prev) => !prev)}
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
                        onChange={() =>
                          setDocumentsDetailsStatus((prev) => {
                            const shouldUncheck =
                              Object.values(prev).every(Boolean); // all true?
                            return {
                              cancelledCheque: !shouldUncheck,
                              passbookPhoto: !shouldUncheck,
                              studentAadhar: !shouldUncheck,
                              parentAadhar: !shouldUncheck,
                              studentPhoto: !shouldUncheck,
                            };
                          })
                        }
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
                            onChange={() =>
                              setDocumentsDetailsStatus((prev) => ({
                                ...prev,
                                studentPhoto: !prev.studentPhoto,
                              }))
                            }
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
                    {popupData.cancelledCheque && (
                      <div>
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Cancelled Cheque</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.cancelledCheque}
                            onChange={() =>
                              setDocumentsDetailsStatus((prev) => ({
                                ...prev,
                                cancelledCheque: !prev.cancelledCheque,
                              }))
                            }
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
                            onChange={() =>
                              setDocumentsDetailsStatus((prev) => ({
                                ...prev,
                                passbookPhoto: !prev.passbookPhoto,
                              }))
                            }
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
                    )}

                    {popupData.studentAadhar && (
                      <div>
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Student Aadhar</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.studentAadhar}
                            onChange={() =>
                              setDocumentsDetailsStatus((prev) => ({
                                ...prev,
                                studentAadhar: !prev.studentAadhar,
                              }))
                            }
                          />
                        </div>
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
                        <div className="flex justify-between pr-2">
                          <p className="font-medium">Parent Aadhar</p>
                          <input
                            type="checkbox"
                            checked={documentsDetailsStatus.parentAadhar}
                            onChange={() =>
                              setDocumentsDetailsStatus((prev) => ({
                                ...prev,
                                parentAadhar: !prev.parentAadhar,
                              }))
                            }
                          />
                        </div>
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
                  <div className="flex justify-around">
                    <h3 className="text-lg font-semibold mb-1">Signatures</h3>

                    <div className="flex gap-2 items-center">
                      <label htmlFor="">Approved </label>
                      <input
                        className="hover:cursor-pointer "
                        checked={signatureDetailsStatus}
                        type="checkbox"
                        onChange={() =>
                          setSignatureDetailsStatus((prev) => !prev)
                        }
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
                        src={popupData.signatures.parent}
                        alt="Parent Signature"
                        className="w-28 h-12 border rounded object-contain"
                      />
                    </div>
                  </div>
                </section>

                <div className="w-full flex justify-center">
                  <button
                    className="p-3 hover:bg-[#ffdd00] bg-[#f1df68] rounded-xl"
                    onClick={() =>
                      setShowMessagePopup(
                        parentDetailsStatus &&
                          studentDetailsStatus &&
                          bankDetailsStatus &&
                          signatureDetailsStatus &&
                          allDocumentsApproved
                          ? "approval"
                          : "rejected"
                      )
                    }
                  >
                    Submit
                  </button>
                  {/* <button
                    className="p-3 hover:bg-[#ffdd00] bg-[#f1df68] rounded-xl"
                    onClick={() => setShowMessagePopup("rejected")}
                  >
                    Rejected
                  </button> */}
                </div>
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

export default AdminComponent;
