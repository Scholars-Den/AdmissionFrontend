// import { useDispatch } from "react-redux";
// import axios from "../../../api/axios";
// import React, { useEffect, useState } from "react";
// import SelectField from "../../../utils/SelectField";
// import Neeche from "../../assets/Neeche.png";

// const AdminComponent = () => {
//   const [pendingApproval, setPendingApproval] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null); // for popup content
//   const [popupData, setPopupData] = useState(null); // fetched details
//   const [showPopup, setShowPopup] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const [onSubmitError, setOnSubmitError] = useState("");

//   const [studentDetailsStatus, setStudentDetailsStatus] = useState(false);
//   const [parentDetailsStatus, setParentDetailsStatus] = useState(false);
//   const [addressDetailsStatus, setAddressDetailsStatus] = useState(false);
//   const [documentsDetailsStatus, setDocumentsDetailsStatus] = useState({
//     // cancelledCheque: false,
//     // passbookPhoto: false,
//     studentAadhaar: false,
//     parentAadhaar: false,
//     studentPhoto: false,
//   });
//   const [signatureDetailsStatus, setSignatureDetailsStatus] = useState(false);

//   const [showMessagePopup, setShowMessagePopup] = useState("");

//   const [filterData, setFilterData] = useState([]);

//   const [filterByAckNumber, setFilterByAckNumber] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // const dispatch = useDispatch

//   const [consellorAssign, setConsellorAssign] = useState("");

//   const onChangeOptions = (e) => {
//     setConsellorAssign(e.target.value);
//     setOnSubmitError("");
//   };

//   const [options, setOptions] = useState([]);

//   const fetchAllConsellor = async () => {
//     const response = await axios.get("/admin/allConsoller/");

//     console.log("RESPONSE FROM fetchAllConsollor", response);

//     setOptions(response.data.data.map((options) => options));
//   };
//   const fetchApprovalRemaining = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         `/approval/pendingApproval?page=${page}`
//       );
//       const { data, totalPages } = response.data;
//       setPendingApproval(data);
//       setFilterData(data);
//       setCurrentPage(page);
//       setTotalPages(totalPages);

//       console.log("response dataq data ", response.data.data[0]);
//     } catch (error) {
//       console.error("Error fetching pending approval data:", error);
//     }
//   };

//   const fetchDetailsByAcknowledgement = async (ackNumber) => {
//     try {
//       const response = await axios.get(`/approval/details/${ackNumber}`);
//       console.log("response from fetchDetailsByAcknowledge", response);

//       console.log("response data data", response.data.data);

//       setPopupData(response.data.data[0]);
//     } catch (error) {
//       console.error("Error fetching approval details:", error);
//     }
//   };

//   const handleCardClick = (item) => {
//     setSelectedItem(item);

//     console.log("handleCick", item);
//     console.log("handleCick", item);
//     setAddressDetailsStatus(item?.addressDetails?.status);
//     setParentDetailsStatus(item?.parentDetails?.status);
//     setStudentDetailsStatus(item?.studentDetails?.status);
//     setSignatureDetailsStatus(item?.signatureDetails?.status);
//     setConsellorAssign(item.assignedCounsellor);
//     setDocumentsDetailsStatus({
//       // cancelledCheque: item?.documentsDetails?.cancelledCheque?.status || false,
//       // passbookPhoto: item?.documentsDetails?.passbookPhoto?.status || false,
//       studentAadhaar: item?.documentsDetails?.studentAadhaar?.status || false,
//       parentAadhaar: item?.documentsDetails?.parentAadhaar?.status || false,
//       studentPhoto: item?.documentsDetails?.studentPhoto?.status || false,
//     });
//     setShowPopup(true);
//     fetchAllConsellor();

//     fetchDetailsByAcknowledgement(item.acknowledgementNumber);
//   };

//   const submitMessage = async () => {
//     if (message.length < 1) {
//       setError("Message must be longer than 10 characters");
//       return;
//     }
//     console.log("selectedItem", selectedItem);
//     console.log("message", message);
//     let response = "";

//     console.log("ShowMessagePopup", showMessagePopup);
//     // Collect unverified document names
//     const unverifiedDocs = [];
//     // if (!documentsDetailsStatus.cancelledCheque)
//     //   unverifiedDocs.push("Cancelled Cheque");
//     // if (!documentsDetailsStatus.passbookPhoto)
//     //   unverifiedDocs.push("Passbook Photo");
//     if (!documentsDetailsStatus.studentAadhaar)
//       unverifiedDocs.push("Student Aadhar");
//     if (!documentsDetailsStatus.parentAadhaar)
//       unverifiedDocs.push("Parent Aadhar");
//     if (!documentsDetailsStatus.studentPhoto)
//       unverifiedDocs.push("Student Photo");

