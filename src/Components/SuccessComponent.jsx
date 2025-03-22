
import scholarsDenLogo from "../assets/scholarsDenLogo.png";
import SignupDetailsPage from "./SignupDetailsPage";
import SuccessContent from "./SuccessContent";

const FormSubmitted = () => {
  

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      <div className="flex-grow">
        <SignupDetailsPage />
      </div>

      <div className="flex-grow">
       <SuccessContent/>
      </div>
      <div className="flex justify-center items-center py-4">
        <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
      </div>
    </div>
  );
};

export default FormSubmitted;
