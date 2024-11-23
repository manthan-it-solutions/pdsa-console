import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TablePagination from "@mui/material/TablePagination";
import Export from "../Assets/images/export.png";
import closeIcon from '../Assets/images/close_icon.png' 

function Row({ row, onSubmit, index }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [walletAction, setWalletAction] = useState("Add");
  const [walletType, setwalletType] = useState("National");

  const [walletAmount, setWalletAmount] = useState("");
  const [walletRemarks, setWalletRemarks] = useState("");
  const [errors, setErrors] = useState("");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setWalletAction("Add");
    setwalletType("National");
    setWalletAmount("");
    setWalletRemarks("");
    setErrors({});
    setOpenModal(false);
  };

  const validateForm = () => {
    let formErrors = {};

    if (walletAmount.trim() === "") {
      formErrors.amount = "Amount is required.";
    }

    if (walletRemarks.trim() === "") {
      formErrors.remarks = "Remarks is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onSubmit(walletAction,walletType, walletAmount, row.user_id, walletRemarks);
    handleClose();
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="DropBtn"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">{row.user_id}</TableCell>
        <TableCell align="right">{row.user_name}</TableCell>
        <TableCell align="right">
          {row?.balance ? row.balance : "N/A"}
        </TableCell>
        <TableCell align="right">
          {row?.inter_bal ? row.inter_bal : "N/A"}
        </TableCell>
        <TableCell align="right">
          {row?.button_bal ? row.button_bal : "N/A"}
        </TableCell>
        <TableCell align="right">
          {" "}
          <button onClick={handleOpen} className="eyeBtn">
            <CurrencyRupeeIcon />
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
              <Table size="small" aria-label="purchases" className="HTable ">
                <TableHead>
                    <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right" colSpan={2}> <span></span></TableCell>
                      <TableCell>History</TableCell>
                      <TableCell align="right">User ID : <span>{row.user_id}</span></TableCell>
                   
                      <TableCell align="right">
       </TableCell>
     

                    </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Admin ID</TableCell>
                    <TableCell align="right">Transaction Type</TableCell>
                    <TableCell align="right">Campaign Type</TableCell>
                    <TableCell align="right">Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history && row.history.length > 0 ? (
                    row.history.map((historyRow) => (
                      <React.Fragment key={historyRow.row_id}>
                        <TableRow>
                          <TableCell>{historyRow.date}</TableCell>
                          <TableCell align="right">
                            {historyRow.amount}
                          </TableCell>
                          <TableCell align="right">
                            {historyRow.admin_id}
                          </TableCell>

                         
                          <TableCell align="right">{historyRow.type}</TableCell>
                          <TableCell align="right">
                            {historyRow.amount_type}
                          </TableCell>
                          <TableCell align="right">
                            <textarea name="remarks" id="hremarks" className="TableRemarks" readOnly>
                            {historyRow.remark}
                            </textarea>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="ModalBox">
          <h2 className="WalletTitle">Wallet <button className='CloseBtn'  onClick={handleClose}><img src={closeIcon} alt="img" /></button></h2>
          <Box className="WalletContain">
            <h5>
              User ID: <span className="UserID">{row.user_id}</span>
            </h5>
            <div className="Devider"></div>
            <div className="WalletSelect">
              <select
                name="Add"
                id="add"
                value={walletAction}
                onChange={(e) => setWalletAction(e.target.value)}
              >
                <option value="Add">Add</option>
                <option value="Deduct">Deduct</option>
              </select>
            </div>

            <div className="WalletSelect mt-5">
              <select
                name="Add"
                id="add"
                value={walletType}
                onChange={(e) => setwalletType(e.target.value)}
              >
                <option value="National">National Balance</option>
                <option value="International">International Balance</option>
                <option value="Button">Button Balance</option>
              </select>
            </div>
            <div className="Devider"></div>
            <div className="WalletAmount">
              <span style={{ position: "relative" }} className="d-inline-block">
                Balance{" "}
                <span style={{ color: "red" }} className="RequiredStar">
                  *
                </span>
              </span>
              <CurrencyRupeeIcon />
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
              />
              {errors.amount && (
                <Typography color="error" className="Errormsg">
                  {errors.amount}
                </Typography>
              )}
            </div>
            <div className="Devider"></div>
            <div className="WalletRemarks">
              <textarea
                name="remarks"
                id="remarks"
                value={walletRemarks}
                onChange={(e) => setWalletRemarks(e.target.value)}
                placeholder="Write your Remarks"
              ></textarea>
              {errors.remarks && (
                <Typography color="error" className="Errormsg">
                  {errors.remarks}
                </Typography>
              )}
            </div>
            <div className="Devider"></div>

            <div className="WalletBtns">
              <Button variant="contained" onClick={handleSubmit}>
                Proceed
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  rows,
  totalRows,
  onSubmit,
  fetchTransactions,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchTransactions(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchTransactions(1, parseInt(event.target.value, 10));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table"  className='Table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">User Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Wallet National</TableCell>
            <TableCell align="right">Wallet International</TableCell>
            <TableCell align="right">Wallet Button</TableCell>
            <TableCell align="right">Add</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Change: Render rows dynamically */}
          {rows.map((row, index) => (
           
            
            <Row key={row.id} row={row} onSubmit={onSubmit} index={index} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

CollapsibleTable.propTypes = {
  rows: PropTypes.array.isRequired,
  totalRows: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
};
