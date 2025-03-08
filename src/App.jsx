import { useState } from "react";

import "./App.css";
import Signup from "./Components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import EnquiryForm from "./Components/EnquiryForm";
// import TakenBy from "./Components/TakenBy";
import { Provider } from "react-redux";
import store from "./../redux/store";
// import FormSubmitted from "./Components/FormSumited";
// import Spinner from "./Components/Spinner";

function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="flex  justify-center items-center ">
          <Routes>
            <Route path="/" element={<Signup />} />
            {/* <Route path="/enquiryform" element={<EnquiryForm />} /> */}
            {/* <Route path="/enquiryform/takenBy" element={<TakenBy />} />
            <Route path="/FormSubmitted" element={<FormSubmitted />} />
            <Route path="/spinner" element={<Spinner />} /> */}

          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;