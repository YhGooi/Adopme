import { useNavigate } from 'react-router-dom';
import '../../css/profile.css';
import '../../css/profileComponents.css';

const Donations = () => {
    const navigate = useNavigate();
    
    return (
        <div className="tab-content">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    No donation history found
                </div>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Your contributions help animals find their forever homes
                </p>
                <button 
                    className="profile-action-button"
                    onClick={() => navigate('/donation/Donation')}
                >
                    Make a Donation
                </button>
            </div>
        </div>
    );
};

export default Donations;
