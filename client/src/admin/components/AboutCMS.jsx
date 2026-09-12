import React, { useState, useEffect } from 'react';
import { Target, Compass, Save, CheckCircle2 } from 'lucide-react';

export default function AboutCMS({ siteSettings, authHeader, onRefreshData, onShowToast }) {
  const [aboutForm, setAboutForm] = useState({
    overviewTitle: '',
    overviewText: '',
    quoteText: '',
    quoteAuthor: '',
    quoteRole: '',
    quoteImage: '',
    foundingStory: '',
    foundingStorySecond: '',
    corePositioning: '',
    visionText: '',
    missionListText: ''
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (siteSettings?.about) {
      const a = siteSettings.about;
      setAboutForm({
        overviewTitle: a.overviewTitle || '',
        overviewText: a.overviewText || '',
        quoteText: a.quoteText || '',
        quoteAuthor: a.quoteAuthor || '',
        quoteRole: a.quoteRole || '',
        quoteImage: a.quoteImage || '',
        foundingStory: a.foundingStory || '',
        foundingStorySecond: a.foundingStorySecond || '',
        corePositioning: a.corePositioning || siteSettings.corePositioning || '',
        visionText: a.visionText || '',
        missionListText: Array.isArray(a.missionList) ? a.missionList.join('\n') : ''
      });
    }
  }, [siteSettings]);

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const missionList = aboutForm.missionListText
        .split('\n')
        .map(m => m.trim())
        .filter(Boolean);

      const payload = {
        overviewTitle: aboutForm.overviewTitle.trim(),
        overviewText: aboutForm.overviewText.trim(),
        quoteText: aboutForm.quoteText.trim(),
        quoteAuthor: aboutForm.quoteAuthor.trim(),
        quoteRole: aboutForm.quoteRole.trim(),
        quoteImage: aboutForm.quoteImage.trim(),
        foundingStory: aboutForm.foundingStory.trim(),
        foundingStorySecond: aboutForm.foundingStorySecond.trim(),
        corePositioning: aboutForm.corePositioning.trim(),
        visionText: aboutForm.visionText.trim(),
        missionList
      };

      const res = await fetch('/api/site-settings/about', {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('About section and company vision saved to database!');
        if (onRefreshData) onRefreshData();
      } else {
        setErrorMsg(data.message || 'Failed to save about section');
      }
    } catch (err) {
      setErrorMsg('Network error while saving about section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cms-submodule">
      <div className="pane-header">
        <h2>Company Overview, Mission & Vision CMS</h2>
        <p>Manage the official founding story, CEO executive quote, core positioning, and strategic mission pillars.</p>
      </div>

      {errorMsg && (
        <div className="alert-box alert-error" style={{ marginBottom: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveAbout}>
        {/* SECTION A: HOME OVERVIEW & CEO QUOTE */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderRadius: '14px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Home Page Company Overview & Executive Quote</h3>

          <div className="form-group">
            <label className="form-label">Overview Heading *</label>
            <input 
              type="text" 
              className="form-input"
              value={aboutForm.overviewTitle}
              onChange={(e) => setAboutForm({ ...aboutForm, overviewTitle: e.target.value })}
              placeholder="Building the Future of Regional Tech Education & Enterprise Software"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Overview Narrative Paragraph *</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={aboutForm.overviewText}
              onChange={(e) => setAboutForm({ ...aboutForm, overviewText: e.target.value })}
              placeholder="Headquartered in Sakoli, Maharashtra..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">CEO Quote Statement</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={aboutForm.quoteText}
              onChange={(e) => setAboutForm({ ...aboutForm, quoteText: e.target.value })}
              placeholder="Our mission is straightforward: Every student trained at NK SkillEdge must possess..."
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Quote Author Name</label>
              <input 
                type="text" 
                className="form-input"
                value={aboutForm.quoteAuthor}
                onChange={(e) => setAboutForm({ ...aboutForm, quoteAuthor: e.target.value })}
                placeholder="Mr. Kartik Mendhe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quote Author Title / Role</label>
              <input 
                type="text" 
                className="form-input"
                value={aboutForm.quoteRole}
                onChange={(e) => setAboutForm({ ...aboutForm, quoteRole: e.target.value })}
                placeholder="Chief Executive Officer (CEO)"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Author Photo URL</label>
            <input 
              type="text" 
              className="form-input"
              value={aboutForm.quoteImage}
              onChange={(e) => setAboutForm({ ...aboutForm, quoteImage: e.target.value })}
              placeholder="https://i.ibb.co/..."
            />
          </div>
        </div>

        {/* SECTION B: FOUNDING STORY & POSITIONING */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderRadius: '14px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>About Page Story & Core Positioning</h3>

          <div className="form-group">
            <label className="form-label">Founding Story (Paragraph 1)</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={aboutForm.foundingStory}
              onChange={(e) => setAboutForm({ ...aboutForm, foundingStory: e.target.value })}
              placeholder="Founded in Sakoli, Maharashtra, NK SkillEdge Pvt. Ltd. was born..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Founding Story (Paragraph 2)</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={aboutForm.foundingStorySecond}
              onChange={(e) => setAboutForm({ ...aboutForm, foundingStorySecond: e.target.value })}
              placeholder="Instead of requiring students to travel to distant metros..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Core Positioning Statement</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={aboutForm.corePositioning}
              onChange={(e) => setAboutForm({ ...aboutForm, corePositioning: e.target.value })}
              placeholder="NK SkillEdge empowers students and professionals through practical training..."
            />
          </div>
        </div>

        {/* SECTION C: VISION & MISSION CHECKLIST */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderRadius: '14px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Vision & Mission Checklist</h3>

          <div className="form-group">
            <label className="form-label">Vision Statement *</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={aboutForm.visionText}
              onChange={(e) => setAboutForm({ ...aboutForm, visionText: e.target.value })}
              placeholder="Build a trusted ecosystem that seamlessly connects skills, technology..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mission Checklist Points (One mission objective per line) *</label>
            <textarea 
              className="form-textarea"
              rows={5}
              value={aboutForm.missionListText}
              onChange={(e) => setAboutForm({ ...aboutForm, missionListText: e.target.value })}
              placeholder="Deliver practical, industry-oriented education without theoretical fluff.&#10;Build employment-ready engineering talent with live project portfolios."
              required
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          <Save size={18} /> {saving ? 'Saving to Database...' : 'Save About & Vision to Database'}
        </button>
      </form>
    </div>
  );
}
