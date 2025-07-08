import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import {
  fetchUserDetails,
  submitAddressForm,
  submitBankRefundForm,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputField";
import CheckboxField from "../../utils/CheckboxField";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";

const BankRefundForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signatures, setSignatures] = useState({
    parent: "",
    admissionHead: "",
  });

  const [errors, setErrors] = useState({});

  const signatureRefs = {
    admissionHead: React.createRef(),
    parent: React.createRef(),
  };

  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   console.log("name", name, "value", value, "type", type, "checked", checked);
  //   setFormData((prev) => ({
  //     ...prev,
  //     [type === "checkbox" ? "documents" : "formData"]: {
  //       ...prev[type === "checkbox" ? "documents" : "formData"],
  //       [name]: type === "checkbox" ? checked : value,
  //     },

  //   }));
  // };

  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   console.log("name value type checked", name, value, type, checked);

  //   let updatedFormData;

  //   console.log("name", name, "value", value, "type", type, "checked", checked);

  //   if (type === "text") {
  //     updatedFormData = { [name]: value };
  //   } else if (type === "checkbox") {
  //     updatedFormData = {
  //       documents: {
  //         ...userData.documents,
  //         [name]: checked,
  //       },
  //     };
  //   }

  //   // Correcting this line to properly update state
  //   setFormData((prev) => ({ ...prev, ...updatedFormData }));

  //   if (value.trim()) {
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //   }
  // };

  // const handleChange = (e) => {
  //   if (studentAdmissionApprovalDetails?.bankDetails?.status) {
  //     return;
  //   }
  //   const { name, value, type, checked } = e.target;
  //   console.log(
  //     "name:",
  //     name,
  //     "value:",
  //     value,
  //     "type:",
  //     type,
  //     "checked:",
  //     checked
  //   );

  //   if (type === "checkbox") {
  //     dispatch(
  //       updateUserDetails({
  //         documents: {
  //           ...userData?.documents, // Ensure previous document data is preserved
  //           [name]: checked,
  //         },
  //       })
  //     );
  //   } else {
  //     dispatch(updateUserDetails({ [name]: value }));
  //   }

  //   // Remove errors if the user fills the field
  //   if (value.trim()) {
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      updatedData = {
        address: {
          ...userData?.address,
          [field]: value,
        },
      };
    } else {
      updatedData = { [name]: value };
    }

    dispatch(updateUserDetails(updatedData));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // const handleSignatureEnd = (key) => {
  //   console.log("key", key);
  //   setSignatures((prev) => ({
  //     ...prev,
  //     [key]: signatureRefs[key].current.toDataURL(),
  //   }));
  //   setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  // };

  // const clearSignature = (key) => {
  //   signatureRefs[key]?.current?.clear();
  //   setFormData((prev) => ({
  //     ...prev,
  //     signatures: {
  //       ...prev.signatures,
  //       [key]: "",
  //     },
  //   }));
  // };

 const validateForm = () => {
  let formErrors = {};
  let isValid = true;

  // Validate required fields
  const requiredFields = [
    { name: "address.line1", label: "Address Line 1" },
    { name: "address.city", label: "City" },
    { name: "address.status", label: "Status" },
    // { name: "isExistingStudent", label: "Is Existing Student" },
    // { name: "schoolName", label: "School Name" },
  ];

  requiredFields.forEach(({ name, label }) => {
    const keys = name.split(".");
    const value = keys.length === 2 ? userData?.[keys[0]]?.[keys[1]] : userData?.[name];

    if (!value || value.trim() === "") {
      formErrors[name] = `${label} is required`;
      isValid = false;
    }
  });

  setErrors(formErrors);
  console.log("formErrors", formErrors);

  return isValid;
};

  useEffect(() => {
    dispatch(fetchUserDetails()).then((action) => {
      console.log("action.payload", action.payload);
      const fetchedUserData = action.payload; // Extract payload from Redux action
      console.log(
        "userData in useEffect",
        fetchedUserData?.userData?.signatures
      );
      if (fetchedUserData?.userData?.signatures) {
        setSignatures(fetchedUserData?.userData?.signatures);
      }
    });
  }, []);
  useEffect(() => {
    console.log("userData form Use", userData);
    if (userData?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userData.acknowledgementNumber));
    }
  }, [userData]);

  // After fetching, load the signature data into the canvas
  // useEffect(() => {
  //   Object.keys(signatures).forEach((key) => {
  //     if (signatures[key] && signatureRefs[key]?.current) {
  //       setTimeout(() => {
  //         signatureRefs[key]?.current?.fromDataURL(signatures[key]);
  //       }, 300); // Delay ensures canvas is ready
  //     }
  //   });
  // }, [signatures]);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("onsUBMIT click");

    if (!validateForm()) return;
    try {
      const formData = { ...userData, signatures };

      const testdata = await dispatch(submitAddressForm(formData));


      console.log("testdata from onSubmit button", testdata);
      console.log("Test Data", testdata);
      // navigate("/admissionComplete");
    } catch (error) {
      console.log("Error submitting form:", error);
    }
    //  finally {
    //   dispatch(setLoading(false));
    // }
  };

  return (
    // <div className="w-full ">
    //   {loading && <Spinner />}
    //   <form
    //     className="flex flex-col px-4 items-center gap-2 py-2 text-white"
    //     onSubmit={onSubmit}
    //   >
    //     <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
    //       Address Details
    //     </h2>
    //     {studentAdmissionApprovalDetails?.bankDetails &&
    //       (studentAdmissionApprovalDetails?.bankDetails?.status ? (
    //         <div className="flex flex-col w-full gap-4 justify-end items-end mb-4 ">
    //           {/* <span className="text-white">
    //        {  studentAdmissionApprovalDetails?.bankDetails.message}
    //       </span> */}
    //           <span
    //             className={`${
    //               studentAdmissionApprovalDetails?.bankDetails?.status
    //                 ? "bg-green-500 "
    //                 : "bg-red-500 text-white"
    //             } p-2 rounded-xl`}
    //           >
    //             {studentAdmissionApprovalDetails?.bankDetails?.status
    //               ? "Approved"
    //               : "Rejected"}
    //           </span>
    //         </div>
    //       ) : (
    //         <div className="flex flex-col w-full gap-4 justify-end items-end mb-4 ">
    //           {/* <span className="text-white">
    //        {  studentAdmissionApprovalDetails?.bankDetails.message}
    //       </span> */}
    //           <span
    //             className={`${
    //               studentAdmissionApprovalDetails?.bankDetails?.status
    //                 ? "bg-green-500 "
    //                 : "bg-red-500 text-white"
    //             } p-2 rounded-xl`}
    //           >
    //             {studentAdmissionApprovalDetails?.bankDetails?.message}
    //           </span>
    //         </div>
    //       ))}
    //     {/* <h3 className="mt-6 text-lg font-semibold">Address Details</h3> */}
    //     {[
    //       { label: "Address Line 1", name: "address.line1" },
    //       { label: "City", name: "address.city" },
    //       { label: "Status", name: "address.status" },
    //     ].map(({ label, name }) => (
    //       <InputField
    //         key={name}
    //         name={name}
    //         value={
    //           name.startsWith("address.")
    //             ? userData?.address?.[name.split(".")[1]] || ""
    //             : userData?.[name] || ""
    //         }
    //         label={label}
    //         onChange={handleChange}
    //         placeholder={label}
    //         error={errors[name]}
    //       />
    //     ))}

    //     {/* <div className="grid md:grid-cols-2 gap-4">
    //         {["admissionHead", "parent"].map((key) => (
    //           <div key={key} className="flex flex-col items-center">
    //             <h3 className="text-md font-semibold mb-2">
    //               {key === "parent"
    //                 ? "Signature of Parent (Should match with PAN)"
    //                 : "Signature of Admission Head"}
    //             </h3>
    //             <div className="border w-64 h-24 bg-white">
    //               <SignatureCanvas
    //                 ref={signatureRefs[key]}
    //                 penColor="black"
    //                 canvasProps={{ className: "w-full h-full" }}
    //                 onEnd={() => handleSignatureEnd(key)}
    //               />
    //             </div>
    //             <button
    //               type="button"
    //               onClick={() => clearSignature(key)}
    //               className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
    //             >
    //               Clear Signature
    //             </button>
    //           </div>
    //         ))}
    //       </div> */}
    //     <div className="flex w-full justify-between ">
    //       <button
    //         className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
    //         onClick={() => navigate("/documentUpload")}
    //       >
    //         Back
    //       </button>
    //       <button
    //         className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
    //         onClick={onSubmit}
    //       >
    //         Submit
    //       </button>
    //     </div>
    //   </form>
    // </div>

    <div className="w-full">
      {loading && <Spinner />}
      <form
        className="flex flex-col px-4 items-center gap-2 py-2 text-white"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          Address Details
        </h2>

        <div className="flex flex-col w-full md:w-2/3 gap-4 items-center text-white">
          {[
            { label: "Address Line 1", name: "address.line1" },
            { label: "City", name: "address.city" },
            { label: "Status", name: "address.status" },
          ].map(({ label, name }) => (
            <InputField
              key={name}
              name={name}
              value={userData?.address?.[name.split(".")[1]] || ""}
              label={label}
              onChange={handleChange}
              placeholder={label}
              error={errors[name]}
            />
          ))}
        </div>

        <div className="flex w-full justify-between">
          <button
            type="button"
            className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
            onClick={() => navigate("/familyDetails")}
          >
            Back
          </button>
          <button
            type="submit"
            // onClick={() => navigate("/siblingsDetails")}
            className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankRefundForm;
