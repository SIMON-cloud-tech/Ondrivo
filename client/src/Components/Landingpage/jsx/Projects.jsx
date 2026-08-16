import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../Seo.jsx';
import '../css/Projects.css';

// ── Constants ──
const VISIBLE_COUNT = 3;

// ── Project Card Component (memoized) ──
const ProjectCard = memo(({ project }) => (
  <div className="project-card">
    <div className="project-image">
      {project.image ? (
        <img src={project.image} alt={project.title} loading="lazy" />
      ) : (
        <div className="placeholder-image">No Image</div>
      )}
    </div>
    <div className="project-info">
      <h3>{project.title}</h3>
      <p className="project-client">Client: {project.client}</p>
      <p className="project-short">{project.shortDescription}</p>
    </div>
    <div className="project-actions">
      <Link to={`/projects/${project.slug}`} className="read-more-btn">
        Read More →
      </Link>
    </div>
  </div>
));
ProjectCard.displayName = 'ProjectCard';

// ── Loading Component (memoized) ──
const LoadingState = memo(() => (
  <div className="projects-loading">
    <div className="spinner"></div>
    <p>Loading projects...</p>
  </div>
));
LoadingState.displayName = 'LoadingState';

// ── Empty State (memoized) ──
const EmptyState = memo(() => (
  <div className="no-projects">
    <p>No projects match your search.</p>
  </div>
));
EmptyState.displayName = 'EmptyState';

// ── Main Component ──
const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
  const [searchTerm, setSearchTerm] = useState('');

  // ── Fetch projects ──
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllProjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Filter projects by search term ──
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return allProjects;
    return allProjects.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.client.toLowerCase().includes(term) ||
      p.shortDescription.toLowerCase().includes(term)
    );
  }, [allProjects, searchTerm]);

  // ── Reset visible count when search changes ──
  useEffect(() => {
    setVisibleCount(VISIBLE_COUNT);
  }, [searchTerm]);

  // ── Memoized visible projects ──
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;

  // ── Handlers ──
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + VISIBLE_COUNT);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // ── Loading state ──
  if (loading) return <LoadingState />;

  return (
    <>
      <Seo
        title="Projects | Ondrivo"
        description="Explore Ondrivo's portfolio of custom websites, software, and digital products built for measurable business impact."
        keywords="Ondrivo projects, software portfolio, custom website projects, digital products"
        url="https://ondrivo.co.ke/projects"
      />
      <section className="projects-page">
        {/* ── Header ── */}
        <div className="projects-header">
        <div className="projects-header-left">
          <h2>Our Projects</h2>
          <p className="projects-intro">
            Explore our portfolio of successful projects — from custom web applications 
            to AI-powered solutions, built with precision and accountability.
          </p>
        </div>
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="projects-search-wrapper">
        <input
          type="text"
          className="projects-search-input"
          placeholder="Search by title, client, or description..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* ── Grid ── */}
        {filteredProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="projects-grid">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;