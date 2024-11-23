import React, { useState, useEffect } from "react";
import { Me } from "../services/authServieces";
import ShowSnackBar from "../components/snackBar";
import { useLocation } from "react-router-dom"; // Import useLocation
import editIcon from "../Assets/images/edit.png";

import { apiCall } from "../services/authServieces";

import "../css/Profile.css"; // Make sure to import the CSS file

const Profile = () => {
  const location = useLocation();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  const [editProfile, setEditProfile] = useState(profile);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(profile.image);
  const [isEditing, setIsEditing] = useState(false);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const userData = async () => {
    try {
      const data = await Me();
      if (data && data.success) {
        setProfile({
          name: data.data.name,
          email: data.data.email_id,
          phone: data.data.mobile,
          image: `${data.data.profile_url}`,
        });
        setEditProfile({
          name: data.data.name,
          email: data.data.email_id,
          phone: data.data.mobile,
          image: `${data.data.profile_url}`, // or data.image if available
        });
      }
    } catch (err) {
      setSnackBar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "An error occurred",
      });
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setSnackBar({
        open: true,
        severity: "success",
        message: location.state.message, // Show password change success message
      });
    }
    userData(); // Fetch user data
  }, [location.state]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editProfile.name);
    formData.append("email", editProfile.email);
    formData.append("phone", editProfile.phone);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const res = await apiCall({
        endpoint: "admin/update_profile_data",
        method: "POST",
        payload: formData,
      });

      if (res.success) {
        await userData();
        setSnackBar({
          open: true,
          severity: "success",
          message: "Profile updated successfully!",
        });
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: res.message,
        });
      }
    } catch (err) {
      setSnackBar({
        open: true,
        severity: "error",
        message: err.message || "Server Error. Please try again later.",
      });
    }

    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleCloseSnackBar = () => {
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };
  const handleEditClick = () => {
    document.getElementById("profile-image-input").click(); // Trigger the hidden file input
  };
  return (
    <div className="profile-container">
      {isEditing ? (
        <div className="profile-form-contain">
          <h4 className="ProfileCardTitle">Edit Profile</h4>
          <form className="profile-form" onSubmit={handleEditSubmit}>
            <div className="form-group">
              <div className="profile_title_l">
                {profile.name.charAt(0).toUpperCase() ||
                  "https://via.placeholder.com/150"}
              </div>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }} // Hide the input
              />
            </div>
            {/* {selectedImage && (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            className="preview-image"
                        />
                    )} */}
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editProfile.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editProfile.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editProfile.phone}
                onChange={handleEditChange}
              />
            </div>
            <button className="save_edit_btn_profile" type="submit">
              Save
            </button>
            <button
              className="save_edit_btn_profile Cancel"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="profile-view-contain">
          <h4 className="ProfileCardTitle">Profile</h4>
          <div className="profile-view">
            <div className="profile_title_l">{profile.name.charAt(0).toUpperCase()}</div>
            <p>
              <strong>Username:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <button
              className="save_edit_btn_profile"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      <ShowSnackBar
        open={snackBar.open}
        severity={snackBar.severity}
        message={snackBar.message}
        onClose={handleCloseSnackBar}
      />
    </div>
  );
};

export default Profile;
