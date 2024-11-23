import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { useNavigate } from "react-router-dom";
import { apiCall, baseURLforPAth } from '../services/authServieces';
import ShowSnackBar from "../components/snackBar";
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import eyesIcon from '../Assets/images/eye.png';
import CircularProgress from '@mui/material/CircularProgress';

const WbTemplate = () => {
  const [isTemplate, setIsTemplate] = useState([]);
  const [snackBar, setSnackBar] = useState({ open: false, severity: '', message: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileType, setFileType] = useState('');

  const navigate = useNavigate();

  const getTemplates = async () => {
    setLoading(true);
    try {
      const res = await apiCall({
        endpoint: `templates/get-templates-pagination?page=${page + 1}&limit=${rowsPerPage}`,
        method: 'GET',
      });

      if (res?.success) {
        const formattedData = res.data.map((item) => ({
          ...item,
          date_time: new Date(item.date).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        }));
        setIsTemplate(formattedData);
        setTotalTemplates(res.totalPages); // Set total count
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

  const handleImageClick = (userid) => {
    localStorage.setItem('userid', userid); 
    navigate("/NationCompaignId", { state: { userid } });
  };

  const handleImageClickView = (fileType, file_path) => {
    const file = file_path.split('/')[1];
    setSelectedFile(file_path);
    setFileType(fileType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile('');
    setFileType('');
  };

  return (
    <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate">View National Campaign</h4>
      <div className="Template_id_Card1">
        <div className="table_contain" id="tableContain">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <table className="Table w-100" id="Table">
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Campaign Id</th>
                  <th>Date</th>
                  <th>Campaign Name</th>
                  <th>File Type</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Count</th>
                  <th>View File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isTemplate.length > 0 ? (
                  isTemplate.map((template, index) => (
                    <tr key={`Template${index}`}>
                      <td>{index + 1 + page * rowsPerPage}</td>
                      <td>{template.compaign_id}</td>
                      <td>{template.date}</td>
                      <td>{template.template_name}</td>
                      <td>{template.file_type}</td>
                      <td>{template.message}</td>
                      <td>{template.status_campaign}</td>
                      <td>{template.total_count}</td>
                      <td>
  <button 
    onClick={() => {
      if (template.file_type && template.file_path) {
        handleImageClickView(template.file_type, template.file_path);
      } else {
        alert("No file available");
      }
    }}
  >
    <img src={eyesIcon} alt="View Icon" />
  </button>
</td>

                      <td>
                        <button onClick={() => handleImageClick(template.compaign_id)}>
                          <img src={eyesIcon} alt="Eyes Icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">No Templates Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <Modal open={isModalOpen} onClose={handleCloseModal} className="modal-container">
          <div id="modal-overlay" onClick={handleCloseModal}>
            <div id="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>View File</h2>
              {fileType.startsWith('image') ? (
                <img src={`${selectedFile}`} alt="Preview" />
              ) : fileType === 'application' ? (
                <embed src={`${selectedFile}`} type="application/pdf" />
              ) : fileType.startsWith('video') ? (
                <video controls>
                  <source src={`${selectedFile}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Unsupported file type</p>
              )}
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </Modal>

        <TablePagination
          component="div"
          count={totalTemplates}    // Ensure total count is set
          page={page}               // Controlled page state
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage} // Controlled rows per page
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>

      <ShowSnackBar open={snackBar.open} severity={snackBar.severity} message={snackBar.message} />
    </div>
  );
};

export default WbTemplate;
