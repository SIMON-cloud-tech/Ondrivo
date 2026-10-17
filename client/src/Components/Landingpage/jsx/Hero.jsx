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
      <div className="hero-overlay">
        <div className="hero-content">
          {/* Headline now names both, not just software */}
          <h2 className="hero-title">
            Industrial chemistry and software,
            <br />
            <span className="highlight">built by Simon Mbithi.</span>
          </h2>

          <p className="hero-subtitle">
            An independent studio delivering laboratory and process software for manufacturing plants, 
            alongside hands‑on product formulation and KEBS readiness for chemical and detergent businesses.
            <br />
            Two disciplines. One founder who actually understands both.
          </p>

          <div className="marketing-strip">
            <span className="strip-item">🧪 Product Formulation</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">📋 KEBS Pre‑Certification Prep</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">🔬 LIMS for Laboratories</span>
            <span className="strip-divider">•</span>
            <span className="strip-item">🏭 Process Monitoring Software</span>
          </div>

          {/* Two doors, not one funnel — matches the fork pattern */}
          <div className="hero-cta hero-cta-split">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/services?track=software')}
            >
              Software Services
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/services?track=formulation')}
            >
              Formulation Consulting
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
