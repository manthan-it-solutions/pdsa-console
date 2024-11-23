import React, { useEffect, useState } from "react";
import "../css/wb_template.css";
import { useNavigate } from "react-router-dom";
import { apiCall ,baseURLforPAth} from "../services/authServieces";
import ShowSnackBar from "../components/snackBar";
import TablePagination from "@mui/material/TablePagination";
import eyesIcon from "../Assets/images/eye.png";
import Download from "../Assets/images/downloading.png";
import CircularProgress from "@mui/material/CircularProgress";

const NationalReport = () => {
  const [isTemplate, setIsTemplate] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const getTemplates = async () => {
    setLoading(true);
    try {
      const res = await apiCall({
        endpoint: `templates/get-templates-pagination_report?page=${page + 1}&limit=${rowsPerPage}`,
        method: "GET",
      });

     if (res?.success) {
  const formattedData = res.data.map((item) => {
    const date = (item.date);
 
    const formattedDate = date;

    return {
      ...item,
      date: formattedDate,
    };
  });

  setIsTemplate(formattedData || []);
  setTotalTemplates(res.totalPages);
  setFilteredTemplates(formattedData); // Set initial filtered data
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

  useEffect(() => {
    getTemplates();
  }, [page, rowsPerPage]);

  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  const filterTemplatesByDate = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (isNaN(from) || isNaN(to)) {
        console.error("Invalid dates provided");
        setFilteredTemplates(isTemplate);
        return;
      }

      setFilteredTemplates(
        isTemplate.filter((template) => {
          const templateDate = parseDate(template.date);
          return templateDate >= from && templateDate <= to;
        })
      );
    } else {
      setFilteredTemplates(isTemplate);
    }
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const handleImageClick = (userid) => {
    localStorage.setItem("userid", userid);
    navigate("/NationCompaignId", { state: { userid } });
  };

  const downloadFile = async (filePath) => {
    try {
      const fileName = filePath.split("/").pop();
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("Network response was not ok");
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
      setSnackBar({
        open: true,
        severity: "error",
        message: "File download failed",
      });
    }
  };

  return (
    <>
      <div className="Template_id_contian1">
      <h4 className="Head_titleTemplate new_title_c">
  View National Campaign
  <div id="dateFilterContainer" className="ms-5">
    <input
      type="date"
      placeholder="From Date"
      value={fromDate}
      onChange={handleFromDateChange}
    />
    <input
      type="date"
      placeholder="To Date"
      value={toDate}
      onChange={handleToDateChange}
    />
    <button type="button" onClick={filterTemplatesByDate}>
      Submit
    </button>
  </div>
</h4>


        <div className="Template_id_Card1">
          <div className="table_contain" id="tableContain">
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress />
              </div>
            ) : (
              <table className="Table w-100" id="Table">
                <thead>
                  <tr>
                    <th>S No</th>
                    <th>Campaign Id</th>
                    <th>Date</th>
                    <th>Campaign Name</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                      <tr key={"Template" + index}>
                        <td>{index + 1}</td>
                        <td>{template.compaign_id}</td>
                        <td>{template.date}</td>
                        <td>{template.template_name}</td>
                        <td>{template.message}</td>
                        <td>{template.status_campaign}</td>
                        <td>{template.total_count}</td>
                        <td>
                          {template.status_campaign === "Send" ? (
                            <button
                              className="ms-3"
                              onClick={() =>
                                downloadFile(
                                  `${template.excel_upload}`
                                )
                              }
                            >
                              <img
                                src={Download}
                                alt="Download Icon"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleImageClick(template.compaign_id)
                              }
                            >
                              <img
                                src={eyesIcon}
                                alt="Eyes Icon"
                              />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No Templates Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

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

      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
      />
    </>
  );
};

export default NationalReport;
