import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalSearchModal from './components/GlobalSearchModal';
import RegistrationModal from './components/RegistrationModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

import Home from './pages/Home';
import About from './pages/About';
import Internships from './pages/Internships';
import Careers from './pages/Careers';
import VerifyCertificate from './pages/VerifyCertificate';
import Legal from './pages/Legal';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const THEME_STORAGE_KEY = 'nksk_theme_preference';

const getSystemTheme = () => (
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
);

const getInitialThemePreference = () => 'system';

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [activeRegProgram, setActiveRegProgram] = useState(null);
  const [themePreference, setThemePreference] = useState(getInitialThemePreference);

  useEffect(() => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // Ignore localStorage write failures in restricted environments.
    }
  }, []);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem('nksk_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('nksk_token') || '');

  // Core Data States
  const [siteSettings, setSiteSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [clients, setClients] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataVersion, setDataVersion] = useState(0);

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolvedTheme = getSystemTheme();
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.documentElement.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    const handleSystemThemeChange = () => {
      if (themePreference === 'system') {
        applyTheme();
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, [themePreference]);

  const [dbError, setDbError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch Public Data
  const fetchData = async () => {
    try {
      const cacheOptions = {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      };

      const [
        sSettings, sServices, sPrograms, sProjects, sTeam,
        sTesti, sSuccess, sCerts, sClients, sBlogs, sEvents, sFaqs, sBranches
      ] = await Promise.all([
        fetch('/api/site-settings', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/services', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/programs', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/projects', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/team', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/testimonials', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/success-stories', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/certifications', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/clients', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/blogs', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/events', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/faqs', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message })),
        fetch('/api/branches', cacheOptions).then(r => r.json()).catch(err => ({ error: err.message }))
      ]);

      if (sSettings.success) {
        setSiteSettings(sSettings.settings);
        setDbError(null);
      } else if (sSettings.error) {
        setDbError('Unable to connect to database server. Please ensure the backend is running.');
      }

      if (sServices.success) setServices(sServices.data);
      if (sPrograms.success) setPrograms(sPrograms.data);
      if (sProjects.success) setProjects(sProjects.data);
      if (sTeam.success) {
        const allMembers = [...sTeam.data].sort((a, b) => {
          const orderA = Number(a.display_order ?? a.order ?? 9999);
          const orderB = Number(b.display_order ?? b.order ?? 9999);
          return orderA - orderB;
        });

        const activeLeadership = allMembers.filter(m => m.isLeadership && !(m.isActive === false || m.status === 'inactive'));
        const activeTeam = allMembers.filter(m => !m.isLeadership && !(m.isActive === false || m.status === 'inactive'));

        setLeadership(activeLeadership);
        setTeam(activeTeam);
      }
      if (sTesti.success) setTestimonials(sTesti.data);
      if (sSuccess.success) setSuccessStories(sSuccess.data);
      if (sCerts.success) setCertifications(sCerts.data);
      if (sClients.success) setClients(sClients.data);
      if (sBlogs.success) setBlogs(sBlogs.data);
      if (sEvents.success) setEvents(sEvents.data);
      if (sFaqs.success) setFaqs(sFaqs.data);
      if (sBranches && sBranches.success) setBranches(sBranches.branches || sBranches.data || []);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error fetching public portal data:', err);
      setDbError('Error communicating with database API.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataVersion]);

  const refreshPublicData = () => setDataVersion(prev => prev + 1);

  const openRegister = (program = null) => {
    setActiveRegProgram(program);
    setRegModalOpen(true);
  };

  const handleAdminLogin = (user, token) => {
    setAdminUser(user);
    setAdminToken(token);
    window.location.hash = '#admin';
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('nksk_token');
    localStorage.removeItem('nksk_user');
    setAdminUser(null);
    setAdminToken('');
    window.location.hash = '#home';
  };

  // If in #admin mode
  const isAdminRoute = currentHash.startsWith('#admin');

  return (
    <div className="app-container">
      {isAdminRoute ? (
        <div className="admin-view-wrapper">
          <div className="admin-return-ribbon">
            <span>NK SkillEdge Staff Portal</span>
            <a href="#home" className="return-link">← Return to Public Website</a>
          </div>
          {adminUser && adminToken ? (
            <AdminDashboard 
              user={adminUser} 
              token={adminToken} 
              onLogout={handleAdminLogout} 
              onRefreshData={refreshPublicData}
              themePreference={themePreference}
              onThemeChange={setThemePreference}
            />
          ) : (
            <AdminLogin onLoginSuccess={handleAdminLogin} />
          )}
        </div>
      ) : (
        <div className="public-site-wrapper">
          <Navbar 
            onOpenSearch={() => setSearchOpen(true)}
            onOpenRegister={openRegister}
            siteSettings={siteSettings}
            theme={themePreference === 'system' ? getSystemTheme() : themePreference}
            themePreference={themePreference}
            onThemeChange={setThemePreference}
          />

          <main id="main-content">
            <Home 
              siteSettings={siteSettings}
              services={services}
              programs={programs}
              projects={projects}
              leadership={leadership}
              team={team}
              testimonials={testimonials}
              successStories={successStories}
              certifications={certifications}
              clients={clients}
              blogs={blogs}
              events={events}
              branches={branches}
              faqs={faqs}
              onOpenRegister={openRegister}
              onOpenQuote={(service) => openRegister(null)}
            />

            <About siteSettings={siteSettings} />
            <Internships onOpenRegister={openRegister} />
            <VerifyCertificate />
            <Careers />
            <Legal />
          </main>

          <Footer 
            siteSettings={siteSettings} 
            onOpenRegister={openRegister} 
            branches={branches}
          />

          <WhatsAppFloatingButton phoneNumber={siteSettings?.phones?.[0] || '7498784109'} />

          <GlobalSearchModal 
            isOpen={searchOpen} 
            onClose={() => setSearchOpen(false)} 
          />

          <RegistrationModal 
            isOpen={regModalOpen}
            onClose={() => setRegModalOpen(false)}
            defaultProgram={activeRegProgram}
            programs={programs}
          />
        </div>
      )}

      <style>{`
        .app-container {
          min-height: 100vh;
        }
        .admin-return-ribbon {
          background: rgba(14, 165, 233, 0.15);
          border-bottom: 1px solid rgba(14, 165, 233, 0.3);
          padding: 8px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: var(--primary-hover);
        }
        .return-link {
          color: #ffffff;
          font-weight: 600;
        }
        .return-link:hover {
          color: var(--primary-hover);
        }
      `}</style>
    </div>
  );
}
