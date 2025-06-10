import { Link } from 'react-router-dom';
import '../../css/shared/success.css';

const SuccessDonation = () => {
    return (
        <div className="success-container">
            <div className="success-header">
                <div className="success-checkmark">✓</div>
                <h1>Donation Submitted!</h1>
                <p>
                    Thank you so much for your support! We will process your donation soon 
                    and it will reflect in your donation histories!
                </p>
                <div className="back-home-link-container">
                    <Link
                        to="/"
                        className="back-home-link"
                        >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessDonation;