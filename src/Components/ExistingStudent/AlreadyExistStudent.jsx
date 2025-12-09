import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlreadyExistingStudent } from "../../../redux/alreadyExistStudentSlice";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import logout from "../../assets/logout.png";
import StatusBadge from "../../../utils/StatusBadge";
import StudentDetailsModal from "../StudentInfo/StudentDetailsModal";

const AlreadyExistStudent = () => {
  const { existingStudent } = useSelector((state) => state.alreadyExistStudent);
  const [admissionStatusMap, setAdmissionStatusMap] = useState({});
  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
  });

  const navigate = useNavigate();
  const [admisionStatus, setAdmissionStatus] = useState(null);
  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  const [selectedStudent, setSelectedStudent] = useState(null);

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

  useEffect(() => {
    console.log("userData frin useEffect", userData);
  }, []);

  useEffect(() => {
    const number =
      userData.fatherContactNumber || userData.studentContactNumber;

    console.log("useEffect from alreadyExistStudent number ", number);
    console.log("useEffect from alreadyExistStudent userData", userData);

    dispatch(fetchAlreadyExistingStudent(number));
  }, []);

  useEffect(() => {
    console.log("existing student", existingStudent);
  }, [existingStudent]);

  useEffect(() => {
    console.log("existing Student ", existingStudent);
    fetchAdmissionMessage();
  }, [selectedStudent]);

  return (
    <div className="w-full h-full flex flex-col bg-[#c61d23]">
      {/* <button className="absolute top-0 right-0">
        <img src={logout} alt="" />
      </button> */}
      <div className="flex justify-end mr-4 mt-4">
        <button
          onClick={createNewUser}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        >
          + New Application
        </button>
      </div>

      <div className="flex flex-wrap justify-center text-xs bg-white mx-4 rounded-xl sm:px-4 gap-4 overflow-auto h-96 relative">
        {Array.isArray(existingStudent) && existingStudent.length > 0 ? (
          <div className="relative w-full">
            {/* Fixed Table header */}
            {/* <div className="sticky top-0 grid grid-cols-8 w-full text-center  bg-gray-200 p-2 rounded-t-lg z-10">
              <h3 className="col-span-2">Photo</h3>
              <h3 className="col-span-2">Name</h3>
              <h3 className="col-span-2">Class</h3>
              <h3 className="col-span-2">Acknowledgement Number</h3>
            </div> */}

            {/* Student data */}
            <div className="flex flex-col sm:gap-6 overflow-y-auto h-96 p-2 gap-5">
              {existingStudent.map((student) => (
                <div
                  key={student._id}
                  onClick={() => handleCardClick(student)}
                  className="cursor-pointer transition-all duration-300 transform hover:scale-100 hover:shadow-xl hover:bg-gray-50 bg-gray-100 rounded-xl shadow-md p-4 w-full max-w-4xl flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Photo */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={student.studentPhoto}
                      alt={student.studentName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                    <div className="flex flex-col sm:mr-8 space-y-1 sm:text-left">
                      {/* Name */}
                      <div className="text-gray-700 font-semibold text-lg">
                        <span className="text-sm font-medium text-gray-500">
                          Name:
                        </span>{" "}
                        <span className="text-xl font-semibold text-gray-800">
                          {student.studentName}
                        </span>
                      </div>

                      {/* Acknowledgement Number */}
                      <div className="text-gray-600">
                        <span className="text-sm font-medium text-gray-500">
                          Class :
                        </span>{" "}
                        <span className="font-medium text-gray-800">
                          {student.studentClass}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-sm font-medium text-gray-500">
                          Acknowledgement No.:
                        </span>{" "}
                        <span className="font-medium text-gray-800">
                          {student.acknowledgementNumber}
                        </span>
                      </div>
                    </div>
                    {/* <div className="flex flex-col items-end text-right">
                      {student.approvalDetails ? (
                        <>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full
          ${
            student.approvalDetails.status === "approved"
              ? "bg-green-100 text-green-700"
              : student.approvalDetails.status === "rejected"
              ? "bg-red-100 text-red-700"
              : student.approvalDetails.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : student.approvalDetails.status === "amountPaid"
              ? "bg-blue-100 text-blue-700"
              : student.approvalDetails.status === "successfully"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-700"
          }
        `}
                          >
                            {student.approvalDetails.status?.toUpperCase()}
                          </span>

                          <span className="text-xs text-gray-600 mt-1">
                            {student.approvalDetails.message ||
                              "No message provided"}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No approval data
                        </span>
                      )}
                    </div> */}
                    <div className="absolute top-1 right-3">
                      <StatusBadge
                        status={student.approvalDetails?.status}
                        message={student.approvalDetails?.message}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No students available.
          </div>
        )}
      </div>

      {/* Modal for full details */}

      <StudentDetailsModal
        selectedStudent={selectedStudent}
        admisionStatus={admisionStatus}
        onClose={closeModal}
        onEdit={handleEditClick}
      />

      <div className="w-full flex justify-end items-end p-3">
        {/* <span
          className="p-2 bg-[#ffdd00] rounded-xl "
          onClick={handleLogoutClick}
        >
          Logout
        </span> */}
      </div>
    </div>
  );
};

export default AlreadyExistStudent;
