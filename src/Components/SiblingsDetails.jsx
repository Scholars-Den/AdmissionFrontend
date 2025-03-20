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
      if (required && !userData[name]) {
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


  useEffect(()=>{
    dispatch(fetchUserDetails());
  },[])
  useEffect(()=>{
    console.log("userData in onSumit ", userData);
  },[])

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

  useEffect(() => {
    console.log("signatures", signatures);
  }, [signatures]);

  useEffect(() => {
    // If there are existing signatures, load them into the canvas
    Object.keys(signatures).forEach((key) => {
      if (signatures[key] && signatureRefs[key].current) {
        signatureRefs[key].current.fromDataURL(signatures[key]);
      }
    });
  }, [signatures]);


  useEffect(() => {
    // Fetch user data, including signatures
    dispatch(fetchUserDetails()).then((fetchedUserData) => {

      console.log("fetchedUserData", fetchedUserData.signatures);
      // Check if the signatures are available and set them 
      if (fetchedUserData?.signatures) {
        setSignatures(fetchedUserData.signatures);
      }
    });
  }, [dispatch]);

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
        value: type === "checkbox" ? checked : value,
      })
    );
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  useEffect(() => {
    console.log("userData from useEffect", userData);
  },[userData])


  useEffect(() => {
    // Assuming fetchUserDetails action fetches the data and includes the signature info
    dispatch(fetchUserDetails()).then((fetchedUserData) => {
      console.log("Fetched User Data:", fetchedUserData); // Debug log to check the data
      if (fetchedUserData?.signatures) {
        setSignatures(fetchedUserData.signatures); // Set the signatures from fetched data
      }
    });
  }, []);

  // After fetching, load the signature data into the canvas
  useEffect(() => {
    Object.keys(signatures).forEach((key) => {
      if (signatures[key] && signatureRefs[key].current) {
        try {
          signatureRefs[key].current.fromDataURL(signatures[key]); // Load signature into canvas
        } catch (error) {
          console.error(`Error loading signature for ${key}:`, error);
        }
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


// console.log("userDatac in the siblings", userData?.[field.name]),
// console.log("userDatac in the siblings", field.name),
// console.log("userDatac in the siblings", userData?.[field.name] ?? "Not Found")
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


