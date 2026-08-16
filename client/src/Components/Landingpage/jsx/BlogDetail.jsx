import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
  return (
    <div className="products-loading">
      <div className="spinner"></div>
      <p>Loading blogs...</p>
    </div>
  );
}
  if (!blog) return <div className="blog-detail-notfound">Article not found</div>;

  return (
    <>
      <div className="blog-detail">
      {/* Hero / Image */}
      {blog.image && (
        <div className="blog-detail-hero">
           <img src={blog.image} alt={blog.title} />
        </div>
      )}

      <div className="blog-detail-content">
        <h1>{blog.title}</h1>

        {blog.keywords && (
          <div className="blog-detail-tags">
            {blog.keywords.split(',').map((kw) => (
              <span key={kw} className="detail-tag">#{kw.trim()}</span>
            ))}
          </div>
        )}

        <div className="blog-detail-body">
          <p>{blog.description}</p>
        </div>

        {/* CTA Button */}
        <button className="back-home-btn" onClick={() => navigate('/contact')}>
          Start  a project
        </button>
      </div>
    </div>
    </>
  );
};

export default BlogDetail;