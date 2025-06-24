import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignupDetailsPage from "./SignupDetailsPage";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";
import { fetchAlreadyExistingStudent } from "../../redux/alreadyExistStudentSlice";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AlreadyExistStudent = () => {
  const { existingStudent } = useSelector((state) => state.alreadyExistStudent);
  const [admissionStatusMap, setAdmissionStatusMap] = useState({});
  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
  });

  const navigate = useNavigate();
  const [admisionStatus, setAdmissionStatus] = useState(null);

  // const fetchAdmissionMessage = async () => {
  //   console.log("selectedStudent from fetchAdmissionMessage", selectedStudent);
  //   console.log(
  //     "selectedStudent from fetchAdmissionMessage",
  //     selectedStudent.acknowledgementNumber
  //   );

  //   const response = await axios.post(
  //     "/approval/getAdmissionApprovalByAcknowledgementNumber",
  //     { acknowledgementNumber: selectedStudent.acknowledgementNumber }
  //   );
  //   console.log("resoponse from fetchAdmissionMessage", response);
  // };

  const fetchAdmissionMessage = async (ackNumber) => {
    try {
      console.log("AckNumber", ackNumber);
      const response = await axios.post(
        "/approval/getAdmissionApprovalByAcknowledgementNumber",
        { acknowledgementNumber: ackNumber }
      );

      console.log("RESPONSE FETCHaDMISSIONmEWSSAGE", response);

      setAdmissionStatus(response.data);
    } catch (error) {
      setAdmissionStatus({});
      setAdmissionStatusMap((prev) => ({
        ...prev,
        [ackNumber]: "Error fetching status",
      }));
    }
  };

  useEffect(() => {
    console.log("admissionStatus", admisionStatus);
  }, [admisionStatus]);

  useEffect(() => {
    console.log("admissionStatusMap ", admissionStatusMap);
  }, [admissionStatusMap]);

  // useEffect(()=>{

  //   console.log("Testdata fro admissionStatusMap");
  //   fetchAdmissionMessage(admissionStatusMap);

  // },[admissionStatusMap])

  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchAlreadyExistingStudent());
  }, []);

  useEffect(() => {
    console.log("existing student", existingStudent);
  }, [existingStudent]);

  // useEffect(() => {
  //   console.log("existing Student ", existingStudent);
  //   fetchAdmissionMessage();
  // }, [selectedStudent]);

  // const handleCardClick = (student) => {
  //   setSelectedStudent(student);
  // };

  const handleCardClick = (student) => {
    setSelectedStudent(student);

    console.log("Student from handleCardClick", student);

    // if (!admissionStatusMap[student.acknowledgementNumber]) {
    //   console.log("If condition working ");
    fetchAdmissionMessage(student.acknowledgementNumber);
    // }
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleEditClick = async () => {
    console.log("selected student from handleEditClick", selectedStudent);
    console.log(
      "selected student from handleEditClick",
      selectedStudent?.acknowledgementNumber
    );

    const data = {
      acknowledgementNumber: selectedStudent?.acknowledgementNumber,
    };
    const response = await axios.post("/admissions/editAdmissionDetails", data);

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Then, set the new token
    document.cookie = `token=${response.data.token}; path=/`;
    navigate("/basicDetails");

    console.log("response from handleEditClick", response);
  };

  const handleSignatureEnd = (key) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key]?.current?.toDataURL(),
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  const signatureRefs = {
    student: useRef(null),
    parent: useRef(null),
  };

  const createNewUser = async () => {
    console.log("userData in createNewUser", userData);

    const createNewAdmission = await axios.post(
      "/admissions/createNewAdmission"
    );

    console.log(
      "document cookie",
      document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      )
    );
    console.log("CreatrNewAdmission from createNewUSer", createNewAdmission);
    // First, delete the old token (optional if you're immediately replacing it)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Then, set the new token
    document.cookie = `token=${createNewAdmission.data.token}; path=/`;

    navigate("/basicDetails");
  };

  const handleLogoutClick = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      <div className="flex  justify-end mr-3 mt-3">
        <button onClick={createNewUser} className="bg-[#ffdd00] p-3 rounded-xl">
          Create New{" "}
        </button>
      </div>
      <div className="flex flex-wrap justify-center p-4 gap-4">
        {Array.isArray(existingStudent) && existingStudent.length > 0 ? (
          existingStudent.map((student) => (
            <div
              key={student._id}
              className="bg-white p-4 rounded shadow-md cursor-pointer hover:bg-gray-100 w-72"
              onClick={() => handleCardClick(student)}
            >
              <img
                src={student.studentPhoto}
                alt={student.studentName}
                className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
              />
              <h2 className="text-center font-semibold">
                {student.studentName}
              </h2>
              <p className="text-center text-sm text-gray-600">
                Class: {student.studentClass}
              </p>
              <p className="text-center text-sm text-gray-600">
                {student.acknowledgementNumber}
              </p>
              {/* <p className="text-center text-sm text-gray-600">
                Status:{" "}
                {admissionStatusMap[student.acknowledgementNumber] ||
                  "Loading..."}
              </p> */}
            </div>
          ))
        ) : (
          <p className="text-white text-center mt-4">No student data found.</p>
        )}
      </div>

      {/* Modal for full details */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-red-600"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              {/* Header with photo */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4">
                <img
                  src={selectedStudent.studentPhoto}
                  alt="Student"
                  className="w-24 h-24 rounded-full object-cover border shadow"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#c61d23]">
                    {selectedStudent.studentName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Acknowledgement No: {selectedStudent.acknowledgementNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Class: {selectedStudent.studentClass} | Gender:{" "}
                    {selectedStudent.gender}
                  </p>
                </div>
                {admisionStatus?.data && (
                  <div className="flex flex-row sm:flex-col gap-4">
                    <div
                      className={`${
                        admisionStatus?.data?.status === "approved"
                          ? "text-green-500"
                          : "text-[#c61d23]"
                      }  p-3 rounded-xl`}
                    >
                      {`Status : 
                  ${
                    admisionStatus?.data?.status
                      ? admisionStatus?.data?.status
                      : admisionStatus?.data?.message
                  }`}
                    </div>
                    {admisionStatus?.data?.message && (
                      <div
                        className={`${
                          admisionStatus?.data?.status === "approved"
                            ? "text-green-500"
                            : "text-[#c61d23]"
                        }  p-3 rounded-xl`}
                      >
                        {`Message : 
                  ${admisionStatus?.data?.message}`}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section: Student Info */}
              <section>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Student Details
                  </h3>

                  {!admisionStatus?.data?.studentDetails.status && (
                    <div className="flex">
                      <p className="flex text-[#c61d23] p-2 rounded-xl ">
                        {/* <strong className="mr-3">Status :</strong>{" "} */}
                        {admisionStatus?.data?.studentDetails.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Class:</strong> {selectedStudent.studentClass}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedStudent.gender}
                  </p>
                  <p>
                    <strong>Program:</strong> {selectedStudent.program}
                  </p>
                  <p>
                    <strong>Aadhar ID:</strong> {selectedStudent.aadhaarID}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedStudent.category}
                  </p>
                  <p>
                    <strong>Siblings Position:</strong>{" "}
                    {selectedStudent.siblingsPosition}
                  </p>
                  <p>
                    <strong>Brothers:</strong> {selectedStudent.noOfBrother}
                  </p>
                  <p>
                    <strong>Sisters:</strong> {selectedStudent.noOfSister}
                  </p>
                </div>
              </section>

              {/* Section: Parent Info */}
              <section>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Parent Details
                  </h3>
                  {!admisionStatus?.data?.parentDetails.status && (
                    <div className="flex">
                      <p className="flex text-[#c61d23] p-2 rounded-xl ">
                        {/* <strong className="mr-3">Status :</strong>{" "} */}
                        {admisionStatus?.data?.parentDetails.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Father's Name:</strong> {selectedStudent.fatherName}
                  </p>
                  <p>
                    <strong>Father's Aadhar:</strong>{" "}
                    {selectedStudent.fatherAadhaarID}
                  </p>
                  <p>
                    <strong>Father's Occupation:</strong>{" "}
                    {selectedStudent.fatherOccupations}
                  </p>
                  <p>
                    <strong>Mother's Name:</strong> {selectedStudent.motherName}
                  </p>
                  <p>
                    <strong>Mother's Aadhar:</strong>{" "}
                    {selectedStudent.motherAadhaarID}
                  </p>
                  <p>
                    <strong>Mother's Occupation:</strong>{" "}
                    {selectedStudent.motherOccupations}
                  </p>
                  <p>
                    <strong>Contact Number:</strong>{" "}
                    {selectedStudent.parentsContactNumber}
                  </p>
                </div>
              </section>

              {/* Section: Bank Info */}
              <section>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Bank Details
                  </h3>

                  {!admisionStatus?.data?.bankDetails.status && (
                    <div className="flex">
                      <p className="flex text-[#c61d23] p-2 rounded-xl ">
                        {/* <strong className="mr-3">Status :</strong>{" "} */}
                        {admisionStatus?.data?.bankDetails.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Account Holder:</strong>{" "}
                    {selectedStudent.accountHolder}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {selectedStudent.accountNumber}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {selectedStudent.bankName}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong> {selectedStudent.ifscCode}
                  </p>
                  <p>
                    <strong>Relation with Student:</strong>{" "}
                    {selectedStudent.relationWithStudent}
                  </p>
                </div>
              </section>

              <section>
                <div className="">
                  <div className="flex justify-around items-center gap-6 ">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Documents Detail
                    </h3>

                    {!admisionStatus?.data?.documentsDetails.status && (
                      <div className="flex">
                        <p className="flex text-[#c61d23] rounded-xl ">
                          {/* <strong className="mr-3">Status </strong>{" "} */}
                          {admisionStatus?.data?.documentsDetails.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-around gap-4 mt-3">
                    <div className="flex items-center gap-4 text-xl">
                      <p className="mb-1 font-medium">Student Photo</p>
                      <a
                        href={selectedStudent.studentPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative w-24">
                          <img
                            src={selectedStudent?.studentPhoto}
                            alt="Cancelled Cheque"
                            className="w-24 h-auto border rounded shadow-md hover:scale-105 transition"
                          />
                          {admisionStatus?.data?.documentsDetails && (
                            <div
                              className={`absolute top-0 left-0 ${
                                admisionStatus?.data?.documentsDetails
                                  ?.studentPhoto?.status
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white text-xs font-semibold px-2 py-0.5 rounded`}
                            >
                              {admisionStatus?.data?.documentsDetails
                                ?.studentPhoto?.status
                                ? "Approved"
                                : "Rejected"}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                      <p className="mb-1 font-medium">Cancelled Cheque</p>

                      <a
                        href={selectedStudent.cancelledCheque}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative w-24">
                          <img
                            src={selectedStudent?.cancelledCheque}
                            alt="Cancelled Cheque"
                            className="w-24 h-auto border rounded shadow-md hover:scale-105 transition"
                          />
                          {admisionStatus?.data?.documentsDetails && (
                            <div
                              className={`absolute top-0 left-0 ${
                                admisionStatus?.data?.documentsDetails
                                  ?.cancelledCheque?.status
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white text-xs font-semibold px-2 py-0.5 rounded`}
                            >
                              {admisionStatus?.data?.documentsDetails
                                ?.cancelledCheque?.status
                                ? "Approved"
                                : "Rejected"}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                      <p className="mb-1 font-medium">Passbook Photo</p>
                      <a
                        href={selectedStudent.passbookPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative w-24">
                          <img
                            src={selectedStudent.passbookPhoto}
                            alt="Passbook"
                            className="w-24 h-auto border rounded shadow-md hover:scale-105 transition"
                          />
                          {admisionStatus?.data?.documentsDetails && (
                          <div
                            className={`absolute top-1 left-1 bg-${
                              admisionStatus?.data?.documentsDetails
                                ?.passbookPhoto?.status
                                ? "green"
                                : "red"
                            }-500 text-white text-xs font-semibold px-2 py-0.5 rounded`}
                          >
                            {admisionStatus?.data?.documentsDetails
                              ?.passbookPhoto?.status
                              ? "Approved"
                              : "Rejected"}
                          </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                      <p className="mb-1 font-medium">Student Aadhar</p>
                      <a
                        href={selectedStudent.studentAadhaar}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative w-24">
                          <img
                            src={selectedStudent.studentAadhaar}
                            alt="Student Aadhar"
                            className="w-24 h-auto border rounded shadow-md hover:scale-105 transition"
                          />
                          {admisionStatus?.data?.documentsDetails && (
                          <div
                            className={`absolute top-1 left-1 bg-${
                              admisionStatus?.data?.documentsDetails
                                ?.studentAadhaar?.status
                                ? "green"
                                : "red"
                            }-500 text-white text-xs font-semibold px-2 py-0.5 rounded`}
                          >
                            {admisionStatus?.data?.documentsDetails
                              ?.studentAadhaar?.status
                              ? "Approved"
                              : "Rejected"}
                          </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                      <p className="mb-1 font-medium">Parent Aadhar</p>
                      <a
                        href={selectedStudent.parentAadhaar}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="relative w-24">
                          <img
                            src={selectedStudent.parentAadhaar}
                            alt="Parent Aadhar"
                            className="w-24 h-auto border rounded shadow-md hover:scale-105 transition"
                          />
                          {admisionStatus?.data?.documentsDetails && (
                          <div
                            className={`absolute top-1 left-1 bg-${
                              admisionStatus?.data?.documentsDetails
                                ?.parentAadhaar?.status
                                ? "green"
                                : "red"
                            }-500 text-white text-xs font-semibold px-2 py-0.5 rounded`}
                          >
                            {admisionStatus?.data?.documentsDetails
                              ?.parentAadhaar?.status
                              ? "Approved"
                              : "Rejected"}
                          </div>
                          )}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Signature Details
                  </h3>

                  {!admisionStatus?.data?.signatureDetails?.status && (
                    <div className="flex">
                      <p className="flex text-[#c61d23] p-2 rounded-xl ">
                        {/* <strong className="mr-3">Status :</strong>{" "} */}
                        {admisionStatus?.data?.signatureDetails?.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Parent Signature:</strong>
                    <br />
                    {selectedStudent.signatures?.parent ? (
                      <img
                        src={selectedStudent.signatures.parent}
                        alt="Parent Signature"
                        className="mt-1 border rounded max-h-32"
                      />
                    ) : (
                      <p className="text-gray-500">No signature available</p>
                    )}
                  </div>

                  <div>
                    <strong>Student Signature:</strong>
                    <br />
                    {selectedStudent.signatures?.student ? (
                      <img
                        src={selectedStudent.signatures.student}
                        alt="Student Signature"
                        className="mt-1 border rounded max-h-32"
                      />
                    ) : (
                      <p className="text-gray-500">No signature available</p>
                    )}
                  </div>
                </div>
              </section>
              <div className="flex w-full justify-end ">
                {console.log("test data form admission", admisionStatus?.data)}
                {admisionStatus?.data?.status != "approved" && (
                  <button
                    className="p-3  bg-[#c61d23] rounded-xl text-white disabled:bg-gray-500"
                    onClick={handleEditClick}
                    disabled={admisionStatus?.data?.status === "pending"}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end items-end p-3">
        <span
          className="p-2 bg-[#ffdd00] rounded-xl "
          onClick={handleLogoutClick}
        >
          Logout
        </span>
      </div>

      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default AlreadyExistStudent;
