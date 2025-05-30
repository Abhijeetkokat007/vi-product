import React, { useEffect, useState } from 'react';
import { Vote, LogIn, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const ProfilePopup = ({ user, onLogout }) => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="profile-popup">
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="initials">{user.firstName[0]}{user.lastName[0]}</div>
          </div>
          <div className="profile-details">
            <h3>{`${user.firstName} ${user.lastName}`}</h3>
            <p>{user.email}</p>
            <p>Student ID: {user.studentId}</p>
          </div>
        </div>
        <button className="logout-button btn-primary btn" onClick={handleLogout}>
          Logout
        </button>
        {showLogoutConfirmation && (
          <div className="logout-confirmation">
            <h4>Are you sure you want to logout?</h4>
            <div className="confirmation-buttons">
              <button onClick={confirmLogout}>Yes, Logout</button>
              <button onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Navbar() {
  const [user, setUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is in local storage
    const storedUser = localStorage.getItem('voter');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage and redirect to the login page
    localStorage.removeItem('voter');
    setUser(null);
    setShowProfilePopup(false);
    navigate('/login');
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup((prevState) => !prevState);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="nav">
      <div className="nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Vote size={24} />
          </div>
          <span>VoteSecure</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/elections" className="nav-link">
            Elections
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        {user ? (
          <div className="profile-container">
            <div className="profile-button" onClick={toggleProfilePopup}>
              <div className="profile-avatar">
                <div className="initials">{user.firstName[0]}{user.lastName[0]}</div>
              </div>
              <div className="voter-name">{user.firstName} {user.lastName}</div>
            </div>
            {showProfilePopup && (
              <ProfilePopup user={user} onLogout={handleLogout} />
            )}
          </div>
        ) : (
          <button className="login-buttons" onClick={handleLoginClick}>
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;