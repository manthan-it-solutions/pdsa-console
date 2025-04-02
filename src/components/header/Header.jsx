
import { React, useState, useEffect, useRef } from "react";
import Sidebar from "../sidebar/sidebar";
import { Navigate } from "react-router-dom";
import "./style.css";
import "./Header.css";
import DotsIcon from "../../Assets/images/dots.png";
import MenuBar from "../../Assets/images/menu_bar.png";
import UserIcon from "../../Assets/images/user.png";
import { Link } from "react-router-dom";
import { useUIContext } from "../../context/index";
import { apiCall } from "../../services/authServieces";
import { Me } from "../../services/authServieces";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';


// ... other imports

const Header = () => {
  const [redirectLogin, redirectToLogin] = useState(false);
  const [balance, setBalance] = useState('0');
  const [Inter, setInter] = useState('0');
  const [Button, setButton] = useState('0');

  
  const [profile, setProfile] = useState({ image: "" });
  
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isUserDropDown,
    setIsUserDropDown,
  } = useUIContext();
  
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  useEffect(() => {
    Balancefunc();
    
    const fetchData = async () => {
      try {
        const data = await Me(); 
        
        if (data && data.success) {
          setProfile({
            image: `${data.data.profile_url}`, 
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
    
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropDown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Balancefunc = async () => {
    try {
      const response = await apiCall({ endpoint: 'admin/pdsa_balance_header', method: 'post' });
      console.log('response: ', response);
      if (response.balance) {
        setBalance(response.balance);
  
        setButton(response.balance);
      }
    } catch (err) {
      console.log('no amount found');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("user-cred");
    redirectToLogin(true);
    setIsUserDropDown(false);
  };

  if (redirectLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Sidebar />
      <header className="Header">
        <div className="Header_contain">
          <div className="Header_menu">
            <button
              id="Header_menu"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <img
                src={DotsIcon}
                alt="menu bar"
                className={`Icon_dots ${!isSidebarCollapsed ? "d-none" : ""}`}
              />
              <img
                className={`Icon_menu ${isSidebarCollapsed ? "d-none" : ""}`}
                src={MenuBar}
                alt="img"
              />
            </button>
          </div>

          <div className="Header_content admin_nav_item">
            {/* <p>
              National Balance : <span>{balance}</span>
            </p>
            <p>
              International Balance : <span>{Inter}</span>
            </p> */}
            <p>
             Balance : <span>{balance}</span>
            </p>
          </div>
          <div className="Header_end" ref={dropdownRef}>
            <button
              id="User_close"
              onClick={() => setIsUserDropDown(!isUserDropDown)}
            >
              <PersonIcon />
            </button>

            <div className={`User_drop ${isUserDropDown ? "show" : ""}`}>
              <Link to="/profile" onClick={() => setIsUserDropDown(false)}> <PersonIcon /> Profile</Link>
              <Link to="/changepassword" onClick={() => setIsUserDropDown(false)}><KeyIcon /> Change Password</Link>
              <button onClick={handleLogOut}> <LogoutIcon /> Logout</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
