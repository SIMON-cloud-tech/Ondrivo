// ──────────────────────────────────────────────────────────────
//  src/components/Process.jsx
//  Ondrivo — How We Work (3 Steps)
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { FiHome, FiFileText, FiZap } from 'react-icons/fi';
import '../css/Process.css';

const Process = () => {
  const steps = [
    {
      icon: <FiHome size={36} />,
      title: 'Discovery & Strategy',
      description:
        'We dive deep into your business goals, technical requirements, and user needs — ensuring every decision is aligned with your vision.',
    },
    {
      icon: <FiFileText size={36} />,
      title: 'Architecture & Design',
      description:
        'We plan a scalable system architecture, design intuitive UI/UX, and define a clear roadmap for development.',
    },
    {
      icon: <FiZap size={36} />,
      title: 'Development & Launch',
      description:
        'We build, test, and deploy your solution with precision — then provide ongoing support to keep you ahead.',
    },
  ];

  // ── Intersection Observer for lazy‑loading animation ──
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('step-visible');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe each card
    const currentCards = cardsRef.current;
    currentCards.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      currentCards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="process-section" ref={sectionRef}>
      <div className="process-container">
        <h2 className="process-title">How We Deliver Excellence</h2>
        <p className="process-subtitle">
          A proven, transparent process — from idea to launch and beyond.
        </p>

        <div className="process-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="process-step"
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="step-number">0{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;