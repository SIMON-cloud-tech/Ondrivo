import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const consent = localStorage.getItem('ondrivo_cookie_consent');
    if (!consent) {
      // Add a slight delay so it doesn't pop up aggressively the millisecond they land
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ondrivo_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          This site uses cookies to ensure you get the best experience and to analyze site traffic. 
          Read our <Link to="/privacy">Privacy Policy</Link> for more details.
        </p>
      </div>
      <div className="cookie-actions">
        <button className="cookie-btn-accept" onClick={handleAccept}>
          Accept Cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;