import React, { useState, useEffect } from "react";
import "../css/dashboard.css";
import TodayCard from "../components/TodayCard";
import Total from "../Assets/images/total.png";
import Delivered from "../Assets/images/delivered.png";
import Failed from "../Assets/images/failed.png";
import Read from "../Assets/images/read.png";
import Send from "../Assets/images/send.png";
import smsIcon from "../Assets/images/sms.png";
import Receive from "../Assets/images/recieve.png";
import ChartComponent from "../components/ChartComponent";
import BarData from "../components/sidebar/BarData";
import { apiCall } from "../services/authServieces";

const Dashboard = () => {

  const [total_hsm, setDashboardData] = useState(0);
  const [delivered_hsm, setDeliveredHsm] = useState(0);
  const [failed_hsm, setFailedHsm] = useState(0);
  const [seen_hsm, setSeenHsm] = useState(0);


  const [total_hsmfeedback, setDashboardDatafeedback] = useState(0);
  const [delivered_hsmfeedback, setDeliveredHsmfeedback] = useState(0);
  const [failed_hsmfeedback, setFailedHsmfeedback] = useState(0);
  const [seen_hsmfeedback, setSeenHsmfeedback] = useState(0);


  const [sessionData, setSessionData] = useState({
      totalSession: "",
      sendSession: "",
      receivedSession: "",
      seenSession: "",
  });


  const fetchData = async () => {
    try {
      let res = await apiCall({
        endpoint: 'user/get_dashboard_data_user',
        method: 'GET',
        payload: ''
      });

      console.log('res.data: ', res.data);
      setDashboardData(res.data.today_video_send_count);
      setDeliveredHsm(res.data.week_video_send_count);
      setFailedHsm(res.data.last_15_days_video_send_count);
      setSeenHsm(res.data.month_video_send_count);



      setDashboardDatafeedback(res.data.today_feedback_sms_sent);
      setDeliveredHsmfeedback(res.data.week_feedback_sms_sent);
      setFailedHsmfeedback(res.data.last_15_days_feedback_sms_sent);
      setSeenHsmfeedback(res.data.month_feedback_sms_sent);

      setSessionData({
        totalSession: res.data.session_total,
        sendSession: res.data.send_session,
        receivedSession: res.data.received_session,
        seenSession: res.data.seen_session
      })

    } catch (err) {
      console.log(err)
    }
  };
  useEffect(() => {
 

    fetchData();
  }, []);
  
  return (
    <>
      <div className="Dashboard_contain">
        <h4 className="Head_title">
          <img src={smsIcon} alt="icon"  className="Width20"/> Dashboard
        </h4>

        <div className="Dashboard_card">
          

          <div className="row">
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_submission"
                id="total_HSM"
                data={` Vedio   ${total_hsm}  |   Feedback  ${total_hsmfeedback}`}
                header="Vedio Feedback  Today"
                src={Total}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_delivered"
                data={` Vedio ${delivered_hsm}  | Feedback ${delivered_hsmfeedback}`}
                header="Vedio Feedback Send This Week"
                src={Delivered}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_failed"
                data={`Vedio ${failed_hsm}  | Feedback ${failed_hsmfeedback}`}
                header="Vedio Feedback  Sent Last >15 Days"
                src={Failed}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
              <TodayCard
                className="Today_card_img bg_pending"
               data={` Vedio ${seen_hsm}  | Feedback  ${seen_hsmfeedback}`}
                header="Vedio Feedback  Sent This Month"
                src={Read}
              />
            </div>
          </div>
          {/* <div className="border_top">
            <h5>Session Dashboard</h5>
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <TodayCard
                  className="Today_card_img bg_submission"
                  data={sessionData.totalSession}
                  header="Total Session"
                  src={Total}
                />
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <TodayCard
                  className="Today_card_img bg_send"
                  data={sessionData.sendSession}
                  header="Send Session"
                  src={Send}
                />
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <TodayCard
                  className="Today_card_img bg_delivered"
                  data={sessionData.receivedSession}
                  header="Total Receive Session"
                  src={Receive}
                />
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <TodayCard
                  className="Today_card_img bg_pending"
                  data={sessionData.seenSession}
                  header="Session Read"
                  src={Read}
                />
              </div>
            </div>
          </div>

          <div className="Recharge_section">
            <div className="row gy-4">
              <div className="col-lg-5">
                <div className="Today_bar">
                  <BarData title="Today HSM Delivery" />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="Today_bar">
                  <ChartComponent title="HSM Report (Last 10 days)" />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
