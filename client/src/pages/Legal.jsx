import React, { useState } from 'react';
import { Shield, FileText, RefreshCw, BookOpen } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="legal-page section" id="legal">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-cyan">Legal Compliance</span>
          <h2>Policies & Institutional Terms</h2>
          <p>Transparency, ethical training agreements, and data protection policies for NK SkillEdge Pvt. Ltd.</p>
        </div>

        <div className="legal-tabs-nav">
          <button className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
            <Shield size={16} /> Privacy Policy
          </button>
          <button className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveTab('terms')}>
            <FileText size={16} /> Terms of Service
          </button>
          <button className={`legal-tab-btn ${activeTab === 'refund' ? 'active' : ''}`} onClick={() => setActiveTab('refund')}>
            <RefreshCw size={16} /> Refund & Admission Policy
          </button>
          <button className={`legal-tab-btn ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')}>
            <BookOpen size={16} /> Training & Internship Terms
          </button>
        </div>

        <div className="glass-panel legal-content-box">
          {activeTab === 'privacy' && (
            <div>
              <h3>Privacy & Data Protection Policy</h3>
              <p className="legal-date">Last Updated: January 2025</p>
              <div className="legal-body-text">
                <p>
                  NK SkillEdge Pvt. Ltd. (“we”, “our”, or “us”) is firmly committed to safeguarding the privacy and security of our students, website visitors, and corporate clients. This policy explains our information practices:
                </p>
                <h4>1. Information We Collect</h4>
                <p>
                  When you register for training programs, submit contact inquiries, or apply for internships, we collect identifying details such as full name, email address, mobile number, college details, and technical preferences.
                </p>
                <h4>2. Purpose of Information Use</h4>
                <p>
                  Collected data is strictly used to process course admissions, issue verified credentials, notify candidates of batch schedules, provide placement referrals, and respond to business software requests.
                </p>
                <h4>3. Confidentiality Guarantee</h4>
                <p>
                  We never sell, rent, or trade student or client contact details to third-party telemarketers. All stored student records are retained in compliance with standard IT data security benchmarks.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h3>Terms and Conditions</h3>
              <p className="legal-date">Last Updated: January 2025</p>
              <div className="legal-body-text">
                <h4>1. Acceptance of Terms</h4>
                <p>
                  By accessing the official website of NK SkillEdge Pvt. Ltd. (nkskilledge.com) or enrolling in any offline/online cohort, you agree to comply with these terms and our institutional code of conduct.
                </p>
                <h4>2. Intellectual Property Rights</h4>
                <p>
                  All educational syllabi, proprietary laboratory guides, branding elements, software code examples, and multimedia published on this platform remain the intellectual property of NK SkillEdge Pvt. Ltd.
                </p>
                <h4>3. Commercial Services Delivery</h4>
                <p>
                  Client software projects, development milestones, and SLAs are governed by individualized bilateral contracts signed prior to project commencement.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div>
              <h3>Admission & Fee Refund Policy</h3>
              <p className="legal-date">Last Updated: January 2025</p>
              <div className="legal-body-text">
                <h4>1. Course Registration & Seat Allotment</h4>
                <p>
                  Registration fees confirm seat reservations in finite-capacity laboratory batches (capped at 20-25 trainees per cohort to maintain 1-on-1 mentorship standards).
                </p>
                <h4>2. Refund Window</h4>
                <p>
                  Candidates who request course cancellation at least 5 business days prior to the official batch commencement date are eligible for a 90% refund (less 10% administrative processing fee).
                </p>
                <h4>3. Non-Refundable Period</h4>
                <p>
                  Once a batch commences and laboratory access/cloud credentials have been provisioned, fees are non-refundable. Batch transfers may be granted on medical or academic grounds subject to director approval.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div>
              <h3>Industrial Training & Internship Code of Conduct</h3>
              <p className="legal-date">Last Updated: January 2025</p>
              <div className="legal-body-text">
                <h4>1. Mandatory Attendance & Project Defense</h4>
                <p>
                  To receive the official ISO 9001:2015 completion certificate and unique Certificate ID, candidates must achieve at least 80% attendance and successfully defend their live capstone project.
                </p>
                <h4>2. Academic Integrity & Originality</h4>
                <p>
                  All project code submitted for evaluation must represent genuine engineering work executed during the program. Plagiarized code from unauthorized online sources is grounds for certificate revocation.
                </p>
                <h4>3. Credential Verification</h4>
                <p>
                  Employers and universities can verify credentials indefinitely through our digital registry using the candidate's Certificate ID.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .legal-tabs-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .legal-tab-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .legal-tab-btn.active, .legal-tab-btn:hover {
          background: rgba(14, 165, 233, 0.15);
          color: var(--primary-hover);
          border-color: var(--primary);
        }
        .legal-content-box {
          max-width: 860px;
          margin: 0 auto;
          padding: 40px;
        }
        .legal-content-box h3 {
          margin-bottom: 6px;
        }
        .legal-date {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .legal-body-text h4 {
          color: #ffffff;
          margin: 20px 0 8px 0;
        }
        .legal-body-text p {
          font-size: 0.94rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
