import React from 'react';
import './AboutUs.css'; // Import CSS file for styling
import '@fortawesome/fontawesome-free/css/all.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="developer-section">
        <h2 className="developer-heading">THE DEVELOPERS</h2>
        <div className="card-container">
          <div className="card active">
            <img className="rounded-image" src="https://media-bom2-1.cdn.whatsapp.net/v/t61.24694-24/218036384_3131121577101917_2935995754746671946_n.jpg?ccb=11-4&oh=01_AdQj4cjKfA3TdbctgfeMoW1QK853ct5T2sQwBMCjcpHUxQ&oe=65DB4D24&_nc_sid=e6ed6c&_nc_cat=106" alt="Developer 1" />
            <div className="content">
              <h3>Abhay Gohel</h3>
              ----------------
              <p>Description of Developer 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="social-media">
                <a href="https://facebook.com">
                  <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i> Facebook
                </a>
                <a href="https://twitter.com">
                  <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i> Twitter
                </a>
                <a href="https://linkedin.com">
                  <i className="fab fa-linkedin" style={{ color: '#0077B5' }}></i> LinkedIn
                </a>
                <a href="https://github.com/yourusername">
                  <i className="fab fa-github" style={{ color: '#ffffff' }}></i> GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="card active">
            <img className="rounded-image" src="https://media-bom2-1.cdn.whatsapp.net/v/t61.24694-24/339248895_164798703173807_1510388385294447391_n.jpg?ccb=11-4&oh=01_AdSdqc6AWTCYE8xRBNRNvenObDVNqeNuDpmO_W9mIXz8zg&oe=65DCC9C0&_nc_sid=e6ed6c&_nc_cat=109" alt="Developer 2" />
            <div className="content">
              <h3>Harsh Gor</h3>
              ----------------
              <p>Description of Developer 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="social-media">
                <a href="https://facebook.com">
                  <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i> Facebook
                </a>
                <a href="https://twitter.com">
                  <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i> Twitter
                </a>
                <a href="https://linkedin.com">
                  <i className="fab fa-linkedin" style={{ color: '#0077B5' }}></i> LinkedIn
                </a>
                <a href="https://github.com/yourusername">
                  <i className="fab fa-github" style={{ color: '#ffffff' }}></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <p>© 2024 DevTube. Made with ❤️</p>
    </div>
  );
};

export default AboutUs;
  