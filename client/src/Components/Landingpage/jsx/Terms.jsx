import React, { useEffect } from 'react';
import '../css/Legal.css';

const Terms = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Terms and Conditions</h1>
        <p className="legal-date">Last Updated: October 2026</p>

        <div className="legal-content">
          <p>Welcome to Ondrivo. These Terms and Conditions ("Terms") govern your use of our website (www.ondrivo.co.ke) and our software development and industrial consulting services.</p>

          <h2>1. Services</h2>
          <p>Ondrivo provides custom software development (web and mobile applications, LIMS, dashboards) and chemical product formulation consulting. By engaging our services, you agree to be bound by these Terms.</p>

          <h2>2. Scope of Work and Agreements</h2>
          <p>All projects (software or formulation) will be governed by a separate written proposal or agreement that outlines the deliverables, timeline, pricing, and specific requirements. In the event of a conflict between these Terms and a signed agreement, the signed agreement will take precedence.</p>

          <h2>3. Client Responsibilities</h2>
          <p>You agree to provide timely access to necessary information, raw materials (if applicable), and feedback required for us to complete the services. Delays in providing these may result in adjusted timelines.</p>

          <h2>4. Intellectual Property</h2>
          <ul>
            <li><strong>Software:</strong> Upon full payment, the client owns the custom source code, database structures, and assets built specifically for them. We retain the right to use generic, reusable frameworks, libraries, and architectural patterns in other projects.</li>
            <li><strong>Formulation:</strong> Unless a full buyout is explicitly agreed upon in writing, the client receives a license to manufacture and sell the formulated product. Ondrivo retains the underlying proprietary knowledge and base formulation chemistry.</li>
          </ul>

          <h2>5. Payment Terms</h2>
          <p>Payment schedules are defined in individual project proposals. We typically require a deposit before commencing work, with the balance due upon delivery. Late payments may incur suspension of services.</p>

          <h2>6. Limitation of Liability</h2>
          <p>While we strive for the highest standards, Ondrivo shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our software or formulations. The client is responsible for the final testing, regulatory compliance (including KEBS), and safety of the final end product.</p>

          <h2>7. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya.</p>

          <h2>8. Contact</h2>
          <p>For any legal inquiries, please contact:</p>
          <p className="legal-contact">
            <strong>Simon Mbithi (Ondrivo)</strong><br />
            Email: simonmbithi143@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;