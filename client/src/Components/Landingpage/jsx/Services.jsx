// ──────────────────────────────────────────────────────────────
//  src/components/Services.jsx
//  Ondrivo — Industrial Process & Systems Engineering Services
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCode,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
  FiDatabase,
  FiTrendingUp,
  FiBookOpen,
} from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';
import '../css/Services.css';

const Services = ({ variant = 'full' }) => {
  const isLight = variant === 'light';
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const heroRef = useRef(null);

  // ── Service Plans Data ──
  const plans = [
    {
      id: 'lims',
      icon: <FiDatabase size={32} />,
      title: 'Laboratory LIMS',
      price: '$5,000+',
      period: 'one‑time',
      description: 'Custom Laboratory Information Management System for your lab — track samples, tests, inventory, and generate reports.',
      features: isLight
        ? ['Sample tracking', 'Test result recording', 'Report generation', 'Inventory management']
        : [
            'Complete sample lifecycle tracking (receipt → disposal)',
            'Test result recording with quality control',
            'Certificate of Analysis (COA) generation',
            'Chemical and reagent inventory management',
            'Equipment calibration and maintenance tracking',
            'User roles and permissions (lab staff, managers, auditors)',
            'Audit trail for regulatory compliance',
            'Export capabilities (PDF, Excel, CSV)',
            'Cloud-based or on-premise deployment',
          ],
      cta: "Let's Talk",
      highlight: true,
    },
    {
      id: 'process-dashboard',
      icon: <FiTrendingUp size={32} />,
      title: 'Process Dashboard',
      price: '$3,000+',
      period: 'one‑time',
      description: 'Real-time monitoring and optimization dashboard for chemical plants and manufacturing processes.',
      features: isLight
        ? ['Real‑time monitoring', 'Historical analysis', 'Alerts & notifications', 'Yield tracking']
        : [
            'Real‑time monitoring of temperature, pressure, flow rates',
            'Historical data analysis and trend visualization',
            'Automated alerts when parameters drift outside setpoints',
            'Yield and efficiency tracking (reactor performance)',
            'Customizable dashboards (operators, managers, executives)',
            'Export capabilities (PDF, Excel, CSV)',
            'User authentication and role-based access',
            'Integration with sensors (via manual entry or API)',
            'Mobile-responsive design for on‑the‑go monitoring',
          ],
      cta: "Let's Talk",
      highlight: false,
    },
    {
      id: 'custom-software',
      icon: <FiCode size={32} />,
      title: 'Custom Software',
      price: '$5,000+',
      period: 'one‑time',
      description: 'Tailor‑made software solutions for industrial, laboratory, and manufacturing needs — built exactly for your workflow.',
      features: isLight
        ? ['Custom web app', 'API integrations', 'Secure admin panel', 'Database design']
        : [
            'Full custom web application development',
            'API integrations (payment, SMS, instrumentation, etc.)',
            'Secure admin panel and user management',
            'Database design and optimization',
            'Advanced security measures and data encryption',
            'Full documentation and training',
            '6 months free support included',
            'Scalable architecture for future growth',
            'Cloud-based or on-premise deployment',
          ],
      cta: "Let's Talk",
      highlight: false,
    },
    {
      id: 'enterprise',
      icon: <FiAward size={32} />,
      title: 'Enterprise',
      price: '$3,000+',
      period: 'per month',
      description: 'Full‑service partnership — ongoing development, optimization, AI integration, and 24/7 support.',
      features: [
        'Everything in Custom Software (on retainer)',
        'Ongoing development and feature updates',
        'AI‑powered features (predictive analytics, automation)',
        'Monthly optimization and performance tuning',
        '24/7 technical support and monitoring',
        'Dedicated developer access and priority response',
      ],
      cta: "Let's Talk",
      highlight: false,
    },
  ];

  // ── Only show 3 plans for Light version ──
  const displayPlans = isLight ? plans.slice(0, 3) : plans;

  // ── Intersection Observer for lazy-loading cards ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('plan-visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentCards = cardsRef.current;
    currentCards.forEach((card) => {
      if (card) observer.observe(card);
    });

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      currentCards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // ── Handlers ──
  const handleCtaClick = (planId) => {
    navigate('/contact');
  };

  const handleViewAll = () => {
    navigate('/services');
  };

  const handleConsultation = () => {
    navigate('/contact');
  };

  return (
    <section className={`services-section ${isLight ? 'services-light' : 'services-full'}`} ref={sectionRef}>
      <div className="services-container">
        {/* ── HERO (Full version only) ── */}
        {!isLight && (
          <div className="services-hero" ref={heroRef}>
            <div className="services-hero-content">
              <span className="services-hero-badge">Our Services</span>
              <h1 className="services-hero-title">
                Industrial software built to <span className="highlight">last</span>
              </h1>
              <p className="services-hero-subtitle">
                From laboratory information systems to process optimization dashboards — we deliver 
                specialized software solutions with precision, accountability, and long‑term support.
              </p>
              <div className="services-hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-number">50+</span>
                  <span className="hero-stat-label">Projects Delivered</span>
                </div>
                <div className="hero-stat-divider">•</div>
                <div className="hero-stat">
                  <span className="hero-stat-number">99.8%</span>
                  <span className="hero-stat-label">Performance Improvement</span>
                </div>
                <div className="hero-stat-divider">•</div>
                <div className="hero-stat">
                  <span className="hero-stat-number">100%</span>
                  <span className="hero-stat-label">Client Accountability</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="services-header">
          <h2 className="services-title">{isLight ? 'Our Services' : 'Choose Your Plan'}</h2>
          <p className="services-subtitle">
            {isLight
              ? 'Specialized software for laboratories, manufacturing, and process industries.'
              : 'From LIMS to process dashboards — choose the plan that fits your industrial needs.'}
          </p>
        </div>

        {/* ── Plans Grid ── */}
        <div className={`services-grid ${isLight ? 'grid-3' : 'grid-4'}`}>
          {displayPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.highlight ? 'plan-highlight' : ''}`}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              {/* ── Badge for highlighted plan ── */}
              {plan.highlight && <div className="plan-badge">Most Popular</div>}

              {/* ── Icon ── */}
              <div className="plan-icon">{plan.icon}</div>

              {/* ── Title ── */}
              <h3 className="plan-title">{plan.title}</h3>

              {/* ── Price ── */}
              <div className="plan-price">
                <span className="plan-price-amount">{plan.price}</span>
                <span className="plan-price-period"> / {plan.period}</span>
              </div>

              {/* ── Description ── */}
              <p className="plan-description">{plan.description}</p>

              {/* ── Features ── */}
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="plan-feature">
                    <FiCheckCircle className="feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* ── CTA ── */}
              <button
                className={`plan-cta ${plan.highlight ? 'cta-highlight' : ''}`}
                onClick={() => handleCtaClick(plan.id)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="services-bottom">
          {isLight ? (
            <>
              <p className="services-bottom-text">
                Need a custom solution for your lab or plant? We build specialized software too.
              </p>
              <button className="services-bottom-cta" onClick={handleViewAll}>
                View All Services →
              </button>
            </>
          ) : (
            <>
              <p className="services-bottom-text">
                Not sure which plan fits your lab or plant? We'll help you figure it out — no obligation.
              </p>
              <button className="services-bottom-cta" onClick={handleConsultation}>
                Get a Free Consultation →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;