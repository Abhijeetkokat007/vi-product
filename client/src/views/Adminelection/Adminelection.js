import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import { PlusIcon, TrashIcon, CalendarIcon, UsersIcon, BuildingIcon } from 'lucide-react';
import "./Adminelection.css";

const Elections = () => {
  const [showModal, setShowModal] = useState(false);
  const [elections, setElections] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    startDate: '',
    endDate: '',
    candidates: ['']
  });

  useEffect(() => {
    // Fetch elections when the component loads
    const fetchElections = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-voting');
        const data = await response.json();

        if (response.ok && data.success) {
          const updatedElections = data.data.map((election) => ({
            ...election,
            id: election._id,
            status: calculateElectionStatus(election.startDate, election.endDate)
          }));
          setElections(updatedElections);
        } else {
          alert(`Error fetching elections: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
        alert('An error occurred while fetching elections.');
      }
    };

    fetchElections();
  }, []);

  const calculateElectionStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'In Progress';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedCandidates = formData.candidates.filter(candidate => candidate.trim() !== '');

    const newElection = {
      title: formData.title,
      department: formData.department,
      startDate: formData.startDate,
      endDate: formData.endDate,
      candidates: cleanedCandidates
    };

    try {
      const response = await fetch('http://localhost:5000/api/add-voting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newElection)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create election'}`);
        return;
      }

      const savedElection = await response.json();

      setElections(prev => [
        ...prev,
        {
          ...savedElection.data,
          id: savedElection.data._id,
          status: calculateElectionStatus(savedElection.data.startDate, savedElection.data.endDate)
        }
      ]);

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating election:', error);
      alert('An unexpected error occurred while creating the election.');
    }
  };

  const handleDeleteElection = async (electionId, electionTitle) => {
    console.log('Delete initiated for election:', electionId); // Debug log
    
    try {
      // First confirm the deletion
      const willDelete = window.confirm(`Are you sure you want to delete "${electionTitle}"?`);
      if (!willDelete) {
        console.log('Deletion cancelled by user'); // Debug log
        return;
      }
  
      console.log('Sending delete request...'); // Debug log
  
      // Make the delete request
      const response = await fetch(`http://localhost:5000/delete-voting/${electionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response received:', response.status); // Debug log
  
      // Parse response
      const data = await response.json();
      console.log('Response data:', data); // Debug log
  
      if (response.ok) {
        // Remove the election from state
        setElections(prevElections => 
          prevElections.filter(election => election.id !== electionId)
        );
        alert('Election deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete election');
      }
    } catch (error) {
      console.error('Detailed error:', error); // Debug log
      alert(`Failed to delete election. Error: ${error.message}`);
    }
  };
  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      startDate: '',
      endDate: '',
      candidates: ['']
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index] = value;
    setFormData(prev => ({
      ...prev,
      candidates: newCandidates
    }));
  };

  const addCandidateField = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const removeCandidateField = (index) => {
    if (formData.candidates.length > 1) {
      const newCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        candidates: newCandidates
      }));
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="header-user">
            <div className="user-profile">
              <span>Admin Dashboard</span>
            </div>
          </div>
        </header>

        <div className="elections-container">
          <button
            className="create-election-btn"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon size={16} /> Create New Voting
          </button>

          <div className="elections-grid">
            {[...elections].reverse().map((election) => (
              <div key={election.id} className={`election-card ${election.status.toLowerCase()}`}>
                <h3>{election.title}</h3>
                <p><BuildingIcon size={14} /> {election.department}</p>
                <p><CalendarIcon size={14} /> {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</p>
                <p><UsersIcon size={14} /> {election.candidates.length} Candidates</p>
                <p>Status: <strong>{election.status}</strong></p>
                <button
                  className="delete-election-btn"
                  onClick={() => handleDeleteElection(election.id, election.title)}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Election</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="title">Election Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter election title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Student_council">Student Council</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Library">Library</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Candidates</label>
                  {formData.candidates.map((candidate, index) => (
                    <div key={index} className="candidate-input-group">
                      <input
                        type="text"
                        placeholder={`Candidate ${index + 1} Name`}
                        value={candidate}
                        onChange={(e) => handleCandidateChange(index, e.target.value)}
                        required
                      />
                      {formData.candidates.length > 1 && (
                        <button
                          type="button"
                          className="remove-candidate-btn"
                          onClick={() => removeCandidateField(index)}
                        >
                          <TrashIcon size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-candidate-btn"
                    onClick={addCandidateField}
                  >
                    <PlusIcon size={16} /> Add Candidate
                  </button>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Election
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Elections;