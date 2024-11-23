import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { apiCall } from "../services/authServieces";
import ShowSnackBar from "../components/snackBar";
import TablePagination from "@mui/material/TablePagination";

const RegionWise_report_user = () => {
  const [data, setData] = useState([]); // API data
  const [snackBar, setSnackBar] = useState({ open: false, severity: "", message: "" });
  const [page, setPage] = useState(0); // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination: rows per page
  const [totalTemplates, setTotalTemplates] = useState(0); // Total templates count

  const getTemplates = async () => {
    try {
      const res = await apiCall({
        endpoint: `user/getURL_data_user?page=${page + 1}&limit=${rowsPerPage}`,
        method: "GET",
      });

      if (res?.success) {
        console.log(res.data,'res.datares.datares.data');
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
                    (region.video_click_count || 0) +
                    (region.total_feedback_sms_sent || 0) +
                    (region.total_feedback_click_count || 0) +
                    (region.feedback_sms_video_count || 0);

                  return (
                    <tr key={index}>
                      <td>{region.region || "Unknown"}</td>
                      <td>{region.video_send_count || 0}</td>
                      <td>{region.video_click_count || 0}</td>
                      <td>{region.total_feedback_sms_sent || 0}</td>
                      <td>{region.total_feedback_click_count || 0}</td>
                      <td>{region.feedback_sms_video_count || 0}</td>
                      <td>{subTotal}</td> {/* Subtotal for each row */}
                    </tr>
                  );
                })}
                <tr className="font-weight-bold">
                  <td>Total</td>
                  <td>{totals.totalVideoSendCount}</td>
                  <td>{totals.totalVideoClickCount}</td>
                  <td>{totals.totalFeedbackSmsSent}</td>
                  <td>{totals.totalFeedbackClickCount}</td>
                  <td>{totals.totalFeedbackSmsVideoCount}</td>
                  <td>
                    {totals.totalVideoSendCount +
                      totals.totalVideoClickCount +
                      totals.totalFeedbackSmsSent +
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

export default RegionWise_report_user;
