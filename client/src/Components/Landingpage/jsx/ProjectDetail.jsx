import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../../Seo.jsx';
import '../css/ProjectDetail.css';
// ── Field config for object lookup ──
const FIELD_CONFIG = {
  client: { label: 'Client', className: 'detail-client' },
  year: { label: 'Year', className: 'detail-year' },
};
// ── Helper: Render detail fields ──
const renderDetailField = (value, key) => {
  if (!value) return null;
  const config = FIELD_CONFIG[key];
  if (!config) return null;
  return (
    <p key={key} className={config.className}>
      <strong>{config.label}:</strong> {value}
    </p>
  );
};
// ── Loading Component (memoized) ──
const LoadingState = memo(() => (
  <div className="products-loading">
    <div className="spinner"></div>
    <p>Loading project...</p>
  </div>
));
LoadingState.displayName = 'LoadingState';
// ── Not Found Component (memoized) ──
const NotFoundState = memo(() => (
  <div className="project-detail-notfound">
    <h2>Project Not Found</h2>
    <Link to="/projects" className="back-link">← Back to Projects</Link>
  </div>
));
NotFoundState.displayName = 'NotFoundState';
// ── Main Component ──
const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  // ── Fetch project (memoized) ──
  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/slug/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);
  // ── Memoized values ──
  const title = useMemo(() => project?.title || '', [project]);
  const client = useMemo(() => project?.client || '', [project]);
  const year = useMemo(() => project?.year || '', [project]);
  const image = useMemo(() => project?.image || '', [project]);
  const longDescription = useMemo(() => project?.longDescription || '', [project]);
  // ── Render detail fields using object lookup ──
  const detailFields = useMemo(() => {
    const fields = {};
    if (client) fields.client = client;
    if (year) fields.year = year;
    return fields;
  }, [client, year]);
  // ── Loading state ──
  if (loading) return <LoadingState />;
  // ── Not found state ──
  if (!project) return <NotFoundState />;
  return (
    <>
      <Seo
        title={project ? `${project.title} | Ondrivo Project` : 'Project | Ondrivo'}
        description={project ? project.shortDescription || project.longDescription || 'Explore this Ondrivo project.' : 'Explore this Ondrivo project.'}
        keywords={project ? `${project.title}, Ondrivo project, software development` : 'Ondrivo project'}
        image={project?.image || 'https://ondrivo.co.ke/logo.svg'}
        url={`https://ondrivo.co.ke/projects/${project?.slug || slug}`}
      />
      <div className="project-detail">
        <Link to="/projects" className="back-link">← Back to Projects</Link>
        <div className="project-detail-content">
          {/* ── Image ── */}
          <div className="project-detail-image">
            {image ? (
              <img src={image} alt={title} loading="lazy" />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
          </div>
          {/* ── Info ── */}
          <div className="project-detail-info">
            <h1>{title}</h1>
            {/* ── Dynamic fields using object lookup ── */}
            {Object.entries(detailFields).map(([key, value]) => renderDetailField(value, key))}
            {/* ── Description ── */}
            {longDescription && (
              <div className="detail-description">
                <h3>Overview</h3>
                <p>{longDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectDetail;