// ──────────────────────────────────────────────────────────────
//  src/components/Process.jsx
//  Ondrivo — Industrial Process Engineering Workflow
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { FiSearch, FiCpu, FiTrendingUp } from 'react-icons/fi';
import '../css/Process.css';

const Process = () => {
  const steps = [
    {
      icon: <FiSearch size={36} />,
      title: 'Assess & Analyze',
      description:
        'We evaluate your laboratory or plant workflows, identify bottlenecks, and understand your data needs — ensuring every solution is grounded in real operational requirements.',
    },
    {
      icon: <FiCpu size={36} />,
      title: 'Design & Build',
      description:
        'We architect a scalable system, design intuitive interfaces for lab technicians and process engineers, and build robust software that integrates with your existing instrumentation and workflows.',
    },
    {
      icon: <FiTrendingUp size={36} />,
      title: 'Deploy & Optimize',
      description:
        'We deploy your solution, train your team, and continuously monitor performance — ensuring your laboratory or plant runs more efficiently with every iteration.',
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
        <h2 className="process-title">How We Engineer Industrial Solutions</h2>
        <p className="process-subtitle">
          A proven, transparent process — from assessment to deployment and beyond.
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