// src/components/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user-cred'));
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
