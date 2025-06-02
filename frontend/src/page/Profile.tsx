import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../store/auth.store';
import '../css/profile.css';
import '../css/appointments.css';
import '../css/profileComponents.css';
import PersonalInfo from './profile/PersonalInfo';
import Appointments from './profile/Appointments';
import AdoptionRequests from './profile/AdoptionRequests';
import Donations from './profile/Donations';

// Define interface for AppointmentResponse
interface AppointmentResponse {
    id: number;
    userId: number;
    petId: number;
    appointmentDateTime: string;
    status: 'REQUESTED' | 'CONFIRMED' | 'DECLINED' ;
    createdAt: string;
    updatedAt: string;
}

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState({} as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [appointmentsError, setAppointmentsError] = useState('');
    
    const authStore = useAuthStore();
    const userStore = user_details(state => state);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!authStore.token || !authStore.isLogin) {
            navigate('/login');
            return;
        }
        
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

        // Fetch user appointments
        const fetchUserAppointments = async () => {
            try {
                setAppointmentsLoading(true);
                if (!userStore.id) {
                    throw new Error('User ID is missing. Please log in again.');
                }
                
                const response = await fetch(`http://localhost:8080/appointment/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': String(userStore.id),
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Appointments fetched:', data);
                setAppointments(data);
            } catch (err: any) {
                console.error('Error fetching appointments:', err);
                setAppointmentsError(err.message || 'Failed to load appointments');
            } finally {
                setAppointmentsLoading(false);
            }
        };

        fetchUserData();
        fetchUserAppointments();
    }, [authStore.token, authStore.isLogin, navigate, userStore.id]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
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
                {activeTab === 'personal' && <PersonalInfo userData={userData} />}
                
                {activeTab === 'appointments' && 
                    <Appointments 
                        appointments={appointments} 
                        loading={appointmentsLoading} 
                        error={appointmentsError} 
                    />
                }
                
                {activeTab === 'requests' && <AdoptionRequests />}
                
                {activeTab === 'donations' && <Donations />}
            </div>
        </div>
    );
};

export default Profile;