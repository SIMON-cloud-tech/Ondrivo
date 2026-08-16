import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './Components/Landingpage/jsx/Loader.jsx';
// Layouts
import PublicLayout from './Components/layouts/PublicLayout.jsx';

// Public pages
import Home from './Components/pages/Home.jsx';
import Services from './Components/Landingpage/jsx/Services.jsx';
import Proofs from './Components/Landingpage/jsx/Proofs.jsx';
import About from './Components/pages/About.jsx';
import Contact from './Components/pages/Reach.jsx';
import Projects from './Components/Landingpage/jsx/Projects.jsx';
import ProjectDetail from './Components/Landingpage/jsx/ProjectDetail.jsx';
import BlogDetail from './Components/Landingpage/jsx/BlogDetail.jsx';
import BlogSection from './Components/Landingpage/jsx/Blogs.jsx';
import ServicePage from './Components/pages/ServicePage.jsx';

// Admin / Auth
import Auth from './Components/Dashboard/jsx/Auth.jsx';
import Reset from './Components/Dashboard/jsx/Reset.jsx';
import Dashboard from './Components/Dashboard/jsx/Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
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
        <Route path="/proofs" element={<Proofs />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
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



danson3197_db_user 

mongodb+srv://danson3197_db_user:<db_password>@cluster0.kvhmp0g.mongodb.net/?appName=Cluster0
simon319