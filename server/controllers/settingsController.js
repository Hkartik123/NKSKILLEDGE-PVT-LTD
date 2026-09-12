const { SiteSetting } = require('../models');
const { logAuditAction } = require('../services/auditService');

const DEFAULT_SETTINGS = {
  companyName: 'NK SkillEdge Pvt. Ltd.',
  tagline: 'Shaping Skills, Building Futures',
  brandLine: 'One Company — Many Solutions — Unlimited Possibilities',
  logo: 'https://i.ibb.co/1fbFtjTr/Untitled-design-removebg-preview.png',
  corePositioning: 'NK SkillEdge empowers students and professionals through practical training, industry exposure, and real-world learning, while also providing digital solutions to businesses and startups.',
  phones: ['7498784109', '9356049629'],
  email: 'hmendhe72@gmail.com',
  office: 'NK SkillEdge Pvt. Ltd., Near Gobade Hospital, Sakoli',
  city: 'Sakoli',
  state: 'Maharashtra',
  pincode: '441802',
  whatsappNumber: '7498784109',
  hero: {
    badgeText: 'Government Recognized & ISO 9001:2015 Certified Center',
    title: 'Shaping Skills, Building Futures.',
    subtitle: 'One Company — Many Solutions — Unlimited Possibilities',
    brandLine: 'One Company — Many Solutions — Unlimited Possibilities',
    description: 'Empowering students through practical training, industry exposure and real-world learning, while architecting modern digital solutions for businesses and startups.',
    ctaPrimaryText: 'Explore Programs',
    ctaPrimaryLink: '#programs',
    ctaSecondaryText: 'Get a Business Consultation',
    ctaSecondaryLink: '#contact',
    applyBtnText: 'Apply Now',
    trustSignals: [
      'Sakoli Hardware & Tech Lab',
      'Live Client Software Projects',
      '100% Verifiable Credentials'
    ],
    terminalTag: 'NK SkillEdge • Terminal',
    terminalDomain: 'Full Stack / AI / IoT',
    terminalMode: 'Live Industry Execution',
    terminalOutcome: 'Employment-Ready Engineer',
    isVisible: true
  },
  announcementBar: {
    enabled: false,
    text: 'Admissions Open: Industrial Training & MERN Stack Engineering Batch 2026! Limited Seats Available.',
    link: '#programs',
    badge: 'NEW BATCH',
    priority: 1
  },
  about: {
    overviewTitle: 'Building the Future of Regional Tech Education & Enterprise Software',
    overviewText: 'Headquartered in Sakoli, Maharashtra, NK SkillEdge Pvt. Ltd. bridges the critical divide between textbook engineering curricula and modern tech industry demands. We nurture aspiring engineers through project-based industrial apprenticeships while delivering robust, secure digital solutions to businesses.',
    quoteText: 'Our mission is straightforward: Every student trained at NK SkillEdge must possess verifiable code repositories and the practical confidence to solve real business challenges from day one.',
    quoteAuthor: 'Mr. Kartik Mendhe',
    quoteRole: 'Chief Executive Officer (CEO)',
    quoteImage: 'https://i.ibb.co/MDwcPjPq/Whats-App-Image-2026-02-02-at-9-21-25-PM.jpg',
    foundingStory: 'Founded in Sakoli, Maharashtra, NK SkillEdge Pvt. Ltd. was born out of a clear realization: talented engineering and diploma students in regional districts frequently lacked access to production-grade software development environments, enterprise mentorship, and live client pipelines.',
    foundingStorySecond: 'Instead of requiring students to travel to saturated metros like Pune or Bangalore, we created a localized powerhouse: a modern innovation center providing high-speed hardware labs, cloud sandboxes, and experienced software engineers who train students on live commercial applications.',
    corePositioning: 'NK SkillEdge empowers students and professionals through practical training, industry exposure, and real-world learning, while also providing digital solutions to businesses and startups.',
    visionText: 'Build a trusted ecosystem that seamlessly connects skills, technology, education, and career opportunities for every aspiring technologist. We envision a technology landscape where geographic location is never a barrier to world-class software engineering excellence.',
    missionList: [
      'Deliver practical, industry-oriented education without theoretical fluff.',
      'Build employment-ready engineering talent with live project portfolios.',
      'Create innovative, secure software solutions for businesses and startups.',
      'Promote local digital transformation and rural-urban tech equality.',
      'Cultivate a culture of lifelong learning, mentorship, and ethical engineering.'
    ]
  },
  stats: {
    studentsTrained: '200+',
    studentsPlaced: '50+',
    activeProjects: '15+',
    happyClients: '30+',
    projectsCompleted: '50+',
    upcomingProjects: '10+'
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/nkskilledge',
    instagram: 'https://instagram.com/nkskilledge',
    facebook: 'https://facebook.com/nkskilledge',
    youtube: 'https://youtube.com/@nkskilledge',
    whatsapp: 'https://wa.me/917498784109'
  }
};

