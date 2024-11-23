import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../css/ChangePassword.css'; // Import CSS file for styling
import { apiCall } from "../services/authServieces";
import ShowSnackBar from "../components/snackBar";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { oldPassword, newPassword, confirmPassword } = formData;
        const newErrors = {};

        // Check if fields are empty
        if (!oldPassword) newErrors.oldPassword = "Old password is required.";
        if (!newPassword) newErrors.newPassword = "New password is required.";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";

        // Check if newPassword matches confirmPassword
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = "New password and confirm password do not match.";
        }

        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const res = await apiCall({
                endpoint: 'auth/change-password',
                method: "PUT",
                payload: formData
            });

            if (res.success) {
                setSnackBar({
                    open: true,
                    severity: "success",
                    message: "Password Change Successful",
                });

                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                // Redirect to /profile after 2 seconds
                // navigate("/profile");
                navigate("/profile", { state: { message: "Password Changed Successfully!" } });
            } else {
                setSnackBar({
                    open: true,
                    severity: false,
                    message: res.message || "Something went wrong. Please try again.",
                });
            }
        } catch (error) {
            setSnackBar({
                open: true,
                severity: false,
                message: error?.response?.data?.message || "Server Error. Please try again later.",
            });
        }
    };

    const handleCloseSnackBar = () => {
        setSnackBar((prevState) => ({ ...prevState, open: false }));
    };

    return (
        <div className="change-password-container">
            <div className="change-password-form-container">
                <h4 className="ProfileCardTitle">Change Password</h4>
            <form className="change-password-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Old Password:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.oldPassword && <span className="error">{errors.oldPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                <button className="change_pass_button" type="submit">Change Password</button>
            </form>
            </div>
            <ShowSnackBar
                open={snackBar.open}
                severity={snackBar.severity}
                message={snackBar.message}
                onClose={handleCloseSnackBar}
            />
        </div>
    );
};

export default ChangePassword;
