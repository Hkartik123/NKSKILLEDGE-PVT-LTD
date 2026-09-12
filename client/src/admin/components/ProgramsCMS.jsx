import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Clock, MapPin } from 'lucide-react';

export default function ProgramsCMS({ programs, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'Industrial Training',
    duration: '3 Months / 6 Months',
    mode: 'Classroom & Hybrid',
    location: 'Sakoli Tech Center',
    shortDescription: '',
    fullDescription: '',
    eligibility: 'B.E. / B.Tech / BCA / MCA / Diploma',
    image: '',
    technologiesText: '',
    order: '1',
    status: 'Active'
  });

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      category: 'Industrial Training',
      duration: '3 Months / 6 Months',
      mode: 'Classroom & Hybrid',
      location: 'Sakoli Tech Center',
      shortDescription: '',
      fullDescription: '',
      eligibility: 'B.E. / B.Tech / BCA / MCA / Diploma',
      image: '',
      technologiesText: '',
      order: '1',
      status: 'Active'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      category: item.category || 'Industrial Training',
      duration: item.duration || '3 Months',
      mode: item.mode || 'Classroom',
      location: item.location || 'Sakoli Tech Center',
      shortDescription: item.shortDescription || '',
      fullDescription: item.fullDescription || '',
      eligibility: item.eligibility || 'Engineering Students',
      image: item.image || '',
      technologiesText: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      order: String(item.display_order ?? item.order ?? 1),
      status: item.status || 'Active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training program permanently from the database?')) return;
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Training program deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete program');
      }
    } catch (err) {
      alert('Error deleting program: ' + err.message);
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
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category.trim(),
      duration: form.duration.trim(),
      mode: form.mode.trim(),
      location: form.location.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      eligibility: form.eligibility.trim(),
      image: form.image.trim(),
      technologies,
      display_order: Number(form.order || 1),
      order: Number(form.order || 1),
      status: form.status,
      isActive: form.status === 'Active'
    };

    const url = editingId ? `/api/programs/${editingId}` : '/api/programs';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Program updated in database!' : 'New program created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save program');
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
          <h2>Training Programs & Academy CMS ({programs.length})</h2>
          <p>Manage curriculum, durations, course modes, and technical stacks for student training cohorts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Program
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Program Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Mode</th>
              <th>Tech Stack</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No training programs in database. Click "Add New Program" to create one.
                </td>
              </tr>
            ) : (
              programs.map((p) => (
                <tr key={p._id}>
                  <td><strong>#{p.display_order ?? p.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ color: '#fff' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{p.category}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{p.duration}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.mode}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.technologies?.slice(0, 3).join(', ')}</td>
                  <td>
                    <span className={`badge ${p.status === 'Active' || p.isActive !== false ? 'badge-emerald' : 'badge-amber'}`}>
                      {p.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)} title="Edit Program">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete Program">
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Program' : 'Add New Program'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Program Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Stack Web Development (MERN)"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Software Engineering"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="3 Months / 6 Months"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Training Mode</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    placeholder="Classroom & Live Project"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Lab</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Sakoli Tech Center"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Comprehensive MERN stack bootcamp with industry project..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility Criteria</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.eligibility}
                  onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  placeholder="B.E., B.Tech, BCA, MCA, Diploma Students"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies (Comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.technologiesText}
                  onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                  placeholder="React.js, Node.js, Express, MongoDB, REST APIs, Git"
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Program' : 'Create Program')}
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