//     console.log("documentDetailsstatus", documentsDetailsStatus);

//     const allDocumentsApproved = unverifiedDocs.length === 0;
//     const documentDetailsMessage = allDocumentsApproved
//       ? "The student document has been verified successfully."
//       : `Some document could not be verified due to missing or invalid files`;
//     // const documentDetailsMessage = allDocumentsApproved
//     //   ? "The student document has been verified successfully."
//     //   : `The student document could not be verified due to missing or invalid files: ${unverifiedDocs.map((docName) =>` ${docName}`)}.`;

//     const documentDetailsStructure = {
//       // cancelledCheque: {
//       //   status: documentsDetailsStatus.cancelledCheque,
//       //   message: documentsDetailsStatus.cancelledCheque
//       //     ? "Student info verified"
//       //     : "Student info not verified",
//       // },
//       // passbookPhoto: {
//       //   status: documentsDetailsStatus.passbookPhoto,
//       //   message: documentsDetailsStatus.passbookPhoto
//       //     ? "Student info verified"
//       //     : "Student info not verified",
//       // },
//       studentAadhaar: {
//         status: documentsDetailsStatus.studentAadhaar,
//         message: documentsDetailsStatus.studentAadhaar
//           ? "Student info verified"
//           : "Student info not verified",
//       },
//       parentAadhaar: {
//         status: documentsDetailsStatus.parentAadhaar,
//         message: documentsDetailsStatus.parentAadhaar
//           ? "Student info verified"
//           : "Student info not verified",
//       },
//       studentPhoto: {
//         status: documentsDetailsStatus.studentPhoto,
//         message: documentsDetailsStatus.studentPhoto
//           ? "Student info verified"
//           : "Student info not verified",
//       },

//       status: allDocumentsApproved,
//       message: documentDetailsMessage,
//     };

//     console.log("test documentdetailsData ", documentDetailsStructure);
//     console.log("test documentdetailsData ", showMessagePopup);

//     response = await axios.post("/approval/editAdmissionApproval", {
//       status: showMessagePopup === "approved" ? "approved" : "not approved",
//       acknowledgementNumber: selectedItem.acknowledgementNumber,
//       message,
//       studentDetails: {
//         status: studentDetailsStatus,
//         message: studentDetailsStatus
//           ? "Student info verified"
//           : "Student info not verified",
//       },
//       parentDetails: {
//         status: parentDetailsStatus,
//         message: parentDetailsStatus
//           ? "Parent info verified"
//           : "Parent info not verified",
//       },
//       addressDetails: {
//         status: addressDetailsStatus,
//         message: addressDetailsStatus
//           ? "Address info verified"
//           : "Address info not verified",
//       },
//       documentsDetails: {
//         // cancelledCheque: {
//         //   status: documentsDetailsStatus.cancelledCheque,
//         //   message: documentsDetailsStatus.cancelledCheque
//         //     ? "Student info verified"
//         //     : "Student info not verified",
//         // },
//         // passbookPhoto: {
//         //   status: documentsDetailsStatus.passbookPhoto,
//         //   message: documentsDetailsStatus.passbookPhoto
//         //     ? "Student info verified"
//         //     : "Student info not verified",
//         // },
//         studentAadhaar: {
//           status: documentsDetailsStatus.studentAadhaar,
//           message: documentsDetailsStatus.studentAadhaar
//             ? "Student info verified"
//             : "Student info not verified",
//         },
//         parentAadhaar: {
//           status: documentsDetailsStatus.parentAadhaar,
//           message: documentsDetailsStatus.parentAadhaar
//             ? "Student info verified"
//             : "Student info not verified",
//         },
//         studentPhoto: {
//           status: documentsDetailsStatus.studentPhoto,
//           message: documentsDetailsStatus.studentPhoto
//             ? "Student info verified"
//             : "Student info not verified",
//         },

//         status: allDocumentsApproved,
//         message: documentDetailsMessage,
//       },
//       signatureDetails: {
//         status: signatureDetailsStatus,
//         message: signatureDetailsStatus
//           ? "Student info verified"
//           : "Student info not verified",
//       },
//     });

//     console.log("Response FOR SUBMITmESSAGE", response);

