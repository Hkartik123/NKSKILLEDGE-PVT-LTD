import React, { useState } from 'react';
import { X, CheckCircle, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, defaultProgram, programs = [] }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    college: '',
    course: 'B.E. / B.Tech',
    branch: 'Computer Science / IT',
    yearOrSemester: 'Final Year',
    preferredBatch: 'Upcoming Batch',
    trainingMode: 'Offline (Sakoli Lab)',
    city: 'Sakoli',
    programName: defaultProgram?.name || 'Industrial Training Program',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Registration failed. Please check the inputs.');
      }
    } catch (err) {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>

        {result ? (
          <div className="registration-success-box">
            <div className="success-icon-wrap">
              <CheckCircle size={54} className="success-check-icon" />
            </div>
            <h3>Registration Confirmed!</h3>
            <p className="success-subtitle">Your application has been received into the official NK SkillEdge registry.</p>
            
            <div className="reg-id-card">
              <span className="id-label">Official Registration ID</span>
              <strong className="id-value">{result.registrationId}</strong>
              <span className="id-note">Please save this registration ID for orientation & verification.</span>
            </div>

            <div className="success-next-steps">
              <h4>What Happens Next?</h4>
              <ul>
                <li>Our academic counseling team will call you on <strong>{formData.mobileNumber}</strong> within 24 hours.</li>
                <li>Batch schedule, lab orientation guidelines, and syllabus materials will be dispatched.</li>
              </ul>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>
              Done & Return to Platform
            </button>
          </div>
        ) : (
          <div>
            <div className="modal-header">
              <div className="modal-badge"><GraduationCap size={14} /> Training Enrollment</div>
              <h2>Apply for Training Program</h2>
              <p>Join the next cohort of engineers mastering production-grade tech stacks in Sakoli.</p>
            </div>

            {error && <div className="form-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="reg-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. Kartik Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    className="form-input" 
                    placeholder="10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Program *</label>
                  <select 
                    className="form-select"
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  >
                    <option value="Industrial Training Program">Industrial Training Program</option>
                    <option value="Full Stack Web Development">Full Stack Web Development (MERN)</option>
                    <option value="Mobile App Development">Mobile App Development (Flutter)</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                    <option value="Career Guidance & Personality">Career Guidance & Personality</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">College / Institute Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Government Polytechnic / Engineering College"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Degree & Branch</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. B.Tech Computer Engineering"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Training Mode</label>
                  <select 
                    className="form-select"
                    value={formData.trainingMode}
                    onChange={(e) => setFormData({ ...formData, trainingMode: e.target.value })}
                  >
                    <option value="Offline (Sakoli Lab)">Offline (Sakoli Lab Training)</option>
                    <option value="Hybrid (Lab + Online Project)">Hybrid (Lab + Online Project)</option>
                    <option value="Online Virtual Classroom">Online Virtual Classroom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">City / Native Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Sakoli, Bhandara, Nagpur"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Any Questions or Expectations?</label>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  placeholder="Tell us what you want to achieve with this training..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {loading ? 'Submitting Registration...' : 'Confirm Registration & Generate ID'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .modal-header {
          margin-bottom: 24px;
        }
        .modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--primary-hover);
          background: rgba(14, 165, 233, 0.1);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
          font-weight: 600;
        }
        .modal-header h2 {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .form-row-2 { grid-template-columns: 1fr; gap: 0; }
        }
        .form-error-alert {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #fda4af;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          margin-bottom: 16px;
        }
        .registration-success-box {
          text-align: center;
          padding: 20px 10px;
        }
        .success-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .success-check-icon {
          color: var(--accent-emerald);
        }
        .success-subtitle {
          color: var(--text-secondary);
          margin-top: 6px;
        }
        .reg-id-card {
          margin: 24px auto;
          background: rgba(14, 165, 233, 0.08);
          border: 1px dashed var(--primary);
          padding: 18px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .id-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .id-value {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: var(--primary-hover);
          letter-spacing: 0.04em;
          margin: 4px 0;
        }
        .id-note {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .success-next-steps {
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
        }
        .success-next-steps h4 {
          margin-bottom: 8px;
          color: #ffffff;
        }
        .success-next-steps ul {
          padding-left: 20px;
          color: var(--text-secondary);
        }
        .success-next-steps li {
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
