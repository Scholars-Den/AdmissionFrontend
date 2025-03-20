import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import Spinner from "../../api/Spinner";
import { putFormData, updateUserDetails } from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";

const FamilyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

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
    if (value.trim())
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      dispatch(setLoading(true));
      await dispatch(putFormData(userData));
      navigate("/siblingsDetails");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    familySections.forEach(({ fields }) => {
      fields.forEach(({ name, required }) => {
        if (required && !userData[name]?.trim()) {
          formErrors[name] = `${name.replace(/([A-Z])/g, " $1")} is required`;
          isValid = false;
        }
      });
    });
    setErrors(formErrors);
    return isValid;
  };

  return (
    <div className="w-full px-4 py-2 text-center bg-[#c61d23] text-white">
      {loading && <Spinner />}
      <form className="max-w-4xl mx-auto" onSubmit={onSubmit}>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          Family Details Form
        </h2>
        {familySections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 md:w-2/3 mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {section.title}
            </h3>
            <div className="grid grid-cols-1  gap-4">
              {section.fields.map((field, fieldIndex) =>
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
              )}
            </div>
          </div>
        ))}
        {/* <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={() => navigate("/")}>Back</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" type="submit">Next</button>
        </div> */}

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

export default FamilyDetails;
