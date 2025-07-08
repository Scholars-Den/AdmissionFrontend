// src/Components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";

const ProtectedRouteForStudent = ({ children }) => {
  const userRole = getCookie("token");

  if (!userRole ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouteForStudent;
