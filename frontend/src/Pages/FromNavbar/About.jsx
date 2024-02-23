import React from 'react';
import './AboutUs.css'; // Import CSS file for styling
import '@fortawesome/fontawesome-free/css/all.css';
import { useSpring, animated } from 'react-spring';

const AboutUs = () => {
  const teamSpring = useSpring({
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    config: { duration: 1000 },
  });

  const cardSpring = useSpring({
    from: { opacity: 0, translateX: -60 },
    to: { opacity: 1, translateX: 0 },
    config: { duration: 500 },
  });
  const cardSpring1 = useSpring({
    from: { opacity: 0, translateX: 60 },
    to: { opacity: 1, translateX: 0 },
    config: { duration: 500 },
  });

  return (
    <div className="about-us-container">
      <section className="developer-section">
        <animated.h2 className="developer-heading" style={teamSpring}>THE TEAM</animated.h2>
        <div className="card-container">
          <animated.div className="card active" style={cardSpring}>
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
          </animated.div>
          <animated.div className="card active" style={cardSpring1}>
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
          </animated.div>
        </div>
      </section>
      <p>© 2024 DevTube. Made with ❤️</p>
    </div>
  );
};

export default AboutUs;
