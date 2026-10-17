// ──────────────────────────────────────────────────────────────
//  src/components/Services.jsx
//  Ondrivo — Industrial Process & Systems Engineering Services
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiCode,
  FiAward,
  FiCheckCircle,
  FiDatabase,
  FiTrendingUp,
  FiGrid,
  FiClipboard,
} from 'react-icons/fi';
import '../css/Services.css';

const Services = ({ variant = 'full' }) => {
  const isLight = variant === 'light';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTrack = searchParams.get('track'); // 'software' | 'formulation' | null

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const heroRef = useRef(null);

  // ── Software plans ──
  const softwarePlans = [
    {
      id: 'lims',
      category: 'software',
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
      category: 'software',
      icon: <FiTrendingUp size={32} />,
      title: 'Process Dashboard',
      price: '$3,000+',
      period: 'one‑time',
      description: 'Real-time monitoring and optimization dashboard for chemical plants and manufacturing processes.',
      features: isLight
        ? ['Real‑time monitoring', 'Historical analysis', 'Alerts & notifications', 'Yield tracking']
        : [
            'Real-time monitoring of temperature, pressure, flow rates',
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
      category: 'software',
      icon: <FiCode size={32} />,
      title: 'Custom Software',
      price: '$5,000+',
      period: 'one‑time',
      description: 'Tailor‑made software for industrial, laboratory, and manufacturing needs — built exactly for your workflow.',
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
      category: 'software',
      icon: <FiAward size={32} />,
      title: 'Enterprise',
      price: '$3,000+',
      period: 'per month',
      description: 'Full‑service partnership — ongoing development, optimization, AI integration, and support.',
      features: [
        'Everything in Custom Software (on retainer)',
        'Ongoing development and feature updates',
        'AI‑powered features (predictive analytics, automation)',
        'Monthly optimization and performance tuning',
        'Dedicated developer access and priority response',
      ],
      cta: "Let's Talk",
      highlight: false,
    },
  ];

  // ── Formulation & consulting plans ──
  const formulationPlans = [
    {
      id: 'product-formulation',
      category: 'formulation',
      icon: <FiGrid size={32} />,
      title: 'Product Formulation',
      price: 'KES 5,000+',
      period: 'per month',
      description: 'Hands-on formulation and troubleshooting for chemical and detergent products — built for your raw materials and market.',
      features: isLight
        ? ['Custom formulation', 'Cost & ratio optimization', 'Stability troubleshooting', 'Ongoing support']
        : [
            'Product formulation (cleaners, sprays, softeners, and more)',
            'Troubleshooting existing formulas for stability or performance',
            'Raw material sourcing and ratio optimization',
            'Shelf-life and stability guidance',
            'Formula retained privately — not sold elsewhere',
            'Ongoing monthly support as your product line grows',
          ],
      cta: "Let's Talk",
      highlight: true,
    },
    {
      id: 'kebs-prep',
      category: 'formulation',
      icon: <FiClipboard size={32} />,
      title: 'KEBS Pre‑Certification Prep',
      price: 'Custom Quote',
      period: 'project',
      description: 'Get your product and documentation ready for Kenya Standards and KIMS inspection.',
      features: [
        'Standards gap assessment for your current product',
        'Documentation and labeling guidance',
        'Pre-inspection readiness review',
        'Support through the KIMS application process',
      ],
      cta: "Let's Talk",
      highlight: false,
    },
  ];

  const allPlans = [...softwarePlans, ...formulationPlans];

  // ── Light variant: fork, don't blend — show 2 software + 1 formulation teaser ──
  const lightDisplayPlans = [...softwarePlans.slice(0, 2), formulationPlans[0]];

  // ── Full variant: filter by track if the Hero linked here with one, else show both groups ──
  const fullSoftwarePlans = softwarePlans;
  const fullFormulationPlans = formulationPlans;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('plan-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const currentCards = cardsRef.current;
    currentCards.forEach((card) => card && observer.observe(card));
    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      currentCards.forEach((card) => card && observer.unobserve(card));
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, [requestedTrack]);

  const handleCtaClick = () => navigate('/contact');
  const handleViewAll = () => navigate('/services');
  const handleConsultation = () => navigate('/contact');

  const renderCard = (plan, index) => (
    <div
      key={plan.id}
      className={`plan-card ${plan.highlight ? 'plan-highlight' : ''}`}
      ref={(el) => (cardsRef.current[index] = el)}
    >
      {plan.highlight && <div className="plan-badge">Most Popular</div>}
      <div className="plan-icon">{plan.icon}</div>
      <h3 className="plan-title">{plan.title}</h3>
      <div className="plan-price">
        <span className="plan-price-amount">{plan.price}</span>
        <span className="plan-price-period"> / {plan.period}</span>
      </div>
      <p className="plan-description">{plan.description}</p>
      <ul className="plan-features">
        {plan.features.map((feature, i) => (
          <li key={i} className="plan-feature">
            <FiCheckCircle className="feature-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`plan-cta ${plan.highlight ? 'cta-highlight' : ''}`}
        onClick={() => handleCtaClick(plan.id)}
      >
        {plan.cta}
      </button>
    </div>
  );

  return (
    <section className={`services-section ${isLight ? 'services-light' : 'services-full'}`} ref={sectionRef}>
      <div className="services-container">
        {/* ── HERO (Full version only) ── */}
        {!isLight && (
          <div className="services-hero" ref={heroRef}>
            <div className="services-hero-content">
              <span className="services-hero-badge">My Services</span>
              <h1 className="services-hero-title">
                Two disciplines, <span className="highlight">one standard</span>
              </h1>
              <p className="services-hero-subtitle">
                Industrial software for labs and plants, and hands-on product formulation
                and KEBS readiness for chemical businesses — delivered with the same
                precision and accountability either way.
              </p>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="services-header">
          <h2 className="services-title">{isLight ? 'My Services' : 'Choose a Service'}</h2>
          <p className="services-subtitle">
            {isLight
              ? 'Specialized software and hands-on formulation — for labs, plants, and product businesses.'
              : 'From LIMS to product formulation — pick the track that fits what you need.'}
          </p>
        </div>

        {isLight ? (
          <div className="services-grid grid-3">
            {lightDisplayPlans.map((plan, index) => renderCard(plan, index))}
          </div>
        ) : (
          <>
            {/* ── Software group ── */}
            {(!requestedTrack || requestedTrack === 'software') && (
              <div className="services-group">
                <h3 className="services-group-title">💻 Software Services</h3>
                <div className="services-grid grid-4">
                  {fullSoftwarePlans.map((plan, index) => renderCard(plan, index))}
                </div>
              </div>
            )}

            {/* ── Formulation group ── */}
            {(!requestedTrack || requestedTrack === 'formulation') && (
              <div className="services-group">
                <h3 className="services-group-title">🧪 Formulation & Industrial Consulting</h3>
                <div className="services-grid grid-2">
                  {fullFormulationPlans.map((plan, index) =>
                    renderCard(plan, index + fullSoftwarePlans.length)
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Bottom CTA ── */}
        <div className="services-bottom">
          {isLight ? (
            <>
              <p className="services-bottom-text">
                Need a custom lab system, or help formulating your product? I do both.
              </p>
              <button className="services-bottom-cta" onClick={handleViewAll}>
                View All Services →
              </button>
            </>
          ) : (
            <>
              <p className="services-bottom-text">
                Not sure which service fits? I'll help you figure it out — no obligation.
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
