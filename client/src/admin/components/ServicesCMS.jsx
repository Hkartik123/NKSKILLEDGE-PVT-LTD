import React, { useState } from 'react';
import { Laptop, Plus, Edit, Trash2, Save, X, CheckCircle2 } from 'lucide-react';

export default function ServicesCMS({ services, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Software Development',
    shortDescription: '',
    fullDescription: '',
    image: '',
    featuresText: '',
    technologiesText: '',
    order: '1',
    status: 'Active'
  });

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      category: 'Software Development',
      shortDescription: '',
      fullDescription: '',
      image: '',
      featuresText: '',
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
      title: item.title || '',
      slug: item.slug || '',
      category: item.category || 'Software Development',
      shortDescription: item.shortDescription || '',
      fullDescription: item.fullDescription || '',
      image: item.image || '',
      featuresText: Array.isArray(item.features) ? item.features.join('\n') : '',
      technologiesText: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      order: String(item.display_order ?? item.order ?? 1),
      status: item.status || 'Active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service permanently from the database?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Service deleted successfully from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete service');
      }
    } catch (err) {
      alert('Error deleting service: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const features = form.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const technologies = form.technologiesText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      image: form.image.trim(),
      features,
      technologies,
      display_order: Number(form.order || 1),
      order: Number(form.order || 1),
      status: form.status,
      isActive: form.status === 'Active'
    };

    const url = editingId ? `/api/services/${editingId}` : '/api/services';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Service updated in database!' : 'New service created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save service');
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
          <h2>Enterprise Services CMS ({services.length})</h2>
          <p>Create, update, or remove business technology services offered to corporate and MSME clients.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Service Title</th>
              <th>Category</th>
              <th>Features</th>
              <th>Tech Stack</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No services in database. Click "Add New Service" to create one.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s._id}>
                  <td><strong>#{s.display_order ?? s.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {s.image && <img src={s.image} alt={s.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ color: '#fff' }}>{s.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{s.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{s.category || 'General'}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{s.features?.length || 0} features</td>
                  <td style={{ fontSize: '0.82rem' }}>{s.technologies?.slice(0, 3).join(', ') || 'N/A'}</td>
                  <td>
                    <span className={`badge ${s.status === 'Active' || s.isActive !== false ? 'badge-emerald' : 'badge-amber'}`}>
                      {s.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)} title="Edit Service">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)} title="Delete Service">
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Website Development"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="website-development"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Software Development"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description (for cards) *</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="High-performance custom web applications..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features (One feature per line)</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  placeholder="Custom UI/UX Design&#10;SEO Optimization&#10;High Performance APIs"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies (Comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.technologiesText}
                  onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
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
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Service' : 'Create Service')}
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
