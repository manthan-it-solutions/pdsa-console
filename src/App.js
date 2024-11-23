import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/footer';
import WbQuickCampaigns from './pages/WbQuickCampaigns';
import WbCustomizeCampaigns from './pages/WbCustomizeCampaigns';
import WbCampaignsbutton from './pages/WbCompaignButton'
import WbTemplate from './pages/NationalCompaign';
import WbManageMedia from './pages/InternationalCompaign';
import ButtonCompaign from './pages/ButtonCampaign';
import ButtonIdCompaign from './pages/ButtonCampaignId'
import InternationalCompaign from './pages/InternationalCompaignId'
import PandingCampaign from './pages/admin/pandingCampaignView'
import WbManageDealer from './pages/admin/WbManageDealer';
import WbTransactionDetail from './pages/admin/WbTransactionDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import AdminGuard from './guards/AdminGuard';
// import Drag from './pages/Drag'
import WbLoginDetails from './pages/WbLoginDetails';
import Demo from './pages/Demo';
import Login from './pages/Login';
import { useUIContext } from './context';
import AuthGuard from './guards/authGuards';
import { apiCall, Me } from './services/authServieces';

import Managebot from './pages/Managebot';

import Profile from './pages/profile';
import Changepassword from './pages/Changepassword';
import ManageWaba from './pages/admin/ManageWaba'
import NationCompaignId from "../src/pages/NationalCompaignId"
import NationalReport  from './pages/NationalReport'
import Internationalreport from './pages/Internationalreport'
import ButtonReport  from './pages/ButtonReport'

import CompeleteCampaign from './pages/admin/CompleteCompaign.jsx'
import TrsansactionDetails from './pages/TransactionDetails.jsx'
import ZoneReprot from '../src/pages/admin/zonewise_report.jsx'
import ZoneWise_Report_User from './pages/zonewise_report_user.jsx'


import RegionWise_report_user from './pages/regionwise_report.jsx'

import DealerDetailsPage from './pages/admin/show_data_zone_wise.jsx'

import DealerDetailsPageregion from './pages/admin/show_data_region_wise.jsx'

import NotFound from './pages/404_page.jsx'




const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Move useNavigate here
  const showNavbarFooter = !['/login','/managebot'].includes(location.pathname);
  const { isSidebarCollapsed } = useUIContext();
  const [userType, setUserType] = useState(null); 




  const excludedPaths = ['/login', '/managebot'];
  const isLoginPage = excludedPaths.includes(location.pathname);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await Me();
        const userType = userData?.data?.user_type
        setUserType(userType); 
        if (location.pathname === '/' && userType === '2') {
          navigate('/admin'); 
        }
        else if (location.pathname === '/' && userType === '1') {
          navigate('/user_dashbaord'); 
        }
      } catch (error) {
        navigate('/login'); 
      }
    };

    fetchData();
  }, [navigate]); // Empty dependency array ensures this runs on every component mount


//  // Function to get client IP and geo-location (mocked for frontend)
//  const getClientInfo = async () => {
//   try {
//     // You would typically get the client IP and geo info from an external service
//     const ipResponse = await apiCall({endpoint:'https://api.ipify.org?format=json'}); // Get the IP address
//     const ip = ipResponse.data.ip;

//     // Using a geo service like geoip-lite or an API like ipinfo.io to get geo info
//     const geoResponse = await apiCall({endpoint:`https://ipinfo.io/${ip}/json?token=YOUR_API_KEY`,
//       method:'get'
//     });
//     const geo = geoResponse.data;

//     return { ip, geo };
//   } catch (error) {
//     console.error('Error getting client info:', error);
//     return { ip: 'Unknown', geo: {} }; // Fallback values
//   }
// };

//   useEffect(() => {
//     // Log the 404 error when URL is not found
//     const log404Error = async () => {
//       try {
   
//         const { ip, geo } = await getClientInfo();

//         // Prepare the payload to send to the backend
//         const payload = {
//           path: location.pathname, // The current path the user tried to access
//           clientIp: ip,             // The client's IP address
//           geo: geo,                 // Geo info based on IP
//                        // Current time
//         };

//         // Make the backend API call to log the 404 error
//         const response = await apiCall({endpoint:'api/log-404',method:"post", payload:payload}); // Use your custom apiCall function here
//         console.log('404 error logged successfully:', response);
//       } catch (error) {
//         console.error('Error logging 404:', error);
//       }
//     };

