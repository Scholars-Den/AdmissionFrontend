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
import SelectField from "../../utils/SelectField";

const SiblingsDetails = () => {
  const { loading } = useSelector((state) => state.loadingDetails);

  const [siblingsTable, setSiblingsTable] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (siblingsTable > 0) {
      const newSiblings = Array.from(
        { length: siblingsTable },
        (_, i) =>
          siblings[i] || {
            relation: "",
            name: "",
            isStudent: false,
            isWorking: false,
            studyingIn: "",
          }
      );
      setSiblings(newSiblings);
    }
  }, [siblingsTable]);

  const handleRemoveSibling = (indexToRemove) => {
    setSiblings((prevSiblings) => {
      const newSiblings = prevSiblings.filter((_, index) => index !== indexToRemove);
      setSiblingsTable(newSiblings.length);
      return newSiblings;
    });
  }

  const handleSiblingChange = (index, event) => {
    const { name, value, type, checked } = event.target;

    console.log("name", name);
    console.log("name", value);
    setSiblings((prevSiblings) =>
      prevSiblings.map((sibling, i) =>
        i === index
          ? {
              ...sibling,
              [name]: type === "checkbox" ? checked : value,
            }
          : sibling
      )
    );
  };

  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
  });

  const signatureRefs = {
    student: useRef(null),
    parent: useRef(null),

  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  const handleSiblingOccupationChange = (index, event) => {
    const { value } = event.target;
    const newSiblings = [...siblings];
    newSiblings[index].occupation = value;
    setSiblings(newSiblings);
  };

  const [siblings, setSiblings] = useState(
    userData.siblings
      ? userData.siblings
      : [{ relation: "", name: "", occupation: "", studyingIn: "" }]
  );

  useEffect(() => {
    console.log("userSiblings", userData.siblings);
    setSiblings(userData.siblings);
    console.log();
  }, [userData]);

  useEffect(() => {
    console.log("Siblings", siblings);
  }, [siblings]);

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

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    const newSignatures = { ...signatures };

    // Validate text fields
    siblingsData.forEach(({ name, label, required }) => {
      if (required && !userData[name]) {
        formErrors[name] = `${label} is required`;
        isValid = false;
      }
    });

    // Ensure all signatures are captured
    Object.keys(signatureRefs).forEach((key) => {
      const signatureData = signatureRefs[key]?.current?.toDataURL();

      console.log(`Signature data for ${key}:`, signatureData);

      if (
        !signatureData ||
        signatureData === "data:," ||
        signatureData.length < 100
      ) {
        formErrors[key] = "Signature is required";
        isValid = false;
      } else {
        newSignatures[key] = signatureData;
      }
    });

    console.log("Updated signatures:", newSignatures);

    setSignatures(newSignatures); // Update the state with extracted signatures
    setErrors(formErrors);

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      const formData = { ...userData, signatures, siblings };
      await dispatch(submitSiblingsDetails(formData));
      navigate("/documentUpload");
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

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

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
      dispatch(updateUserDetails({ siblings: Array(siblingsTable).fill({}) }));
    }
  }, [siblingsTable, dispatch]);

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
        <div className="flex justify-center gap-4">
          {siblingsData.map((field, fieldIndex) => (
            <div key={field.name} className="w-full md:w-auto">
              {/* <label className="block mb-1 text-sm font-medium">
                {field.label}
              </label> */}

              <SelectField
                key={fieldIndex}
                name={field?.name}
                label={field.label}
                options={["0","1", "2", "3", "4", "5"]}
                value={
                  userData?.[field.name] ? userData?.[field.name] : field.name
                }
                onChange={handleChange}
              />

              {errors[field.name] && (
                <p className="text-[#ffdd00] text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Siblings Table */}
        <div className="flex justify-end m-6 ">
          <button
            type="button"
            onClick={() => setSiblingsTable((prev) => prev + 1)}
            className="text-[#ffdd00]"
          >
            Add Siblings Details
          </button>
        </div>

        {siblings.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse border border-gray-400 text-sm">
              <thead>
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Relation</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Current Occupation</th>
                  <th className="border p-2">Studying In / Working In</th>
                </tr>
              </thead>
              <tbody>
                {siblings.map((sibling, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      <SelectField
                        key={index}
                        name={"relation"}
                        label={"Select Relation"}
                        options={["Brother", "Sister"]}
                        value={sibling.relation}
                        onChange={(e) => handleSiblingChange(index, e)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="name"
                        value={sibling.name}
                        onChange={(e) => handleSiblingChange(index, e)}
                        className="w-full p-1 text-black"
                      />
                    </td>
                    <td className="border p-2 flex flex-wrap justify-center gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`occupation-${index}`}
                          value="student"
                          checked={sibling.occupation === "student"}
                          onChange={(e) =>
                            handleSiblingOccupationChange(index, e)
                          }
                        />
                        Student
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`occupation-${index}`}
                          value="working"
                          checked={sibling.occupation === "working"}
                          onChange={(e) =>
                            handleSiblingOccupationChange(index, e)
                          }
                        />
                        Working
                      </label>
                    </td>
                    <td className="border p-2">
                      {sibling.occupation === "working" ? (
                        <input
                          type="text"
                          name="studyingIn"
                          value={sibling.studyingIn}
                          onChange={(e) => handleSiblingChange(index, e)}
                          className="w-full p-1 text-black"
                        />
                      ) : (
                        <SelectField
                          key={index}
                          name={"studyingIn"}
                          label={"Select Class"}
                          options={[
                            "I",
                            "II",
                            "III",
                            "IV",
                            "V",
                            "VI",
                            "VII",
                            "VIII",
                            "IX",
                            "X",
                            "XI",
                            "XII",
                          ]}
                          value={sibling.studyingIn}
                          onChange={(e) => handleSiblingChange(index, e)}
                        />
                      )}
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleRemoveSibling(index)}
                        className="text-red-500 font-bold"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Digital Signature Fields */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-center ">
          {[
            { key: "student", label: "Signature of Student" },
            {
              key: "parent",
              label: "Signature of Parent (Should match with PAN)",
            },
           
          ].map(({ key, label }) => (
            <div
              key={key}
              className="m-2 flex flex-col justify-between items-center w-full md:w-1/3"
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
                <p className="text-[#ffdd00] text-sm">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between ">
          <button
          type="button"
            className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
            onClick={() => navigate("/familyDetails")}
          >
            Back
          </button>
          <button
            className="mt-6 hover:bg-[#ffdd00] hover:text-black text-white border-2 px-4 py-2 rounded"
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
