// import { useDispatch } from "react-redux";
// import axios from "../../../api/axios";
// import React, { useEffect, useState } from "react";
// import SelectField from "../../../utils/SelectField";

// const PaymentDashboard = () => {
//   const [approval, setApproval] = useState([]);
//   const [filterData, setFilterData] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null); // for popup content
//   const [popupData, setPopupData] = useState(null); // fetched details
//   const [showPopup, setShowPopup] = useState(false);
//   const [consellorAssign, setConsellorAssign] = useState("");
//   const [options, setOptions] = useState([]);
//   const [filterByAckNumber, setFilterByAckNumber] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // const dispatch = useDispatch

//   const fetchApprovedData = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         `/approval/paid?page=${page}`
//       );
//       const { data, totalPages } = response.data;
//       console.log("response data from fetchApprovedData", response.data);
//       setApproval(data);
//       setFilterData(data);
//       setCurrentPage(page);
//       setTotalPages(totalPages);
//       // optionally store current page or total pages
//     } catch (error) {
//       console.error("Error fetching pending approval data:", error);
//     }
//   };

//   const fetchDetailsByAcknowledgement = async (ackNumber) => {
//     try {
//       const response = await axios.get(`/approval/details/${ackNumber}`);

//       console.log("response data data", response.data.data);

//       setPopupData(response.data.data[0]);
//     } catch (error) {
//       console.error("Error fetching approval details:", error);
//     }
//   };

//   const handleCardClick = (item) => {
//     setSelectedItem(item);
//     setShowPopup(true);
//     fetchDetailsByAcknowledgement(item.acknowledgementNumber);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setSelectedItem(null);
//     setPopupData(null);
//   };

//   useEffect(() => {
//     fetchApprovedData();
//   }, []);

//   const filter = async (page = 1) => {
//     console.log("this filter is working");

//     const data = await axios.post(
//       `/approval/filterAdmissionApproval?page=${page}`,
//       {
//         status: "successful",
//         acknowledgementNumber: filterByAckNumber,
//       }
//     );

//     console.log("filterApproval from filter", data);

//     setFilterData(data.data.data);
//     setCurrentPage(data.data.currentPage);
//     setTotalPages(data.data.totalPages);
//   };

//   useEffect(() => {
//     if (filterByAckNumber) filter();
//     else setFilterData(approval);
//   }, [filterByAckNumber]);

//   useEffect(() => {
//     console.log("filterData from useEffect", filterData);
//   }, [filterData]);
//   return (
//     <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
//       <div className="p-6 pt-2 rounded w-full min-h-screen overflow-auto ">
//         <div className="mb-6">
//           <div className="flex flex-col ">
//             <label className="text-base" htmlFor="">
//               Search By Acknowledgement Number
//             </label>
//             <div className="flex items-center gap-2 w-full ">
//               <input
//                 type="text"
//                 className="p-2 rounded-lg w-1/2"
//                 placeholder="Search By Acknowledgement Number"
//                 value={filterByAckNumber}
//                 onChange={(e) => setFilterByAckNumber(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {filterData?.length === 0 ? (
//           <p className="text-black text-center">No pending approvals</p>
//         ) : (
//           // filterData?.map((item, index) => (
//           //   <div
//           //     key={index}
//           //     onClick={() => handleCardClick(item)}
//           //     className="bg-white rounded p-4 mb-4 shadow-md text-gray-800 cursor-pointer hover:bg-gray-200 transition relative"
//           //   >
//           //     <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium shadow">
//           //       ✅ Approved
//           //     </div>

//           //     <div>
//           //       <strong>Acknowledgement Number:</strong>{" "}
//           //       {item.acknowledgementNumber}
//           //     </div>
//           //     <div>
//           //       <strong>Status:</strong> {item.status}
//           //     </div>
//           //     <div>
//           //       <strong>Message:</strong> {item.message}
//           //     </div>
//           //   </div>
//           // ))

