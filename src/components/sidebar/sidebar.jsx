import React from 'react';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';

const MainSidebar = () => {
  const userData = JSON.parse(localStorage.getItem('user-cred'));
  const userType = userData?.user?.status
  return (
    <>
      {userType == '2' ? <AdminSidebar /> : <UserSidebar />}
    </>
  );
};

export default MainSidebar;
