import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';

import { AuthContext } from '../context/auth-context';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/auth/login', formData);
            // Adjust as per your API response
            login(res.data.token, { email: formData.email, name: res.data.name, role: res.data.role });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="card form-card">
            <h2 className="form-title">Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>
                <button type="submit" className="button full-width">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
