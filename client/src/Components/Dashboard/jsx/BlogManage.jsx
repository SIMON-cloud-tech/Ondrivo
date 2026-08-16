// ──────────────────────────────────────────────────────────────
//  src/Components/Dashboard/jsx/BlogManage.jsx
//  Ondrivo — Blog Management (Optimized)
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo, memo, useReducer } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';
import '../css/BlogManage.css';

// ── Constants ──
const INITIAL_FORM = {
  title: '',
  description: '',
  keywords: '',
  image: null,
};

const FORM_FIELDS = [
  { name: 'title', label: 'Blog Title', type: 'text', required: true },
  { name: 'description', label: 'Content / Description', type: 'textarea', rows: 5, required: true },
  { name: 'keywords', label: 'Keywords (comma-separated)', type: 'text', placeholder: 'e.g. solar, energy, savings' },
];

const VISIBLE_COUNT = 3;

// ── Form Reducer ──
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'SET_IMAGE': return { ...state, image: action.file };
    case 'SET_ALL': return { ...action.payload, image: null };
    case 'RESET': return INITIAL_FORM;
    default: return state;
  }
};

// ── State Reducer ──
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLOGS': return { ...state, blogs: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_SHOW_FORM': return { ...state, showForm: action.payload };
    case 'SET_EDITING': return { ...state, editingId: action.payload };
    case 'SET_CONFIRM_DELETE': return { ...state, confirmDeleteId: action.payload };
    case 'SET_VISIBLE_COUNT': return { ...state, visibleCount: action.payload };
    case 'SET_PREVIEW': return { ...state, previewUrl: action.payload };
    case 'RESET_FORM_STATE':
      return { ...state, showForm: false, editingId: null, previewUrl: '' };
    default: return state;
  }
};

// ── Blog Card Component (memoized) ──
const BlogCard = memo(({ blog, onEdit, onDelete, confirmDeleteId }) => (
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
      <p className="blog-excerpt">
        {blog.description && blog.description.length > 100
          ? `${blog.description.substring(0, 100)}...`
          : blog.description}
      </p>
      {blog.keywords && (
        <div className="blog-keywords">
          {blog.keywords.split(',').map((kw, i) => (
            <span key={i} className="keyword-tag">#{kw.trim()}</span>
          ))}
        </div>
      )}
    </div>
    <div className="blog-actions">
      <button className="edit-btn" onClick={() => onEdit(blog)}>
        <FiEdit /> Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(blog.id)}>
        <FiTrash2 /> {confirmDeleteId === blog.id ? 'Confirm?' : 'Delete'}
      </button>
    </div>
  </div>
));

BlogCard.displayName = 'BlogCard';

// ── Main Component ──
const BlogManage = () => {
  // ── State ──
  const [state, dispatch] = useReducer(stateReducer, {
    blogs: [],
    loading: true,
    showForm: false,
    editingId: null,
    visibleCount: VISIBLE_COUNT,
    confirmDeleteId: null,
    previewUrl: '',
  });

  const [formData, formDispatch] = useReducer(formReducer, INITIAL_FORM);

  // ── Memoized visible blogs ──
  const visibleBlogs = useMemo(() => {
    return state.blogs.slice(0, state.visibleCount);
  }, [state.blogs, state.visibleCount]);

  const hasMore = state.visibleCount < state.blogs.length;

  // ── Fetch blogs ──
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/blogs', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      dispatch({ type: 'SET_BLOGS', payload: data });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── Intersection Observer for lazy loading cards ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [state.blogs]);

  // ── Handlers ──
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    formDispatch({ type: 'SET_FIELD', field: name, value });
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      formDispatch({ type: 'SET_IMAGE', file });
      dispatch({ type: 'SET_PREVIEW', payload: URL.createObjectURL(file) });
    }
  }, []);

  const resetForm = useCallback(() => {
    formDispatch({ type: 'RESET' });
    dispatch({ type: 'SET_PREVIEW', payload: '' });
  }, []);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'RESET_FORM_STATE' });
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback((blog) => {
    dispatch({ type: 'SET_EDITING', payload: blog.id });
    dispatch({ type: 'SET_SHOW_FORM', payload: true });
    dispatch({ type: 'SET_PREVIEW', payload: blog.image || '' });
    formDispatch({
      type: 'SET_ALL',
      payload: {
        title: blog.title,
        description: blog.description,
        keywords: blog.keywords || '',
        image: null,
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const url = state.editingId ? `/api/blogs/${state.editingId}` : '/api/blogs';
      const method = state.editingId ? 'PUT' : 'POST';

      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'image') { if (val) form.append('image', val); }
        else if (val) form.append(key, val);
      });

      const res = await fetch(url, { method, credentials: 'include', body: form });
      if (!res.ok) throw new Error('Failed to save');

      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [state.editingId, formData, fetchBlogs, handleCancel]);

  const handleDelete = useCallback(async (id) => {
    if (state.confirmDeleteId !== id) {
      dispatch({ type: 'SET_CONFIRM_DELETE', payload: id });
      return;
    }
    dispatch({ type: 'SET_CONFIRM_DELETE', payload: null });
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchBlogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [state.confirmDeleteId, fetchBlogs]);

  const loadMore = useCallback(() => {
    dispatch({ type: 'SET_VISIBLE_COUNT', payload: state.visibleCount + VISIBLE_COUNT });
  }, [state.visibleCount]);

  // ── Loading state ──
  if (state.loading) return <div className="blog-loading">Loading blogs...</div>;

  return (
    <div className="blog-manage">
      {/* ── Header ── */}
      <div className="blog-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => dispatch({ type: 'SET_SHOW_FORM', payload: true })}>
            <FiPlus /> Write Blog
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="blog-grid">
        {visibleBlogs.map(blog => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={handleEdit}
            onDelete={handleDelete}
            confirmDeleteId={state.confirmDeleteId}
          />
        ))}
      </div>

      {!visibleBlogs.length && (
        <div className="no-blogs">
          <p>No blog posts yet. Click "Write Blog" to create one.</p>
        </div>
      )}

      {/* ── Modal Form ── */}
      {state.showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{state.editingId ? 'Edit Blog' : 'Write Blog'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* ── Dynamic form fields ── */}
              {FORM_FIELDS.map(field => (
                <div key={field.name} className="form-group">
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      rows={field.rows || 3}
                      required={field.required || false}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required || false}
                      placeholder={field.placeholder || ''}
                    />
                  )}
                </div>
              ))}

              {/* ── Image Upload ── */}
              <div className="form-group">
                <label>Blog Image</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="image-upload"
                    className="file-upload-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="image-upload" className="file-upload-label">
                    <FiPlus /> Choose Image
                  </label>
                  {formData.image && <span className="file-name">{formData.image.name}</span>}
                  {!formData.image && state.previewUrl && !state.editingId && (
                    <span className="file-name">Image selected</span>
                  )}
                  {state.editingId && state.previewUrl && !formData.image && (
                    <span className="file-name">Current image (replace)</span>
                  )}
                </div>
                {state.previewUrl && (
                  <div className="image-preview">
                    <img src={state.previewUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {state.editingId ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManage;