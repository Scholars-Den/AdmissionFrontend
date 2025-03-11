import React from "react";
import SignupForm from "./SignupForm";
import SignupDetailsPage from "./SignupDetailsPage";
import FamilyDetails from "./FamilyDetails";

const FamilyComponents = () => {
  return (
    <div className="w-full h-screen overflow-auto bg-[#c61d23] "
    style= {{ paddingBottom: "4px"}}
    >
      <div className="grid grid-rows-9 w-full  overflow-auto  bg-[#c61d23]">
        <div className="row-span-3">
          <SignupDetailsPage />
        </div>
        <div className="row-span-6 h-full ">
          <FamilyDetails />
        </div>
      </div>
    </div>
  );
};

export default FamilyComponents;