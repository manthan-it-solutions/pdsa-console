

import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { useNavigate } from "react-router-dom";

import { apiCall,baseURLforPAth } from '../services/authServieces';
import ShowSnackBar from "../components/snackBar";
import Modal from '@mui/material/Modal';  // Import Modal from MUI
import TablePagination from '@mui/material/TablePagination';
import eyesIcon from '../Assets/images/eye.png'
import CircularProgress from '@mui/material/CircularProgress';  // MUI Loader





const ButtonCompaign = () => {
  const [isTemplate, setIsTemplate] = useState([]);
 
  const [snackBar, setSnackBar] = useState({ open: false, severity: '', message: '' });

  

  const [page, setPage] = useState(0); // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Pagination: rows per page
  const [totalTemplates, setTotalTemplates] = useState(0); // Total number of templates
  const [loading, setLoading] = useState(false); // Loader state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedFile, setSelectedFile] = useState(''); // File preview URL
  const [fileType, setFileType] = useState(''); // File type
  

 


  const getTemplates = async () => {
    setLoading(true)
    try {
      const res = await apiCall({
        endpoint: `groups/getButton_compaign?page=${page + 1}&limit=${rowsPerPage}`,
        method: 'GET',
      });
  
      if (res?.success) {
        // Format the template data
        const formattedData = res.data.map(item => {
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
            date_time: formattedDate, // Format date for display
          };
        });
  
        // Set formatted data to state
        setIsTemplate(formattedData || []);
  
        // Set the total template count from response to state
        setTotalTemplates(res.totalPages);
  
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: 'error',
        message: error?.response?.data?.message || "An error occurred",
      });
    }
    finally {
      setLoading(false);  // Hide loader after API call
    }
  };


  useEffect(() => {
  
    

    getTemplates();
  }, [page, rowsPerPage]); // Re-fetch data on page or rowsPerPage change

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };




    const navigate = useNavigate();

    const handleImageClick = (userid) => {
       
        localStorage.setItem('userid', userid); 
        navigate("/ButtonCompaignId", { state: { userid } });
    };



    const handleImageClickView = (fileType, file_path) => {
      const file = file_path.split('/')[1]
   
      setSelectedFile(file_path); // Set the file URL
      setFileType(fileType); // Set the file type
      setIsModalOpen(true); // Open the modal
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
        View  Button Compaign
         
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
                  <th>Compaign Id</th>
                  <th>Date</th>
                  <th>Compaign Name</th>
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

                   
                    <tr key={"Template"+ index}>
                      <td>{index + 1}</td>


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
                      <button
           
              onClick={() => handleImageClick(template.compaign_id) } // Pass the usr_id on click
            >
    <img 
      src={eyesIcon} 
      alt="Eyes Icon" 
      sizes="(max-width: 600px) 300px, 768px"
    />
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
            {/* Delete confirmation dialog */}
                    
          </div>




             
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="file-modal-title"
            aria-describedby="file-modal-description"
            className="modal-container"
          >
            {/* <div className="modal-content">
              <h2 id="file-modal-title">View File</h2>
              {fileType.startsWith('image') ? (
                <img src={`http://localhost:8000/static/uploads/${selectedFile}`} alt="Image Preview" className="file-preview"  height={300} width={300} />
              ) : fileType === 'application' ? (
                <embed src={`http://localhost:8000/static/uploads/${selectedFile}`} type="application/pdf" width="300px" height="300px" className="file-preview" />
              ) : fileType.startsWith('video') ? (
                <video width="320" height="240" controls>
                <source
                  src={`http://localhost:8000/static/uploads/${selectedFile}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              ) : (
                <p>Unsupported file type</p>
              )}
              <button onClick={handleCloseModal} className="modal-close-button">Close</button>
            </div> */}



<div id="modal-overlay" onClick={handleCloseModal}>
  <div id="modal-content" onClick={(e) => e.stopPropagation()}>
    <h2 id="file-modal-title">View File</h2>
    {fileType.startsWith('image') ? (
      <img
        id="image-preview"
        src={`${selectedFile}`}
        alt="Image Preview"
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

          {/* Table Pagination */}
          <TablePagination
            component="div"
            count={totalTemplates}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]} // Define rows per page options
          />
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

export default ButtonCompaign;

