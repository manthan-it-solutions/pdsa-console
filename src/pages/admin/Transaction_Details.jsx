import Plus from "../../Assets/images/plus.png";
import React, { useEffect, useState } from "react";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from '@mui/material/MenuItem';

import { formatDate } from "../../utils/helper";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Menu from '@mui/material/Menu';


const WpUserTransactionDetails = () => {
    const [count, setCount] = useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [SelectedRow, setSelectedRow] = ('');
    
  
    const [snackBar, setSnackBar] = useState({
      open: false,
      severity: true,
      message: "",
    });
    const [rows, setRows] = useState([]);
  
    const fetchNumberList = async (page = 1, limit = 10) => {
      try {
        const res = await apiCall({
          endpoint: `admin/pdsa_transaction_details?page=${page}&limit=${limit}`,
          method: "GET",
        });
      
        if (res?.response) {
          setRows(res?.response?.data || []);
          setCount(res?.response?.total);
        }
      } catch (err) {
        setSnackBar({
          open: true,
          severity: false,
          message: err?.response?.data?.message || "An error occurred",
        });
      }
    };
  
    useEffect(() => {
      fetchNumberList();
    }, []);
  
    const handleCloseSnackBar = () => {
      setSnackBar((prevState) => ({ ...prevState, open: false }));
    };
  
    const handleChangePage = async (event, newPage) => {
      const updatedPage = newPage + 1;
      await fetchNumberList(updatedPage, rowsPerPage);
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = async (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
      await fetchNumberList(page, parseInt(event.target.value));
    };
  
    const handleClick = (event, row) => {
      setAnchorEl(event.currentTarget);
      setSelectedRow(row);
    };
    const [anchorEl, setAnchorEl] = useState(null);
  
    const columns = [
      { id: "trans_date", label: "Date" },
      { id: "trans_time", label: "Time" },
      { id: "amount", label: "Amount" },
      { id: "remarks", label: "Remark" },
      { id: "type", label: "Type" },
    ];
  

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
        <div className="Block_number_contian">
          <h4 className="Head_title">Transaction Details</h4>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }} className="table_contain">
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
                  {rows.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        let value = row[column.id];
  
                        if (column.id === "type") {
                          // Normalize the type value to lowercase for comparison
                          const typeValue = value?.toLowerCase();
                          const color =
                            typeValue === "add"
                              ? "green"
                              : typeValue === "deduct"
                              ? "red"
                              : "black";
  
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <span style={{ color: color }}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </span>
                            </TableCell>
                          );
                        }



                        if (column.id === "trans_date") {
                          // Normalize the type value to lowercase for comparison
                  
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <span >
                                {value === "trans_date"
                                  ? column.formatDate(value)
                                  :formatDate(value)}
                              </span>
                            </TableCell>
                          );
                        }

                        
  
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
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
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <ShowSnackBar
          open={snackBar.open}
          severity={snackBar.severity}
          message={snackBar.message}
          onClose={handleCloseSnackBar}
        />
      </>
    );
  };
  

export default WpUserTransactionDetails;
