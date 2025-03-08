import React from "react";
import LoginSugnupPageImg from "../assets/LoginSugnupPageImg.png";

const SignupDetailsPage = () => {
  return (
    <div className=" w-full px-5 pt-5 ">
      <div className=" w-full bg-white rounded-2xl px-8 py-4">
        <div className="flex flex-col w-full  ">
          <h3 className=" text-3xl font-thin text-[#c61d23]"><strong className="font-semibold text-3xl">Welcome to</strong> Scholars Den </h3>
          <h4 className="text-sm">
           Please fill your Admission form
           
          </h4>
        </div>
        <div className="flex w-full justify-between items-end ">
          <img
            className=" w-2/5 "
            src={LoginSugnupPageImg}
            alt="Signup"
          />
          <div>
            TRUST . CARE . HONESTY
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupDetailsPage;