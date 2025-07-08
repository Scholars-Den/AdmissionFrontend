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
