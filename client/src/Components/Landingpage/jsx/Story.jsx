// ──────────────────────────────────────────────────────────────
//  src/components/pages/About.jsx
//  Ondrivo — Industrial Process & Systems Engineering
// ──────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import '../css/Story.css';
import aboutImage from '/about.png';

const About = () => {
  const sectionRef = useRef(null);

  // ── Intersection Observer for lazy-load animations ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mvv-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.mvv-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* ── HERO / INTRO SECTION ── */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h2 className="hero-graffiti">Bridging Chemistry and Code<br />for Industrial Innovation</h2>
          <p className="hero-text">
            Ondrivo is an Industrial Process and Systems Engineering firm that combines deep 
            chemistry knowledge with modern software development. We build specialized digital 
            tools for laboratories, manufacturing plants, and process industries — solving 
            problems that generic software developers can't even see. From custom LIMS to 
            real-time process dashboards, we deliver engineering-grade software that actually works.
          </p>
          <h4 className="hero-highlights">
            <span>🧪 Chemistry + Code</span>
            <span className="highlight-divider">•</span>
            <span>🔬 Laboratory Software</span>
            <span className="highlight-divider">•</span>
            <span>🏭 Process Engineering</span>
          </h4>
        </div>
      </section>

      {/* ── COMPANY INFO + IMAGE ── */}
      <section className="about-content">
        <div className="about-image">
          <img
            src={aboutImage}
            alt="Industrial Process and Systems Engineering"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            <strong>Ondrivo</strong> is an Industrial Process and Systems Engineering firm 
            built on one core promise: <strong>accountability</strong>. We specialize in 
            laboratory information management systems, process optimization dashboards, and 
            custom software for chemical and manufacturing industries.
          </p>
          <p>
            Founded in <strong>2024</strong>, Ondrivo was created to solve a critical gap 
            in Kenya's industrial sector: the lack of software solutions that understand 
            chemistry and process engineering. We combine a degree in Industrial Chemistry 
            with full-stack development skills — delivering tools that chemists, lab managers, 
            and process engineers actually need.
          </p>
          <p>
            From spectroscopy data management to reactor performance monitoring, we build 
            industrial software that lasts.
          </p>
          <p className="tagline">🧪 Chemistry + Code. Built to last.</p>
        </div>
      </section>

      {/* ── MISSION, VISION, VALUES ── */}
      <section className="about-mvv" ref={sectionRef}>
        <div className="mvv-card">
          <h3>🎯 Mission</h3>
          <p>
            To empower laboratories and manufacturing plants with reliable, 
            high-performance software that streamlines operations, ensures 
            quality control, and drives process optimization.
          </p>
        </div>
        <div className="mvv-card">
          <h3>🔭 Vision</h3>
          <p>
            To become the leading provider of industrial software solutions 
            in Kenya and East Africa — where chemistry and code work together 
            to power sustainable manufacturing.
          </p>
        </div>
        <div className="mvv-card">
          <h3>⭐ Core Values</h3>
          <ul>
            <li>Engineering Precision</li>
            <li>Accountability</li>
            <li>Industry Expertise</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;