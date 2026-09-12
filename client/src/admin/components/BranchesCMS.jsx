import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Save, X, Phone } from 'lucide-react';

export default function BranchesCMS({ branches, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Sakoli',
    district: 'Bhandara',
    state: 'Maharashtra',
    pincode: '441802',
    phone: '',
    isMainBranch: false,
    displayOrder: '1'
  });

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      city: 'Sakoli',
      district: 'Bhandara',
      state: 'Maharashtra',
      pincode: '441802',
      phone: '',
      isMainBranch: false,
      displayOrder: '1'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      address: item.address || '',
      city: item.city || 'Sakoli',
      district: item.district || '',
      state: item.state || 'Maharashtra',
      pincode: item.pincode || '',
      phone: item.phone || '',
      isMainBranch: Boolean(item.isMainBranch),
      displayOrder: String(item.displayOrder || 1)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this office location permanently from the database?')) return;
    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Office branch deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete branch');
      }
    } catch (err) {
      alert('Error deleting branch: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      phone: form.phone.trim(),
      isMainBranch: Boolean(form.isMainBranch),
      displayOrder: Number(form.displayOrder || 1)
    };

    const url = editingId ? `/api/branches/${editingId}` : '/api/branches';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Branch updated in database!' : 'New branch created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save branch');
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
          <h2>Regional Office Branches & Centers CMS ({branches.length})</h2>
          <p>Control office addresses, phone helplines, and laboratory facilities across Sakoli, Nagpur, and Gondia.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New Branch
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Branch Name</th>
              <th>City / District</th>
              <th>Full Address</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No branches in database. Click "Add New Branch" to create one.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b._id}>
                  <td><strong>#{b.displayOrder || 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} className="text-cyan" />
                      <strong style={{ color: '#fff' }}>{b.name}</strong>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{b.city}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{b.address}, {b.pincode}</td>
                  <td style={{ fontSize: '0.82rem' }}>{b.phone || 'N/A'}</td>
                  <td>
                    {b.isMainBranch ? (
                      <span className="badge badge-emerald">Headquarters</span>
                    ) : (
                      <span className="badge badge-amber">Regional Center</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(b)} title="Edit Branch">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)} title="Delete Branch">
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Branch' : 'Add New Branch'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Branch Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sakoli Headquarters & Tech Center"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Near Gobade Hospital, Main Highway Road"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Sakoli"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="Bhandara"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="441802"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Helpline Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 7498784109"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '28px' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={form.isMainBranch}
                      onChange={(e) => setForm({ ...form, isMainBranch: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <strong style={{ color: '#fff' }}>Main Headquarters</strong>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Branch' : 'Create Branch')}
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
