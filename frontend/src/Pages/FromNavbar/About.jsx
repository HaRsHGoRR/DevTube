import React from "react";
import "./AboutUs.css"; // Import CSS file for styling
import "@fortawesome/fontawesome-free/css/all.css";
import { useSpring, animated } from "react-spring";

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
        <animated.h2 className="developer-heading" style={teamSpring}>
          THE TEAM
        </animated.h2>
        <div className="card-container">
          <animated.div className="card active" style={cardSpring}>
            <img
              className="rounded-image"
              src="https://res.cloudinary.com/ddao02zyw/image/upload/v1707678150/o9620dqoiaudjq9smshg.jpg"
              alt="Developer 1"
            />
            <div className="content">
              <h3>Abhay Gohel</h3>
              ----------------
              <p><b>
              Ninja Full Stack Developer
              </b></p>
              <div className="social-media">
                <a href="https://www.linkedin.com/in/abhay-gohel-880994268">
                  <i
                    className="fab fa-linkedin"
                    style={{ color: "#0077B5" }}
                  ></i>{" "}
                  <br></br>
                  LinkedIn
                </a>
                <a href="https://github.com/abhay14gohel">
                  <i className="fab fa-github" style={{ color: "#ffffff" }}></i>{" "}
                  <br></br>
                  GitHub
                </a>
              </div>
            </div>
          </animated.div>
          <animated.div className="card active" style={cardSpring1}>
            <img
              className="rounded-image"
              src="https://res.cloudinary.com/ddao02zyw/image/upload/v1709847223/421936920_3600858116868512_279271040206229281_n_wabod0.jpg"
              alt="Developer 2"
            />
            <div className="content">
              <h3>Harsh Gor</h3>
              ----------------
              <p><b>
              Full Stack Developer
                </b>   </p>
              <div className="social-media">
                <a href="https://www.linkedin.com/in/harsh-gor-7095b2262">
                  <i
                    className="fab fa-linkedin"
                    style={{ color: "#0077B5" }}
                  ></i>{" "}
                  <br></br>
                  LinkedIn
                </a>
                <a href="https://github.com/HaRsHGoRR">
                  <i className="fab fa-github" style={{ color: "#ffffff" }}></i>{" "}
                  <br></br>
                  GitHub
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
