import React from 'react'
import "./Sidebar.css"
import { Vote } from 'lucide-react'
function Sidebar() {
  const handleLogout = () => {
  // Clear user data (e.g., JWT token, user info)
  // localStorage.removeItem("token"); // or sessionStorage if used
  // localStorage.removeItem("user");  // optional, based on your app

  // Redirect to login or home page
  window.location.href = "/login"; // or "/"
};
  return (
    <div>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2> <Vote size={42} /> VoteSecure</h2>
        </div>

        <nav className="sidebar-nav">
          <a href="/admindashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            Dashboard
          </a>
          <a href="/addvoter" className="nav-item">
            <span className="nav-icon">👥</span>
            Add Voter
          </a>
          <a href="/adminelection" className="nav-item">
            <span className="nav-icon">🗳️</span>
            Elections
          </a>

          <a href="/applications" className="nav-item">
            <span className="nav-icon">📈</span>
            Applications
          </a>

          <a href="/result" className="nav-item">
            <span className="nav-icon">🈯</span>
            Results
          </a>
          <a href="/login" className="nav-item logoutbtn">
            <span className="nav-icon">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v9m6.364-5.364a9 9 0 11-12.728 0" />
            </svg>
            </span>
            Logout Admin
          </a>
          

        </nav>
      </aside>
    </div>
  )
}

export default Sidebar
