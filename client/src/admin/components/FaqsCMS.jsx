import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Save, X, HelpCircle } from 'lucide-react';

export default function FaqsCMS({ faqs, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: '1'
  });

  const resetForm = () => {
    setForm({
      question: '',
      answer: '',
      category: 'General',
      order: '1'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || 'General',
      order: String(item.display_order ?? item.order ?? 1)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ from the database?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('FAQ deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete FAQ');
      }
    } catch (err) {
      alert('Error deleting FAQ: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim(),
      display_order: Number(form.order || 1),
      order: Number(form.order || 1)
    };

    const url = editingId ? `/api/faqs/${editingId}` : '/api/faqs';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'FAQ updated in database!' : 'New FAQ added to database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save FAQ');
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
          <h2>Frequently Asked Questions CMS ({faqs.length})</h2>
          <p>Manage common inquiries regarding admissions, course syllabi, corporate contracts, and certificates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Category</th>
              <th>Answer Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No FAQs in database. Click "Add New FAQ" to create one.
                </td>
              </tr>
            ) : (
              faqs.map((f) => (
                <tr key={f._id}>
                  <td><strong>#{f.display_order ?? f.order ?? 1}</strong></td>
                  <td><strong style={{ color: '#fff' }}>{f.question}</strong></td>
                  <td><span className="badge badge-cyan">{f.category || 'General'}</span></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {f.answer?.slice(0, 60)}...
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(f)} title="Edit FAQ">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f._id)} title="Delete FAQ">
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. Do I get hands-on live project exposure?"
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
                    placeholder="Admissions / Software"
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
                <label className="form-label">Answer Details *</label>
                <textarea 
                  className="form-textarea"
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Yes, all students work on actual commercial production applications..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update FAQ' : 'Add FAQ')}
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
