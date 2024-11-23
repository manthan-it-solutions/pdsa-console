import React, { useEffect, useState } from "react";
import "../../css/wb_transaction_detail.css";
import CollapsibleTable from "../../components/WalletTable";
import { apiCall } from "../../services/authServieces";
import ShowSnackBar from "../../components/snackBar";
import Export from "../../Assets/images/export.png";

const WbTransactionDetail = () => {
  const [searchInput, setSearchValue] = useState('');
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput); // State to store debounced value
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: true,
    message: "",
  });

  const [rows, setRows] = useState([]);
  console.log('rows: ', rows);
  const [totalRows, setTotalRows] = useState(0);
  console.log('totalRows: ', totalRows);


  const handleCloseSnackBar = () => {
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };

  const fetchRowDetails = async()=>{
    console.log('Fetch row details ')
  }

  const fetchTransactions = async (page = 1, limit = 10) => {
    try {
      let endpoint = `admin-transaction/get-transaction-admin?page=${page}&limit=${limit}`;
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

  const handleFormSubmit = async (type ,walletType, amount, userId, remarks) => {
    try {
      const payload = { type,walletType, amount, userId, remarks ,  };
      const res = await apiCall({
        endpoint: "admin-transaction/manage-balance",
        method: "post",
        payload: payload,
      });
      if(res?.success){
        await fetchTransactions()
        setSnackBar({
          open: true,
          severity: res?.success,
          message: res?.message || "An error occurred",
        });

      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: error?.response?.data?.success,
        message: error?.response?.data?.message || "An error occurred",
      });
    }
  };


  return (
    <>
      <div className="Manage_voice_contian">
        <h4 className="Head_title transition_head_title">
          Transaction Details
          <input
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchChange}
            type="text"
            className="TransactionSearch new_search_t"
          />
         
        </h4>
        <div className="Manage_voice_Card">
          <div className="Wallet_table">
            <CollapsibleTable
              rows={rows}
              totalRows={totalRows}
              onSubmit={handleFormSubmit}
              fetchTransactions={fetchTransactions}
              fetchRowDetails={fetchRowDetails}
            />
          </div>
        </div>
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

export default WbTransactionDetail;
