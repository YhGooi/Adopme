import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { user_details } from '../../store/auth.store';
import '../../css/shared/common.css';
import '../../css/profile/profileComponents.css';
import '../../css/profile/updateProfile.css';

const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore((state) => state) as any;
    const userStore = user_details((state) => state) as any;

    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        phoneNo: '',
        address: '',
        housingType: '',
        occupation: '',
        pettingExperience: '',
        currentPets: 0,
        email: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Populate form with user data
    useEffect(() => {
        if (authStore.isLogin) {
            setFormData({
                name: userStore.name || '',
                dateOfBirth: userStore.dateOfBirth || '',
                phoneNo: userStore.phoneNo || '',
                address: userStore.address || '',
                housingType: userStore.housingType || '',
                occupation: userStore.occupation || '',
                pettingExperience: userStore.pettingExperience || '',
                currentPets: userStore.currentPets || 0,
                email: userStore.email || '',
            });
        } else {
            // Redirect to login if not logged in
            navigate('/login');
        }
    }, [authStore.isLogin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'currentPets' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.housingType) {
            alert("Please select a valid housing type.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8080/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Update failed');
            }

            // Update user store with new data
            userStore.set('name', formData.name);
            userStore.set('dateOfBirth', formData.dateOfBirth);
            userStore.set('phone', formData.phoneNo);
            userStore.set('email', formData.email);
            userStore.set('address', formData.address);
            userStore.set('housingType', formData.housingType);
            userStore.set('occupation', formData.occupation);
            userStore.set('pettingExperience', formData.pettingExperience);
            userStore.set('currentPets', formData.currentPets);

            setSuccessMessage('Profile updated successfully!');

            // Navigate back to profile after a brief delay to show success message
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error: any) {
            console.error('Update error:', error);
            setError(error.message || 'Something went wrong during profile update.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="common_theme">
            <div className="green_container update-profile-container">
                <a className="back-link" onClick={() => navigate('/profile')}>&#x3C; &nbsp; Back to Profile</a>
                <form className="center update-profile-form" onSubmit={handleSubmit}>
                    <h2>UPDATE PROFILE</h2>

                    {error && (
                        <div className="update-profile-error">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="update-profile-success">
                            {successMessage}
                        </div>
                    )}

                    <label>Name</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" />

                    <label>Date of Birth</label>
                    <input type="date" id="dateOfBirth" value={formData.dateOfBirth} required onChange={handleChange} />

                    <label>Phone Number</label>
                    <input type="tel" id="phoneNo" value={formData.phoneNo} onChange={handleChange} required placeholder="+60123456789" />

                    <label>Residential Address</label>
                    <textarea id="address" value={formData.address} onChange={handleChange} required placeholder="1, Jalan Satu, 42000 Selangor, Malaysia." />

                    <label>Housing Type</label>
                    <select id="housingType" value={formData.housingType} onChange={handleChange} required>
                        <option value="">Select Housing Type</option>
                        <option value="LANDED">Landed Property</option>
                        <option value="CONDO">Condominium/Apartment</option>
                    </select>

                    <label>Occupation</label>
                    <input type="text" id="occupation" value={formData.occupation} onChange={handleChange} placeholder="Student" />

                    <label>Petting Experience</label>
                    <select id="pettingExperience" value={formData.pettingExperience} required onChange={handleChange}>
                        <option value="">Select experience</option>
                        <option value="NONE">No Experience</option>
                        <option value="LITTLE">Little Experience</option>
                        <option value="SOME">Some Experience</option>
                        <option value="LOT">Experienced Pet Owner</option>
                    </select>

                    <label>Current Number of Pets at Home</label>
                    <input type="number" id="currentPets" value={formData.currentPets} required onChange={handleChange} min="0" />

                    <label>Email</label>
                    <input type="email" id="email" value={formData.email} required onChange={handleChange} placeholder="john@gmail.com" readOnly />

                    <br />
                    <div className="profile-action-button">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
