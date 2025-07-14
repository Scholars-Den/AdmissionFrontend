import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
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
    <div className="flex flex-col items-center w-full appearance-none">
      <div className="w-full">
        <label htmlFor={name} className="text-sm font-semibold mb-1 ">
          {label}
        </label>

        {type === "date" ? (
          <DatePicker
            id={name}
            selected={value ? new Date(value) : null}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder || "DD/MM/YYYY"}
            className="border-b-2 text-black  p-2 m-1 w-full bg-white focus:outline-none placeholder-black rounded-lg appearance-none"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select" 
          />
        ) : (
          <input
            autoComplete="off"
            id={name}
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="border-b-2 text-black p-2 w-full bg-white focus:outline-none placeholder-black rounded-lg appearance-none"
          />
        )}

        {error && <span className="text-[#ffdd00] text-sm mt-1">{error}</span>}
      </div>
    </div>
  );
};

export default InputField;
