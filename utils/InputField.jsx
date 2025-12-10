// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const InputField = ({
//   label,
//   name,
//   value,
//   onChange,
//   error,
//   type = "text",
//   placeholder,
// }) => {
//   const handleDateChange = (date) => {
//     onChange({
//       target: {
//         name,
//         value: date ? date.toISOString() : "",
//       },
//     });
//   };

//   return (
//     <div className="flex flex-col items-center w-full appearance-none">
//       <div className="w-full">
//         <label htmlFor={name} className="text-sm font-semibold mb-1 ">
//           {label}
//         </label>

//         {type === "date" ? (
//           <DatePicker
//             id={name}
//             selected={value ? new Date(value) : null}
//             onChange={handleDateChange}
//             dateFormat="dd/MM/yyyy"
//             placeholderText={placeholder || "DD/MM/YYYY"}
//             className="border-b-2 text-black  p-2 m-1 w-full bg-white focus:outline-none placeholder-black rounded-lg appearance-none"
//             showMonthDropdown
//             showYearDropdown
//             dropdownMode="select" 
//           />
//         ) : (
//           <input
//             autoComplete="off"
//             id={name}
//             type={type}
//             name={name}
//             value={value || ""}
//             onChange={onChange}
//             placeholder={placeholder}
//             className="border-b-2 text-black p-2 w-full bg-white focus:outline-none placeholder-black rounded-lg appearance-none"
//           />
//         )}

//         {error && <span className="text-[#ffdd00] text-sm mt-1">{error}</span>}
//       </div>
//     </div>
//   );
// };

// export default InputField;




// // InputField.jsx
// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Calendar } from "lucide-react";

// const InputField = ({
//   label,
//   name,
//   value,
//   onChange,
//   error,
//   type = "text",
//   placeholder,
//   icon: Icon,
//   required,
//   maxLength,
//   disabled,
// }) => {
//   const handleDateChange = (date) => {
//     onChange({
//       target: {
//         name,
//         value: date ? date.toISOString() : "",
//       },
//     });
//   };

//   return (
//     <div className="flex flex-col w-full">
//       {label && (
//         <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
      
//       <div className="relative">
//         {type === "date" ? (
//           <div className="relative">
//             <DatePicker
//               id={name}
//               selected={value ? new Date(value) : null}
//               onChange={handleDateChange}
//               dateFormat="dd/MM/yyyy"
//               placeholderText={placeholder || "DD/MM/YYYY"}
//               disabled={disabled}
//               className={`w-full pl-10 pr-3 py-2.5 px-5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//                 error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
//               }`}
//               showMonthDropdown
//               showYearDropdown
//               dropdownMode="select"
//             />
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//               <Calendar size={18} />
//             </div>
//           </div>
//         ) : (
//           <input
//             autoComplete="off"
//             id={name}
//             type={type}
//             name={name}
//             value={value || ""}
//             onChange={onChange}
//             placeholder={placeholder}
//             maxLength={maxLength}
//             disabled={disabled}
//             className={`w-full pl-3 pr-3 py-2.5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//               error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
//             }`}
//           />
//         )}
//       </div>
      
//       {error && (
//         <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
//           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           {error}
//         </span>
//       )}
//     </div>
//   );
// };

// export default InputField;


















// InputField.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  icon: Icon,
  required,
  maxLength,
  disabled,
}) => {
  const handleDateChange = (date) => {
    onChange({
      target: {
        name,
        value: date ? date.toISOString() : "",
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && type !== "date" && (
          <div className="absolute px-3 left-5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        {type === "date" ? (
          <div className="relative">
            <DatePicker
              id={name}
              selected={value ? new Date(value) : null}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText={placeholder || "DD/MM/YYYY"}
              disabled={disabled}
              className={`w-full pl-10 pr-3 py-2.5 px-8 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
              }`}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <div className="absolute px-3 left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Calendar size={18} />
            </div>
          </div>
        ) : (
          <input
            autoComplete="off"
            id={name}
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5 px-8 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
            }`}
          />
        )}
      </div>
      
      {error && (
        <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;