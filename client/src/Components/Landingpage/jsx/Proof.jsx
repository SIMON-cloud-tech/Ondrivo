// ──────────────────────────────────────────────────────────────
//  src/components/Proof.jsx
//  Ondrivo — Case Study (Light / Full variants)
//  Full variant mirrors Projects.jsx approach
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import '../css/Proof.css';

// ── Constants ──
const VISIBLE_COUNT = 3;

// ── Case Study Card Component (memoized) ──
const CaseStudyCard = memo(({ item = {} }) => (
  <div className="proof-card">
    <div className="proof-card-image">
      {item.coverImage ? (
        <img src={item.coverImage} alt={item.title} loading="lazy" />
      ) : (
        <div className="placeholder-image">📷</div>
      )}
      {item.isFeatured && (
        <span className="featured-badge"><FiStar /> Featured</span>
      )}
    </div>
    <div className="proof-card-body">
      <h3>{item.title}</h3>
      <p className="proof-card-client">{item.client}</p>
      <p className="proof-card-preview">
        {item.problem?.length > 80
          ? `${item.problem.slice(0, 80)}...`
          : item.problem}
      </p>
      {item.technologies?.length > 0 && (
        <div className="proof-card-tech">
          {item.technologies.slice(0, 4).map((tag, i) => (
            <span key={i} className="tech-tag">#{tag}</span>
          ))}
        </div>
      )}
      <Link to={`/case-studies/${item.slug || item.id}`} className="read-more-link">
        Read Full Case Study →
      </Link>
    </div>
  </div>
));
CaseStudyCard.displayName = 'CaseStudyCard';

// ── Loading Component (memoized) ──
const LoadingState = memo(() => (
  <div className="proof-loading">
    <div className="spinner"></div>
    <p>Loading case studies...</p>
  </div>
));
LoadingState.displayName = 'LoadingState';

// ── Empty State (memoized) ──
const EmptyState = memo(() => (
  <div className="no-proofs">
    <p>No case studies match your search.</p>
  </div>
));
EmptyState.displayName = 'EmptyState';

// ── No Data State (memoized) ──
const NoDataState = memo(() => (
  <div className="no-proofs">
    <p>No case studies available yet. Check back soon!</p>
  </div>
));
NoDataState.displayName = 'NoDataState';

// ── Main Component ──
const Proof = ({ variant = 'light' }) => {
  const isLight = variant === 'light';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
  const [searchTerm, setSearchTerm] = useState('');

  // ── Fetch case studies ──
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/case-studies');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(isLight ? data.slice(0, 1) : data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isLight]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Filter items (full variant only) ──
  const filteredItems = useMemo(() => {
    if (isLight) return items;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return items;
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.client?.toLowerCase().includes(term) ||
        item.problem?.toLowerCase().includes(term)
    );
  }, [items, searchTerm, isLight]);

  // ── Reset visible count when search changes ──
  useEffect(() => {
    setVisibleCount(VISIBLE_COUNT);
  }, [searchTerm]);

  // ── Memoized visible items ──
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  // ── Handlers ──
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + VISIBLE_COUNT);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  //helper
  const truncate = (text, length = 80) => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
 };

  // ── Loading state ──
  if (loading) return <LoadingState />;

  // ── Light Variant ──
  if (isLight) {
    if (items.length === 0) return null;
    const item = items[0];
    return (
      <section className="proof-section proof-light">
        <div className="proof-container">
          <div className="proof-image-wrapper">
            <div className="proof-image">
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} loading="lazy" />
              ) : (
                <div className="placeholder-image">📷</div>
              )}
            </div>
          </div>
          <div className="proof-content">
            <span className="proof-badge">Featured Project</span>
            <h2 className="proof-title">{item.title}</h2>
            <div className="proof-block">
              <h3 className="proof-heading">── Problem ──</h3>
              <p className="proof-text">
                {truncate(item.problem, 100)}
              </p>
            </div>
            <div className="proof-block">
              <h3 className="proof-heading">── Approach ──</h3>
              <p className="proof-text">{truncate(item.approach, 150)}</p>
            </div>
            <div className="proof-block">
              <h3 className="proof-heading">── Solution ──</h3>
              <p className="proof-text">{truncate(item.solution, 200)}</p>
            </div>
            <Link to={`/case-studies/${item.slug}`} className="proof-cta">
              View Full Case Study →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Full Variant (mirrors Projects.jsx) ──
  return (
    <section className="proof-section proof-full">
      {/* ── Header ── */}
      <div className="proof-header">
        <div className="proof-header-left">
          <h2>Case Studies</h2>
          <p className="proof-subtitle">
            Real projects, real results — see how we solve problems with precision
            and accountability.
          </p>
        </div>
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="proof-search-wrapper">
        <input
          type="text"
          className="proof-search-input"
          placeholder="Search by title, client, or problem..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* ── Grid or Empty State ── */}
      {items.length === 0 ? (
        <NoDataState />
      ) : filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="proof-grid">
          {visibleItems.map((item) => (
            <CaseStudyCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Proof;