import React from "react";
import LoginSugnupPageImg from "../assets/LoginSugnupPageImg.png";
import whatsapp from "../assets/whatsapp.png";
import facebook from "../assets/facebook.png";
import twitter from "../assets/twitter.png";
import { Link } from "react-router-dom";

import { Form } from "react-router-dom";
import { User } from "lucide-react";

// const SignupDetailsPage = () => {
//   return (
//     <div className=" w-full px-3 md:px-5 pt-5 ">
//       <div className=" w-full bg-white rounded-2xl px-4 py-2 md:px-8 md:py-4">
//         <div className="flex justify-between w-full  ">
//           <div className="">
//             <h3 className=" text-3xl font-thin text-[#c61d23]">
//               <strong className="font-semibold text-3xl">Welcome to</strong>{" "}
//               Scholars Den{" "}
//             </h3>
//             <h4 className="text-sm">Please fill your Admission Form</h4>
//           </div>
//           <div className="flex flex-col sm:flex-row items-center ">
//             <span className="p-2 text-xs sm:text-lg">+91 8126555222 / 333</span>
//             <div className="flex items-center justify-center ">
//               <Link
//                 to={
//                   "https://api.whatsapp.com/send/?phone=919068701333&text&type=phone_number&app_absent=0"
//                 }
//               >
//                 <img className="w-7 " src={whatsapp} alt="" />
//               </Link>
//               <Link to="https://www.facebook.com/scholsden">
//                 <img className="w-7 " src={facebook} alt="" />
//               </Link>
//               <Link to={"https://x.com/scholsden"} className="text-center h-full" >
//                 <img className="w-7 " src={twitter} alt="" />
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="flex w-full justify-between  items-end ">
//           <img className=" w-2/5 " src={LoginSugnupPageImg} alt="Signup" />
//           <div className="text-xs md:text-xl">TRUST . CARE . HONESTY</div>
//         </div>
//       </div>
//     </div>
//   );
// };

const SignupDetailsPage = ({ heading = "" }) => {
  return (
    <div className="h-full w-full pt-4 p-6">
      <div className=" flex flex-col h-full w-full bg-white rounded-2xl px-2 sm:px-5 py-2">
        {heading === "" ? (
          <h3 className=" text-xl sm:text-3xl font-thin text-[#c61d23]">
            <strong className="font-semibold  ">Welcome to</strong> Scholars Den{" "}
          </h3>
        ) : (
          <h3 className=" text-xl sm:text-3xl font-thin text-[#c61d23]">
            <strong className="font-semibold  ">{heading}</strong>{" "}
          </h3>
        )}
        <div className="flex">
          <div className="flex flex-col justify-between w-full text-xs sm:text-lg">
            <div className="">
              <h4 className=" ">Please fill your Admission Form</h4>
            </div>

            <div className="font-semibold">TRUST . CARE . HONESTY</div>
          </div>
          <div className="flex justify-end ">
            <img className=" w-4/5 " src={LoginSugnupPageImg} alt="Signup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupDetailsPage;
