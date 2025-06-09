import { Link } from "react-router-dom";
import '../../css/donation/successDonation.css';

const SuccessDonation = () => {
    return (
        <div className="success-page">
            {/*top title */}
            <div className="success-header">
                <div className="success-checkmark">✓</div>
                <h1>Donation Submitted!</h1>
                <p>
                    Thank you so much for your support! We will process your donation soon 
                    and it will reflect in your donation histories!
                </p>
                
            </div>

            
            <div className="divider"></div>
        </div>
    );
};

export default SuccessDonation;