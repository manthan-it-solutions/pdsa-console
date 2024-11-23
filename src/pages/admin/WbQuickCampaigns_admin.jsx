import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import Plus from "../../Assets/images/plus.png";
import React, { useState, useEffect } from "react";
import "../../css/wb_manage_dealer.css";
import {
  AddUser,
  deleteDealers,
  GetPinnacleUser,
  UpdateUser,
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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const WbManageDealer = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showCheck, setShowCheck] = useState(true);
  const [showWhatsappField, setShowWhatsappField] = useState(false);
  const [showCheckApi, setShowCheckApi] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [dealerCodeAvailable, setDealerCodeAvailable] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = React.useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [update, setUpdate] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

  const openDialog = (title, description) => {
    setDialogTitle(title);
    setDialogDescription(description);
    setOpen(true);
  };

  const [formValues, setFormValues] = useState({
    dealerCode: "",
    companyName: "",
    dealerName: "",
    tradeName: "",
    apiKey: "",
    whatsappBusinessAccountId: "",
    location: "",
    state: "",
    district: "",
    city: "",
    upassword: "",
    region: "",
    zone: "",
    uemail: "",
    mobile: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const columns = [
    { id: "company_name", label: "Company" },
    { id: "user_id", label: "Customer Id" },
    { id: "user_name", label: "Customer Name" },
    { id: "user_phone", label: "Mobile" },
    { id: "user_email", label: "Email Id" },
    { id: "created_date", label: "Created Date" },
    // { id: "trade_name", label: "Trade Name" },
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
    setDealerCodeAvailable(false);
    const randomDealerCode = getRandomNum();
    setFormValues((prevValues) => ({
      ...prevValues,
      dealerCode: randomDealerCode.toString(),
    }));
    setUpdate(false);
    setFormErrors({});
    setIsAddModalOpen(!isAddModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dealerCode") {
      setDealerCodeAvailable(false);
      setShowCheck(true);
    }

    if (name === "apiKey") {
      setShowCheckApi(true);
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
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
    if (!formValues.dealerCode) errors.dealerCode = "Dealer Code is required";
    if (!formValues.companyName)
      errors.companyName = "Company Name is required";
    if (!formValues.dealerName) errors.dealerName = "Dealer Name is required";
    if (!formValues.tradeName) errors.tradeName = "Trade Name is required";
    if (!formValues.location) errors.location = "Location is required";
    if (!formValues.state) errors.state = "State is required";
    if (!formValues.district) errors.district = "District is required";
    if (!formValues.city) errors.city = "City is required";
    if (!formValues.region) errors.region = "Region is required";
    if (!formValues.zone) errors.zone = "Zone is required";
    if (!formValues.uemail) errors.email = "Email is required";
    if (!formValues.mobile) errors.mobile = "Mobile is required";
    if (!formValues.apiKey) errors.mobile = "API key is required";
    if (!update) {
      if (!formValues.upassword) errors.password = "Password is required";
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
        dealerCode: "",
      }));
      setShowCheck(false);
      setUpdate(true);
      patchValues(selectedRow);
      setIsAddModalOpen(true);
    }
    handleClose();
  };

  const modalClose = () => {
    setUpdate(false);
    setShowCheck(true);
    setFormErrors({});
    setFormValues({});
    setIsAddModalOpen(!isAddModalOpen);
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

  const getDealer = async (dealerCode) => {
    try {
      const res = await apiCall({
        endpoint: `admin/get-dealer/${dealerCode}`,
        method: "GET",
      });
      if (res?.success) {
        return res?.data;
      }
    } catch (err) {
      setDealerCodeAvailable(true);
    }
  };

  const deleteDealer = async (dealerCode) => {
    const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
    await deleteDealers(dealerCode, showSnackBar);
    const newRows = rows.filter((el) => el.id !== dealerCode);
    setCount(newRows.length);
    setRows(newRows);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let res = "";
      const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
      if (update) {
        res = await UpdateUser(selectedRow?.id, formValues, showSnackBar);
      } else {
        res = await AddUser(formValues, showSnackBar);
      }
      if (res?.success) {
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
        dealerCode: data.user_id || formValues.dealerCode,
        companyName: data.company_name || formValues.companyName,
        dealerName: data.user_name || formValues.dealerName,
        tradeName: data.trade_name || formValues.tradeName,
        location: data.location || formValues.location,
        state: data.state || formValues.state,
        district: data.district || formValues.district,
        city: data.city || formValues.city,
        region: data.region || formValues.region,
        zone: data.zone || formValues.zone,
        uemail: data.user_email || formValues.uemail,
        mobile: data.user_phone || formValues.mobile,
        upassword: formValues.upassword,
        apiKey: data.api_key,
      });
    }
  };

  const checkDealer = async (e) => {
    e.preventDefault();

    // Validate dealerCode
    if (!formValues?.dealerCode) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        dealerCode: "Dealer Code is required",
      }));
      return;
    }

    if (formValues?.dealerCode.length !== 6) {
      // Assuming dealer code should be 6 digits
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        dealerCode: "Dealer Code must be 6 digits",
      }));
      return;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      dealerCode: null,
    }));

    const dealerCode = formValues?.dealerCode;
    const data = await getDealer(dealerCode);
    if (data) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        dealerCode: "Dealer Already exists",
      }));
      setShowCheck(false);
    } else {
      setDealerCodeAvailable(true);
    }
  };

  const checkApiKey = async (e) => {
    e.preventDefault();
    const showSnackBar = (snackBarData) => setSnackBar(snackBarData);
    const apiKey = formValues.apiKey;
    const res = await GetPinnacleUser(apiKey, showSnackBar);
    if (res && res?.data?.length) {
      setShowWhatsappField(true);
      setShowCheckApi(false);
      setFormValues({
        ...formValues,
        whatsappBusinessAccountId: res?.data?.[0].whatsapp_business_account_id, // Direct property name
      });
    } else {
      setShowWhatsappField(false);
      setShowCheckApi(true);
      setFormValues({
        ...formValues,
        whatsappBusinessAccountId: "", // Direct property name
      });
    }
  };

  return (
    <>
      <div className="Template_id_contian">
        <h4 className="Head_title">
          Manage Dealer
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
                                    onClick={() =>
                                      handleMenuAction("manage-waba")
                                    }
                                  >
                                    <ManageAccountsIcon className="icon-spacing" />
                                    Manage Waba
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleMenuAction("delete")}
                                  >
                                    <DeleteForeverIcon className="icon-spacing" />
                                    Delete
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
                        <label htmlFor="dealerCode">
                          Dealer Code <span className="required_icon">*</span>
                        </label>
                        <>
                          <input
                            type="text"
                            name="dealerCode"
                            placeholder="Enter Dealer Code"
                            value={formValues.dealerCode || ""}
                            onChange={handleInputChange}
                            readOnly={update}
                          />
                          {formErrors.dealerCode && (
                            <span className="error">
                              {formErrors.dealerCode}
                            </span>
                          )}
                          {showCheck && !update && (
                            <>
                              {!dealerCodeAvailable ? (
                                <button
                                  onClick={checkDealer}
                                  className="check-dealer-button bg_blue"
                                >
                                  Check
                                </button>
                              ) : (
                                <p style={{ color: "green" }} className="validation_green">
                                  Dealer code available
                                </p>
                              )}
                            </>
                          )}
                        </>
                      </div>
                      <div className="form-group">
                        <label htmlFor="companyName">
                          Company Name <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          placeholder="Enter Company Name"
                          value={formValues.companyName || ""}
                          onChange={handleInputChange}
                        />
                        {formErrors.companyName && (
                          <span className="error">
                            {formErrors.companyName}
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="dealerName">
                          Dealer Name <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="dealerName"
                          placeholder="Enter Dealer Name"
                          value={formValues.dealerName || ""}
                          onChange={handleInputChange}
                        />
                        {formErrors.dealerName && (
                          <span className="error">
                            {formErrors.dealerName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="apiKey">
                          API Key <span className="required_icon">*</span>
                        </label>
                        <>
                          <input
                            type="text"
                            name="apiKey"
                            placeholder="Enter API Key"
                            value={formValues.apiKey || ""}
                            onChange={handleInputChange}
                            readOnly={update}
                          />
                          {formErrors.apiKey && (
                            <span className="error">{formErrors.apiKey}</span>
                          )}
                          {showCheckApi && !update && (
                            <button
                              onClick={checkApiKey}
                              className="check-dealer-button bg_blue"
                            >
                              Check
                            </button>
                          )}
                        </>
                      </div>
                      <div className="form-group">
                        <label htmlFor="uemail">
                          Email <span className="required_icon">*</span>
                        </label>
                        <input
                          type="email"
                          name="uemail"
                          placeholder="Enter Email"
                          value={formValues.uemail}
                          onChange={handleInputChange}
                        />
                        {formErrors.email && (
                          <span className="error">{formErrors.email}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="mobile">
                          Mobile <span className="required_icon">*</span>
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
                        <label htmlFor="zone">
                          Zone <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="zone"
                          placeholder="Enter Zone"
                          value={formValues.zone}
                          onChange={handleInputChange}
                        />
                        {formErrors.zone && (
                          <span className="error">{formErrors.zone}</span>
                        )}
                      </div>


                      {!update && (
                        <div className="form-group">
                          <label htmlFor="upassword">
                            Password <span className="required_icon">*</span>
                          </label>
                          <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="upassword"
                            placeholder="Enter Password"
                            value={formValues.upassword || ""}
                            onChange={handleInputChange}
                          />
                          <button
                            className="PSIcon"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </button>
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="location">
                          Location <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          placeholder="Enter Location"
                          value={formValues.location}
                          onChange={handleInputChange}
                        />
                        {formErrors.location && (
                          <span className="error">{formErrors.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="state">
                          State <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          placeholder="Enter State"
                          value={formValues.state}
                          onChange={handleInputChange}
                        />
                        {formErrors.state && (
                          <span className="error">{formErrors.state}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="district">
                          District <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="district"
                          placeholder="Enter District"
                          value={formValues.district}
                          onChange={handleInputChange}
                        />
                        {formErrors.district && (
                          <span className="error">{formErrors.district}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="city">
                          City <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Enter City"
                          value={formValues.city}
                          onChange={handleInputChange}
                        />
                        {formErrors.city && (
                          <span className="error">{formErrors.city}</span>
                        )}
                      </div>
                      
                    </div>
                    <div className="form-row">

                    <div className="form-group">
                        <label htmlFor="region">
                          Region <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="region"
                          placeholder="Enter Region"
                          value={formValues.region}
                          onChange={handleInputChange}
                        />
                        {formErrors.region && (
                          <span className="error">{formErrors.region}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="tradeName">
                          Trade Name <span className="required_icon">*</span>
                        </label>
                        <input
                          type="text"
                          name="tradeName"
                          placeholder="Enter Trade Name"
                          value={formValues.tradeName || ""}
                          onChange={handleInputChange}
                        />
                        {formErrors.tradeName && (
                          <span className="error">
                            {formErrors.tradeName}
                          </span>
                        )}
                      </div>
                      
                      {showWhatsappField && (
                        <div className="form-group">
                          <label htmlFor="whatsappBusinessAccountId">
                            WhatsApp Business Account ID{" "}
                            <span className="required_icon">*</span>
                          </label>
                          <input
                            type="text"
                            name="whatsappBusinessAccountId"
                            placeholder="Enter WhatsApp Business Account ID"
                            value={formValues.whatsappBusinessAccountId || ""}
                            onChange={handleInputChange}
                            readOnly={true}
                          />
                          {formErrors.whatsappBusinessAccountId && (
                            <span className="error">
                              {formErrors.whatsappBusinessAccountId}
                            </span>
                          )}
                        </div>
                      )}
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
