const InputField = ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    placeholder,
  }) => ( 
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
  );




  export default InputField;