//     console.log(
//       "studentDetailsStatus parentDetailsStatus addressDetailsStatus documentsDetailsStatus",
//       studentDetailsStatus,
//       parentDetailsStatus,
//       addressDetailsStatus,
//       documentsDetailsStatus
//     );
//     console.log(
//       "studentDetailsStatus parentDetailsStatus addressDetailsStatus documentsDetailsStatus",
//       response
//     );

//     setShowMessagePopup("");
//     setMessage("");

//     await fetchApprovalRemaining();

//     setSelectedItem(null);
//     setPopupData(null);
//     setShowPopup(false);

//     console.log("handleClickApproved response", response);
//   };
//   const handleClickRejected = async () => {
//     console.log("selectedItem", selectedItem);

//     const response = await axios.post("/approval/editAdmissionApproval", {
//       status: "rejected",
//       acknowledgementNumber: selectedItem.acknowledgementNumber,
//     });

//     await fetchApprovalRemaining();

//     setSelectedItem(null);
//     setPopupData(null);
//     setShowPopup(false);

//     console.log("handleClickApproved response", response);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setSelectedItem(null);
//     setPopupData(null);
//   };

//   const submitButtonClickHandler = async () => {
//     console.log("consellorAssign", consellorAssign);
//     if (consellorAssign) {
//       console.log("consellorAssign", consellorAssign);

//       const response = await axios.post("/approval/consellor-assign", {
//         consellorAssign,
//         acknowledgementNumber: selectedItem.acknowledgementNumber,
//       });
//       setShowMessagePopup(
//         parentDetailsStatus &&
//           studentDetailsStatus &&
//           addressDetailsStatus &&
//           signatureDetailsStatus &&
//           allDocumentsApproved
//           ? "approved"
//           : "rejected"
//       );
//     } else {
//       setOnSubmitError("Please assign a counselor first.");
//     }
//   };

//   useEffect(() => {
//     fetchApprovalRemaining();
//   }, []);
//   useEffect(() => {
//     console.log("selectedItem", selectedItem);
//   }, [selectedItem]);

//   const fetchAdmissionMessage = async (ackNumber) => {
//     try {
//       console.log("AckNumber", ackNumber);
//       const response = await axios.post(
//         "/approval/getAdmissionApprovalByAcknowledgementNumber",
//         { acknowledgementNumber: ackNumber }
//       );

//       console.log("Testdata ", response);

//       console.log("RESPONSE FETCHaDMISSIONmEWSSAGE", response);
//       setAdmissionStatus(response.data);
//     } catch (error) {
//       // setAdmissionStatusMap((prev) => ({
//       //   ...prev,
//       //   [ackNumber]: "Error fetching status",
//       // }));
//     }
//   };

//   // useEffect(() => {
//   //   fetchAdmissionMessage();
//   // }, []);

//   const filter = async (page = 1) => {
//     console.log("this filter is working");

//     const data = await axios.post(
//       `/approval/filterAdmissionApproval?page=${page}`,
//       {
//         status: "pending",
//         acknowledgementNumber: filterByAckNumber,
//       }
//     );

//     console.log("filterApproval from filter", data);

//     setFilterData(data.data.data);
//     setCurrentPage(data.data.currentPage);
//     setTotalPages(data.data.totalPages);
//   };

//   useEffect(() => {
//     filter();
//   }, [filterByAckNumber]);

//   const allDocumentsApproved = Object.values(documentsDetailsStatus).every(
//     Boolean
//   );

//   return (
//     <div className="flex h-screen justify-center bg-gray-100">
//       <div className="p-6 pt-2 rounded w-full min-h-screen overflow-auto">
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
//         {filterData.length === 0 ? (
//           <p className="text-black text-center">No pending approvals</p>
//         ) : (
//           // filterData.map((item, index) => (
//           //   <div
//           //     key={index}
//           //     onClick={() => handleCardClick(item)}
//           //     className="bg-white rounded p-4 mb-4 shadow-md text-gray-800 cursor-pointer hover:bg-gray-200 transitio relative"
//           //   >
//           //     <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium shadow">
//           //       ⏳ Pending
//           //     </div>
//           //     <div>
//           //       <strong>Acknowledgement Number:</strong>{" "}
//           //       {item.acknowledgementNumber}
//           //     </div>
//           //     <div>
//           //       <strong>Status:</strong> {item.status}
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
//                   fetchApprovalRemaining(currentPage - 1);
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
//                   fetchApprovalRemaining(currentPage + 1);
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
//           <div className="bg-white p-3 rounded shadow-lg max-w-md w-full relative">
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
//                   {/* <SelectField
//                     label={"Assign Consellor"}
//                     name={"consellor"}
//                     value={consellorAssign}
//                     options={options}
//                     onChange={onChangeOptions}
//                     classAdded={"bg-white"}
//                   /> */}

