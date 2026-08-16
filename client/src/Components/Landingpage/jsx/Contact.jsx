// ──────────────────────────────────────────────────────────────
//  src/Components/Contact.jsx
//  Ondrivo — Contact Section with Testimonials from API
// ──────────────────────────────────────────────────────────────

import { useState, useCallback, memo, useEffect, useRef } from 'react';
import { FaPhone, FaEnvelope, FaGlobe, FaStar } from 'react-icons/fa';
import '../css/Contact.css';

// ── Config ──
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254703433014';

// ── Contact Details (for full version) ──
const CONTACT_DETAILS = [
  {
    id: 'phone',
    label: 'Phone / WhatsApp',
    value: '+254 703 433 014',
    href: 'tel:+254703433014',
    icon: <FaPhone />,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'ondrivo318@gmail.com',
    href: 'mailto:ondrivo318@gmail.com',
    icon: <FaEnvelope />,
  },
  {
    id: 'website',
    label: 'Website',
    value: 'www.ondrivo.co.ke',
    href: 'https://www.ondrivo.co.ke',
    icon: <FaGlobe />,
  },
];

const EMPTY_FORM = { name: '', phone: '', email: '', message: '' };

// ── Row Component (memoized) ──
const DetailRow = memo(({ icon, label, value, href }) => (
  <a href={href} className="detail-row" target="_blank" rel="noopener noreferrer">
    <span className="detail-row__icon">{icon}</span>
    <span>
      <strong>{label}</strong>
      <p>{value}</p>
    </span>
  </a>
));

const Contact = ({ variant = 'full' }) => {
  const isLight = variant === 'light';
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  // ── Testimonials state ──
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // ── Refs ──
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const testimonialTimerRef = useRef(null);

  // ── Fetch testimonials from API ──
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error('Fetch testimonials error:', err);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // ── Intersection Observer: lazy-load cards and visibility ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            if (entry.target === rightRef.current && isLight) {
              setIsVisible(true);
            }
          } else {
            if (entry.target === rightRef.current && isLight) {
              setIsVisible(false);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const leftCard = leftRef.current;
    const rightCard = rightRef.current;

    if (leftCard) observer.observe(leftCard);
    if (rightCard) observer.observe(rightCard);

    return () => {
      if (leftCard) observer.unobserve(leftCard);
      if (rightCard) observer.unobserve(rightCard);
    };
  }, [isLight]);

  // ── Testimonial rotation (only when visible) ──
  useEffect(() => {
    if (!isLight || testimonials.length === 0) return;

    if (isVisible) {
      testimonialTimerRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 60000);
    } else {
      clearInterval(testimonialTimerRef.current);
    }

    return () => {
      clearInterval(testimonialTimerRef.current);
    };
  }, [isLight, isVisible, testimonials.length]);

  // ── Manual dot click ──
  const goToTestimonial = useCallback((index) => {
    setCurrentTestimonial(index);
    clearInterval(testimonialTimerRef.current);
    if (isVisible && testimonials.length > 0) {
      testimonialTimerRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 60000);
    }
  }, [isVisible, testimonials.length]);

  // ── Form handlers ──
  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const text = `
Hi Ondrivo Team 👋

I'm interested in your software development services.

My details:
• Name: ${form.name}
• Phone: ${form.phone}
• Email: ${form.email || 'N/A'}

My enquiry:
${form.message}

Please advise on availability, timeline, and pricing.

Looking forward to your reply 🚀
`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setTimeout(() => setSubmitted(false), 4000);
    },
    [form]
  );

  // ── Render stars for testimonials ──
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
    ));
  };

  // ── Get current testimonial ──
  const currentTestimonialData = testimonials[currentTestimonial] || null;

  return (
    <section className={`contact-section ${isLight ? 'contact-light' : ''}`} ref={sectionRef}>
      {/* ── Header ── */}
      <div className="contact-header">
        <h2 className="contact-title">{isLight ? 'Have a project in mind?' : 'Get in Touch'}</h2>
        <p className="contact-subtitle">
          {isLight
            ? "Let's talk about your idea — we'll help you build it."
            : 'Ready to build something great? Reach out — we\'d love to hear from you.'}
        </p>
      </div>

      {/* ── Body ── */}
      <div className="contact-body">
        {isLight ? (
          <>
            {/* LIGHT VERSION: LEFT = Contact Form */}
            <div className="contact-right contact-form-card" ref={leftRef}>
              <div className="light-contact-info">
                <p className="light-contact-line">
                  <FaPhone className="light-contact-icon" /> +254 703 433 014
                  <span className="light-contact-divider">|</span>
                  <FaEnvelope className="light-contact-icon" /> ondrivo318@gmail.com
                </p>
              </div>

              {submitted && (
                <p className="success">✓ WhatsApp opened — we'll get back to you shortly 🚀</p>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (optional)"
                  value={form.email}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  placeholder="Tell us about your project — web app, mobile app, AI integration, or something else?"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Send on WhatsApp →</button>
              </form>
            </div>

            {/* LIGHT VERSION: RIGHT = Testimonials from API */}
            <div className="testimonials-card" ref={rightRef}>
              <h3>What Our Clients Say</h3>

              {testimonialsLoading ? (
                <div className="testimonial-loading">
                  <p>Loading testimonials...</p>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="testimonial-empty">
                  <p>No testimonials yet.</p>
                </div>
              ) : (
                <>
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      {renderStars(5)} {/* Default 5 stars since no rating field */}
                    </div>
                    <p className="testimonial-quote">"{currentTestimonialData?.text}"</p>
                    <div className="testimonial-author">
                      <strong>{currentTestimonialData?.name}</strong>
                      {currentTestimonialData?.location && (
                        <span>{currentTestimonialData.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentTestimonial ? 'dot-active' : ''}`}
                        onClick={() => goToTestimonial(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* FULL VERSION: LEFT = Contact Info */}
            <div className="contact-left" ref={leftRef}>
              <h3>Contact Info</h3>
              <div>
                {CONTACT_DETAILS.map((d) => (
                  <DetailRow key={d.id} {...d} />
                ))}
              </div>
            </div>

            {/* FULL VERSION: RIGHT = Contact Form */}
            <div className="contact-right" ref={rightRef}>
              <h3>Request a Consultation</h3>

              {submitted && (
                <p className="success">✓ WhatsApp opened — we'll get back to you shortly 🚀</p>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (optional)"
                  value={form.email}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  placeholder="Tell us about your project — web app, mobile app, AI integration, or something else?"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Send on WhatsApp 🚀</button>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Contact;