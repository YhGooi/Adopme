import React, { useState } from 'react';

import { useAuthStore } from '../store/auth.store';
import { user_details } from '../store/auth.store';

import '../css/common.css';
import '../css/login.css';

const Login: React.FC = () => {
    const authStore = useAuthStore((state) => state) as any
    const userStore = user_details((state) => state) as any

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.set(e.target.name, e.target.value)
    };

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
            authStore.set("type", type);
            authStore.set("isLogin", true);

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    userStore.set(key, data[key]);
                }
            }

            // Redirect or update UI
            alert('Login successful!');
            // navigate('/dashboard'); // if using react-router
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password.');
            authStore.logout();
        }
    };

    //remain here first
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
            {/* Container for left and right panel*/}
            <div className="login-panel-container">
                {/* Login Form Panel */}
                <div className='login-panel'>
                    <h2>LOGIN</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email</label><br/>
                            <input
                                type="email" name="email"
                                value={authStore.email}
                                onChange={handleChange}
                                required
                                placeholder="john@gmail.com"
                            />
                        </div>
                        <div>
                            <label>Password</label><br/>
                            <input
                                type="password" name="password"
                                value={authStore.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button> Login </button>
                    </form>
                </div>

                {/* Sign Up Side Panel */}
                <div className="login-side-panel">
                    <h2>NEW TO US?</h2>
                    <button>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Login;