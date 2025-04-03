import React, { useState, useEffect } from "react";
import "./../../css/dashboard.css";
import TodayCard from "../../components/TodayCard";
import Total from "../../Assets/images/total.png";
import Delivered from "../../Assets/images/delivered.png";
import Failed from "../../Assets/images/failed.png";
import Read from "../../Assets/images/read.png";
import { apiCall } from "../../services/authServieces"; 
import Loader from "../../components/Loader";
const AdminDashboard = () => {
  // State to hold count data
  const [dashboardData, setDashboardData] = useState({
    sentToday: 0,
    sentThisWeek: 0,
    sentThisMonth: 0,
    pendingSms: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await apiCall({
        endpoint: `admin/Dahboard_data_admin`,
        method: "GET",
      });
    
      
      if (response && response.data) {
        setDashboardData({
          sentToday: response.data[0].today_video_send_count || 0,
          sentThisWeek: response.data[0].week_video_send_count || 0,
          sentThisMonth: response.data[0].week_video_send_count || 0,
          pendingSms: response.data[0].week_video_send_count || 0,
          sentTodayFeedback: response.data[0].today_video_send_count || 0,
          sentThisWeekFeedback: response.data[0].week_video_send_count || 0,
          sentThisMonthFeedback: response.data[0].week_video_send_count || 0,
          pendingSmsFeedback: response.data[0].week_video_send_count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }finally {
      setLoading(false); 
    }
  };
  // Fetch data on component load
  useEffect(() => {
    fetchDashboardData()

    // fetchDashboardData(); // Call the function
  }, []); // Empty array ensures this runs once when component mounts

  return (
    <>
    {loading ? (
        <Loader /> 
      ) : (
      <div className="Dashboard_contain">
        <h4 className="Head_title">
          Admin Dashboard
        </h4>

        <div className="Dashboard_card">
         

          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
              <TodayCard
                className="Today_card_img bg_submission"
                // data={` Video ${dashboardData.sentToday} | Feedback ${dashboardData.sentTodayFeedback}`} 
                data={`${dashboardData.sentToday}`} 
                header="Whatsapp Sent (Today)"
                src={Total}
                 cardClass="card-today"
              />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
              <TodayCard
                className="Today_card_img bg_delivered"
                data={ `${dashboardData.sentThisWeek}`} // Set data dynamically from API
                header="Whatsapp Sent (This Week)"
                src={Delivered}
                cardClass="card-week"
              />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
              <TodayCard
                className="Today_card_img bg_failed"
                data={ `${dashboardData.sentThisMonth} `} // Set data dynamically from API
                header="Whatsapp Sent (Last 15 Days)"
                src={Failed}
                cardClass="card-month"
              />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
              <TodayCard
                className="Today_card_img bg_pending"
                data={`${dashboardData.pendingSms} `} // Set data dynamically from API
                header="Whatsapp Sent (Last Month)"
                src={Read}
                 cardClass="card-pending"
              />
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default AdminDashboard;
