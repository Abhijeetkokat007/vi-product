import React, { useState } from 'react';
import { User, Mail, Book, Building2, MessageSquare, IdCard } from 'lucide-react';
import "./Contact.css"
import Navbar from '../../component/Navbar/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    subject: '',
    message: ''
  });

  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts & Humanities',
    'Science',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Form submitted successfully and email sent!');
        setFormData({
          name: '',
          studentId: '',
          email: '',
          department: '',
          subject: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        alert('An error occurred while submitting the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };
  

  return (
    <>
    <Navbar/>
    <div className="contact-page">
      <div className="contact-container">
        <div className="form-content">
          <div className="form-header">
            
            <h3>We'd love to hear from you. Please fill out the form below.</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <div className="input-wrapper">
                  
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    placeholder="e.g., ST12345"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <div className="input-wrapper">
                  
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <div className="input-wrapper">
                 
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="Message Subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group span-full">
                <label htmlFor="message">Message</label>
                <div className="input-wrapper">
                  <MessageSquare size={18} className="input-icon message-icon" />
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;