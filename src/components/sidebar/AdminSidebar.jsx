import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';
import List from '../../Assets/images/list.png';
import CloseIcon from '../../Assets/images/close_icon.png';
import Dash from '../../Assets/images/dashboard.png';
import Manage from '../../Assets/images/manage.png';
import VoicePhone from '../../Assets/images/voice_phone.png';
import { useUIContext } from '../../context/index';
import Logo from "../../Assets/images/logo.png";
import ICON_report from '../../Assets/images/bar-chart.png'
import wellet from '../../Assets/images/wallet.png'


const AdminSidebar = () => {
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useUIContext();

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="Sidebar" id="Sidebar">
      <div className="Sidebar_head">
        {/* <NavLink to="#"><img src={SmsIcon} alt="img" /></NavLink> */}
        <NavLink to="#"><img src={Logo} alt="img" /></NavLink>
        <NavLink to="#">SMSCOUNTER</NavLink>
        <button id="Menu_close" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}><img src={CloseIcon} alt="img" /></button>
      </div>
      <div className="Sidebar_contain">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <NavLink to="/admin">
                <button className={`accordion-button bg_none collapsed ${isActivePath('/admin') ? 'active' : ''}`} type="button">
                  <img src={Dash} alt="img" /> <span>Dashboard</span>
                </button>
              </NavLink>
            </h2>
          </div>







          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/admin/manage-dealer') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_3" aria-expanded="false" aria-controls="Dropdown_3">
                <img src={Manage} alt="img" /> <span>Manage</span>
              </button>
            </h2>







            <div id="Dropdown_3" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/admin/manage-dealer" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Manage User
                </NavLink>

              </div>
            </div>

            {/* <div id="Dropdown_3" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/admin/manage-dealer" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Manage Admin
                </NavLink>
                
              </div>
            </div> */}
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/admin/transaction-details') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_4" aria-expanded="false" aria-controls="Dropdown_4">
                <img src={ICON_report} alt="img" /> <span>Report</span>
              </button>
            </h2>


            <div id="Dropdown_4" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/CompleteCampaign" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Region Wise
                </NavLink>
              </div>
            </div>

            <div id="Dropdown_4" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/ZoneWiseReport" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Zone Wise
                </NavLink>
              </div>
            </div>


            <div id="Dropdown_4" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/CompleteCampaign" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />MIS Report Wise
                </NavLink>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/admin/manage-dealer') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_3" aria-expanded="false" aria-controls="Dropdown_3">
                <img src={Manage} alt="img" /> <span>Feedback</span>
              </button>
            </h2>
          </div>


          {/* <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/admin/transaction-details') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_2" aria-expanded="false" aria-controls="Dropdown_2">
                <img src={wellet} alt="img" /> <span>Transaction</span>
              </button>
            </h2>
            <div id="Dropdown_2" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/TransactionDetails" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Walet
                </NavLink>
              </div>
            </div>
          </div> */}





          {/* Add more admin-specific sidebar items */}
        </div>
      </div>
      <div className="sidebar_bg_img"></div>
    </div>
  );
};

export default AdminSidebar;
