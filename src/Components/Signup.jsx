import React from "react";
import SignupForm from "./SignupForm";
import SignupDetailsPage from "./SignupDetailsPage";

const Signup = () => {
  return (
    <div className="w-full h-full overflow-auto bg-[#c61d23] "
    style= {{ paddingBottom: "4px"}}
    >
      <div className="grid grid-rows-10 w-full  overflow-auto  bg-[#c61d23]">
        <div className="row-span-4">
          <SignupDetailsPage />
        </div>
        <div className="row-span-6 h-full ">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;