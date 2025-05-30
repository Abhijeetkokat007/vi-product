import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';

function Application() {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    studentId: '',
    email: '',
    yearLevel: '',
    electionName: '', // Changed from documentElectionName to match schema
    document: null,
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
          setResponse({
            message: 'Please upload only PDF or Word documents.',
            type: 'error'
          });
          e.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setResponse({
            message: 'File size should not exceed 5MB.',
            type: 'error'
          });
          e.target.value = '';
          return;
        }
      }
      setFormData({
        ...formData,
        [e.target.name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    setResponse({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse({ message: '', type: '' });

    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('http://localhost:5000/api/add-application', {
        method: 'POST',
        body: formDataToSend,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (response.ok) {
        setResponse({
          message: 'Form submitted successfully!',
          type: 'success'
        });
        setFormData({
          name: '',
          department: '',
          studentId: '',
          email: '',
          yearLevel: '',
          electionName: '', // Changed from documentElectionName
          document: null,
        });
        const fileInput = document.getElementById('document');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(data.error || 'Server returned an error');
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setResponse({
        message: errorMessage,
        type: 'error'
      });
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="election-form-wrapper">
        <Navbar />
        <div className="election-form-card">
          <div className="election-form-header">
            <h2>Student Document Nominee Form</h2>
            <p>Please fill in all required information carefully</p>
          </div>
          <div className="election-form-body">
            <form onSubmit={handleSubmit}>
              <div className="election-form-group">
                <label htmlFor="electionName">Position Name:</label>
                <div className="election-input-container">
                  <input
                    type="text"
                    id="electionName"
                    name="electionName"
                    value={formData.electionName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="election-form-group">
                <label htmlFor="name">Full Name:</label>
                <div className="election-input-container">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="election-form-group">
                <label htmlFor="department">Department:</label>
                <div className="election-input-container">
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="election-form-group">
                <label htmlFor="studentId">Student ID:</label>
                <div className="election-input-container">
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="Enter 7-10 digit ID"
                  />
                </div>
              </div>

              <div className="election-form-group">
                <label htmlFor="email">Email:</label>
                <div className="election-input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="election-form-group">
                <label htmlFor="yearLevel">Year Level:</label>
                <div className="election-input-container">
                  <select
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year Level</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              
              <div className="election-form-submit">
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>

              {response.message && (
                <div
                  className={`election-form-response ${
                    response.type === 'success' ? 'success' : 'error'
                  }`}
                >
                  {response.type === 'success' ? (
                    <CheckCircle2 className="response-icon" />
                  ) : (
                    <AlertCircle className="response-icon" />
                  )}
                  <span>{response.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
       
      </div>
      <Footer />
      <style jsx>{`
        .election-form-wrapper {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .election-form-card {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin: 3rem 0;
          overflow: hidden;
        }

        .election-form-header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .election-form-header h2 {
          margin:0px;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .election-form-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1rem;
        }

        .election-form-body {
          padding: 2rem;
        }

        .election-form-group {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 2rem;
        }

        .election-form-group label {
          flex: 0 0 200px;
          text-align: right;
          color: #2d3748;
          font-weight: 500;
          padding-right: 1rem;
        }

        .election-input-container {
          flex: 1;
          max-width: 500px;
        }

        .election-input-container input:not([type="file"]),
        .election-input-container select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: white;
        }

        .election-file-input-wrapper {
          position: relative;
        }

        .election-file-input-wrapper input[type="file"] {
          width: 100%;
          padding: 0.75rem;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          background-color: #f8fafc;
        }

        .election-file-input-wrapper input[type="file"]:hover {
          border-color: #4299e1;
          background-color: #f0f7ff;
        }

        .election-file-input-info {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .election-input-container input:focus,
        .election-input-container select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        .election-input-container select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 12 12'%3E%3Cpath d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .election-form-submit {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          padding-left: 0px;
        }

        .election-form-submit button {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-width: 500px;
        }

        .election-form-submit button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(45, 55, 72, 0.2);
        }

        .election-form-submit button:not(:disabled):active {
          transform: translateY(0);
        }

        .election-form-submit button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: #94a3b8;
        }

        .election-form-response {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease-in-out;
        }

        .election-form-response.success {
          background-color: #dcfce7;
          color: #166534;
        }

        .election-form-response.error {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .response-icon {
          width: 20px;
          height: 20px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
          @media (max-width: 768px) {
            .election-form-wrapper {
              padding: 1rem;
            }

            .election-form-card {
              margin: 1rem 0;
            }

            .election-form-header {
              padding: 1.5rem;
            }

            .election-form-header h2 {
              font-size: 1.5rem;
            }

            .election-form-body {
              padding: 1.5rem;
            }

            .election-form-group {
              flex-direction: column;
              gap: 0.5rem;
            }

            .election-form-group label {
              flex: none;
              text-align: left;
              padding-right: 0;
              margin-bottom: 0.5rem;
            }

            .election-input-container {
              width: 100%;
              max-width: none;
            }

            .election-input-container input:not([type="file"]),
            .election-input-container select {
              padding: 0.6rem 0.8rem;
            }

            .election-form-submit {
              padding-left: 0;
            }
          }
        `}
      </style>
    </>
  );
}

export default Application;