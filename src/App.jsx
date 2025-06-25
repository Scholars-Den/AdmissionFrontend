import { useEffect, useState } from "react";
import "./App.css";
import Signup from "./Components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./../redux/store";
import FamilyComponents from "./Components/FamilyComponents";
import AlreadyExistStudent from "./Components/AlreadyExistStudent";
import SiblingsDetailsComponents from "./Components/SiblingsDetailsComponents";
import TermsAndConditionPage from "./Components/TermsAndConditionPage";
import BankRefundComponents from "./Components/BankRefundComponents";
import VerificationPage from "./Components/VerificationPage";
import SuccessComponent from "./Components/SuccessComponent";
import SignupDetailsPage from "./Components/SignupDetailsPage";
import DocumentDetails from "./Components/DocumentDetails";
import AdminSignup from "./Components/AdminView/AdminSignup";
import AdminDashboard from "./Components/AdminView/AdminDashboard";
import ApprovalComplete from "./Components/AdminView/ApprovalComplete";
import ApprovalRejected from "./Components/AdminView/ApprovalRejected";
import ManagerDashboard from "./Components/ManagerView/ManagerDashboard";
import AmountPaidList from "./Components/ManagerView/AmountPaidList";
import ConsellorDashboard from "./Components/Consellor/ConsellorDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdmissionHeadDashboard from "./Components/AdmissionHead/AdmissionHeadDashboard";
import ProtectedRouteForStudent from "./Components/ProtectedRouteForStudent";
import LockNavigation from "../utils/LockNavigation";

function App() {
  useEffect(() => {
    // Push a new state when the component mounts
    window.history.pushState(null, null, window.location.pathname);
  }, []);

  return (
    <Provider store={store}>
        <LockNavigation/>
      <Router>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<VerificationPage />} />
          <Route path="/alreadyExist" element={<AlreadyExistStudent />} />
          <Route path="/basicDetails" element={<Signup />} />
          <Route
            path="/termsAndConditions"
            element={<TermsAndConditionPage />}
          />

          {/* Protected Routes for authenticated users */}
          <Route
            path="/familyDetails"
            element={
              <ProtectedRouteForStudent>
                <FamilyComponents />
              </ProtectedRouteForStudent>
            }
          />
          <Route
            path="/siblingsDetails"
            element={
              <ProtectedRouteForStudent>
                <SiblingsDetailsComponents />
              </ProtectedRouteForStudent>
            }
          />
          <Route
            path="/bankRefund"
            element={
              <ProtectedRouteForStudent>
                <BankRefundComponents />
              </ProtectedRouteForStudent>
            }
          />
          <Route
            path="/admissionComplete"
            element={
              <ProtectedRouteForStudent>
                <SuccessComponent />
              </ProtectedRouteForStudent>
            }
          />
          <Route
            path="/documentUpload"
            element={
              <ProtectedRouteForStudent>
                <DocumentDetails />
              </ProtectedRouteForStudent>
            }
          />

          {/* Admin Routes */}
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvalComplete"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ApprovalComplete />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvalRejected"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ApprovalRejected />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/managerDashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amountPaid"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <AmountPaidList />
              </ProtectedRoute>
            }
          />

          {/* Counsellor Routes */}
          <Route
            path="/ConsellorDashboard"
            element={
              <ProtectedRoute allowedRoles={["counsellor"]}>
                <ConsellorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissionHeadDasboard"
            element={
              <ProtectedRoute allowedRoles={["admissionHead"]}>
                <AdmissionHeadDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
