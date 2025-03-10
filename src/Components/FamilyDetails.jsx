import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";

const FamilyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.loadingDetails);

  const [errors, setErrors] = useState({
    

  })


  const [submitMessage, setSubmitMessage] = useState("");
  const [program, setProgram] = useState(""); // For dynamic courses

  const { userData, dataExist, userDataError } = useSelector(
    (state) => state.userDetails
  );

  const handleChange = (e) => {
      const { name, value } = e.target;
      dispatch(updateUserDetails({ [name]: value }));
  
      if (value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    };
  


   // Define form fields
   const formFields = [
    {
      name: "studentName",
      type: "text",
      placeholder: "*Student Name",
      required: true,
    },
    {
      name: "aadharID",
      type: "text",
      placeholder: "*Aadher ID",
      required: true,
    },
    // { name: "email", type: "email", placeholder: "Email ID", required: false },
    {
      name: "studentContactNumber",
      type: "tel",
      placeholder: "Enter Your Contact Number",
      required: true,
    },
  ];
 const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      if (!codeVerified) {
        return setSubmitMessage("Please Verify Your Phone Number");
      }
      console.log("userData in onSumit ", userData);

      await dispatch(submitFormData(userData));
      navigate("/")
      // navigate("/enquiryform");
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };




  return (
    <div className="w-full">
      {loading && <Spinner />}
      <form
        className="flex flex-col px-12 items-center gap-2 py-2 text-white"
        onSubmit={onSubmit}
      >
        <h2 className="text-4xl text-white">Admission Form</h2>

        <div className="flex flex-col w-full gap-4 items-center">
          {formFields.map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              value={userData?.[field.name] || ""}
              onChange={handleChange}
              error={errors[field.name]}
              type={field.type}
              placeholder={field.placeholder}
            />
          ))}

          {selectFields.map((field) => (
            <SelectField
              key={field.name}
              name={field.name}
              value={userData?.[field.name] || ""}
              onChange={handleChange}
              options={field.options}
              error={errors[field.name]}
              label={field.label}
            />
          ))}

         

          {!showCodeBox && !codeVerified && (
            <button
              type="button"
              onClick={verifyPhoneNo}
              className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              Send OTP
            </button>
          )}

          {submitMessage && (
            <p className="text-sm text-[#ffdd00] text-center">
              {submitMessage}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-2/5 py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mt-4"
        >
          Next
        </button>

        <div className="w-24 mt-4">
          <img src={scholarsDenLogo} alt="Scholars Den Logo" />
        </div>
      </form>
    </div>
  );
};

export default FamilyDetails;
