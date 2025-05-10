import { useState } from "react";

import "./App.css";
import Signup from "./Components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import EnquiryForm from "./Components/EnquiryForm";
// import TakenBy from "./Components/TakenBy";
import { Provider } from "react-redux";
import store from "./../redux/store";
import FamilyComponents from "./Components/FamilyComponents";

import AlreadyExistStudent from "./Components/AlreadyExistStudent";

import SiblingsDetailsComponents from "./Components/SiblingsDetailsComponents";
import TermsAndConditionPage from "./Components/TermsAndConditionPage";
import BankRefundComponents from "./Components/BankRefundComponents";
import VerificationPage from "./Components/VerificationPage";
import Spinner from "../api/Spinner";
// import FormSubmitted from "./Components/FormSumited";
// import Spinner from "./Components/Spinner";
import SuccessComponent from "./Components/SuccessComponent";
import SignupDetailsPage from "./Components/SignupDetailsPage";
import scholarsDenLogo from "./assets/scholarsdenLogo.png";
import DocumentUpload from "./Components/DocumentUpload";
import DocumentDetails from "./Components/DocumentDetails";
import AdminSignup from "./Components/AdminView/AdminSignup";
import AdminDashboard from "./Components/AdminView/AdminDashboard";
import ApprovalComplete from "./Components/AdminView/ApprovalComplete";
import ApprovalRejected from "./Components/AdminView/ApprovalRejected";

function App() {

  return (
    <Provider store={store}>
      <Router>
      {/* <div className="w-full min-h-screen flex flex-col bg-[#c61d23]">
      <div className="flex-grow">
        <SignupDetailsPage />
      </div> */}

      {/* Signup Form (Middle Section) */}
      <div className="flex-grow">
          <Routes>
            <Route path="/" element={<VerificationPage />} />
            <Route path="/alreadyExist" element={<AlreadyExistStudent />} />
            <Route path="/basicDetails" element={<Signup />} />
            <Route path="/termsAndConditions" element={<TermsAndConditionPage/>} />
            <Route path="/familyDetails" element = {< FamilyComponents />} />
            <Route path="/siblingsDetails" element= {<SiblingsDetailsComponents />} />
            <Route path="/bankRefund" element={<BankRefundComponents/>} />
            <Route path="/admissionComplete" element={<SuccessComponent/>} />
            <Route path="/documentUpload" element={<DocumentDetails/>} />




            <Route path="/adminDashboard" element={<AdminDashboard/>} />
            <Route path="/approvalComplete" element={<ApprovalComplete/>} />
            <Route path="/approvalRejected" element={<ApprovalRejected/>} />




          <Route path="/adminsignup" element={<AdminSignup/>} />


            {/* <Route path="/documentUpload" element={<DocumentUpload/>} /> */}
            

            {/* <Route path="/enquiryform" element={<EnquiryForm />} /> */}
            {/* <Route path="/enquiryform/takenBy" element={<TakenBy />} />
            <Route path="/FormSubmitted" element={<FormSubmitted />} />
            <Route path="/spinner" element={<Spinner />} /> */}

          </Routes>
        </div>

         {/* <div className="flex justify-center items-center py-4">
              <img className="w-24" src={scholarsDenLogo} alt="Scholars Den Logo" />
            </div> */}


       {/* </div> */}
      </Router>
    </Provider>
  );
}

export default App;