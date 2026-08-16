import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Reset.css';

// ── Constants ──
const OTP_LENGTH = 6;

const Reset = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // ── State ──
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  // ── Handlers ──
  const setMessage = useCallback((msg, isSuccess = false) => {
    setStatus(msg);
    if (isSuccess) {
      setTimeout(() => setStatus(''), 1500);
    }
  }, []);

  const handleEmailSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/reset/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('OTP sent! Check console for code.');
        console.log('OTP:', data.otp);
        setStep(2);
      } else {
        setMessage(data.message || 'Failed to send OTP');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, setMessage]);

  const handleOtpChange = useCallback(async (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === OTP_LENGTH) {
      setStatus('Verifying...');
      setLoading(true);

      try {
        const res = await fetch('/api/reset/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: newOtp.join('') }),
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok) {
          setMessage('Verification done', true);
          setTimeout(() => setStep(3), 1500);
        } else {
          setMessage(data.message || 'Invalid OTP');
          setOtp(Array(OTP_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
        }
      } catch {
        setMessage('Network error');
      } finally {
        setLoading(false);
      }
    }
  }, [otp, email, setMessage]);

  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/reset/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.join(''),
          newPassword: passwords.new,
        }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successful! Redirecting...', true);
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setMessage(data.message || 'Failed to reset password');
      }
    } catch {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  }, [passwords, email, otp, navigate, setMessage]);

  // ── Render helpers ──
  const renderStatus = () => {
    if (!status) return null;
    const isSuccess = status.includes('done') || status.includes('successful') || status.includes('sent');
    return <p className={`otp-status ${isSuccess ? 'done' : ''}`}>{status}</p>;
  };

  return (
    <div className="reset">
      <div className="reset-card">
        <p className="reset-title">Reset your password here</p>

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
            {renderStatus()}
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <div className="otp-section">
            <p>Enter 6‑digit code</p>
            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  className="otp-box"
                  disabled={loading}
                />
              ))}
            </div>
            {renderStatus()}
          </div>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="password-section">
            <input
              type="password"
              placeholder="Enter new password"
              value={passwords.new}
              onChange={e => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              required
            />
            {renderStatus()}
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reset;