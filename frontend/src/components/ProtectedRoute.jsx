// frontend/src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading message while checking for a user
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no user, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If there is a user, render the children
  return children;
};

export default ProtectedRoute;
