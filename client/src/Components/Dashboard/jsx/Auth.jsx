// ──────────────────────────────────────────────────────────────
//  src/Components/Dashboard/jsx/Auth.jsx
//  Ondrivo — Authentication (Login / Register)
// ──────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { FiEye, FiEyeOff, FiCode } from 'react-icons/fi';
import '../css/Auth.css';

// ── Constants ──
const INITIAL_FORM = { fullName: '', email: '', password: '' };

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  // ── Handlers ──
  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setMessage('');
    setForm(INITIAL_FORM);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin 
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('❌ Non-JSON response:', text);
        setMessage('Server error. Check console.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setMessage('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [isLogin, form, setUser, navigate]);

  return (
    <div className="auth">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div className="logo-container">
          <FiCode size={72} color="#C08B3E" />
        </div>
        <h1>Ondrivo</h1>
        <p>
          Websites built to last, not to disappear. Full‑stack web and software
          development solutions with accountability, performance, and 
          long‑term support.
        </p>
        <p className="auth-tagline">🚀 Built to last. Not to disappear.</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-form">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Access your Ondrivo dashboard' 
              : 'Start managing your projects and content'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <span 
                  className="password-toggle" 
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            {message && (
              <p className={`auth-message ${message.includes('successful') || message.includes('created') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}

            {isLogin && (
              <p className="forgot-password" onClick={() => navigate('/reset')}>
                Forgot Password?
              </p>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? (
              <>Don't have an account? <span onClick={toggleMode}>Sign up</span></>
            ) : (
              <>Already signed in? <span onClick={toggleMode}>Log in</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;