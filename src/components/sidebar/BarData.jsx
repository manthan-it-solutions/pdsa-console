import React, { useState, useEffect } from "react";
import { apiCall } from "../../services/authServieces";
import { Percent } from "@mui/icons-material";


const BarData = (props) => {

    const [DataForBarGraph,setBarGraphData] = useState({
      sendHSM:"",
      Failed:"",
      seenData:"",
      sendHsmPercentage:"",
      FailedHsmPercentage:"",
      seenDataPercentage:""
    });
    
    useEffect(() => {
      // const fetchData = async () => {

      //   try {

      //     let res = await apiCall({
      //       endpoint: 'dashboard/get_dashboard_data',
      //       method: 'GET',
      //       payload: ''
      //     });
  
      //     // get percentage data
  
      //     let totalData  = res.data.total_count;
      //     let SendData = res.data.send_count;
      //     let failedData = res.data.failed_count;
      //     let seenData = res.data.seen_count;

      //     let sendPercentage = totalData == 0 ? 0 : Math.round((SendData / totalData) * 100);
      //     let failedPercentage = totalData == 0 ? 0 : Math.round((failedData / totalData) * 100);
      //     let seenPercentage = totalData == 0 ? 0 : Math.round((seenData / totalData) * 100);

      //     setBarGraphData({
      //       sendHSM : res.data.send_count,
      //       Failed : res.data.failed_count,
      //       seenData : res.data.seen_count,
      //       sendHsmPercentage:sendPercentage,
      //       FailedHsmPercentage:failedPercentage,
      //       seenDataPercentage:seenPercentage
      //     })

      //   } catch (error) {
      //     console.log(error);
      //   }

      // };

      // fetchData();
    }, []);
    

  return (
    <>

      <h4>{props.title}</h4>
                  <div className="Bar_contain">
                  <div className="Submission_bar" style={{ width: `${DataForBarGraph.seenDataPercentage}%`, backgroundColor: "#00acc1" }}></div>
                    <div className="Failed_bar" style={{ width: `${DataForBarGraph.FailedHsmPercentage}%`, backgroundColor: "#e53935" }}></div>
                    <div className="Delivered_bar" style={{ width: `${DataForBarGraph.sendHsmPercentage}%`, backgroundColor: "#8cc751" }}></div>
                    <div className="Bar_persent">
                      <p>
                        Read: <span id="submission_percent">{DataForBarGraph.seenData}</span>
                      </p>
                      <p>
                        Failed: <span id="failed_percent">{DataForBarGraph.Failed}</span>
                      </p>
                      <p>
                        Deliverd: <span id="delivered_percent">{DataForBarGraph.sendHSM}</span>
                      </p>
                    </div>
                  </div>
    </>
  )
}

export default BarData