function deepMerge(target, source) {
  const output = { ...target };
  if (source && typeof source === 'object' && !Array.isArray(source)) {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

async function getSettings(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(DEFAULT_SETTINGS);
    } else {
      // Ensure missing default sub-objects (like hero, announcementBar, about) exist
      let needsBackfill = false;
      const merged = deepMerge(DEFAULT_SETTINGS, settings);
      if (!settings.hero || !settings.announcementBar || !settings.about) {
        needsBackfill = true;
      }
      if (needsBackfill) {
        settings = await SiteSetting.findByIdAndUpdate(settings._id, merged);
      } else {
        settings = merged;
      }
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
}

async function updateSettings(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({ ...DEFAULT_SETTINGS, ...req.body });
      await logAuditAction(req.user, 'UPDATE_SITE_SETTINGS', 'Settings', req.body);
      return res.json({ success: true, message: 'Settings created successfully', settings });
    }

    const updatedData = deepMerge(settings, req.body);
    const updated = await SiteSetting.findByIdAndUpdate(settings._id, updatedData);
    await logAuditAction(req.user, 'UPDATE_SITE_SETTINGS', 'Settings', req.body);
    return res.json({ success: true, message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    console.error('Failed to update settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
}

// Dedicated endpoint to update statistics specifically
async function updateStats(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(DEFAULT_SETTINGS);
    }

    const newStats = {
      ...(settings.stats || DEFAULT_SETTINGS.stats),
      ...req.body
    };

    const updated = await SiteSetting.findByIdAndUpdate(settings._id, {
      ...settings,
      stats: newStats
    });
    await logAuditAction(req.user, 'UPDATE_STATISTICS', 'Settings', { stats: newStats });

    return res.json({ success: true, message: 'Company statistics updated', stats: newStats, settings: updated });
  } catch (err) {
    console.error('Failed to update stats:', err);
    return res.status(500).json({ success: false, message: 'Failed to update stats' });
  }
}

// Dedicated endpoint to update Hero Section
async function updateHero(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(DEFAULT_SETTINGS);
    }

    const newHero = deepMerge(settings.hero || DEFAULT_SETTINGS.hero, req.body);
    const updated = await SiteSetting.findByIdAndUpdate(settings._id, {
      ...settings,
      hero: newHero
    });
    await logAuditAction(req.user, 'UPDATE_HERO_SECTION', 'Settings', { hero: newHero });

    return res.json({ success: true, message: 'Hero section updated successfully', hero: newHero, settings: updated });
  } catch (err) {
    console.error('Failed to update hero:', err);
    return res.status(500).json({ success: false, message: 'Failed to update hero section' });
  }
}

// Dedicated endpoint to update Announcement Bar
async function updateAnnouncement(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(DEFAULT_SETTINGS);
    }

    const newAnnouncement = deepMerge(settings.announcementBar || DEFAULT_SETTINGS.announcementBar, req.body);
    const updated = await SiteSetting.findByIdAndUpdate(settings._id, {
      ...settings,
      announcementBar: newAnnouncement
    });
    await logAuditAction(req.user, 'UPDATE_ANNOUNCEMENT_BAR', 'Settings', { announcementBar: newAnnouncement });

    return res.json({ success: true, message: 'Announcement bar updated successfully', announcementBar: newAnnouncement, settings: updated });
  } catch (err) {
    console.error('Failed to update announcement:', err);
    return res.status(500).json({ success: false, message: 'Failed to update announcement bar' });
  }
}

// Dedicated endpoint to update About section
async function updateAbout(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(DEFAULT_SETTINGS);
    }

    const newAbout = deepMerge(settings.about || DEFAULT_SETTINGS.about, req.body);
    const updated = await SiteSetting.findByIdAndUpdate(settings._id, {
      ...settings,
      about: newAbout
    });
    await logAuditAction(req.user, 'UPDATE_ABOUT_SECTION', 'Settings', { about: newAbout });

    return res.json({ success: true, message: 'About section updated successfully', about: newAbout, settings: updated });
  } catch (err) {
    console.error('Failed to update about:', err);
    return res.status(500).json({ success: false, message: 'Failed to update about section' });
  }
}

module.exports = {
  getSettings,
  updateSettings,
  updateStats,
  updateHero,
  updateAnnouncement,
  updateAbout
};
