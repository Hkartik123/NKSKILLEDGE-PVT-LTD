import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, Award, BookOpen, Laptop, 
  Smartphone, Cpu, Compass, Share2, ShieldCheck, Sparkles, 
  ExternalLink, Calendar, Star, ChevronRight, MessageSquare, PhoneCall, 
  Target, Rocket, CheckCheck, Clock, MapPin, Send
} from 'lucide-react';

export default function Home({ 
  siteSettings, 
  services = [], 
  programs = [], 
  projects = [], 
  leadership = [], 
  team = [], 
  testimonials = [], 
  successStories = [], 
  certifications = [], 
  clients = [], 
  blogs = [], 
  events = [], 
  faqs = [], 
  branches = [],
  onOpenRegister,
  onOpenQuote
}) {
  const stats = siteSettings?.stats || {
    studentsTrained: '200+',
    studentsPlaced: '50+',
    activeProjects: '15+',
    happyClients: '30+',
    projectsCompleted: '50+',
    upcomingProjects: '10+'
  };

  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [selectedDetailEntity, setSelectedDetailEntity] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // Fallback branches if not yet loaded from backend
  const displayBranches = branches || [];

  // Fallback handler for external image load errors
  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    e.target.src = fallbackSrc || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80';
  };

  // Contact Form State
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: 'Student',
    serviceOrCourse: 'Industrial Training Program',
    message: '',
    city: 'Sakoli'
  });
  const [leadSending, setLeadSending] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadSending(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm)
      });
      const data = await res.json();
      if (data.success) {
        setLeadSuccess(true);
        setLeadForm({
          fullName: '',
          email: '',
          phone: '',
          userType: 'Student',
          serviceOrCourse: 'Industrial Training Program',
          message: '',
          city: 'Sakoli'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSending(false);
    }
  };

  const filteredProjects = activeProjectFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category?.toLowerCase() === activeProjectFilter.toLowerCase());

  const activeSuccessStories = Array.isArray(successStories)
    ? [...successStories]
        .filter(story => !(story.isActive === false || story.status === 'Inactive' || story.status === 'inactive'))
        .sort((a, b) => Number(a.display_order ?? a.order ?? 9999) - Number(b.display_order ?? b.order ?? 9999))
    : [];

  const activeTestimonials = Array.isArray(testimonials)
    ? [...testimonials]
        .filter(t => !(t.isActive === false || t.status === 'Inactive' || t.status === 'inactive'))
        .sort((a, b) => Number(a.display_order ?? a.order ?? 9999) - Number(b.display_order ?? b.order ?? 9999))
    : [];

  return (
    <div className="home-page-root" id="home">
      {/* Background Ambient Glow Orbs */}
      <div className="glow-orb glow-orb-cyan" style={{ top: '5%', left: '10%' }}></div>
      <div className="glow-orb glow-orb-blue" style={{ top: '25%', right: '5%' }}></div>
      <div className="glow-orb glow-orb-purple" style={{ top: '60%', left: '15%' }}></div>

      {/* =========================================================================
          SECTION 1: HERO SECTION (PRD Section 7 & Section 8.1)
          ========================================================================= */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} />
              <span>{siteSettings?.hero?.badgeText || 'Government Recognized & ISO 9001:2015 Certified Center'}</span>
            </div>

            <h1 className="hero-title">
              {siteSettings?.hero?.title ? (
                siteSettings.hero.title.includes(',') ? (
                  <>
                    {siteSettings.hero.title.split(',')[0]}, <br />
                    <span className="gradient-text">{siteSettings.hero.title.split(',').slice(1).join(',')}</span>
                  </>
                ) : (
                  <span className="gradient-text">{siteSettings.hero.title}</span>
                )
              ) : (
                <>
                  Shaping Skills, <br />
                  <span className="gradient-text">Building Futures.</span>
                </>
              )}
            </h1>

            <p className="hero-brand-line" style={{ color: 'var(--primary-hover)', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {siteSettings?.hero?.brandLine || siteSettings?.brandLine || 'One Company — Many Solutions — Unlimited Possibilities'}
            </p>

            <p className="hero-statement">
              {siteSettings?.hero?.description || 'Empowering students through practical training, industry exposure and real-world learning, while architecting modern digital solutions for businesses and startups.'}
            </p>

            <div className="hero-cta-group">
              <a href={siteSettings?.hero?.ctaPrimaryLink || '#programs'} className="btn btn-primary btn-lg">
                <span>{siteSettings?.hero?.ctaPrimaryText || 'Explore Programs'}</span>
                <ArrowRight size={18} />
              </a>

              <a href={siteSettings?.hero?.ctaSecondaryLink || '#contact'} className="btn btn-secondary btn-lg">
                <span>{siteSettings?.hero?.ctaSecondaryText || 'Get a Business Consultation'}</span>
              </a>

              <button 
                onClick={() => onOpenRegister(null)} 
                className="btn btn-outline btn-lg"
              >
                {siteSettings?.hero?.applyBtnText || 'Apply Now'}
              </button>
            </div>

            {/* Quick Micro-Trust Signals */}
            <div className="hero-trust-signals">
              {(siteSettings?.hero?.trustSignals || [
                'Sakoli Hardware & Tech Lab',
                'Live Client Software Projects',
                '100% Verifiable Credentials'
              ]).map((sig, idx) => (
                <div key={idx} className="trust-item">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-main-card glass-panel">
                <div className="card-header-bar">
                  <div className="traffic-lights">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="card-tag">NK SkillEdge • Terminal</span>
                </div>
                <div className="terminal-code">
                  <p className="code-line"><span className="code-keyword">const</span> <span className="code-var">candidate</span> = <span className="code-keyword">await</span> SkillEdge.<span className="code-func">enroll</span>(&#123;</p>
                  <p className="code-line indent"><span className="code-key">domain</span>: <span className="code-str">"Full Stack / AI / IoT"</span>,</p>
                  <p className="code-line indent"><span className="code-key">mode</span>: <span className="code-str">"Live Industry Execution"</span>,</p>
                  <p className="code-line indent"><span className="code-key">outcome</span>: <span className="code-str">"Employment-Ready Engineer"</span></p>
                  <p className="code-line">&#125;);</p>
                  <p className="code-line code-comment">// Output: 50+ Placements & 200+ Trained Trainees</p>
                </div>
              </div>

              <div className="hero-float-badge float-badge-left animate-float">
                <Award size={20} className="text-cyan" />
                <div>
                  <strong>MSME & ISO Certified</strong>
                  <span>Govt Approved Quality</span>
                </div>
              </div>

              <div className="hero-float-badge float-badge-right animate-float" style={{ animationDelay: '2s' }}>
                <Rocket size={20} className="text-amber" />
                <div>
                  <strong>{stats.studentsPlaced} Placements</strong>
                  <span>Partner IT Firms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 & 3: COMPANY OVERVIEW & DYNAMIC KEY STATS (PRD Section 8.2 & 8.3)
          ========================================================================= */}
      <section className="section overview-section" id="about-preview">
        <div className="container">
          <div className="glass-panel stats-card-banner">
            <div className="stats-banner-heading">
              <span className="badge badge-cyan">Dynamic Performance Metrics</span>
              <h3>Measurable Impact Driven by NK SkillEdge</h3>
              <p>Numbers sourced directly from our live training and client project registry in Sakoli.</p>
            </div>

            <div className="stats-six-grid">
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.studentsTrained}</span>
                <span className="stat-label">Students Trained</span>
                <span className="stat-sub">Hands-on engineering cohorts</span>
              </div>
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.studentsPlaced}</span>
                <span className="stat-label">Students Placed</span>
                <span className="stat-sub">IT & software development roles</span>
              </div>
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.activeProjects}</span>
                <span className="stat-label">Active Projects</span>
                <span className="stat-sub">Live client & IoT deployments</span>
              </div>
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.happyClients}</span>
                <span className="stat-label">Happy Clients</span>
                <span className="stat-sub">MSMEs, institutions & startups</span>
              </div>
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.projectsCompleted}</span>
                <span className="stat-label">Projects Completed</span>
                <span className="stat-sub">Production web, mobile & cloud apps</span>
              </div>
              <div className="stat-box">
                <span className="stat-number gradient-text-cyan">{stats.upcomingProjects}</span>
                <span className="stat-label">Upcoming Initiatives</span>
                <span className="stat-sub">AI labs & student incubation portal</span>
              </div>
            </div>
          </div>

          <div className="company-intro-split">
            <div className="intro-text">
              <span className="badge badge-emerald">Who We Are</span>
              <h2>{siteSettings?.about?.overviewTitle || 'Building the Future of Regional Tech Education & Enterprise Software'}</h2>
              <p>
                {siteSettings?.about?.overviewText || 'Headquartered in Sakoli, Maharashtra, NK SkillEdge Pvt. Ltd. bridges the critical divide between textbook engineering curricula and modern tech industry demands. We nurture aspiring engineers through project-based industrial apprenticeships while delivering robust, secure digital solutions to businesses.'}
              </p>
              <div className="intro-bullet-points">
                <div className="bullet-item">
                  <CheckCheck size={20} className="text-cyan" />
                  <div>
                    <strong>Dual-Engine Architecture:</strong> We don't just teach code; we run active commercial software development pipelines where students build real products.
                  </div>
                </div>
                <div className="bullet-item">
                  <CheckCheck size={20} className="text-cyan" />
                  <div>
                    <strong>Local Innovation Center:</strong> High-speed labs and hardware prototyping right in Sakoli, eliminating the need to relocate to distant metros.
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <a href="#about" className="btn btn-secondary">
                  <span>Know More About Our Story</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>

            <div className="intro-visual">
              <div className="glass-panel intro-quote-box">
                <div className="quote-mark">“</div>
                <p className="quote-text">
                  {siteSettings?.about?.quoteText || 'Our mission is straightforward: Every student trained at NK SkillEdge must possess verifiable code repositories and the practical confidence to solve real business challenges from day one.'}
                </p>
                <div className="quote-author">
                  <img 
                    src={siteSettings?.about?.quoteImage || "https://i.ibb.co/MDwcPjPq/Whats-App-Image-2026-02-02-at-9-21-25-PM.jpg"} 
                    alt={`${siteSettings?.about?.quoteAuthor || 'Mr. Kartik Mendhe'} – ${siteSettings?.about?.quoteRole || 'CEO'}`} 
                    className="author-thumb" 
                    onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80')}
                  />
                  <div>
                    <strong>{siteSettings?.about?.quoteAuthor || 'Mr. Kartik Mendhe'}</strong>
                    <span>{siteSettings?.about?.quoteRole || 'Chief Executive Officer (CEO)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: WHAT WE DO (PRD Section 8.4)
          ========================================================================= */}
      <section className="section what-we-do-section" id="what-we-do">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-purple">Core Pillars</span>
            <h2>What We Do at NK SkillEdge</h2>
            <p>A comprehensive ecosystem spanning enterprise digital engineering, career transformation, and advanced technical research.</p>
          </div>

          <div className="grid-4">
            <div className="card-interactive pillar-card">
              <div className="pillar-icon"><Laptop size={28} /></div>
              <h3>Technology Solutions</h3>
              <p>Custom software engineering, modern web applications, scalable mobile apps, cloud architectures, and digital workflows for businesses.</p>
              <a href="#services" className="pillar-link">Explore Solutions <ChevronRight size={14} /></a>
            </div>

            <div className="card-interactive pillar-card">
              <div className="pillar-icon"><BookOpen size={28} /></div>
              <h3>Skill Development</h3>
              <p>Rigorous, hands-on industrial training in MERN stack, Python AI/ML, and IoT designed to build employment-ready software engineers.</p>
              <a href="#programs" className="pillar-link">View Programs <ChevronRight size={14} /></a>
            </div>

            <div className="card-interactive pillar-card">
              <div className="pillar-icon"><Target size={28} /></div>
              <h3>Career Development</h3>
              <p>ATS resume optimization, technical interview bootcamps, mock coding drills, and direct referrals to partner IT hiring networks.</p>
              <a href="#programs" className="pillar-link">Learn More <ChevronRight size={14} /></a>
            </div>

            <div className="card-interactive pillar-card">
              <div className="pillar-icon"><Share2 size={28} /></div>
              <h3>Digital Marketing</h3>
              <p>Data-backed social media growth strategies, targeted advertising campaigns, brand positioning, and localized organic discovery.</p>
              <a href="#services" className="pillar-link">View Services <ChevronRight size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BUSINESS SERVICES (PRD Section 8.5 & Section 15)
          ========================================================================= */}
      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Corporate Solutions</span>
            <h2>Enterprise Software & Digital Services</h2>
            <p>From early-stage MVPs to robust corporate portals, we build high-performing digital assets tailored to your business roadmap.</p>
          </div>

          <div className="grid-3">
            {services.map((s) => (
              <div key={s._id} className="card-interactive service-box">
                {s.image && (
                  <div className="service-card-img-wrap">
                    <img 
                      src={s.image} 
                      alt={`${s.title} - NK SkillEdge Pvt. Ltd.`} 
                      className="service-card-img"
                      loading="lazy"
                      onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80')}
                    />
                  </div>
                )}
                
                <div className="service-icon-wrap" style={{ marginTop: s.image ? '16px' : '0' }}>
                  {s.slug === 'website-development' && <Laptop size={24} />}
                  {s.slug === 'application-development' && <Smartphone size={24} />}
                  {s.slug === 'social-media-solutions' && <Share2 size={24} />}
                  {s.slug === 'consultancy-services' && <Compass size={24} />}
                  {s.slug === 'digital-transformation' && <Cpu size={24} />}
                  {!['website-development', 'application-development', 'social-media-solutions', 'consultancy-services', 'digital-transformation'].includes(s.slug) && <Sparkles size={24} />}
                </div>

                <h3>{s.title}</h3>
                <p className="service-desc">{s.shortDescription}</p>

                <div className="service-features-list">
                  {s.features?.slice(0, 4).map((f, i) => (
                    <div key={i} className="svc-feature-item">
                      <CheckCircle2 size={14} className="text-cyan" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="service-tech-tags">
                  {s.technologies?.slice(0, 4).map((t, idx) => (
                    <span key={idx} className="tech-tag">{t}</span>
                  ))}
                </div>

                <div className="service-card-footer">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onOpenQuote(s)}
                  >
                    Request Quote
                  </button>
                  <button 
                    type="button"
                    className="service-learn-more"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-hover)', display: 'inline-flex', alignItems: 'center', gap: '4px', font: 'inherit', fontWeight: 600 }}
                    onClick={() => setSelectedDetailEntity({ ...s, entityType: 'service' })}
                  >
                    Learn More <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TRAINING PROGRAMS (PRD Section 8.6 & Section 16)
          ========================================================================= */}
      <section className="section programs-section" id="programs">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-emerald">Industrial Academy</span>
            <h2>Practical Training & Engineering Programs</h2>
            <p>Designed for engineering students, diploma holders, and graduates who want to build real software and land tech roles.</p>
          </div>

          <div className="grid-3">
            {programs.map((p) => (
              <div key={p._id} className="card-interactive program-box">
                {p.image && (
                  <div className="program-card-img-wrap">
                    <img 
                      src={p.image} 
                      alt={`${p.name} - NK SkillEdge Pvt. Ltd.`} 
                      className="program-card-img"
                      loading="lazy"
                      onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80')}
                    />
                  </div>
                )}

                <div className="program-top-meta" style={{ marginTop: p.image ? '16px' : '0' }}>
                  <span className="badge badge-cyan">{p.category}</span>
                  <span className="program-duration"><Clock size={13} /> {p.duration}</span>
                </div>

                <h3>{p.name}</h3>
                <p className="program-desc">{p.shortDescription}</p>

                <div className="program-specs">
                  <div className="spec-row">
                    <span className="spec-label">Mode:</span>
                    <span className="spec-val">{p.mode}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Location:</span>
                    <span className="spec-val">{p.location}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Eligibility:</span>
                    <span className="spec-val">{p.eligibility?.split('(')[0]}</span>
                  </div>
                </div>

                <div className="program-tech-stack">
                  {p.technologies?.slice(0, 5).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="program-footer">
                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => onOpenRegister(p)}
                  >
                    Register Now & Generate ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY NK SKILLEDGE? (PRD Section 8.7)
          ========================================================================= */}
      <section className="section why-us-section" id="why-us">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-amber">The SkillEdge Advantage</span>
            <h2>Why Students & Businesses Choose NK SkillEdge</h2>
            <p>A dedicated execution framework designed to guarantee practical mastery, not empty certificates.</p>
          </div>

          <div className="grid-4">
            <div className="card-interactive why-card">
              <div className="why-num">01</div>
              <h4>Practical Learning</h4>
              <p>Zero rote memorization. 80% of student time is dedicated to writing code, fixing compilation bugs, and debugging.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">02</div>
              <h4>Live Client Projects</h4>
              <p>Work on real client requirements and enterprise codebases alongside our CTO and senior developers.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">03</div>
              <h4>Sakoli Tech Center</h4>
              <p>Full hardware prototyping, IoT sensors, and high-speed workstations right near Gobade Hospital, Sakoli.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">04</div>
              <h4>Placement Acceleration</h4>
              <p>50+ placed alumni with verified track records in tech companies across Maharashtra and Bangalore.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">05</div>
              <h4>Verifiable Credentials</h4>
              <p>Every certificate issued contains a unique Certificate ID verifiable in real-time by HR recruiters.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">06</div>
              <h4>MSME & ISO Certified</h4>
              <p>Nationally registered enterprise operating under ISO 9001:2015 quality management standards.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">07</div>
              <h4>Active Tech Mentorship</h4>
              <p>Direct 1-on-1 guidance from practitioners with real production experience in modern architectures.</p>
            </div>

            <div className="card-interactive why-card">
              <div className="why-num">08</div>
              <h4>Lifelong Alumni Support</h4>
              <p>Continuous career mentorship, resume updates, and access to internal recruitment notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FEATURED PROJECTS & CASE STUDIES (PRD Section 8.8 & Section 19)
          ========================================================================= */}
      <section className="section projects-section" id="projects">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Proven Track Record</span>
            <h2>Featured Client Projects & Case Studies</h2>
            <p>Inspect production applications, IoT nodes, and cloud ERP systems engineered by NK SkillEdge.</p>
          </div>

          <div className="projects-filter-bar">
            {['All', 'Web', 'Mobile', 'IoT', 'AI'].map((cat) => (
              <button 
                key={cat}
                className={`filter-btn ${activeProjectFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveProjectFilter(cat)}
              >
                {cat} Solutions
              </button>
            ))}
          </div>

          <div className="grid-2">
            {filteredProjects.map((p) => (
              <div key={p._id} className="card-interactive project-card">
                <div className="project-image-wrap">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="project-img" 
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80')}
                  />
                  <span className="project-category-badge">{p.category}</span>
                </div>

                <div className="project-details">
                  <div className="project-meta-top">
                    <span className="project-client">{p.client}</span>
                    <span className="project-status">{p.status}</span>
                  </div>

                  <h3>{p.title}</h3>
                  <p className="project-summary">{p.shortSummary}</p>

                  <div className="project-tech-pills">
                    {p.technologies?.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedCaseStudy(p)}
                    >
                      View Case Study
                    </button>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        Live Preview <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: SUCCESS STORIES & TESTIMONIALS (PRD Section 8.9 & Section 21-22)
          ========================================================================= */}
      <section className="section success-section" id="success-stories">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-emerald">Student Outcomes</span>
            <h2>Success Stories & Placements</h2>
            <p>Hear how practical project apprenticeships at NK SkillEdge launched fulfilling careers in engineering.</p>
          </div>

          <div className="grid-3" style={{ marginBottom: '40px' }}>
            {activeSuccessStories.map((s) => (
              <div key={s._id} className="card-interactive success-card">
                <div className="success-profile-header">
                  <img 
                    src={s.image || s.profile_image || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80'} 
                    alt={s.studentName || s.name} 
                    className="student-avatar" 
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80')}
                  />
                  <div>
                    <h4>{s.studentName || s.name}</h4>
                    <span className="student-course">{s.course}</span>
                  </div>
                </div>

                <div className="placement-badge-box">
                  <Award size={16} className="text-emerald" />
                  <span>Placed at <strong>{s.company}</strong></span>
                  {s.package && <span className="package-tag">{s.package}</span>}
                </div>

                <p className="success-quote">"{s.testimonial}"</p>
                <div className="student-role-tag">{s.achievement || s.designation || 'Career Success'}</div>
                {s.video && (
                  <a href={s.video} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '12px', width: 'fit-content' }}>
                    Watch Video
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="testimonials-sub-block">
            <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Client & Student Testimonials</h3>
            <div className="grid-3">
              {activeTestimonials.map((t) => (
                <div key={t._id} className="glass-panel testimonial-mini-box">
                  <div className="stars-row">
                    {[...Array(Number(t.rating || 5))].map((_, i) => (
                      <Star key={i} size={15} className="star-filled" />
                    ))}
                  </div>
                  <p className="testi-text">"{t.testimonial}"</p>
                  <div className="testi-author">
                    <img 
                      src={t.image || t.profile_photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80'} 
                      alt={t.name} 
                      className="testi-avatar" 
                      loading="lazy"
                      onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80')}
                    />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role || t.designation || t.company || 'Community Member'}</span>
                    </div>
                  </div>
                  {t.video && (
                    <a href={t.video} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '14px', width: 'fit-content' }}>
                      Play Video
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: LEADERSHIP & CORE TEAM (PRD Section 8.10, 12, 13)
          ========================================================================= */}
      <section className="section leadership-section" id="leadership">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Executive Leadership</span>
            <h2>Guiding the Vision of NK SkillEdge</h2>
            <p>Dedicated tech founders steering educational transformation and software quality.</p>
          </div>

          {/* CEO and Director Profile Cards */}
          <div className="grid-2">
            {leadership.map((leader) => (
              <div key={leader._id} className="card-interactive leader-card">
                <div className="leader-img-col">
                  <img 
                    src={leader.image} 
                    alt={`${leader.name} - ${leader.role}`} 
                    className="leader-img" 
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80')}
                  />
                </div>
                <div className="leader-info-col">
                  <span className="leader-role-badge">{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <p className="leader-bio">{leader.bio}</p>
                  
                  {leader.leadershipMessage && (
                    <div className="leader-quote-strip">
                      <span className="strip-title">Leadership Message:</span>
                      <p>"{leader.leadershipMessage}"</p>
                    </div>
                  )}

                  {leader.responsibilities && (
                    <div className="leader-responsibilities">
                      <strong>Core Focus:</strong> {leader.responsibilities}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section 13: Dynamic Team Members Roster */}
          <div className="team-highlight-strip" id="team" style={{ marginTop: '70px' }}>
            <div className="section-header" style={{ marginBottom: '36px' }}>
              <span className="badge badge-emerald">Engineers & Mentors</span>
              <h3>Our Core Technical Leadership & Team</h3>
              <p>Dynamic software professionals leading daily engineering standups and student mentorship.</p>
            </div>

            <div className="grid-4">
              {team.map((m) => {
                const profileImage = m.profile_image || m.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80';
                const role = m.designation || m.role || 'Team Member';
                const bio = m.bio || m.about || 'Dedicated team member contributing to NK SkillEdge growth and student outcomes.';
                const socialLinks = m.socialLinks || {};

                return (
                  <div key={m._id} className="card-interactive team-mini-card">
                    <div className="team-avatar-wrap">
                      <img 
                        src={profileImage} 
                        alt={`${m.name} – ${role}`} 
                        className="team-avatar" 
                        loading="lazy"
                        onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80')}
                      />
                    </div>
                    <h4>{m.name}</h4>
                    <span className="team-role">{role}</span>
                    {(m.department || m.designation) && <span className="team-dept">{m.department || m.designation}</span>}
                    {bio && <p className="team-bio-short">{bio}</p>}

                    {(m.linkedin_url || m.instagram_url || m.github_url || socialLinks.linkedin || socialLinks.instagram || socialLinks.github) && (
                      <div className="team-social-row">
                        {m.linkedin_url || socialLinks.linkedin ? (
                          <a href={m.linkedin_url || socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="team-social-link">
                            <Share2 size={15} />
                          </a>
                        ) : null}
                        {m.instagram_url || socialLinks.instagram ? (
                          <a href={m.instagram_url || socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="team-social-link">
                            <Star size={15} />
                          </a>
                        ) : null}
                        {m.github_url || socialLinks.github ? (
                          <a href={m.github_url || socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="team-social-link">
                            <Laptop size={15} />
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: CERTIFICATIONS & RECOGNITIONS (PRD Section 8.11)
          ========================================================================= */}
      <section className="section certifications-section" id="certifications">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-amber">Official Accreditations</span>
            <h2>Official Certifications & Recognitions</h2>
            <p>Operating with certified quality management, legal compliance, and governmental registration.</p>
          </div>

          <div className="grid-4 certs-official-grid">
            {certifications.map((c) => (
              <div key={c._id} className="glass-panel cert-card">
                <div className="cert-img-wrap">
                  {c.image ? (
                    <img 
                      src={c.image} 
                      alt={`${c.title} - NK SkillEdge Pvt. Ltd.`} 
                      className="cert-official-img"
                      loading="lazy"
                      onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80')}
                    />
                  ) : (
                    <div className="cert-fallback-icon"><ShieldCheck size={36} className="text-amber" /></div>
                  )}
                </div>
                <div className="cert-info">
                  <span className="badge badge-amber" style={{ marginBottom: '8px' }}>{c.badge}</span>
                  <h3>{c.title}</h3>
                  <span className="cert-authority">{c.authority}</span>
                  <p className="cert-desc">{c.description}</p>
                  <div className="cert-code">Verification Code: <strong>{c.code}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: PARTNERS & CLIENTS (PRD Section 8.12)
          ========================================================================= */}
      <section className="section clients-section" id="clients">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Ecosystem</span>
            <h2>Trusted by MSMEs & Academic Partners</h2>
            <p>Collaborating with forward-thinking enterprises and educational institutions across Maharashtra.</p>
          </div>

          <div className="clients-logo-grid">
            {clients.map((cl) => (
              <div key={cl._id} className="glass-panel client-logo-box">
                <div className="client-avatar-monogram">{cl.name.slice(0, 2).toUpperCase()}</div>
                <strong>{cl.name}</strong>
                <span className="client-industry">{cl.industry}</span>
                <span className="client-projects-count">{cl.projectCount} Projects Deployed</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: LATEST UPDATES (BLOGS & EVENTS) (PRD Section 8.13)
          ========================================================================= */}
      <section className="section updates-section" id="updates">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-purple">Knowledge Hub</span>
            <h2>Workshops, Tech Articles & Announcements</h2>
            <p>Stay updated with our active technical workshops and industry insights.</p>
          </div>

          {events.length > 0 && (
            <div className="events-spotlight-box glass-panel" id="events">
              <div className="event-banner-col">
                <img 
                  src={events[0].banner} 
                  alt={events[0].title} 
                  className="event-img" 
                  loading="lazy"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80')}
                />
              </div>
              <div className="event-info-col">
                <div className="event-tag"><Calendar size={14} /> Upcoming Workshop</div>
                <h3>{events[0].title}</h3>
                <p className="event-desc">{events[0].description}</p>
                <div className="event-meta-items">
                  <div><strong>Date:</strong> {events[0].date}</div>
                  <div><strong>Time:</strong> {events[0].time}</div>
                  <div><strong>Speaker:</strong> {events[0].speaker}</div>
                  <div><strong>Venue:</strong> {events[0].venue}</div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => onOpenRegister(null)}>
                    Reserve Your Seat ({events[0].seats - events[0].registeredCount} Seats Left)
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid-2" style={{ marginTop: '30px' }} id="blogs">
            {blogs.map((b) => (
              <div key={b._id} className="card-interactive blog-card">
                <img 
                  src={b.image} 
                  alt={b.title} 
                  className="blog-thumb" 
                  loading="lazy"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80')}
                />
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="badge badge-cyan">{b.category}</span>
                    <span className="reading-time">{b.readingTime}</span>
                  </div>
                  <h3>{b.title}</h3>
                  <p className="blog-summary">{b.summary}</p>
                  <div className="blog-footer">
                    <span className="author-name">By {b.author}</span>
                    <a href="#contact" className="read-more-link">Read Full Guide <ArrowRight size={13} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FAQS (PRD Section 46)
          ========================================================================= */}
      <section className="section faqs-section" id="faqs">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-cyan">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our training admissions, software services, and certifications.</p>
          </div>

          <div className="faqs-accordion-container">
            {faqs.map((f, idx) => (
              <div 
                key={f._id} 
                className={`faq-item glass-panel ${openFaq === idx ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-question-bar">
                  <h4>{f.question}</h4>
                  <span className="faq-toggle-icon">{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer-content">
                    <p>{f.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14: CLOSING CTA & LEAD CONTACT FORM (PRD Section 8.14, 26, 27)
          ========================================================================= */}
      <section className="section closing-cta-section" id="contact">
        <div className="container">
          <div className="glass-panel contact-grid-panel">
            <div className="contact-info-col">
              <span className="badge badge-emerald">Ready to Shape Your Future?</span>
              <h2>Start Your Journey with NK SkillEdge Today</h2>
              <p>
                Whether you want to enroll in industrial training, discuss an enterprise software requirement, or visit our Sakoli center — our team is ready to assist you.
              </p>

              <div className="contact-points-list">
                <div className="point-item">
                  <MapPin size={22} className="text-cyan" />
                  <div>
                    <strong>Headquarters & Innovation Lab</strong>
                    <span>{siteSettings?.office || 'NK SkillEdge Pvt. Ltd., Near Gobade Hospital, Sakoli, Maharashtra 441802'}</span>
                  </div>
                </div>
                <div className="point-item">
                  <PhoneCall size={22} className="text-cyan" />
                  <div>
                    <strong>Helpline & Counseling</strong>
                    <span>{siteSettings?.phones?.join(' / ') || '+91 7498784109 / +91 9356049629'}</span>
                  </div>
                </div>
                <div className="point-item">
                  <Send size={22} className="text-cyan" />
                  <div>
                    <strong>Official Email</strong>
                    <span>{siteSettings?.email || 'hmendhe72@gmail.com'}</span>
                  </div>
                </div>
              </div>

              <div className="direct-cta-actions">
                <a 
                  href={`https://wa.me/91${siteSettings?.whatsappNumber || '7498784109'}?text=Hello%20NK%20SkillEdge,%20I%20would%20like%20to%20schedule%20a%20consultation.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-emerald"
                >
                  <MessageSquare size={16} /> WhatsApp Direct Chat
                </a>
                <a href={`tel:${siteSettings?.phones?.[0] || '7498784109'}`} className="btn btn-secondary">
                  <PhoneCall size={16} /> Call Counselors
                </a>
              </div>

              {displayBranches && displayBranches.length > 0 && (
                <div className="home-branches-strip" style={{ marginTop: '28px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-hover)', display: 'block', marginBottom: '10px' }}>
                    Regional Centers & Laboratories
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {displayBranches.map((br) => (
                      <div key={br._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={13} className="text-cyan" />
                          <strong style={{ color: '#fff' }}>{br.name}:</strong> {br.address}, {br.city}
                        </span>
                        {br.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{br.phone}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="contact-form-col">
              <div className="form-card-inner">
                <h3>Submit an Inquiry</h3>
                <p>Fill in your details and our team will contact you within 24 hours.</p>

                {leadSuccess ? (
                  <div className="lead-submitted-success">
                    <CheckCircle2 size={48} className="text-emerald" />
                    <h4>Inquiry Received!</h4>
                    <p>Thank you for connecting with NK SkillEdge Pvt. Ltd. One of our senior advisors will reach out to you shortly.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setLeadSuccess(false)}>
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="contact-form">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Rahul Patil"
                        className="form-input"
                        value={leadForm.fullName}
                        onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Mobile Number *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="10-digit number"
                          className="form-input"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="name@gmail.com"
                          className="form-input"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">I am a...</label>
                        <select 
                          className="form-select"
                          value={leadForm.userType}
                          onChange={(e) => setLeadForm({ ...leadForm, userType: e.target.value })}
                        >
                          <option value="Student">Student / Engineering Trainee</option>
                          <option value="Parent">Parent</option>
                          <option value="Business">Business / Startup Client</option>
                          <option value="College">College / Institution Faculty</option>
                          <option value="Job Seeker">Job Seeker</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Interested In</label>
                        <select 
                          className="form-select"
                          value={leadForm.serviceOrCourse}
                          onChange={(e) => setLeadForm({ ...leadForm, serviceOrCourse: e.target.value })}
                        >
                          <option value="Industrial Training Program">Industrial Training Program</option>
                          <option value="Full Stack Web Development">Full Stack Web Development</option>
                          <option value="Mobile App Development">Mobile App Development</option>
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                          <option value="Website Development Service">Website Development Service</option>
                          <option value="Application Development Service">Application Development Service</option>
                          <option value="Social Media Services">Social Media Services</option>
                          <option value="College Workshop Partnership">College Workshop Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message / Details</label>
                      <textarea 
                        className="form-textarea"
                        rows={3}
                        placeholder="Tell us about your requirement, batch preferences, or project timeline..."
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={leadSending}
                      className="btn btn-primary btn-lg" 
                      style={{ width: '100%' }}
                    >
                      {leadSending ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CASE STUDY MODAL
          ========================================================================= */}
      {selectedCaseStudy && (
        <div className="modal-overlay" onClick={() => setSelectedCaseStudy(null)}>
          <div className="modal-content case-study-modal" onClick={(e) => e.stopPropagation()}>
            <div className="case-study-header">
              <span className="badge badge-cyan">{selectedCaseStudy.category} Architecture</span>
              <h2>{selectedCaseStudy.title}</h2>
              <span className="case-study-client">Engineered for: <strong>{selectedCaseStudy.client}</strong></span>
            </div>

            <div className="case-study-body">
              <div className="case-block">
                <h4>Problem Statement</h4>
                <p>{selectedCaseStudy.problemStatement}</p>
              </div>

              <div className="case-block">
                <h4>The NK SkillEdge Engineered Solution</h4>
                <p>{selectedCaseStudy.solution}</p>
              </div>

              <div className="case-block">
                <h4>Core Architectural Features</h4>
                <ul className="case-feature-bullets">
                  {selectedCaseStudy.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="case-block results-highlight-box">
                <h4>Measured Results & Impact</h4>
                <p>{selectedCaseStudy.results}</p>
              </div>

              <div className="case-block">
                <h4>Technology Stack</h4>
                <div className="tech-tags-cloud">
                  {selectedCaseStudy.technologies?.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
              {selectedCaseStudy.liveUrl && (
                <a href={selectedCaseStudy.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Launch Live Demo <ExternalLink size={14} />
                </a>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedCaseStudy(null)}>
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        .home-page-root {
          position: relative;
        }
        /* Hero */
        .hero-section {
          padding-top: 150px;
          padding-bottom: 90px;
          position: relative;
          z-index: 1;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .hero-cta-group { justify-content: center; }
          .hero-trust-signals { justify-content: center; }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: var(--primary-hover);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .hero-title {
          margin-bottom: 20px;
        }
        .hero-statement {
          font-size: 1.18rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 620px;
        }
        .hero-cta-group {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .hero-trust-signals {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--text-light);
        }
        /* Hero Visual Terminal */
        .hero-card-stack {
          position: relative;
          padding: 20px;
        }
        .hero-main-card {
          padding: 24px;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg), 0 0 30px rgba(14, 165, 233, 0.15);
        }
        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 16px;
        }
        .traffic-lights {
          display: flex;
          gap: 6px;
        }
        .traffic-lights .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .traffic-lights .red { background: #ef4444; }
        .traffic-lights .yellow { background: #eab308; }
        .traffic-lights .green { background: #22c55e; }
        .card-tag {
          font-size: 0.74rem;
          font-family: monospace;
          color: var(--text-muted);
        }
        .terminal-code {
          font-family: 'Fira Code', monospace;
          font-size: 0.88rem;
          line-height: 1.7;
        }
        .code-keyword { color: #f43f5e; font-weight: 600; }
        .code-var { color: #38bdf8; }
        .code-func { color: #a78bfa; }
        .code-key { color: #fbbf24; }
        .code-str { color: #34d399; }
        .code-comment { color: #64748b; font-style: italic; margin-top: 10px; }
        .indent { padding-left: 20px; }
        
        .hero-float-badge {
          position: absolute;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-light);
          padding: 12px 18px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-md);
          z-index: 2;
        }
        .float-badge-left {
          bottom: -15px;
          left: 0;
        }
        .float-badge-right {
          top: -15px;
          right: 0;
        }
        .hero-float-badge strong {
          display: block;
          font-size: 0.88rem;
          color: #ffffff;
        }
        .hero-float-badge span {
          display: block;
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        /* Stats Card Banner */
        .stats-card-banner {
          padding: 44px;
          margin-bottom: 70px;
          position: relative;
          overflow: hidden;
        }
        .stats-banner-heading {
          text-align: center;
          margin-bottom: 36px;
        }
        .stats-banner-heading h3 {
          margin: 10px 0 6px 0;
          font-size: 1.8rem;
        }
        .stats-six-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
          text-align: center;
        }
        @media (max-width: 1024px) {
          .stats-six-grid { grid-template-columns: repeat(3, 1fr); gap: 28px; }
        }
        @media (max-width: 640px) {
          .stats-six-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 6px;
        }
        .stat-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Company Intro Split */
        .company-intro-split {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 50px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .company-intro-split { grid-template-columns: 1fr; }
        }
        .intro-text h2 {
          margin: 14px 0 16px 0;
        }
        .intro-bullet-points {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .bullet-item {
          display: flex;
          gap: 12px;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }
        .intro-quote-box {
          padding: 32px;
          position: relative;
        }
        .quote-mark {
          font-family: serif;
          font-size: 4.5rem;
          color: var(--primary);
          line-height: 0.8;
          opacity: 0.3;
        }
        .quote-text {
          font-size: 1.05rem;
          color: #ffffff;
          font-style: italic;
          margin: 10px 0 20px 0;
          line-height: 1.6;
        }
        .quote-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .author-thumb {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }
        .quote-author strong {
          display: block;
          color: #ffffff;
          font-size: 0.92rem;
        }
        .quote-author span {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* What We Do */
        .pillar-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        .pillar-icon {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .pillar-card h3 {
          margin-bottom: 10px;
        }
        .pillar-card p {
          font-size: 0.9rem;
          margin-bottom: 18px;
          flex: 1;
        }
        .pillar-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--primary-hover);
          font-weight: 600;
          font-size: 0.86rem;
        }

        /* Services & Programs Card Images */
        .service-card-img-wrap, .program-card-img-wrap {
          width: calc(100% + 56px);
          margin: -28px -28px 0 -28px;
          height: 170px;
          overflow: hidden;
          position: relative;
        }
        .service-card-img, .program-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .card-interactive:hover .service-card-img,
        .card-interactive:hover .program-card-img {
          transform: scale(1.05);
        }

        .service-box, .program-box {
          display: flex;
          flex-direction: column;
        }
        .service-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(14, 165, 233, 0.12);
          color: var(--primary-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .service-box h3, .program-box h3 {
          margin-bottom: 8px;
        }
        .service-desc, .program-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          flex: 1;
        }
        .service-features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .svc-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          color: var(--text-light);
        }
        .service-tech-tags, .program-tech-stack {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tech-tag {
          font-size: 0.76rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          color: var(--text-light);
        }
        .service-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-subtle);
          padding-top: 16px;
          margin-top: auto;
        }
        .service-learn-more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .service-learn-more:hover { color: var(--primary-hover); }

        .program-top-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .program-duration {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .program-specs {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
        }
        .spec-label { color: var(--text-muted); }
        .spec-val { color: var(--text-primary); font-weight: 600; }
        .program-footer {
          margin-top: auto;
        }

        /* Why Us */
        .why-card {
          padding: 24px;
        }
        .why-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: rgba(14, 165, 233, 0.4);
          margin-bottom: 8px;
        }
        .why-card h4 {
          margin-bottom: 8px;
          color: #ffffff;
        }
        .why-card p {
          font-size: 0.88rem;
        }

        /* Projects */
        .projects-filter-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active, .filter-btn:hover {
          background: var(--primary-gradient);
          color: #ffffff;
          border-color: transparent;
        }
        .project-card {
          padding: 0;
          overflow: hidden;
        }
        .project-image-wrap {
          height: 230px;
          position: relative;
          overflow: hidden;
        }
        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .project-card:hover .project-img {
          transform: scale(1.05);
        }
        .project-category-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(6, 9, 17, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-light);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--primary-hover);
        }
        .project-details {
          padding: 24px;
        }
        .project-meta-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 8px;
        }
        .project-client { color: var(--text-muted); }
        .project-status { color: var(--accent-emerald); font-weight: 600; }
        .project-summary {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 8px 0 16px 0;
        }
        .project-tech-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .project-actions {
          display: flex;
          gap: 12px;
        }

        /* Success Stories */
        .success-card {
          padding: 24px;
        }
        .success-profile-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .student-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }
        .student-course {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .placement-badge-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          margin-bottom: 14px;
        }
        .package-tag {
          font-weight: 700;
          color: var(--accent-emerald);
        }
        .success-quote {
          font-size: 0.88rem;
          font-style: italic;
          color: var(--text-light);
          margin-bottom: 12px;
        }
        .student-role-tag {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-hover);
        }

        .testimonials-sub-block {
          margin-top: 30px;
        }
        .testimonial-mini-box {
          padding: 22px;
        }
        .stars-row {
          display: flex;
          gap: 3px;
          margin-bottom: 10px;
        }
        .star-filled {
          color: #fbbf24;
          fill: #fbbf24;
        }
        .testi-text {
          font-size: 0.88rem;
          margin-bottom: 16px;
          font-style: italic;
        }
        .testi-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .testi-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }
        .testi-author strong {
          display: block;
          font-size: 0.88rem;
        }
        .testi-author span {
          display: block;
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        /* Leadership */
        .leader-card {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
          padding: 26px;
          align-items: center;
        }
        @media (max-width: 680px) {
          .leader-card { grid-template-columns: 1fr; }
        }
        .leader-img-col {
          display: flex;
          justify-content: center;
        }
        .leader-img {
          width: 100%;
          max-width: 200px;
          height: 230px;
          border-radius: var(--radius-md);
          object-fit: cover;
          object-position: top center;
          border: 2px solid var(--border-light);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .leader-role-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-hover);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .leader-bio {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin: 8px 0 12px 0;
        }
        .leader-quote-strip {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid var(--primary);
          padding: 8px 12px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.84rem;
          margin-bottom: 10px;
        }
        .strip-title {
          font-weight: 600;
          color: var(--text-light);
          display: block;
        }
        .leader-responsibilities {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        /* Team Mini Cards */
        .team-mini-card {
          text-align: center;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .team-avatar-wrap {
          width: 96px;
          height: 96px;
          margin-bottom: 14px;
          border-radius: 50%;
          padding: 3px;
          background: var(--primary-gradient);
          box-shadow: 0 0 16px var(--primary-glow);
        }
        .team-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: top center;
        }
        .team-role {
          display: block;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--primary-hover);
          margin-top: 2px;
        }
        .team-dept {
          display: block;
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .team-bio-short {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Certifications */
        .certs-official-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .certs-official-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .certs-official-grid { grid-template-columns: 1fr; }
        }
        .cert-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .cert-img-wrap {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          padding: 8px;
          border: 1px solid var(--border-subtle);
        }
        .cert-official-img {
          max-height: 74px;
          max-width: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }
        .cert-authority {
          display: block;
          font-size: 0.82rem;
          color: var(--primary-hover);
          margin: 4px 0 10px 0;
        }
        .cert-desc {
          font-size: 0.86rem;
          margin-bottom: 14px;
          flex: 1;
        }
        .cert-code {
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        /* Clients */
        .clients-logo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .clients-logo-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .client-logo-box {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .client-avatar-monogram {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .client-industry {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 2px 0 6px 0;
        }
        .client-projects-count {
          font-size: 0.78rem;
          color: var(--accent-emerald);
          font-weight: 600;
        }

        /* Updates & Events */
        .events-spotlight-box {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
          padding: 30px;
          margin-bottom: 30px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .events-spotlight-box { grid-template-columns: 1fr; }
        }
        .event-img {
          width: 100%;
          border-radius: var(--radius-md);
          max-height: 240px;
          object-fit: cover;
        }
        .event-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-emerald);
          background: rgba(16, 185, 129, 0.1);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 10px;
        }
        .event-meta-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 14px;
        }

        .blog-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .blog-thumb {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .blog-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .blog-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .reading-time {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .blog-summary {
          font-size: 0.88rem;
          margin: 8px 0 16px 0;
          flex: 1;
        }
        .blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 12px;
          font-size: 0.82rem;
        }
        .read-more-link {
          color: var(--primary-hover);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* FAQs */
        .faqs-accordion-container {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          padding: 18px 24px;
          cursor: pointer;
        }
        .faq-question-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-toggle-icon {
          font-size: 1.4rem;
          color: var(--primary-hover);
          font-weight: 700;
        }
        .faq-answer-content {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.92rem;
          color: var(--text-secondary);
        }

        /* Closing CTA & Contact */
        .contact-grid-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          padding: 48px;
        }
        @media (max-width: 900px) {
          .contact-grid-panel { grid-template-columns: 1fr; padding: 28px; }
        }
        .contact-info-col h2 {
          margin: 14px 0 16px 0;
        }
        .contact-points-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 28px 0;
        }
        .point-item {
          display: flex;
          gap: 14px;
        }
        .point-item strong {
          display: block;
          color: #ffffff;
          font-size: 0.95rem;
        }
        .point-item span {
          display: block;
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-top: 2px;
        }
        .direct-cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .form-card-inner {
          background: rgba(11, 17, 32, 0.9);
          border: 1px solid var(--border-light);
          padding: 30px;
          border-radius: var(--radius-lg);
        }
        .form-card-inner h3 { margin-bottom: 6px; }
        .form-card-inner p { margin-bottom: 20px; font-size: 0.9rem; }
        .lead-submitted-success {
          text-align: center;
          padding: 30px 10px;
        }
        .lead-submitted-success h4 {
          margin: 12px 0 8px 0;
          font-size: 1.2rem;
        }

        /* Case study modal */
        .case-study-modal {
          max-width: 750px;
        }
        .case-study-header {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 16px;
        }
        .case-study-header h2 { margin: 8px 0 4px 0; font-size: 1.6rem; }
        .case-study-client { font-size: 0.88rem; color: var(--text-muted); }
        .case-block { margin-bottom: 18px; }
        .case-block h4 { color: var(--primary-hover); font-size: 0.95rem; margin-bottom: 6px; }
        .case-feature-bullets {
          padding-left: 20px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .results-highlight-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 14px 18px;
          border-radius: var(--radius-md);
        }
        .results-highlight-box h4 { color: var(--accent-emerald); }
        .results-highlight-box p { color: var(--text-primary); font-weight: 500; font-size: 0.92rem; }
      `}</style>
    </div>
  );
}
