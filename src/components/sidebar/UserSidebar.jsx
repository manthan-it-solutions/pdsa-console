import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';
import List from '../../Assets/images/list.png';
import CloseIcon from '../../Assets/images/close_icon.png';
import Dash from '../../Assets/images/dashboard.png';
import ComposeSms from '../../Assets/images/compose_sms.png';
import Report from '../../Assets/images/report.png';
import CreateIcon from '../../Assets/images/edit.png';
import { useUIContext } from '../../context/index';
import Manage from '../../Assets/images/manage.png';
import Logo from "../../Assets/images/logo.png";
import { apiCall } from '../../services/authServieces';

const UserSidebar = () => {
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useUIContext();
  const [regionOptions, setRegionOptions] = useState([]); // To store region options
  
  

  const isActivePath = (path) => location.pathname === path;


  const get_region_data= async()=>{
    try {
      const res= await apiCall({
        endpoint:'user/get_side_bar_region',
        method:'get'
      })

      if (res.success) {
        // Check if region data exists and filter out blank or invalid strings
        const validRegions = res.data.filter(item => item.region_name && item.region_name.trim() !== '');

        if (validRegions.length > 0) {
            setRegionOptions(validRegions); // Store the valid region options
            console.log('Valid regions: ', validRegions);
        } else {
            setRegionOptions([]); // Clear the region options if no valid data
            console.log('No valid regions found');
        }
    } else {
        console.error('Failed to fetch region data: ', res.message);
        setRegionOptions([]); // Clear the region options in case of failure
    }
      
    } catch (error) {
      console.log('error: ', error);
      
    }
  }

  useEffect(() => {
    get_region_data()
  }, [location]);

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
              <NavLink to="/user_dashbaord">
                <button className={`accordion-button bg_none collapsed ${isActivePath('/user_dashbaord') ? 'active' : ''}`} type="button">
                  <img src={Dash} alt="img" /> <span>Dashboard</span>
                </button>
              </NavLink>
            </h2>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/wbquickcampaigns') || isActivePath('/wbcustomizecampaigns') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_1" aria-expanded="false" aria-controls="Dropdown_1">
                <img src={ComposeSms} alt="img" /> <span> Report</span>
              </button>
            </h2>
            <div id="Dropdown_1" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">

         {/* Conditionally render the region option */}
         {regionOptions.length > 0 && (
                  <NavLink to='/RegioneWise_report_user' className={({ isActive }) => isActive ? 'active' : ''}>
                    <img src={List} alt="img" />View Region
                  </NavLink>
                )}


                <NavLink to='/ZoneWiseReport_user' className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />View Zone
                </NavLink>

           


                {/* <NavLink to="/wbcustomizecampaigns" className={({ isActive }) => isActive ? 'active pe-0' : 'pe-0'}>
                  <img src={List} alt="img" />
                </NavLink>


                <NavLink to="/wbcampaignsbutton" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Campaign Button
                </NavLink> */}

                
              </div>
            </div>
          </div>
{/* 
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/wbtemplate') || isActivePath('/wbmanagemedia') || isActivePath('/wbmanagegroups') || isActivePath('/wbmanageblocknumber') || isActivePath('/admin/manage-dealer') || isActivePath('/wbdeveloperstools') ? 'active' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_3" aria-expanded="false" aria-controls="Dropdown_3">
                <img src={Manage} alt="img" /> <span>View Campaign</span>
              </button>
            </h2>
            <div id="Dropdown_3" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/wbtemplate" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />  National Campaign
                </NavLink>
                <NavLink to="/wbmanagemedia" className={({ isActive }) => isActive ? 'active pe-0' : 'pe-0'}>
                  <img src={List} alt="img" />International Campaign
                </NavLink>
                <NavLink to="/wbmanagegroups" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Button Campaign
                </NavLink>
             
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/createbot') ? '' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_create" aria-expanded="false" aria-controls="Dropdown_create">
                <img src={CreateIcon} alt="img" /> <span>National Report</span>
              </button>
            </h2>
            <div id="Dropdown_create" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/NationalReport" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Campaign Report
                </NavLink>

              </div>

        
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/createbot') ? '' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_createInter" aria-expanded="false" aria-controls="Dropdown_createInter">
                <img src={CreateIcon} alt="img" /> <span>International Report</span>
              </button>
            </h2>
            <div id="Dropdown_createInter" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/InterNationalReport" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Campaign Report
                </NavLink>

              </div>

          
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/createbot') ? '' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_createButton" aria-expanded="false" aria-controls="Dropdown_createButton">
                <img src={CreateIcon} alt="img" /> <span>Button Report</span>
              </button>
            </h2>
            <div id="Dropdown_createButton" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/ButttonReport" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Button Report
                </NavLink>

              </div>

        
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className={`accordion-button collapsed ${isActivePath('/createbot') ? '' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#Dropdown_createTransaction" aria-expanded="false" aria-controls="Dropdown_createTransaction">
                <img src={CreateIcon} alt="img" /> <span> Transaction</span>
              </button>
            </h2>
            <div id="Dropdown_createTransaction" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <NavLink to="/TransactionDetails" className={({ isActive }) => isActive ? 'active' : ''}>
                  <img src={List} alt="img" />Purchase Details
                </NavLink>

              </div>

            
            </div>
          </div> */}




         
          {/* Add more user-specific sidebar items */}
        </div>
      </div>
      <div className="sidebar_bg_img"></div>
    </div>
  );
};

export default UserSidebar;
