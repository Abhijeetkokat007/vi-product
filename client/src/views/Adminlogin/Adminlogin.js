import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Lock, Eye, EyeOff, Shield, 
    AlertCircle, Loader ,CheckCircle
} from 'lucide-react';
import './Adminlogin.css';
import Navbar from '../../component/Navbar/Navbar';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const navigate = useNavigate();
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 5) {
            newErrors.password = 'Password must be at least 5 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setServerMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/adminlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.username, 
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setServerMessage(data.message);
                navigate('/admindashboard');
                console.log('Login successful!');
            } else {
                setErrors({ submit: data.message || 'Failed to log in.' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ submit: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
       <>
        {/* <Navbar /> */}
        <div className="admin-login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Election Admin Portal</h1>
                    <p>Secure access to election management system</p>
                </div>
                
                <div className="login-body">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter your username"
                                />
                                <User size={20} />
                            </div>
                            {errors.username && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                />
                                {showPassword ? (
                                    <EyeOff
                                        size={20}
                                        onClick={() => setShowPassword(false)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        onClick={() => setShowPassword(true)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                            {errors.password && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="remember-forgot">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader className="loading" size={20} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Lock size={20} />
                                    Log In
                                </>
                            )}
                        </button>
                    </form>

                    {errors.submit && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            {errors.submit}
                        </div>
                    )}

                    {serverMessage && (
                        <div className="success-message">
                            <CheckCircle size={16} />
                            {serverMessage}
                        </div>
                    )}

                    <div className="security-notice">
                        <Shield size={16} />
                        <p>This is a secure system. All actions are logged and monitored.</p>
                    </div>
                </div>
            </div>
        </div>
       </>
    );
};
export default AdminLogin;