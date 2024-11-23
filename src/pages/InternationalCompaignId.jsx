import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { apiCall } from '../services/authServieces';
import ShowSnackBar from "../components/snackBar";
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';  // MUI Loader

const InternationalCompaign = () => {
  const [isTemplate, setIsTemplate] = useState([]);
  const [snackBar, setSnackBar] = useState({ open: false, severity: '', message: '' });

  // Pagination states
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // rows per page
  const [totalTemplates, setTotalTemplates] = useState(0); // total number of templates

  const [compaign, setCompaign] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const [searchTerm, setSearchTerm] = useState("");

  // Function to get templates based on compaign ID
  const getTemplates = async (page = 0, limit = 10) => {
    setLoading(true);  // Show loader before API call
    console.log(compaign, 'compaign'); // Log the compaign value

    const formData = new FormData();
    formData.append('compaign', compaign);

    try {
      const res = await apiCall({
        endpoint: `get-international-compaignId?page=${page + 1}&limit=${limit}`,
        method: 'POST',
        payload: formData
      });

      // Handle response
      if (res.data) {
        setIsTemplate(res.data); // Update templates
        setTotalTemplates(res.totalPages); // Set total number of templates for pagination
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setSnackBar({ open: true, severity: 'error', message: 'Failed to load templates' });
    } finally {
      setLoading(false);  // Hide loader after API call
    }
  };

  useEffect(() => {
    // Retrieve stored user ID from localStorage
    const storedUserid = localStorage.getItem('userid');
    if (storedUserid) {
      setCompaign(storedUserid);
      console.log('setCompaign:', storedUserid);
    }
  }, []);

  // Fetch templates when compaign changes
  useEffect(() => {
    if (compaign) {
      getTemplates(page, rowsPerPage); // Call getTemplates when compaign or pagination changes
    }
  }, [compaign, page, rowsPerPage]);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage); // Update current page
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage); // Update rows per page
    setPage(0); // Reset to first page
  };

  const handleInputChange = (e) => {
    console.log('jdvj');
    const value = e.target.value;
    setSearchTerm(value); // Update the search term
  };

  const filteredTemplates = isTemplate.filter((template) =>
    template.compaign_id.toString().includes(searchTerm) || 
    (template.bussiness_number && template.bussiness_number.toString().includes(searchTerm))
  );
  return (
    <>
      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate">View International Campaign
        <input
          placeholder="Search "
          type="text"
          className="CampaignSearch"
          value={searchTerm}  // Binds the input value to the state
          onChange={handleInputChange}  // Handles input changes
        />

        </h4>
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
                    <th>USER ID</th>
                    <th>Campaign Name</th>
                    <th>Campaign ID</th>
                    <th>Mobile No</th>
                    <th>Date</th>
                    <th>Campaign Type</th>
                    <th>Campaign Status</th>

                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                      <tr key={"Template" + index}>
                        <td>{page * rowsPerPage + index + 1}</td> {/* Adjust S_No based on page */}
                        <td>{template.created_by}</td>
                        <td>{template.template_name}</td>
                        <td>{template.compaign_id}</td>
                        <td>{template.bussiness_number}</td>
                        <td>{template.date}</td>
                        <td>{template.campaign_type}</td>
                        <td>{template.status_campaign}</td>
                        <td>{template.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">No Templates Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Table Pagination */}
            <TablePagination
              component="div"
              count={totalTemplates} // Total number of templates for pagination
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]} // Rows per page options
            />
          </div>
        </div>
      </div>

      {/* Snackbar for feedback messages */}
      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
      />
    </>
  );
};

export default InternationalCompaign;
