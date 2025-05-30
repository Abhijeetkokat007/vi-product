import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import "./Addvoter.css";

const AddVoter = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    department: '',
    yearLevel: '',
    voterType: 'student'
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(null); // State to handle submission success or failure

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";

    // Last Name validation
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";

    // Student ID validation
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    else if (formData.studentId.length < 5) newErrors.studentId = "Student ID must be at least 5 characters";

    // Department validation
    if (!formData.department) newErrors.department = "Department is required";

    // Year Level validation
    if (!formData.yearLevel) newErrors.yearLevel = "Year level is required";
    else if (!["1", "2", "3", "4"].includes(formData.yearLevel)) newErrors.yearLevel = "Select a valid year level";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/voters/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitSuccess(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            studentId: '',
            department: '',
            yearLevel: '',
            voterType: 'student'
          });
          setErrors({});
        } else {
          setSubmitSuccess(false); 
          setErrors({ submit: data.message || "Failed to register voter" });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitSuccess(false);
        setErrors({ submit: "An error occurred during submission" });
      }
    } else {
      setSubmitSuccess(false);
      console.log("Form has validation errors.");
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

        <section className="content-section">
          <div className="section-header">
            <h2>Add New Voter</h2>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="voter-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="studentId">Student ID</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                  {errors.studentId && <p className="error">{errors.studentId}</p>}
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
                    <option value="engineering">Engineering</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                    <option value="business">Business</option>
                  </select>
                  {errors.department && <p className="error">{errors.department}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="yearLevel">Year Level</label>
                  <select
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year Level</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                  {errors.yearLevel && <p className="error">{errors.yearLevel}</p>}
                </div>
              </div>

              {submitSuccess && <p className="success">Voter added successfully!</p>}
              {errors.submit && <p className="error">{errors.submit}</p>}

              <div className="form-actions">
                
                <button   type="submit" className="btn btn-primary ">Add Voter</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AddVoter;
