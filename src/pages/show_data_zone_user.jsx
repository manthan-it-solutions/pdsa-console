import React, { useEffect, useState } from "react";
import { apiCall } from "../services/authServieces";
import { useLocation } from "react-router-dom";
import "../css/wb_template.css";
import TablePagination from "@mui/material/TablePagination";
import excel from '../Assets/images/excel.png'
import search from '../Assets/images/search.png'

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
      setTotalRecords(response.total || 0); // Total records from the API
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



  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Define CSV headers
    const headers = [
      "Zone",
      "Dealer Code",
      "Creation Date",
      "Creation Time",
      "Dealer Name",
      "Dealer Type",
      "Dealer State",
      "Dealer City",
      "Model Name",
      "Road Safety Tips Info",
      "Road Safety Tips Form",
      "Riding Simulator Experience",
      "Sales Experience Satisfaction",
      "Vehicle Delivery Feedback",
      "Feedback Date",
    ];

    // Map data to CSV rows
    const csvRows = data.map((item) => [
      item.zone || "",
      item.dealer_code || "",
      item.cdate || "",
      item.ctime || "",
      item.dealer_name || "",
      item.dealer_type || "",
      item.Dealer_State || "",
      item.Dealer_City || "",
      item.model_name || "",
      item.feedback_answer1 || "-",
      item.feedback_answer2 || "-",
      item.feedback_answer3 || "-",
      item.feedback_answer4 || "-",
      item.feedback_answer5 || "-",
      item.feedback_date || "-",
    ]);

    // Combine headers and rows
    const csvContent =
      [headers.join(",")]
        .concat(csvRows.map((row) => row.join(",")))
        .join("\n");

    // Create a Blob and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "dealer_details_Zone.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate">
        <div className="date_box date_box1">
          <input type="date" className="date_box_input" value={fromdate}
            onChange={(e) => setFromDate(e.target.value)} />
          To
          <input type="date" className="date_box_input" value={todate}
            onChange={(e) => setToDate(e.target.value)} />

          {/* <div onClick={Getdatetodata} className="sercah_icon_date"><img src={search} /></div> */}

        </div>
        Dealer Details
        <div onClick={exportToCSV} className="excel_img_btn" ><img src={excel} /></div>


        {/* <div className="date-filters">
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
      
      <button className="btn btn-primary p-2 " onClick={exportToCSV}>Export to CSV</button>  */}
      </h4>
      <div className="Template_id_Card1">
        <div className="table_contain" id="tableContain">
          <center>
            <h2 className="zone_f">Zone: {zone || "All zones"}</h2>

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
