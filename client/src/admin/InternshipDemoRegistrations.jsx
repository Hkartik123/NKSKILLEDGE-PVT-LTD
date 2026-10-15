import React, { useEffect, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';

const DOMAINS = [
  'Web Development',
  'App Development',
  'Cyber Security',
  'Python',
  'AI/ML',
  'Data Analytics',
  'Full-Stack Development',
  'IoT',
  'Cloud/DevOps',
  'UI/UX Design'
];

export default function InternshipDemoRegistrations({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [preferredDemoDay, setPreferredDemoDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      const query = new URLSearchParams();
      if (search.trim()) query.set('search', search.trim());
      if (domain) query.set('domain', domain);
      if (preferredDemoDay) query.set('preferredDemoDay', preferredDemoDay);

      try {
        const response = await fetch(`/api/internship-demo/registrations?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store'
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to load internship demo registrations.');
        }
        setRegistrations(result.registrations);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError.message || 'Unable to load internship demo registrations.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [token, search, domain, preferredDemoDay, refreshKey]);

  const updateStatus = async (registration, status) => {
    setUpdatingId(registration._id);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`/api/internship-demo/registrations/${encodeURIComponent(registration._id)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to update this registration.');
      }

      setRegistrations(current => current.map(item => (
        item._id === registration._id ? result.registration : item
      )));
      setNotice(`Registration ${registration.registrationId} updated to ${status.replaceAll('_', ' ')}.`);
    } catch (requestError) {
      setError(requestError.message || 'Unable to update this registration.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="tab-pane">
      <div className="pane-header demo-admin-heading">
        <div>
          <h2>Internship Demo Registrations</h2>
          <p>Saved student registrations from the PostgreSQL database.</p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={() => setRefreshKey(value => value + 1)}
          aria-label="Refresh internship demo registrations"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="demo-admin-filters glass-panel">
        <label className="demo-admin-search">
          <span>Search student</span>
          <span className="demo-admin-search-control">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Name, email, or mobile number"
            />
          </span>
        </label>
        <label>
          <span>Domain</span>
          <select value={domain} onChange={event => setDomain(event.target.value)}>
            <option value="">All domains</option>
            {DOMAINS.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Preferred day</span>
          <select value={preferredDemoDay} onChange={event => setPreferredDemoDay(event.target.value)}>
            <option value="">Saturday and Sunday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </label>
      </div>

      {error && <div className="demo-admin-message error" role="alert">{error}</div>}
      {notice && <div className="demo-admin-message success" role="status">{notice}</div>}

      <div className="table-responsive glass-panel demo-admin-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Student</th>
              <th>College & education</th>
              <th>Domain</th>
              <th>Preferred day</th>
              <th>City</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(registration => (
              <tr key={registration._id}>
                <td><span className="reg-id-pill">{registration.registrationId}</span></td>
                <td>
                  <strong>{registration.fullName}</strong>
                  <div className="sub-email">{registration.email}</div>
                  <div className="sub-city">{registration.mobileNumber}</div>
                </td>
                <td>
                  <div>{registration.collegeName}</div>
                  <div className="sub-city">
                    {registration.educationLevel}
                    {registration.semesterYear ? ` · ${registration.semesterYear}` : ''}
                  </div>
                </td>
                <td>{registration.selectedDomain}</td>
                <td>{registration.preferredDemoDay}</td>
                <td>{registration.city || '—'}</td>
                <td>{new Date(registration.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className="form-select-sm"
                    aria-label={`Status for ${registration.fullName}`}
                    value={registration.status}
                    disabled={updatingId === registration._id}
                    onChange={event => updateStatus(registration, event.target.value)}
                  >
                    <option value="PENDING_CONFIRMATION">Pending confirmation</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CONFIRMED">Confirmed</option>
                  </select>
                </td>
              </tr>
            ))}
            {!loading && registrations.length === 0 && (
              <tr>
                <td colSpan="8" className="demo-admin-empty">No internship demo registrations match these filters.</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="8" className="demo-admin-empty">Loading registrations from the database…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
