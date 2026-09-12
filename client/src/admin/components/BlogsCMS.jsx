import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Save, X, Calendar, User } from 'lucide-react';

export default function BlogsCMS({ blogs, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Engineering & Tech',
    author: 'Harshal Mendulkar, CTO',
    readingTime: '5 min read',
    summary: '',
    content: '',
    image: '',
    order: '1'
  });

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      category: 'Engineering & Tech',
      author: 'Harshal Mendulkar, CTO',
      readingTime: '5 min read',
      summary: '',
      content: '',
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
      slug: item.slug || '',
      category: item.category || 'Engineering & Tech',
      author: item.author || 'Technical Team',
      readingTime: item.readingTime || '5 min read',
      summary: item.summary || '',
      content: item.content || '',
      image: item.image || '',
      order: String(item.display_order ?? item.order ?? 1)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article from the database?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Article deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete article');
      }
    } catch (err) {
      alert('Error deleting article: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category.trim(),
      author: form.author.trim(),
      readingTime: form.readingTime.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      publishedDate: new Date().toISOString().split('T')[0],
      display_order: Number(form.order || 1),
      order: Number(form.order || 1)
    };

    const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Article updated in database!' : 'New article created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save article');
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
          <h2>Articles & Knowledge Hub CMS ({blogs.length})</h2>
          <p>Publish engineering articles, technical insights, and career growth guides for students and clients.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Write New Article
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Article Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Read Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No articles in database. Click "Write New Article" to create one.
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b._id}>
                  <td><strong>#{b.display_order ?? b.order ?? 1}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {b.image && <img src={b.image} alt={b.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ color: '#fff' }}>{b.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{b.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{b.category}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{b.author}</td>
                  <td style={{ fontSize: '0.82rem' }}>{b.readingTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(b)} title="Edit Article">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)} title="Delete Article">
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Article' : 'Write New Article'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Modern Full-Stack Development Roadmap 2026"
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
                    placeholder="Engineering & Tech"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Harshal Mendulkar, CTO"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Reading Time (e.g. 5 min read)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.readingTime}
                    onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
                  />
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
              </div>

              <div className="form-group">
                <label className="form-label">Summary Excerpt *</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Key architectural choices in React 19, TypeScript 5, and Node 22..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Article Content</label>
                <textarea 
                  className="form-textarea"
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the full technical guidance or announcement here..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Article' : 'Publish Article')}
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