//                   <div
//                     className={`flex flex-col rounded-xl bg-white w-full appearance-none`}
//                   >
//                     {/* <div className="w-full"> */}

//                     <label
//                       htmlFor={"counsellor"}
//                       className="text-sm font-semibold mb-1"
//                     >
//                       {"Assign Counsellor"}
//                     </label>

//                     <select
//                       name={"counsoller"}
//                       value={consellorAssign || ""}
//                       onChange={(e) => onChangeOptions(e)}
//                       className="border border-gray-300 text-black rounded-lg p-2 focus:ring-2 w-full focus:ring-yellow-400 focus:outline-none pr-2"
//                       style={{
//                         backgroundImage: `url(${Neeche})`,
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "right 10px center",
//                         backgroundSize: "16px",
//                       }}
//                     >
//                       <option value=" " className=" ">
//                         {"Assign Counsellor"}
//                       </option>
//                       {options.map((option) => (
//                         <option
//                           className=" text-black border-2 border-black-2 rounded-lg p-3 "
//                           key={option._id}
//                           value={option._id}
//                         >
//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                     {error && (
//                       <span className="text-[#ffdd00] text-sm mt-1">
//                         {error}
//                       </span>
//                     )}
//                     {/* </div> */}
//                   </div>

//                   <div className="flex justify-around">
//                     <h3 className="text-lg font-semibold mb-1">
//                       Student Details
//                     </h3>
//                     <div className="flex gap-2 items-center">
//                       <label htmlFor="">Approved </label>
//                       <input
//                         className="hover:cursor-pointer "
//                         checked={studentDetailsStatus}
//                         type="checkbox"
//                         onChange={() =>
//                           setStudentDetailsStatus((prev) => !prev)
//                         }
//                       />
//                     </div>
//                   </div>
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
//                     <strong>Student Contact Number:</strong> {popupData.studentContactNumber}
//                   </p>
//                   <p>
//                     <strong>Program:</strong> {popupData.program}
//                   </p>
//                   <p>
//                     <strong>Category:</strong> {popupData.category}
//                   </p>
//                 </section>

//                 <section>
//                   <div className="flex justify-around">
//                     <h3 className="text-lg font-semibold mb-1">
//                       Parent Details
//                     </h3>

//                     <div className="flex gap-2 items-center">
//                       <label htmlFor="">Approved </label>
//                       <input
//                         className="hover:cursor-pointer "
//                         checked={parentDetailsStatus}
//                         type="checkbox"
//                         onChange={() => setParentDetailsStatus((prev) => !prev)}
//                       />
//                     </div>
//                   </div>

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
//                     <strong>Father's Contact:</strong>{" "}
//                     {popupData.fatherContactNumber}
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
//                   <p>
//                     <strong>Mother's Contact:</strong>{" "}
//                     {popupData.motherContactNumber}
//                   </p>
//                 </section>

//                 <section>
//                   <div className="flex justify-around">
//                     <h3 className="text-lg font-semibold mb-1">
//                       Address Details
//                     </h3>

//                     <div className="flex gap-2 items-center">
//                       <label htmlFor="">Approved </label>
//                       <input
//                         className="hover:cursor-pointer "
//                         checked={addressDetailsStatus}
//                         type="checkbox"
//                         onChange={() =>
//                           setAddressDetailsStatus((prev) => !prev)
//                         }
//                       />
//                     </div>
//                   </div>

//                   <p>
//                     <strong>Address Line1 :</strong> {popupData?.address?.line1}
//                   </p>
//                   <p>
//                     <strong>City :</strong> {popupData?.address?.city}
//                   </p>
//                   <p>
//                     <strong>State:</strong> {popupData?.address?.state}
//                   </p>
//                 </section>

//                 <section></section>

//                 <section>
//                   <div className="flex justify-around">
//                     <h3 className="text-lg font-semibold mb-1">Documents</h3>

