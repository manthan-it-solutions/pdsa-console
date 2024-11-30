import React, { useEffect, useState } from "react";
import "../../css/wb_template.css";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import TablePagination from "@mui/material/TablePagination";
import {  useNavigate } from "react-router-dom";

const CompeleteCampaign = () => {
  const [data, setData] = useState([]); // API data
  const [snackBar, setSnackBar] = useState({ open: false, severity: "", message: "" });
  const [page, setPage] = useState(0); // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination: rows per page
  const [totalTemplates, setTotalTemplates] = useState(0); // Total templates count
  const navigate = useNavigate(); // For navigation to details page

  const getTemplates = async () => {
    try {
      const res = await apiCall({
        endpoint: `admin/getURL_data?page=${page + 1}&limit=${rowsPerPage}`,
        method: "GET",
      });
;
      if (res?.success) {
        setData(res.data || []); // Store the API response data
        setTotalTemplates(res.totalPages); // Update pagination
        setTotalTemplates(res.data.length)
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
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

  const calculateTotals = () => {
    return data.reduce(
      (totals, region) => ({
        totalVideoSendCount: totals.totalVideoSendCount + (region.video_send_count || 0),
        totalVideoClickCount: totals.totalVideoClickCount + (region.video_click_count || 0),
        totalFeedbackSmsSent: totals.totalVideoSendCount + (region.video_send_count || 0),
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



    // Navigate to dealer details page with zone as a query parameter
    const handleNavigateToDetails = (zone,columnName ) => {
      console.log('columnName: ', columnName);
      navigate(`/DealerDetailsPageregion?zone=${zone}&columnName=${encodeURIComponent(columnName)}`);
    };

  return (
    <>
      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate">View Region Report</h4>
        <div className="Template_id_Card1">
          <div className="table_contain" id="tableContain">
            <table className="Table w-100" id="Table">
              <thead>
                <tr>
                <th>Region</th>
                  <th>Video Send Count</th>
                  <th>Video Click Count</th>
                  <th>Total Feedback SMS Sent</th>
                  <th>Total Feedback Click Count</th>
                  <th>Total Feedback Given</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((region, index) => {
                  const subTotal =
                    (region.video_send_count || 0) +
                    (region.totalVideoClickCount || 0) +
                    (region.video_send_count || 0) +
                    (region.total_feedback_click_count || 0) +
                    (region.feedback_sms_video_count || 0);

                  return (
                    <tr key={index}>
                      <td>{region.region || "Unknown"}</td>
                      <td>
                      <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.region,"video_send_count")}
                        >
                         {region.video_send_count || 0}
                        </button>
                        </td>
                        <td>
                        <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.region,"video_click_count")}
                        >
                          {region.video_click_count || 0}
                        </button>
                      </td>
                     
<td>
                      <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.region,"video_send_count") }
                        >
                         {region.video_send_count || 0}
                        </button>
                 
                        </td>

                      <td>
                      <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.region,"total_feedback_click_count") }
                        >
                       {region.total_feedback_click_count || 0}
                        </button>
                    
                        </td>

                        <td>
                      <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails(region.region,"feedback_sms_video_count")}>

                {region.feedback_sms_video_count || 0}
                        </button>
                        </td>
                      <td>
                  
                          {subTotal || 0}
                       
                        </td> {/* Subtotal for each row */}
                    </tr>
                  );
                })}
                <tr className="font-weight-bold">
                  <td>Total</td>
                  <td>
                    
                  <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails("total","video_send_count")}>

{totals.totalVideoSendCount}
                        </button>
                    </td>
                  <td>


                  <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails("total","video_click_count")}>

{totals.totalVideoClickCount}
                        </button>
                  </td>
                  <td>

                  <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails("total","video_send_count")}>

{totals.totalVideoSendCount}
                        </button>
                  </td>
                  <td>

                  <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails("total","total_feedback_click_count")}>

{totals.totalFeedbackClickCount}
                        </button>
                  </td>
                  <td>



                  <button
                          className="btn btn-link"
                          onClick={() => handleNavigateToDetails("total","feedback_sms_video_count")}>

{totals.totalFeedbackSmsVideoCount}
                        </button>
                  </td>
                  <td>
                    {totals.totalVideoSendCount +
                      totals.totalVideoClickCount +
                      totals.totalVideoSendCount +
                      totals.totalFeedbackClickCount +
                      totals.totalFeedbackSmsVideoCount}
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

export default CompeleteCampaign;
