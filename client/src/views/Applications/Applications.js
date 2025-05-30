import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Filter, RefreshCw } from 'lucide-react';
import "./Applications.css";
import Sidebar from '../../component/Sidebar/Sidebar';

const CandidateApplicationsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSearchApplications();
  }, [applications, searchTerm, filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/get-application');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();

      const mappedApplications = data.data.map(app => {
        const savedStatus = localStorage.getItem(`application_${app._id}_status`);
        return {
          ...app,
          status: savedStatus || app.status || 'Pending'
        };
      });

      setApplications(mappedApplications);
    } catch (err) {
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchApplications = () => {
    let result = applications;

    if (searchTerm) {
      result = result.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter(app => app.status === filterStatus);
    }

    setFilteredApplications(result);
  };

  const handleApplicationStatus = (id, newStatus) => {
    const application = applications.find(app => app._id === id);

    // If the application status is not 'Pending', ask for confirmation
    if (application.status !== 'Pending') {
      const confirmChange = window.confirm(
        `The application is already ${application.status}. Are you sure you want to change it to ${newStatus}?`
      );
      if (!confirmChange) return; // Exit if user cancels the confirmation
    }

    // Update localStorage immediately
    localStorage.setItem(`application_${id}_status`, newStatus);

    // Update the status in the local state
    const updatedApplications = applications.map(app =>
      app._id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
  };


 

  const openDocumentModal = (documentUrl) => {
    setSelectedDocument(documentUrl);
  };

  const closeDocumentModal = () => {
    setSelectedDocument(null);
  };

  const statusColors = {
    'Pending': 'badge-pending',
    'Accepted': 'badge-success',
    'Rejected': 'badge-danger'
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="applications-view">
          <div className="view-header">
            <h1>Candidate Applications</h1>
            <div className="header-actions">
              <button
                className="btn-outline"
                onClick={fetchApplications}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>

          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <Filter size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="applications-table">
            {loading ? (
              <div className="loading-state">Loading applications...</div>
            ) : error ? (
              <div className="error-state">Error: {error}</div>
            ) : filteredApplications.length === 0 ? (
              <div className="empty-state">No applications found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Department</th>
                    <th>Election</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredApplications].reverse().map(app => (
                    <tr key={app._id}>
                      <td>
                        <div className="candidate-info">
                          {app.name}
                          <span className="student-id">{app.studentId}</span>
                        </div>
                      </td>
                      <td>{app.studentId}</td>
                      <td>{app.department}</td>
                      <td>{app.electionName}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`status-badge ${statusColors[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon approve"
                            onClick={() => handleApplicationStatus(app._id, 'Accepted')}
                            disabled={app.status !== 'Pending'}
                            title="Accept Application"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="btn-icon reject"
                            onClick={() => handleApplicationStatus(app._id, 'Rejected')}
                            disabled={app.status !== 'Pending'}
                            title="Reject Application"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedDocument && (
            <div className="document-modal">
              <div className="document-modal-content">
                <button
                  className="close-button"
                  onClick={closeDocumentModal}
                  title="Close Document"
                >
                  <X size={24} />
                </button>
                <iframe
                  src={`${selectedDocument}#view=FitH`}
                  width="100%"
                  height="600px"
                  title="Application Document"
                  allow="fullscreen"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateApplicationsView;