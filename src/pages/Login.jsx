import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../css/login.css";
import ShowSnackBar from "../components/snackBar";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "../services/authServieces";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  // const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [userType, setUserType] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!credentials.username.trim()) {
      formErrors.username = "Username is required";
    }
    if (!credentials.password.trim()) {
      formErrors.password = "Password is required";
    }
    setErrors(formErrors);
    console.log(formErrors)
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  // const handleRememberPasswordChange = () => {
  //   setRememberPassword((prev) => !prev);
  // };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    console.log('----------------')
    if (!validateForm()) {
      return;
    }
    try {
      const res = await signIn({ payload: credentials });

      if (res.success) {
        setUserType(res?.data?.status);
        console.log('res?.data?.status: ', res.data.status);
        setSnackBar({
          open: true,
          severity: true,
          message: "Login Successful",
        });
        setTimeout(() => {
          setRedirectToHome(true);
        }, 1000);
      }
    } catch (err) {
      setSnackBar({
        open: true,
        severity: err?.response?.data?.success,
        message: err?.response?.data?.message || "An error occurred",
      });
    }
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar((prevState) => ({ ...prevState, open: false }));
  };

  if (redirectToHome) {
   
    if (userType == 2) {

      return <Navigate to="/admin" />;
    }
    else if (userType == 1) {
    
      return <Navigate to="/user_dashbaord" />;
    }
    return <Navigate to="/" />;
  }

  return (
    <div className="Login_contain">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 ">
            <div className="LoginCardLeft">
              <div className="LoginLogoContain">
                <img src="/images/meta-logo.png" alt="meta logo" />
                <img
                  src="/images/logo.png"
                  alt="manthan logo"
                  className="Manthan_logo"
                />
              </div>
              <h2>
                Manthan help's you Unlocking the Power of Connection for Your
                Business Growth.
              </h2>
              <div className="ConnectSuppot">
                <p>Feel Free to Connect</p>
                <p>|</p>
                <a href="!#" onClick={(e) => e.preventDefault()}>
                  Ai Chat
                </a>
                <p>|</p>
                <a href="!#" onClick={(e) => e.preventDefault()}>
                  Raise a Ticket
                </a>
                <p>|</p>
              </div>
            </div>
          </div>
          <div className="col-lg-5 ">
            {" "}
            <div>
              <div className="Login_card">
                {/* <h4>Whatsapp User Login</h4> */}
                <form onSubmit={loginSubmit}>
                  <div className="Form_grOUp">
                    {/* <label htmlFor="username">
              User ID <span className="required">*</span>
            </label> */}
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter your user id"
                      value={credentials.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <span className="error">{errors.username}</span>
                    )}
                  </div>
                  <div className="Form_grOUp">
                    {/* <label htmlFor="password">
              Password <span className="required">*</span>
            </label> */}
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleInputChange}
                      />
                      {errors.password && (
                        <span className="error">{errors.password}</span>
                      )}
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </div>
                  </div>
                  <div className="Form_grOUp">
                    <button type="submit" id="submitBtn">
                      Log In
                    </button>
                  </div>
                  <div className="Form_grOUp text-center">
                    <a href="!#" onClick={(e) => e.preventDefault()}>
                      Forgot Password?
                    </a>
                  </div>
                  <div className="Form_grOUp text-center">
                    <div className="DiverDer"></div>
                  </div>
                  <div className="Form_grOUp text-center mb-0">
                    <button
                      type="button"
                      className="btn CreateNewAccount"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      For Business WhatsApp
                    </button>
                  </div>
                </form>
                <ShowSnackBar
                  open={snackBar.open}
                  severity={snackBar.severity}
                  message={snackBar.message}
                  onClose={handleCloseSnackBar}
                />
              </div>
              <p className="CreatPera">
                <a
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/pages/create/?ref_type=registration_form"
                  target="_blank"
                >
                  Create a Page
                </a>{" "}
                for a celebrity, brand or business.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* modal for create account */}

      <div
        className="modal fade Enquiry_form"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Enquiry Form
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="Form_grOUp">
                <label htmlFor="username">
                  Organization name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="organizationName"
                  placeholder="Enter your organization name"
                  value={credentials.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="Form_grOUp">
                <label htmlFor="username">
                  Mobile Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="mobileNumber"
                  placeholder="Enter your mobile number"
                  value={credentials.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="Form_grOUp">
                <label htmlFor="username">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="emailNumber"
                  placeholder="Enter your email"
                  value={credentials.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
