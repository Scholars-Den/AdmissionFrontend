import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import scholarsDenLogo from "../../assets/scholarsdenLogo.png";

const AdminSidebar = () => {
  const { adminDetails } = useSelector((state) => state.adminDetails);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarElementList = {
    admin: [
      { to: "/adminDashboard", text: "Approval Remaining" },
      { to: "/approvalComplete", text: "Approval Completed" },
      { to: "/approvalRejected", text: "Approval Rejected" },
    ],
    manager: [
      { to: "/managerDashboard", text: "Approval Completed" },
    ],
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/adminsignup");
  };

  const role = adminDetails?.role || "manager"; // Fallback to 'admin' if role not set

  return (
    <div
      className="flex flex-col justify-between h-screen pt-4 md:w-full"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={scholarsDenLogo} alt="Scholars Den" />
          <span className="text-white mt-3">Student Panel</span>
        </div>

        <div className="flex flex-col gap-7 w-full justify-end items-end">
          {sidebarElementList[role]?.map((element, index) => (
            <Link
              key={index}
              to={element.to}
              className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 transition-all duration-200 ${
                location.pathname === element.to
                  ? "text-red-600 bg-white"
                  : "text-white"
              }`}
            >
              <h4>{element.text}</h4>
            </Link>
          ))}
        </div>

        <div
          className="text-white cursor-pointer mt-4"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
