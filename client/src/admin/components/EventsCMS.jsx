import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Save, X, Clock, MapPin, Users } from 'lucide-react';

export default function EventsCMS({ events, authHeader, onRefreshData, onReloadAdmin, onShowToast }) {
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '2026-03-25',
    time: '10:00 AM - 04:00 PM',
    venue: 'NK SkillEdge Tech Lab, Sakoli',
    speaker: 'Mr. Kartik Mendhe (CEO) & Harshal Mendulkar (CTO)',
    banner: '',
    seats: '50',
    status: 'Upcoming'
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      date: '2026-03-25',
      time: '10:00 AM - 04:00 PM',
      venue: 'NK SkillEdge Tech Lab, Sakoli',
      speaker: 'Mr. Kartik Mendhe (CEO) & Harshal Mendulkar (CTO)',
      banner: '',
      seats: '50',
      status: 'Upcoming'
    });
    setEditingId(null);
    setShowModal(false);
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      time: item.time || '',
      venue: item.venue || '',
      speaker: item.speaker || '',
      banner: item.banner || '',
      seats: String(item.seats || 50),
      status: item.status || 'Upcoming'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workshop/event from the database?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Workshop event deleted from database');
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      venue: form.venue.trim(),
      speaker: form.speaker.trim(),
      banner: form.banner.trim(),
      seats: Number(form.seats || 50),
      registeredCount: 0,
      status: form.status
    };

    const url = editingId ? `/api/events/${editingId}` : '/api/events';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(editingId ? 'Workshop updated in database!' : 'New workshop event created in database!');
        resetForm();
        if (onRefreshData) onRefreshData();
        if (onReloadAdmin) onReloadAdmin();
      } else {
        setErrorMsg(data.message || 'Failed to save event');
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
          <h2>Workshops & Hackathons CMS ({events.length})</h2>
          <p>Schedule college workshops, hands-on bootcamps, and technical seminars.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Schedule New Workshop
        </button>
      </div>

      <div className="table-wrapper glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Workshop Title</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Speaker</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No workshops in database. Click "Schedule New Workshop" to create one.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {e.banner && <img src={e.banner} alt={e.title} style={{ width: '40px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ color: '#fff' }}>{e.title}</strong>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div><strong>{e.date}</strong></div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{e.time}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{e.venue}</td>
                  <td style={{ fontSize: '0.82rem' }}>{e.speaker}</td>
                  <td>{e.seats} seats</td>
                  <td>
                    <span className={`badge ${e.status === 'Upcoming' ? 'badge-emerald' : 'badge-cyan'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(e)} title="Edit Event">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e._id)} title="Delete Event">
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Workshop' : 'Schedule New Workshop'}</h3>
              <button className="close-btn" onClick={resetForm}><X size={18} /></button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Workshop Title *</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Hands-on AI & Full Stack Engineering Bootcamp"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Date (e.g. 2026-03-25)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="10:00 AM - 04:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Venue Location *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    placeholder="NK SkillEdge Tech Lab, Sakoli"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Speaker / Lead Practitioner</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.speaker}
                    onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                    placeholder="Kartik Mendhe & Harshal Mendulkar"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Banner Image URL</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.banner}
                    onChange={(e) => setForm({ ...form, banner: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Seats Available</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Intensive 6-hour interactive laboratory covering production deployments..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : (editingId ? 'Update Workshop' : 'Schedule Workshop')}
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
