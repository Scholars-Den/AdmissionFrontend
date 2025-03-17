import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loadingSlice";
import { putFormData, updateUserDetails } from "../../redux/formDataSlice";
import InputField from "../../utils/InputField";

const SiblingsDetails = () => {
  const { loading } = useSelector((state) => state.loadingDetails);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);

  const datafield = [
    {
      name: "noOFBrother",
      type: "number",
      placeholder: "Enter Number of Brother",
      required: true,
    },
    {
      name: "noOfSister",
      type: "number",
      placeholder: "Enter Number of Sisters",
    },
    {
      name: "siblingsposition",
      type: "number",
      placeholder: "Your position among siblings in descending order",
    },
  ];

  // const siblingsDetails = [
  //   {
  //     name: "relation",
  //     type: "string",
  //     placeholder: "Enter Relation",
  //   },
  //   {
  //     name: "name",
  //     type: "string",
  //     placeholder: "Enter Name",
  //   },
  //   {
  //     name: "currentOccupation",
  //     type: "string",
  //     placeholder: "Enter Current Occupation",
  //   },
  //   {
  //     name: "standard",
  //     type: "string",
  //     placeholder: "Enter your brother class ",
  //   },
  //   {
  //     name: "School",
  //     type: "string",
  //     placeholder: "Enter your school name",
  //   },
  //   {
  //     name: "Board",
  //     type: "string",
  //     placeholder: "Enter Your Board name",
  //   },
  //   {
  //     name: "",
  //   },
  // ];

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    datafield.forEach(({ name, required }) => {
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


  
    const handleChange = (e) => {
      const { name, value } = e.target;
      dispatch(updateUserDetails({ [name]: value }));
  
      if (value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    };

  const siblingsData = [
    {
      name: "noOfBrother",
      type: "number",
      label: "Enter Number of Brother",
      required: true,

    },
    {
      name: "noOfSister",
      type: "number",
      label: "Enter Number of Sisters",
      required: true,
    },
  ];

  // const formFields = [
  //   {
  //     name: "studentName",
  //     type: "text",
  //     placeholder: "*Student Name",
  //     required: true,
  //   },
  //   {
  //     name: "aadharID",
  //     type: "text",
  //     placeholder: "*Aadher ID",
  //     required: true,
  //   },
  //   // { name: "email", type: "email", placeholder: "Email ID", required: false },
  //   {
  //     name: "studentContactNumber",
  //     type: "tel",
  //     placeholder: "Enter Your Contact Number",
  //     required: true,
  //   },

  // ];

  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form
        className="flex flex-col px-12 items-center gap-2 text-white"
        onSubmit={onSubmit}
      >
        <h2 className="text-4xl text-white">Siblings Details Form</h2>

        <div className="flex w-full gap-4">
          {datafield.map((field, index) => (

            console.log("field", field),
            <div className="flex flex-col w-1/2">
                    <label htmlFor={field.name} className="text-lg font-semibold mb-1">
        {field.label}
      </label> 
            <InputField
              key={index}
              label={field.name}
              name={field.name}
              type={field.type}
              value={userData[field.name]}
              onChange={handleChange}
              />
              </div>
          ))}
        </div>
        <div className="flex flex-col w-full gap-4 items-center">
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

export default SiblingsDetails;
