import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import {
  fetchUserDetails,
  submitAddressForm,
  updateUserDetails,
} from "../../redux/formDataSlice";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputField";
import CheckboxField from "../../utils/CheckboxField";
import { fetchAdmissionApprovalMessage } from "../../redux/alreadyExistStudentSlice";

const AddressDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signatures, setSignatures] = useState({
    parent: "",
    admissionHead: "",
  });

  const [errors, setErrors] = useState({});

  const signatureRefs = {
    admissionHead: React.createRef(),
    parent: React.createRef(),
  };

  const { studentAdmissionApprovalDetails } = useSelector(
    (state) => state.alreadyExistStudent
  );

  const { userData } = useSelector((state) => state.userDetails);
  const { loading } = useSelector((state) => state.loadingDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      updatedData = {
        address: {
          ...userData?.address,
          [field]: value,
        },
      };
    } else {
      updatedData = { [name]: value };
    }

    dispatch(updateUserDetails(updatedData));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = [
      { name: "address.line1", label: "Address Line 1" },
      { name: "address.city", label: "City" },
      { name: "address.state", label: "state" },
      // { name: "isExistingStudent", label: "Is Existing Student" },
      // { name: "schoolName", label: "School Name" },
    ];

    requiredFields.forEach(({ name, label }) => {
      const keys = name.split(".");
      const value =
        keys.length === 2 ? userData?.[keys[0]]?.[keys[1]] : userData?.[name];

      if (!value || value.trim() === "") {
        formErrors[name] = `${label} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    console.log("formErrors", formErrors);

    return isValid;
  };

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
  useEffect(() => {
    console.log("userData form Use", userData);
    if (userData?.acknowledgementNumber) {
      dispatch(fetchAdmissionApprovalMessage(userData.acknowledgementNumber));
    }
  }, [userData]);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("onsUBMIT click");

    if (!validateForm()) return;
    try {
      const formData = { ...userData, signatures };

      console.log("formData from onSubmit ", formData);

      const testdata = await dispatch(submitAddressForm(formData));

      console.log("testdata from onSubmit button", testdata);
      console.log("Test Data", testdata);
      navigate("/siblingsDetails");
    } catch (error) {
      console.log("Error submitting form:", error);
    }
    //  finally {
    //   dispatch(setLoading(false));
    // }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Andaman and Nicobar Islands",
    "Bihar",
    "Chhattisgarh",
    "Chandigarh",
    "Delhi",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Ladakh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Puducherry",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="w-full mt-8 ">
      {loading && <Spinner />}
      <form
        className="flex flex-col sm:px-8 items-center gap-2 sm:py-2 text-white w-full"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Address Details</h2>

        <div className="flex flex-col w-full gap-4 items-center text-white">
          {studentAdmissionApprovalDetails?.parentDetails &&
            (studentAdmissionApprovalDetails?.addressDetails?.status ? (
              <div className="flex flex-col w-full gap-4 items-end  ">
                <span className="bg-green-500 p-2 rounded-xl">Approved</span>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-4 items-end  ">
                <span className="text-[#c61d23] bg-white shadow-xl p-2 rounded-xl">
                  {studentAdmissionApprovalDetails?.addressDetails?.message}
                </span>
              </div>
            ))}

          {[
            { label: "Address Line 1", name: "address.line1" },
            { label: "City", name: "address.city" },
          ].map(({ label, name }) => (
            <InputField
              key={name}
              name={name}
              value={userData?.address?.[name.split(".")[1]] || ""}
              label={label}
              onChange={handleChange}
              placeholder={label}
              error={errors[name]}
            />
          ))}

          {/* ✅ New select input for State */}
          <div className="w-full">
            <label className="block text-white mb-1" htmlFor="address.state">
              State
            </label>
            <select
              name="address.state"
              value={userData?.address?.state || ""}
              onChange={handleChange}
              className="w-full p-2 text-black rounded appearance-none "
            >
              <option value="">Select a State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors["address.state"] && (
              <span className="text-[#ffdd00] text-sm mt-1">
                {errors["address.state"]}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6 w-full">
          <button
            onClick={() => navigate("/familyDetails")}
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

export default AddressDetails;
