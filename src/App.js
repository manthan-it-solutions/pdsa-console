import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/footer';
import WbLoginDetails from './pages/WbLoginDetails';
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login';
import { useUIContext } from './context';
import AuthGuard from './guards/authGuards';
import { apiCall, Me } from './services/authServieces';
import AdminGuard from './guards/AdminGuard';
import Profile from './pages/profile';
import Changepassword from './pages/Changepassword';
import CompeleteCampaign from './pages/admin/CompleteCompaign.jsx'
import ZoneReprot from '../src/pages/admin/zonewise_report.jsx'
import ZoneWiseReportUser from './pages/zonewise_report_user.jsx'
import RegionWisereportuser from './pages/regionwise_report.jsx'
import DealerDetailsPage from './pages/admin/show_data_zone_wise.jsx'
import DealerDetailsPageregion from './pages/admin/show_data_region_wise.jsx'
import NotFound from './pages/404_page.jsx'
import AdminDashboard from './pages/admin/adminDashboard';
import WbManageDealer from './pages/admin/WbManageDealer';
import Feedback from './pages/admin/Feedback.jsx';
import UserDetailspage from './pages/show_data_region_user.jsx';
import UserDetailsZonePage from './pages/show_data_zone_user.jsx'

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Move useNavigate here
  // const showNavbarFooter = !['/login', '/managebot', '/notfound'].includes(location.pathname);
  const { isSidebarCollapsed } = useUIContext();
  const [userType, setUserType] = useState(null);

  const excludedPaths = ['/login', '/managebot', '/notfound', '/feedback'];
  const isLoginPage = excludedPaths.includes(location.pathname);
  const showNavbarFooter = !excludedPaths.includes(location.pathname);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = JSON.parse(localStorage.getItem('user-cred'));
      if (!token && location.pathname !== '/feedback') {
        navigate('/login');
      } else if (token?.token) {
        if (location.pathname === '/') {
          if (token.user.status === '1') {
            navigate('/user_dashbaord');
          } else if (token.user.status === '2') {
            navigate('/admin');
          }
        }
      }
    };
  
    checkAuthStatus();
  }, [navigate, location.pathname]);
  



  return (
    <div id="page-body" className={!isSidebarCollapsed ? 'sidebar-collapsed' : ''}>
      <section className={isLoginPage ? '' : 'Contain'} id="Contain">
        {showNavbarFooter && <Header isSidebarCollapsed={isSidebarCollapsed} />}

        
        <div className={isLoginPage ? '' : 'Dash_contain'}>
          <Routes>
            {/* Protected Routes */}
            <Route path="/user_dashbaord" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard><AdminGuard><AdminDashboard /></AdminGuard></AuthGuard>} />
            <Route path="/wblogindetails" element={<AuthGuard><WbLoginDetails /></AuthGuard>} />
            <Route path="/ZoneWiseReport" element={<AuthGuard><ZoneReprot /></AuthGuard>} />
            <Route path="/ZoneWiseReport_user" element={<AuthGuard><ZoneWiseReportUser /></AuthGuard>} />
            <Route path="/RegioneWise_report_user" element={<AuthGuard><RegionWisereportuser /></AuthGuard>} />
            <Route path="/admin/manage-dealer" element={<AuthGuard><AdminGuard><WbManageDealer /></AdminGuard></AuthGuard>} />
            <Route path="/DealerDetailsPage" element={<AuthGuard><DealerDetailsPage /></AuthGuard>} />
            <Route path="/DealerDetailsPageregion" element={<AuthGuard><DealerDetailsPageregion /></AuthGuard>} />
            <Route path="/UserDetailspage" element={<AuthGuard><UserDetailspage /></AuthGuard>} />
            {/* report routes   start  */}
            <Route path="/CompleteCampaign" element={<AuthGuard><CompeleteCampaign /></AuthGuard>} />
            <Route path="/UserDetailsZonePage" element={<AuthGuard><UserDetailsZonePage/></AuthGuard>} />

            {/* Admin Routes*/}
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/changepassword" element={<AuthGuard><Changepassword /></AuthGuard>} />
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route
              path="*"
              element={<Navigate to="/notfound" state={{ from: location.pathname }} />}
            />
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
