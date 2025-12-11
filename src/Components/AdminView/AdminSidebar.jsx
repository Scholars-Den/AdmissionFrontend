// import React, { useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
// import { fetchAdminDetails } from "../../../redux/adminDetailsSlice";

// const AdminSidebar = () => {
//   const { adminDetails } = useSelector((state) => state.adminDetails);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const sidebarElementList = {
//     "admin": [
//       { to: "/adminDashboard", text: "Pending" },
//       { to: "/approvalComplete", text: "Approved" },
//       { to: "/approvalRejected", text: "Not Approved" },
//       { to: "/paymentCompleted", text: "Paid" },
//     ],
//     cashier: [
//       { to: "/cashierDashboard", text: "Approved" },
//       { to: "/amountPaid", text: "Paid" },
//     ],
//     counsellor: [{ to: "/consellorDashboard", text: "Assigned" }],
//     accounts: [{ to: "/accountsDashboard", text: "Amount Paid" }],
//     admissionHead: [{ to: "/admissionHeadDasboard", text: "Admission Taken" }],
//   };

//   const handleLogout = () => {
//     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
//     navigate("/adminsignup");
//   };

//   const role = adminDetails?.role;
//   console.log("role", role);

//   useEffect(() => {
//     dispatch(fetchAdminDetails());
//   }, []);
//   const formatRoleName = (role) => {
//     if (!role) return "";
//     return role
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   console.log("role", formatRoleName(role));

//   return (
//     <div
//       className="flex flex-col justify-between h-screen pt-4 md:w-full"
//       style={{ backgroundColor: "#c61d23" }}
//     >
//       <div className="flex flex-col gap-8 justify-center items-center">
//         <div className="flex flex-col gap-1 items-center">
//           <img className="w-16 h-16" src={scholarsDenLogo} alt="Scholars Den" />
//           <span className="text-white text-center mt-3">
//             {role && `${formatRoleName(role)} Dashboard`}
//           </span>
//           <div className="flex gap-2">
//             {/* <span className="text-black"> Name : </span> */}
//             <span className="text-white  "> {adminDetails.name} </span>
//           </div>
//         </div>

//         <div className="flex flex-col gap-7 w-full justify-end items-end">

//           {console.log("sidebarElementList[role]", sidebarElementList[role])}
//           {console.log("sidebarElementList[role]", role)}
//           {sidebarElementList[role]?.map((element, index) => (
//             <Link
//               key={index}
//               to={element.to}
//               className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 transition-all duration-200 ${
//                 location.pathname === element.to
//                   ? "text-red-600 bg-white"
//                   : "text-white"
//               }`}
//             >
//               <h4>{element.text}</h4>
//             </Link>
//           ))}
//         </div>

//         <div className="text-white cursor-pointer mt-4" onClick={handleLogout}>
//           Logout
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;















import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  User,
  GraduationCap,
  X
} from 'lucide-react';
import { fetchAdminDetails } from "../../../redux/adminDetailsSlice";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { adminDetails } = useSelector((state) => state.adminDetails);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarElementList = {
    admin: [
      { to: "/adminDashboard", text: "Pending", icon: Clock },
      { to: "/approvalComplete", text: "Approved", icon: CheckCircle2 },
      { to: "/approvalRejected", text: "Not Approved", icon: XCircle },
      { to: "/paymentCompleted", text: "Paid", icon: CheckCircle2 },
    ],
    cashier: [
      { to: "/cashierDashboard", text: "Approved", icon: CheckCircle2 },
      { to: "/amountPaid", text: "Paid", icon: CheckCircle2 },
    ],
    counsellor: [{ to: "/consellorDashboard", text: "Assigned", icon: CheckCircle2 }],
    accounts: [{ to: "/accountsDashboard", text: "Amount Paid", icon: CheckCircle2 }],
    admissionHead: [{ to: "/admissionHeadDasboard", text: "Admission Taken", icon: CheckCircle2 }],
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/adminsignup");
  };

  const role = adminDetails?.role;

  useEffect(() => {
    dispatch(fetchAdminDetails());
  }, [dispatch]);

  const formatRoleName = (role) => {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={`
      fixed lg:relative inset-y-0 left-0 z-50
      w-64 bg-gradient-to-b from-[#c61d23] to-[#a01818]
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      flex flex-col shadow-2xl
    `}>
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">Scholars Den</span>
              <span className="text-white/70 text-xs">{formatRoleName(role)}</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-white/70" />
            <span className="text-white text-sm font-medium truncate">{adminDetails?.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarElementList[role]?.map((element, index) => {
          const Icon = element.icon;
          const isActive = location.pathname === element.to;
          return (
            <Link
              key={index}
              to={element.to}
              onClick={() => setSidebarOpen(false)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 font-medium text-sm
                ${isActive 
                  ? 'bg-white text-[#c61d23] shadow-lg' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon size={18} />
              <span>{element.text}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;