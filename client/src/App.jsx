//import third party libraries
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//import the global components
import Loader from './Components/Landingpage/jsx/Loader.jsx';
import PublicLayout from './Components/layouts/PublicLayout.jsx';

// Public pages
import Home from './Components/pages/Home.jsx';
import Services from './Components/Landingpage/jsx/Services.jsx';
import Proofs from './Components/Landingpage/jsx/Proof.jsx';
import ProofPage from './Components/pages/ProofPage.jsx';
import About from './Components/pages/About.jsx';
import Contact from './Components/pages/Reach.jsx';
import Projects from './Components/Landingpage/jsx/Projects.jsx';
import CaseStudyDetail from './Components/Landingpage/jsx/CaseStudyDetail.jsx';
import ProjectDetail from './Components/Landingpage/jsx/ProjectDetail.jsx';
import BlogDetail from './Components/Landingpage/jsx/BlogDetail.jsx';
import BlogSection from './Components/Landingpage/jsx/Blogs.jsx';
import ServicePage from './Components/pages/ServicePage.jsx';

// Admin / Auth
import Auth from './Components/Dashboard/jsx/Auth.jsx';
import Reset from './Components/Dashboard/jsx/Reset.jsx';
import Dashboard from './Components/Dashboard/jsx/Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);// State to hold user authentication status
  const [loading, setLoading] = useState(true); // State to manage loading state for the loader

  useEffect(() => {
    const MIN_LOAD_TIME = 2000; // 2 seconds minimum
    const startTime = Date.now(); // Start time to calculate elapsed time for the loader

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        // ── Calculate remaining time for minimum display ──
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOAD_TIME - elapsed;

        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ===== PUBLIC ROUTES (with Navbar + Footer) ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/proofs" element={<ProofPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
      </Route>

      {/* ===== HIDDEN ADMIN LOGIN ===== */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Auth setUser={setUser} />
          )
        }
      />

      {/* ===== PASSWORD RESET ===== */}
      <Route path="/reset" element={<Reset />} />

      {/* ===== PROTECTED DASHBOARD ===== */}
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? (
            <Dashboard setUser={setUser} />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;