import React, { useState,useEffect } from 'react';
import '../../css/Feedback.css';
import logo from "../../Assets/images/logo1.png"
import GoogleTranslateWidget from '../../GoogleTranslateWidget';
import { useLocation } from 'react-router-dom';
import { apiCall } from '../../services/authServieces';






const Feedback = () => {
    const location = useLocation();
    const [isToggleOn, setIsToggleOn] = useState(false);
    const [isReadMoreVisible, setIsReadMoreVisible] = useState(false);
    const [showQuestion2, setShowQuestion2] = useState(true);

    const handleQuestion1Change = (e) => {
        setShowQuestion2(e.target.value === "yes");
    };

    const handleToggleChange = () => {
        setIsToggleOn(!isToggleOn);
    };
    const handleReadMoreToggle = () => {
        setIsReadMoreVisible(!isReadMoreVisible);
    };

    // Extract the id from the query parameters
        // Extract the id from the query parameters
        const params = new URLSearchParams(location.search);
        const id = params.get('id');

    const SelectDetails=()=>{
try {
    
const res= apiCall({
    endpoint:"user/select_user_details_by_link",
    method:"post",
    payload:{id:id}
})

if(res.success){
   
    console.log('res.data: ', res.data);

}
else{
    console.log('error');
}

} catch (error) {
    console.log('error: ', error);
    
}

}
   
      


     

  

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
        termsAgreed: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };


useEffect(() => {
    SelectDetails()
}, [])

 

    return (
        <div className="feedback-container">
            <div className="feedback-wrapper">
                <div className="header_f">
                    <img src={logo} alt="Honda Logo" className="logo_f" />
                    <h1 className="title">Safety Advice Feedback Form</h1>
                    <div className="language-selector">
                        {/* <label>Select Language</label> */}
                        {/* <select defaultValue="english">
                            <option value="english">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Marathi">Marathi</option>
                        </select> */}
                        <GoogleTranslateWidget />
                    </div>
                </div>

                <div className="description">
                    <span>Dear Sir,</span>
                    <p className='para_f'>
                        We are thankful to you for spending little time for us while filling this feedback form.
                        Your valuable inputs will enable us for continuous improvement of our service quality.
                        Thanking you once again.
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
                                value="SANJAY PUNETHA"
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
                                value="7500227501"
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
                                value="ACTIVA 125 OBD2"
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
                                value="AAKASH VISHAL MOTORS PRIVATE LIMITE"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-questions">
                        <div className="question-group">
                            <label className='border_b'>
                                1) Did you receive information on Road Safety Tips at the time of Delivery through Leaflet / Verbal / Video / Mail / Message / Physical Demonstration on Vehicle?<span className="required">*</span>
                            </label>
                            <div className="radio-group border_t">
                                <label className="radio-label">
                                    <input type="radio" name="receivedInfo" onChange={handleQuestion1Change} value="yes" />
                                    <span>Yes</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="receivedInfo" onChange={handleQuestion1Change} value="no" />
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
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Whatsapp Message with Video Link</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Text Message with Video Link</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Video on Whatsapp</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Demonstration on Vehicle</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Road Safety Leaflet</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Through Mail</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="infoFormat" />
                                        <span>Verbal</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="question-group">
                            <label className='border_b'>
                                3) Did you experience using the 2 Wheeler Riding Simulator / Riding Trainer in the Showroom?<span className="required">*</span>
                            </label>
                            <div className="radio-group border_t">
                                <label className="radio-label">
                                    <input type="radio" name="simulator" />
                                    <span>Yes</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="simulator" />
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
                                    <input type="radio" name="satisfaction" />
                                    <span>Yes</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="simulator" />
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
                                        <input type="radio" name="deliveryExperience" />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="terms-group">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                className="toggle-input"
                                checked={isToggleOn}
                                onChange={handleToggleChange}
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
            </div>
        </div>
    );
};

export default Feedback;