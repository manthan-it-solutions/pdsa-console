import React, { useState, useEffect } from "react";
import "../../css/Feedback.css";
import logo from "../../Assets/images/logo1.png";
import GoogleTranslateWidget from "../../GoogleTranslateWidget";
import { useLocation } from "react-router-dom";
import { apiCall } from "../../services/authServieces";

const Feedback = () => {
    const location = useLocation();
    const [isToggleOn, setIsToggleOn] = useState(false);
    const [isReadMoreVisible, setIsReadMoreVisible] = useState(false);
    const [showQuestion2, setShowQuestion2] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        modelName: '',
        dealership: '',
        receivedInfo: '',
        infoFormat: '',
        usedSimulator: '',
        salesExperience: '',
        deliveryExperience: '',
        termsAgreed: false,
    });

    const handleQuestion1Change = (e) => {
        setShowQuestion2(e.target.value === "yes");
        setFormData({ ...formData, receivedInfo: e.target.value });
    };

    const handleToggleChange = () => {
        setIsToggleOn(!isToggleOn);
    };

    const handleReadMoreToggle = () => {
        setIsReadMoreVisible(!isReadMoreVisible);
    };

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const SelectDetails = async () => {
        try {
            const res = await apiCall({
                endpoint: "user/select_user_details_by_link",
                method: "post",
                payload: { id: id },
            });

            if (res.success) {
                setFormData((prev) => ({
                    ...prev,
                    fullName: res.data[0].cust_name,
                    mobileNumber: res.data[0].mobile,
                    modelName: res.data[0].model_name,
                    dealership: res.data[0].dealership,
                }));
                console.log("res.data: ", res.data);
            } else {
                console.log("Error fetching user details");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isToggleOn) {
            alert("Please agree to the Terms and Conditions to proceed.");
            return;
        }

        // try {
        //     const res = await apiCall({
        //         endpoint: "user/submit_feedback",
        //         method: "post",
        //         payload: formData,
        //     });

        //     if (res.success) {
        //         alert("Feedback submitted successfully!");
        //         console.log("Submitted data: ", formData);
        //     } else {
        //         alert("Failed to submit feedback. Please try again.");
        //         console.log("API response error: ", res.message);
        //     }
        // } catch (error) {
        //     console.log("Error submitting feedback: ", error);
        // }
    };

    useEffect(() => {
        SelectDetails();
    }, []);

    return (
        <div className="feedback-container">
            <div className="feedback-wrapper">
                <div className="header_f">
                    <img src={logo} alt="Honda Logo" className="logo_f" />
                    <h1 className="title">Safety Advice Feedback Form</h1>
                    <div className="language-selector">
                        <GoogleTranslateWidget />
                    </div>
                </div>

                <div className="description">
                    <span>Dear Sir,</span>
                    <p className="para_f">
                        We are thankful to you for spending little time for us while filling this feedback form. Your
                        valuable inputs will enable us for continuous improvement of our service quality. Thanking you
                        once again.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                Full Name<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="form-input"
                                value={formData.fullName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Mobile Number<span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                className="form-input"
                                value={formData.mobileNumber}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                Model Name<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter model name"
                                className="form-input"
                                value={formData.modelName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Dealership / Showroom Name<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter dealership name"
                                className="form-input"
                                value={formData.dealership}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-questions">
                        <div className="question-group">
                            <label className="border_b">
                                1) Did you receive information on Road Safety Tips at the time of Delivery through
                                Leaflet / Verbal / Video / Mail / Message / Physical Demonstration on Vehicle?<span
                                    className="required"
                                >
                                    *
                                </span>
                            </label>
                            <div className="radio-group border_t">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="receivedInfo"
                                        value="yes"
                                        onChange={handleQuestion1Change}
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="receivedInfo"
                                        value="no"
                                        onChange={handleQuestion1Change}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>

                        {showQuestion2 && (
                            <div className="question-group">
                                <label className="border_b">
                                    2) In which form did you receive the Road Safety Tips?<span className="required">*</span>
                                </label>
                                <div className="radio-grid border_t">
                                    {[
                                        "Whatsapp Message with Video Link",
                                        "Text Message with Video Link",
                                        "Video on Whatsapp",
                                        "Demonstration on Vehicle",
                                        "Road Safety Leaflet",
                                        "Through Mail",
                                        "Verbal",
                                    ].map((option) => (
                                        <label key={option} className="radio-label">
                                            <input
                                                type="radio"
                                                name="infoFormat"
                                                value={option}
                                                onChange={handleChange}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="terms-group">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                className="toggle-input"
                                name="termsAgreed"
                                checked={formData.termsAgreed}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider"></span>
                            <span>I agree to the Terms and Conditions</span>
                        </label>
                        <button
                            type="button"
                            className="read-more"
                            onClick={handleReadMoreToggle}
                        >
                            {isReadMoreVisible ? "Read Less" : "Read More"}
                        </button>
                        {isReadMoreVisible && (
                            <div className="additional-text">
                                <p>
                                    Kindly note that we may need to record your details which may include your personal
                                    information... <a href="https://www.honda2wheelersindia.com/privacy-policy">Privacy Policy</a>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="submit-container">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!isToggleOn}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
