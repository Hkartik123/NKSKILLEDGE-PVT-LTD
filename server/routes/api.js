const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const leadsCtrl = require('../controllers/leadsController');
const regCtrl = require('../controllers/registrationsController');
const internCtrl = require('../controllers/internshipsController');
const careersCtrl = require('../controllers/careersController');
const contentCtrl = require('../controllers/contentController');
const certCtrl = require('../controllers/certificatesController');
const settingsCtrl = require('../controllers/settingsController');
const analyticsCtrl = require('../controllers/analyticsController');
const searchCtrl = require('../controllers/searchController');
const branchesCtrl = require('../controllers/branchesController');
const mediaCtrl = require('../controllers/mediaController');

// --- Health Check ---
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NK SkillEdge API', timestamp: new Date().toISOString() });
});

// --- Authentication ---
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.me);
router.get('/auth/users', authenticate, authorize('super_admin'), authCtrl.listUsers);
router.post('/auth/users', authenticate, authorize('super_admin'), authCtrl.createUser);

// --- Leads & Contact Inquiries ---
router.post('/leads', leadsCtrl.createLead);
router.get('/leads', authenticate, authorize('super_admin', 'admin', 'training_manager'), leadsCtrl.getLeads);
router.put('/leads/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), leadsCtrl.updateLeadStatus);
router.delete('/leads/:id', authenticate, authorize('super_admin'), leadsCtrl.deleteLead);

// --- Training Registrations ---
router.post('/registrations', regCtrl.createRegistration);
router.get('/registrations', authenticate, authorize('super_admin', 'admin', 'training_manager'), regCtrl.getRegistrations);
router.put('/registrations/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), regCtrl.updateRegistrationStatus);

// --- Internship Applications ---
router.post('/internships/apply', internCtrl.applyInternship);
router.get('/internships/applications', authenticate, authorize('super_admin', 'admin', 'training_manager'), internCtrl.getInternshipApplications);
router.put('/internships/applications/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), internCtrl.updateInternshipStatus);

// --- Careers & Job Postings ---
router.get('/careers/jobs', careersCtrl.getJobs);
router.post('/careers/jobs', authenticate, authorize('super_admin', 'admin', 'recruitment_manager'), careersCtrl.createJob);
router.put('/careers/jobs/:id', authenticate, authorize('super_admin', 'admin', 'recruitment_manager'), careersCtrl.updateJob);
router.delete('/careers/jobs/:id', authenticate, authorize('super_admin', 'recruitment_manager'), careersCtrl.deleteJob);
router.post('/careers/apply', careersCtrl.applyJob);
router.get('/careers/applications', authenticate, authorize('super_admin', 'admin', 'recruitment_manager'), careersCtrl.getJobApplications);
router.put('/careers/applications/:id', authenticate, authorize('super_admin', 'admin', 'recruitment_manager'), careersCtrl.updateJobApplicationStatus);

// --- Services ---
router.get('/services', contentCtrl.services.getAll);
router.get('/services/:id', contentCtrl.services.getOne);
router.post('/services', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.services.create);
router.put('/services/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.services.update);
router.delete('/services/:id', authenticate, authorize('super_admin', 'content_manager'), contentCtrl.services.remove);

// --- Training Programs ---
router.get('/programs', contentCtrl.programs.getAll);
router.get('/programs/:id', contentCtrl.programs.getOne);
router.post('/programs', authenticate, authorize('super_admin', 'admin', 'training_manager'), contentCtrl.programs.create);
router.put('/programs/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), contentCtrl.programs.update);
router.delete('/programs/:id', authenticate, authorize('super_admin', 'training_manager'), contentCtrl.programs.remove);

// --- Projects Portfolio ---
router.get('/projects', contentCtrl.projects.getAll);
router.get('/projects/:id', contentCtrl.projects.getOne);
router.post('/projects', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.projects.create);
router.put('/projects/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.projects.update);
router.delete('/projects/:id', authenticate, authorize('super_admin', 'content_manager'), contentCtrl.projects.remove);

// --- Team & Leadership ---
router.get('/team', contentCtrl.team.getAll);
router.post('/team', authenticate, authorize('super_admin', 'admin'), contentCtrl.team.create);
router.put('/team/:id', authenticate, authorize('super_admin', 'admin'), contentCtrl.team.update);
router.delete('/team/:id', authenticate, authorize('super_admin'), contentCtrl.team.remove);

// --- Clients ---
router.get('/clients', contentCtrl.clients.getAll);
router.post('/clients', authenticate, authorize('super_admin', 'admin'), contentCtrl.clients.create);
router.put('/clients/:id', authenticate, authorize('super_admin', 'admin'), contentCtrl.clients.update);
router.delete('/clients/:id', authenticate, authorize('super_admin'), contentCtrl.clients.remove);

// --- Testimonials ---
router.get('/testimonials', contentCtrl.testimonials.getAll);
router.post('/testimonials', contentCtrl.testimonials.create); // Allows public submission pending review
router.put('/testimonials/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.testimonials.update);
router.delete('/testimonials/:id', authenticate, authorize('super_admin', 'content_manager'), contentCtrl.testimonials.remove);

// --- Success Stories ---
router.get('/success-stories', contentCtrl.successStories.getAll);
router.post('/success-stories', authenticate, authorize('super_admin', 'admin'), contentCtrl.successStories.create);
router.put('/success-stories/:id', authenticate, authorize('super_admin', 'admin'), contentCtrl.successStories.update);
router.delete('/success-stories/:id', authenticate, authorize('super_admin'), contentCtrl.successStories.remove);

// --- Blogs ---
router.get('/blogs', contentCtrl.blogs.getAll);
router.get('/blogs/:id', contentCtrl.blogs.getOne);
router.post('/blogs', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.blogs.create);
router.put('/blogs/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.blogs.update);
router.delete('/blogs/:id', authenticate, authorize('super_admin', 'content_manager'), contentCtrl.blogs.remove);

// --- Events & Workshops ---
router.get('/events', contentCtrl.events.getAll);
router.get('/events/:id', contentCtrl.events.getOne);
router.post('/events', authenticate, authorize('super_admin', 'admin', 'training_manager'), contentCtrl.events.create);
router.put('/events/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), contentCtrl.events.update);
router.delete('/events/:id', authenticate, authorize('super_admin', 'training_manager'), contentCtrl.events.remove);

// --- FAQs ---
router.get('/faqs', contentCtrl.faqs.getAll);
router.post('/faqs', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.faqs.create);
router.put('/faqs/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), contentCtrl.faqs.update);
router.delete('/faqs/:id', authenticate, authorize('super_admin', 'content_manager'), contentCtrl.faqs.remove);

// --- Certifications & Accreditations ---
router.get('/certifications', contentCtrl.certifications.getAll);
router.post('/certifications', authenticate, authorize('super_admin', 'admin'), contentCtrl.certifications.create);
router.put('/certifications/:id', authenticate, authorize('super_admin', 'admin'), contentCtrl.certifications.update);
router.delete('/certifications/:id', authenticate, authorize('super_admin'), contentCtrl.certifications.remove);

// --- Certificate Verification (PRD Section 58) ---
router.get('/certificates/verify/:certificateId', certCtrl.verifyCertificate);
router.get('/certificates', authenticate, authorize('super_admin', 'admin', 'training_manager'), certCtrl.listCertificates);
router.post('/certificates/issue', authenticate, authorize('super_admin', 'admin', 'training_manager'), certCtrl.issueCertificate);
router.put('/certificates/:id', authenticate, authorize('super_admin', 'admin', 'training_manager'), certCtrl.updateCertificate);

// --- Site Settings & Dynamic Statistics (PRD Section 4.3 & 73) ---
router.get('/site-settings', settingsCtrl.getSettings);
router.put('/site-settings', authenticate, authorize('super_admin', 'admin'), settingsCtrl.updateSettings);
router.put('/site-settings/stats', authenticate, authorize('super_admin', 'admin'), settingsCtrl.updateStats);
router.put('/site-settings/hero', authenticate, authorize('super_admin', 'admin'), settingsCtrl.updateHero);
router.put('/site-settings/announcement', authenticate, authorize('super_admin', 'admin'), settingsCtrl.updateAnnouncement);
router.put('/site-settings/about', authenticate, authorize('super_admin', 'admin'), settingsCtrl.updateAbout);

// --- Global Search (PRD Section 45) ---
router.get('/search', searchCtrl.globalSearch);

// --- Analytics & Dashboard Notifications ---
router.get('/analytics/dashboard', authenticate, analyticsCtrl.getDashboardStats);
router.get('/analytics/notifications', authenticate, analyticsCtrl.getNotifications);
router.put('/analytics/notifications/read', authenticate, analyticsCtrl.markNotificationsAsRead);
// --- Office Branches (Sakoli, Nagpur, Gondia) ---
router.get('/branches', branchesCtrl.getBranches);
router.get('/branches/:id', branchesCtrl.getBranch);
router.post('/branches', authenticate, authorize('super_admin', 'admin'), branchesCtrl.createBranch);
router.put('/branches/:id', authenticate, authorize('super_admin', 'admin'), branchesCtrl.updateBranch);
router.delete('/branches/:id', authenticate, authorize('super_admin'), branchesCtrl.deleteBranch);

// --- Media Library ---
router.get('/media', authenticate, mediaCtrl.getMedia);
router.post('/media', authenticate, authorize('super_admin', 'admin', 'content_manager'), mediaCtrl.uploadMedia);
router.put('/media/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), mediaCtrl.updateMedia);
router.delete('/media/:id', authenticate, authorize('super_admin', 'admin', 'content_manager'), mediaCtrl.deleteMedia);

module.exports = router;
