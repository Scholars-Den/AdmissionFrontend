import { useState } from "react";
import { updateUserDetails } from "../redux/formDataSlice";
import { useDispatch, useSelector } from "react-redux";

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => {
  // console.log("name", name, value, onChange, error, placeholder);




  return (
    <div className="flex flex-col items-center w-full appearance-none">
      <div className="w-full">
        {/* <label htmlFor={name} className="text-lg font-semibold mb-1">
        {label}
      </label> */}
        <input
          autoComplete="off"
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="border-b-2 border-gray-300  py-2  w-full p-1 bg-[#c61d23] focus:outline-none placeholder-white  appearance-none"
        />
        {error && <span className="text-white text-sm mt-1">{error}</span>}
      </div>
    </div>
  );
};

export default InputField;
