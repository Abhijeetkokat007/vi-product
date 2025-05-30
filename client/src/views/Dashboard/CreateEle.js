import { useState } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';

const styles = {
  card: {
    maxWidth: '672px',
    margin: '20px auto',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  cardHeader: {
    marginBottom: '24px'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
   

  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  formLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  formInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
    }
  },
  formTextarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    minHeight: '80px',
    resize: 'vertical',
    transition: 'border-color 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
    }
  },
  dateInputsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    margin: '16px 0'
  },
  successMessage: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8'
    },
    ':disabled': {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
    }
  }
};

const ElectionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nominationPeriod: '',
    campaignPeriod: '',
    votingPeriod: '',
    resultDeclaration: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/addelection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Election created successfully!');
        setFormData({
          title: '',
          description: '',
          nominationPeriod: '',
          campaignPeriod: '',
          votingPeriod: '',
          resultDeclaration: ''
        });
      } else {
        setMessage(data.error || 'Failed to create election');
      }
    } catch (error) {
      setMessage('Error creating election. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const messageStyle = message.includes('success') 
    ? { ...styles.message, ...styles.successMessage }
    : { ...styles.message, ...styles.errorMessage };

  return (
   <>
    <Sidebar/>
    <div style={styles.card}>
       
       <div style={styles.cardHeader}>
         <h2 style={styles.cardTitle}>
           <svg
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
           >
             <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
             <line x1="16" y1="2" x2="16" y2="6" />
             <line x1="8" y1="2" x2="8" y2="6" />
             <line x1="3" y1="10" x2="21" y2="10" />
           </svg>
           Create New Election
         </h2>
       </div>
       
       <form onSubmit={handleSubmit} style={styles.formContainer}>
         <div style={styles.formGroup}>
           <label style={styles.formLabel}>Title</label>
           <input
             type="text"
             name="title"
             value={formData.title}
             onChange={handleChange}
             style={styles.formInput}
             required
           />
         </div>
 
         <div style={styles.formGroup}>
           <label style={styles.formLabel}>Description</label>
           <textarea
             name="description"
             value={formData.description}
             onChange={handleChange}
             style={styles.formTextarea}
             rows="3"
             required
           />
         </div>
 
         <div style={styles.dateInputsGrid}>
           <div style={styles.formGroup}>
             <label style={styles.formLabel}>Nomination Period</label>
             <input
               type="datetime-local"
               name="nominationPeriod"
               value={formData.nominationPeriod}
               onChange={handleChange}
               style={styles.formInput}
               required
             />
           </div>
 
           <div style={styles.formGroup}>
             <label style={styles.formLabel}>Campaign Period</label>
             <input
               type="datetime-local"
               name="campaignPeriod"
               value={formData.campaignPeriod}
               onChange={handleChange}
               style={styles.formInput}
               required
             />
           </div>
 
           <div style={styles.formGroup}>
             <label style={styles.formLabel}>Voting Period</label>
             <input
               type="datetime-local"
               name="votingPeriod"
               value={formData.votingPeriod}
               onChange={handleChange}
               style={styles.formInput}
               required
             />
           </div>
 
           <div style={styles.formGroup}>
             <label style={styles.formLabel}>Result Declaration</label>
             <input
               type="datetime-local"
               name="resultDeclaration"
               value={formData.resultDeclaration}
               onChange={handleChange}
               style={styles.formInput}
               required
             />
           </div>
         </div>
 
         {message && (
           <div style={messageStyle}>
             {message}
           </div>
         )}
 
         <button 
           type="submit" 
           style={styles.submitButton}
           disabled={loading}
         >
           {loading ? 'Creating Election...' : 'Create Election'}
         </button>
       </form>
     </div>
   </>
  );
};

export default ElectionForm;