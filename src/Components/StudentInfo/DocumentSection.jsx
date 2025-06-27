import React from "react";

const documents = [
  { label: "Student Photo", key: "studentPhoto" },
  { label: "Cancelled Cheque", key: "cancelledCheque" },
  { label: "Passbook Photo", key: "passbookPhoto" },
  { label: "Student Aadhar", key: "studentAadhaar" },
  { label: "Parent Aadhar", key: "parentAadhaar" },
];

const DocumentSection = ({ student, status }) => (
  <section>
    <h3 className="mb-2 text-lg font-semibold text-gray-700">Documents</h3>
    <div className="flex flex-wrap justify-center sm:justify-start gap-6">
      {documents.map(({ label, key }) => (
        <div key={key} className="space-y-1 text-center">
          <p className="text-sm font-medium">{label}</p>
          <div className="relative w-24 h-24">
            <a href={student[key]} target="_blank" rel="noopener noreferrer">
              <img
                src={student[key]}
                alt={label}
                className="w-full h-full border rounded shadow hover:scale-105 transition"
              />
            </a>
            {status?.[key] && (
              <span
                className={`absolute top-1 left-1 px-2 text-xs font-semibold text-white rounded ${
                  status[key].status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                { student.approvalStatus !="pending" && !status[key].status && "Rejected"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default DocumentSection;
