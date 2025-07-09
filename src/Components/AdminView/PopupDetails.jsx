import React from "react";
import Neeche from "../../assets/Neeche.png";


// Reusable Checkbox with label
function ApprovalCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hover:cursor-pointer"
      />
    </label>
  );
}

// Section wrapper with heading and approval checkbox
function SectionWrapper({ title, approved, onToggle, children }) {
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ApprovalCheckbox label="Approved" checked={approved} onChange={onToggle} />
      </div>
      <div>{children}</div>
    </section>
  );
}

// Dropdown selector for Consellor
function ConsellorSelect({ value, options, onChange, error }) {
  return (
    <div className="flex flex-col rounded-xl bg-white w-full mb-6">
      <label htmlFor="consellor" className="text-sm font-semibold mb-1">
        Assign Consellor
      </label>
      <select
        id="consellor"
        name="consellor"
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 text-black rounded-lg p-2 focus:ring-2 w-full focus:ring-yellow-400 focus:outline-none pr-8"
        style={{
          backgroundImage: `url(${Neeche})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "16px",
        }}
      >
        <option value="">Assign Consellor</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <span className="text-yellow-400 text-sm mt-1">{error}</span>}
    </div>
  );
}

// Display simple key-value pairs
function DetailList({ details }) {
  return (
    <div className="space-y-1">
      {Object.entries(details).map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value}
        </p>
      ))}
    </div>
  );
}

// Document item with checkbox and image preview
function DocumentItem({ label, src, checked, onToggle }) {
  if (!src) return null;
  return (
    <div>
      <div className="flex justify-between pr-2 mb-1">
        <p className="font-medium">{label}</p>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="hover:cursor-pointer"
        />
      </div>
      <a href={src} target="_blank" rel="noreferrer">
        <img
          src={src}
          alt={label}
          className="w-full h-24 object-cover border rounded hover:scale-105 transition"
        />
      </a>
    </div>
  );
}

// Signatures display
function Signatures({ signatures }) {
  if (!signatures) return null;
  return (
    <div className="flex space-x-4">
      <div>
        <p className="font-medium">Student</p>
        <img
          src={signatures.student}
          alt="Student Signature"
          className="w-28 h-12 border rounded object-contain"
        />
      </div>
      <div>
        <p className="font-medium">Parent</p>
        <img
          src={signatures.parent}
          alt="Parent Signature"
          className="w-28 h-12 border rounded object-contain"
        />
      </div>
    </div>
  );
}

// Main popup component
export default function PopupDetails({
  popupData,
  consellorAssign,
  options,
  onChangeOptions,
  error,
  studentDetailsStatus,
  setStudentDetailsStatus,
  parentDetailsStatus,
  setParentDetailsStatus,
  addressDetailsStatus,
  setaddressDetailsStatus,
  documentsDetailsStatus,
  setDocumentsDetailsStatus,
  allDocumentsApproved,
  signatureDetailsStatus,
  setSignatureDetailsStatus,
  onSubmitError,
  submitButtonClickHandler,
}) {
  if (!popupData) return <p>Loading...</p>;

  // Prepare simple key-value mappings for details sections
  const studentDetails = {
    "Acknowledgement Number": popupData.acknowledgementNumber,
    "Aadhaar ID": popupData.aadhaarID,
    "Student Name": popupData.studentName,
    Class: popupData.studentClass,
    Gender: popupData.gender,
    Program: popupData.program,
    Category: popupData.category,
  };

  const parentDetails = {
    "Parent's Contact": popupData.parentsContactNumber,
    "Father's Name": popupData.fatherName,
    "Father's Aadhaar Card": popupData.fatherAadhaarID,
    "Father's Occupations": popupData.fatherOccupations,
    "Mother's Name": popupData.motherName,
    "Mother's Aadhaar Card": popupData.motherAadhaarID,
    "Mother's Occupations": popupData.motherOccupations,
  };

  // const bankDetails = {
  //   "Bank Name": popupData.bankName,
  //   "Account Holder": popupData.accountHolder,
  //   "Account Number": popupData.accountNumber,
  //   "IFSC Code": popupData.ifscCode,
  // };

  const addressDetails = {
    "Address Line1": popupData.address.line1,
    "City": popupData.address.city,
    "State": popupData.address.state,
  };

  return (
    <div className="space-y-4 overflow-y-auto max-h-[70vh] text-sm text-gray-800">
      <ConsellorSelect
        value={consellorAssign}
        options={options}
        onChange={onChangeOptions}
        error={error}
      />

      <SectionWrapper
        title="Student Details"
        approved={studentDetailsStatus}
        onToggle={() => setStudentDetailsStatus((prev) => !prev)}
      >
        <DetailList details={studentDetails} />
      </SectionWrapper>

      <SectionWrapper
        title="Parent Details"
        approved={parentDetailsStatus}
        onToggle={() => setParentDetailsStatus((prev) => !prev)}
      >
        <DetailList details={parentDetails} />
      </SectionWrapper>

      <SectionWrapper
        title="Bank Details"
        approved={addressDetailsStatus}
        onToggle={() => setAddressDetailsStatus((prev) => !prev)}
      >
        <DetailList details={addressDetails} />
      </SectionWrapper>

      <SectionWrapper
        title="Documents"
        approved={allDocumentsApproved}
        onToggle={() => {
          const allChecked = Object.values(documentsDetailsStatus).every(Boolean);
          setDocumentsDetailsStatus({
            // cancelledCheque: !allChecked,
            // passbookPhoto: !allChecked,
            studentAadhaar: !allChecked,
            parentAadhaar: !allChecked,
            studentPhoto: !allChecked,
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <DocumentItem
            label="Student Photo"
            src={popupData.studentPhoto}
            checked={documentsDetailsStatus.studentPhoto}
            onToggle={() =>
              setDocumentsDetailsStatus((prev) => ({
                ...prev,
                studentPhoto: !prev.studentPhoto,
              }))
            }
          />
          {/* <DocumentItem
            label="Cancelled Cheque"
            src={popupData.cancelledCheque}
            checked={documentsDetailsStatus.cancelledCheque}
            onToggle={() =>
              setDocumentsDetailsStatus((prev) => ({
                ...prev,
                cancelledCheque: !prev.cancelledCheque,
              }))
            }
          /> */}
          {/* <DocumentItem
            label="Passbook Photo"
            src={popupData.passbookPhoto}
            checked={documentsDetailsStatus.passbookPhoto}
            onToggle={() =>
              setDocumentsDetailsStatus((prev) => ({
                ...prev,
                passbookPhoto: !prev.passbookPhoto,
              }))
            }
          /> */}
          <DocumentItem
            label="Student Aadhaar"
            src={popupData.studentAadhaar}
            checked={documentsDetailsStatus.studentAadhaar}
            onToggle={() =>
              setDocumentsDetailsStatus((prev) => ({
                ...prev,
                studentAadhaar: !prev.studentAadhaar,
              }))
            }
          />
          <DocumentItem
            label="Parent Aadhaar"
            src={popupData.parentAadhaar}
            checked={documentsDetailsStatus.parentAadhaar}
            onToggle={() =>
              setDocumentsDetailsStatus((prev) => ({
                ...prev,
                parentAadhaar: !prev.parentAadhaar,
              }))
            }
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Signatures"
        approved={signatureDetailsStatus}
        onToggle={() => setSignatureDetailsStatus((prev) => !prev)}
      >
        <Signatures signatures={popupData.signatures} />
      </SectionWrapper>

      {onSubmitError && (
        <span className="flex text-red-600 font-semibold">{onSubmitError}</span>
      )}

      <div className="w-full flex justify-center">
        <button
          className="p-3 hover:bg-yellow-400 bg-yellow-300 rounded-xl font-semibold"
          onClick={submitButtonClickHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
