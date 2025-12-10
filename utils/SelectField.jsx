
// // SelectField.jsx
// import React from "react";
// import { ChevronDown } from "lucide-react";

// const SelectField = ({
//   label,
//   name,
//   value,
//   options,
//   onChange,
//   error,
//   classAdded,
//   icon: Icon,
//   required,
//   disabled,
// }) => {
//   return (
//     <div className={`flex flex-col w-full ${classAdded || ""}`}>
//       {label && label !== "Select Relation" && label !== "Select Class" && (
//         <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
      
//       <div className="relative">
//         {Icon && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             <Icon size={18} />
//           </div>
//         )}
        
//         <select
//           id={name}
//           name={name}
//           value={value || ""}
//           onChange={onChange}
//           disabled={disabled}
//           className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-10 py-2.5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//             error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
//           }`}
//         >
//           <option value="" disabled>
//             {label}
//           </option>
//           {options.map((option) => (
//             <option key={option} value={option} className="text-gray-900">
//               {option}
//             </option>
//           ))}
//         </select>
        
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//           <ChevronDown size={18} />
//         </div>
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

// export default SelectField;




// SelectField.jsx
// import React from "react";
// import { ChevronDown } from "lucide-react";

// const SelectField = ({
//   label,
//   name,
//   value,
//   options,
//   onChange,
//   error,
//   classAdded,
//   icon: Icon,
//   required,
//   disabled,
// }) => {
//   return (
//     <div className={`flex flex-col w-full ${classAdded || ""}`}>
//       {label && label !== "Select Relation" && label !== "Select Class" && (
//         <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
      
//       <div className="relative">
//         <select
//           id={name}
//           name={name}
//           value={value || ""}
//           onChange={onChange}
//           disabled={disabled}
//           className={`w-full pl-3 pr-10 py-2.5 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//             error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
//           }`}
//         >
//           <option value="" disabled>
//             {label}
//           </option>
//           {options.map((option) => (
//             <option key={option} value={option} className="text-gray-900">
//               {option}
//             </option>
//           ))}
//         </select>
        
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//           <ChevronDown size={18} />
//         </div>
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

// export default SelectField;














import React from "react";
import { ChevronDown } from "lucide-react";

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  classAdded,
  icon: Icon,
  required,
  disabled,
}) => {
  return (
    <div className={`flex flex-col w-full ${classAdded || ""}`}>
      {label && label !== "Select Relation" && label !== "Select Class" && (
        <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute px-3 left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-10 py-2.5 px-8 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/20 focus:border-[#c61d23] hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
          }`}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
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

export default SelectField;
