import React from "react";
// import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import AlreadyExistStudent from "./AlreadyExistStudent";
import SignupDetailsPage from "../SignupDetailsPage";


const ExistingStudent = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
    {/* Signup Details Page (Top Section) */}
    <div className="">
      <SignupDetailsPage />
    </div>

    {/* Signup Form (Middle Section) */}
    <div className="flex-grow">
      <AlreadyExistStudent />
    </div>

    {/* Footer (Logo at Bottom) */}
    <div className="flex justify-center items-center py-4">
      <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
    </div>
  </div>
  );
};

export default ExistingStudent;