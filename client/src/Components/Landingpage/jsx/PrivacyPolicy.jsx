import React, { useEffect } from 'react';
import '../css/Legal.css';

const PrivacyPolicy = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-date">Last Updated: October 2026</p>

        <div className="legal-content">
          <p>At Ondrivo ("we," "I," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (www.ondrivo.co.ke) or use our services.</p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Data:</strong> Your name, email address, and phone number when you fill out our contact form or reach out via WhatsApp.</li>
            <li><strong>Project Data:</strong> If you engage us for software development or chemical formulation, we may receive technical data, formulas, and business information necessary to complete the project.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, collected via standard analytics tools.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries and provide quotes.</li>
            <li>Deliver the software or formulation services you requested.</li>
            <li>Send administrative information, such as project updates or invoices.</li>
            <li>Improve our website and services based on usage trends.</li>
          </ul>

          <h2>3. Confidentiality of Chemical Formulations</h2>
          <p>We treat all client formulations and proprietary chemical data with strict confidentiality. Unless required by law, or explicitly agreed upon in writing, we will not share, sell, or distribute your proprietary formulas or business data to third parties.</p>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share information with trusted third-party service providers (such as Cloudinary for image hosting or secure cloud servers) strictly for the purpose of operating our website and delivering your project.</p>

          <h2>5. Data Security</h2>
          <p>We implement administrative and technical security measures to protect your personal information and proprietary project data.</p>

          <h2>6. Your Rights (Under Kenyan Law)</h2>
          <p>In accordance with the Kenya Data Protection Act (2019), you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your personal data (subject to contractual obligations).</li>
          </ul>

          <h2>7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p className="legal-contact">
            <strong>Ondrivo</strong><br />
            Phone: +254 703 433 014<br />
            Email: simonmbithi143@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;