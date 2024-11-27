import React, { useEffect, useState } from "react";
import { apiCall } from "../services/authServieces";
import { useLocation } from "react-router-dom";
import "../css/wb_template.css";
import TablePagination from "@mui/material/TablePagination";

const UserDetailspage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination: rows per page
  const [error, setError] = useState(null);

  // Extract the zone from the URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get("region");
  const columnName = queryParams.get("columnName");

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall({
        endpoint: `user/getUserDetailsRegion?page=${page + 1}&limit=${rowsPerPage}`,
        method: "post",
        payload: {
          region: region,
          columnName:columnName
        },
      });
  
      // Log the full response to debug
      console.log("API Response:", response.data);
      setData(response.data || []);  // Check if the data is in the correct structure
      setTotalPages(response.data?.length || 0); // Adjust the pagination logic if needed
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [region, page]);

  const handleChangePage = (event, newPage) => {
    console.log('newPage: ', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle pagination
  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 1) {
      setPage((prev) => prev - 1);
    } else if (direction === "next" && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="Template_id_contian1">
    <h4 className="Head_titleTemplate">User Details</h4>
    <div className="Template_id_Card1">
      <div className="table_contain" id="tableContain">
     <center> <h2>Region: {region || "All Regions"}</h2></center>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
         <table className="Table w-100" id="Table">
         <thead>
           <tr>
              <th>Region</th>
              <th>Dealer Code</th>
              <th>Video Send Count</th>
              <th>Creation Date</th>
              <th>Creation Time</th>
              {/* Add other fields as needed */}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.region}</td>
                  <td>{item.dealer_code}</td>
                  <td>{item.video_send_count}</td>
                  <td>{item.cdate}</td>
                  <td>{item.ctime}</td>
                  {/* Render other fields here as necessary */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
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

export default UserDetailspage;
