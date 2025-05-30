import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, BuildingIcon, ChartBarIcon, TrophyIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './Result.css';
import Sidebar from '../../component/Sidebar/Sidebar';

const Result = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/get-voting');
        const data = await response.json();

        if (response.ok && data.success) {
          const completedElections = data.data
            .filter(election => new Date(election.endDate) < new Date())
            .map(election => ({
              ...election,
              winner: determineWinner(election.candidates)
            }))
            .reverse(); // Reverse the array to show newest elections first
          setElections(completedElections);
        } else {
          setError('Failed to fetch election results');
        }
      } catch (error) {
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const determineWinner = (candidates) => {
    if (!candidates.length) return null;
    return candidates.reduce((prev, current) => 
      (current.votes || 0) > (prev.votes || 0) ? current : prev
    );
  };

  const calculateTotalVotes = (candidates) => {
    return candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const preparePieChartData = (candidates) => {
    return candidates.map(candidate => ({
      name: candidate.name,
      value: candidate.votes || 0
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          <h1 className="page-title">Election Results</h1>
          
          {elections.length === 0 ? (
            <div className="no-results">
              <p>No completed elections to display yet.</p>
            </div>
          ) : (
            <div className="results-grid">
              {elections.map(election => {
                const totalVotes = calculateTotalVotes(election.candidates);
                const pieData = preparePieChartData(election.candidates);
                
                return (
                  <div key={election._id} className="election-card">
                    <div className="card-header">
                      <div className="header-content">
                        <h2 className="election-title">{election.title}</h2>
                        <ChartBarIcon className="header-icon" />
                      </div>
                      
                      {election.winner && (
                        <div className="winner-section">
                          <TrophyIcon className="trophy-icon" />
                          <span>Winner: <span className="winner-name">{election.winner.name}</span></span>
                        </div>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="metadata-grid">
                        <div className="metadata-item">
                          <BuildingIcon className="metadata-icon" />
                          <span>{election.department}</span>
                        </div>
                        <div className="metadata-item">
                          <CalendarIcon className="metadata-icon" />
                          <span>{new Date(election.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="metadata-item">
                          <UsersIcon className="metadata-icon" />
                          <span>{election.candidates.length} Candidates</span>
                        </div>
                        <div className="total-votes">
                          {totalVotes} Total Votes
                        </div>
                      </div>

                      <div className="chart-container">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="candidates-list">
                        {election.candidates.map((candidate, index) => {
                          const percentage = calculatePercentage(candidate.votes || 0, totalVotes);
                          const isWinner = election.winner && election.winner._id === candidate._id;
                          
                          return (
                            <div key={candidate._id} className="candidate-item">
                              <div className="candidate-header">
                                <div className="candidate-name">
                                  <span 
                                    className="color-dot"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                  <span className={isWinner ? 'winner' : ''}>
                                    {candidate.name}
                                    {isWinner && (
                                      <TrophyIcon className="winner-icon" />
                                    )}
                                  </span>
                                </div>
                                <span className="vote-count">
                                  {percentage}% ({candidate.votes || 0})
                                </span>
                              </div>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: COLORS[index % COLORS.length]
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;