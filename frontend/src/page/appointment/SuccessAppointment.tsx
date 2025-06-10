import { Link } from 'react-router-dom';
import '../../css/shared/success.css';

const SuccessAppointment = () => {
  return (
    <div className="success-container">
            <div className="success-header">
                <div className="success-checkmark">✓</div>
                <h1>Appointment Submitted!</h1>
                <p>
                    We will process your appointment and update you once it's confirmed. See you soon!
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

export default SuccessAppointment;
