import React from 'react';
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram, ChevronRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3>About VoteSecure</h3>
            <p className="about-text">
              Your trusted platform for conducting fair and transparent college elections. 
              We ensure every voice is heard and every vote counts.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="quick-links">
              <li>
                <a href="/">
                  <ChevronRight size={16} />
                  Home
                </a>
              </li>
              <li>
                <a href="/election">
                  <ChevronRight size={16} />
                  Elections
                </a>
              </li>
              <li>
                <a href="/about">
                  <ChevronRight size={16} />
                  About
                </a>
              </li>
              <li>
                <a href="/contact">
                  <ChevronRight size={16} />
                  Contact
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <Mail size={18} />
              <span>votesecure@college.edu</span>
            </div>
            <div className="contact-info">
              <Phone size={18} />
              <span>123-456-7890</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VoteSecure Election Committee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;