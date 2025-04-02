import { IconButton } from "@mui/material";
import { CheckBox, Visibility, VisibilityOff } from "@mui/icons-material";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import Plus from "../../Assets/images/plus.png";
import React, { useState, useEffect } from "react";
import "../../css/wb_manage_dealer.css";
import {
  AddUser,
  deleteDealers,
  // GetPinnacleUser,
  UpdateUser,UpdateZone,
} from "../../services/manageDealerService";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import AlertDialog from "../../components/ConfirmDialog";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { getRandomNum } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const WbManageDealer = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenZone, setIsAddModalOpenZone] = useState(false);
  const [showCheck, setShowCheck] = useState(true);
  const [showWhatsappField, setShowWhatsappField] = useState(false);
  // const [showCheckApi, setShowCheckApi] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [user_id, setuser_id] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = React.useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [update, setUpdate] = useState(false);
  const [zone, setzone] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [selectedValue, setSelectedValue] = useState('');


  const openDialog = (title, description) => {
    setDialogTitle(title);
    setDialogDescription(description);
    setOpen(true);
  };



  const [formValues, setFormValues] = useState({
    user_code: "",
    name: "",
    email_id: "",
    mobile: "",
    password: "",
    emp_code: "",
    designation:"",
    region: [],  // Ensure it's an array
    zone: [],    // Ensure it's an array
    
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const columns = [
   
    { id: "user_id", label: "User ID" },
    { id: "name", label: "User Name" },
    { id: "email_id", label: "Email Id" },
    { id: "mobile", label: "User Mobile No." },
    { id: "emp_code", label: "Emp Code" },
    { id: "cdate", label: "Created Date" },

     { id: "department", label: "Designation" },
    // { id: "location", label: "Location" },
    // { id: "city", label: "City" },
    // { id: "state", label: "State" },
    // { id: "zone", label: "Zone" },
    // { id: "status", label: "Status" },
    { id: "action", label: "Action" },
  ];

  // const handleEditModalToggle = () => setIsEditModalOpen(!isEditModalOpen);
  const handleAddModalToggle = () => {
    setShowCheck(true);
    setUpdate(false);
    setFormValues({});
    setuser_id(false);
    const randomDealerCode = getRandomNum();
    setFormValues((prevValues) => ({
      ...prevValues,
      designation:'',
      user_id: randomDealerCode.toString(),
    }));
    setUpdate(false);
    setFormErrors({});
    setIsAddModalOpen(!isAddModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log();
    if (name == "username") {
      setuser_id(false);
      setShowCheck(true);
    }

 
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const handleSelectChange = (e) => {
    const selectedStatus = e.target.value;
    setFormValues({
      ...formValues,
      designation: selectedStatus, // Update the status directly in formValues
    });
  };

  const togglePasswordVisibility = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up
    e.preventDefault(); // Prevent the default action
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };

  const validateForm = () => {
   
    const errors = {};
    if (!formValues.user_id) errors.user_id = "Dealer Code is required";
    if (!formValues.name) errors.name = "User Name is required";
    if (!formValues.password) errors.password = "Password is required";
    if (!formValues.email_id) errors.email_id = "Email ID is required";
    if (!formValues.mobile) errors.mobile = "Mobile No. is required";
    if (!formValues.emp_code) errors.emp_code = "Emp code is required";
    if (!formValues.designation) errors.status = "Designation is required";

    if (!update) {
      if (!formValues.password) errors.password = "Password is required";
    }
    setFormErrors(errors, Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  const handleChangePage = async (event, newPage) => {
    const updatedPage = newPage + 1;
    await fetchUsers(updatedPage, rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    await fetchUsers(page, parseInt(event.target.value));
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleConfirm = async () => {
    await deleteDealer(selectedRow?.id);
  };





  // Example cancel action
  const handleCancel = () => {
    console.log("Rejected");
  };

  const handleMenuAction = async (action) => {
    if (action === "delete") {
      openDialog(
        "Delete Confirmation",
        "Are you sure you want to delete this item?"
      );
    }

    if (action === "manage-waba") {
      navigate("/admin/manage-waba", { state: { selectedRow } });
    }

    if (action === "edit") {

      
      setFormValues((prevValues) => ({
        ...prevValues,
        user_id: "",
        designation:''
        ,
      }));
      setShowCheck(false);
      setUpdate(true);
      patchValues(selectedRow);
      setIsAddModalOpen(true);
      handleClose();
    }


   
      if (action === "zone") {
        setFormValues(selectedRow);
       
        try {
          const user_id = selectedRow.user_id;
    
          if (!user_id) {
            console.error("User ID is not defined.");
            return; // Exit the function if user_id is not available
          }
    
          // API call to fetch zone and region data
          const response = await apiCall({
            endpoint: 'admin/get_zone_data',
            method: 'POST',
            payload: { user_id }
          });
    
          // Handle the response data
          if (response.data && response.data.length > 0) {
            const { location, region_name } = response.data[0];
    
            // Split comma-separated strings into arrays
            const zoneArray = location ? location.split(',').map((item) => item.trim()) : [];
            const regionArray = region_name ? region_name.split(',').map((item) => item.trim()) : [];
   
          
      
         
            // Update form values with the fetched and processed data
            setFormValues((prevValues) => ({
              ...prevValues,
              zone: zoneArray, // Pre-select the zones
              region: regionArray, // Pre-select the regions
            }));
          } else {
            console.error("No data received from the API or response is empty.");
          }
    
          // Proceed to update other states
          setShowCheck(false);
          setzone(true);
    
          // Open the zone modal to allow users to add or edit zone data
          setIsAddModalOpenZone(true);
    
        } catch (error) {
          console.error("Error fetching zone data:", error);
        }
    
        // Close the modal or other necessary steps after the operation
        handleClose();
      }
    
    
    
    };
    

  const modalClose = () => {
    setUpdate(false);
    setShowCheck(true);
    setFormErrors({});
    setFormValues({});
    setIsAddModalOpen(!isAddModalOpen);
    setIsAddModalOpenZone(false);
  };



  const modalClosezone = () => {
    setzone(false);
    setIsAddModalOpenZone(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setSelectedRow(null);
  };

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      const res = await apiCall({
        endpoint: `admin/get-users?page=${page}&limit=${limit}`,
        method: "GET",
      });
      if (res?.success) {
        setRows(res?.data || []);
        setCount(res?.total);
      }
    } catch (err) {
      setSnackBar({
        open: true,
        severity: false,
        message: err?.response?.data?.message || "An error occurred",
      });
    }
  };

  const getDealer = async (user_id) => {
    try {
      const res = await apiCall({
        endpoint: `admin/get-dealer/${user_id}`,
        method: "GET",
      });
      
      if (res?.message) {
        setuser_id(true);
        return res?.data;

      
      }
    } catch (err) {
    
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        user_id: "User Id Already exists",
      }));
      setShowCheck(false);
     
    }
  };

  const deleteDealer = async (user_id) => {
    const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
    await deleteDealers(user_id, showSnackBar);
    const newRows = rows.filter((el) => el.id !== user_id);
    setCount(newRows.length);
    setRows(newRows);
  };

  useEffect(() => {
    console.log('Testing Ramkesh')
    fetchUsers();
  }, []);


  

  const handleSubmit = async (e) => {
    
    e.preventDefault();
   
    if (validateForm()) {
      console.log('111111111');
      let res = "";
      const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
      if (update) {
        res = await UpdateUser(selectedRow?.id, formValues, showSnackBar);
        if (res?.message) {
          setIsAddModalOpenZone(false);
        
        }

      }

   
      else {

        res = await AddUser(formValues, showSnackBar);
        console.log('res: ', res);
      }
      if (res?.message) {
        setIsAddModalOpen(false);
        setFormErrors({});
        setFormValues({});
        await fetchUsers();
      }
    }
  };
  const patchValues = (data) => {
    if (data) {
      setFormValues({
        user_id: data.user_id || formValues.user_id,
        name: data.name || formValues.name,
        email_id: data.email_id || formValues.email_id,
        mobile: data.mobile || formValues.mobile,
        password: data.password || formValues.password,
        emp_code: data.emp_code || formValues.emp_code,
        designation: data.department || formValues.department,
        
     
      });
    }
  };

  const checkDealer = async (e) => {
    e.preventDefault();

    // Validate dealerCode
    if (!formValues?.user_id) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        user_id: "User Id is required",
      }));
      return;
    }

    

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      user_id: null,
    }));

    const user_id = formValues?.user_id;
    const data = await getDealer(user_id);

    if (data) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        user_id: "User Id Already exists",
      }));
     
    } else {
     
    }
  };







  const handleClickzone = (event, row) => {
    setIsAddModalOpenZone(true)
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const [anchorElZone, setAnchorElZone] = useState(null);



  const handleInputChange11 = (e) => {
    const { name, value, checked } = e.target;
  
  
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues };
  
      if (name === "region") {
        updatedValues.region = Array.isArray(prevValues.region)
          ? checked
            ? [...prevValues.region, value]
            : prevValues.region.filter((region) => region !== value)
          : [value];
      }
  
      if (name === "zone") {
        updatedValues.zone = Array.isArray(prevValues.zone)
          ? checked
            ? [...prevValues.zone, value]
            : prevValues.zone.filter((zone) => zone !== value)
          : [value];
      }
  
      return updatedValues;
    });
  };
  
  
 

  const submit_button = async(e)=>{
    console.log('skjdvjch');
    try {

      const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
      e.preventDefault();
   const    res = await UpdateZone(selectedRow?.id, formValues, showSnackBar);

      if (res?.message) {
        setIsAddModalOpenZone(false);
        await fetchUsers();
      }

    } catch (error) {
      
    }
  }


  // utils.js
 function formatDate(dateString) {
  if (!dateString) return "N/A"; // अगर डेट null या undefined है
  const dateObj = new Date(dateString);
  if (isNaN(dateObj)) return "Invalid Date"; // अगर डेट वैलिड नहीं है

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`; // DD-MM-YYYY फॉर्मेट
}

  
 

  return (
    <>
      <div className="Template_id_contian">
        <h4 className="Head_title">
          Manage User
          <input placeholder="Search" type="text" class="TransactionSearch" value="" />

          <button className="add_btn6" onClick={handleAddModalToggle}>
            <img src={Plus} alt="img" /> New
          </button>
        </h4>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table" className="Table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id]; 
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "created_date" ? (
                              new Date(value).toLocaleDateString("en-GB") // Format as DD-MM-YYYY
                            ) : column.id === "action" ? (
                              <>
                                <IconButton
                                  aria-controls="simple-menu"
                                  aria-haspopup="true"
                                  onClick={(event) => handleClick(event, row)}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="simple-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                  className="BoxShadowNone"
                                >
                                  <MenuItem
                                    onClick={() => handleMenuAction("edit")}
                                  >
                                    <EditIcon className="icon-spacing" />
                                    Edit

                                    


                                    
                                  </MenuItem>


                                  <MenuItem
                                    onClick={() => handleMenuAction("zone")}
                                  >
                                    <EditIcon className="icon-spacing" />
                                    Zone

                                    


                        
                                  </MenuItem>


                                </Menu>
                              </>
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

    
      {isAddModalOpen && (
        <div className="modal fade show d-block manage_dealer_form wb_mange_content">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {update ? "Update Dealer" : "Add Dealer"}
                </h5>
                {/* <button
                  type="button"
                  className="btn-close"
                  onClick={modalClose}
                ></button> */}
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-container">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="">
                          USER ID <span className="required_icon">*</span>
                        </label>
                        <>
                        <input
                          type="text"
                          name="user_id"
                          placeholder="Enter user_id"
                          value={formValues.user_id}
                          onChange={handleInputChange}
                          readOnly={update}
                        />
                         
                          {formErrors.user_id && (
                            <span className="error">
                              {formErrors.user_id}
                            </span>
                          )}
                          {showCheck && !update && (
                            <>
                              {!user_id ? (
                                <button
                                  onClick={checkDealer}
                                  className="check-dealer-button bg_blue"
                                >
                                  Check
                                </button>
                              ) : (
                                <p style={{ color: "green" }} className="validation_green">
                                  user code available
                                </p>
                              )}
                            </>
                          )}
                        </>
                      </div>


                      <div className="form-group">
                        <label htmlFor="name">
                        Name<span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter name"
                          value={formValues.name}
                          onChange={handleInputChange}
                        />
                        {formErrors.name && (
                          <span className="error">{formErrors.name}</span>
                        )}
                      </div>


                  
                      
                    </div>
                    <div className="form-row">
                  
                      <div className="form-group">
                        <label htmlFor="uemail">
                          EMAIL ID <span className="required_icon">*</span>
                        </label>
                        <input
                          type="email"
                          name="email_id"
                          placeholder="Enter Email"
                          value={formValues.email_id}
                          onChange={handleInputChange}
                        />
                        {formErrors.email_id && (
                          <span className="error">{formErrors.email_id}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="mobile">
                        Mobile No <span className="required_icon">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="Enter Mobile"
                          value={formValues.mobile}
                          onChange={handleInputChange}
                        />
                        {formErrors.mobile && (
                          <span className="error">{formErrors.mobile}</span>
                        )}
                      </div>
                    </div>


                    <div className="form-row">
                  
                  <div className="form-group">
                    <label htmlFor="uemail">
                    PASSWORD <span className="required_icon">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formValues.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && (
                      <span className="error">{formErrors.password}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emp_code">
                    EMP CODE <span className="required_icon">*</span>
                    </label>
                    <input
                      type="number"
                      name="emp_code"
                      placeholder="Enter Emp Code"
                      value={formValues.emp_code}
                      onChange={handleInputChange}
                    />
                    {formErrors.emp_code && (
                      <span className="error">{formErrors.emp_code}</span>
                    )}
                  </div>
                </div>



                    <div className="form-row">
                


                  
                  
                    </div>
                 
                    <div className="form-row">

                  
                     

                      <div className="form-group mt-2 ">
  <label htmlFor="Designation">
  Designation<span className="required_icon">*</span>
  </label>

  <select
        name="Designation"
        value={formValues.designation}
        onChange={handleSelectChange}
        className="form-control p-2"
      >

<option value="">---Section Designation-------</option>
        <option value="Section Head">Section Head</option>
        <option value="Team Member">Team Member</option>
      </select>

  {formErrors.designation && (
    <span className="error">
      {formErrors.status}
    </span>
  )}
</div>

                      
                  
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {update ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={modalClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}






{isAddModalOpenZone && (
        <div className="modal fade show d-block manage_dealer_form wb_mange_content">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                User Permission
                </h5>
                {/* <button
                  type="button"
                  className="btn-close"
                  onClick={modalClose}
                ></button> */}
              </div>
              <div className="modal-body">
                <form onSubmit={submit_button}>
                  <div className="form-container">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="">
                          USER ID <span className="required_icon">*</span>
                        </label>
                        <>
                        <input
                          type="text"
                          name="user_id"
                          placeholder="Enter user_id"
                          value={formValues.user_id}
                          onChange={handleInputChange}
                          readOnly={zone}
                        />
                         
                          {formErrors.user_id && (
                            <span className="error">
                              {formErrors.user_id}
                            </span>
                          )}
                          {showCheck && !update && (
                            <>
                              {!user_id ? (
                                <button
                                  onClick={checkDealer}
                                  className="check-dealer-button bg_blue"
                                >
                                  Check
                                </button>
                              ) : (
                                <p style={{ color: "green" }} className="validation_green">
                                  user code available
                                </p>
                              )}
                            </>
                          )}
                        </>
                      </div>


                      <div className="form-group">
                        <label htmlFor="name">
                        Name<span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter name"
                          value={formValues.name}
                          onChange={handleInputChange}
                        
                        />
                        {formErrors.name && (
                          <span className="error">{formErrors.name}</span>
                        )}
                      </div>


                  
                      
                    </div>
                    <div id="form-row">
                    <div id="form-group">
  <label htmlFor="">
    Region <span id="required_icon">*</span>
  </label>
  <div id="checkbox-group">
    {["East", "West", "North", "South", "Central"].map((region) => (
      <div key={region} id="checkbox-item">
        <input
          type="checkbox"
          id={`region-${region}`}
          name="region"
          value={region}
          checked={Array.isArray(formValues.region) && formValues.region.includes(region)}
          onChange={(e) => handleInputChange11(e, "region")}
        />
        <label htmlFor={`region-${region}`}>{region}</label>
      </div>
    ))}
  </div>
</div>

</div>

<div id="form-row">
<div id="form-group">
  <label htmlFor="">
    Zone <span id="required_icon">*</span>
  </label>
  <div id="checkbox-group">
    {[
      "UP - West & UK", "MP West", "MP East", "Madhya Pradesh", "Rajasthan 2",
      "Chhattisgarh", "UP Central", "UP East", "Bihar", "Jharkhand", "North East",
      "Odisha", "West Bengal", "Delhi", "Haryana", "Punjab/HP/JK/CH",
      "Rajasthan 1", "Central", "East", "North", "South", "West",
      "AP", "KA-North", "KA-South", "Kerala", "Telangana", "TN North",
      "TN South", "Gujarat1", "Gujarat2", "Mah1+Goa", "Mah2", "Mah3"
    ].map((zone) => (
      <div key={zone} id="checkbox-item">
        <input
          type="checkbox"
          id={`zone-${zone}`}
          name="zone"
          value={zone}
          checked={Array.isArray(formValues.zone) && formValues.zone.includes(zone)}
          onChange={(e) => handleInputChange11(e, "zone")}
        />
        <label htmlFor={`zone-${zone}`}>{zone}</label>
      </div>
    ))}
  </div>
</div>

</div>





          
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" >
                      Zone Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={modalClosezone}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}



      <AlertDialog
        open={open}
        setOpen={setOpen}
        title={dialogTitle}
        description={dialogDescription}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={handleCloseSnackBar}
      />
    </>
  );
};

export default WbManageDealer;
