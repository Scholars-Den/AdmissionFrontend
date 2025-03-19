import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loadingSlice";
import { fetchUserDetails, putFormData, submitSiblingsDetails, updateSiblingDetails, updateUserDetails } from "../../redux/formDataSlice";
import SignatureCanvas from "react-signature-canvas";
import Spinner from "../../api/Spinner";
import { use } from "react";

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

    siblingsData.forEach(({ name, required }) => {
      if (required && !userData[name]?.trim()) {
        formErrors[name] = `${name.replace(/([A-Z])/g, " $1")} is required`;
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
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSignatureEnd = (key) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key].current.toDataURL(),
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  useEffect(()=>{
    console.log("signatures", signatures);
  },[signatures]);

  const clearSignature = (key) => {
    signatureRefs[key].current.clear();
    setSignatures((prev) => ({ ...prev, [key]: "" }));
  };

  useEffect(() => {
  
      dispatch(updateUserDetails({ siblings: Array(4).fill({}) }));
    
  }, []);

  const handleSiblingChange = (index, e) => {
    const { name, value, type, checked } = e.target;
  
    dispatch(
      updateSiblingDetails({
        index,
        name,
        value: type === "checkbox" ? checked : value
      })
    );
  };
useEffect(()=>{
  fetchUserDetails();
},[])
  return (
    <div className="w-full px-8 text-center bg-[#c61d23] text-white">
      {loading && <Spinner />}
      <form onSubmit={onSubmit} className="">
        <h2 className="text-2xl font-semibold mb-6">Siblings Details Form</h2>

        <div className="flex gap-2 mb-2">
          {siblingsData?.map((field) => (
            <div key={field.name} className="flex flex-col w-1/3">
              <label className="mb-1 font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={userData[field.name] || ""}
                onChange={handleChange}
                className="border p-2 rounded-md text-black"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <table className="w-full border-collapse border border-gray-400">
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
      <td className="border p-2 flex gap-2">
        <label>
          <input 
            type="checkbox"
            name="isStudent"
            checked={sibling?.isStudent || false}
            onChange={(e) => handleSiblingChange(index, e)}
          /> Student
        </label>
        <label className="ml-4">
          <input 
            type="checkbox"
            name="isWorking"
            checked={sibling?.isWorking || false}
            onChange={(e) => handleSiblingChange(index, e)}
          /> Working
        </label>
      </td>
      <td className="border p-2">
        <input 
          type="text" 
          name="studyingIn"
          value={sibling?.studyingIn || ""}
          onChange={(e) => handleSiblingChange(index, e)}
          className="w-full p-1 text-black"
        />
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {/* Digital Signature Fields */}
        <div className="flex justify-center items-center w-full text-center ">
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
            <div key={key} className="m-2 flex flex-col justify-center items-center w-1/3 ">
              <h3 className="flex items-center text-lg font-semibold h-16">{label}</h3>
              <div className="border border-gray-400 bg-white px-2 m-2 rounded-md">
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

        <button
          type="submit"
          className="bg-blue-500 text-white px-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SiblingsDetails;
