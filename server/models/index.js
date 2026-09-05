const { getModel } = require('../config/db');

module.exports = {
  User: getModel('users'),
  Lead: getModel('leads'),
  Registration: getModel('registrations'),
  InternshipApp: getModel('internship_apps'),
  JobApplication: getModel('job_applications'),
  Service: getModel('services'),
  Program: getModel('programs'),
  Project: getModel('projects'),
  TeamMember: getModel('team_members'),
  Client: getModel('clients'),
  Testimonial: getModel('testimonials'),
  SuccessStory: getModel('success_stories'),
  BlogPost: getModel('blogs'),
  Event: getModel('events'),
  JobOpening: getModel('jobs'),
  FAQ: getModel('faqs'),
  Certification: getModel('certifications'),
  Certificate: getModel('certificates'),
  SiteSetting: getModel('site_settings'),
  Notification: getModel('notifications'),
  AuditLog: getModel('audit_logs'),
  Branch: getModel('branches'),
  Media: getModel('media')
};
