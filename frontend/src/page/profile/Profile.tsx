import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../../store/auth.store';
import '../../css/profile/profileComponents.css';
import PersonalInfo from './PersonalInfo';
import Appointments from './Appointments';
import AdoptionRequests from './AdoptionRequests';
import Donations from './Donations';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const authStore = useAuthStore();
    const userStore = user_details(state => state);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!authStore.token || !authStore.isLogin) {
            navigate('/login');
            return;
        }
    }, [authStore.token, authStore.isLogin, navigate]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2 className="profile-name">
                    {userStore.name ? `${userStore.name}` : 'User Profile'}
                </h2>
                
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
                        Donations
                    </div>
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'personal' && <PersonalInfo />}
                
                {activeTab === 'appointments' && <Appointments />}
                
                {activeTab === 'requests' && <AdoptionRequests />}
                
                {activeTab === 'donations' && <Donations />}
            </div>
        </div>
    );
};

export default Profile;