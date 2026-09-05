import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    portfolioUrl: '',
    coverMessage: ''
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/careers/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.jobs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          position: applyingJob.position
        })
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="careers-page section" id="careers">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-cyan">Join Our Mission</span>
          <h2>Work With NK SkillEdge</h2>
          <p>Help us shape the next generation of engineers and deliver cutting-edge software solutions from Sakoli.</p>
        </div>

        <div className="jobs-list-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading openings...</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="card-interactive job-listing-card">
                <div className="job-header">
                  <div>
                    <h3>{job.position}</h3>
                    <div className="job-meta-row">
                      <span className="job-meta-item"><Briefcase size={14} /> {job.department}</span>
                      <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                      <span className="job-meta-item"><Clock size={14} /> {job.employmentType}</span>
                      <span className="job-badge">{job.experience}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => { setApplyingJob(job); setSentSuccess(false); }}
                  >
                    Apply for Role <ArrowRight size={15} />
                  </button>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-skills-wrap">
                  {job.skills?.map((s, i) => (
                    <span key={i} className="tech-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Career Application Modal */}
      {applyingJob && (
        <div className="modal-overlay" onClick={() => setApplyingJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {sentSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={54} className="text-emerald" style={{ margin: '0 auto 16px auto' }} />
                <h3>Application Submitted!</h3>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                  Thank you for applying for the position of <strong>{applyingJob.position}</strong>. Our talent acquisition team will review your credentials.
                </p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setApplyingJob(null)}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h2>Apply for Position</h2>
                <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  Role: <strong>{applyingJob.position}</strong> ({applyingJob.location})
                </p>

                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Anand Joshi"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input 
                        type="email" 
                        required 
                        className="form-input" 
                        placeholder="anand@gmail.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="form-input" 
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resume / CV Link (Google Drive / Dropbox)</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://drive.google.com/your-resume-link"
                      value={form.resumeUrl}
                      onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portfolio or GitHub URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://github.com/your-username"
                      value={form.portfolioUrl}
                      onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Why do you want to work with NK SkillEdge?</label>
                    <textarea 
                      className="form-textarea"
                      rows={3}
                      placeholder="Tell us about your experience and how you can contribute..."
                      value={form.coverMessage}
                      onChange={(e) => setForm({ ...form, coverMessage: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" disabled={sending} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    {sending ? 'Submitting Application...' : 'Submit Job Application'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .jobs-list-container {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .job-listing-card {
          padding: 28px;
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
        }
        @media (max-width: 640px) {
          .job-header { flex-direction: column; }
        }
        .job-header h3 {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }
        .job-meta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .job-badge {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary-hover);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
        .job-description {
          font-size: 0.92rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .job-skills-wrap {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
