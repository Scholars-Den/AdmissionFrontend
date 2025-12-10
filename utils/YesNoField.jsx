const YesNoField = ({ label, name, value, onChange, error }) => {
  return (
    <div className="flex flex-col w-full">
      <span className="text-sm font-semibold mb-1">{label}</span>
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={name}
            value="Yes"
            checked={value === "Yes"}
            onChange={onChange}
            className="accent-blue-500"
          />
          Yes
        </label>

        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={name}
            value="No"
            checked={value === "No"}
            onChange={onChange}
            className="accent-blue-500"
          />
          No
        </label>
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default YesNoField;


// YesNoField.jsx
// import React from "react";

// const YesNoField = ({ label, name, value, onChange, error }) => {
//   return (
//     <div className="flex flex-col w-full">
//       <label className="text-sm font-semibold text-gray-700 mb-2">
//         {label}
//       </label>
//       <div className="flex gap-3 sm:gap-4">
//         <label className="flex-1 relative">
//           <input
//             type="radio"
//             name={name}
//             value="Yes"
//             checked={value === "Yes"}
//             onChange={onChange}
//             className="peer sr-only"
//           />
//           <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white cursor-pointer transition-all duration-200 peer-checked:border-[#c61d23] peer-checked:bg-gradient-to-r peer-checked:from-[#c61d23]/5 peer-checked:to-[#a01818]/5 hover:border-gray-300">
//             <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#c61d23] transition-all">
//               <div className="w-2 h-2 rounded-full bg-[#c61d23] scale-0 peer-checked:scale-100 transition-transform"></div>
//             </div>
//             <span className="text-sm font-medium text-gray-700">Yes</span>
//           </div>
//         </label>
        
//         <label className="flex-1 relative">
//           <input
//             type="radio"
//             name={name}
//             value="No"
//             checked={value === "No"}
//             onChange={onChange}
//             className="peer sr-only"
//           />
//           <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white cursor-pointer transition-all duration-200 peer-checked:border-[#c61d23] peer-checked:bg-gradient-to-r peer-checked:from-[#c61d23]/5 peer-checked:to-[#a01818]/5 hover:border-gray-300">
//             <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#c61d23] transition-all">
//               <div className="w-2 h-2 rounded-full bg-[#c61d23] scale-0 peer-checked:scale-100 transition-transform"></div>
//             </div>
//             <span className="text-sm font-medium text-gray-700">No</span>
//           </div>
//         </label>
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

// export default YesNoField;
