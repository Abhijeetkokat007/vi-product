import React from 'react';
import { Users, Book, Award, Globe, Clock, Heart } from 'lucide-react';
import "./About.css"
import Navbar from '../../component/Navbar/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../../component/Footer/Footer';

const AboutPage = () => {
  const stats = [
    {
      icon: <Users size={24} />,
      value: "10,000+",
      label: "Students Enrolled"
    },
    {
      icon: <Book size={24} />,
      value: "50+",
      label: "Academic Programs"
    },
    {
      icon: <Award size={24} />,
      value: "95%",
      label: "Graduate Success Rate"
    }
  ];

  return (
    <>
    <Navbar/>
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <span className="hero-subtitle">Welcome to</span>
          <h1 className="hero-title">VoteSecure</h1>
          <p className="hero-text">
            Empowering minds, shaping futures, and fostering innovation through 
            excellence in education.
          </p>
        </div>
      </div>

      <div className="about-container">
        <section className="stats-section">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="vision-section">
          <div className="vision-card">
            <div className="vision-header">
              <h2>Our Vision</h2>
              <div className="underline"></div>
            </div>
            <p>
              To be a leading institution that nurtures creative minds and develops 
              future leaders who will make meaningful contributions to society through 
              innovation, research, and sustainable practices.
            </p>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <Globe className="feature-icon" />
            <h3>Global Network</h3>
            <p>Connect with students and faculty from over 50 countries worldwide.</p>
          </div>
          <div className="feature-card">
            <Clock className="feature-icon" />
            <h3>Modern Approach</h3>
            <p>Cutting-edge curriculum designed to meet industry demands.</p>
          </div>
          <div className="feature-card">
            <Heart className="feature-icon" />
            <h3>Student Support</h3>
            <p>Comprehensive support services for academic and personal growth.</p>
          </div>
        </section>

        <section className="about-content">
          <div className="content-card">
            <h2>About Our Institution</h2>
            <div className="underline"></div>
            <p>
              Founded on the principles of academic excellence and innovation, our 
              institution has been at the forefront of education for over two decades. 
              We believe in providing a dynamic learning environment that encourages 
              creativity, critical thinking, and practical application of knowledge.
            </p>
            <p>
              Our dedicated faculty members bring extensive industry experience and 
              academic expertise, ensuring that our students receive the highest 
              quality education. Through our diverse programs and state-of-the-art 
              facilities, we prepare our students for successful careers in their 
              chosen fields.
            </p>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to Join Us?</h2>
            <p>Take the first step towards your future success</p>
            <Link to="/contact" >  <button className="cta-button">Contact Now</button></Link>
          </div>
        </section>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;