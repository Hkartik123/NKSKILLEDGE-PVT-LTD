import React from 'react';
import { Target, Compass, Award, CheckCircle2, ShieldCheck, Milestone, ArrowRight } from 'lucide-react';

export default function About({ siteSettings }) {
  const timeline = siteSettings?.journeyTimeline || [
    { year: '2023', title: 'Foundation & Sakoli Launch', description: 'Established NK SkillEdge Pvt. Ltd. with the mission to bridge rural-urban tech skill gaps.' },
    { year: '2023', title: 'First Training Batch', description: 'Conducted first industrial training batch with 40+ engineering and diploma students.' },
    { year: '2024', title: 'Corporate Client Solutions', description: 'Launched dedicated IT development division delivering custom web and mobile apps for MSMEs.' },
    { year: '2024', title: '150+ Students Placed & Trained', description: 'Achieved 50+ placement milestone with corporate tie-ups and internship drives.' },
    { year: '2025', title: 'Next-Gen Tech Curriculum', description: 'Introduced hands-on training in AI, Machine Learning, and IoT with practical laboratories.' },
    { year: '2026', title: 'Digital Platform Renewal', description: 'Expanded digital footprint with an integrated student portal, certification registry, and live projects.' }
  ];

  return (
    <div className="about-page-root" id="about">
      <section className="section about-hero">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Company Profile</span>
            <h1>About NK SkillEdge Pvt. Ltd.</h1>
            <p>Empowering engineers, building digital futures, and shaping industry-ready technical talent in Sakoli, Maharashtra.</p>
          </div>

          <div className="about-intro-grid">
            <div className="glass-panel about-card">
              <h3>Our Founding Story</h3>
              <p>
                Founded in Sakoli, Maharashtra, <strong>NK SkillEdge Pvt. Ltd.</strong> was born out of a clear realization: talented engineering and diploma students in regional districts frequently lacked access to production-grade software development environments, enterprise mentorship, and live client pipelines.
              </p>
              <p style={{ marginTop: '12px' }}>
                Instead of requiring students to travel to saturated metros like Pune or Bangalore, we created a localized powerhouse: a modern innovation center providing high-speed hardware labs, cloud sandboxes, and experienced software engineers who train students on live commercial applications.
              </p>
            </div>

            <div className="glass-panel about-card">
              <h3>Core Positioning</h3>
              <p>
                NK SkillEdge empowers students and professionals through practical training, industry exposure, and real-world learning, while also providing digital solutions to businesses and startups.
              </p>
              <div className="positioning-highlights">
                <div className="pos-item">
                  <CheckCircle2 size={16} className="text-cyan" />
                  <span>ISO 9001:2015 Quality Management Certified</span>
                </div>
                <div className="pos-item">
                  <CheckCircle2 size={16} className="text-cyan" />
                  <span>Ministry of MSME Registered Enterprise</span>
                </div>
                <div className="pos-item">
                  <CheckCircle2 size={16} className="text-cyan" />
                  <span>Verifiable Digital Credential Registry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission (PRD Section 11) */}
      <section className="section vision-mission-section">
        <div className="container">
          <div className="grid-2">
            <div className="card-interactive vm-card vision-box">
              <div className="vm-icon"><Target size={30} /></div>
              <h2>Our Vision</h2>
              <p className="vm-statement">
                Build a trusted ecosystem that seamlessly connects skills, technology, education, and career opportunities for every aspiring technologist.
              </p>
              <p>
                We envision a technology landscape where geographic location is never a barrier to world-class software engineering excellence.
              </p>
            </div>

            <div className="card-interactive vm-card mission-box">
              <div className="vm-icon"><Compass size={30} /></div>
              <h2>Our Mission</h2>
              <ul className="mission-checklist">
                <li><CheckCircle2 size={16} className="text-emerald" /> Deliver practical, industry-oriented education without theoretical fluff.</li>
                <li><CheckCircle2 size={16} className="text-emerald" /> Build employment-ready engineering talent with live project portfolios.</li>
                <li><CheckCircle2 size={16} className="text-emerald" /> Create innovative, secure software solutions for businesses and startups.</li>
                <li><CheckCircle2 size={16} className="text-emerald" /> Promote local digital transformation and rural-urban tech equality.</li>
                <li><CheckCircle2 size={16} className="text-emerald" /> Cultivate a culture of lifelong learning, mentorship, and ethical engineering.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline (PRD Section 10) */}
      <section className="section timeline-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-purple">Growth Milestones</span>
            <h2>Our Journey & Expansion Roadmap</h2>
            <p>From our first cohort in Sakoli to a comprehensive digital platform shaping hundreds of careers.</p>
          </div>

          <div className="timeline-wrapper">
            {timeline.map((item, idx) => (
              <div key={idx} className="timeline-node">
                <div className="timeline-marker">
                  <span className="marker-dot"></span>
                </div>
                <div className="timeline-content glass-panel">
                  <span className="timeline-year">{item.year}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-page-root {
          padding-top: 40px;
        }
        .about-intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        @media (max-width: 768px) {
          .about-intro-grid { grid-template-columns: 1fr; }
        }
        .about-card {
          padding: 32px;
        }
        .about-card h3 {
          margin-bottom: 14px;
          color: var(--primary-hover);
        }
        .positioning-highlights {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .pos-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-light);
        }
        .vm-card {
          padding: 36px;
        }
        .vm-icon {
          width: 58px;
          height: 58px;
          border-radius: var(--radius-md);
          background: rgba(14, 165, 233, 0.12);
          color: var(--primary-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .vm-statement {
          font-size: 1.15rem;
          color: #ffffff;
          font-weight: 600;
          margin: 12px 0 16px 0;
          line-height: 1.5;
        }
        .mission-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .mission-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }

        /* Timeline */
        .timeline-wrapper {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          padding-left: 30px;
          border-left: 2px solid rgba(14, 165, 233, 0.3);
        }
        .timeline-node {
          position: relative;
          margin-bottom: 36px;
        }
        .timeline-marker {
          position: absolute;
          left: -39px;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg-main);
          border: 3px solid var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }
        .timeline-content {
          padding: 24px;
        }
        .timeline-year {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-hover);
          background: rgba(14, 165, 233, 0.1);
          padding: 2px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
        }
        .timeline-content h4 {
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
