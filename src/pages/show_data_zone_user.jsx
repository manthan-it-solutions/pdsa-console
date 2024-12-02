import React, { useEffect, useState } from "react";
import { apiCall } from "../services/authServieces";
import { useLocation } from "react-router-dom";
import "../css/wb_template.css";
import TablePagination from "@mui/material/TablePagination";

const UserDetailsZonePage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // 0-based index for Material UI pagination
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");

  // Extract the zone and columnName from the URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const zone = queryParams.get("zone");
  const columnName = queryParams.get("columnName");

  // Retrieve `fromdate` and `todate` passed via state
  const stateDates = location.state || {};
  useEffect(() => {
    if (stateDates.fromdate) setFromDate(stateDates.fromdate);
    if (stateDates.todate) setToDate(stateDates.todate);
  }, [stateDates]);

  // Fetch user details based on filters and pagination
  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall({
        endpoint: `user/getUserDetailsZone?page=${page + 1}&limit=${limit}`, // Page is 1-based for API
        method: "post",
        payload: {
          zone: zone || "",
          columnName: columnName || "",
          fromdate: fromdate || null,
          todate: todate || null,
        },
      });

      // Assuming the API response has data and totalCount
      setData(response.data || []);
      setTotalRecords(response.totalCount || 0); // Total records from the API
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [zone, columnName, page, limit, fromdate, todate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
  };

  return (
    <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate">
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
      
        
        User Details</h4>
      <div className="Template_id_Card1">
        <div className="table_contain" id="tableContain">
          <center>
            <h2>Zone: {zone || "All zones"}</h2>
          
          </center>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <table className="Table w-100" id="Table">
              <thead>
                <tr>
                  <th>Zone</th>
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
                      <td>{item.zone}</td>
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
                    <td colSpan="15">No data available</td>
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
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default UserDetailsZonePage;
