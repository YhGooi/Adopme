import { useNavigate } from 'react-router-dom';
import '../../css/profile.css';
import '../../css/profileComponents.css';

const AdoptionRequests = () => {
    const navigate = useNavigate();
    
    return (
        <div className="tab-content">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    No adoption requests found
                </div>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Browse our pets and submit an adoption request
                </p>
                <button 
                    className="profile-action-button"
                    onClick={() => navigate('/pet_listing')}
                >
                    Find a Pet
                </button>
            </div>
        </div>
    );
};

export default AdoptionRequests;
