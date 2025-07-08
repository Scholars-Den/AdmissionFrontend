const CheckboxField = ({ label, name, checked, onChange, error }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked || false}
        onChange={onChange}
        className="w-4 h-4"
      />
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default CheckboxField;
