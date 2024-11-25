import React, { useState, useEffect } from "react";
import "./../../css/dashboard.css";
import TodayCard from "../../components/TodayCard";
import Total from "../../Assets/images/total.png";
import Delivered from "../../Assets/images/delivered.png";
import Failed from "../../Assets/images/failed.png";
import Read from "../../Assets/images/read.png";
import { apiCall } from "../../services/authServieces"; // Assuming this is your API service for making requests

const AdminDashboard = () => {
  // State to hold count data
  const [dashboardData, setDashboardData] = useState({
    sentToday: 0,
    sentThisWeek: 0,
    sentThisMonth: 0,
    pendingSms: 0,
  });

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
    }
  };
  // Fetch data on component load
  useEffect(() => {
    fetchDashboardData()

    // fetchDashboardData(); // Call the function
  }, []); // Empty array ensures this runs once when component mounts

  return (
    <>
      <div className="Dashboard_contain">
        <h4 className="Head_title">
          Admin Dashboard
        </h4>

        <div className="Dashboard_card">
         

          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_submission"
                data={` Vedio ${dashboardData.sentToday} | Feedback ${dashboardData.sentTodayFeedback}`} 
                header="Vedio Feedback  Today"
                src={Total}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_delivered"
                data={ `Vedio  ${dashboardData.sentThisWeek} | Feedback ${dashboardData.sentThisWeekFeedback}`} // Set data dynamically from API
                header="Vedio Feedback Send This Week"
                src={Delivered}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_failed"
                data={ ` Vedio  ${dashboardData.sentThisMonth} | Feedback ${dashboardData.sentThisMonthFeedback}`} // Set data dynamically from API
                header="Vedio Feedback  Sent Last >15 Days"
                src={Failed}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_pending"
                data={`Vedio ${dashboardData.pendingSms} | Feedback ${dashboardData.pendingSmsFeedback}`} // Set data dynamically from API
                header="Vedio Feedback  Sent This Month"
                src={Read}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
