import React, { useState, useEffect, useCallback } from "react";
import { IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../../css/manage_waba.css";
import Plus from "../../Assets/images/plus.png";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { GetPinnacleUser } from "../../services/manageDealerService";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { formatPhoneNumber } from "../../utils/helper";

const ManageWaba = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [showForm, setShowForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [apiKeyData, setApiKeyData] = useState([]);
  const [rowValue, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [formData, setFormData] = useState({
    userId: "",
    apiKey: "",
    businessNumber: "",
    phoneNumberId: "",
    sessionPrice: "",
    hsmPrice: "",
    plateFormPrice: "",
    utilityPrice: "",
    marketingPrice: "",
    otpPrice: "",
  });
  const [errors, setErrors] = useState({}); // State for errors

  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { selectedRow } = location.state || {};
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const columns = [
    { id: "business_no", label: "Business Num", minWidth: 100 },
    { id: "sess_price_24", label: "Session Price", minWidth: 100 },
    { id: "hsm_price", label: "HSM Price", minWidth: 100 },
    { id: "plt_price", label: "Platform Price", minWidth: 100 },
    { id: "utility_price", label: "Utility Price", minWidth: 100 },
    { id: "marketing_price", label: "Marketing Price", minWidth: 100 },
    { id: "otp_price", label: "OTP Price", minWidth: 100 },
    { id: "action", label: "Action", minWidth: 100 },
  ];

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseSnackBar = (event, reason) => {
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setSelectedRow(null);
  };

  const handleMenuAction = async (action) => {
    console.log("action: ", action);
    console.log(rowValue);

    handleClose();
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch data based on debounced search term
  const fetchData = useCallback(async () => {
    try {
      let endpoint = `manage-waba/get-wabas?page=${page + 1
        }&limit=${rowsPerPage}&userId=${selectedRow.user_id}`;
      if (debouncedSearchTerm) {
        endpoint = `${endpoint}&search=${debouncedSearchTerm}`;
        console.log('endpoint: ', endpoint);
      }
      const response = await apiCall({ method: "GET", endpoint: endpoint });
      if (response.success) {
        setRows(response.data);
        setTotal(response.total);
      }
    } catch (error) {
      console.error(error);
    }
  }, [page, rowsPerPage, selectedRow.user_id, debouncedSearchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const getWhatsAppData = useCallback(async () => {
    try {
      const apiKey = selectedRow.api_key;
      if (apiKey) {
        const res = await GetPinnacleUser(apiKey, "");
        if (res.success) {
          setApiKeyData(res.data);
          console.log("res.data: ", res.data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            apiKey: apiKey, // Assuming res.data has an apiKey field
          }));
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [selectedRow]);

  useEffect(() => {
    getWhatsAppData();
  }, [getWhatsAppData]);

  const toggleModal = () => {
    setErrors({});
    setFormData("");
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!selectedRow.api_key) validationErrors.apiKey = "API Key is required";
    if (!formData.hsmPrice) validationErrors.hsmPrice = "HMS price is required";
    if (!formData.sessionPrice)
      validationErrors.sessionPrice = "Session Price is required";
    if (!formData.plateFormPrice)
      validationErrors.plateFormPrice = "Platform Price is required";
    if (!formData.businessNumber)
      validationErrors.businessNumber = "Business Number is required";
    if (!formData.phoneNumberId)
      validationErrors.phoneNumberId = "Phone Number Id is required";
    if (!formData.otpPrice) validationErrors.otpPrice = "Otp price is required";
    if (!formData.marketingPrice)
      validationErrors.marketingPrice = "Marketing price is required";
    if (!formData.utilityPrice)
      validationErrors.utilityPrice = "Utility price is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    try {
      const response = await apiCall({
        method: "POST",
        endpoint: "manage-waba/add-waba",
        payload: {
          userId: selectedRow.user_id,
          apiKey: selectedRow.api_key,
          businessNum: formData.businessNumber,
          sessionPrice: formData.sessionPrice,
          plateFormPrice: formData.plateFormPrice,
          hsmPrice: formData.hsmPrice,
          phoneNumberId: formData.phoneNumberId,
          utilityPrice: formData.utilityPrice,
          marketingPrice: formData.marketingPrice,
          otpPrice: formData.otpPrice,
        },
      });
      if (response.success) {
        setSnackBar({
          open: true,
          severity: true,
          message: "Record added successfully.",
        });
        toggleModal();
        fetchData();
        setPage(0);
      } else {
        console.error("Failed to add WABA:", response.message);
      }
    } catch (err) {
      setSnackBar({
        open: true,
        severity: false,
        message: err?.response?.data?.message || "An error occurred",
      });
    }
  };

  const handleCheckBusinessNumber = (e) => {
    e.preventDefault();
    if (formData?.businessNumber && apiKeyData && apiKeyData.length) {
      const wabaNumber = formatPhoneNumber(formData.businessNumber);
      const phoneNumberData = apiKeyData.filter(
        (el) => el.wanumber === wabaNumber
      );
      const phoneNumberId =
        phoneNumberData && phoneNumberData.length
          ? phoneNumberData[0]?.phone_number_id
          : "";
      if (phoneNumberId) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          phoneNumberId: phoneNumberId, // Assuming res.data has an apiKey field
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          phoneNumberId: "", // Assuming res.data has an apiKey field
        }));
        setSnackBar({
          open: true,
          severity: false,
          message: "Please check the business number ID.",
        });
      }
    }
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="Template_id_contian">
        <h4 className="Head_title">
          <span className="user_id">{selectedRow.user_id}</span>
          Manage Waba
          <input
            placeholder="Search"
            type="text"
            className="TransactionSearch"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="add_btn6" onClick={toggleModal}>
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
                {rows.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === "action" ? (
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
                              >
                                <MenuItem
                                  onClick={() => handleMenuAction("edit")}
                                >
                                  Edit
                                </MenuItem>
                                {/* <MenuItem
                                  onClick={() =>
                                    handleMenuAction("manage-waba")
                                  }
                                >
                                  Manage Waba
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleMenuAction("delete")}
                                >
                                  Delete
                                </MenuItem> */}
                              </Menu>
                            </>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay manage_dealer_form waba_form">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New WABA</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input
                      type="text"
                      id="userId"
                      value={selectedRow.user_id || ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apiKey">API Key:</label>
                    <input
                      type="text"
                      id="apiKey"
                      placeholder="Enter API Key"
                      value={selectedRow.api_key}
                      readOnly
                      onChange={handleInputChange}
                    />
                    {errors.apiKey && (
                      <span className="error-msg">{errors.apiKey}</span>
                    )}
                  </div>

                </div>

                <div className="form-row">
                  <div className="form-group bussiness_num">
                    <label htmlFor="businessNumber" className="form-label">
                      Business Number:
                    </label>
                    <input
                      type="text"
                      id="businessNumber"
                      placeholder="Business Number"
                      value={formData.businessNumber}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={handleCheckBusinessNumber}
                      className="check-button"
                    >
                      Check
                    </button>
                    {errors.businessNumber && (
                      <span className="error-msg">{errors.businessNumber}</span>
                    )}
                  </div>
                </div>


                <p className="fill_note">Please check to fill below form</p>
                <div className="form-row">
                  {formData?.phoneNumberId && (
                    <div className="form-group">
                      <label htmlFor="userId">Phone Number ID:</label>
                      <input
                        type="text"
                        id="phoneNumberId"
                        // onChange={handleInputChange}
                        value={formData.phoneNumberId || ""}
                        readOnly
                      />

                      {errors.phoneNumberId && (
                        <span className="error-msg">
                          {errors.phoneNumberId}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="userId">Session Price:</label>
                    <input
                      type="number"
                      id="sessionPrice"
                      onChange={handleInputChange}
                      value={formData.sessionPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.sessionPrice && (
                      <span className="error-msg">{errors.sessionPrice}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">HSM Price</label>
                    <input
                      type="number"
                      id="hsmPrice"
                      onChange={handleInputChange}
                      value={formData.hsmPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.hsmPrice && (
                      <span className="error-msg">{errors.hsmPrice}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">Platform Price:</label>
                    <input
                      type="number"
                      id="plateFormPrice"
                      onChange={handleInputChange}
                      value={formData.plateFormPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.plateFormPrice && (
                      <span className="error-msg">{errors.plateFormPrice}</span>
                    )}
                  </div>
                </div>
               
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="userId">Utility Price:</label>
                    <input
                      type="number"
                      id="utilityPrice"
                      onChange={handleInputChange}
                      value={formData.utilityPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.utilityPrice && (
                      <span className="error-msg">{errors.utilityPrice}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">Marketing Price:</label>
                    <input
                      type="number"
                      id="marketingPrice"
                      onChange={handleInputChange}
                      value={formData.marketingPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.marketingPrice && (
                      <span className="error-msg">{errors.marketingPrice}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">Otp Price:</label>
                    <input
                      type="number"
                      id="otpPrice"
                      onChange={handleInputChange}
                      value={formData.otpPrice || ""}
                      readOnly={!formData?.phoneNumberId}
                    />

                    {errors.otpPrice && (
                      <span className="error-msg">{errors.otpPrice}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-actions button_btn_submit">
                <button type="submit">Submit</button>
                <button type="button" onClick={toggleModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={handleCloseSnackBar}
      />
    </>
  );
};

export default ManageWaba;
