import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle, AlertTriangle, Printer, QrCode, Building, User, Calendar } from 'lucide-react';

export default function VerifyCertificate() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certId.trim())}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.certificate);
      } else {
        setError(data.message || 'No certificate record found with this ID.');
      }
    } catch (err) {
      setError('Error connecting to the verification server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page-root section" id="verify">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-cyan">Official Credential Registry</span>
          <h2>Digital Certificate Verification</h2>
          <p>
            Authenticate official completion credentials issued by NK SkillEdge Pvt. Ltd. for students, employers, and institutional recruiters.
          </p>
        </div>

        <div className="verification-search-box glass-panel">
          <form onSubmit={handleVerify} className="verify-form">
            <div className="search-field-wrap">
              <Search size={20} className="search-field-icon" />
              <input 
                type="text" 
                placeholder="Enter Certificate ID (e.g. NKSK-2025-WD101)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="verify-input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary verify-btn">
              {loading ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>

          <div className="sample-id-chips">
            <span className="sample-label">Try sample IDs:</span>
            <button type="button" onClick={() => setCertId('NKSK-2025-WD101')} className="sample-chip">NKSK-2025-WD101</button>
            <button type="button" onClick={() => setCertId('NKSK-2025-IT204')} className="sample-chip">NKSK-2025-IT204</button>
          </div>
        </div>

        {error && (
          <div className="verify-alert-box alert-error">
            <AlertTriangle size={24} />
            <div>
              <strong>Verification Result: Unverified Credential</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="certificate-badge-card glass-panel animate-slide-up">
            <div className="cert-top-banner">
              <div className="cert-logo-mark">
                <span className="cert-monogram">NK</span>
              </div>
              <div className="cert-org-title">
                <h3>NK SkillEdge Pvt. Ltd.</h3>
                <span>Authorized Skill Development & IT Engineering Directorate • Sakoli</span>
              </div>
              <div className={`status-pill ${result.status === 'Valid' ? 'status-valid' : 'status-invalid'}`}>
                <CheckCircle size={16} />
                <span>Status: {result.status?.toUpperCase()}</span>
              </div>
            </div>

            <div className="cert-main-grid">
              <div className="cert-detail-item">
                <span className="cd-label"><User size={14} /> Student Candidate Name</span>
                <h4 className="cd-value-highlight">{result.studentName}</h4>
              </div>

              <div className="cert-detail-item">
                <span className="cd-label"><Award size={14} /> Certified Program</span>
                <h4 className="cd-value">{result.course}</h4>
              </div>

              <div className="cert-detail-item">
                <span className="cd-label"><Calendar size={14} /> Program Completion Date</span>
                <span className="cd-val-text">{result.completionDate}</span>
              </div>

              <div className="cert-detail-item">
                <span className="cd-label"><Calendar size={14} /> Credential Issue Date</span>
                <span className="cd-val-text">{result.issueDate}</span>
              </div>

              <div className="cert-detail-item">
                <span className="cd-label">Academic Evaluation Grade</span>
                <span className="cd-val-badge">{result.grade}</span>
              </div>

              <div className="cert-detail-item">
                <span className="cd-label">Unique Credential ID</span>
                <span className="cd-val-code">{result.certificateId}</span>
              </div>
            </div>

            {result.projectTitle && (
              <div className="cert-capstone-strip">
                <strong>Capstone Project Defense:</strong>
                <p>{result.projectTitle}</p>
              </div>
            )}

            <div className="cert-signatures-bar">
              <div className="sig-item">
                <div className="sig-line"></div>
                <strong>{result.verifiedBy}</strong>
                <span>Executive Directorate</span>
              </div>
              <div className="cert-seal">
                <div className="seal-circle">
                  <ShieldCheck size={28} />
                  <span>OFFICIAL DIGITAL SEAL</span>
                </div>
              </div>
              <div className="sig-item text-right">
                <div className="sig-line"></div>
                <strong>MSME & ISO 9001:2015</strong>
                <span>Quality Management Certified</span>
              </div>
            </div>

            <div className="cert-print-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer size={15} /> Print Credential Record
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .verify-page-root {
          padding-top: 40px;
        }
        .verification-search-box {
          max-width: 750px;
          margin: 0 auto 36px auto;
          padding: 28px;
        }
        .verify-form {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .verify-form { flex-direction: column; }
        }
        .search-field-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0 16px;
        }
        .search-field-icon {
          color: var(--primary);
          margin-right: 10px;
        }
        .verify-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          padding: 14px 0;
          outline: none;
          font-family: var(--font-heading);
        }
        .verify-btn {
          padding: 14px 28px;
        }
        .sample-id-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .sample-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .sample-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--primary-hover);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          cursor: pointer;
          font-family: monospace;
        }
        .sample-chip:hover {
          background: rgba(14, 165, 233, 0.15);
          border-color: var(--primary);
        }

        .verify-alert-box {
          max-width: 750px;
          margin: 0 auto 30px auto;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 24px;
          border-radius: var(--radius-md);
        }
        .alert-error {
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #fca5a5;
        }
        .alert-error strong { color: #ffffff; }

        /* Certificate Badge Card */
        .certificate-badge-card {
          max-width: 820px;
          margin: 0 auto;
          padding: 36px;
          border: 2px solid rgba(14, 165, 233, 0.35);
          box-shadow: 0 0 35px rgba(14, 165, 233, 0.15);
          position: relative;
        }
        .cert-top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--border-subtle);
          padding-bottom: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .cert-logo-mark {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        .cert-org-title {
          flex: 1;
          margin-left: 14px;
        }
        .cert-org-title h3 {
          font-size: 1.35rem;
          margin-bottom: 2px;
        }
        .cert-org-title span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .status-valid {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
        }
        .status-invalid {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.4);
          color: #fda4af;
        }

        .cert-main-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 640px) {
          .cert-main-grid { grid-template-columns: 1fr; }
        }
        .cert-detail-item {
          display: flex;
          flex-direction: column;
        }
        .cd-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cd-value-highlight {
          font-size: 1.4rem;
          color: #ffffff;
        }
        .cd-value {
          font-size: 1.15rem;
          color: var(--primary-hover);
        }
        .cd-val-text {
          font-size: 1rem;
          color: var(--text-light);
          font-weight: 500;
        }
        .cd-val-badge {
          display: inline-block;
          align-self: flex-start;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .cd-val-code {
          font-family: monospace;
          font-size: 1.05rem;
          color: var(--primary-hover);
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .cert-capstone-strip {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid var(--primary);
          padding: 12px 16px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-bottom: 28px;
          font-size: 0.88rem;
        }
        .cert-capstone-strip strong { color: #ffffff; display: block; margin-bottom: 2px; }

        .cert-signatures-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 24px;
          margin-top: 24px;
        }
        @media (max-width: 640px) {
          .cert-signatures-bar { flex-direction: column; gap: 20px; text-align: center; }
          .sig-item.text-right { text-align: center; }
        }
        .sig-item {
          display: flex;
          flex-direction: column;
        }
        .sig-item strong { color: #ffffff; font-size: 0.88rem; }
        .sig-item span { font-size: 0.76rem; color: var(--text-muted); }
        .sig-line {
          width: 140px;
          height: 1px;
          background: var(--border-light);
          margin-bottom: 8px;
        }
        .sig-item.text-right { text-align: right; }
        .sig-item.text-right .sig-line { margin-left: auto; }
        .seal-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px dashed var(--primary);
          color: var(--primary-hover);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          text-align: center;
          padding: 4px;
          font-weight: 700;
        }
        .cert-print-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
