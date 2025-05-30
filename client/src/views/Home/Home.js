import React, { useEffect, useState } from 'react';
import { Clock, User, Award, ChartBar, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import './Home.css';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';

const CollegeElection = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get-voting');
                setElections(response.data.data);
            } catch (error) {
                console.error("Error fetching elections:", error);
            }
        };
        fetchElections();
    }, []);

    const handleVoteNow = (election) => {
        const now = new Date();
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);

        if (now < startDate) {
            alert('Voting has not started yet.');
            return;
        }
        if (now > endDate) {
            alert('Voting has ended for this election.');
            return;
        }

        setSelectedElection(election);
        setIsModalOpen(true);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getTimeStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            // Election hasn't started
            const diffTime = Math.abs(start - now);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `Starts in ${days} day${days > 1 ? 's' : ''}`;
        } else if (now > end) {
            // Election has ended
            const diffTime = Math.abs(now - end);
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (days === 0) {
                const hours = Math.floor(diffTime / (1000 * 60 * 60));
                return `Ended ${hours} hour${hours > 1 ? 's' : ''} ago`;
            }
            return `Ended ${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            // Election is ongoing
            const diffTime = Math.abs(end - now);
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (days > 0) {
                return `${days} day${days > 1 ? 's' : ''} remaining`;
            }
            return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
        }
    };

    const getStatusClass = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now > end) return 'ended';
        if (now < start) return 'upcoming';
        return 'live';
    };

    const getStatusText = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now > end) return 'Ended';
        if (now < start) return 'Upcoming';
        return 'Live Now';
    };

    const getButtonStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now > end) return { text: 'Election Ended', disabled: true };
        if (now < start) return { text: 'Coming Soon', disabled: true };
        return { text: 'Vote Now', disabled: false };
    };

    const submitVote = async (nominee) => {
        try {
            const user = JSON.parse(localStorage.getItem('voter'));

            if (!user || !user.id) {
                alert('You must be logged in to vote.');
                return;
            }

            const now = new Date();
            const startDate = new Date(selectedElection.startDate);
            const endDate = new Date(selectedElection.endDate);

            if (now < startDate || now > endDate) {
                alert('Voting is not currently active for this election.');
                return;
            }

            await axios.post(`http://localhost:5000/api/now-voting`, {
                electionId: selectedElection._id,
                nomineeId: nominee._id,
                userId: user.id
            });

            alert("Vote submitted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert(error.response?.data?.message || "Failed to submit vote.");
        }
    };

    return (

        <div>
            <Navbar />
            <div className="container">

                {/* Hero Section */}
                <section className="heros">
                    <h1>Campus Elections 2024</h1>
                    <p className="subtitle">Shape Your College's Future</p>
                    <div className="heross-stats">
                        <div className="stat-item">
                            <span className="stat-number">5000+</span>
                            <span className="stat-label">Student Voters</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">15+</span>
                            <span className="stat-label">Positions</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4</span>
                            <span className="stat-label">Departments</span>
                        </div>
                    </div>
                </section>

                {/* Active Elections */}
                <section className="elections">
                    <h2>Ongoing Elections</h2>
                    <div className="election-grid">
                        {elections.map((election) => {
                            const buttonStatus = getButtonStatus(election.startDate, election.endDate);
                            return (
                                <div key={election._id} className="election-card">
                                    <div className={`badge ${getStatusClass(election.startDate, election.endDate)}`}>
                                        {getStatusText(election.startDate, election.endDate)}
                                    </div>

                                    <h3>{election.title}</h3>
                                    <div className="election-details">
                                        <div className="detail-row">
                                            <Users size={16} />
                                            <span>{election.department}</span>
                                        </div>

                                        <div className="detail-row">
                                            <Calendar size={16} />
                                            <div className="date-info">
                                                <div>
                                                    <span className="label">Start:</span>
                                                    <span>{formatDate(election.startDate)}</span>
                                                </div>
                                                <div>
                                                    <span className="label">End:</span>
                                                    <span>{formatDate(election.endDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <Clock size={16} />
                                            <span>{getTimeStatus(election.startDate, election.endDate)}</span>
                                        </div>

                                        <div className="detail-row">
                                            <User size={16} />
                                            <span>{election.candidates.length} Candidates</span>
                                        </div>
                                    </div>

                                    <button
                                        className={`vote-btn ${buttonStatus.disabled ? 'disabled' : 'primary'}`}
                                        onClick={() => handleVoteNow(election)}
                                        disabled={buttonStatus.disabled}
                                    >
                                        {buttonStatus.text}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Nominees Modal */}
                {isModalOpen && selectedElection && (
                    <div className="modal">
                        <h3>Vote for {selectedElection.title}</h3>
                        <ul className="nominee-list">
                            {selectedElection.candidates.map((nominee) => (
                                <li key={nominee._id}>
                                    {nominee.name}
                                    <button onClick={() => submitVote(nominee)}>Vote</button>
                                </li>
                            ))}
                        </ul>
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>x</button>
                    </div>
                )}
                {/* Positions Section */}
                <section className="positions">
                    <h2>Election Positions</h2>
                    <div className="position-grid">
                        <div className="position-card">
                            <User size={32} />
                            <h3>Class Representative</h3>
                            <p>Voice of your class</p>
                        </div>
                        <div className="position-card">
                            <Award size={32} />
                            <h3>General Secretary</h3>
                            <p>Student body leader</p>
                        </div>
                        <div className="position-card">
                            <ChartBar size={32} />
                            <h3>Sports Secretary</h3>
                            <p>Athletics & Sports</p>
                        </div>
                    </div>
                </section>

                {/* How to Vote */}
                <section className="how-to-vote">
                    <h2>How to Vote</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Login with College ID</h3>
                            <p>Use your college email and password</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Choose Your Candidate</h3>
                            <p>Review profiles and manifestos</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Submit Your Vote</h3>
                            <p>Confirm your selection</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}

            </div>
            <Footer />
        </div>
    );
};

export default CollegeElection;