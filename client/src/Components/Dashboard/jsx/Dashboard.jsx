import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiPackage, FiEdit, FiFolder, FiStar,
  FiLogOut, FiSun, FiMoon, FiMenu, FiX,
} from 'react-icons/fi';
import '../css/Dashboard.css';
import CaseStudy from './CaseStudyManage.jsx';
import BlogManage from './BlogManage.jsx';
import ProjectManage from './ProjectManage.jsx';
import TestimonialsManage from './TestimonialManage.jsx';

// ── Constants ──
const MENU_ITEMS = [
  { id: 'case-studies', label: 'Case Studies', icon: FiPackage, component: CaseStudy },
  { id: 'blog', label: 'Blogs', icon: FiEdit, component: BlogManage },
  { id: 'projects', label: 'Projects', icon: FiFolder, component: ProjectManage },
  { id: 'testimonials', label: 'Testimonials', icon: FiStar, component: TestimonialsManage },
];

const Dashboard = ({ setUser }) => {
  const navigate = useNavigate();
  
  // ── State ──
  const [activeMenu, setActiveMenu] = useState('case-studies');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Memoize active component ──
  const ActiveComponent = useMemo(() => {
    const item = MENU_ITEMS.find(i => i.id === activeMenu);
    return item?.component || null;
  }, [activeMenu]);

  const activeLabel = useMemo(() => {
    const item = MENU_ITEMS.find(i => i.id === activeMenu);
    return item?.label || 'Dashboard';
  }, [activeMenu]);

  // ── Theme persistence ──
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Fetch profile ──
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) navigate('/admin');
        throw new Error('Failed to fetch');
      }
      setProfile(await res.json());
    } catch (err) {
      console.error('Profile error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Handlers ──
  const handleLogout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('/admin');
  }, [setUser, navigate]);

  const toggleMenu = useCallback(() => setMobileOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  }, []);

  // ── Loading ──
  if (loading) return <div className="dashboard-status">Loading dashboard...</div>;

  return (
    <div className={`dashboard ${theme}`}>
      {/* ── Mobile Top Bar ── */}
      <div className="mobile-topbar">
        <button className="mobile-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ── Overlay ── */}
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={closeMenu} />

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>

        <nav>
          {MENU_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-item ${activeMenu === id ? 'active' : ''}`}
              onClick={() => { setActiveMenu(id); closeMenu(); }}
            >
              <span className="sidebar-icon"><Icon size={20} /></span>
              <span className="sidebar-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon"><FiLogOut size={20} /></span>
            <span className="sidebar-label">Logout</span>
          </button>
          <button className="theme-toggle" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
            <span className="sidebar-icon">
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </span>
            <span className="sidebar-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="dashboard-main">
        <section className="dashboard-row dashboard-row-fixed">
          <div className="welcome-banner">
            <h1 className="welcome-title">{getGreeting()}, {profile?.name || 'User'}! 👋</h1>
          </div>
        </section>

        <section className="dashboard-row dashboard-row-scrollable">
          <div className="content-panel full-width">
            <h3>{activeLabel}</h3>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Ondrivo. All rights reserved.</p>
          <Link to="/" className="dashboard-footer-link">
            <p>Websites built to last, not to disappear. 🚀</p>
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;