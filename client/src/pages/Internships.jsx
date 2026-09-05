import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Award, Clock, ArrowRight, Laptop, Send } from 'lucide-react';

export default function Internships({ onOpenRegister }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('Full Stack Web Development');
  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    course: 'B.E. / B.Tech',
    year: 'Final Year',
    domain: 'Full Stack Web Development',
    duration: '3 Months',
    resumeUrl: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/internships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appForm)
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

  const domains = [
    { title: 'Full Stack Web Engineering', desc: 'Build reactive dashboards, REST APIs, and database models using the MERN stack.', tech: ['React', 'Node', 'Express', 'MongoDB'] },
    { title: 'Cross-Platform Mobile Apps', desc: 'Engineer native iOS & Android applications using Flutter and Firebase cloud backends.', tech: ['Flutter', 'Dart', 'Firebase'] },
    { title: 'AI & Data Science Modeling', desc: 'Develop predictive machine learning models, computer vision OCR, and Python analytics pipelines.', tech: ['Python', 'TensorFlow', 'FastAPI'] },
    { title: 'IoT & Embedded Systems', desc: 'Program microcontrollers, cloud telemetry relays, and smart automation sensor nodes.', tech: ['ESP32', 'C++', 'MQTT'] }
  ];

  return (
    <div className="internships-page section" id="internships">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-emerald">Industry Apprenticeship</span>
          <h2>College & Graduate Internship Programs</h2>
          <p>Gain verifiable commercial engineering experience and build deployed software under direct senior mentorship in Sakoli.</p>
        </div>

        <div className="grid-2" style={{ marginBottom: '40px' }}>
          <div className="glass-panel internship-info-box">
            <h3>Internship Benefits & Methodology</h3>
            <ul className="internship-perks-list">
              <li><CheckCircle2 size={18} className="text-emerald" /> <strong>Live Commercial Projects:</strong> Work on production apps, not dummy textbook homework.</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> <strong>1-on-1 Code Reviews:</strong> Get your GitHub pull requests critiqued by our CTO and lead developers.</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> <strong>ISO-Recognized Certificate:</strong> Receive an authenticated experience certificate with verifiable credentials.</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> <strong>Placement Referral:</strong> Top performers receive direct employment offers or referrals to partner IT firms.</li>
            </ul>
          </div>

          <div className="glass-panel internship-info-box">
            <h3>Eligibility & Duration</h3>
            <div className="eligibility-grid">
              <div className="el-item">
                <span className="el-label">Target Students</span>
                <strong>B.E., B.Tech, B.C.A., B.Sc., Diploma</strong>
              </div>
              <div className="el-item">
                <span className="el-label">Semesters Eligible</span>
                <strong>2nd, 3rd, Final Year & Recent Graduates</strong>
              </div>
              <div className="el-item">
                <span className="el-label">Flexible Durations</span>
                <strong>1 Month, 3 Months, or 6 Months</strong>
              </div>
              <div className="el-item">
                <span className="el-label">Training Delivery</span>
                <strong>Sakoli Tech Lab / Hybrid Cloud</strong>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowApplyModal(true)}>
                Apply for Internship Cohort
              </button>
            </div>
          </div>
        </div>

        <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Available Internship Tracks</h3>
        <div className="grid-4">
          {domains.map((d, i) => (
            <div key={i} className="card-interactive domain-card">
              <h4>{d.title}</h4>
              <p>{d.desc}</p>
              <div className="domain-tech">
                {d.tech.map((t, idx) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ marginTop: 'auto' }}
                onClick={() => {
                  setAppForm({ ...appForm, domain: d.title });
                  setShowApplyModal(true);
                }}
              >
                Apply for {d.title.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Internship Application Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {sentSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={54} className="text-emerald" style={{ margin: '0 auto 16px auto' }} />
                <h3>Internship Application Received!</h3>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                  Our technical mentoring team will review your application for the <strong>{appForm.domain}</strong> track and contact you within 24 hours.
                </p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => { setShowApplyModal(false); setSentSuccess(false); }}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h2>Apply for Internship</h2>
                <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Selected Domain: <strong>{appForm.domain}</strong>
                </p>

                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Kartik Sharma"
                      value={appForm.fullName}
                      onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input 
                        type="email" 
                        required 
                        className="form-input" 
                        placeholder="name@gmail.com"
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="form-input" 
                        placeholder="10-digit mobile"
                        value={appForm.phone}
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">College Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Institute / Polytechnic"
                        value={appForm.college}
                        onChange={(e) => setAppForm({ ...appForm, college: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Duration</label>
                      <select 
                        className="form-select"
                        value={appForm.duration}
                        onChange={(e) => setAppForm({ ...appForm, duration: e.target.value })}
                      >
                        <option value="1 Month">1 Month Fast-track</option>
                        <option value="3 Months">3 Months Intensive</option>
                        <option value="6 Months">6 Months Comprehensive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub Profile or Resume Link (Google Drive)</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://github.com/your-username or drive link"
                      value={appForm.resumeUrl}
                      onChange={(e) => setAppForm({ ...appForm, resumeUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Message</label>
                    <textarea 
                      className="form-textarea"
                      rows={2}
                      placeholder="Why do you want to intern at NK SkillEdge?"
                      value={appForm.message}
                      onChange={(e) => setAppForm({ ...appForm, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" disabled={sending} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    {sending ? 'Submitting Application...' : 'Submit Internship Application'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .internship-info-box {
          padding: 32px;
        }
        .internship-info-box h3 {
          margin-bottom: 20px;
          color: var(--primary-hover);
        }
        .internship-perks-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .internship-perks-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.92rem;
          color: var(--text-light);
        }
        .eligibility-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .el-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 12px;
          border-radius: var(--radius-md);
        }
        .el-label {
          display: block;
          font-size: 0.76rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .el-item strong {
          display: block;
          font-size: 0.92rem;
          color: #ffffff;
          margin-top: 2px;
        }
        .domain-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .domain-card h4 {
          margin-bottom: 8px;
        }
        .domain-card p {
          font-size: 0.88rem;
          margin-bottom: 16px;
          flex: 1;
        }
        .domain-tech {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
