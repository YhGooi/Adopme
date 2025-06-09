import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import '/src/css/appointment/appointmentSuccess.css';

const SuccessAppointment = () => {
  return (
    <div className="appointment-success-container">
      <div className="success-card">
        <CheckCircle
          className="success-icon"
          strokeWidth={1.5}
        />

        <h2 className="success-title">Appointment Submitted!</h2>

        <p className="success-message">
          We will process your appointment and update you through email once it's confirmed. See you soon!
        </p>

        <Link
          to="/"
          className="back-home-link"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessAppointment;
