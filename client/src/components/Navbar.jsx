import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, ChevronDown, Award, Briefcase, GraduationCap, 
  Code, PhoneCall, ArrowRight, ShieldCheck, Sparkles, UserCheck,
  Sun, Moon, Laptop, Globe, TrendingUp, Palette, Wrench, Terminal, Lock
} from 'lucide-react';

export default function Navbar({ onOpenSearch, onOpenRegister, siteSettings, theme = 'light', themePreference = 'system', onThemeChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={15} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={15} /> },
    { value: 'system', label: 'System Default', icon: <Laptop size={15} /> }
  ];

  const logoUrl = siteSettings?.logo || "https://i.ibb.co/1fbFtjTr/Untitled-design-removebg-preview.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navItemClick = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo with Official Company Logo */}
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

          {/* Desktop Navigation - 6 Top-Priority Items (Track 1 Requirement 4) */}
          <nav className="desktop-nav">
            <a href="#home" className="nav-link">Home</a>

            {/* 1. About Dropdown */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown('about')}>
                About Us <ChevronDown size={14} className={`chevron ${activeDropdown === 'about' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'about' && (
                <div className="dropdown-menu">
                  <a href="#about" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Our Story & Journey</span>
                      <span className="dropdown-desc">Mission, vision, and expansion roadmap</span>
                    </div>
                  </a>
                  <a href="#leadership" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Executive Leadership</span>
                      <span className="dropdown-desc">Meet CEO & Director profiles</span>
                    </div>
                  </a>
                  <a href="#team" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Technical Mentors & Team</span>
                      <span className="dropdown-desc">Engineers & industry practitioners</span>
                    </div>
                  </a>
                  <a href="#certifications" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Accreditations & Badges</span>
                      <span className="dropdown-desc">MSME, ISO 9001:2015, Govt & GST</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 2. Services Dropdown */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown('services')}>
                Services <ChevronDown size={14} className={`chevron ${activeDropdown === 'services' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'services' && (
                <div className="dropdown-menu">
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Software Development</span>
                      <span className="dropdown-desc">Web, Android, Desktop & Enterprise Apps</span>
                    </div>
                  </a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Website Solutions</span>
                      <span className="dropdown-desc">Business portals, e-commerce & dynamic sites</span>
                    </div>
                  </a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Digital Marketing</span>
                      <span className="dropdown-desc">SEO, social ads & Google growth campaigns</span>
                    </div>
                  </a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Graphic Designing</span>
                      <span className="dropdown-desc">CorelDRAW, Photoshop & vector branding</span>
                    </div>
                  </a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">IT Support & Maintenance</span>
                      <span className="dropdown-desc">Hardware, LAN Wi-Fi & Annual AMC Plans</span>
                    </div>
                  </a>
                  <a href="#services" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Consultancy & Strategy</span>
                      <span className="dropdown-desc">Startup roadmaps & cloud architectures</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 3. Training & Programs Dropdown */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('training')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown('training')}>
                Training & Programs <ChevronDown size={14} className={`chevron ${activeDropdown === 'training' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'training' && (
                <div className="dropdown-menu">
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Industrial Training Program</span>
                      <span className="dropdown-desc">1-6 Mos live project apprenticeship</span>
                    </div>
                  </a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Coding Classes (C, C++, Java, Python)</span>
                      <span className="dropdown-desc">Data Structures, algorithms & problem solving</span>
                    </div>
                  </a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Full Stack Web (MERN)</span>
                      <span className="dropdown-desc">React, Node, Express & MongoDB cloud apps</span>
                    </div>
                  </a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Cyber Security Training</span>
                      <span className="dropdown-desc">Ethical hacking, network security & labs</span>
                    </div>
                  </a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Mobile App Development</span>
                      <span className="dropdown-desc">Flutter & Dart cross-platform engineering</span>
                    </div>
                  </a>
                  <a href="#programs" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">AI & Machine Learning / IoT</span>
                      <span className="dropdown-desc">Python data intelligence & hardware labs</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 4. Projects */}
            <a href="#projects" className="nav-link">Projects</a>

            {/* 5. Placements & Verify in Dropdown (Track 1 Requirement 4) */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setActiveDropdown('student-corner')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown('student-corner')}>
                Student Corner <ChevronDown size={14} className={`chevron ${activeDropdown === 'student-corner' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'student-corner' && (
                <div className="dropdown-menu">
                  <a href="#success-stories" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Placements & Success Stories</span>
                      <span className="dropdown-desc">50+ students placed in technology firms</span>
                    </div>
                  </a>
                  <a href="#verify" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Verify Certificate</span>
                      <span className="dropdown-desc">Authenticate official student credential ID</span>
                    </div>
                  </a>
                  <a href="#internships" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">College Internships</span>
                      <span className="dropdown-desc">Apply for academic semester projects</span>
                    </div>
                  </a>
                  <a href="#events" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Workshops & Events</span>
                      <span className="dropdown-desc">Upcoming weekend technical bootcamps</span>
                    </div>
                  </a>
                  <a href="#careers" className="dropdown-item" onClick={navItemClick}>
                    <div className="dropdown-item-content">
                      <span className="dropdown-title">Careers at NK SkillEdge</span>
                      <span className="dropdown-desc">Openings for mentors & developers</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 6. Contact */}
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            <div className="theme-selector-wrap">
              <button 
                className="theme-toggle-btn" 
                onClick={() => setThemeMenuOpen((open) => !open)}
                aria-label="Theme settings"
                title="Theme settings"
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <span className="theme-toggle-label">
                  {themePreference === 'system' ? 'System' : themePreference}
                </span>
              </button>

              {themeMenuOpen && (
                <div className="theme-menu" role="menu" aria-label="Theme options">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`theme-menu-item ${themePreference === option.value ? 'active' : ''}`}
                      onClick={() => {
                        onThemeChange(option.value);
                        setThemeMenuOpen(false);
                      }}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Search */}
            <button 
              className="nav-icon-btn" 
              onClick={onOpenSearch} 
              aria-label="Global Search"
              title="Global Search (Ctrl+K)"
            >
              <Search size={18} />
            </button>

            {/* Single Accent Button: Primary CTA */}
            <button 
              className="btn btn-primary btn-sm nav-cta-btn"
              onClick={() => onOpenRegister(null)}
            >
              <span>Apply / Register</span>
              <ArrowRight size={15} />
            </button>

            {/* Staff Admin Link */}
            <a href="#admin" className="admin-link-btn" title="Admin Portal">
              <UserCheck size={16} />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-inner">
              <div className="mobile-brand-row">
                <img 
                  src={logoUrl} 
                  alt="NK SkillEdge Pvt. Ltd. Official Logo" 
                  className="brand-logo-img-mobile"
                />
                <div className="brand-text">
                  <span className="brand-name">NK SkillEdge</span>
                  <span className="brand-tagline">Shaping Skills, Building Futures</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0 14px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Theme Mode</span>
                <div className="theme-selector-wrap mobile-theme-wrap">
                  <button 
                    className="theme-toggle-btn" 
                    onClick={() => setThemeMenuOpen((open) => !open)}
                    aria-label="Theme settings"
                  >
                    {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
                  </button>
                  {themeMenuOpen && (
                    <div className="theme-menu" role="menu" aria-label="Theme options mobile">
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`theme-menu-item ${themePreference === option.value ? 'active' : ''}`}
                          onClick={() => {
                            onThemeChange(option.value);
                            setThemeMenuOpen(false);
                          }}
                        >
                          {option.icon}
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <a href="#home" className="mobile-link" onClick={navItemClick}>Home</a>
              <a href="#about" className="mobile-link" onClick={navItemClick}>About Us & Journey</a>
              <a href="#leadership" className="mobile-link" onClick={navItemClick}>Leadership & Team</a>
              <a href="#services" className="mobile-link" onClick={navItemClick}>Business Services</a>
              <a href="#programs" className="mobile-link" onClick={navItemClick}>Training Programs</a>
              <a href="#projects" className="mobile-link" onClick={navItemClick}>Featured Projects</a>
              <a href="#success-stories" className="mobile-link" onClick={navItemClick}>Student Placements</a>
              <a href="#verify" className="mobile-link" onClick={navItemClick}>
                <ShieldCheck size={17} /> Verify Certificate
              </a>
              <a href="#internships" className="mobile-link" onClick={navItemClick}>Internship Portal</a>
              <a href="#events" className="mobile-link" onClick={navItemClick}>Workshops & Events</a>
              <a href="#careers" className="mobile-link" onClick={navItemClick}>Careers / Work With Us</a>
              <a href="#contact" className="mobile-link" onClick={navItemClick}>Contact & 3 Office Branches</a>
              <a href="#admin" className="mobile-link" onClick={navItemClick}>Staff Admin Portal</a>

              <div className="mobile-drawer-cta">
                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%' }}
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(null); }}
                >
                  Apply for Training
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Embedded Component Styles */}
      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
          transition: all 0.3s ease;
          background: rgba(6, 9, 17, 0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .navbar-scrolled {
          background: rgba(6, 9, 17, 0.95);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid var(--border-light);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
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
          object-fit: contain;
        }
        .mobile-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.2rem;
          color: #ffffff;
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
        @media (max-width: 1080px) {
          .desktop-nav { display: none; }
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
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .nav-highlight {
          color: var(--primary-hover);
          font-weight: 600;
        }
        .dropdown-toggle {
          background: none;
          border: none;
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
          top: 100%;
          left: -10px;
          width: 300px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 10px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
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
        .theme-selector-wrap {
          position: relative;
        }
        .theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 42px;
          height: 38px;
          padding: 0 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.76rem;
          font-weight: 600;
        }
        .theme-toggle-btn:hover {
          background: rgba(14, 165, 233, 0.12);
          border-color: var(--border-primary);
        }
        .theme-toggle-label {
          text-transform: capitalize;
          letter-spacing: 0.02em;
        }
        .theme-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 190px;
          padding: 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          background: var(--bg-surface-elevated);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 1000;
        }
        .theme-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          cursor: pointer;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .theme-menu-item:hover,
        .theme-menu-item.active {
          background: rgba(14, 165, 233, 0.12);
          border-color: rgba(14, 165, 233, 0.35);
        }
        .mobile-theme-wrap {
          position: static;
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
          color: #ffffff;
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
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }
        @media (max-width: 1080px) {
          .mobile-toggle-btn { display: flex; align-items: center; }
          .nav-cta-btn { display: none; }
        }
        .mobile-drawer {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(6, 9, 17, 0.98);
          backdrop-filter: blur(20px);
          overflow-y: auto;
          padding: 24px;
          border-top: 1px solid var(--border-subtle);
        }
        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mobile-link {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mobile-link.highlight-link {
          color: var(--primary-hover);
        }
        .mobile-drawer-cta {
          margin-top: 24px;
        }
      `}</style>
    </>
  );
}
