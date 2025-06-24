import DocumentUpload from "./DocumentUpload";
import SignupDetailsPage from "./SignupDetailsPage";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";

const DocumentDetails = () => {
  const documentRequired = [
    { label: "Student Aadhaar Card", name: "studentAadhaar" },
    { label: "Student Photo", name: "studentPhoto" },
    {
      label: "Aadhaar Of One Of The Parents/Guardian Mentined In Student Aadhaar",
      name: "parentAadhaar",
    },
    { label: "Passbook", name: "passbookPhoto" },
    { label: "Cancelled Cheque", name: "cancelledCheque" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      <div className="flex-grow">
        <SignupDetailsPage />
      </div>

      <div className="flex-grow">
        <DocumentUpload documentRequired={documentRequired} />
      </div>

      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default DocumentDetails;
