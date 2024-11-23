import React, { useRef, useState, useEffect } from 'react';
import Clear from '../Assets/images/clear.png';
import Unique from '../Assets/images/unique.png';
import Import from '../Assets/images/import.png';
import Papa from "papaparse"

import ShowSnackBar from "../components/snackBar";
// import axios from 'axios';
import { apiCall } from '../services/authServieces';

import '../css/WbCamaignsButton.css'

import WbCompaignButtonModal from '../components/WbCompaignButtonModal';
import '../css/PreviewModal.css';



const WbCamaignsButton = () => {
  const [snackBar, setSnackBar] = useState({ open: false, severity: true, message: "" });

  const [isInitialState, setIsInitialState] = useState('');
  const [contactCount, setContactCount] = useState(0);

  const [Campaign, setCampaign] = useState('');

  const [message, setmessage] = useState('');


  const [button_link, setbutton_link] = useState('');


  const [button_2, setbutton_2] = useState('');



  const [max_number, setmax_number] = useState('');


  const [isSubmitting, setIsSubmitting] = useState(false)



  const [buttonone_disp, setbuttonone_disp] = useState('');
  const fileInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false); // Loader state

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [activeTab, setActiveTab] = useState('image'); // Default tab is 'image'

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalsub, setmodalsub] = useState(false);

  // new added g
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    campaign: '',
    message: '',
    file: '',
  });
  const isFormValid = () => {
    return (
      Campaign.trim() !== '' &&
      message.trim() !== '' &&
      (imagePreview || pdfPreview || videoPreview)
    );
  };
  const handleCampaignChange = (e) => {
    setCampaign(e.target.value);
    setErrors((prev) => ({ ...prev, campaign: '' })); // Clear error on change
  };

  const handleMessageChange = (e) => {
    const trimmedValue = e.target.value.trimStart(); // Remove leading whitespace
    if (trimmedValue.length <= 1000) {
      setmessage(trimmedValue); // Update the state if within the character limit
    }
    setErrors((prev) => ({ ...prev, message: '' })); // Clear error on change
  };

  const handleInputChange = (e) => {
    const enteredVal = e.target.value;
    setIsInitialState(enteredVal); // Store the raw input

    // Split input into lines and validate numbers
    const lines = enteredVal.split('\n');
    const validNumbers = lines.filter(num => /^[6-9][0-9]{9}$/.test(num));
    const invalidNumbers = lines.filter(num => num && !/^[6-9][0-9]{9}$/.test(num));

    // Update contact count with valid numbers
    setContactCount(validNumbers.length);

    // Set error message if invalid numbers exist
    if (invalidNumbers.length > 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        numbers: 'Please enter only valid 10-digit mobile numbers starting with 6, 7, 8, or 9.'
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, numbers: '' }));
    }
  };



  const handlePreview = () => {
    const newErrors = {};

    // Validate required fields
    if (Campaign.trim() === '') {
      newErrors.campaign = 'Campaign Title is required';
    }
 
    if (!(imagePreview || pdfPreview || videoPreview)  && !message.trim() === '' ) {
      newErrors.file = 'Please upload a file (Image, PDF, or Video) OR Message ';
    }

    // Validate phone numbers
    const lines = isInitialState.split('\n');
    const validNumbers = lines.filter(num => /^[6-9][0-9]{9}$/.test(num));
    const invalidNumbers = lines.filter(num => num && !/^[6-9][0-9]{9}$/.test(num));

    if (invalidNumbers.length > 0) {
      newErrors.numbers = 'Please enter only valid 10-digit mobile numbers starting with 6, 7, 8, or 9.';
    }
    setContactCount(validNumbers.length);
    // Set errors if any
    setErrors(newErrors);

    // If no errors, proceed with preview
    if (Object.keys(newErrors).length === 0) {
      const validNumbersText = validNumbers.join('\n');
      setIsInitialState(validNumbersText);
      setShowPreviewModal(true); // Proceed with preview
    }
  };
  useEffect(() => {
    const lines = isInitialState.split('\n');
    const validNumbers = lines.filter(num => /^[6-9][0-9]{9}$/.test(num));
    setContactCount(validNumbers.length);
  }, [isInitialState]);

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setmodalsub(false);
  };

  const handleSubmitModal = async () => {
    setIsSubmitting(true);
    setShowPreviewModal(false);
    setIsSubmitting(false);
  };



  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;


    let maxSize = 0;
    if (fileType === "image") maxSize = MAX_IMAGE_SIZE;
    else if (fileType === "pdf") maxSize = MAX_PDF_SIZE;
    else if (fileType === "video") maxSize = MAX_VIDEO_SIZE;

    if (file.size > maxSize) {
      alert(`File size exceeds the limit for ${fileType}. Max allowed size is ${maxSize / 1024 / 1024} MB.`);
      if (fileType === "image") setImagePreview(null);
      else if (fileType === "pdf") setPdfPreview(null);
      else if (fileType === "video") setVideoPreview(null);
      e.target.value = null;
      return;
    }

    if (fileType === "image") {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setPdfFile(null);
      setVideoFile(null);
    } else if (fileType === "pdf") {
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
      setImageFile(null);
      setVideoFile(null);
    } else if (fileType === "video") {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setImageFile(null);
      setPdfFile(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "image") {
      setPdfPreview(null);
      setVideoPreview(null);
    } else if (tab === "pdf") {
      setImagePreview(null);
      setVideoPreview(null);
    } else if (tab === "video") {
      setImagePreview(null);
      setPdfPreview(null);
    }
  };


  // File size limits
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
  const MAX_PDF_SIZE = 1 * 1024 * 1024;   // 1 MB
  const MAX_VIDEO_SIZE = 3 * 1024 * 1024; // 3 MB




  const handleFileChange11 = (event) => {
    const fileUpload = event.target.files[0];

    if (fileUpload) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target.result;

        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            let parsedData = results.data;

            // Limit the processing to 10,000 rows
            const MAX_ROWS = 50000;
            if (parsedData.length > MAX_ROWS) {
              parsedData = parsedData.slice(0, MAX_ROWS);

              return alert(`Only the first ${MAX_ROWS} rows will be 
  processed.`);
            }

            const allNumbers = [];
            parsedData.forEach(row => {
              for (let key in row) {
                const value = row[key];
                if (value && /^\d+$/.test(value)) { // Check if the 

                  allNumbers.push(value);
                }
              }
            });


            const filteredNumbers = allNumbers.filter(num => num.length
              === 10);

            // Join numbers into a string with newline separators
            const formattedNumbers = filteredNumbers.join('\n');

            // Set the formatted numbers to the state
            setIsInitialState(formattedNumbers);

            // Update the contact count
            const newLineCount = (formattedNumbers.match(/\n/g) ||
              []).length;
            setContactCount(newLineCount + 1);
          }
        });
      };
      reader.readAsText(fileUpload);
    }
  };


  const handleClear = () => {
    setIsInitialState('');
    setContactCount(0);
  };

  useEffect(() => {
    // Call the function to fetch contact data

  }, []);

 
  const eliminateDuplicates = (arr) => {
    const obj = {};
    arr.forEach(item => {

      obj[item] = true;

    });

    return Object.keys(obj);

  };

  const handleUnique = () => {

    // Split input by newlines, eliminate duplicates, and join back
    const uniqueContacts = eliminateDuplicates(isInitialState.split('\n')).join('\n');
    setIsInitialState(uniqueContacts);

    // Update the contact count after eliminating duplicates
    const newLineCount = (uniqueContacts.match(/\n/g) || []).length;
    // setContactCount(newLineCount + 1);
    setContactCount(uniqueContacts.trim() === '' ? 0 : newLineCount + 1)
  };


  // Get Group name 

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };





  const SentData = async (e) => {
    setmodalsub(true);
    e.preventDefault();

    // Validations
    if (Campaign.trim() === "") {
      window.alert("Please Enter Campaign Title");
      setmodalsub(false);
      return;
    }



    if (isInitialState.trim() === "") {
      window.alert("Please Enter a Number");
      setmodalsub(false);
      return;
    }

    if (buttonone_disp.trim() === '') {
      window.alert("Please Enter a Button 1");
      setmodalsub(false);
      return;
    }





    // Check if no file is uploaded
    if (!imageFile && !pdfFile && !videoFile && !message.trim() === "") {
      window.alert("Please upload at least one file (Image, PDF, or Video) OR message ");
      setmodalsub(false);
      return;
    }






    // Create FormData and append data
    const campaign_type = 'campaign_button'
    // Create FormData and append data
    const formData = new FormData();
    formData.append('Campaign', Campaign);
    formData.append('message', message);
    formData.append('isInitialState', isInitialState);
    formData.append('campaign_type', campaign_type);





    formData.append('button_link', button_link);
    formData.append('button_2', button_2);
    formData.append('max_number', max_number);
    formData.append('buttonone_disp', buttonone_disp);







    // Append files only if they exist
    if (imageFile) {
      formData.append('file', imageFile);
    }
    if (pdfFile) {
      formData.append('file', pdfFile);
    }
    if (videoFile) {
      formData.append('file', videoFile);
    }

    // Log FormData for debugging
    formData.forEach((value, key) => {

    });

    try {




      setIsSubmitting(true)
      // Make the API call using your defined apiCall function
      let response = await apiCall({
        endpoint: 'api/save_wb_camaigns_button',
        method: 'POST',
        payload: formData,
      });


      // Check the response
      if (response.message === 'Data inserted successfully') {
        setSnackBar({
          open: true,
          severity: 'success',  // Set to 'success' for a successful operation
          message: 'Operation completed successfully!',  // Display the success message
        });
        resetForm();




      }

      else if (response.error === 'error') {
        alert('Insufficient balance to send the message to all contacts')

        setIsSubmitting(false)

        return


      }


      else {
        alert('File upload failed. Please try again.');

        setIsSubmitting(false)
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: error?.response?.success,
        message: error?.response?.msg || `An error occurred${error}`,
      });
      setIsSubmitting(false)
    }
  };



  const handleSendNow = async () => {
    setLoading(true); // Start loader
    try {

      const formData = new FormData();








      formData.append('message', message);


      const response = await apiCall({
        endpoint: 'api/save_wb_quick_message',
        method: 'POST',
        payload: formData
      });

      if (response?.success === true) {
        alert("Data Send Successfull")

        // setSnackBar({
        //   open: true,
        //   severity: response?.success,
        //   message: response?.msg,
        // });


        window.location.reload();
        // Clear the form or show a success message here if needed
      }

    } catch (error) {

      // // if any error in sending data
      // alert('please try again')

      setSnackBar({
        open: true,
        severity: error?.response?.success,
        message: error?.response?.msg || `An error occurred${error}`,
      });

      setLoading(false);


    } finally {

      setLoading(false);
      // window.location.reload(); // Reload the page after success or error

    }
  };





  const handleCloseSnackBar = () => {
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };



  const resetForm = () => {
    // Reset all state variables to their initial values
    setCampaign('');
    setmessage('');
    setIsInitialState('');
    setbutton_link('');
    setbutton_2('');
    setmax_number('');
    setbuttonone_disp('');
    setContactCount(0);
    setImageFile(null);
    setPdfFile(null);
    setVideoFile(null);
    setImagePreview(null);
    
    setPdfPreview(null);
    setVideoPreview(null);
    setShowPreviewModal(false);
  setmodalsub(false);
    setActiveTab('image'); // Default tab is 'image'
    setErrors({ campaign: '', message: '', file: '' });
  };
  return (
    <>
      <div className="WB_Quick_contian">
        <h4 className="Head_title">Compaign Button</h4>
        <div className="WB_Quick_Card">
          <div className="row gy-3">
            <div className="col-lg-12">
              <label htmlFor="to_numbers" className="mb-2">To Numbers <span className='required_icon'>*</span></label>

              <textarea name="numbers" rows="4" id="to_numbers" placeholder="Enter a number... You can send SMS in batches up to 50,000 at a time" value={isInitialState} onChange={handleInputChange}></textarea>
              {errors.numbers && <div className="error-message">{errors.numbers}</div>}
              <div className="List_cardQuick">
                <span>Total Contacts : <span >{contactCount}</span> </span>
                <div className="Button_list gy-4z">
                  <button className="clear_bg" onClick={handleClear}><img src={Clear} alt=" img" className="icon" />Clear</button>
                  <button className="unique_bg" onClick={handleUnique}><img src={Unique} alt=" img" className="icon" />Unique</button>
                  <button className="impoer_bg" onClick={handleImportClick}><img src={Import} alt=" img" className="icon" />Import</button>
                </div>
              </div>
            </div>

          </div>
          <div className="row gy-3">
            <div className="col-lg-12">
              <div className="form_group1 form_groupInput">
                <label htmlFor="title">Campaign Title <span className='required_icon'>*</span></label>
                <input type="text" placeholder="Enter Campaign Title" value={Campaign} onChange={e => setCampaign(e.target.value)} id="title" />
                {errors.campaign && <div className="error-message">{errors.campaign}</div>}</div>
            </div>

            <div className="mt-3">
              <nav className="upload-tab mt-3">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className={`nav-link ${activeTab === "image" ? "active" : ""
                      }`}
                    onClick={() => handleTabChange("image")}
                  >
                    Image
                  </button>
                  <button
                    className={`nav-link ${activeTab === "pdf" ? "active" : ""
                      }`}
                    onClick={() => handleTabChange("pdf")}
                  >
                    PDF
                  </button>
                  <button
                    className={`nav-link ${activeTab === "video" ? "active" : ""
                      }`}
                    onClick={() => handleTabChange("video")}
                  >
                    Video
                  </button>
                </div>
              </nav>

              <div className="tab-content mt-3" id="nav-tabContent">
                {/* Image Upload Tab */}
                <div
                  className={`tab-pane fade ${activeTab === "image" ? "active show" : ""
                    }`}
                >
                  <div className="imageupload panel panel-default">
                    <h3>
                      Upload Image{" "}
                      <span className="imag_style">(Max Size 1 MB)</span>
                    </h3>
                    <input
                      className="input_upload"
                      type="file"
                      onChange={(e) => handleFileChange(e, "image")}
                      accept="image/gif, image/jpeg"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}

                        alt=" Preview"
                        className="preview pre_v_img"
                      />
                    )}
                  </div>
                </div>

                {/* PDF Upload Tab */}
                <div
                  className={`tab-pane fade ${activeTab === "pdf" ? "active show" : ""
                    }`}
                >
                  <div className="imageupload panel panel-default">
                    <h3>
                      Upload PDF{" "}
                      <span className="imag_style">(Max Size 1 MB)</span>
                    </h3>
                    <input
                      className="input_upload"
                      type="file"
                      onChange={(e) => handleFileChange(e, "pdf")}
                      accept="application/pdf"
                    />
                    {pdfPreview && (
                      <iframe
                        src={pdfPreview}
                        title="PDF Preview"
                        className="preview pre_v_img"
                      />
                    )}
                  </div>
                </div>

                {/* Video Upload Tab */}
                <div
                  className={`tab-pane fade ${activeTab === "video" ? "active show" : ""
                    }`}
                >
                  <div className="imageupload panel panel-default">
                    <h3>
                      Upload Video{" "}
                      <span className="imag_style">(Max Size 3 MB)</span>
                    </h3>
                    <input
                      className="input_upload"
                      type="file"
                      onChange={(e) => handleFileChange(e, "video")}
                      accept="video/*"
                    />
                    {videoPreview && (
                      <video
                        controls
                        src={videoPreview}
                        className="preview pre_v_img"
                      />
                    )}
                  </div>
                </div>
              </div>
              {errors.file && <div className="error-message">{errors.file}</div>}
            </div>


            <div className="col-lg-12">
              <div className="form_group1 form_groupInput">
                <label htmlFor="message">Message <span className='required_icon'>*</span></label>
                <textarea
                  name="message"
                  value={message}
                  onChange={handleMessageChange}
                  id="message"
                  rows="5"
                  placeholder="Type your text message here (up to max 1000 characters) or choose from favorites"
                  maxLength="1000" // Sets a hard limit of 1000 characters
                ></textarea>
                {errors.message && <div className="error-message cout_mes">{errors.message}</div>}
              </div>
              <div className="char-count">{1000 - message.length} characters remaining</div>
            </div>
            <li class="row mt-3">
              <div class="col-md-6">
                <div class="form-group">
                  <input type="text" value={buttonone_disp} onChange={e => setbuttonone_disp(e.target.value)} name="buttonone_disp" id="buttonone_disp" placeholder="Button 1 Display Text" className="form-control" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <input type="number" value={max_number} onChange={e => setmax_number(e.target.value)} name="max_number" id="max_number" placeholder="Max 12 Digit Number Allow" className="form-control" />
                </div>
              </div>
            </li>
            <li class="row mt-3">
              <div class="col-md-6">
                <div class="form-group">
                  <input type="text" value={button_2} onChange={e => setbutton_2(e.target.value)} name="buttontwo_disp" id="buttontwo_disp" placeholder="Button 2 Display Text" className="form-control" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <input type="text" value={button_link} onChange={e => setbutton_link(e.target.value)} name="button_link" id="button_link" placeholder="https://example.com" className="form-control" />
                </div>
              </div>
            </li>


            <div className="col-12">
              <div className="form_group1 mt-0 text-center">
                {/* <button type="button" data-bs-toggle="modal" data-bs-target="#Sms_privew_modal" >Send SMS</button> */}
                {/* <button type="button" onClick={SentData}   disabled={isSubmitting} > {isSubmitting ? 'Submitting...' : 'Submit'}</button> */}
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="Sms_privew_modal" aria-hidden={!showModal}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="Sms_privew_modal">SMS Preview</h5>
                  <button type="button" className={`btn-close ${loading ? 'd-none' : ''}`} onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <table className="Modal_table">
                    <thead>
                      <tr>
                        <th>Mobile</th>
                        <th>Message</th>
                        <th>Length</th>
                      </tr>
                    </thead>
                    <tbody>

                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-center">
                          Total Contact: <span></span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>


                  <div className="form_group1 mt-0 text-center">
                    <button type="button" onClick={handleSendNow} disabled={loading} className={loading ? 'd-none' : ''}>
                      {loading ? 'Sending...' : 'Send Now'}
                    </button>
                    <button type="button" className={loading ? '' : 'd-none'} disabled={loading}>
                      {loading ? 'Sending... ' : ''}
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className='d-none'
        onChange={handleFileChange11}
        accept='.csv'
      />



      <WbCompaignButtonModal
        isOpen={showPreviewModal}
        data={{ isInitialState, message, imageFile, pdfFile, videoFile, contactCount }}
        onClose={handleCloseModal}
        onSubmit={SentData}
        submival={modalsub}
      />

      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={handleCloseSnackBar}
      />
    </>
  )

}
export default WbCamaignsButton