//           <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
//             <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
//               <tr>
//                 <th className="py-3 px-6 text-left">Acknowledgement Number</th>
//                 <th className="py-3 px-6 text-left">Status</th>
//                 {/* <th className="py-3 px-6 text-left">Action</th> */}
//               </tr>
//             </thead>
//             <tbody className="text-gray-800 text-sm">
//               {filterData.map((item, index) => (
//                 <tr
//                   key={index}
//                   onClick={() => handleCardClick(item)}
//                   className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition"
//                 >
//                   <td className="py-3 px-6">{item.acknowledgementNumber}</td>
//                   <td className="py-3 px-6">
//                     <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium shadow">
//                       ⏳ {item.status}
//                     </span>
//                   </td>
//                   {/* <td className="py-3 px-6">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // prevent row click too
//                     handleCardClick(item);
//                   }}
//                   className="text-blue-600 hover:underline"
//                 >
//                   View Details
//                 </button>
//               </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         {totalPages > 1 && (
//           <div className="flex justify-center gap-4 mt-4">
//             <button
//               onClick={() => {
//                 if (filterData) {
//                   filter(currentPage - 1);
//                 } else {
//                   fetchApprovedData(currentPage - 1);
//                 }
//               }}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
//             <button
//               onClick={() => {
//                 if (filterData) {
//                   filter(currentPage + 1);
//                 } else {
//                   fetchApprovedData(currentPage + 1);
//                 }
//               }}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
//             <button
//               onClick={closePopup}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4">Details</h2>
//             {popupData ? (
//               <div className="space-y-4 overflow-y-auto max-h-[70vh] text-sm text-gray-800">
//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">
//                     Student Details
//                   </h3>
//                   <p>
//                     <strong>Acknowledgement Number:</strong>{" "}
//                     {popupData.acknowledgementNumber}
//                   </p>
//                   <p>
//                     <strong>Aadhaar ID:</strong> {popupData.aadhaarID}
//                   </p>
//                   <p>
//                     <strong>Student Name:</strong> {popupData.studentName}
//                   </p>
//                   <p>
//                     <strong>Class:</strong> {popupData.studentClass}
//                   </p>
//                   <p>
//                     <strong>Gender:</strong> {popupData.gender}
//                   </p>
//                   <p>
//                     <strong>Program:</strong> {popupData.program}
//                   </p>
//                   <p>
//                     <strong>Category:</strong> {popupData.category}
//                   </p>
//                   <p>
//                     <strong>Contact Number :</strong>{" "}
//                     {popupData.studentContactNumber}
//                   </p>
//                 </section>

//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">Parent Details</h3>
//                   <p>
//                     <strong>Father's Name:</strong> {popupData.fatherName}
//                   </p>
//                   <p>
//                     <strong>Father's Aaadhaar Card:</strong>{" "}
//                     {popupData.fatherAadhaarID}
//                   </p>
//                   <p>
//                     <strong>Father's Occupations:</strong>{" "}
//                     {popupData.fatherOccupations}
//                   </p>
//                   <p>
//                     <strong>Mother's Name:</strong> {popupData.motherName}
//                   </p>
//                   <p>
//                     <strong>Mother's Aaadhaar Card:</strong>{" "}
//                     {popupData.motherAadhaarID}
//                   </p>
//                   <p>
//                     <strong>Mother's Occupations:</strong>{" "}
//                     {popupData.motherOccupations}
//                   </p>
//                 </section>

//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">Address Details</h3>
//                   <p>
//                     <strong>Address Line1:</strong> {popupData?.address?.line1}
//                   </p>
//                   <p>
//                     <strong>City:</strong> {popupData?.address?.city}
//                   </p>
//                   <p>
//                     <strong>State:</strong> {popupData?.address?.state}
//                   </p>
                
//                 </section>

//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">Student Photo</h3>
//                   <a
//                     href={popupData.studentPhoto}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <img
//                       src={popupData.studentPhoto}
//                       alt="Student"
//                       className="w-28 h-28 object-cover border rounded hover:scale-105 transition"
//                     />
//                   </a>
//                 </section>

//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">Documents</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* {popupData.cancelledCheque && (
//                       <div>
//                         <p className="font-medium">Cancelled Cheque</p>
//                         <a
//                           href={popupData.cancelledCheque}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.cancelledCheque}
//                             alt="Cancelled Cheque"
//                             className="w-full h-24 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )}
//                     {popupData.passbookPhoto && (
//                       <div>
//                         <p className="font-medium">Passbook</p>
//                         <a
//                           href={popupData.passbookPhoto}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.passbookPhoto}
//                             alt="Passbook"
//                             className="w-full h-24 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )} */}
//                     {popupData.studentAadhaar && (
//                       <div>
//                         <p className="font-medium">Student Aadhar</p>
//                         <a
//                           href={popupData.studentAadhaar}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.studentAadhaar}
//                             alt="Student Aadhar"
//                             className="w-full h-24 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )}
//                     {popupData.parentAadhaar && (
//                       <div>
//                         <p className="font-medium">Parent Aadhaar</p>
//                         <a
//                           href={popupData.parentAadhaar}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.parentAadhaar}
//                             alt="Parent Aadhar"
//                             className="w-full h-24 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 <section>
//                   <h3 className="text-lg font-semibold mb-1">Signatures</h3>
//                   <div className="flex space-x-4">
//                     <div>
//                       <p className="font-medium">Student</p>
//                       <img
//                         src={popupData.signatures.student}
//                         alt="Student Signature"
//                         className="w-28 h-12 border rounded object-contain"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium">Parent</p>
//                       <img
//                         src={popupData.signatures.parent}
//                         alt="Parent Signature"
//                         className="w-28 h-12 border rounded object-contain"
//                       />
//                     </div>
//                   </div>
//                 </section>
//               </div>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentDashboard;








import { useDispatch } from "react-redux";
import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import { 
  Search, 
  X, 
  CheckCircle, 
  FileText,
  User,
  MapPin,
  Image,
  PenTool,
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Clock
} from 'lucide-react';

// Reusable Components
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
      <Icon className="w-5 h-5 text-yellow-600" />
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
    <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
  </div>
);

const DocumentCard = ({ title, src }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={title}
        className="w-full h-32 object-cover rounded border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
      />
    </a>
  </div>
);

