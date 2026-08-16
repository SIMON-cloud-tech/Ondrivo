// ──────────────────────────────────────────────────────────────
//  src/Components/Dashboard/jsx/CaseStudyManage.jsx
//  Ondrivo — Case Study Management (Optimized)
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo, memo, useReducer } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import '../css/CaseStudy.css';

// ── Constants ──
const INITIAL_FORM = { title: '', client: '',industry: '',category: 'web', projectDuration: '', problem: '', approach: '', solution: '', results: '', technologies: '', isPublished: true, isFeatured: false, coverImage: null,};

const FORM_FIELDS = [
  { name: 'title', label: 'Case Study Title', type: 'text', required: true },
  { name: 'client', label: 'Client Name', type: 'text', required: true },
  { name: 'industry', label: 'Industry', type: 'text', required: true },
  { 
    name: 'category', 
    label: 'Category', 
    type: 'select', 
    options: ['web', 'mobile', 'ai', 'custom', 'other'],
    required: true 
  },
  { name: 'projectDuration', label: 'Project Duration', type: 'text', placeholder: 'e.g. 3 weeks' },
  { name: 'problem', label: 'Problem', type: 'textarea', rows: 3, required: true },
  { name: 'approach', label: 'Approach', type: 'textarea', rows: 3, required: true },
  { name: 'solution', label: 'Solution', type: 'textarea', rows: 3, required: true },
  { name: 'results', label: 'Results (optional)', type: 'textarea', rows: 2 },
  { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text', placeholder: 'React, Node.js, MongoDB' },
  { name: 'isPublished', label: 'Published', type: 'toggle' },
  { name: 'isFeatured', label: 'Featured', type: 'toggle' },
];

const VISIBLE_COUNT = 3;

// ── Form Reducer ──
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'SET_IMAGE': return { ...state, coverImage: action.file };
    case 'SET_ALL': return { ...action.payload, coverImage: null };
    case 'RESET': return INITIAL_FORM;
    default: return state;
  }
};

// ── State Reducer ──
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS': return { ...state, items: action.payload };
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

