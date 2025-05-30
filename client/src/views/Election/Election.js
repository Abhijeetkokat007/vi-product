import React, { useState, useEffect } from 'react';
import './Election.css';
import Footer from '../../component/Footer/Footer';
import Navbar from '../../component/Navbar/Navbar';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ElectionPage = () => {
    const [activeElections, setActiveElections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedElection, setSelectedElection] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        nominationPeriod: '',
        campaignPeriod: '',
        votingPeriod: '',
        resultDeclaration: ''
    });

    // Fetch elections data from API
    const fetchElections = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5000/elections');
            
            if (!response.ok) {
                throw new Error('Failed to fetch elections');
            }
            
            const data = await response.json();
            setActiveElections(Array.isArray(data) ? data : data.elections || []);
        } catch (error) {
            console.error('Error fetching elections:', error);
            setError('Failed to load elections. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchElections();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/elections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create election');
            }

            const data = await response.json();
            setActiveElections(prev => [...prev, data.election]);
            setShowAddForm(false);
            setFormData({
                title: '',
                description: '',
                nominationPeriod: '',
                campaignPeriod: '',
                votingPeriod: '',
                resultDeclaration: ''
            });
        } catch (error) {
            console.error('Error creating election:', error);
            setError('Failed to create election. Please try again.');
        }
    };

    const handleViewDetails = (election) => {
        // Convert the election data into a timeline format
        const timelineData = [
            {
                title: "Nomination Period",
                date: election.nominationPeriod,
                description: "Candidates submit their nominations and required documentation",
                status: getTimelineStatus(election.nominationPeriod)
            },
            {
                title: "Campaign Period",
                date: election.campaignPeriod,
                description: "Candidates present their platforms and engage with voters",
                status: getTimelineStatus(election.campaignPeriod)
            },
            {
                title: "Voting Period",
                date: election.votingPeriod,
                description: "Students cast their votes for their preferred candidates",
                status: getTimelineStatus(election.votingPeriod)
            },
            {
                title: "Results Declaration",
                date: election.resultDeclaration,
                description: "Election results are announced and new representatives take office",
                status: getTimelineStatus(election.resultDeclaration)
            }
        ];

        setSelectedElection({ ...election, timeline: timelineData });
    };

    // Helper function to determine timeline status
    const getTimelineStatus = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        
        if (now < date) {
            return 'upcoming';
        } else if (now.toDateString() === date.toDateString()) {
            return 'active';
        } else {
            return 'completed';
        }
    };

    const handleCloseDetails = () => {
        setSelectedElection(null);
    };

    return (
        <>
            <Navbar />
            <div className="election-container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <span className="election-status">Elections Active</span>
                        <h1 className='yyy'>Shape Your Academic Future</h1>
                        <p className="hero-subtitles">
                            Participate in the 2024 University Elections and make your voice heard
                        </p>
                       
                    </div>
                </section>

                {/* Add Election Form Modal */}
                {showAddForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Add New Election</h2>
                                <button 
                                    onClick={() => setShowAddForm(false)}
                                    className="close-button"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="election-form">
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nominationPeriod">Nomination Period</label>
                                    <input
                                        type="date"
                                        id="nominationPeriod"
                                        name="nominationPeriod"
                                        value={formData.nominationPeriod}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="campaignPeriod">Campaign Period</label>
                                    <input
                                        type="date"
                                        id="campaignPeriod"
                                        name="campaignPeriod"
                                        value={formData.campaignPeriod}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="votingPeriod">Voting Period</label>
                                    <input
                                        type="date"
                                        id="votingPeriod"
                                        name="votingPeriod"
                                        value={formData.votingPeriod}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="resultDeclaration">Result Declaration</label>
                                    <input
                                        type="date"
                                        id="resultDeclaration"
                                        name="resultDeclaration"
                                        value={formData.resultDeclaration}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="button button-primary">
                                    Create Election
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Active Elections */}
                <section>
                    <h2>Active Elections</h2>
                    {isLoading ? (
                        <div>Loading elections...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : activeElections.length === 0 ? (
                        <div>No active elections at this time.</div>
                    ) : (
                        <div className="categories-grid">
                            {activeElections.map(election => (
                                <div key={election._id} className="category-card">
                                    <div className="category-header">
                                        <h3>{election.title}</h3>
                                    </div>
                                    <div className="category-content">
                                        <p>{election.description}</p>
                                        <button 
                                            onClick={() => handleViewDetails(election)}
                                            className="button button-primary"
                                        >
                                            View Details
                                        </button>
                                        <Link to='/application'><button 
                                            
                                            className="button button-primary hh"
                                        >
                                            Give Nominee
                                        </button></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Election Details Modal */}
                {selectedElection && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{selectedElection.title} Timeline</h2>
                                <button 
                                    onClick={handleCloseDetails}
                                    className="close-button"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="timeline-container">
                                    {selectedElection.timeline.map((item, index) => (
                                        <div key={index} className="timeline-item">
                                            <div className="timeline-marker"></div>
                                            <div className="timeline-content">
                                                <h3>{item.title}</h3>
                                                <span className="timeline-date">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                                <p>{item.description}</p>
                                                <div className="timeline-status">
                                                    <span className={`status-badge ${item.status}`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <section className="vote-section">
                    <div className="election-container">
                        <h2>Ready to Make a Difference?</h2>
                        <p>Your vote matters in shaping the future of our academic community</p>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default ElectionPage;