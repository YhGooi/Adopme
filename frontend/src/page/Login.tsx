import React, { useState } from 'react';

import { useAuthStore } from '../store/auth.store';

import '../css/common.css';
import '../css/login.css';

// type LoginForm = {
//     email: string;
//     password: string;
// };

const Login: React.FC = () => {
    // const [form, setForm] = useState<LoginForm>({ email: '', password: '' });

    const authStore = useAuthStore((state) => state) as any

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        authStore.set(e.target.name, e.target.value)
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!authStore.email || !authStore.password) {
            alert('Please fill in all fields.');
            return;
        }
        console.log('Logging in with:', authStore);
        // Future: Call API here
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
                    <button> Sign Up </button>
                </div>
            </div>
        </div>
    );
};

export default Login;