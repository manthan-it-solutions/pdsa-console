import React, { useEffect, useState } from "react";
import { apiCall } from "../../services/authServieces";
import { useLocation } from "react-router-dom";
import "../../css/wb_template.css";
import TablePagination from "@mui/material/TablePagination";
import excel from '../../Assets/images/excel.png'
import search from '../../Assets/images/search.png'

const DealerDetailsPageregion = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const zone = queryParams.get("zone");
  const columnName = queryParams.get("columnName");



  const [isToDateEnabled, setIsToDateEnabled] = useState(false);
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const twoMonthsAgoString = twoMonthsAgo.toISOString().split("T")[0];

  const handleFromDateChange = (e) => {
    const selectedFromDate = e.target.value;
    setFromDate(selectedFromDate);
    setIsToDateEnabled(!!selectedFromDate); 
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };


  

  // Retrieve fromdate and todate passed via state
  const stateDates = location.state || {};
  // useEffect(() => {
  //   if (stateDates.fromdate) setFromDate(stateDates.fromdate);
  //   if (stateDates.todate) setToDate(stateDates.todate);
  // }, [stateDates]);

  // Fetch all dealer details
  const fetchDealerDetails = async () => {
    setLoading(true);
    setError(null);

    
    try { 
      const response = await apiCall({
        endpoint: `admin/getDealerDetailsRegion?page=${page + 1}&limit=${rowsPerPage}`,
        method: "post",
        payload: {
          region: zone,
          columnName: columnName, // Pass the zone as a query parameter,
          fromdate: fromdate,
          todate: todate


        },
      });

      setData(response.data || []);
      console.log('response: ', response.data[0].video_send_count);
      const totalItems = response.data?.length || 0; // Total items in the response

      setTotalPages(totalItems || 0); // Calculate total pages based on data length
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };




const Getdatetodata = async () => {
    try {
      setLoading(true);
    

      fetchDealerDetails();

    } catch (error) {
      
    }finally {
      setLoading(false); 
    }
  };


  useEffect(() => {
    if (stateDates.fromdate) setFromDate(stateDates.fromdate);
    if (stateDates.todate) setToDate(stateDates.todate)
    fetchDealerDetails();
  }, [page, rowsPerPage]);


  const handleChangePage = (event, newPage) => {
    console.log('newPage: ', newPage);
    setPage(newPage);

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchDealerDetails()
  };



  // Export data to CSV
  const exportToCSV = () => {
    const header = [
      "Region",
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

    // Map rows for CSV data
    const rows = data.map((item) => [
      item.region || "Unknown",
      item.dealer_code || "-",
      item.cdate || "-",
      item.ctime || "-",
      item.dealer_name || "-",
      item.dealer_type || "-",
      item.Dealer_State || "-",
      item.Dealer_City || "-",
      item.model_name || "-",
      item.feedback_answer1 || "-",
      item.feedback_answer2 || "-",
      item.feedback_answer3 || "-",
      item.feedback_answer4 || "-",
      item.feedback_answer5 || "-",
      item.feedback_date || "-",
    ]);

    // Combine header and rows into CSV format
    const csvContent = [
      header.join(","), // Join headers with commas
      ...rows.map((row) => row.join(",")), // Map rows and join with commas
    ].join("\n"); // Separate rows with newlines

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Dealer_Details.csv"; // Set the CSV file name
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL
  };



  return (
    <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate">
        <div className="date_box date_box1 new_css">
          <input type="date" className="date_box_input" value={fromdate}
            onChange={handleFromDateChange}  min={twoMonthsAgoString} max={todayString} />
          To
          <input type="date" className="date_box_input" value={todate}
            onChange={handleToDateChange} disabled={!isToDateEnabled} min={fromdate}  max={todayString} />
<div onClick={Getdatetodata} className="sercah_icon_date"><img src={search} /></div>
        </div>


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
     
      </div> */}

Dealer Details ( Region: {zone === "total" ? "Total" : zone || "All Zones"} )
        {/* <button className="btn btn-primary p-2 " onClick={exportToCSV}>Export to CSV</button>  */}
        <div onClick={exportToCSV} className="excel_img_btn" ><img src={excel} /></div>
      </h4>
      <div className="Template_id_Card1">
        <div className="table_contain" id="tableContain">


          {/* <center> <h4>Region: {zone || "All Zones"}</h4></center> */}

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
        count={totalPages}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default DealerDetailsPageregion;
