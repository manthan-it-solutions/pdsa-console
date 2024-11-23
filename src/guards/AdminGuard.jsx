// src/components/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user-cred'));
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if(user?.user?.status != '2'){
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminGuard;
