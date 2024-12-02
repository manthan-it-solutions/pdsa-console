import React, { useEffect, useState } from "react";
import { apiCall } from "../services/authServieces";
import { useLocation } from "react-router-dom";
import "../css/wb_template.css";
import TablePagination from "@mui/material/TablePagination";

const UserDetailspage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Adjust to 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Items per page
  const [totalRecords, setTotalRecords] = useState(0); // Total records
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");

  // Extract region and columnName from URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get("region");
  const columnName = queryParams.get("columnName");

  // Retrieve `fromdate` and `todate` passed via state
  const stateDates = location.state || {};
  useEffect(() => {
    if (stateDates.fromdate) setFromDate(stateDates.fromdate);
    if (stateDates.todate) setToDate(stateDates.todate);
  }, [stateDates]);

  // Fetch user details
  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall({
        endpoint: `user/getUserDetailsRegion?page=${page + 1}&limit=${rowsPerPage}`,
        method: "post",
        payload: {
          region: region || "",
          columnName: columnName || "",
          fromdate: fromdate || null,
          todate: todate || null,
        },
      });

      // Debugging: log the response
      console.log("API Response:", response);

      // Update data, total records, and error handling
      setData(response.data || []); // Update the records
      setTotalRecords(response.data.totalCount || 0); // Total number of records
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever filters, page, or rowsPerPage change
  useEffect(() => {
    fetchUserDetails();
  }, [region, page, rowsPerPage, fromdate, todate]);

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate">
        Dealer Details
        <div className="date-filters">
          <label>
            From Date:
            <input
              type="date"
              value={fromdate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label>
            To Date:
            <input
              type="date"
              value={todate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
        </div>
      </h4>
      <div className="Template_id_Card1">
        <div className="table_contain" id="tableContain">
          <center>
            <h2>Region: {region || "All Regions"}</h2>
          </center>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <table className="Table w-100" id="Table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Dealer Code</th>
                  <th>Creation Date</th>
                  <th>Creation Time</th>
                  <th>Dealer Name</th>
                  <th>Dealer Type</th>
                  <th>Dealer State</th>
                  <th>Dealer City</th>
                  <th>Model Name</th>
                  <th>Road Safety Tips Info</th>
                  <th>Road Safety Tips Form</th>
                  <th>Riding Simulator Experience</th>
                  <th>Sales Experience Satisfaction</th>
                  <th>Vehicle Delivery Feedback</th>
                  <th>Feedback Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.region}</td>
                      <td>{item.dealer_code}</td>
                      <td>{item.cdate}</td>
                      <td>{item.ctime}</td>
                      <td>{item.dealer_name}</td>
                      <td>{item.dealer_type}</td>
                      <td>{item.Dealer_State}</td>
                      <td>{item.Dealer_City}</td>
                      <td>{item.model_name}</td>
                      <td>{item.feedback_answer1 || "-"}</td>
                      <td>{item.feedback_answer2 || "-"}</td>
                      <td>{item.feedback_answer3 || "-"}</td>
                      <td>{item.feedback_answer4 || "-"}</td>
                      <td>{item.feedback_answer5 || "-"}</td>
                      <td>{item.feedback_date || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <TablePagination
        component="div"
        count={totalRecords} // Total records for pagination
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default UserDetailspage;
