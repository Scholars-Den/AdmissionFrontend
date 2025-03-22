import { useState } from "react";
import { updateUserDetails } from "../redux/formDataSlice";
import { useDispatch, useSelector } from "react-redux";

const CheckboxField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  
}) => {
  // console.log("name", name, value, onChange, error, placeholder);




  return (
    <div className="flex items-center gap-2  w-full appearance-none">
      
        <input
          autoComplete="off"
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          
        />
          <label htmlFor={name} className="text-xs mb-1">
        {label}
      </label>
        
    </div>
  );
};

export default CheckboxField;