//     // Make the API call only if the path is not '/' or '/login'
//     if (location.pathname !== '/' && location.pathname !== '/login') {
//       log404Error();
//     }
//   }, [location]); // Triggered on path change
  return (
    <div id="page-body" className={!isSidebarCollapsed ? 'sidebar-collapsed' : ''}>
    <section className={isLoginPage ? '' : 'Contain'} id="Contain">
    {showNavbarFooter && <Header isSidebarCollapsed={isSidebarCollapsed} />}
      <div  className={isLoginPage ? '' : 'Dash_contain'}>
          <Routes>
            {/* Protected Routes */}
            {/* <Route path="/drag" element={<Drag />} /> */}
            <Route path="/user_dashbaord" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/wbquickcampaigns" element={<AuthGuard><WbQuickCampaigns /></AuthGuard>} />
            <Route path="/wbcustomizecampaigns" element={<AuthGuard><WbCustomizeCampaigns /></AuthGuard>} />
            <Route path="/NationCompaignId" element={<AuthGuard><NationCompaignId /></AuthGuard>} />
            
            <Route path="/wbcampaignsbutton" element={<AuthGuard><WbCampaignsbutton /></AuthGuard>} />
            <Route path="/wbtemplate" element={<AuthGuard><WbTemplate /></AuthGuard>} />
            <Route path="/wbmanagemedia" element={<AuthGuard><WbManageMedia /></AuthGuard>} />
            <Route path="/internationCompaign" element={<AuthGuard><InternationalCompaign/></AuthGuard>} />
            <Route path="/wbmanagegroups" element={<AuthGuard><ButtonCompaign /></AuthGuard>} />
            
            <Route path="/ButtonCompaignId" element={<AuthGuard><ButtonIdCompaign /></AuthGuard>} />
           
            <Route path="/wblogindetails" element={<AuthGuard><WbLoginDetails /></AuthGuard>} />
            <Route path="/demo" element={<AuthGuard><Demo /></AuthGuard>} />


            <Route path="/TransactionDetails" element={<AuthGuard><TrsansactionDetails /></AuthGuard>} />
            <Route path="/ZoneWiseReport" element={<AuthGuard><ZoneReprot /></AuthGuard>} />


            <Route path="/ZoneWiseReport_user" element={<AuthGuard><ZoneWise_Report_User /></AuthGuard>} />


            <Route path="/RegioneWise_report_user" element={<AuthGuard><RegionWise_report_user /></AuthGuard>} />


            <Route path="/DealerDetailsPage" element={<AuthGuard><DealerDetailsPage /></AuthGuard>} />


            <Route path="/DealerDetailsPageregion" element={<AuthGuard><DealerDetailsPageregion /></AuthGuard>} />

            


            {/* report routes   start  */}


            <Route path="/NationalReport" element={<AuthGuard><NationalReport /></AuthGuard>} />
            <Route path="/InterNationalReport" element={<AuthGuard><Internationalreport /></AuthGuard>} />
            <Route path="/ButttonReport" element={<AuthGuard><ButtonReport /></AuthGuard>} />
            <Route path="/CompleteCampaign" element={<AuthGuard><CompeleteCampaign /></AuthGuard>} />

            
            
{/*   Admin Routes of Admin Dashbaordv Start */}

<Route path="/admin/panding_Campaign" element={<AuthGuard><AdminGuard><PandingCampaign /></AdminGuard></AuthGuard>} />




{/*   Admin Routes of Admin Dashbaord End */}

            




                 {/* report routes   End */}


            {/* Admin Routes*/}
            <Route path="/admin" element={<AuthGuard><AdminGuard><AdminDashboard /></AdminGuard></AuthGuard>} />
            <Route path="/admin/transaction-details" element={<AuthGuard><AdminGuard><WbTransactionDetail /></AdminGuard></AuthGuard>} />
            <Route path="/admin/manage-dealer" element={<AuthGuard><AdminGuard><WbManageDealer /></AdminGuard></AuthGuard>} />
            <Route path="/admin/manage-waba" element={<AuthGuard><AdminGuard><ManageWaba/></AdminGuard></AuthGuard>} />

            <Route path="/admin/manage-quikmassage" element={<AuthGuard><AdminGuard><ManageWaba/></AdminGuard></AuthGuard>} />
            {/* <Route path="/admin/manage-waba" element={<AuthGuard></AuthGuard>} /> */}


       
            <Route path="/managebot" element={<Managebot />} />

            <Route path="/profile" element={<AuthGuard><Profile/></AuthGuard>} />
            <Route path="/changepassword" element={<AuthGuard><Changepassword/></AuthGuard>} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="*"   element={<NotFound />} />

          </Routes>
        </div>
      </section>
      {showNavbarFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
