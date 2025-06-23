import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import { fetchAdminDetails } from "../../../redux/adminDetailsSlice";

const AdminSidebar = () => {
  const { adminDetails } = useSelector((state) => state.adminDetails);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarElementList = {
    admin: [
      { to: "/adminDashboard", text: "Remaining" },
      { to: "/approvalComplete", text: "Approved" },
      { to: "/approvalRejected", text: " Rejected" },
    ],
    manager: [
      { to: "/managerDashboard", text: "Approved" },
      { to: "/amountPaid", text: "Paid" },
    ],
    consellor: [{ to: "/consellorDashboard", text: "Assigned" }],
    admissionHead: [{ to: "/admissionHeadDasboard", text: "Admission Taken" }],
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/adminsignup");
  };

  const role = adminDetails?.role;
  console.log("role", role);

  useEffect(() => {
    dispatch(fetchAdminDetails());
  }, []);
  const formatRoleName = (role) => {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  console.log("role", formatRoleName(role));

  return (
    <div
      className="flex flex-col justify-between h-screen pt-4 md:w-full"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={scholarsDenLogo} alt="Scholars Den" />
          <span className="text-white mt-3">
            {role && `${formatRoleName(role)} Panel`}
          </span>
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

        <div className="text-white cursor-pointer mt-4" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