//                     <div className="flex gap-2 items-center">
//                       <label htmlFor="">Approved </label>
//                       <input
//                         className="hover:cursor-pointer"
//                         checked={allDocumentsApproved}
//                         type="checkbox"
//                         onChange={() =>
//                           setDocumentsDetailsStatus((prev) => {
//                             const shouldUncheck =
//                               Object.values(prev).every(Boolean); // all true?
//                             return {
//                               // cancelledCheque: !shouldUncheck,
//                               // passbookPhoto: !shouldUncheck,
//                               studentAadhaar: !shouldUncheck,
//                               parentAadhaar: !shouldUncheck,
//                               studentPhoto: !shouldUncheck,
//                             };
//                           })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     {popupData.studentPhoto && (
//                       <div>
//                         <div className="flex justify-between pr-2">
//                           <p className="font-medium">Student Photo</p>
//                           <input
//                             type="checkbox"
//                             checked={documentsDetailsStatus.studentPhoto}
//                             onChange={() =>
//                               setDocumentsDetailsStatus((prev) => ({
//                                 ...prev,
//                                 studentPhoto: !prev.studentPhoto,
//                               }))
//                             }
//                           />
//                         </div>
//                         <a
//                           href={popupData.studentPhoto}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.studentPhoto}
//                             alt="Student"
//                             className="w-28 h-28 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )}
//                     {/* {popupData.cancelledCheque && (
//                       <div>
//                         <div className="flex justify-between pr-2">
//                           <p className="font-medium">Cancelled Cheque</p>
//                           <input
//                             type="checkbox"
//                             checked={documentsDetailsStatus.cancelledCheque}
//                             onChange={() =>
//                               setDocumentsDetailsStatus((prev) => ({
//                                 ...prev,
//                                 cancelledCheque: !prev.cancelledCheque,
//                               }))
//                             }
//                           />
//                         </div>
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
//                         <div className="flex justify-between pr-2">
//                           <p className="font-medium">Passbook Photo</p>
//                           <input
//                             type="checkbox"
//                             checked={documentsDetailsStatus.passbookPhoto}
//                             onChange={() =>
//                               setDocumentsDetailsStatus((prev) => ({
//                                 ...prev,
//                                 passbookPhoto: !prev.passbookPhoto,
//                               }))
//                             }
//                           />
//                         </div>
//                         <a
//                           href={popupData.passbookPhoto}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={popupData.passbookPhoto}
//                             alt="Passbook Photo"
//                             className="w-full h-24 object-cover border rounded hover:scale-105 transition"
//                           />
//                         </a>
//                       </div>
//                     )} */}

//                     {popupData.studentAadhaar && (
//                       <div>
//                         <div className="flex justify-between pr-2">
//                           <p className="font-medium">Student Aadhar</p>
//                           <input
//                             type="checkbox"
//                             checked={documentsDetailsStatus.studentAadhaar}
//                             onChange={() =>
//                               setDocumentsDetailsStatus((prev) => ({
//                                 ...prev,
//                                 studentAadhaar: !prev.studentAadhaar,
//                               }))
//                             }
//                           />
//                         </div>
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
//                         <div className="flex justify-between pr-2">
//                           <p className="font-medium">Parent Aadhar</p>
//                           <input
//                             type="checkbox"
//                             checked={documentsDetailsStatus.parentAadhaar}
//                             onChange={() =>
//                               setDocumentsDetailsStatus((prev) => ({
//                                 ...prev,
//                                 parentAadhaar: !prev.parentAadhaar,
//                               }))
//                             }
//                           />
//                         </div>
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
//                   <div className="flex justify-around">
//                     <h3 className="text-lg font-semibold mb-1">Signatures</h3>

//                     <div className="flex gap-2 items-center">
//                       <label htmlFor="">Approved </label>
//                       <input
//                         className="hover:cursor-pointer "
//                         checked={signatureDetailsStatus}
//                         type="checkbox"
//                         onChange={() =>
//                           setSignatureDetailsStatus((prev) => !prev)
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="flex space-x-4">
//                     <div>
//                       <p className="font-medium">Student</p>
//                       <img
//                         src={popupData?.signatures?.student}
//                         alt="Student Signature"
//                         className="w-28 h-12 border rounded object-contain"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium">Parent</p>
//                       <img
//                         src={popupData?.signatures?.parent}
//                         alt="Parent Signature"
//                         className="w-28 h-12 border rounded object-contain"
//                       />
//                     </div>
//                   </div>
//                 </section>
//                 {onSubmitError && (
//                   <span className="flex text-[#c61d23]">{onSubmitError}</span>
//                 )}

//                 <div className="w-full flex justify-between">
//                   <button
//                     className="p-3 hover:bg-[#ffdd00] bg-[#f1df68] rounded-xl"
//                     onClick={() => submitButtonClickHandler()}
//                   >
//                     Not Approved
//                   </button>
//                   <button
//                     className="p-3 hover:bg-[#ffdd00] bg-[#f1df68] rounded-xl disabled:bg-gray-400"
//                     disabled={
//                       !(
//                         parentDetailsStatus &&
//                         studentDetailsStatus &&
//                         addressDetailsStatus &&
//                         signatureDetailsStatus &&
//                         allDocumentsApproved
//                       )
//                     }
//                     onClick={() => submitButtonClickHandler()}
//                   >
//                     Approved
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//         </div>
//       )}

