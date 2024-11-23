// service.jsx
import { Snackbar } from "@mui/material";
import { apiCall } from "./authServieces";


export const AddUser = async (formValues, showSnackBar) => {
  try {
    const res = await apiCall({
      endpoint: "admin/add-user",
      method: "POST",
      payload: formValues,
    });

    // Trigger the snackbar callback from the component
    showSnackBar({
      open: true,
      severity: res?.success ? "success" : "error",
      message:
        res?.message ||
        (res?.success ? "User added successfully" : "An error occurred"),
    });
    
      // Reset success state after a short delay
    
   
    return res;
  } catch (err) {
    console.log("err: ", err);
    showSnackBar({
      open: true,
      severity: false,
      message: err?.response?.data?.message || "An error occurred",
    });
    return (
      err?.response?.data || { success: false, message: "An error occurred" }
    );
  }
};

export const UpdateUser = async (dealerCode, formValues, showSnackBar) => {
  try {
    const res = await apiCall({
      endpoint: `admin/update-dealer/${dealerCode}`,
      method: "PUT",
      payload: formValues,
    });

    // Trigger the snackbar callback from the component
    showSnackBar({
      open: true,
      severity: res?.success ? "success" : "error",
      message:
        res?.message ||
        (res?.success ? "User Updated Successfully" : "An error occurred"),
    });

    return res;
  } catch (err) {
    showSnackBar({
      open: true,
      severity: false,
      message: err?.response?.data?.message || "An error occurred",
    });
    return (
      err?.response?.data || { success: false, message: "An error occurred" }
    );
  }
};


export const UpdateZone = async (dealerCode, formValues, showSnackBar) => {
  try {
    const res = await apiCall({
      endpoint: `admin/update-zone`,
      method: "PUT",
      payload: formValues,
    });

    // Trigger the snackbar callback from the component
    showSnackBar({
      open: true,
      severity: res?.success ? "success" : "error",
      message:
        res?.message ||
        (res?.success ? "User Updated Zone Successfully" : "An error occurred"),
    });

    return res;
  } catch (err) {
    showSnackBar({
      open: true,
      severity: false,
      message: err?.response?.data?.message || "An error occurred",
    });
    return (
      err?.response?.data || { success: false, message: "An error occurred" }
    );
  }
};



export const deleteDealers = async (dealerCode, showSnackBar) => {
  try {
    const res = await apiCall({
      endpoint: `admin/delete-dealer/${dealerCode}`,
      method: "DELETE",
    });
    if (res?.success) {
      showSnackBar({
        open: true,
        severity: res?.success ? "success" : "error",
        message: res?.message,
      });
      return res;
    }
  } catch (err) {
    showSnackBar({
      open: true,
      severity: false,
      message: err?.response?.data?.message || "An error occurred",
    });
    return (
      err?.response?.data || { success: false, message: "An error occurred" }
    );
  }
};

export const GetPinnacleUser = async (apiKey, showSnackBar) => {
  try {
    const res = await apiCall({
      endpoint: `admin/get-pinnacle-user/${apiKey}`,
      method: "GET",
    });


    return res;
  } catch (err) {
    if(Snackbar){
      showSnackBar({
        open: true,
        severity: false,
        message: "Please check the API key.",
      });
    }
    return (
      err?.response?.data || { success: false, message: "An error occurred" }
    );
  }

};
