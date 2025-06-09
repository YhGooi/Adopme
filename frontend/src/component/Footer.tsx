import '../css/shared/footer.css';
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-column">
                <h4>Adoption</h4>
                <ul>
                    <li><Link to="#">Browse Listing.</Link></li>
                    <li><Link to="#">How To Adopt.</Link></li>
                    <li><Link to="#">FAQ.</Link></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Support</h4>
                <ul>
                    <li><Link to="#">Donation</Link></li>
                    <li><Link to="#">Be a Volunteer</Link></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Adopme</h4>
                <ul>
                    <li><Link to="#">About Us</Link></li>
                    <li><Link to="#">Campaigns</Link></li>
                    <li><Link to="#">Send Us Feedback</Link></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Contact Us</h4>
                <ul>
                    <li><Link to="#">adopme.shelter@gmail.com</Link></li>
                    <li><Link to="#">+6012-3456789 (John)</Link></li>
                    <li><Link to="#">1, Lorong AdopMe, Taman Adopme,<br></br>12345 Selangor, Malaysia</Link></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;