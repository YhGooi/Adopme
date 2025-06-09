import React, { useState,useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { user_details } from '../store/auth.store';
import '../css/shared/common.css';

const Register: React.FC = () => {
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
        password: '',
        confirmPassword: '',
    });

    // Populate form if logged in
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
                password: '',
                confirmPassword: '',
            });
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (!formData.housingType) {
            alert("Please select a valid housing type.");
            return;
        }
        try {
            const url = authStore.isLogin
            ? 'http://localhost:8080/user/update'
            : 'http://localhost:8080/user/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();

            if (authStore.isLogin) {
            alert('Registration successful!');
                alert('Profile updated successfully!');
                // Update user store with new data
                userStore.set('name', formData.name);
                userStore.set('dob', formData.dateOfBirth);
                userStore.set('phone', formData.phoneNo);
                userStore.set('email', formData.email);
                userStore.set('address', formData.address);
                userStore.set('housing', formData.housingType);
                userStore.set('occupation', formData.occupation);
                userStore.set('experience', formData.pettingExperience);
                userStore.set('pets', formData.currentPets);
            } else {
                // Store relevant data into auth store
                userStore.set('name', formData.name);
                userStore.set('dateOfBirth', formData.dateOfBirth);
                userStore.set('phone', formData.phoneNo);
                userStore.set('email', formData.email);
                userStore.set('address', formData.address);
                userStore.set('housing', formData.housingType);
                userStore.set('occupation', formData.occupation);
                userStore.set('pettingExperience', formData.pettingExperience);
                userStore.set('currentPets', formData.currentPets);
                userStore.set('type', 'USERS');

                authStore.set('isLogin', true);
                authStore.set('token', data.token);
                authStore.set('user', 'USER');
            }
            // navigate('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            alert(error.message || 'Something went wrong during registration.');
        }
    };

    return (
        <div className="common_theme">
            <div className="green_container">
                {!authStore.isLogin && (<a className="back-link" href="#">&#x3C; Already have an account?</a>) }
                <form className="center" onSubmit={handleSubmit}>
                    <h2>{authStore.isLogin ? 'UPDATE PROFILE' : 'SIGN UP'}</h2>

                    <label>Name</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" />

                    <label>Date of Birth</label>
                    <input type="date" id="dateOfBirth" value={formData.dateOfBirth} required onChange={handleChange}/>

                    <label>Phone Number</label>
                    <input type="tel" id="phoneNo" value={formData.phoneNo} onChange={handleChange} required placeholder="+60123456789" />

                    <label>Residential Address</label>
                    <textarea id="address" value={formData.address} onChange={handleChange} required placeholder="1, Jalan Satu, 42000 Selangor, Malaysia." />

                    <label>Housing Type</label>
                    <select id="housingType" value={formData.housingType} onChange={handleChange} required>
                        <option value="">Select Housing Type</option>
                        <option value="LANDED">LANDED</option>
                        <option value="CONDO">CONDO</option>
                        {/* Add more */}
                    </select>

                    <label>Occupation</label>
                    <input type="text" id="occupation" value={formData.occupation} onChange={handleChange} placeholder="Student" />

                    <label>Petting Experience</label>
                    <select id="pettingExperience" value={formData.pettingExperience} required onChange={handleChange}>
                        <option value="">Select experience</option>
                        <option value="NONE">NONE</option>
                        <option value="LITTLE">LITTLE</option>
                        <option value="SOME">SOME</option>
                        <option value="LOT">LOT</option>
                        {/* Add more */}
                    </select>

                    <label>Current Number of Pets at Home</label>
                    <input type="number" id="currentPets" value={formData.currentPets} required onChange={handleChange} min="0" />

                    <label>Email</label>
                    <input type="email" id="email" value={formData.email} required onChange={handleChange} placeholder="john@gmail.com" />

                    <label>Password</label>
                    <input type="password" id="password" value={formData.password} required onChange={handleChange} placeholder="Enter your password here..." />

                    <label>Confirm Password</label>
                    <input type="password" id="confirmPassword" value={formData.confirmPassword} required onChange={handleChange} placeholder="Confirm your password here..." />

                    <br />
                    <button type="submit">{authStore.isLogin ? 'Update' : 'Register'}</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
