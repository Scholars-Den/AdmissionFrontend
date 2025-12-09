import React from "react";
import SignupForm from "./BasicDetailsForm";
import SignupDetailsPage from "./SignupDetailsPage";
import FamilyDetails from "./FamilyDetails";
import SiblingsDetails from "./SiblingsDetails";
import scholarsDenLogo from "../assets/scholarsdenLogo.png";

const SiblingsDetailsComponents = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      {/* Signup Details Page (Top Section) */}
      <div className="flex-grow">
        <SignupDetailsPage />
      </div>

      {/* Signup Form (Middle Section) */}
      <div className="flex-grow">
        <SiblingsDetails />
      </div>

      {/* Footer (Logo at Bottom) */}
      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default SiblingsDetailsComponents;
