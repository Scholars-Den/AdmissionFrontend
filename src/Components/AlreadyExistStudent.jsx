import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignupDetailsPage from "./SignupDetailsPage";
import SignupForm from "./SignupForm";

import scholarsDenLogo from "../assets/scholarsdenLogo.png";
import { fetchAlreadyExistingStudent } from "../../redux/alreadyExistStudentSlice";
import { fetchUserDetails } from "../../redux/formDataSlice";
const AlreadyExistStudent = () => {
  const { alreadyExistStudent } = useSelector(
    (state) => state.alreadyExistStudent
  );

  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("alreadyExistStudent", alreadyExistStudent);
     dispatch(fetchUserDetails());
   
  }, []);

  useEffect(()=>{

    console.log("userData from alreadyExistStudent",userData);


    dispatch(fetchAlreadyExistingStudent(userData.parentsContactNumber));
  },[userData])

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      {/* Signup Details Page (Top Section) */}
      <div className="flex-grow">
        <SignupDetailsPage />
      </div>

      {/* Signup Form (Middle Section) */}
      <div className="flex-grow">{alreadyExistStudent}</div>

      {/* Footer (Logo at Bottom) */}
      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default AlreadyExistStudent;
