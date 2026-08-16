// ──────────────────────────────────────────────────────────────
//  src/components/Services.jsx
//  Ondrivo — Services (Light / Full versions)
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCode,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
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
      id: 'starter',
      icon: <FaRocket size={32} />,
      title: 'Starter',
      price: '$800',
      period: 'one‑time',
      description: 'A professional, responsive website to get you online fast.',
      features: isLight
        ? ['5‑page website', 'Mobile‑first design', 'Basic SEO', '1 month support']
        : [
            '5‑page custom website',
            'Mobile‑first responsive design',
            'Contact form integration',
            'Basic SEO setup',
            'Social media links',
            'Google Analytics setup',
            '1 month free support',
          ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      id: 'business',
      icon: <FiBriefcase size={32} />,
      title: 'Business',
      price: '$1,500',
      period: 'one‑time',
      description: 'A robust website with advanced features and functionality.',
      features: isLight
        ? ['10‑page website', 'Blog section', 'Advanced SEO', '3 months support']
        : [
            '10‑page custom website',
            'Blog / news section',
            'Advanced SEO optimization',
            'Email marketing integration',
            'Custom contact forms',
            'Performance optimization',
            '3 months free support',
            'Content management system',
          ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      id: 'custom',
      icon: <FiCode size={32} />,
      title: 'Custom Build',
      price: '$5,000+',
      period: 'one‑time',
      description: 'A tailor‑made software solution built exactly for your needs.',
      features: isLight
        ? ['Custom web app', 'API integrations', 'Payments', 'Admin panel']
        : [
            'Full custom web application',
            'API integrations (payment, SMS, etc.)',
            'Payment system (M‑Pesa, Stripe, etc.)',
            'Secure admin panel / dashboard',
            'Database design & setup',
            'Advanced security measures',
            '6 months free support',
            'Full documentation & handover',
          ],
      cta: "Let's Talk",
      highlight: true, // featured plan
    },
    {
      id: 'enterprise',
      icon: <FiAward size={32} />,
      title: 'Enterprise',
      price: '$3,000+',
      period: 'per month',
      description: 'Full‑service partnership — dev, AI, marketing, and support.',
      features: [
        'Everything in Custom Build',
        'Ongoing development & updates',
        'AI‑powered features (RAG, chatbots)',
        'Monthly SEO optimization',
        'Social media management',
        '24/7 technical support',
        'Performance monitoring',
        'Dedicated developer access',
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

    // Also observe hero if it exists (full version)
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
                Software solutions built to <span className="highlight">last</span>
              </h1>
              <p className="services-hero-subtitle">
                From simple websites to complex AI‑powered systems — we deliver
                with precision, accountability, and long‑term support.
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
              ? 'Choose the plan that fits your needs.'
              : 'From a simple website to a full‑scale custom solution — pick the plan that fits your needs.'}
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
                Need more than a website? We build custom software too.
              </p>
              <button className="services-bottom-cta" onClick={handleViewAll}>
                View All Services →
              </button>
            </>
          ) : (
            <>
              <p className="services-bottom-text">
                Not sure which plan fits you? We'll help you figure it out — no obligation.
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