import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Eye, CheckCircle2, Megaphone, ArrowRight } from 'lucide-react';

export default function HeroAnnouncementCMS({ siteSettings, authHeader, onRefreshData, onShowToast }) {
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    brandLine: '',
    description: '',
    badgeText: '',
    ctaPrimaryText: 'Explore Programs',
    ctaPrimaryLink: '#programs',
    ctaSecondaryText: 'Get a Business Consultation',
    ctaSecondaryLink: '#contact',
    applyBtnText: 'Apply Now',
    trustSignalsText: 'Sakoli Hardware & Tech Lab\nLive Client Software Projects\n100% Verifiable Credentials'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    enabled: false,
    text: '',
    link: '#programs',
    badge: 'NEW BATCH'
  });

  const [savingHero, setSavingHero] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.hero) {
        setHeroForm({
          title: siteSettings.hero.title || '',
          subtitle: siteSettings.hero.subtitle || '',
          brandLine: siteSettings.hero.brandLine || siteSettings.brandLine || '',
          description: siteSettings.hero.description || '',
          badgeText: siteSettings.hero.badgeText || '',
          ctaPrimaryText: siteSettings.hero.ctaPrimaryText || 'Explore Programs',
          ctaPrimaryLink: siteSettings.hero.ctaPrimaryLink || '#programs',
          ctaSecondaryText: siteSettings.hero.ctaSecondaryText || 'Get a Business Consultation',
          ctaSecondaryLink: siteSettings.hero.ctaSecondaryLink || '#contact',
          applyBtnText: siteSettings.hero.applyBtnText || 'Apply Now',
          trustSignalsText: Array.isArray(siteSettings.hero.trustSignals) 
            ? siteSettings.hero.trustSignals.join('\n') 
            : 'Sakoli Hardware & Tech Lab\nLive Client Software Projects\n100% Verifiable Credentials'
        });
      }
      if (siteSettings.announcementBar) {
        setAnnouncementForm({
          enabled: Boolean(siteSettings.announcementBar.enabled),
          text: siteSettings.announcementBar.text || '',
          link: siteSettings.announcementBar.link || '#programs',
          badge: siteSettings.announcementBar.badge || 'NEW BATCH'
        });
      }
    }
  }, [siteSettings]);

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    setErrorMsg('');
    try {
      const trustSignals = heroForm.trustSignalsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        title: heroForm.title.trim(),
        subtitle: heroForm.subtitle.trim(),
        brandLine: heroForm.brandLine.trim(),
        description: heroForm.description.trim(),
        badgeText: heroForm.badgeText.trim(),
        ctaPrimaryText: heroForm.ctaPrimaryText.trim(),
        ctaPrimaryLink: heroForm.ctaPrimaryLink.trim(),
        ctaSecondaryText: heroForm.ctaSecondaryText.trim(),
        ctaSecondaryLink: heroForm.ctaSecondaryLink.trim(),
        applyBtnText: heroForm.applyBtnText.trim(),
        trustSignals
      };

      const res = await fetch('/api/site-settings/hero', {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Hero section updated in database successfully!');
        if (onRefreshData) onRefreshData();
      } else {
        setErrorMsg(data.message || 'Failed to update hero section');
      }
    } catch (err) {
      setErrorMsg('Network error while saving hero section: ' + err.message);
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    setSavingAnnouncement(true);
    setErrorMsg('');
    try {
      const payload = {
        enabled: Boolean(announcementForm.enabled),
        text: announcementForm.text.trim(),
        link: announcementForm.link.trim(),
        badge: announcementForm.badge.trim()
      };

      const res = await fetch('/api/site-settings/announcement', {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Announcement bar updated in database successfully!');
        if (onRefreshData) onRefreshData();
      } else {
        setErrorMsg(data.message || 'Failed to update announcement bar');
      }
    } catch (err) {
      setErrorMsg('Network error while saving announcement bar: ' + err.message);
    } finally {
      setSavingAnnouncement(false);
    }
  };

  return (
    <div className="cms-submodule">
      <div className="pane-header">
        <h2>Hero Section & Announcement Bar CMS</h2>
        <p>Control the public landing banner, headlines, primary CTAs, trust badges, and top notification bar in real-time.</p>
      </div>

      {errorMsg && (
        <div className="alert-box alert-error" style={{ marginBottom: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>
          {errorMsg}
        </div>
      )}

      {/* ANNOUNCEMENT BAR CMS */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Megaphone className="text-cyan" size={22} />
          <h3 style={{ margin: 0 }}>Top Announcement Bar</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Display an urgent highlight, workshop announcement, or admission deadline strip above the navbar on all public pages.
        </p>

        <form onSubmit={handleSaveAnnouncement}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={announcementForm.enabled}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, enabled: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <strong style={{ color: '#fff' }}>Enable Announcement Bar on Public Website</strong>
            </label>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Badge Label (e.g. NEW BATCH, ADMISSIONS OPEN)</label>
              <input 
                type="text" 
                className="form-input"
                value={announcementForm.badge}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, badge: e.target.value })}
                placeholder="NEW BATCH"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Action Link URL</label>
              <input 
                type="text" 
                className="form-input"
                value={announcementForm.link}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, link: e.target.value })}
                placeholder="#programs"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Message Text *</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={announcementForm.text}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
              placeholder="Admissions Open: Industrial Training & MERN Stack Engineering Batch 2026!"
              required
            />
          </div>

          <button type="submit" disabled={savingAnnouncement} className="btn btn-primary">
            <Save size={16} /> {savingAnnouncement ? 'Saving Announcement...' : 'Save Announcement Bar'}
          </button>
        </form>
      </div>

      {/* HERO SECTION CMS */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles className="text-amber" size={22} />
          <h3 style={{ margin: 0 }}>Hero Main Headline & Calls-to-Action</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Changes saved here instantly update the primary landing screen of the NK SkillEdge website upon refresh or revalidation.
        </p>

        <form onSubmit={handleSaveHero}>
          <div className="form-group">
            <label className="form-label">Hero Badge Pill (e.g. Government Recognized & ISO Certified)</label>
            <input 
              type="text" 
              className="form-input"
              value={heroForm.badgeText}
              onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
              placeholder="Government Recognized & ISO 9001:2015 Certified Center"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Main Title (Tip: Use comma to split line, e.g. "Shaping Skills, Building Futures.") *</label>
            <input 
              type="text" 
              className="form-input"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              placeholder="Shaping Skills, Building Futures."
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Hero Brand Subtitle Line</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.brandLine}
                onChange={(e) => setHeroForm({ ...heroForm, brandLine: e.target.value })}
                placeholder="One Company — Many Solutions — Unlimited Possibilities"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apply Button Label</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.applyBtnText}
                onChange={(e) => setHeroForm({ ...heroForm, applyBtnText: e.target.value })}
                placeholder="Apply Now"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero Main Description Statement *</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              placeholder="Empowering students through practical training, industry exposure and real-world learning..."
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Primary CTA Label</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.ctaPrimaryText}
                onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                placeholder="Explore Programs"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary CTA Link URL</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.ctaPrimaryLink}
                onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
                placeholder="#programs"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Secondary CTA Label</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.ctaSecondaryText}
                onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                placeholder="Get a Business Consultation"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary CTA Link URL</label>
              <input 
                type="text" 
                className="form-input"
                value={heroForm.ctaSecondaryLink}
                onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                placeholder="#contact"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Micro-Trust Signals (One signal per line)</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={heroForm.trustSignalsText}
              onChange={(e) => setHeroForm({ ...heroForm, trustSignalsText: e.target.value })}
              placeholder="Sakoli Hardware & Tech Lab&#10;Live Client Software Projects&#10;100% Verifiable Credentials"
            />
          </div>

          {/* Live Preview Card */}
          <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Live Home Page Hero Preview
            </span>
            <span className="badge badge-cyan" style={{ marginBottom: '8px', display: 'inline-block' }}>{heroForm.badgeText || 'Badge'}</span>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 8px', color: '#fff' }}>{heroForm.title || 'Main Title Here'}</h2>
            <p style={{ color: 'var(--primary-hover)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>{heroForm.brandLine}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{heroForm.description}</p>
          </div>

          <button type="submit" disabled={savingHero} className="btn btn-primary btn-lg">
            <Save size={18} /> {savingHero ? 'Saving Hero to Database...' : 'Save Hero Section to Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
