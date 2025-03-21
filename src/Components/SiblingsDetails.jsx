import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loadingSlice";
import {
  fetchUserDetails,
  putFormData,
  submitSiblingsDetails,
  updateSiblingDetails,
  updateUserDetails,
} from "../../redux/formDataSlice";
import SignatureCanvas from "react-signature-canvas";
import Spinner from "../../api/Spinner";

const SiblingsDetails = () => {
  const { loading } = useSelector((state) => state.loadingDetails);
  const [errors, setErrors] = useState({});
  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
    admissionOfficer: "",
  });

  const signatureRefs = {
    student: useRef(null),
    parent: useRef(null),
    admissionOfficer: useRef(null),
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  const siblingsData = [
    {
      name: "noOfBrother",
      label: "No. of Brothers",
      type: "number",
      required: true,
    },
    {
      name: "noOfSister",
      label: "No. of Sisters",
      type: "number",
      required: true,
    },
    {
      name: "siblingsPosition",
      label: "Your position among siblings",
      type: "number",
      required: true,
    },
  ];

  const siblingsTable = Array(4).fill(null);

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    siblingsData.forEach(({ name, label, required }) => {
      if (required && !userData[name]) {
        formErrors[name] = `${label} is required`;
        isValid = false;
      }
    });

    Object.keys(signatures).forEach((key) => {
      if (!signatures[key]) {
        formErrors[key] = "Signature is required";
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      const formData = { ...userData, signatures };
      await dispatch(submitSiblingsDetails(formData));
      navigate("/bankRefund");
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSignatureEnd = (key) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key]?.current?.toDataURL(),
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };




  const clearSignature = (key) => {
    signatureRefs[key]?.current?.clear();
    setSignatures((prev) => ({ ...prev, [key]: "" }));
  };

  useEffect(() => {
    if (!userData?.siblings || userData.siblings.length === 0) {
      dispatch(updateUserDetails({ siblings: Array(4).fill({}) }));
    }
  }, [userData, dispatch]);

  const handleSiblingChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    dispatch(
      updateSiblingDetails({
        index,
        name,
        value: type === "checkbox" ? checked : value,
      })
    );
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
  
  



  return (
    <div className="w-full px-4 sm:px-8 py-6 text-center bg-[#c61d23] text-white">
           {loading && <Spinner />}
           <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-semibold mb-6">Siblings Details Form</h2>
    
             {/* Siblings Count Inputs */}
             <div className="flex flex-wrap justify-center gap-4">
               {siblingsData.map((field) => (
                <div key={field.name} className="w-full md:w-auto">
                  <label className="block mb-1 font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={userData?.[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md text-black"
                  />
                  {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
    
 {/* Siblings Table */}
         <div className="overflow-x-auto mt-6">
           <table className="w-full border-collapse border border-gray-400 text-sm">
             <thead>
               <tr>
                 <th className="border p-2">S.No</th>
                 <th className="border p-2">Relation</th>
                 <th className="border p-2">Name</th>
                 <th className="border p-2">Current Occupation</th>
                 <th className="border p-2">Studying In</th>
               </tr>
             </thead>
             <tbody>
               {userData?.siblings?.map((sibling, index) => (
                 <tr key={index}>
                   <td className="border p-2">{index + 1}</td>
                   <td className="border p-2">
                     <input
                       type="text"
                       name="relation"
                       value={sibling?.relation || ""}
                       onChange={(e) => handleSiblingChange(index, e)}
                       className="w-full p-1 text-black"
                     />
                   </td>
                   <td className="border p-2">
                     <input
                       type="text"
                       name="name"
                       value={sibling?.name || ""}
                       onChange={(e) => handleSiblingChange(index, e)}
                       className="w-full p-1 text-black"
                     />
                   </td>
                   <td className="border p-2 flex flex-wrap justify-center gap-2">
                     <label className="flex items-center">
                       <input type="checkbox" name="isStudent" checked={sibling?.isStudent || false} onChange={(e) => handleSiblingChange(index, e)} /> Student
                     </label>
                     <label className="flex items-center">
                       <input type="checkbox" name="isWorking" checked={sibling?.isWorking || false} onChange={(e) => handleSiblingChange(index, e)} /> Working
                     </label>
                   </td>
                   <td className="border p-2">
                     <input type="text" name="studyingIn" value={sibling?.studyingIn || ""} onChange={(e) => handleSiblingChange(index, e)} className="w-full p-1 text-black" />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

        {/* Digital Signature Fields */}
        <div className="flex flex-col md:flex-row justify-center items-center w-full text-center ">
          {[
            { key: "student", label: "Signature of Student" },
            {
              key: "parent",
              label: "Signature of Parent (Should match with PAN)",
            },
            {
              key: "admissionOfficer",
              label: "Admission Formalities Completed by",
            },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="m-2 flex flex-col justify-center items-center w-full md:w-1/3"
            >
              <h3 className="flex items-center text-lg font-semibold h-16">
                {label}
              </h3>
              <div className="border border-gray-400 bg-white px-2 m-2 w-full  rounded-md">
                <SignatureCanvas
                  ref={signatureRefs[key]}
                  penColor="black"
                  canvasProps={{ className: "w-full h-24" }}
                  onEnd={() => handleSignatureEnd(key)}
                />
              </div>
              <div className="">
                <button
                  type="button"
                  onClick={() => clearSignature(key)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Clear Signature
                </button>
              </div>
              {errors[key] && (
                <p className="text-red-500 text-sm">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between ">
          <button
            className="mt-6 bg-blue-500  text-white px-4 py-2 rounded"
            onClick={() => navigate("/familyDetails")}
          >
            Back
          </button>
          <button
            className="mt-6 bg-blue-500  text-white px-4 py-2 rounded"
            onClick={onSubmit}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiblingsDetails;


