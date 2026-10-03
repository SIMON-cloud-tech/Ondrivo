// ──────────────────────────────────────────────────────────────
//  src/components/Process.jsx
//  Ondrivo — How We Deliver
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { FiSearch, FiCpu, FiTrendingUp, FiFlask, FiRepeat, FiClipboard } from 'react-icons/fi';
import '../css/Process.css';

const SOFTWARE_STEPS = [
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
      'We architect a scalable system, design intuitive interfaces for lab technicians and process engineers, and build robust software that integrates with your existing workflows.',
  },
  {
    icon: <FiTrendingUp size={36} />,
    title: 'Deploy & Optimize',
    description:
      'We deploy your solution, train your team, and continuously monitor performance — ensuring your lab or plant runs more efficiently with every iteration.',
  },
];

const FORMULATION_STEPS = [
  {
    icon: <FiFlask size={36} />,
    title: 'Diagnose & Formulate',
    description:
      'We assess your product goals or existing formula, identify what\'s not working, and develop a formulation using raw materials that fit your budget and supply chain.',
  },
  {
    icon: <FiRepeat size={36} />,
    title: 'Test & Refine',
    description:
      'We test stability, performance, and cost against real-world conditions, refining the formula until its consistent, scalable, and ready for production.',
  },
  {
    icon: <FiClipboard size={36} />,
    title: 'Support & Certify',
    description:
      'We stay retained as your formulator, and where needed, prepare your product and documentation for KEBS standards and KIMS inspection.',
  },
];

const Process = () => {
  const [track, setTrack] = useState('software'); // 'software' | 'formulation'
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = track === 'software' ? SOFTWARE_STEPS : FORMULATION_STEPS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('step-visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const currentCards = cardsRef.current;
    currentCards.forEach((card) => card && observer.observe(card));

    return () => {
      currentCards.forEach((card) => card && observer.unobserve(card));
    };
  }, [track]); // re-observe when switching tracks, since the cards remount

  return (
    <section className="process-section" ref={sectionRef}>
      <div className="process-container">
        <h2 className="process-title">How We Deliver</h2>
        <p className="process-subtitle">
          A proven, transparent process — whether you need software or a formulated product.
        </p>

        {/* ── Track toggle ── */}
        <div className="process-toggle">
          <button
            className={`toggle-btn ${track === 'software' ? 'toggle-active' : ''}`}
            onClick={() => setTrack('software')}
          >
            💻 Software
          </button>
          <button
            className={`toggle-btn ${track === 'formulation' ? 'toggle-active' : ''}`}
            onClick={() => setTrack('formulation')}
          >
            🧪 Formulation
          </button>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <div
              key={`${track}-${index}`}
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