import { useState, useEffect, useContext, useCallback, useMemo, memo,} from 'react';
import { Link } from 'react-router-dom';
import '../css/BlogSection.css';

// ── Constants ──
const VISIBLE_COUNT = 3;


// ── Helper: Truncate text ──
const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

// ── Helper: Render tags ──
const renderTags = (keywords) => {
  if (!keywords) return null;
  return keywords.split(',').slice(0, 3).map((kw, i) => (
    <span key={i} className="tag">#{kw.trim()}</span>
  ));
};

// ── Blog Card Component (memoized) ──
const BlogCard = memo(({ blog }) => (
  <div className="blog-card">
    <div className="blog-image">
      {blog.image ? (
        <img src={blog.image} alt={blog.title} loading="lazy" />
      ) : (
        <div className="placeholder-image">No Image</div>
      )}
    </div>
    <div className="blog-info">
      <h3>{blog.title}</h3>
      <p className="blog-excerpt">{truncate(blog.description, 100)}</p>
      {blog.keywords && (
        <div className="blog-tags">{renderTags(blog.keywords)}</div>
      )}
    </div>
    <div className="blog-actions">
      <Link to={`/blogs/${blog.slug}`} className="read-more-btn">
        Read More →
      </Link>
    </div>
  </div>
));
BlogCard.displayName = 'BlogCard';

// ── Loading Component (memoized) ──
const LoadingState = memo(() => (
  <div className="blogs-loading">
    <div className="spinner"></div>
    <p>Loading blogs...</p>
  </div>
));
LoadingState.displayName = 'LoadingState';

// ── Empty State (memoized) ──
const EmptyState = memo(() => (
  <div className="no-blogs">
    <p>No blogs match your search.</p>
  </div>
));
EmptyState.displayName = 'EmptyState';

// ── Main Component ──
const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // ── Fetch blogs ──
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── Filter blogs by search term and date ──
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(term)
      );
    }

    if (filterDate) {
      result = result.filter((blog) => {
        const blogDate = new Date(blog.createdAt).toISOString().split('T')[0];
        return blogDate === filterDate;
      });
    }

    return result;
  }, [blogs, searchTerm, filterDate]);

  // ── Reset visible count when filters change ──
  useEffect(() => {
    setVisibleCount(VISIBLE_COUNT);
  }, [searchTerm, filterDate]);

  // ── Memoized visible blogs ──
  const visibleBlogs = useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const hasMore = visibleCount < filteredBlogs.length;

  // ── Handlers ──
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + VISIBLE_COUNT);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleDateChange = useCallback((e) => {
    setFilterDate(e.target.value);
  }, []);

  const clearDateFilter = useCallback(() => {
    setFilterDate('');
  }, []);

  // ── Loading state ──
  if (loading) return <LoadingState />;

  return (
    <section className="blog-section">
      {/* ── Header ── */}
      <div className="blog-header">
        <div className="blog-header-left">
          <h2>Latest Tech Insights</h2>
          <p className="blog-intro">
            Stay updated with the latest trends, tips, and insights from the world of 
            software development, AI, and technology.
          </p>
        </div>
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="blog-filters">
        <div className="filter-wrapper">
          {/* Search Input */}
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {/* Date Filter */}
          <div className="date-filter-wrapper">
            <input
              type="date"
              className="date-input"
              value={filterDate}
              onChange={handleDateChange}
            />
            {filterDate && (
              <button className="clear-filter" onClick={clearDateFilter}>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      {filteredBlogs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="blog-grid">
          {visibleBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;