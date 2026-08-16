import { useState, useEffect, useCallback, useMemo, memo, useReducer } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/TestimonialManage.css';

// ── Constants ──
const INITIAL_FORM = { name: '', location: '', text: '' };

const FORM_FIELDS = [
  { name: 'name', label: 'Client Name', type: 'text', required: true },
  { name: 'location', label: 'Location (optional)', type: 'text', placeholder: 'e.g. Nairobi, Kenya' },
  { name: 'text', label: 'Testimonial Text', type: 'textarea', rows: 4, required: true },
];

const VISIBLE_COUNT = 3;

// ── Form Reducer ──
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'SET_ALL': return { ...action.payload };
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
    case 'SET_VISIBLE_COUNT': return { ...state, visibleCount: action.payload };
    case 'RESET_FORM_STATE':
      return { ...state, showForm: false, editingId: null };
    default: return state;
  }
};

// ── Testimonial Card Component (memoized) ──
const TestimonialCard = memo(({ item, onEdit, onDelete, confirmDeleteId }) => (
  <div className="testimonial-card">
    <div className="testimonial-content">
      <p className="testimonial-text">"{item.text}"</p>
      <div className="testimonial-author">
        <h4>{item.name}</h4>
        {item.location && <span className="testimonial-location">{item.location}</span>}
      </div>
    </div>
    <div className="testimonial-actions">
      <button className="edit-btn" onClick={() => onEdit(item)}>
        <FiEdit /> Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        <FiTrash2 /> {confirmDeleteId === item.id ? 'Confirm?' : 'Delete'}
      </button>
    </div>
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

// ── Main Component ──
const TestimonialsManage = () => {
  // ── State ──
  const [state, dispatch] = useReducer(stateReducer, {
    items: [],
    loading: true,
    showForm: false,
    editingId: null,
    visibleCount: VISIBLE_COUNT,
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
      const res = await fetch('/api/testimonials', { credentials: 'include' });
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

  // ── Handlers ──
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    formDispatch({ type: 'SET_FIELD', field: name, value });
  }, []);

  const resetForm = useCallback(() => {
    formDispatch({ type: 'RESET' });
  }, []);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'RESET_FORM_STATE' });
    resetForm();
  }, [resetForm]);

  const handleEdit = useCallback((item) => {
    dispatch({ type: 'SET_EDITING', payload: item.id });
    dispatch({ type: 'SET_SHOW_FORM', payload: true });
    formDispatch({
      type: 'SET_ALL',
      payload: {
        name: item.name || '',
        location: item.location || '',
        text: item.text || '',
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const url = state.editingId ? `/api/testimonials/${state.editingId}` : '/api/testimonials';
      const method = state.editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

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
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
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
  if (state.loading) return <div className="testimonials-loading">Loading testimonials...</div>;

  return (
    <div className="testimonials-manage">
      {/* ── Header ── */}
      <div className="testimonials-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => dispatch({ type: 'SET_SHOW_FORM', payload: true })}>
            <FiPlus /> Add Testimonial
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="testimonials-grid">
        {visibleItems.map(item => (
          <TestimonialCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            confirmDeleteId={state.confirmDeleteId}
          />
        ))}
      </div>

      {!visibleItems.length && (
        <div className="no-testimonials">
          <p>No testimonials yet. Click "Add Testimonial" to create one.</p>
        </div>
      )}

      {/* ── Modal Form ── */}
      {state.showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{state.editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
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

export default TestimonialsManage;