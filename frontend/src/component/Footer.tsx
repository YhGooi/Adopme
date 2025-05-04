import '../css/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-column">
                <h4>Adoption</h4>
                <p>Browse Listing.</p>
                <p>How To Adopt.</p>
                <p>FAQ.</p>
            </div>
            <div className="footer-column">
                <h4>Support</h4>
                <p>Donation</p>
                <p>Be a Volunteer</p>
            </div>
            <div className="footer-column">
                <h4>Adopme</h4>
                <p>About Us</p>
                <p>Campaigns</p>
                <p>Send Us Feedback</p>
            </div>
            <div className="footer-column">
                <h4>Contact Us</h4>
                <ul>
                    <li><a href="#">adopme.shelter@gmail.com</a></li>
                    <li><a href="#">+6012-3456789 (John)</a></li>
                    <li><a href="#">1, Lorong AdopMe, Taman Adopme,<br></br>12345 Selangor, Malaysia</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;