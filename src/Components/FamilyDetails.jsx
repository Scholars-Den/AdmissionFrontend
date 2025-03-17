import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import Spinner from "../../api/Spinner";
import { putFormData, submitFormData, updateUserDetails } from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";

const FamilyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeVerified, setCodeVerified] = useState(true);
  // const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const occupationOptions = ["Business", "Service", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];






  const familySections = [
    {
      title: "Father's Details",
      fields: [
        {
          name: "fatherName",
          type: "text",
          placeholder: "*Father’s Name",
          required: true,
        },
        {
          name: "fatherAadhar",
          type: "text",
          placeholder: "*Father's Aadhar ID",
          required: true,
        },
        {
          name: "fatherBloodGroup",
          type: "select",
          label: "Blood Group",
          options: bloodGroupOptions,
          required: true,
        },
        {
          name: "fatherOccupation",
          type: "select",
          label: "Occupation",
          options: occupationOptions,
          required: true,
        },
      ],
    },
    {
      title: "Mother's Details",
      fields: [
        {
          name: "motherName",
          type: "text",
          placeholder: "*Mother’s Name",
          required: true,
        },
        {
          name: "motherAadhar",
          type: "text",
          placeholder: "*Mother's Aadhar ID",
          required: true,
        },
        {
          name: "motherDOB",
          type: "date",
          placeholder: "Mother's DOB",
          required: true,
        },
        {
          name: "motherBloodGroup",
          type: "select",
          label: "Blood Group",
          options: bloodGroupOptions,
          required: true,
        },
        {
          name: "motherOccupation",
          type: "select",
          label: "Occupation",
          options: occupationOptions,
          required: true,
        },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUserDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

 try {
       dispatch(setLoading(true));
   
       console.log("userData in onSumit ", userData);
 
       await dispatch(putFormData(userData));
       navigate("/siblingsDetails");
     
     } catch (error) {
       console.log("Error submitting form:", error);
     } finally {
       dispatch(setLoading(false));
     }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    familySections.forEach(({ name, required }) => {
      if (required && !userData[name]?.trim()) {
        formErrors[name] = `${name.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };  


  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form
        className="flex flex-col px-12 items-center gap-2 text-white"
        onSubmit={onSubmit}
      >
        <h2 className="text-4xl text-white">Family Details Form</h2>
        <div className="flex flex-col w-full gap-4 items-center">
          {familySections.map((section, sectionIndex) =>
            section.fields.map((field, fieldIndex) =>
              field.type === "select" ? (
                <SelectField
                  key={fieldIndex}
                  name={field.name}
                  options={field.options}
                  label={field.label}
                  required={field.required}
                  value={userData?.[field.name] || ""}
                  onChange={handleChange}
                />
              ) : (
                <InputField
                  key={fieldIndex}
                  name={field.name}
                  type={field.type}
                  value={userData?.[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )
            )
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mt-4"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyDetails;
