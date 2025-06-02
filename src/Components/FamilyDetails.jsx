import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../utils/InputField";
import SelectField from "../../utils/SelectField";
import Spinner from "../../api/Spinner";
import {
  fetchUserDetails,
  putFormData,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { setLoading } from "../../redux/loadingSlice";
import {
  validateAadhaar,
  validateDateOfBirth,
  validateName,
} from "../../utils/validation/inputValidation";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";

const FamilyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userDetails);
  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );
  const { loading } = useSelector((state) => state.loadingDetails);

  const [errors, setErrors] = useState({});
  const occupationOptions = ["Business", "Service", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const familySections = [
    [
      {
        title: "Father's Details",
        fields: [
          {
            name: "fatherName",
            type: "text",
            placeholder: "*Father’s Name",
            required: true,
            validation: validateName,
            label: "*Father Name",
          },
          {
            name: "fatherAadharId",
            type: "text",
            placeholder: "*Father's Aadhar ID",
            required: true,
            validation: validateAadhaar,
            label: "*Father Aadhar Id",
          },

          {
            name: "fatherOccupations",
            type: "select",
            options: occupationOptions,
            required: true,
            label: "Father Occupation",
          },
        ],
      },
    ],
    [
      {
        title: "Mother's Details",
        fields: [
          {
            name: "motherName",
            type: "text",
            placeholder: "*Mother’s Name",
            required: true,
            validation: validateName,
            label: "Mother Name",
          },
          {
            name: "motherAadharId",
            type: "text",
            placeholder: "*Mother's Aadhar ID",
            required: true,
            validation: validateAadhaar,
            label: "Mother Aadhar Id",
          },

          {
            name: "motherOccupations",
            type: "select",
            options: occupationOptions,
            required: true,
            label: "Mother Occupation",
          },
        ],
      },
    ],
  ];

  const handleChange = (e) => {
    if (studentAdmissionApprovalDetails?.parentDetails?.status) {
      return;
    }
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    dispatch(updateUserDetails({ [name]: value }));
    if (value.trim())
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("onsUBMIT click");
    if (!validateForm()) return;
    try {
      dispatch(setLoading(true));

      console.log("userData in onSumit ", userData);

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
      fields?.forEach(({ name, required, validation = "" }) => {
        if (validation === "") {
          if (required && !userData[name]?.trim()) {
            formErrors[name] = `${name.replace(/([A-Z])/g, "$1")} is required`;
            isValid = false;
          }
        } else {
          const isValidInput = validation(userData[name]);
          console.log("isValidInput", isValidInput);

          if (required && !isValidInput.isValid) {
            formErrors[name] = isValidInput.message;
            isValid = false;
          }
        }
      });
    });

    console.log("formErrors", formErrors);
    setErrors(formErrors);
    return isValid;
  };

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);

  useEffect(() => {
    dispatch(fetchAdmissionApprovalMessage(userData?.acknowledgementNumber));
  }, [userData]);

  return (
    <div className="w-full ">
      {/* {loading && <Spinner />} */}
      <form
        // className="flex flex-col px-8 items-center gap-2 w-full py-2 text-white"
        className="flex flex-col sm:px-8 items-center gap-2 sm:py-2 text-white w-full"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold ">
          Family Details Form
        </h2>

        <div className="flex flex-col w-full gap-4">
          {studentAdmissionApprovalDetails?.parentDetails &&
            (studentAdmissionApprovalDetails?.parentDetails?.status ? (
              <div className="flex flex-col w-full gap-4 items-end  ">
                <span className="bg-green-500 p-2 rounded-xl">Approved</span>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-4 items-end  ">
                <span className="text-[#c61d23] bg-white shadow-xl p-2 rounded-xl">
                  {studentAdmissionApprovalDetails?.parentDetails?.message}
                </span>
              </div>
            ))}

          <fieldset className="text-white border-2 w-full px-6">
            <legend> Father Details </legend>
            {familySections[0].map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6 w-full">
                {/* <h3 className="text-lg sm:text-xl font-semibold mb-4">
                {section.title}
              </h3> */}
                <div className="grid grid-cols-1  gap-4">
                  {section.fields.map((field, fieldIndex) =>
                    field.type === "select" ? (
                      <SelectField
                        key={fieldIndex}
                        name={field.name}
                        options={field.options}
                        label={field.label}
                        error={errors[field.name]}
                        value={userData?.[field.name] || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <InputField
                        key={fieldIndex}
                        name={field.name}
                        type={field.type}
                        label={field.label}
                        value={userData?.[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        error={errors[field.name]}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </fieldset>
          <fieldset className="text-white border-2 w-full px-6">
            <legend>Mother Details</legend>

            {familySections[1].map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6 w-full">
                {/* <h3 className="text-lg sm:text-xl font-semibold mb-4">
                {section.title}
              </h3> */}
                <div className="grid grid-cols-1  gap-4">
                  {section.fields.map((field, fieldIndex) =>
                    field.type === "select" ? (
                      <SelectField
                        key={fieldIndex}
                        name={field.name}
                        options={field.options}
                        label={field.label}
                        error={errors[field.name]}
                        value={userData?.[field.name] || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <InputField
                        key={fieldIndex}
                        name={field.name}
                        type={field.type}
                        label={field.label}
                        value={userData?.[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        error={errors[field.name]}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </fieldset>
        </div>
        {/* <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={() => navigate("/")}>Back</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" type="submit">Next</button>
        </div> */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6 w-full">
          <button
            onClick={() => navigate("/basicDetails")}
            type="button"
            className="w-full sm:w-1/3 border bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black  py-2 px-4 "
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-2/3 border bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl transition-all"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyDetails;