//       {showMessagePopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
//             <button
//               onClick={() => setShowMessagePopup("")}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4">Add Message </h2>
//             <label htmlFor="message">Message</label>
//             <input
//               type="text"
//               placeholder="Enter Mesage"
//               className="border-2 w-full p-2 my-3 text-black outline-none"
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <div>
//               {error && <span className="text-[#c61d23]">{error}</span>}
//             </div>
//             <button
//               onClick={submitMessage}
//               className="p-3 hover:bg[#ffdd00] bg-[#f1df68] rounded-xl"
//             >
//               {" "}
//               Submit Message
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminComponent;

























import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { 
  Search, 
  X, 
  Check, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  User,
  MapPin,
  Image as ImageIcon,
  PenTool,
  UserCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Reusable Components
const Section = ({ title, icon: Icon, checked, onToggle, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#c61d23]" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <label className="flex items-center gap-2 cursor-pointer group">
        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Approved</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-5 h-5 rounded border-gray-300 text-[#c61d23] focus:ring-[#c61d23] cursor-pointer"
        />
      </label>
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

const DocumentCard = ({ title, src, checked, onToggle }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold text-gray-700">{title}</p>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-gray-300 text-[#c61d23] focus:ring-[#c61d23] cursor-pointer"
      />
    </div>
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={title}
        className="w-full h-32 object-cover rounded border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
      />
    </a>
  </div>
);

const AdminComponent = () => {
  const [pendingApproval, setPendingApproval] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [onSubmitError, setOnSubmitError] = useState("");
  
  const [studentDetailsStatus, setStudentDetailsStatus] = useState(false);
  const [parentDetailsStatus, setParentDetailsStatus] = useState(false);
  const [addressDetailsStatus, setAddressDetailsStatus] = useState(false);
  const [documentsDetailsStatus, setDocumentsDetailsStatus] = useState({
    studentAadhaar: false,
    parentAadhaar: false,
    studentPhoto: false,
  });
  const [signatureDetailsStatus, setSignatureDetailsStatus] = useState(false);
  
  const [showMessagePopup, setShowMessagePopup] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [filterByAckNumber, setFilterByAckNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [consellorAssign, setConsellorAssign] = useState("");
  const [options, setOptions] = useState([]);

  const onChangeOptions = (e) => {
    setConsellorAssign(e.target.value);
    setOnSubmitError("");
  };

  const fetchAllConsellor = async () => {
    try {
      const response = await axios.get("/admin/allConsoller/");
      console.log("RESPONSE FROM fetchAllConsollor", response);
      setOptions(response.data.data.map((options) => options));
    } catch (error) {
      console.error("Error fetching counsellors:", error);
    }
  };

  const fetchApprovalRemaining = async (page = 1) => {
    try {
      const response = await axios.get(`/approval/pendingApproval?page=${page}`);
      const { data, totalPages } = response.data;
      setPendingApproval(data);
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
      setPopupData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setAddressDetailsStatus(item?.addressDetails?.status);
    setParentDetailsStatus(item?.parentDetails?.status);
    setStudentDetailsStatus(item?.studentDetails?.status);
    setSignatureDetailsStatus(item?.signatureDetails?.status);
    setConsellorAssign(item.assignedCounsellor);
    setDocumentsDetailsStatus({
      studentAadhaar: item?.documentsDetails?.studentAadhaar?.status || false,
      parentAadhaar: item?.documentsDetails?.parentAadhaar?.status || false,
      studentPhoto: item?.documentsDetails?.studentPhoto?.status || false,
    });
    setShowPopup(true);
    fetchAllConsellor();
    fetchDetailsByAcknowledgement(item.acknowledgementNumber);
  };

  const submitMessage = async () => {
    if (message.length < 1) {
      setError("Message must be longer than 10 characters");
      return;
    }

    const unverifiedDocs = [];
    if (!documentsDetailsStatus.studentAadhaar) unverifiedDocs.push("Student Aadhar");
    if (!documentsDetailsStatus.parentAadhaar) unverifiedDocs.push("Parent Aadhar");
    if (!documentsDetailsStatus.studentPhoto) unverifiedDocs.push("Student Photo");

    const allDocumentsApproved = unverifiedDocs.length === 0;
    const documentDetailsMessage = allDocumentsApproved
      ? "The student document has been verified successfully."
      : `Some document could not be verified due to missing or invalid files`;

    try {
      const response = await axios.post("/approval/editAdmissionApproval", {
        status: showMessagePopup === "approved" ? "approved" : "not approved",
        acknowledgementNumber: selectedItem.acknowledgementNumber,
        message,
        studentDetails: {
          status: studentDetailsStatus,
          message: studentDetailsStatus ? "Student info verified" : "Student info not verified",
        },
        parentDetails: {
          status: parentDetailsStatus,
          message: parentDetailsStatus ? "Parent info verified" : "Parent info not verified",
        },
        addressDetails: {
          status: addressDetailsStatus,
          message: addressDetailsStatus ? "Address info verified" : "Address info not verified",
        },
        documentsDetails: {
          studentAadhaar: {
            status: documentsDetailsStatus.studentAadhaar,
            message: documentsDetailsStatus.studentAadhaar ? "Student info verified" : "Student info not verified",
          },
          parentAadhaar: {
            status: documentsDetailsStatus.parentAadhaar,
            message: documentsDetailsStatus.parentAadhaar ? "Student info verified" : "Student info not verified",
          },
          studentPhoto: {
            status: documentsDetailsStatus.studentPhoto,
            message: documentsDetailsStatus.studentPhoto ? "Student info verified" : "Student info not verified",
          },
          status: allDocumentsApproved,
          message: documentDetailsMessage,
        },
        signatureDetails: {
          status: signatureDetailsStatus,
          message: signatureDetailsStatus ? "Student info verified" : "Student info not verified",
        },
      });

      setShowMessagePopup("");
      setMessage("");
      await fetchApprovalRemaining();
      setSelectedItem(null);
      setPopupData(null);
      setShowPopup(false);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setPopupData(null);
    setMessage("");
    setError("");
    setOnSubmitError("");
    setShowMessagePopup("");
  };

  const submitButtonClickHandler = async () => {
    if (consellorAssign) {
      try {
        await axios.post("/approval/consellor-assign", {
          consellorAssign,
          acknowledgementNumber: selectedItem.acknowledgementNumber,
        });
        
        const allDocumentsApproved = Object.values(documentsDetailsStatus).every(Boolean);
        setShowMessagePopup(
          parentDetailsStatus &&
          studentDetailsStatus &&
          addressDetailsStatus &&
          signatureDetailsStatus &&
          allDocumentsApproved
            ? "approved"
            : "rejected"
        );
      } catch (error) {
        console.error("Error assigning counsellor:", error);
      }
    } else {
      setOnSubmitError("Please assign a counselor first.");
    }
  };

  const filter = async (page = 1) => {
    try {
      const data = await axios.post(`/approval/filterAdmissionApproval?page=${page}`, {
        status: "pending",
        acknowledgementNumber: filterByAckNumber,
      });
      setFilterData(data.data.data);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error filtering approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovalRemaining();
  }, []);

  useEffect(() => {
    filter();
  }, [filterByAckNumber]);

  const allDocumentsApproved = Object.values(documentsDetailsStatus).every(Boolean);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ffdd00]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#c61d23]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pending Approvals</h1>
              <p className="text-sm text-gray-600 mt-0.5">Review and approve student applications</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c61d23] to-[#a01818] rounded-lg shadow-lg">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">{filterData.length} Pending</span>
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] transition-all text-gray-900 placeholder-gray-400"
                placeholder="Enter acknowledgement number..."
                value={filterByAckNumber}
                onChange={(e) => setFilterByAckNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Approvals Table */}
          {filterData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
              <p className="text-gray-600">All applications have been processed</p>
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
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#c61d23] transition-colors" />
                            <span className="text-sm font-medium text-gray-900">{item.acknowledgementNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
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
                    onClick={() => filterData ? filter(currentPage - 1) : fetchApprovalRemaining(currentPage - 1)}
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
                    onClick={() => filterData ? filter(currentPage + 1) : fetchApprovalRemaining(currentPage + 1)}
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
            <div className="sticky top-0 bg-gradient-to-r from-[#c61d23] to-[#a01818] px-6 py-4 flex items-center justify-between border-b border-white/10 z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Application Details</h2>
                <p className="text-white/80 text-sm mt-0.5">{popupData.acknowledgementNumber}</p>
              </div>
              <button onClick={closePopup} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Counsellor Assignment */}
              <div className="bg-gradient-to-br from-[#fff9e6] to-[#fffbf0] rounded-xl p-4 border border-[#ffdd00]/30">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Counsellor *
                </label>
                <div className="relative">
                  {/* <UserCheck className="absolute left-3  top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                  <select
                    value={consellorAssign || ""}
                    onChange={onChangeOptions}
                    className="w-full pl-10 pr-4 py-3 px-7 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ffdd00]/30 focus:border-[#ffdd00] transition-all text-gray-900"
                  >
                    <option value="">Select a counsellor...</option>
                    {options.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                {onSubmitError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {onSubmitError}
                  </p>
                )}
              </div>

              {/* Student Details */}
              <Section
                title="Student Details"
                icon={User}
                checked={studentDetailsStatus}
                onToggle={() => setStudentDetailsStatus(!studentDetailsStatus)}
              >
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
              <Section
                title="Parent Details"
                icon={User}
                checked={parentDetailsStatus}
                onToggle={() => setParentDetailsStatus(!parentDetailsStatus)}
              >
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
              <Section
                title="Address Details"
                icon={MapPin}
                checked={addressDetailsStatus}
                onToggle={() => setAddressDetailsStatus(!addressDetailsStatus)}
              >
                <InfoGrid>
                  <InfoItem label="Address" value={popupData.address?.line1} />
                  <InfoItem label="City" value={popupData.address?.city} />
                  <InfoItem label="State" value={popupData.address?.state} />
                </InfoGrid>
              </Section>

              {/* Documents */}
              <Section
                title="Documents"
                icon={ImageIcon}
                checked={allDocumentsApproved}
                onToggle={() => {
                  const shouldUncheck = Object.values(documentsDetailsStatus).every(Boolean);
                  setDocumentsDetailsStatus({
                    studentAadhaar: !shouldUncheck,
                    parentAadhaar: !shouldUncheck,
                    studentPhoto: !shouldUncheck,
                  });
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popupData.studentPhoto && (
                    <DocumentCard
                      title="Student Photo"
                      src={popupData.studentPhoto}
                      checked={documentsDetailsStatus.studentPhoto}
                      onToggle={() =>
                        setDocumentsDetailsStatus((prev) => ({
                          ...prev,
                          studentPhoto: !prev.studentPhoto,
                        }))
                      }
                    />
                  )}
                  {popupData.studentAadhaar && (
                    <DocumentCard
                      title="Student Aadhaar"
                      src={popupData.studentAadhaar}
                      checked={documentsDetailsStatus.studentAadhaar}
                      onToggle={() =>
                        setDocumentsDetailsStatus((prev) => ({
                          ...prev,
                          studentAadhaar: !prev.studentAadhaar,
                        }))
                      }
                    />
                  )}
                  {popupData.parentAadhaar && (
                    <DocumentCard
                      title="Parent Aadhaar"
                      src={popupData.parentAadhaar}
                      checked={documentsDetailsStatus.parentAadhaar}
                      onToggle={() =>
                        setDocumentsDetailsStatus((prev) => ({
                          ...prev,
                          parentAadhaar: !prev.parentAadhaar,
                        }))
                      }
                    />
                  )}
                </div>
              </Section>

              {/* Signatures */}
              <Section
                title="Signatures"
                icon={PenTool}
                checked={signatureDetailsStatus}
                onToggle={() => setSignatureDetailsStatus(!signatureDetailsStatus)}
              >
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
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={submitButtonClickHandler}
                disabled={
                  parentDetailsStatus &&
                  studentDetailsStatus &&
                  addressDetailsStatus &&
                  signatureDetailsStatus &&
                  allDocumentsApproved
                }
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30 active:scale-95"
              >
                <XCircle size={18} />
                Not Approved
              </button>
              <button
                onClick={submitButtonClickHandler}
                disabled={
                  !(
                    parentDetailsStatus &&
                    studentDetailsStatus &&
                    addressDetailsStatus &&
                    signatureDetailsStatus &&
                    allDocumentsApproved
                  )
                }
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30 active:scale-95"
              >
                <CheckCircle2 size={18} />
                Approved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-[#c61d23] to-[#a01818] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Add Message</h2>
              <button onClick={() => setShowMessagePopup("")} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  placeholder="Enter your message (minimum 10 characters)..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] transition-all text-gray-900 placeholder-gray-400 min-h-[120px] resize-none"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                  }}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14}
                    />
                    {error}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-4">
              <button
                onClick={() => setShowMessagePopup("")}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-lg transition-all hover:bg-gray-100 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={submitMessage}
                className="px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold rounded-lg transition-all hover:from-[#a01818] hover:to-[#c61d23] active:scale-95"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminComponent;