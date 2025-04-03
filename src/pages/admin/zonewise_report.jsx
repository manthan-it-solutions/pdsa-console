import React, { useEffect, useState } from "react";
import "../../css/wb_template.css";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import TablePagination from "@mui/material/TablePagination";
import { NavLink, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";  // For downloading files
import excel from '../../Assets/images/excel.png'
import search from '../../Assets/images/search.png'
import Loader from "../../components/Loader"

const ZoneWise_Report = () => {
  const [data, setData] = useState([]);
  const [snackBar, setSnackBar] = useState({ open: false, severity: "", message: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [todate, setToDate] = useState("null")
  const [fromdate, setFromDate] = useState("null")
  const navigate = useNavigate();
  const [isToDateEnabled, setIsToDateEnabled] = useState(false);
const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const twoMonthsAgoString = twoMonthsAgo.toISOString().split("T")[0];



  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleFromDateChange = (event) => {
    // setFromDate(event.target.value);
    const selectedFromDate = event.target.value;
    setFromDate(selectedFromDate);
    if (selectedFromDate) {
      setIsToDateEnabled(true);
    }
  };


  // Fetch data from API
  const getTemplates = async () => {
    setLoading(true);
    try {
      const res = await apiCall({
        endpoint: `admin/getURL_data_zone?page=${page + 1}&limit=${rowsPerPage}`,
        method: "post",

      });

      if (res?.success) {
        console.log(res,'res');
        setData(res.data || []); // Store the API response data
        setTotalTemplates(res.total_count || 0); // Update total count
      }

    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    }finally {
      setLoading(false); 
    }
  };

  // Fetch data from API
  const Getdatetodata = async () => {
    try {
      setLoading(true);
      const res = await apiCall({
        endpoint: `admin/Searh_button_api?page=${page + 1}&limit=${rowsPerPage}`,
        method: "post",
        payload: { fromdate, todate }

      });

      if (res?.success) {
        setData(res.data || []); // Store the API response data
        setTotalTemplates(res.data.length || 0); // Update total count
      }

    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    }finally {
      setLoading(false); 
    }
  };





  useEffect(() => {
    getTemplates();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNavigateToDetails = (encodedZone, columnName) => {
    // Encode the zone for use in query parameters
    const zone = encodeURIComponent(encodedZone);

    // Navigate with query parameters and pass fromdate and todate in state
    navigate(`/DealerDetailsPage?zone=${zone}&columnName=${columnName}`, {
      state: {
        fromdate: fromdate,
        todate: todate,
      },
    });
  };

  // Calculate totals for the table footer
  const calculateTotals = () => {
    return data.reduce(
      (totals, region) => ({
        totalVideoSendCount: totals.totalVideoSendCount + (region.video_send_count || 0),
        totalVideoClickCount: totals.totalVideoClickCount + (region.video_click_count || 0),
        totalFeedbackSmsSent: totals.totalVideoSendCount + (region.totalVideoSendCount || 0),
        totalFeedbackClickCount: totals.totalFeedbackClickCount + (region.total_feedback_click_count || 0),
        totalFeedbackSmsVideoCount: totals.totalFeedbackSmsVideoCount + (region.feedback_sms_video_count || 0),
      }),
      {
        totalVideoSendCount: 0,
        totalVideoClickCount: 0,
        totalFeedbackSmsSent: 0,
        totalFeedbackClickCount: 0,
        totalFeedbackSmsVideoCount: 0,
      }
    );
  };

  const totals = calculateTotals();

  // Export data to CSV
  const exportToCSV = () => {

    const header = [
      "ZONE",
      "Video Send Count",
      "Video Click Count",
      "Total Feedback SMS Sent",
      "Total Feedback Click Count",
      "Total Feedback Given",
      "Sub Total"
    ];

    const rows = data.map(region => {
      const subTotal =
        (region.video_send_count || 0) +
        (region.video_click_count || 0) +
        (region.total_feedback_sms_sent || 0) +
        (region.total_feedback_click_count || 0) +
        (region.feedback_sms_video_count || 0);

      return [
        region.zone || "Unknown",
        region.video_send_count || 0,
        region.video_click_count || 0,
        region.total_feedback_sms_sent || 0,
        region.total_feedback_click_count || 0,
        region.feedback_sms_video_count || 0,
        subTotal,
      ];
    });

    // Add the totals row at the end
    rows.push([
      "Total",
      totals.totalVideoSendCount,
      totals.totalVideoClickCount,
      totals.totalFeedbackSmsSent,
      totals.totalFeedbackClickCount,
      totals.totalFeedbackSmsVideoCount,
      totals.totalVideoSendCount + totals.totalVideoClickCount + totals.totalFeedbackSmsSent + totals.totalFeedbackClickCount + totals.totalFeedbackSmsVideoCount,
    ]);

    // Create CSV data
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Trigger file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Zone_report.csv");
  };


  return (
    <>
{loading && <Loader />}

      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate date_input_container">



          <div className="date_box">
            <input type="date" className="date_box_input" onChange={handleFromDateChange} min={twoMonthsAgoString} max={todayString} />
            To
            <input type="date" className="date_box_input" onChange={handleToDateChange} disabled={!isToDateEnabled} min={fromdate} max={todayString} />

            <div onClick={Getdatetodata} className="sercah_icon_date"><img src={search} /></div>
            {/* <button type="submit" onClick={Getdatetodata}>Submit</button> */}
          </div>



          View Zone Report
          {/* <button className="btn btn-primary p-2 " onClick={exportToCSV}>Export to CSV</button>  */}
          <div onClick={exportToCSV} className="excel_img_btn" ><img src={excel} /></div>
        </h4>
        <div className="Template_id_Card1">
          <div className="table_contain" id="tableContain">
            <table className="Table w-100" id="Table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Video Send Count</th>
                  <th>Video Click Count</th>
                  <th>Total Feedback Sent Count</th>
                  <th>Total Feedback Click Count</th>
                  <th>Total Feedback Given</th>
                 
                </tr>
              </thead>
              <tbody>
                {data.map((region, index) => {
                  const subTotal =
                    (region.video_send_count || 0) +
                    (region.video_click_count || 0) +
                    (region.video_send_count || 0) +
                    (region.total_feedback_click_count || 0) +
                    (region.feedback_sms_video_count || 0);

                  return (
                    <tr key={index}>
                      <td>  {region.zone || "Unknown"}
                        {/* <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.zone || "Unknown")}
                        >
                          {region.zone || "Unknown"}
                        </button> */}
                      </td>
                      <td>
                        <button
                          className="btn btn-link btn-link1"
                          onClick={() => handleNavigateToDetails(region.zone, "video_send_count") || "Unknown"}
                        >
                          {region.video_send_count || 0}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-link btn-link1"
                          onClick={() => handleNavigateToDetails(region.zone, "video_click_count") || "Unknown"}
                        >
                          {region.video_click_count || 0}
                        </button>
                      </td>

                      <td>
                        <button
                          className="btn btn-link btn-link1"
                          onClick={() => handleNavigateToDetails(region.zone, "video_send_count") || "Unknown"}
                        >
                          {region.video_send_count || 0}
                        </button>

                      </td>

                      <td>
                        <button
                          className="btn btn-link btn-link1"
                          onClick={() => handleNavigateToDetails(region.zone, "total_feedback_click_count") || "Unknown"}
                        >
                          {region.total_feedback_click_count || 0}
                        </button>

                      </td>

                      <td>
                        <button
                          className="btn btn-link btn-link1"
                          onClick={() => handleNavigateToDetails(region.zone, "feedback_sms_video_count") || "Unknown"}
                        >
                          {region.feedback_sms_video_count || 0}
                        </button>
                      </td>
                  
                    </tr>
                  );
                })}
                <tr className="font-weight-bold">
                  <td>Total</td>

                  <td>

                    <button
                      className="btn btn-link btn-link1"
                      onClick={() => handleNavigateToDetails("total", "video_send_count") || "Unknown"}
                    >
                      {totals.totalVideoSendCount}
                    </button>
                  </td>
                  <td>

                    <button
                      className="btn btn-link btn-link1"
                      onClick={() => handleNavigateToDetails("total", "video_click_count") || "Unknown"}
                    >
                      {totals.totalVideoClickCount}
                    </button>
                  </td>
                  <td>

                    <button
                      className="btn btn-link btn-link1"
                      onClick={() => handleNavigateToDetails("total", "video_send_count") || "Unknown"}
                    >
                      {totals.totalFeedbackSmsSent}
                    </button>
                  </td>
                  <td>

                    <button
                      className="btn btn-link btn-link1"
                      onClick={() => handleNavigateToDetails("total", "total_feedback_click_count") || "Unknown"}
                    >
                      {totals.totalFeedbackClickCount}
                    </button>

                  </td>
                  <td>

                    <button
                      className="btn btn-link btn-link1"
                      onClick={() => handleNavigateToDetails("total", "feedback_sms_video_count") || "Unknown"}
                    >
                      {totals.totalFeedbackSmsVideoCount}
                    </button>

                  </td>
                 
                </tr>
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={totalTemplates}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </div>
        </div>
      </div>
      <ShowSnackBar open={snackBar.open} severity={snackBar.severity} message={snackBar.message} />
    </>
  );
};

export default ZoneWise_Report;
