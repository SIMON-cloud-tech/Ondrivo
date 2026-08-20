// ──────────────────────────────────────────────────────────────
//  src/components/Footer.jsx
//  Ondrivo — Software Development Company Footer
// ──────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTiktok,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ── TOP SECTION ── */}
        <div className="footer-top">
          {/* BRAND INFO */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img src="/logo.png" alt="Ondrivo Software Labs" className="logo-image" />
              <h2 className="footer-title main">Ondrivo</h2>
            </div>
            <p className="footer-text">
              Websites built to last, not to disappear. We deliver full‑stack
              web and software development solutions with accountability,
              performance, and long‑term support.
            </p>
            <div className="footer-contact">
              <a href="tel:+254703433014" className="footer-contact-link">
                <FaPhone /> +254 703 433 014
              </a>
              <a href="mailto:ondrivo318@gmail.com" className="footer-contact-link">
                <FaEnvelope /> ondrivo318@gmail.com
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="footer-title small">Quick Links</h2>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/case-studies">Case Studies</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className="footer-title small">Our Services</h2>
            <ul className="footer-links">
              <li><Link to="/services#starter">Starter Websites</Link></li>
              <li><Link to="/services#business">Business Websites</Link></li>
              <li><Link to="/services#custom">Custom Build</Link></li>
              <li><Link to="/services#enterprise">Enterprise Solutions</Link></li>
            </ul>
          </div>
        </div>

        {/* ── MIDDLE SECTION ── */}
        <div className="footer-middle">
          {/* SOCIALS */}
          <div>
            <h2 className="footer-title small">Follow Us</h2>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/simon.mbithi.991238"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.tiktok.com/@ondrivo"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.linkedin.com/in/simon-mbithi-33b61b403"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/SIMON-cloud-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* CASE STUDY SNIPPET */}
          <div className="footer-case-study">
            <h2 className="footer-title small">Featured Project</h2>
            <p className="footer-case-text">
              "Simon rebuilt our website from scratch. Response time dropped from
              5s to 10ms. He actually stays after deployment."
            </p>
            <span className="footer-case-author">— John M., Energen Solar</span>
            <Link to={`/case-studies/${item.slug || item.id}`} className="footer-case-link">
              Read Full Case Study →
            </Link>
          </div>
        </div>

        {/* ── BOTTOM SECTION ── */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Ondrivo. All rights reserved.
            Built with precision, powered by accountability.
          </p>
          <Link to="/admin" className="admin-dashboard-link">
            Websites built to last, not to disappear.
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;