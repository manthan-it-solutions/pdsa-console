import React, { useEffect, useState } from "react";
import "../../css/wb_transaction_detail.css";
import axios from "axios";
import CollapsibleTable from "../../components/WalletTable";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import Export from "../../Assets/images/export.png";
import excelIcon from "../../Assets/images/excel.png";
import SearchIcon from "@mui/icons-material/Search";
import { ClipLoader } from "react-spinners";
import { SettingsApplicationsOutlined } from "@mui/icons-material";
import Loader from "../../components/Loader"

const WbTransactionDetail = () => {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchValue] = useState('');
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput); // State to store debounced value
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: true,
    message: "",
  });

  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);


  const handleCloseSnackBar = () => {
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };

  const fetchRowDetails = async()=>{
    console.log('Fetch row details ')
  }

  const fetchTransactions = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      let endpoint = `admin/get-transaction-admin?page=${page}&limit=${limit}`;
      if (debouncedSearchInput) {
        endpoint = `${endpoint}&user_name=${debouncedSearchInput}`;
      }

      const res = await apiCall({
        endpoint: endpoint,
        method: "GET",
      });
      if (res?.success) {
        setRows(res?.data || []);
        setTotalRows(res?.total || 0);
      }
    } catch (err) {
      console.log(err);
    } finally{
      setLoading(false);
    }
  };

  // Debouncing effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Set delay to 500ms

    return () => clearTimeout(delayDebounceFn); // Clear the timeout if searchInput changes
  }, [searchInput]);

  useEffect(() => {
    fetchTransactions();
  }, [debouncedSearchInput]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  // handle download to excel
  const handleExportToExcel = async()=>{
    setLoading(true);
    try{
      const endpoint = `admin/getTransactionalExcelData`;
      
      const url = `${endpoint}`;
      const user = JSON.parse(localStorage.getItem("user-cred"));

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Authorization': `Bearer ${user?.token}`
        }
      });
      if (response.data.size === 0) {
        throw new Error('Received empty file');
    }

    // Get filename from the response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `MIS_transactional_report.xlsx`;

    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
        }
    }

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = downloadUrl;
    link.download = filename;

    // Append to document, click, and cleanup
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      setSnackBar({
        open:true,
        severity: true,
        message: 'Excel File Downloaded Successfully'
      })
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);

    }catch(error){
      console.log('Error downloading Excel file: ', error);
      return setSnackBar({
        open: true,
        severity: false,
        message: 'Failed to download excel file'
      })
    } finally{
      setLoading(false);
    }
  }


  
  return (
    <>
      <div className="Manage_voice_contian">
        <h4 className="Head_title AdminSearchContain">
          Transaction Details{" "}
          
        <div className="Session_report_SearchContain">
          <input
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchChange}
            type="text"
            className="TransactionSearch_new"
          />
        <button type="button" className="search_btn_n"><SearchIcon /></button>
        </div>
          {/* <button className="add_btn7">
            <img src={Export} alt="img" /> Export
          </button> */}
          {/* <button type="button" className="ExcelIconContain add_btn7" onClick={handleExportToExcel}>
                <img src={excelIcon} alt="excelIcon" className="ExcelIcon"/> 
        </button> */}
        </h4>
        <div className="Manage_voice_Card">
          <div className="Wallet_table">
            <CollapsibleTable
              rows={rows}
              totalRows={totalRows}
              fetchTransactions={fetchTransactions}
              fetchRowDetails={fetchRowDetails}
            />
          </div>
        </div>
      </div>
      {loading && (
        <Loader />
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

export default WbTransactionDetail;