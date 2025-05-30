import React, { useState } from 'react';
import './Login.css';
import Navbar from '../../component/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLogin from '../Adminlogin/Adminlogin';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/voter/login', formData);
      localStorage.setItem('voter', JSON.stringify(response.data.voter));
      setShowSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        {showSuccess && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-content">
                <h3 className="modal-title">Login Successful!</h3>
                <p className="modal-message">You have successfully logged into your account.</p>
                <button
                  onClick={handleContinue}
                  className="modal-button"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of your existing login form JSX */}
        <div className="login-content">
          <div className="login-left">
            {/* <div className="college-brand">
              <div className="logo">
                <span className="logo-text">CV</span>
              </div>
              <h2>College Voting Portal</h2>
            </div>
            <div className="login-welcome">
              <h1>Welcome Back!</h1>
              <p>Exercise your right to vote and make your voice heard in college elections.</p>
            </div> */}
            <AdminLogin/>
          </div>

          <div className="login-right">
            <div className="login-box">
              <h2>Sign In</h2>
              <p className="login-subtitle">Use your student credentials to login</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-container">
                    <i className="icon user-icon">👤</i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-container">
                    <i className="icon lock-icon">🔒</i>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="remember-forgot">
                  <label className="checkbox-container">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                  type="submit"
                  className={`login-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="help-section flex justify-between">
              <p> <Link >Forgot Password?</Link></p>
                {/* <p>For Admin? <Link to='/adminlogin'>Admin</Link></p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;