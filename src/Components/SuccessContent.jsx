import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, updateUserDetails } from "../../redux/formDataSlice";
import axios from "axios";

const SuccessContent = () => {
  const navigate = useNavigate();

  const [tokenNumber, setTokenNumber] = useState("");

  const { userData } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();
  const [time, setTime] = useState(3);
  const userdata = {};

  const clickHandler = async () => {
    await dispatch(updateUserDetails(userdata));

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  // useEffect(() => {

  //   const interval = setInterval(async () => {

  //     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  //     await dispatch(updateUserDetails(userdata));
  //     navigate("/");

  //   }, 3000);

  //   return () => clearInterval(interval); // Clean up the interval on component unmount
  // }, [navigate]);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);

  useEffect(() => {
    console.log("userData from useEffect", userData);
  }, [userData]);
  //   useEffect(() => {
  //     const tokenNo = async () => {

  //       try{

  //         const response = await axios.get("/user/getTokenNo");
  //         console.log("response from tokenNo", response);
  //         setTokenNumber(response.data.tokenNo);
  //       }catch(error){
  //         console.log("error from tokenNo", error);
  //       }
  //     };

  //     console.log("userData from tokenNo", userData);

  //     tokenNo();
  //   }, []);

  const createApprovalRequest = async () => {
    try{

      const response = await axios.post("/approval/addAdmissionApproval", {
        admissionRollNo: userData.admissionRollNo,
      });
  
      console.log("response fro createApprovalRequest", response);
    }catch(error){
      console.log("error for createApprovalRequest", error);
    }


  };

  useEffect(() => {
    if (userData) {
      createApprovalRequest();
    }
  }, [userData]);

  return (
    <div className="flex flex-col justify-center items-center text-white gap-4 mt-3">
      <h1 className="text-3xl font-thin text-center ">Admisssion Form</h1>

      <div className="w-2/3 border border-gray-300 py-6 px-9 rounded-2xl flex flex-col  items-center justify-center gap-4">
        <p className="mb-1 text-2xl text-center w-3/4 ">
          Your form has been submitted successfully!
        </p>
        <p className="text-2xl font-extralight text-center">
          {`Your Acknowledgement Number is. ${userData.acknowledgementNumber}`}
        </p>
        {/* <p className="text-2xl font-extralight text-center">
      {`Your Enrollment No. is. ${userData.enrollmentNumber}`}
    </p> */}

        {/* <p>{`Redirecting to Home in ${time} second${
        time !== 1 ? "s" : ""
      }`}</p> */}
        <button
          onClick={clickHandler}
          className=" text-black shadow-md bg-[#ffdd00] font-semibold py-2 px-6 rounded-full hover:bg-[#fff000] transition duration-200"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessContent;
