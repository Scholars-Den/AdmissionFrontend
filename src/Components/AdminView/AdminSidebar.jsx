import React from "react";

import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {


  const navigate = useNavigate();
  const handleLogout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/adminsignup");
  };
  return (
    <div
      className="flex flex-col justify-between h-screen pt-4 md:w-full"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className=" flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={scholarsDenLogo} alt="" />
          <span className="text-white mt-3">Student Panel</span>
        </div>

        <div className="flex flex-col gap-7 w-full justify-end items-end">
          <Link
            to={"/adminDashboard"}
            className={`flex gap-3 w-5/6 items-end rounded-l-full p-3  ${
              location.pathname === "/adminDashboard"
                ? "text-red-600 bg-white "
                : "text-white"
            } `}
          >
            {/* <div className="flex justify-center items-center gap-3"> */}

            <h4>Approval Remaining </h4>
            {/* </div> */}
          </Link>
          <Link
            to={"/approvalComplete"}
            className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 ${
              location.pathname === "/approvalComplete"
                ? "text-red-600 bg-white "
                : "text-white"
            } `}
          >
            <h4>Approval Completed</h4>
            {/* </div> */}
          </Link>
          <Link
            to={"/approvalRejected"}
            className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 ${
              location.pathname === "/approvalRejected"
                ? "text-red-600 bg-white "
                : "text-white"
            } `}
          >
            <h4>Approval Rejected</h4>
            {/* </div> */}
          </Link>
        </div>
        <div
          className="text-white justify-end items-end"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>

      {/* <div className={`flex gap-3 justify-center mb-9 text-white cursor-pointer `}
      onClick={handleLogout}
      >
        <img src={LogoutLightMode} alt="" />
        <h4>Logout</h4>
      </div> */}
    </div>
  );
};

export default AdminSidebar;
