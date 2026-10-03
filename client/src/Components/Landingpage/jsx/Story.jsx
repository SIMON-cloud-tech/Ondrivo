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
          <h2 className="hero-graffiti">
            Bridging Chemistry and Code
            <br />
            for Industrial Innovation
          </h2>
          <p className="hero-text">
            Ondrivo is an Industrial Process and Systems Engineering firm that
            works in two disciplines under one name. We build specialized
            software for laboratories and manufacturing plants — custom LIMS,
            process dashboards, and engineering-grade tools that generic
            developers can't design. And we formulate chemical and detergent
            products for businesses that need a working formula, not just a
            consultant's slide deck — from raw material selection through KEBS
            readiness.
          </p>
          <h4 className="hero-highlights">
            <span>🧪 Product Formulation</span>
            <span className="highlight-divider">•</span>
            <span>📋 KEBS Pre‑Certification</span>
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
            <strong>Ondrivo</strong> is an Industrial Process and Systems
            Engineering firm built on one core promise:{' '}
            <strong>accountability</strong>. We deliver two things, and we
            deliver both with the same standard of rigor:
          </p>
          <p>
            <strong>1. Industrial software</strong> — laboratory information
            management systems, process optimization dashboards, and custom
            tools for chemical and manufacturing operations.
          </p>
          <p>
            <strong>2. Product formulation and consulting</strong> — hands-on
            formulation for chemical and detergent products, troubleshooting
            of existing formulas, and preparation for KEBS standards and KIMS
            inspection.
          </p>
          <p>
            Founded in <strong>2024</strong>, Ondrivo was created to close a
            gap in Kenya's industrial sector: there was no single partner who
            understood both the chemistry of a process and the software needed
            to run it — and no formulator who would stay retained as a
            product line scaled. We combine a degree in Industrial Chemistry
            with full-stack development and formulation experience, so the
            same person who understands your reactor also understands your
            formula.
          </p>
          <p>
            From spectroscopy data management to reactor performance
            monitoring, from a first detergent formula to KEBS certification —
            we deliver work that lasts.
          </p>
          <p className="tagline">
            🧪 Chemistry + Code. Two services. One standard.
          </p>
        </div>
      </section>

      {/* ── MISSION, VISION, VALUES ── */}
      <section className="about-mvv" ref={sectionRef}>
        <div className="mvv-card">
          <h3>🎯 Mission</h3>
          <p>
            To empower laboratories, manufacturing plants, and chemical
            product businesses with reliable software and hands-on
            formulation expertise — streamlining operations, ensuring quality
            and compliance, and turning good products into certified,
            scalable ones.
          </p>
        </div>
        <div className="mvv-card">
          <h3>🔭 Vision</h3>
          <p>
            To become the leading industrial partner in Kenya and East Africa
            — where chemistry and code work together to power sustainable
            manufacturing, and where a shop owner and a plant manager can
            both find the same trusted name.
          </p>
        </div>
        <div className="mvv-card">
          <h3>⭐ Core Values</h3>
          <ul>
            <li>Engineering Precision</li>
            <li>Accountability</li>
            <li>Industry Expertise</li>
            <li>Formula Confidentiality</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;