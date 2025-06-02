import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../store/auth.store';
import '../css/common.css';
import '../css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore((state) => state) as any;
    const userStore = user_details((state) => state) as any;
    
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState({
        name: '',
        dateOfBirth: '',
        phoneNo: '', // Changed to match store property name
        email: '',
        address: '',
        housingType: '',
        occupation: '',
        pettingExperience: '',
        currentPets: 0 // Changed to match store property name
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if user is logged in
        if (!authStore.token || !authStore.isLogin) {
            navigate('/login');
            return;
        }
        
        // Debug - log the current state of the user store
        console.log('Current user ID in store:', userStore.id);
        
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
                console.log('User data fetched successfully:', data);
                setUserData(data);
                
                // Update store with latest data if needed
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        userStore.set(key, data[key]);
                    }
                }
                console.log('User store updated:', userStore);
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [authStore.token, authStore.isLogin, navigate, userStore.id]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
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
            <div className="profile-container">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>
                        Loading profile data...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
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
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2 className="profile-name">{userData.name || 'User Profile'}</h2>
                
                <div className="profile-tabs">
                    <div 
                        className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('personal')}
                    >
                        Personal Information
                    </div>
                    <div 
                        className={`profile-tab ${activeTab === 'appointments' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('appointments')}
                    >
                        Appointments
                    </div>
                    <div 
                        className={`profile-tab ${activeTab === 'requests' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('requests')}
                    >
                        Adoption Requests
                    </div>
                    <div 
                        className={`profile-tab ${activeTab === 'donations' ? 'active' : ''}`} 
                        onClick={() => handleTabClick('donations')}
                    >
                        Donation
                    </div>
                </div>
            </div>

            <div className="profile-content">
                {/* Personal Information Tab */}
                <div className={`tab-content ${activeTab === 'personal' ? 'active' : ''}`}>
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

                {/* Appointments Tab */}
                <div className={`tab-content ${activeTab === 'appointments' ? 'active' : ''}`}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                            No appointments scheduled yet
                        </div>
                        <p style={{ color: '#888', marginBottom: '30px' }}>
                            Schedule a visit to meet your future pet today!
                        </p>
                        <button className="profile-action-button">
                            Schedule Visit
                        </button>
                    </div>
                </div>

                {/* Adoption Requests Tab */}
                <div className={`tab-content ${activeTab === 'requests' ? 'active' : ''}`}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                            No adoption requests found
                        </div>
                        <p style={{ color: '#888', marginBottom: '30px' }}>
                            Browse our pets and submit an adoption request
                        </p>
                        <button className="profile-action-button">
                            Find a Pet
                        </button>
                    </div>
                </div>

                {/* Donations Tab */}
                <div className={`tab-content ${activeTab === 'donations' ? 'active' : ''}`}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                            No donation history found
                        </div>
                        <p style={{ color: '#888', marginBottom: '30px' }}>
                            Your contributions help animals find their forever homes
                        </p>
                        <button className="profile-action-button">
                            Make a Donation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;