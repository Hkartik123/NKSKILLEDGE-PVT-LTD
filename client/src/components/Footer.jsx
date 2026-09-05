import React from 'react';
import { 
  MapPin, Phone, Mail, MessageSquare, ShieldCheck, 
  ExternalLink, ChevronRight, Award 
} from 'lucide-react';

export default function Footer({ siteSettings, branches = [], onOpenRegister }) {
  const stats = siteSettings?.stats || {
    studentsTrained: '200+',
    studentsPlaced: '50+',
    activeProjects: '15+',
    happyClients: '30+'
  };

  const phones = siteSettings?.phones || ['7498784109', '9356049629'];
  const email = siteSettings?.email || 'hmendhe72@gmail.com';
  const logoUrl = siteSettings?.logo || 'https://i.ibb.co/1fbFtjTr/Untitled-design-removebg-preview.png';
  const brandLine = siteSettings?.brandLine || 'One Company — Many Solutions — Unlimited Possibilities';

  // Fallback branches if not yet fetched from API
  const displayBranches = branches.length > 0 ? branches : [
    {
      _id: 'branch_sakoli',
      name: 'Main Branch — Head Office',
      address: 'Near Gobade Hospital, Sakoli, Dist. Bhandara, Maharashtra – 441802',
      isMainBranch: true,
      phone: '+91 7498784109'
    },
    {
      _id: 'branch_nagpur',
      name: '2nd Branch — Nagpur',
      address: 'Plot No. 9, Naik Nagar, Near NIT Garden, Nagpur, Maharashtra – 440009',
      isMainBranch: false,
      phone: '+91 9356049629'
    },
    {
      _id: 'branch_gondia',
      name: '3rd Branch — Gondia',
      address: 'IBM Center, GP Gondia Campus, Government Polytechnic Gondia, Gondia, Maharashtra – 441601',
      isMainBranch: false,
      phone: '+91 7498784109'
    }
  ];

  return (
    <footer className="footer-root">
      {/* Brand Line Ribbon */}
      <div className="brand-line-banner">
        <span>{brandLine}</span>
      </div>

      {/* Top Banner / Dynamic Stats Ribbon */}
      <div className="footer-stats-bar">
        <div className="container stats-bar-grid">
          <div className="stats-bar-item">
            <span className="stats-num">{stats.studentsTrained}</span>
            <span className="stats-lbl">Engineers & Trainees Shaped</span>
          </div>
          <div className="stats-bar-item">
            <span className="stats-num">{stats.studentsPlaced}</span>
            <span className="stats-lbl">Industry Placements</span>
          </div>
          <div className="stats-bar-item">
            <span className="stats-num">{stats.activeProjects}</span>
            <span className="stats-lbl">Active Client Deployments</span>
          </div>
          <div className="stats-bar-item">
            <span className="stats-num">{stats.happyClients}</span>
            <span className="stats-lbl">Corporate & MSME Partners</span>
          </div>
        </div>
      </div>

      <div className="container footer-main-content">
        <div className="footer-columns-grid">
          {/* Column 1: Company Profile */}
          <div className="footer-col brand-col">
            <div className="brand-logo" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={logoUrl} 
                alt="NK SkillEdge Pvt. Ltd. Official Logo" 
                className="footer-logo-img"
                loading="lazy"
              />
              <div className="brand-text">
                <span className="brand-name" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>NK SkillEdge</span>
                <span className="brand-tagline" style={{ fontSize: '0.72rem', color: 'var(--primary-hover)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>Shaping Skills, Building Futures</span>
              </div>
            </div>
            <p className="footer-description">
              Empowering students through practical engineering, live project exposure, and real-world software development while architecting modern digital solutions for businesses.
            </p>
            
            <div className="footer-accreditations">
              <span className="cert-pill"><Award size={14} /> ISO 9001:2015</span>
              <span className="cert-pill"><ShieldCheck size={14} /> MSME Registered</span>
              <span className="cert-pill"><Award size={14} /> Govt Approved</span>
              <span className="cert-pill"><ShieldCheck size={14} /> GST Compliant</span>
            </div>
          </div>

          {/* Column 2: Training & Programs */}
          <div className="footer-col">
            <h4 className="footer-heading">Training Programs</h4>
            <ul className="footer-links-list">
              <li><a href="#programs"><ChevronRight size={13} /> Industrial Training</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> Coding Classes (C/C++/Java/Python)</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> Full Stack Web (MERN)</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> Cyber Security Training</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> Mobile App (Flutter)</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> AI & Machine Learning</a></li>
              <li><a href="#programs"><ChevronRight size={13} /> Internet of Things (IoT)</a></li>
              <li><a href="#internships"><ChevronRight size={13} /> Semester Internships</a></li>
            </ul>
          </div>

          {/* Column 3: Business Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Digital Services</h4>
            <ul className="footer-links-list">
              <li><a href="#services"><ChevronRight size={13} /> Software Development</a></li>
              <li><a href="#services"><ChevronRight size={13} /> Website Solutions</a></li>
              <li><a href="#services"><ChevronRight size={13} /> Digital Marketing</a></li>
              <li><a href="#services"><ChevronRight size={13} /> Graphic Designing</a></li>
              <li><a href="#services"><ChevronRight size={13} /> IT Support & Maintenance</a></li>
              <li><a href="#services"><ChevronRight size={13} /> Tech Consultancy</a></li>
              <li><a href="#projects"><ChevronRight size={13} /> Case Studies & Portfolios</a></li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links-list">
              <li><a href="#about"><ChevronRight size={13} /> About Company</a></li>
              <li><a href="#leadership"><ChevronRight size={13} /> Leadership Team</a></li>
              <li><a href="#success-stories"><ChevronRight size={13} /> Student Placements</a></li>
              <li><a href="#verify"><ChevronRight size={13} /> Verify Certificate</a></li>
              <li><a href="#events"><ChevronRight size={13} /> Workshops & Events</a></li>
              <li><a href="#careers"><ChevronRight size={13} /> Careers (We're Hiring)</a></li>
              <li><a href="#faqs"><ChevronRight size={13} /> Student FAQs</a></li>
            </ul>
          </div>

          {/* Column 5: All 3 Office Locations (Track 1 Requirement 5) */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Our Office Locations</h4>
            <div className="footer-contact-items">
              {displayBranches.map((b) => (
                <div key={b._id} className={`footer-branch-item ${b.isMainBranch ? 'main-branch-highlight' : ''}`} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <MapPin size={15} className="text-cyan" />
                    <strong style={{ fontSize: '0.85rem', color: b.isMainBranch ? 'var(--primary-hover)' : 'var(--text-primary)' }}>
                      {b.name} {b.isMainBranch && '(Head Office)'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', lineHeight: '1.4' }}>
                    {b.address}
                  </span>
                  {b.phone && (
                    <a href={`tel:${b.phone.replace(/[^0-9]/g, '')}`} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Phone size={11} /> {b.phone}
                    </a>
                  )}
                </div>
              ))}

              <div className="contact-item" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <Mail size={15} className="contact-icon" />
                <a href={`mailto:${email}`} style={{ fontSize: '0.82rem' }}>{email}</a>
              </div>
            </div>

            <div className="footer-whatsapp-cta" style={{ marginTop: '14px' }}>
              <a 
                href={`https://wa.me/91${phones[0]}?text=Hello%20NK%20SkillEdge,%20I%20would%20like%20to%20inquire%20about%20your%20programs.`}
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-emerald btn-sm"
                style={{ width: '100%' }}
              >
                <MessageSquare size={16} />
                <span>WhatsApp Instant Inquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © {new Date().getFullYear()} <strong>NK SkillEdge Pvt. Ltd.</strong> All rights reserved. Registered under MSME & ISO Quality Framework.
          </div>
          <div className="legal-links">
            <a href="#legal">Privacy Policy</a>
            <span>•</span>
            <a href="#legal">Terms & Conditions</a>
            <span>•</span>
            <a href="#legal">Refund Policy</a>
            <span>•</span>
            <a href="#legal">Training Agreement</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background: #04070d;
          border-top: 1px solid var(--border-subtle);
          position: relative;
        }
        .footer-logo-img {
          height: 48px;
          width: auto;
          max-width: 56px;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(14, 165, 233, 0.35));
        }
        .footer-stats-bar {
          background: rgba(14, 165, 233, 0.04);
          border-bottom: 1px solid var(--border-subtle);
          padding: 30px 0;
        }
        .stats-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .stats-bar-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }
        .stats-bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stats-num {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary-hover);
          line-height: 1.1;
        }
        .stats-lbl {
          font-size: 0.84rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .footer-main-content {
          padding-top: 60px;
          padding-bottom: 30px;
        }
        .footer-columns-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr 2fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        @media (max-width: 1024px) {
          .footer-columns-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .footer-columns-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .footer-description {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .footer-accreditations {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .cert-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-light);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .footer-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 2px;
          background: var(--primary);
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-list a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .footer-links-list a:hover {
          color: var(--primary-hover);
          transform: translateX(4px);
        }
        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .contact-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .phone-group {
          display: flex;
          flex-direction: column;
        }
        .phone-group a:hover, .contact-item a:hover {
          color: var(--primary-hover);
        }
        .footer-bottom-bar {
          border-top: 1px solid var(--border-subtle);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 16px;
        }
        .legal-links {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .legal-links a:hover {
          color: var(--text-light);
        }
      `}</style>
    </footer>
  );
}
