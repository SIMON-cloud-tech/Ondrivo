// ──────────────────────────────────────────────────────────────
//  src/components/CaseStudyDetail.jsx
//  Ondrivo — Full Case Study Page
// ──────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import '../css/caseStudyDetail.css';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/case-studies/slug/${slug}`);
        if (!res.ok) {
          const res2 = await fetch(`/api/case-studies/${slug}`);
          if (!res2.ok) throw new Error('Not found');
          const data = await res2.json();
          setItem(data);
        } else {
          const data = await res.json();
          setItem(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [slug]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading case study...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-not-found">
        <h2>Case Study Not Found</h2>
        <p>The case study you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/proofs')} className="back-btn">
          ← Back to Case Studies
        </button>
      </div>
    );
  }

  return (
    <article className="case-detail">
      <div className="detail-nav">
        <Link to="/proofs" className="back-link">
          <FiArrowLeft /> Back to Case Studies
        </Link>
      </div>

      <div className="detail-hero">
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.title} />
        ) : (
          <div className="detail-placeholder">📷</div>
        )}
        {item.isFeatured && (
          <span className="detail-featured"><FiStar /> Featured</span>
        )}
      </div>

      <div className="detail-content">
        <div className="detail-meta">
          <span className="detail-client">{item.client}</span>
          <span className="detail-industry">{item.industry}</span>
        </div>

        <h1 className="detail-title">{item.title}</h1>

        <section className="detail-section">
          <h2>── Problem ──</h2>
          <p>{item.problem}</p>
        </section>

        <section className="detail-section">
          <h2>── Approach ──</h2>
          <p>{item.approach}</p>
        </section>

        <section className="detail-section">
          <h2>── Solution ──</h2>
          <p>{item.solution}</p>
        </section>

        {item.technologies?.length > 0 && (
          <section className="detail-section">
            <h2>── Technologies Used ──</h2>
            <div className="detail-tech">
              {item.technologies.map((tag, i) => (
                <span key={i} className="detail-tag">#{tag}</span>
              ))}
            </div>
          </section>
        )}
        <button className="back-home-btn" onClick={() => navigate('/contact')}>
          Get a Free Consultation
          </button>
      </div>
    </article>
  );
};

export default CaseStudyDetail;