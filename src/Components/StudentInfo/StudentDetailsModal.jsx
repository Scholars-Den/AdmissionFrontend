import React, { useState } from "react";
import InfoSection from "./InfoSection";
import DocumentSection from "./DocumentSection";
import SignatureSection from "./SignatureSection";
import StatusBadge from "../../../utils/StatusBadge";

const TABS = ["Student", "Parent", "Bank", "Documents", "Signatures"];

const StudentDetailsModal = ({
  selectedStudent,
  admisionStatus,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState("Student");

  if (!selectedStudent) return null;

  const sectionData = {
    Student: [
      ["Class", selectedStudent.studentClass],
      ["Gender", selectedStudent.gender],
      ["Program", selectedStudent.program],
      ["Aadhar ID", selectedStudent.aadhaarID],
      ["Category", selectedStudent.category],
      ["Siblings Position", selectedStudent.siblingsPosition],
      ["Brothers", selectedStudent.noOfBrother],
      ["Sisters", selectedStudent.noOfSister],
    ],
    Parent: [
      ["Father's Name", selectedStudent.fatherName],
      ["Father's Aadhar", selectedStudent.fatherAadhaarID],
      ["Father's Occupation", selectedStudent.fatherOccupations],
      ["Mother's Name", selectedStudent.motherName],
      ["Mother's Aadhar", selectedStudent.motherAadhaarID],
      ["Mother's Occupation", selectedStudent.motherOccupations],
      ["Contact Number", selectedStudent.parentsContactNumber],
    ],
    Bank: [
      ["Account Holder", selectedStudent.accountHolder],
      ["Account Number", selectedStudent.accountNumber],
      ["Bank Name", selectedStudent.bankName],
      ["IFSC Code", selectedStudent.ifscCode],
      ["Relation with Student", selectedStudent.relationWithStudent],
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="text-3xl">&times;</span>
        </button>

        <div className=" p-2 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4">
            <img
              src={selectedStudent.studentPhoto}
              alt="Student"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
            <div className="flex justify-between items-end w-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-700">
                  {selectedStudent.studentName}
                </h2>
                <p className="text-sm text-gray-600">
                  Ack No: {selectedStudent.acknowledgementNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Class: {selectedStudent.studentClass}
                </p>
                <p className="text-sm text-gray-600">
                  Class: {selectedStudent.studentClass}
                </p>
              </div>
              {selectedStudent?.approvalStatus && (
                <StatusBadge
                  status={selectedStudent.approvalStatus}
                  message={selectedStudent.approvalMessage}
                />
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-red-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "Student" && (
              <InfoSection title="Student Details" data={sectionData.Student} />
            )}
            {activeTab === "Parent" && (
              <InfoSection title="Parent Details" data={sectionData.Parent} />
            )}
            {activeTab === "Bank" && (
              <InfoSection title="Bank Details" data={sectionData.Bank} />
            )}
            {activeTab === "Documents" && (
              <DocumentSection
                student={selectedStudent}
                status={admisionStatus?.data?.documentsDetails}
              />
            )}
            {activeTab === "Signatures" && (
              <SignatureSection signatures={selectedStudent.signatures} />
            )}
          </div>

          {/* Footer */}

          <div className="flex justify-end">
            {admisionStatus?.data?.status !== "approved" && (
              <button
                onClick={onEdit}
                disabled={admisionStatus?.data?.status === "pending"}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg transition disabled:opacity-50"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
