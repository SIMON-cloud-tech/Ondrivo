// ──────────────────────────────────────────────────────────────
//  src/components/Hero.jsx
//  Ondrivo — Industrial Process & Systems Engineering Hero
// ──────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Lazy load animation on scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hero-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Navy gradient overlay for depth and readability */}
      <div className="hero-overlay">
        <div className="hero-content">
          {/* Main headline — the promise */}
          <h2 className="hero-title">
            Industrial software built to last,
            <br />
            <span className="highlight">not to disappear.</span>
          </h2>

          {/* Value proposition — what you do */}
          <p className="hero-subtitle">
            Laboratory Information Management Systems, Process Optimization Dashboards, 
            <br />
            and custom industrial software — built with chemistry expertise and engineering precision.
          </p>

          {/* Marketing strip — quick trust builders */}
          <div className="marketing-strip">
            <span className="strip-item">🧪 Chemistry + Code</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">🔬 LIMS for Laboratories</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">🏭 Real‑Time Process Monitoring</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">📊 Data-Driven Optimization</span>
          </div>

          {/* Call-to-action buttons */}
          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/contact')}
            >
              Get a Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;