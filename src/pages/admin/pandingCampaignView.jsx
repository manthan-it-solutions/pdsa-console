import React, { useEffect, useState } from "react";
import "../../css/pandingCampaignView.css";
import { apiCall ,baseURLforPAth} from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import { TablePagination } from "@mui/material";
import eyesIcon from "../../Assets/images/eye.png";
import CircularProgress from '@mui/material/CircularProgress';  // MUI Loader



const PandingCampaign = () => {
  const [isTemplate, setIsTemplate] = useState([]);
 
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen222222, setModalOpen222222] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Accepted"); // Default status
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpload, setstatusUpload] = useState('Process'); // Default status
  const [UploadFIle, setUploadFIle] = useState(""); // Default statusz



  

  useEffect(() => {
    getTemplates();
  }, [page,rowsPerPage]);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTemplates = async () => {
    
    setLoading(true)
 
    try {
      const res = await apiCall({
        endpoint: `admin/get-panding-compaign-view?page=${page + 1}&limit=${rowsPerPage}`,
        method: "GET",
      });

      if (res?.success) {
        const formattedData = res.data.map((item) => {
          const date = new Date(item.date_time);
          const formattedDate = date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return {
            ...item,
            date_time: formattedDate,
          };
        });

        setIsTemplate(formattedData || []);
        setTotalTemplates(res.totalResult);
        
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    }finally{
      setLoading(false)
    }
  };

  const handleImageClick = async (compaign_id) => {
    try {
      setLoading(true);
      const res = await apiCall({
        endpoint: `admin/get-Pendingcompaign-data/${compaign_id}`,
        method: "GET",
      });

      if (res?.success) {


        const formattedData = res.data.map((item) => ({
          
          bussiness_number: item.bussiness_number,
          template_name: item.template_name,
          message: item.message,
          total_count: item.total_count,
          button_1: item.button_1,
          button2: item.button2,
          button1_value: item.button1_value,
          button2_value: item.button2_value,
          file_type: item.file_type,
          file_path: item.file_path,
          date_time: item.date,
          created_by : item.created_by ,
          campaign_type :item.campaign_type ,
          compaign_id: item.compaign_id, // Add compaign_id to the formatted data
        }));

        const allBusinessNumbers = formattedData
          .map((item) => item.bussiness_number)
          .join(" ");
        

        setSelectedTemplate({ ...formattedData[0], allBusinessNumbers });
     
        setIsModalOpen(true);
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Failed to load campaign data",
        });
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
   
  };

  const handleSave = async () => {
    console.log(selectedTemplate,'selectedTemplateselectedTemplateselectedTemplate');
    try {
      const payload = {
        compaign_id: selectedTemplate.compaign_id,
        created_by: selectedTemplate.created_by,
        campaign_type: selectedTemplate.campaign_type,
        total_count:selectedTemplate.total_count,
        status: status,
        // You can include other fields from selectedTemplate if needed
      };
 

    
      const res = await apiCall({
        endpoint: `admin/update-compaign/${selectedTemplate.compaign_id}`,
        method: "POST",
        payload: payload,
      });

      if (res?.success) {
        setSnackBar({
          open: true,
          severity: "success",
          message: "Campaign updated successfully",
          autoHideDuration: 3000, // Set duration in milliseconds (3000ms = 3 seconds)
          
        });
        getTemplates()
        setIsModalOpen(false); // Close the modal
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Failed to update campaign",
        });
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    }
  };



  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!"); // Show success message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };


  const downloadFile = async (filePath) => {
    console.log('filePath: ', filePath);
   
    try {
      const fileName = filePath.split("/").pop();
      console.log('fileName: ', fileName);
      const response = await fetch(filePath);
      console.log('response: ', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleEditClick = (compaign_id) => {
    // Set the selected template based on the campaign id
    const template = isTemplate.find(t => t.compaign_id === compaign_id); // Assuming isTemplate has the full template object
    setSelectedTemplate(template);
    
    setModalOpen222222(true);
   
};

// Function to handle modal close
const handleModalClose1111 = () => {
    setModalOpen222222(false);
    setSelectedTemplate(null); // Reset selected template
};

// Function to handle saving the data
const handleSave111 = async () => {
  try {
    const campaign_id = selectedTemplate.compaign_id;
    

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('campaign_id', campaign_id);
    formData.append('statusUpload', statusUpload);
    if (UploadFIle) {
      formData.append('UploadFIle', UploadFIle); // Use the correct variable name here
    }

    if(!UploadFIle){
     return alert('Please Upload A File')
    }

    const res = await apiCall({
      endpoint: `admin/upload_file_status`,
      method: "post",
      payload: formData,
      headers: {
        'Content-Type': 'multipart/form-data' // Set the correct content type
      }
    });

    if (res?.success) {
      setSnackBar({
        open: true,
        severity: "success",
        message: "Campaign updated successfully",
      });
      handleModalClose();
    
    } else {
      setSnackBar({
        open: true,
        severity: "error",
        message: "Failed to update campaign",
      });
    }
  } catch (error) {
    setSnackBar({
      open: true,
      severity: "error",
      message: error?.response?.data?.message || "An error occurred",
    });
  }
};

// Handle input change
const handleInputChange = (e) => {
 
  const value = e.target.value;
  setSearchTerm(value); // Update the search term
};

const filteredTemplates = isTemplate.filter((template) =>
  template.created_by.toString().includes(searchTerm) || 
  (template.mobile_no && template.mobile_no.toString().includes(searchTerm))
);

  

  return (
    <>
      <div className="Template_id_contian1">
        <h4 className="Head_titleTemplate Campaign_titl">View Pending Campaign
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
                  <th>Campaign Id</th>
                  <th>User Id</th>
                  <th>Date</th>
                  <th>Campaign Name</th>
                  <th>Campaign Type</th>
                  <th>Message</th>
                  <th>Count</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                      <tr key={"Template" + index}>
                          <td>{page * rowsPerPage + index + 1}</td> {/* Adjust S_No based on page */}
                        <td>{template.compaign_id}</td>
                        <td>{template.created_by}</td>
                        <td>{template.date}</td>
                        <td>{template.template_name}</td>
                        <td>{template.campaign_type}</td>
                        <td>{template.message}</td>
                        <td>{template.total_count}</td>
                        <td>{template.status_campaign}</td>
                        <td>
                        <button
                          onClick={() => handleImageClick(template.compaign_id)}
                        >
                          <img
                            src={eyesIcon}
                            alt="Eyes Icon"
                            sizes="(max-width: 600px) 300px, 768px"
                          />
                        </button>

                        {template.status_campaign ==='Process' && (  // Conditional rendering for the Edit button
                        <button className="ms-3" onClick={() => handleEditClick(template.compaign_id)}>
                            Edit
                        </button>
                    )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">
                      No Templates Found
                    </td>
                  </tr>
                )}
              </tbody>

              
            </table>

              )}
          </div>

        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTemplate && (
        <div className="modal-overlay camping_form pading_camp">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title m_title">Campaign Details</h4>
            </div>
            <div className="form-container f_container_camp">
              <div className="form-row row_camping">
                <div className="form-row">
                  <div className="form-group">
                    <label>Campaign Id:</label>
                    <input
                      type="text"
                      value={selectedTemplate.compaign_id}
                      readOnly
                    />
                    <button
                      className="ms-3"
                      onClick={() =>
                        copyToClipboard(selectedTemplate.compaign_id)
                      }
                    >
                      Copy
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Campaign Name:</label>
                    <input
                      type="text"
                      value={selectedTemplate.template_name}
                      readOnly
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(selectedTemplate.template_name)
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Numbers:</label>
                    <textarea
                      className="text_area Business_area"
                      value={selectedTemplate.allBusinessNumbers}

                      readOnly
                    />
                    <button
                      className="copy_form_btn"
                      onClick={() =>
                        copyToClipboard(selectedTemplate.allBusinessNumbers)
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Message:</label>
                    <textarea
                      type="text"
                      className="text_area"
                      value={selectedTemplate.message}
                      readOnly
                    ></textarea>
                    <button
                      className="copy_form_btn"
                      onClick={() => copyToClipboard(selectedTemplate.message)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  

                <div className="form-group">
                    <label>Button 2 Text:</label>
                    <input
                      type="text"
                      value={selectedTemplate.button2}
                      readOnly
                    />
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.button2)}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="text"
                      value={selectedTemplate.date_time}
                      readOnly
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(selectedTemplate.date_time)
                      }
                    >
                      Copy
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Button 1 Text:</label>
                    <input
                      type="text"
                      value={selectedTemplate.button_1}
                      readOnly
                    />
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.button_1)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="form-row">
               


                  <div className="form-group">
                    <label>Number:</label>
                    <input
                      type="text"
                      value={selectedTemplate.button1_value}
                      readOnly
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedTemplate.button1_value || "not find image"
                        )
                      }
                    >
                      Copy
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Button Link:</label>
                    <input
                      type="text"
                      value={selectedTemplate.button2_value}
                      readOnly
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(selectedTemplate.button2_value)
                      }
                    >
                      Copy
                    </button>
                  </div>

                  <div className="form-group imag_group_form">
                    <label>Status:</label>
                    <select
                      className="select_option"

                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Process">Process</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-row">
              <div className="form-group imag_group_form">
                  <label>File:</label>
                  {selectedTemplate.file_type === "image" ? (
                    <div className="image_btn_f">
                      <img
                        src={`${selectedTemplate.file_path}`}
                        alt="Uploaded Image"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <button
                        className="btn_image_dow"
                        onClick={() =>
                          downloadFile(`${selectedTemplate.file_path}`)
                        }
                      >
                        Download Image
                      </button>
                    </div>



                  ) : selectedTemplate.file_type === "application" ? (
                    <>
                      <div className="image_btn_f">
                        <p><input type="button" value={selectedTemplate.file_path} /></p>
                        <button
                          className="btn_image_dow"
                          onClick={() =>
                            downloadFile(
                              `${selectedTemplate.file_path}`
                            )
                          }
                        >
                          Download PDF
                        </button>

                      </div>

                    </>

                  ) : selectedTemplate.file_type === "video" ? (
                    <>

                      <div className="image_btn_f">
                        <video width="320" height="240" controls>
                          <source
                            src={`${selectedTemplate.file_path}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <button
                          className="btn_image_dow"
                          onClick={() =>
                            downloadFile(
                              `${selectedTemplate.file_path}`
                            )
                          }
                        >
                          Download Video
                        </button>

                      </div>
                    </>
                  ) : (
                    <p>No file uploaded</p>
                  )}


                </div>
              </div>
              <div className="sav_close_btn">
                <button
                  className="save-button btn btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button className="btn btn-danger" onClick={handleModalClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}





         {/* Modal */}
         {isModalOpen222222 && selectedTemplate && (
        <div className="modal-overlay camping_form pading_camp">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title m_title">Campaign Details</h4>
            </div>
            <div className="form-container f_container_camp">
              <div className="form-row row_camping">
                <div className="form-group">
                  <label>Campaign Id:</label>
                  <input
                    type="text"
                    value={selectedTemplate.compaign_id}
                    readOnly
                  />
                  <button
                    className="ms-3"
                    onClick={() =>
                      copyToClipboard(selectedTemplate.compaign_id)
                    }
                  >
                    Copy
                  </button>
                </div>
 
              </div>


              <div className="form-row row_camping">
                <div className="form-group">
                  <label>Upload File:</label>
              


<input
  type="file" 
  accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv, text/csv"
  onChange={(e) => setUploadFIle(e.target.files[0])}
/>

                  <button
                    className="ms-3"
                    onClick={() =>
                      copyToClipboard(selectedTemplate.compaign_id)
                    }
                  >
                    Copy
                  </button>
                </div>
 
              </div>
              <div className="form-row">
             
                <div className="form-group imag_group_form">
                  <label>Status:</label>
                  <select
                    className="select_option"
                    
                    onChange={(e) => setstatusUpload(e.target.value)}
                  >
                    <option value="Process">Process</option>
                    <option value="Send">Send</option>
                  </select>
                </div>
              </div>
              <div className="sav_close_btn">
                <button
                  className="save-button btn btn-primary"
                  onClick={handleSave111}
                >
                  Save
                </button>
                <button className="btn btn-danger" onClick={handleModalClose1111}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


<TablePagination
          component="div"
          count={totalTemplates}    // Ensure total count is set
          page={page}               // Controlled page state
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage} // Controlled rows per page
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        handleClose={() => setSnackBar({ ...snackBar, open: false })}
      />
    </>
  );
};

export default PandingCampaign;