// ── Case Study Card Component (memoized) ──
const CaseStudyCard = memo(({ item, onEdit, onDelete, confirmDeleteId }) => (
  <div className="case-card">
    <div className="case-image">
      {item.coverImage ? (
        <img src={item.coverImage} alt={item.title} loading="lazy" />
      ) : (
        <div className="placeholder-image">📷</div>
      )}
      <div className="case-badges">
        <span className={`case-badge ${item.category || 'web'}`}>
          {item.category || 'web'}
        </span>
        {item.isFeatured && (
          <span className="case-badge featured"><FiStar /> Featured</span>
        )}
        <span className={`case-badge ${item.isPublished ? 'published' : 'draft'}`}>
          {item.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>
    </div>
    <div className="case-info">
      <h3>{item.title}</h3>
      <p className="case-client">{item.client}</p>
      <p className="case-excerpt">{item.problem?.slice(0, 100)}...</p>
    </div>
    <div className="case-actions">
      <button className="edit-btn" onClick={() => onEdit(item)}>
        <FiEdit /> Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        <FiTrash2 /> {confirmDeleteId === item.id ? 'Confirm?' : 'Delete'}
      </button>
    </div>
  </div>
));

CaseStudyCard.displayName = 'CaseStudyCard';

// ── Main Component ──
const CaseStudyManage = () => {
  // ── State ──
  const [state, dispatch] = useReducer(stateReducer, { items: [], loading: true, showForm: false, editingId: null, visibleCount: VISIBLE_COUNT, confirmDeleteId: null, previewUrl: '',
  });

  const [formData, formDispatch] = useReducer(formReducer, INITIAL_FORM);

  // ── Memoized visible items ──
  const visibleItems = useMemo(() => {
    return state.items.slice(0, state.visibleCount);
  }, [state.items, state.visibleCount]);

  const hasMore = state.visibleCount < state.items.length;

  // ── Fetch items ──
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/case-studies', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      dispatch({ type: 'SET_ITEMS', payload: data });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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

    const cards = document.querySelectorAll('.case-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [state.items]);

  // ── Handlers ──
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    formDispatch({
      type: 'SET_FIELD',
      field: name,
      value: type === 'checkbox' ? checked : value,
    });
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

  const handleEdit = useCallback((item) => {
    dispatch({ type: 'SET_EDITING', payload: item.id });
    dispatch({ type: 'SET_SHOW_FORM', payload: true });
    dispatch({ type: 'SET_PREVIEW', payload: item.coverImage || '' });
    formDispatch({
      type: 'SET_ALL',
      payload: {
        title: item.title || '',
        client: item.client || '',
        industry: item.industry || '',
        category: item.category || 'web',
        projectDuration: item.projectDuration || '',
        problem: item.problem || '',
        approach: item.approach || '',
        solution: item.solution || '',
        results: item.results || '',
        technologies: (item.technologies || []).join(', '),
        isPublished: item.isPublished !== false,
        isFeatured: item.isFeatured || false,
        coverImage: null,
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const url = state.editingId ? `/api/case-studies/${state.editingId}` : '/api/case-studies';
      const method = state.editingId ? 'PUT' : 'POST';

      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'coverImage') { if (val) form.append('coverImage', val); }
        else if (typeof val === 'boolean') form.append(key, String(val));
        else if (val) form.append(key, val);
      });

      const res = await fetch(url, { method, credentials: 'include', body: form });
      if (!res.ok) throw new Error('Failed to save');

      await fetchItems();
      handleCancel();
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [state.editingId, formData, fetchItems, handleCancel]);

  const handleDelete = useCallback(async (id) => {
    if (state.confirmDeleteId !== id) {
      dispatch({ type: 'SET_CONFIRM_DELETE', payload: id });
      return;
    }
    dispatch({ type: 'SET_CONFIRM_DELETE', payload: null });
    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [state.confirmDeleteId, fetchItems]);

  const loadMore = useCallback(() => {
    dispatch({ type: 'SET_VISIBLE_COUNT', payload: state.visibleCount + VISIBLE_COUNT });
  }, [state.visibleCount]);

  // ── Loading state ──
  if (state.loading) return <div className="case-loading">Loading case studies...</div>;

  // ── Helper: render field based on type ──
  const renderField = (field) => {
    const value = formData[field.name] || '';
    const common = {
      id: field.name,
      name: field.name,
      value: field.type === 'toggle' ? undefined : value,
      onChange: handleChange,
      required: field.required || false,
      placeholder: field.placeholder || '',
    };

    if (field.type === 'textarea') {
      return <textarea {...common} rows={field.rows || 3} />;
    }
    if (field.type === 'select') {
      return (
        <select {...common} value={value}>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    if (field.type === 'toggle') {
      return (
        <label className="toggle-switch">
          <input
            type="checkbox"
            name={field.name}
            checked={!!formData[field.name]}
            onChange={handleChange}
          />
          <span className="toggle-slider" />
        </label>
      );
    }
    return <input {...common} type={field.type} />;
  };

  return (
    <div className="case-manage">
      {/* ── Header ── */}
      <div className="case-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => dispatch({ type: 'SET_SHOW_FORM', payload: true })}>
            <FiPlus /> Add Case Study
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="case-grid">
        {visibleItems.map(item => (
          <CaseStudyCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            confirmDeleteId={state.confirmDeleteId}
          />
        ))}
      </div>

      {!visibleItems.length && (
        <div className="no-cases">
          <p>No case studies yet. Click "Add Case Study" to create one.</p>
        </div>
      )}

      {/* ── Modal Form ── */}
      {state.showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{state.editingId ? 'Edit Case Study' : 'Add Case Study'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* ── Dynamic form fields ── */}
              {FORM_FIELDS.map(field => (
                <div key={field.name} className={`form-group ${field.type === 'toggle' ? 'toggle-group' : ''}`}>
                  <label>{field.label}</label>
                  {renderField(field)}
                </div>
              ))}

              {/* ── Image Upload ── */}
              <div className="form-group">
                <label>Cover Image</label>
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
                  {formData.coverImage && (
                    <span className="file-name">{formData.coverImage.name}</span>
                  )}
                  {state.editingId && state.previewUrl && !formData.coverImage && (
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
                  {state.editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyManage;