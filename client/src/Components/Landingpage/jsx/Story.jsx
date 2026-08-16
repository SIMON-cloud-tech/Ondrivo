// ──────────────────────────────────────────────────────────────
//  src/components/pages/About.jsx
//  Ondrivo — About Page
// ──────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import '../css/Story.css';
import aboutImage from '/about.jpeg';

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
          <h2 className="hero-graffiti">Building Digital Trust,<br />One Line of Code at a Time</h2>
              <p className="hero-text">
                We don't just build websites — we build lasting partnerships. Ondrivo was
                born from a simple truth: most developers disappear after deployment,
                leaving businesses stranded. We are the opposite. We stay. We answer your
                calls months after launch. We treat your success as our own. When you work
                with Ondrivo, you're not just getting code — you're getting a partner who
                is accountable, responsive, and committed to your growth.
              </p>

              <h4 className="hero-highlights">
              <span>⚡ Accountability</span>
              <span className="highlight-divider">•</span>
              <span>🚀 Precision</span>
              <span className="highlight-divider">•</span>
              <span>🤝 Long‑term Partnership</span>
            </h4>
        </div>
      </section>

      {/* ── COMPANY INFO + IMAGE ── */}
      <section className="about-content">
        <div className="about-image">
          <img
            src={aboutImage}
            alt="Ondrivo Software Company"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            <strong>Ondrivo</strong> is a software development company built on
            one core promise: <strong>accountability</strong>. We deliver
            full‑stack web and software solutions that don't disappear after
            deployment — because we stay with you.
          </p>
          <p>
            Founded in <strong>2024</strong>, Ondrivo was created to solve a
            problem far too many businesses face: developers who vanish after
            the project is delivered. We are the opposite. We build lasting
            relationships, lasting software, and lasting trust.
          </p>
          <p>
            From custom web applications to AI‑powered systems, we combine
            engineering precision with a commitment to long‑term support.
          </p>
          <p className="tagline">🚀 Built to last. Not to disappear.</p>
        </div>
      </section>

      {/* ── MISSION, VISION, VALUES ── */}
      <section className="about-mvv" ref={sectionRef}>
        <div className="mvv-card">
          <h3>🎯 Mission</h3>
          <p>
            To empower businesses with reliable, high‑performance software that
            drives growth — and to be the developer who stays accountable long
            after the final commit.
          </p>
        </div>
        <div className="mvv-card">
          <h3>🔭 Vision</h3>
          <p>
            To become the most trusted software partner for businesses in Kenya
            and beyond — where "built to last" isn't just a slogan, it's a
            guarantee.
          </p>
        </div>
        <div className="mvv-card">
          <h3>⭐ Core Values</h3>
          <ul>
            <li>Accountability</li>
            <li>Precision</li>
            <li>Long‑term partnership</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;