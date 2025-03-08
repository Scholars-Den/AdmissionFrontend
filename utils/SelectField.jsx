import Neeche from "../assets/Neeche.png";



const SelectField = ({ label, name, value, options, onChange, error }) => (
    <div className="flex flex-col">
      {/* <label htmlFor={name} className="text-lg font-semibold mb-1">
        {label}
      </label> */}
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border-b-2 text-white py-2 bg-[#c61d23] focus:outline-none  appearance-none "
        style={{
          backgroundImage: `url(${Neeche})`,
  
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "16px",
        }}
      >
        <option value="" className="bg-white " disabled>
          {label}
        </option>
        {options.map((option) => (
          <option
            className="bg-white text-black border-2 border-black-2"
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-white text-sm mt-1">{error}</span>}
    </div>
  );



  export default SelectField;