import Neeche from "../src/assets/Neeche.png";

const SelectField = ({ label, name, value, options, onChange, error }) => {
  // console.log("name", name, value, onChange, error);

  // console.log("OPTIONS", options);
  return (
    <div className="flex flex-col rounded-xl bg-[#c61d23] w-full appearance-none">
      {/* <div className="w-full"> */}
        <label htmlFor={name} className="text-sm font-semibold mb-1">
        {label}
      </label>
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="border border-gray-300 text-black rounded-lg p-2 focus:ring-2 w-full focus:ring-indigo-400 focus:outline-none "
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage: `url(${Neeche})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px",
          }}
        >
          <option value="" className=" " disabled>
            {label}
          </option>
          {options.map((option) => (

            <option
              className=" text-black border-2 border-black-2 rounded-lg"
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
        {error && <span className="text-white text-sm mt-1">{error}</span>}
      {/* </div> */}
    </div>
  );
};

export default SelectField;
