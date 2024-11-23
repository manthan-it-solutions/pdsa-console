import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { useNavigate } from "react-router-dom";
import { apiCall } from '../services/authServieces';
import ShowSnackBar from "../components/snackBar";
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';  // MUI Loader

const TrsansactionDetails = () => {
  const [isTemplate, setIsTemplate] = useState([]);  // Transaction data
  const [snackBar, setSnackBar] = useState({ open: false, severity: '', message: '' });
  const [page, setPage] = useState(0);               // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination: rows per page
  const [totalTemplates, setTotalTemplates] = useState(0); // Total number of records
  const [loading, setLoading] = useState(false);     // Loader state
  const navigate = useNavigate();

  // Function to fetch transaction data with pagination
  const getTemplates = async () => {
    setLoading(true);
    try {
      const res = await apiCall({
        endpoint: `admin/getTrsansactionDetails_data?page=${page + 1}&limit=${rowsPerPage}`,
        method: 'GET',
      });

      if (res?.success) {
        // Format the transaction data
        const formattedData = res.data.map((item, index) => {
          const date = new Date(item.date_time);
          const formattedDate = date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return {
            ...item,
            date_time: formattedDate,
          };
        });

        // Set formatted data and total record count to state
        setIsTemplate(formattedData || []);
        setTotalTemplates(res.totalCount);  // Total number of records
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: 'error',
        message: error?.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on page load and whenever page or rowsPerPage changes
  useEffect(() => {
    getTemplates();
  }, [page, rowsPerPage]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Navigate to campaign page with user ID
  const handleImageClick = (userid) => {
    localStorage.setItem('userid', userid);
    navigate("/ButtonCompaignId", { state: { userid } });
  };

  return (
    <>
      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate">View Transaction Details</h4>
        <div className="Template_id_Card1">
          <div className="table_contain" id="tableContain">
            {/* Show loader while data is loading */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CircularProgress />
              </div>
            ) : (
              <table className="Table w-100" id="Table">
                <thead>
                  <tr>
                    <th>S No</th>
                    <th>Transaction Date</th>
                   
                   
                    <th>SMS Balance</th>
                  
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {isTemplate.length > 0 ? (
                    isTemplate.map((template, index) => (
                      <tr key={"Template" + index}>
                        <td>{index + 1 + page * rowsPerPage}</td>
                       
                        <td>{template.trans_date}</td>
                        <td>{template.amount}</td>
                      
                     
                        <td>{template.type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">No Templates Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination */}
          <TablePagination
            component="div"
            count={totalTemplates}          // Total records count
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
          />
        </div>
      </div>

      {/* Snackbar for feedback messages */}
      <ShowSnackBar open={snackBar.open} severity={snackBar.severity} message={snackBar.message} />
    </>
  );
};

export default TrsansactionDetails;
