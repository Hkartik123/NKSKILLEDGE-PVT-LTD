import React, { useState, useEffect } from 'react';
import {
  Menu, X, Search, ChevronDown, ArrowRight, ShieldCheck, UserCheck
} from 'lucide-react';

export default function Navbar({ onOpenSearch, onOpenRegister, siteSettings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const logoUrl = siteSettings?.logo || 'https://i.ibb.co/1fbFtjTr/Untitled-design-removebg-preview.png';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    const handleOutsideClick = (event) => {
      const drawer = document.getElementById('mobile-navigation-panel');
      const trigger = document.querySelector('.mobile-toggle-btn');

      if (mobileMenuOpen && drawer && !drawer.contains(event.target) && !(trigger && trigger.contains(event.target))) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (name) => {
    setActiveDropdown((current) => (current === name ? null : name));
  };

  const navItemClick = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          <a href="#home" className="brand-logo" onClick={navItemClick} aria-label="NK SkillEdge Pvt. Ltd. Home">
            <img
              src={logoUrl}
              alt="NK SkillEdge Pvt. Ltd. Official Logo"
              className="brand-logo-img"
              loading="eager"
            />
            <div className="brand-text">
              <span className="brand-name">NK SkillEdge</span>
              <span className="brand-tagline">Shaping Skills, Building Futures</span>
            </div>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#home" className="nav-link">Home</a>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button type="button" className="nav-link dropdown-toggle" onClick={() => toggleDropdown('about')}>
                About Us <ChevronDown size={14} className={`chevron ${activeDropdown === 'about' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'about' && (
                <div className="dropdown-menu">
                  <a href="#about" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Our Story & Journey</span><span className="dropdown-desc">Mission, vision, and expansion roadmap</span></a>
                  <a href="#leadership" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Executive Leadership</span><span className="dropdown-desc">Meet CEO & Director profiles</span></a>
                  <a href="#team" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Technical Mentors & Team</span><span className="dropdown-desc">Engineers & industry practitioners</span></a>
                  <a href="#certifications" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Accreditations & Badges</span><span className="dropdown-desc">MSME, ISO 9001:2015, Govt & GST</span></a>
                </div>
              )}
            </div>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button type="button" className="nav-link dropdown-toggle" onClick={() => toggleDropdown('services')}>
                Services <ChevronDown size={14} className={`chevron ${activeDropdown === 'services' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'services' && (
                <div className="dropdown-menu">
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Software Development</span><span className="dropdown-desc">Web, Android, Desktop & Enterprise Apps</span></a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Website Solutions</span><span className="dropdown-desc">Business portals, e-commerce & dynamic sites</span></a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Digital Marketing</span><span className="dropdown-desc">SEO, social ads & Google growth campaigns</span></a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Graphic Designing</span><span className="dropdown-desc">CorelDRAW, Photoshop & vector branding</span></a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">IT Support & Maintenance</span><span className="dropdown-desc">Hardware, LAN Wi-Fi & Annual AMC Plans</span></a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Consultancy & Strategy</span><span className="dropdown-desc">Startup roadmaps & cloud architectures</span></a>
                </div>
              )}
            </div>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('training')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button type="button" className="nav-link dropdown-toggle" onClick={() => toggleDropdown('training')}>
                Training & Programs <ChevronDown size={14} className={`chevron ${activeDropdown === 'training' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'training' && (
                <div className="dropdown-menu">
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Industrial Training Program</span><span className="dropdown-desc">1-6 Mos live project apprenticeship</span></a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Coding Classes (C, C++, Java, Python)</span><span className="dropdown-desc">Data Structures, algorithms & problem solving</span></a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Full Stack Web (MERN)</span><span className="dropdown-desc">React, Node, Express & MongoDB cloud apps</span></a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Cyber Security Training</span><span className="dropdown-desc">Ethical hacking, network security & labs</span></a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Mobile App Development</span><span className="dropdown-desc">Flutter & Dart cross-platform engineering</span></a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">AI & Machine Learning / IoT</span><span className="dropdown-desc">Python data intelligence & hardware labs</span></a>
                </div>
              )}
            </div>

            <a href="#projects" className="nav-link">Projects</a>

            <div
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('student-corner')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button type="button" className="nav-link dropdown-toggle" onClick={() => toggleDropdown('student-corner')}>
                Student Corner <ChevronDown size={14} className={`chevron ${activeDropdown === 'student-corner' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'student-corner' && (
                <div className="dropdown-menu">
                  <a href="#success-stories" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Placements & Success Stories</span><span className="dropdown-desc">50+ students placed in technology firms</span></a>
                  <a href="#verify" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Verify Certificate</span><span className="dropdown-desc">Authenticate official student credential ID</span></a>
                  <a href="#internships" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">College Internships</span><span className="dropdown-desc">Apply for academic semester projects</span></a>
                  <a href="#events" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Workshops & Events</span><span className="dropdown-desc">Upcoming weekend technical bootcamps</span></a>
                  <a href="#careers" className="dropdown-item" onClick={navItemClick}><span className="dropdown-title">Careers at NK SkillEdge</span><span className="dropdown-desc">Openings for mentors & developers</span></a>
                </div>
              )}
            </div>

            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          <div className="nav-actions">
            <button
              className="nav-icon-btn"
              onClick={onOpenSearch}
              aria-label="Global Search"
              title="Global Search (Ctrl+K)"
              type="button"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm nav-cta-btn"
              onClick={() => onOpenRegister(null)}
            >
              <span>Apply / Register</span>
              <ArrowRight size={15} />
            </button>

            <a href="#admin" className="admin-link-btn" title="Admin Portal" aria-label="Admin Portal">
              <UserCheck size={16} />
            </a>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-panel"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`mobile-menu-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <aside
          id="mobile-navigation-panel"
          className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="mobile-drawer-inner">
            <div className="mobile-brand-row">
              <img src={logoUrl} alt="NK SkillEdge Pvt. Ltd. Official Logo" className="brand-logo-img-mobile" />
              <div className="brand-text">
                <span className="brand-name">NK SkillEdge</span>
                <span className="brand-tagline">Shaping Skills, Building Futures</span>
              </div>
            </div>

            <a href="#home" className="mobile-link" onClick={navItemClick}>Home</a>
            <a href="#about" className="mobile-link" onClick={navItemClick}>About Us & Journey</a>
            <a href="#leadership" className="mobile-link" onClick={navItemClick}>Leadership & Team</a>
            <a href="#services" className="mobile-link" onClick={navItemClick}>Business Services</a>
            <a href="#programs" className="mobile-link" onClick={navItemClick}>Training Programs</a>
            <a href="#projects" className="mobile-link" onClick={navItemClick}>Featured Projects</a>
            <a href="#success-stories" className="mobile-link" onClick={navItemClick}>Student Placements</a>
            <a href="#verify" className="mobile-link" onClick={navItemClick}><ShieldCheck size={17} /> Verify Certificate</a>
            <a href="#internships" className="mobile-link" onClick={navItemClick}>Internship Portal</a>
            <a href="#events" className="mobile-link" onClick={navItemClick}>Workshops & Events</a>
            <a href="#careers" className="mobile-link" onClick={navItemClick}>Careers / Work With Us</a>
            <a href="#contact" className="mobile-link" onClick={navItemClick}>Contact & 3 Office Branches</a>
            <a href="#admin" className="mobile-link" onClick={navItemClick}>Staff Admin Portal</a>

            <div className="mobile-drawer-cta">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister(null);
                }}
              >
                Apply for Training
              </button>
            </div>
          </div>
        </aside>
      </header>

      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
          transition: all 0.25s ease;
          background: rgba(6, 9, 17, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .navbar-scrolled {
          background: rgba(6, 9, 17, 0.96);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
          border-bottom-color: var(--border-light);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          gap: 16px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          min-width: 0;
        }
        .brand-logo-img {
          height: 48px;
          width: auto;
          max-width: 56px;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(14, 165, 233, 0.35));
          transition: transform 0.2s ease;
        }
        .brand-logo:hover .brand-logo-img {
          transform: scale(1.05);
        }
        .brand-logo-img-mobile {
          height: 44px;
          width: auto;
          max-width: 52px;
          object-fit: contain;
        }
        .mobile-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .brand-tagline {
          font-size: 0.72rem;
          color: var(--primary-hover);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .nav-link {
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 0;
          cursor: pointer;
          background: transparent;
          border: none;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .dropdown-toggle {
          font-family: inherit;
        }
        .chevron {
          transition: transform 0.2s ease;
        }
        .chevron.rotate {
          transform: rotate(180deg);
        }
        .nav-item-dropdown {
          position: relative;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: -14px;
          width: min(300px, 70vw);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 10px;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.2s ease;
          z-index: 950;
        }
        .dropdown-item {
          display: block;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }
        .dropdown-item:hover {
          background: rgba(14, 165, 233, 0.12);
        }
        .dropdown-title {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .dropdown-desc {
          display: block;
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .nav-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-icon-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--border-light);
        }
        .admin-link-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-link-btn:hover {
          color: var(--primary-hover);
          border-color: var(--primary);
        }
        .mobile-toggle-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          color: var(--text-primary);
          cursor: pointer;
        }
        .mobile-menu-backdrop {
          position: fixed;
          inset: 80px 0 0 0;
          background: rgba(2, 6, 23, 0.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          z-index: 890;
        }
        .mobile-menu-backdrop.is-open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-drawer {
          position: fixed;
          top: 80px;
          right: 0;
          bottom: 0;
          width: min(420px, 100vw);
          background: rgba(6, 9, 17, 0.98);
          border-left: 1px solid var(--border-subtle);
          box-shadow: -30px 0 60px rgba(2, 6, 23, 0.3);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transform: translateX(102%);
          transition: transform 0.28s ease;
          z-index: 920;
          overflow-y: auto;
          padding: 24px 20px 32px;
        }
        .mobile-drawer.is-open {
          transform: translateX(0);
        }
        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mobile-link {
          font-size: 1.02rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 10px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mobile-drawer-cta {
          margin-top: 22px;
        }
        @media (max-width: 1080px) {
          .desktop-nav { display: none; }
          .mobile-toggle-btn { display: flex; }
          .nav-cta-btn { display: none; }
        }
        @media (max-width: 640px) {
          .navbar-container { height: 72px; }
          .brand-name { font-size: 1.05rem; }
          .brand-tagline { font-size: 0.62rem; }
          .mobile-drawer { top: 72px; }
          .mobile-menu-backdrop { inset: 72px 0 0 0; }
          .mobile-drawer-inner { gap: 10px; }
          .mobile-link { font-size: 0.98rem; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

