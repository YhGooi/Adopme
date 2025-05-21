import React, { useState } from 'react';

import { useAuthStore } from '../store/auth.store';

import '../css/common.css';

// type LoginForm = {
//     email: string;
//     password: string;
// };

const Login: React.FC = () => {
    const authStore = useAuthStore((state) => state) as any

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authStore.email || !authStore.password) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: authStore.email,
                    password: authStore.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            const token = data.token;
            const type = data.type;
            
            authStore.set("token", token);
            authStore.set("isLogin", true);
            authStore.set("type", type);

            // Redirect or update UI
            alert('Login successful!');
            // navigate('/dashboard'); // if using react-router
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password.');
            authStore.logout();
        }
    };

    const fetchData = async () => {
        const token = authStore.token;
        if (!token) return alert('No token found');
    
        try {
            const res = await fetch(`http://localhost:8080/Token/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token,
                },
                body: JSON.stringify({
                    email: authStore.email
                }),
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            console.log('Success:', data);
        } catch (e: any) {
            console.error('Fetch error:', e.message);
            alert(e.message);
        }
    };

    return (
        <div className="common_theme">
            <div className="green_container">
                <a className="back-link" href="#">&#x3C; Already have an account?</a>
                <div className="center">
                <h2>SIGN UP</h2>
                    <label>Name</label>
                    <input type="text" id="name" placeholder="John Smith"  />

                    <label>Date of Birth</label>
                    <select id="dob" >
                    <option>01 Jan 2025</option>
                    {/* Add more options if needed */}
                    </select>

                    <label>Phone Number</label>
                    <input type="tel" id="phone" placeholder="+60123456789"  />

                    <label>Residential Address</label>
                    <textarea id="address"  placeholder="1, Jalan Satu, 42000 Selangor, Malaysia." ></textarea>

                    <label>Housing Type</label>
                    <input type="text" id="housing" placeholder="Condominium"  />

                    <label>Occupation</label>
                    <input type="text" id="occupation" placeholder="Student"  />

                    <label>Petting Experience</label>
                    <select id="experience" >
                        <option>I have never had any pet before.</option>
                        {/* Add more options here if needed */}
                    </select>

                    <label>Current Number of Pets at Home</label>
                    <input type="number" id="pets" placeholder="1" min="0"  />

                    <label>Email</label>
                    <input type="email" id="email" placeholder="john@gmail.com" />

                    <label>Password</label>
                    <input type="password" id="password" placeholder="Enter your password here..." />

                    <label>Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm your password here..." />
                    <br/>
                    <button type="submit">Register</button>
                </div>
            </div>
        </div>
  );
};

export default Login;