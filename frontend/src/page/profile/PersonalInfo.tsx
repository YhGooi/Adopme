import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../../store/auth.store';
import '../../css/profile/personalInfo.css';
import '../../css/profile/profileComponents.css';

const PersonalInfo = () => {
    const [userData, setUserData] = useState({} as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const userStore = user_details(state => state);

    useEffect(() => {
        fetchUserData();
    }, [authStore.token, userStore.id]);

    // Fetch user profile data
    const fetchUserData = async () => {
        try {
            setLoading(true);
            // Check if userId exists in the store before making the request
            if (!userStore.id) {
                throw new Error('User ID is missing. Please log in again.');
            }
            
            const response = await fetch('http://localhost:8080/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': String(userStore.id), // Ensure userId is converted to string
                    'Authorization': `Bearer ${authStore.token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUserData(data);
            
            // Update store with latest data if needed
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    userStore.set(key, data[key]);
                }
            }
        } catch (err: any) {
            console.error('Error fetching user data:', err);
            setError(err.message || 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>
                    Loading profile data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
                    Error loading profile
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    {error}
                </div>
                <button 
                    className="profile-action-button" 
                    style={{ marginTop: '20px' }}
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

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
                onClick={() => navigate('/signup')}
            >
                Update Info
            </button>
        </div>
    );
};

export default PersonalInfo;
