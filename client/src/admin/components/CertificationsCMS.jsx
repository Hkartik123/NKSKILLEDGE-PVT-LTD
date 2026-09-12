import React, { useState } from 'react';
import { Award, Plus, Edit, Trash2, Save, X, ShieldCheck } from 'lucide-react';

export default function CertificationsCMS({ certifications, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    badge: '',
    authority: '',
    description: '',
    code: '',
    image: '',
    order: '1'
  });

  const resetForm = () => {
    setForm({
      title: '',
      badge: '',
      authority: '',
      description: '',
      code: '',
      image: '',
      order: '1'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      badge: item.badge || '',
      authority: item.authority || '',
      description: item.description || '',
      code: item.code || '',
      image: item.image || '',
      order: String(item.display_order ?? item.order ?? 1)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this accreditation badge permanently from the database?')) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Accreditation deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete certification');
      }
    } catch (err) {
      alert('Error deleting certification: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      title: form.title.trim(),
      badge: form.badge.trim(),
      authority: form.authority.trim(),
      description: form.description.trim(),
      code: form.code.trim(),
      image: form.image.trim(),
      display_order: Number(form.order || 1),
      order: Number(form.order || 1)
    };

    const url = editingId ? `/api/certifications/${editingId}` : '/api/certifications';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Accreditation updated in database!' : 'New accreditation created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save certification');
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
          <h2>Official Accreditations & Certifications CMS ({certifications.length})</h2>
          <p>Manage verified credentials such as MSME Registration, ISO 9001:2015, and Govt IT Skill Center recognitions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Accreditation
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Accreditation Title</th>
              <th>Badge</th>
              <th>Authority</th>
              <th>Verification Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No certifications in database. Click "Add New Accreditation" to create one.
                </td>
              </tr>
            ) : (
              certifications.map((c) => (
                <tr key={c._id}>
                  <td><strong>#{c.display_order ?? c.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {c.image ? (
                        <img src={c.image} alt={c.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
                      ) : (
                        <ShieldCheck size={24} className="text-amber" />
                      )}
                      <div>
                        <strong style={{ color: '#fff' }}>{c.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.description?.slice(0, 45)}...</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-amber">{c.badge}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{c.authority}</td>
                  <td><code style={{ color: 'var(--primary-hover)' }}>{c.code}</code></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)} title="Edit Accreditation">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)} title="Delete Accreditation">
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Accreditation' : 'Add New Accreditation'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Accreditation Title *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Certified"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Badge Text *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Quality Management"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Issuing Authority *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.authority}
                    onChange={(e) => setForm({ ...form, authority: e.target.value })}
                    placeholder="ISO Standard Authority"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Registration / Verification Code</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="ISO-9001-2025-NKSK"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Badge / Certificate Image URL</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Certified quality assurance framework for technical apprenticeships..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Accreditation' : 'Create Accreditation')}
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
