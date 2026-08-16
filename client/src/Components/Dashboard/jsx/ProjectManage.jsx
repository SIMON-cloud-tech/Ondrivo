import { useState, useEffect, useCallback, useMemo, memo, useReducer } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';
import '../css/ProjectManage.css';

// ── Constants ──
const INITIAL_FORM = {
  title: '',
  client: '',
  shortDescription: '',
  longDescription: '',
  projectUrl: '',
  image: null,
};

const FORM_FIELDS = [
  { name: 'title', label: 'Project Title', type: 'text', required: true },
  { name: 'client', label: 'Client Name', type: 'text', required: true },
  { name: 'shortDescription', label: 'Short Description', type: 'text', required: true },
  { name: 'longDescription', label: 'Long Description', type: 'textarea', rows: 4 },
  { name: 'projectUrl', label: 'Live URL', type: 'url', placeholder: 'https://...' },
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
    case 'SET_PROJECTS': return { ...state, projects: action.payload };
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

// ── Project Card Component (memoized) ──
const ProjectCard = memo(({ project, onEdit, onDelete, confirmDeleteId }) => (
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
      {project.projectUrl && (
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          <FiExternalLink size={14} /> View Live
        </a>
      )}
    </div>
    <div className="project-actions">
      <button className="edit-btn" onClick={() => onEdit(project)}>
        <FiEdit /> Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(project.id)}>
        <FiTrash2 /> {confirmDeleteId === project.id ? 'Confirm?' : 'Delete'}
      </button>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

// ── Main Component ──
const ProjectManage = () => {
  // ── State ──
  const [state, dispatch] = useReducer(stateReducer, {
    projects: [],
    loading: true,
    showForm: false,
    editingId: null,
    visibleCount: VISIBLE_COUNT,
    confirmDeleteId: null,
    previewUrl: '',
  });

  const [formData, formDispatch] = useReducer(formReducer, INITIAL_FORM);

  // ── Memoized visible projects ──
  const visibleProjects = useMemo(() => {
    return state.projects.slice(0, state.visibleCount);
  }, [state.projects, state.visibleCount]);

  const hasMore = state.visibleCount < state.projects.length;

  // ── Fetch projects ──
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      dispatch({ type: 'SET_PROJECTS', payload: data });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [state.projects]);

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

  const handleEdit = useCallback((project) => {
    dispatch({ type: 'SET_EDITING', payload: project.id });
    dispatch({ type: 'SET_SHOW_FORM', payload: true });
    dispatch({ type: 'SET_PREVIEW', payload: project.image || '' });
    formDispatch({
      type: 'SET_ALL',
      payload: {
        ...project,
        image: null,
        projectUrl: project.projectUrl || '',
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const url = state.editingId ? `/api/projects/${state.editingId}` : '/api/projects';
      const method = state.editingId ? 'PUT' : 'POST';

      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'image') { if (val) form.append('image', val); }
        else if (val) form.append(key, val);
      });

      const res = await fetch(url, { method, credentials: 'include', body: form });
      if (!res.ok) throw new Error('Failed to save');

      await fetchProjects();
      handleCancel();
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [state.editingId, formData, fetchProjects, handleCancel]);

  const handleDelete = useCallback(async (id) => {
    if (state.confirmDeleteId !== id) {
      dispatch({ type: 'SET_CONFIRM_DELETE', payload: id });
      return;
    }
    dispatch({ type: 'SET_CONFIRM_DELETE', payload: null });
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [state.confirmDeleteId, fetchProjects]);

  const loadMore = useCallback(() => {
    dispatch({ type: 'SET_VISIBLE_COUNT', payload: state.visibleCount + VISIBLE_COUNT });
  }, [state.visibleCount]);

  // ── Loading state ──
  if (state.loading) return <div className="project-loading">Loading projects...</div>;

  return (
    <div className="project-manage">
      {/* ── Header ── */}
      <div className="project-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => dispatch({ type: 'SET_SHOW_FORM', payload: true })}>
            <FiPlus /> Add Project
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="project-grid">
        {visibleProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
            confirmDeleteId={state.confirmDeleteId}
          />
        ))}
      </div>

      {!visibleProjects.length && (
        <div className="no-projects">
          <p>No projects yet. Click "Add Project" to create one.</p>
        </div>
      )}

      {/* ── Modal Form ── */}
      {state.showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{state.editingId ? 'Edit Project' : 'Add Project'}</h3>
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
                <label>Project Image</label>
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

export default ProjectManage;