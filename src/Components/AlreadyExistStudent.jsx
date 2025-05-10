import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignupDetailsPage from "./SignupDetailsPage"; // You can reuse this if it suits your full view
import scholarsDenLogo from "../assets/scholarsdenLogo.png";
import { fetchAlreadyExistingStudent } from "../../redux/alreadyExistStudentSlice";

const AlreadyExistStudent = () => {
  const { existingStudent } = useSelector((state) => state.alreadyExistStudent);
  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchAlreadyExistingStudent(userData.parentsContactNumber));
  }, []);

  const handleCardClick = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  useEffect(() => {
    console.log("existingStudent", existingStudent);
  }, [existingStudent]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
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
              <div className="flex items-center gap-4 border-b pb-4">
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
              </div>

              {/* Section: Student Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Student Details
                </h3>
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
                    <strong>Aadhar ID:</strong> {selectedStudent.aadharID}
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
                  <div className="flex items-center gap-4 text-2xl">
                    <p className="mb-1 font-medium">Student Aadhar</p>
                    <a
                      href={selectedStudent.studentAadhar}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedStudent.studentAadhar}
                        alt="Student Aadhar"
                        className="w-32 h-auto border rounded shadow-md hover:scale-105 transition"
                      />
                    </a>
                  </div>
                </div>
              </section>

              {/* Section: Parent Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Parent Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Father's Name:</strong> {selectedStudent.fatherName}
                  </p>
                  <p>
                    <strong>Father's Aadhar:</strong>{" "}
                    {selectedStudent.fatherAadharId}
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
                    {selectedStudent.motherAadharId}
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
                <div className="flex items-center gap-4 text-2xl">
                  <p className="mb-1 font-medium">Parent Aadhar</p>
                  <a
                    href={selectedStudent.parentAadhar}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={selectedStudent.parentAadhar}
                      alt="Parent Aadhar"
                      className="w-32 h-auto border rounded shadow-md hover:scale-105 transition"
                    />
                  </a>
                </div>
              </section>

              {/* Section: Bank Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Bank Details
                </h3>
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
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-4 text-2xl">
                    <p className="mb-1 font-medium">Cancelled Cheque</p>
                    <a
                      href={selectedStudent.cancelledCheque}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedStudent.cancelledCheque}
                        alt="Cancelled Cheque"
                        className="w-32 h-auto border rounded shadow-md hover:scale-105 transition"
                      />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-2xl">
                    <p className="mb-1 font-medium">Passbook Photo</p>
                    <a
                      href={selectedStudent.passbookPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedStudent.passbookPhoto}
                        alt="Passbook"
                        className="w-32 h-auto border rounded shadow-md hover:scale-105 transition"
                      />
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default AlreadyExistStudent;