const PaymentDashboard = () => {
  const [approval, setApproval] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [filterByAckNumber, setFilterByAckNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApprovedData = async (page = 1) => {
    try {
      const response = await axios.get(`/approval/paid?page=${page}`);
      const { data, totalPages } = response.data;
      console.log("response data from fetchApprovedData", response.data);
      setApproval(data);
      setFilterData(data);
      setCurrentPage(page);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching pending approval data:", error);
    }
  };

  const fetchDetailsByAcknowledgement = async (ackNumber) => {
    try {
      const response = await axios.get(`/approval/details/${ackNumber}`);
      console.log("response data data", response.data.data);
      setPopupData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setPopupData(null);
  };

  const filter = async (page = 1) => {
    console.log("this filter is working");
    try {
      const data = await axios.post(`/approval/filterAdmissionApproval?page=${page}`, {
        status: "successful",
        acknowledgementNumber: filterByAckNumber,
      });
      console.log("filterApproval from filter", data);
      setFilterData(data.data.data);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error filtering approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovedData();
  }, []);

  useEffect(() => {
    if (filterByAckNumber) filter();
    else setFilterData(approval);
  }, [filterByAckNumber]);

  useEffect(() => {
    console.log("filterData from useEffect", filterData);
  }, [filterData]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Dashboard</h1>
              <p className="text-sm text-gray-600 mt-0.5">View all paid student applications</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg shadow-lg">
              <DollarSign className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">{filterData.length} Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Acknowledgement Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-gray-900 placeholder-gray-400"
                placeholder="Enter acknowledgement number..."
                value={filterByAckNumber}
                onChange={(e) => setFilterByAckNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Payments Table */}
          {filterData?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Records</h3>
              <p className="text-gray-600">There are no payment records yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acknowledgement Number
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filterData.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handleCardClick(item)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                            <span className="text-sm font-medium text-gray-900">{item.acknowledgementNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <Clock className="w-3 h-3" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => filterByAckNumber ? filter(currentPage - 1) : fetchApprovedData(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => filterByAckNumber ? filter(currentPage + 1) : fetchApprovedData(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showPopup && popupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex items-center justify-between border-b border-white/10 z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Payment Details</h2>
                <p className="text-white/80 text-sm mt-0.5">{popupData.acknowledgementNumber}</p>
              </div>
              <button onClick={closePopup} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Student Details */}
              <Section title="Student Details" icon={User}>
                <InfoGrid>
                  <InfoItem label="Acknowledgement Number" value={popupData.acknowledgementNumber} />
                  <InfoItem label="Aadhaar ID" value={popupData.aadhaarID} />
                  <InfoItem label="Student Name" value={popupData.studentName} />
                  <InfoItem label="Class" value={popupData.studentClass} />
                  <InfoItem label="Gender" value={popupData.gender} />
                  <InfoItem label="Contact" value={popupData.studentContactNumber} />
                  <InfoItem label="Program" value={popupData.program} />
                  <InfoItem label="Category" value={popupData.category} />
                </InfoGrid>
              </Section>

              {/* Parent Details */}
              <Section title="Parent Details" icon={User}>
                <InfoGrid>
                  <InfoItem label="Father's Name" value={popupData.fatherName} />
                  <InfoItem label="Father's Aadhaar" value={popupData.fatherAadhaarID} />
                  <InfoItem label="Father's Occupation" value={popupData.fatherOccupations} />
                  <InfoItem label="Father's Contact" value={popupData.fatherContactNumber} />
                  <InfoItem label="Mother's Name" value={popupData.motherName} />
                  <InfoItem label="Mother's Aadhaar" value={popupData.motherAadhaarID} />
                  <InfoItem label="Mother's Occupation" value={popupData.motherOccupations} />
                  <InfoItem label="Mother's Contact" value={popupData.motherContactNumber} />
                </InfoGrid>
              </Section>

              {/* Address Details */}
              <Section title="Address Details" icon={MapPin}>
                <InfoGrid>
                  <InfoItem label="Address" value={popupData.address?.line1} />
                  <InfoItem label="City" value={popupData.address?.city} />
                  <InfoItem label="State" value={popupData.address?.state} />
                </InfoGrid>
              </Section>

              {/* Documents */}
              <Section title="Documents" icon={Image}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popupData.studentPhoto && (
                    <DocumentCard title="Student Photo" src={popupData.studentPhoto} />
                  )}
                  {popupData.studentAadhaar && (
                    <DocumentCard title="Student Aadhaar" src={popupData.studentAadhaar} />
                  )}
                  {popupData.parentAadhaar && (
                    <DocumentCard title="Parent Aadhaar" src={popupData.parentAadhaar} />
                  )}
                </div>
              </Section>

              {/* Signatures */}
              <Section title="Signatures" icon={PenTool}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Student Signature</p>
                    <img
                      src={popupData.signatures?.student}
                      alt="Student Signature"
                      className="w-full h-20 object-contain bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Parent Signature</p>
                    <img
                      src={popupData.signatures?.parent}
                      alt="Parent Signature"
                      className="w-full h-20 object-contain bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>
              </Section>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={closePopup}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-gray-500/30 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;