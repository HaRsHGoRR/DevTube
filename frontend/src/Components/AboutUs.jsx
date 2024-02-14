import React from 'react';
import './AboutUs.css'; // Import CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="header">
        <h1>About Us</h1>
      </div>
      <div className="card-container">
        <div className="card">
          <img src="https://via.placeholder.com/300" alt="Developer 1" />
          <div className="content">
            <h2>Developer 1</h2>
            <p>Description of Developer 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="social-media">
              <a href="https://example.com">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://example.com">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://example.com">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="card">
          <img src="https://via.placeholder.com/300" alt="Developer 2" />
          <div className="content">
            <h2>Developer 2</h2>
            <p>Description of Developer 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="social-media">
              <a href="https://example.com">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://example.com">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://example.com">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>© 2024 Company Name. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutUs;
