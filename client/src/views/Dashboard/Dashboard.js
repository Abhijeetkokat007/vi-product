import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from '../../component/Sidebar/Sidebar';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [stats, setStats] = useState({
    totalVoters: 0,
    activeElections: 0,
    votesRecorded: 0,
    voterTurnout: "0%"
  });

  const recentVotes = [
    { id: 1, election: "Student Body President", time: "2 minutes ago", department: "Student Council" },
    { id: 2, election: "Engineering Department Head", time: "5 minutes ago", department: "Engineering" },
    { id: 3, election: "Student Body President", time: "8 minutes ago", department: "Student Council" },
    { id: 4, election: "Engineering Department Head", time: "12 minutes ago", department: "Engineering" },
    { id: 5, election: "Student Body President", time: "15 minutes ago", department: "Student Council" }
  ];

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:5000/elections');
      if (!response.ok) {
        throw new Error('Failed to fetch elections');
      }
      const data = await response.json();
      setElections(data);
      
      // Calculate stats based on fetched data
      const activeElections = data.filter(election => election.status === "Active").length;
      const totalVoters = data.reduce((sum, election) => sum + (election.voters || 0), 0);
      const totalVotes = data.reduce((sum, election) => sum + (election.voters * (parseFloat(election.turnout) / 100) || 0), 0);
      const avgTurnout = data.length > 0 
        ? (data.reduce((sum, election) => sum + (parseFloat(election.turnout) || 0), 0) / data.length).toFixed(1) + "%"
        : "0%";

      setStats({
        totalVoters,
        activeElections,
        votesRecorded: Math.round(totalVotes),
        voterTurnout: avgTurnout
      });
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this election?');
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/elections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete election');
      }

      // Remove the deleted election from the state
      setElections(prevElections => prevElections.filter(election => election._id !== id));
      
      // Show success message
      alert('Election deleted successfully');
      
      // Refresh stats
      fetchElections();
    } catch (error) {
      console.error('Error deleting election:', error);
      alert('Failed to delete election: ' + error.message);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar/>
      <main className="main-content">
        <header className="content-header">
          <div className="header-user">
            <div className="user-profile">
              <span>Admin Dashboard</span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
     

        {/* Elections Table */}
        <section className="content-section">
          <div className="section-header">
            <h2>Active & Upcoming Elections</h2>
            <Link to='/eleform'><button className="btn-primary button">Create Election</button></Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Election Title</th>
                  <th>Description</th>
                  <th>Nomination Period</th>
                  <th>Campaign Period</th>
                  <th>Voting Period</th>
                  <th>Result Declaration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map(election => (
                  <tr key={election._id}>
                    <td className="election-title">{election.title}</td>
                    <td>{election.description}</td>
                    <td>{new Date(election.nominationPeriod).toLocaleDateString()}</td>
                    <td>{new Date(election.campaignPeriod).toLocaleDateString()}</td>
                    <td>{new Date(election.votingPeriod).toLocaleDateString()}</td>
                    <td>{new Date(election.resultDeclaration).toLocaleDateString()}</td>
                    <td className="actions">
                      
                      <button 
                        className="btn-icon" 
                        title="Delete"
                        onClick={() => handleDelete(election._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity */}
        
      </main>
    </div>
  );
};

export default AdminDashboard;