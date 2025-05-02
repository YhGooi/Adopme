import React, { useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            alert('Please fill in all fields.');
            return;
        }
        console.log('Logging in with:', form);
        // Future: Call API here
    };

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh',
            backgroundColor: '#faf1e2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '400px', 
                padding: '2rem', 
                margin: '0 1rem', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#000' // Makes all text black
            }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email:</label><br />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Password:</label><br />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;