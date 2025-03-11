import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import Spinner from "../../api/Spinner";

const FamilyDetails = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loadingDetails);
  const { userData } = useSelector((state) => state.userDetails);

  const occupationOptions = ["Business", "Service", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const familySections = [
    {
      title: "Father's Details",
      fields: [
        { name: "fatherName", type: "text", placeholder: "*Father’s Name", required: true },
        { name: "fatherAadhar", type: "text", placeholder: "*Father's Aadhar ID", required: true },
        { name: "fatherBloodGroup", type: "select", label: "Blood Group", options: bloodGroupOptions, required: true },
        { name: "fatherOccupation", type: "select", label: "Occupation", options: occupationOptions, required: true },
      ],
    },
    {
      title: "Mother's Details",
      fields: [
        { name: "motherName", type: "text", placeholder: "*Mother’s Name", required: true },
        { name: "motherAadhar", type: "text", placeholder: "*Mother's Aadhar ID", required: true },
        { name: "motherDOB", type: "date", placeholder: "Mother's DOB", required: true },
        { name: "motherBloodGroup", type: "select", label: "Blood Group", options: bloodGroupOptions, required: true },
        { name: "motherOccupation", type: "select", label: "Occupation", options: occupationOptions, required: true },
      ],
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Family Details Form", userData);
    navigate("/next-step");
  };

  return (
    <div className="w-full">
      {loading && <Spinner/>}
      <form className="flex flex-col px-12 items-center gap-2 text-white" onSubmit={onSubmit}>
        <h2 className="text-4xl text-white">Family Details Form</h2>
        <div className="flex flex-col w-full gap-4 items-center">

        {familySections.map((section, sectionIndex) => (
            section.fields.map((field, fieldIndex) =>
              field.type === "select" ? (
                <SelectField key={fieldIndex} name={field.name} options={field.options} label={field.label} required={field.required} />
              ) : (
                <InputField key={fieldIndex} name={field.name} type={field.type} placeholder={field.placeholder} required={field.required} />
              )
            )
        ))}

   

        {/* Submit Button */}
        <button type="submit" className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mt-4">
          Next
        </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyDetails;
