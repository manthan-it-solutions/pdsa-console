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
    const [ButtonToggle,setButtonToggle]  = useState(false)
 
    

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
 
   


    const [isDataReady, setIsDataReady] = useState(false); // Ensure data is ready before rendering



    const SelectDetails = async () => {
        try {
            const res = await apiCall({
                endpoint: "user/select_user_details_by_link",
                method: "post",
                payload: { id: id },
            });

            if (res.success) {

               if (res.data[0].feedback_date) {
    setButtonToggle(true);  // If feedback_date exists, set to true
} else {
    setButtonToggle(false); // Otherwise, set to false
}

               
                setFormData((prev) => ({
                    ...prev,
                    fullName: res.data[0].cust_name,
                    mobileNumber: res.data[0].mobile,
                    modelName: res.data[0].model_name,
                    dealer_name: res.data[0].dealer_name,
                    receivedInfo: res.data[0].feedback_answer1,
                    infoFormat: res.data[0].feedback_answer2,
                    simulator: res.data[0].feedback_answer3,
                    satisfaction: res.data[0].feedback_answer4,
                    deliveryExperience: res.data[0].feedback_answer5,
                    feedback_date: res.data[0].feedback_date,
                    
                }));
             
                
            } else {
                console.log("Error fetching user details");
            }
        } catch (error) {
            console.log("Error: ", error);
        }finally{
            setIsDataReady(false)
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
        setButtonToggle(true);
        
        // Check if formData is null or empty
        if (!formData || Object.keys(formData).length === 0) {
            alert("Form data is missing. Please fill out the form.");
            return;
        }
    
        // Destructure formData
        const {
            fullName,
            mobileNumber,
            modelName,
            dealer_name,
            simulator,
            satisfaction,
            deliveryExperience,
            receivedInfo,
            infoFormat,
        } = formData;
    
        // General mandatory field check with optional chaining and default empty string
        if (
            !fullName?.trim() ||
            !mobileNumber?.trim() ||
            !modelName?.trim() ||
            !simulator?.trim() ||
            !satisfaction?.trim() ||
            !deliveryExperience?.trim()
        ) {
            alert("Please fill out all mandatory fields.");
            return;
        }
    
        // Additional conditional validation for `receivedInfo` and `infoFormat`
        if (receivedInfo === "yes" && !infoFormat?.trim()) {
            alert("Please specify the information format as it's mandatory when 'Received Information' is 'Yes'.");
            return;
        }
    
        if (receivedInfo === "no" && infoFormat?.trim()) {
            alert("Information format is not required when 'Received Information' is 'No'. Please clear the value.");
            return;
        }
    
        console.log("Form Data: ", formData);

    
        try {
            // API call to submit the feedback
            const res = await apiCall({
                endpoint: "user/submit_feedback",
                method: "post",
                payload: { formData: formData, id: id },
            });
    
            if (res.success) {
                alert("Feedback submitted successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Reload after 1 second
            } else {
                alert("Failed to submit feedback. Please try again.");
                console.log("API response error: ", res.message);
            }
        } catch (error) {
            console.log("Error submitting feedback: ", error);
        }
    };
    
    

    useEffect(() => {
        SelectDetails();
    }, []);


        // Conditionally render content based on loading state
        if (isDataReady) {
            return <div>Loading...</div>; // Show a spinner or placeholder
        }

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

{formData.feedback_date ? (
    <form className="feedback-form">
        <div className="form-grid">
            <div className="form-group">
                <label>
                    Full Name<span className="required">*</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.fullName}
                    readOnly
                />
            </div>
            <div className="form-group">
                <label>
                    Mobile Number<span className="required">*</span>
                </label>
                <input
                    type="tel"
                    className="form-input"
                    value={formData.mobileNumber}
                    readOnly
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
                    className="form-input"
                    value={formData.modelName}
                    readOnly
                />
            </div>
            <div className="form-group">
                <label>
                    Dealership / Showroom Name<span className="required">*</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.dealer_name}
                    readOnly
                />
            </div>
        </div>

        <div className="form-questions">
            <div className="question-group">
                <label className="border_b">
                    1) Did you receive information on Road Safety Tips at the time of Delivery?
                </label>
                <div className="radio-group border_t">
                    <span>{formData.receivedInfo === 'yes' ? 'Yes' : 'No'}</span>
                </div>
            </div>

            {formData.receivedInfo === 'yes' && (
                <div className="question-group">
                    <label className="border_b">
                        2) In which form did you receive the Road Safety Tips?
                    </label>
                    <div className="border_t">
                        <span>{formData.infoFormat}</span>
                    </div>
                </div>
            )}

            <div className="question-group">
                <label className='border_b'>
                    3) Did you experience using the 2 Wheeler Riding Simulator / Riding Trainer in the Showroom?
                </label>
                <div className="border_t">
                    <span>{formData.simulator === 'yes' ? 'Yes' : 'No'}</span>
                </div>
            </div>

            <div className="question-group">
                <label className='border_b'>
                    4) Are you Satisfied with the overall Sales Experience?
                </label>
                <div className="border_t">
                    <span>{formData.satisfaction === 'yes' ? 'Yes' : 'No'}</span>
                </div>
            </div>

            <div className="question-group">
                <label className='border_b'>
                    5) Feedback on your Vehicle Delivery Experience
                </label>
                <div className="border_t">
                    <span>{formData.deliveryExperience}</span>
                </div>
            </div>
        </div>
    </form>
) : (
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
                value={formData.dealer_name}
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
                        checked={formData.receivedInfo === "yes"}
                        onChange={handleQuestion1Change}
                    />
                    <span>Yes</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        name="receivedInfo"
                        value="no"
                        checked={formData.receivedInfo === "no"}
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
                                checked={formData.infoFormat === option}
                                onChange={handleChange}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        )}
    </div>

    <div className="question-group">
            <label className='border_b'>
                3) Did you experience using the 2 Wheeler Riding Simulator / Riding Trainer in the Showroom?<span className="required">*</span>
            </label>
            <div className="radio-group border_t">
                <label className="radio-label">
                    <input type="radio" name="simulator"    value="yes" 
                     checked={formData.simulator === "yes"}
    onChange={handleChange} />
                  
                    <span>Yes</span>
                </label>
                <label className="radio-label">
                    <input type="radio" name="simulator"  value="no"
                     checked={formData.simulator === "no"}
    onChange={handleChange} />
                    <span>No</span>
                </label>
            </div>
        </div>
        <div className="question-group">
            <label className='border_b'>
                4) Are you Satisfied with the overall Sales Experience?<span className="required">*</span>
            </label>
            <div className="radio-group border_t">
                <label className="radio-label">
                    <input type="radio" name="satisfaction"  value="yes" 
                     checked={formData.satisfaction === "yes"}
                      onChange={handleChange} />
                    <span>Yes</span>
                </label>
                <label className="radio-label">
                    <input type="radio" name="satisfaction" 
                     value="no"
                     checked={formData.satisfaction === "no"} 
    onChange={handleChange}/>
                    <span>No</span>
                </label>
            </div>
        </div>
        <div className="question-group">
            <label className='border_b'>
                5) Feedback on your Vehicle Delivery Experience<span className="required">*</span>
            </label>
            <div className="radio-group border_t">
                {[
                    'Excellent',
                    'Very Good',
                    'Fair',
                    'Poor',
                    'Needs Improvement'
                ].map((option) => (
                    <label key={option} className="radio-label">
                        <input type="radio" name="deliveryExperience" value={option}
                         checked={formData.deliveryExperience === option}
                           onChange={handleChange} />
                        <span>{option}</span>
                     
                    </label>
                ))}
            </div>
        </div>
    

    <div className="terms-group">
        <label className="toggle-label">
            <input
                type="checkbox"
                className="toggle-input"
                checked={isToggleOn}
                onChange={handleToggleChange}
                disabled={ButtonToggle}
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
                    Kindly note that we may need to record your details which may include your personal information. Personal Information means any information that may be used to identify an individual. This includes but is not limited to: first and last name, email address, telephone number, title, gender, needed to provide a service you have requested. You do hereby give your consent to us to store, process and use your information for our business and promotional purposes. You also give your consent to us to disclose your information to any other party for our business or other promotional purpose or, if it is required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to court orders, or other legal process. You shall always have the right to withdraw this consent at any point of time as per Privacy Policy of the Company published at HMSI website. Please visit the following link to check the Privacy Policy <a href="https://www.honda2wheelersindia.com/privacy-policy" target="_blank">https://www.honda2wheelersindia.com/privacy-policy</a>
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
)}




          
            </div>
        </div>
    );
};

export default Feedback;
