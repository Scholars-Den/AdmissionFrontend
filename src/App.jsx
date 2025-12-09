import { useEffect, useState } from "react";
import "./App.css";
import BasicDetailsPage from "./Components/BasicDetailsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./../redux/store";
import FamilyComponents from "./Components/FamilyComponents";
import SiblingsDetailsComponents from "./Components/SiblingsDetailsComponents";
import TermsAndConditionPage from "./Components/TermsAndConditionPage";
import Signup from "./Components/Signup";
import SuccessComponent from "./Components/SuccessComponent";
import DocumentDetails from "./Components/DocumentDetails";
import AdminSignup from "./Components/AdminView/AdminSignup";
import AdminDashboard from "./Components/AdminView/AdminDashboard";
import ApprovalComplete from "./Components/AdminView/ApprovalComplete";
import ApprovalRejected from "./Components/AdminView/ApprovalRejected";
import CashierDashboard from "./Components/CashierView/CashierDashboard";
import AmountPaidList from "./Components/CashierView/AmountPaidList";
import ConsellorDashboard from "./Components/Consellor/ConsellorDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdmissionHeadDashboard from "./Components/AdmissionHead/AdmissionHeadDashboard";
import ProtectedRouteForStudent from "./Components/ProtectedRouteForStudent";
import LockNavigation from "../utils/LockNavigation";
import ExistingStudent from "./Components/ExistingStudent/ExistingStudent";
import PaymentCompleted from "./Components/AdminView/PaymentCompleted";
import AccountsDashboard from "./Components/AccountsView/AccountsDashboard";
import AddressComponent from "./Components/AddressComponent";


function App() {



  return (
    <Provider store={store}>
      <Router>
        <LockNavigation/>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/alreadyExist" element={<ExistingStudent />} />
          <Route path="/basicDetails" element={<BasicDetailsPage />} />
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
            path="/addressDetails"
            element={
              <ProtectedRouteForStudent>
                <AddressComponent />
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
              // <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              // </ProtectedRoute>
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
          <Route
            path="/paymentCompleted"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PaymentCompleted />
              </ProtectedRoute>
            }
          />

          {/* Cashier Routes */}
          <Route
            path="/cashierDashboard"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amountPaid"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
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
          <Route
            path="/accountsDashboard"
            element={
              <ProtectedRoute allowedRoles={["accounts"]}>
                <AccountsDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
