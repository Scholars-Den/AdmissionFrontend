import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import {
  fetchUserDetails,
  submitBankRefundForm,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { use } from "react";
import { useNavigate } from "react-router-dom";


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


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("name:", name, "value:", value, "type:", type, "checked:", checked);
  
    if (type === "checkbox") {
      dispatch(updateUserDetails({
        documents: {
          ...userData?.documents, // Ensure previous document data is preserved
          [name]: checked,
        }
      }));
    } else {
      dispatch(updateUserDetails({ [name]: value }));
    }
  
    // Remove errors if the user fills the field
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  

  const handleSignatureEnd = (key) => {
    console.log("key", key);
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key].current.toDataURL(),
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };



  const clearSignature = (key) => {
    signatureRefs[key].current.clear();
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [key]: "",
      },
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Check if text inputs are filled
    const requiredTextFields = [
      "accountHolder",
      "bankName",
      "accountNumber",
      "ifscCode",
      "relationWithStudent",
    ];

    requiredTextFields.forEach((field) => {
      if (!userData[field]?.trim()) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    // Check if at least one document is checked
    const requiredDocuments = [
      "cancelledCheque",
      "passbook",
      "studentAadhar",
      "parentAadhar",
      "passportPhotos",
    ];

    const documentsChecked = requiredDocuments.every(
      (doc) => userData.documents[doc]
    );

    if (!documentsChecked) {
      formErrors.documents = "All required documents must be selected";
      isValid = false;
    }


    Object.keys(signatures).forEach((key) => {
      if (!signatures[key]) {
        formErrors[key] = "Signature is required";
        isValid = false;
      }
    });

    // Check if signatures are provided
    // const requiredSignatures = ["admissionHead", "parent"];
    // requiredSignatures.forEach((key) => {
    //   if (!userData.signatures[key]) {
    //     formErrors[key] = `${key} signature is required`;
    //     isValid = false;
    //   }
    // });
    console.log("formErrors", formErrors);
    // Set errors if there are any
    setErrors(formErrors);

    return isValid;
  };

  useEffect(() => {
    dispatch(fetchUserDetails()).then((action) => {
      console.log("action.payload", action.payload);
      const fetchedUserData = action.payload; // Extract payload from Redux action
      console.log("userData in useEffect", fetchedUserData?.userData?.signatures);
      if (fetchedUserData?.userData?.signatures) {
        setSignatures(fetchedUserData?.userData?.signatures);
      }
    });
  }, []);
  useEffect(()=>{
    console.log("userData form Use", userData);
  },[userData])

  // After fetching, load the signature data into the canvas
  useEffect(() => {
    Object.keys(signatures).forEach((key) => {
      if (signatures[key] && signatureRefs[key]?.current) {
        setTimeout(() => {
          signatureRefs[key]?.current?.fromDataURL(signatures[key]);
        }, 300); // Delay ensures canvas is ready
      }
    });
  }, [signatures]);
  

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("onsUBMIT click");

    if (!validateForm()) return;
    try {
      const formData = { ...userData, signatures };

      await dispatch(submitBankRefundForm(formData));

      // navigate("/siblingsDetails");
    } catch (error) {
      console.log("Error submitting form:", error);
    }
    //  finally {
    //   dispatch(setLoading(false));
    // }
  };



  return (
    <div className="w-full text-white p-8 rounded-lg  ">
      <h2 className="text-xl text-center font-bold mb-4">
        Bank Account Details for Caution Money Refund
      </h2>
      <div className="grid md:grid-cols-2 gap-4 ">
        {[
          { label: "Account Holder Name", name: "accountHolder" },
          { label: "Bank Name", name: "bankName" },
          { label: "Account Number", name: "accountNumber" },
          { label: "IFSC Code", name: "ifscCode" },
          { label: "Relation with Student", name: "relationWithStudent" },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label>{label}</label>
            <input
              type="text"
              name={name}
              value={userData[name] || ""}
              onChange={handleChange}
              className=" p-2 rounded-md text-black"
            />

            {errors[name] && (
              <p className="text-red-500 text-xs">{errors[name]}</p>
            )}
          </div>
        ))}
      </div>
      <h3 className="mt-4">Document Checklist (Please Tick)</h3>
      <div className="grid grid-cols-3 gap-4 md:mt-4">
        {[
          { label: "Cancelled Cheque", name: "cancelledCheque" },
          { label: "Photocopy of Passbook", name: "passbook" },
          { label: "Photocopy of Student’s Aadhar", name: "studentAadhar" },
          { label: "Photocopy of Parent’s Aadhar", name: "parentAadhar" },
          { label: "Two Passport Size Photographs", name: "passportPhotos" },
        ].map(({ label, name }) => (
          <div className="flex md:flex-col" key={name}>
            <label key={name} className="flex flex-col md:flex-row text-xs md:text-sm">
              <input
                type="checkbox"
                name={name}
                checked={userData?.documents?.[name] || false}
                onChange={handleChange}
                className="mr-2"
              />
              {label}
            </label>
          </div>
        ))}
        <div className="col-span-3 text-center">
          {errors.documents && (
            <p className="text-black text-xs">{errors.documents}</p>
          )}{" "}
          {/* Display error */}
        </div>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {["admissionHead", "parent"].map((key) => (
          <div key={key} className="flex flex-col items-center">
            <h3 className="text-md font-semibold mb-2">
              {key === "parent"
                ? "Signature of Parent (Should match with PAN)"
                : "Signature of Admission Head"}
            </h3>
            <div className="border w-64 h-24 bg-white">
              <SignatureCanvas
                ref={signatureRefs[key]}
                penColor="black"
                canvasProps={{ className: "w-full h-full" }}
                onEnd={() => handleSignatureEnd(key)}
              />
            </div>
            <button
              type="button"
              onClick={() => clearSignature(key)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
            >
              Clear Signature
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between ">
        <button
          className="mt-6 bg-blue-500  text-white px-4 py-2 rounded"
          onClick={()=>navigate("/siblingsDetails")}
        >
          Back
        </button>
        <button
          className="mt-6 bg-blue-500  text-white px-4 py-2 rounded"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BankRefundForm;
