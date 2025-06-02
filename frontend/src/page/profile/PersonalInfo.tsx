import { useNavigate } from 'react-router-dom';
import '../../css/profile.css';
import '../../css/profileComponents.css';

interface PersonalInfoProps {
    userData: any;
}

const PersonalInfo = ({ userData }: PersonalInfoProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not provided';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Error formatting date';
        }
    };
    
    const getDisplayValue = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }
        return value;
    };

    return (
        <div className="tab-content">
            <div className="profile-info-list">
                <div className="profile-info-item">
                    <div className="profile-info-label">Date of Birth:</div>
                    <div className="profile-info-value">{formatDate(userData.dateOfBirth)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Phone Number:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.phoneNo)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Email:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.email)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Address:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.address)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Housing Type:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.housingType)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Occupation:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.occupation)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Petting Experience:</div>
                    <div className="profile-info-value">{getDisplayValue(userData.pettingExperience)}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Current Number of Pets at Home:</div>
                    <div className="profile-info-value">{userData.currentPets !== null ? userData.currentPets : 'Not provided'}</div>
                </div>
            </div>
            
            <button 
                className="profile-action-button" 
                onClick={() => navigate('/update-profile')}
            >
                Update Info
            </button>
        </div>
    );
};

export default PersonalInfo;
