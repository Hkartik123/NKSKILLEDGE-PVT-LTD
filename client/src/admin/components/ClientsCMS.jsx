import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Building2 } from 'lucide-react';

export default function ClientsCMS({ clients, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    industry: '',
    logo: '',
    projectCount: '1',
    website: '',
    order: '1'
  });

  const resetForm = () => {
    setForm({
      name: '',
      industry: '',
      logo: '',
      projectCount: '1',
      website: '',
      order: '1'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      industry: item.industry || '',
      logo: item.logo || '',
      projectCount: String(item.projectCount || 1),
      website: item.website || '',
      order: String(item.display_order ?? item.order ?? 1)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner/client from the database?')) return;
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Client deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete client');
      }
    } catch (err) {
      alert('Error deleting client: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim(),
      logo: form.logo.trim(),
      projectCount: Number(form.projectCount || 1),
      website: form.website.trim(),
      display_order: Number(form.order || 1),
      order: Number(form.order || 1)
    };

    const url = editingId ? `/api/clients/${editingId}` : '/api/clients';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Client updated in database!' : 'New client added to database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save client');
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
          <h2>Corporate Partners & Clients CMS ({clients.length})</h2>
          <p>Manage corporate tie-ups, MSME businesses, and institutional client partners.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Client
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Client Name</th>
              <th>Industry</th>
              <th>Projects Count</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No clients in database. Click "Add New Client" to create one.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c._id}>
                  <td><strong>#{c.display_order ?? c.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary-hover)' }}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <strong style={{ color: '#fff' }}>{c.name}</strong>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{c.industry}</span></td>
                  <td>{c.projectCount} Projects</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.website || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)} title="Edit Client">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)} title="Delete Client">
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Client' : 'Add New Client'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Client / Partner Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bhandara Agro Producer Co."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Industry / Sector *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="AgriTech & Supply Chain"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Projects Deployed</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={form.projectCount}
                    onChange={(e) => setForm({ ...form, projectCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Client Website URL</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Logo / Badge Image URL</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="https://..."
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

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Client' : 'Add Client')}
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
