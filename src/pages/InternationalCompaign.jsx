import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { useNavigate } from "react-router-dom";
import { apiCall, baseURLforPAth } from '../services/authServieces';
import ShowSnackBar from "../components/snackBar";
import Modal from '@mui/material/Modal';
import TablePagination from '@mui/material/TablePagination';
import eyesIcon from '../Assets/images/eye.png';
import CircularProgress from '@mui/material/CircularProgress';

const WbManageMedia = () => {
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

  const getTemplates = async (signal) => {
    setLoading(true);
    try {
      const res = await apiCall({
        endpoint: `get-international-compaign?page=${page + 1}&limit=${rowsPerPage}`,
        method: 'GET',
        signal,
      });

      if (res?.success) {
        const formattedData = res.data.map((item) => {
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

        setIsTemplate(formattedData || []);
        setTotalTemplates(res.totalResult); // Total number of records, not total pages
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSnackBar({
          open: true,
          severity: 'error',
          message: error?.response?.data?.message || "An error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page whenever rows per page changes
  };

  const handleImageClick = (userid) => {
    localStorage.setItem('userid', userid);
    navigate("/internationCompaign", { state: { userid } });
  };

  useEffect(() => {
    const controller = new AbortController();
    getTemplates(controller.signal);
    return () => controller.abort();
  }, [page, rowsPerPage]);

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
    <>
      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate">
          View International Campaign
        </h4>
        
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
                    <th>Compaign Id</th>
                    <th>Date</th>
                    <th>Compaign Name</th>
                    <th>FIle Type</th>
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
                      <tr key={"Template"+ index}>
                        <td>{page * rowsPerPage + index + 1}</td>
                        <td>{template.compaign_id}</td>
                        <td>{template.date_time}</td>
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
                            <img src={eyesIcon} alt="Eyes Icon" sizes="(max-width: 600px) 300px, 768px"/>
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

            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="file-modal-title"
              aria-describedby="file-modal-description"
              className="modal-container"
            >
              <div id="modal-overlay" onClick={handleCloseModal}>
                <div id="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2 id="file-modal-title">View File</h2>
                  {fileType.startsWith('image') ? (
                    <img
                      id="image-preview"
                      src={`${selectedFile}`}
                      alt="Preview"
                    />
                  ) : fileType === 'application' ? (
                    <embed
                      id="pdf-preview"
                      src={`${selectedFile}`}
                      type="application/pdf"
                    />
                  ) : fileType.startsWith('video') ? (
                    <video id="video-preview" controls>
                      <source src={`${selectedFile}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p id="unsupported-file">Unsupported file type</p>
                  )}
                  <button id="modal-close-button" onClick={handleCloseModal}>Close</button>
                </div>
              </div>
            </Modal>

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

      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
      />
    </>
  );
};

export default WbManageMedia;
