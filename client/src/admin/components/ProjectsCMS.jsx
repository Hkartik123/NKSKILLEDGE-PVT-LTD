import React, { useState } from 'react';
import { FolderGit2, Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';

export default function ProjectsCMS({ projects, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Web',
    client: '',
    shortSummary: '',
    problemStatement: '',
    solution: '',
    results: '',
    liveUrl: '',
    image: '',
    technologiesText: '',
    order: '1',
    status: 'Completed'
  });

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      category: 'Web',
      client: '',
      shortSummary: '',
      problemStatement: '',
      solution: '',
      results: '',
      liveUrl: '',
      image: '',
      technologiesText: '',
      order: '1',
      status: 'Completed'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      category: item.category || 'Web',
      client: item.client || '',
      shortSummary: item.shortSummary || '',
      problemStatement: item.problemStatement || '',
      solution: item.solution || '',
      results: item.results || '',
      liveUrl: item.liveUrl || '',
      image: item.image || '',
      technologiesText: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      order: String(item.display_order ?? item.order ?? 1),
      status: item.status || 'Completed'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project case study permanently from the database?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Project deleted successfully from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete project');
      }
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const technologies = form.technologiesText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category,
      client: form.client.trim(),
      shortSummary: form.shortSummary.trim(),
      problemStatement: form.problemStatement.trim(),
      solution: form.solution.trim(),
      results: form.results.trim(),
      liveUrl: form.liveUrl.trim(),
      image: form.image.trim(),
      technologies,
      display_order: Number(form.order || 1),
      order: Number(form.order || 1),
      status: form.status,
      isActive: form.status !== 'Inactive'
    };

    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Project case study updated in database!' : 'New project created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save project');
      }
    } catch (err) {
      setErrorMsg('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cms-submodule">
      <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Client Projects & Case Studies CMS ({projects.length})</h2>
          <p>Showcase production software, IoT nodes, mobile applications, and enterprise systems built by NK SkillEdge.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Project
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Project Title</th>
              <th>Category</th>
              <th>Client</th>
              <th>Tech Stack</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No projects in database. Click "Add New Project" to create one.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id}>
                  <td><strong>#{p.display_order ?? p.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.image && <img src={p.image} alt={p.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ color: '#fff' }}>{p.title}</strong>
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--primary-hover)', marginLeft: '6px' }}>
                            Preview <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{p.category}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{p.client}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.technologies?.slice(0, 3).join(', ')}</td>
                  <td>
                    <span className="badge badge-emerald">{p.status || 'Completed'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)} title="Edit Project">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete Project">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Smart Irrigation IoT Node"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Web">Web Solutions</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="IoT">IoT & Hardware</option>
                    <option value="AI">AI & Machine Learning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Client / Partner Name *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="AgriTech Agro Solutions"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Project Image URL</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Preview URL</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary *</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.shortSummary}
                  onChange={(e) => setForm({ ...form, shortSummary: e.target.value })}
                  placeholder="Automated telemetry gateway with telemetry sensor mesh..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Statement</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.problemStatement}
                  onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
                  placeholder="Client faced high latency and manual data entry errors..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Engineered Solution</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  placeholder="We built a distributed cloud backend with realtime MQTT streams..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies (Comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.technologiesText}
                  onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                  placeholder="ESP32, C++, MQTT, React Dashboard, Node.js"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Measured Results & Impact</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.results}
                  onChange={(e) => setForm({ ...form, results: e.target.value })}
                  placeholder="40% water savings, 99.8% uptime across 12 field nodes"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
