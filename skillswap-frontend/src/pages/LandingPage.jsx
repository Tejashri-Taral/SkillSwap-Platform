import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">

      <header className="landing-hero">
        <div className="hero-text">
          <h2>Learn, Share, and Exchange Skills</h2>
          <p>Connect with others to teach your skills and learn new ones. Build, grow, and collaborate in one place.</p>
          <a href="/register" className="btn-primary hero-btn">Get Started</a>
        </div>
      </header>
      
      <section className="features">
        <h3>Why SkillSwap?</h3>
        <div className="feature-cards">
          <div className="feature-card">
            <h4>Teach Your Skills</h4>
            <p>Share your expertise and help others grow while earning reputation.</p>
          </div>
          <div className="feature-card">
            <h4>Learn from Experts</h4>
            <p>Find people skilled in areas you want to improve and learn directly from them.</p>
          </div>
          <div className="feature-card">
            <h4>Collaborate</h4>
            <p>Work together on projects and exchange knowledge in a supportive community.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 SkillSwap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
