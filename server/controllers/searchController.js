const models = require('../models');

async function globalSearch(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        results: {
          services: [],
          programs: [],
          projects: [],
          blogs: [],
          events: [],
          faqs: []
        }
      });
    }

    const term = q.trim().toLowerCase();

    // Search Services
    const allServices = await models.Service.find();
    const services = allServices.filter(s =>
      (s.title && s.title.toLowerCase().includes(term)) ||
      (s.shortDescription && s.shortDescription.toLowerCase().includes(term)) ||
      (s.features && s.features.some(f => f.toLowerCase().includes(term)))
    );

    // Search Programs
    const allPrograms = await models.Program.find();
    const programs = allPrograms.filter(p =>
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(term)) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(term)))
    );

    // Search Projects
    const allProjects = await models.Project.find();
    const projects = allProjects.filter(p =>
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.shortSummary && p.shortSummary.toLowerCase().includes(term)) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(term))) ||
      (p.category && p.category.toLowerCase().includes(term))
    );

    // Search Blogs
    const allBlogs = await models.BlogPost.find();
    const blogs = allBlogs.filter(b =>
      (b.title && b.title.toLowerCase().includes(term)) ||
      (b.summary && b.summary.toLowerCase().includes(term)) ||
      (b.category && b.category.toLowerCase().includes(term))
    );

    // Search Events
    const allEvents = await models.Event.find();
    const events = allEvents.filter(e =>
      (e.title && e.title.toLowerCase().includes(term)) ||
      (e.description && e.description.toLowerCase().includes(term)) ||
      (e.speaker && e.speaker.toLowerCase().includes(term))
    );

    // Search FAQs
    const allFaqs = await models.FAQ.find();
    const faqs = allFaqs.filter(f =>
      (f.question && f.question.toLowerCase().includes(term)) ||
      (f.answer && f.answer.toLowerCase().includes(term))
    );

    const totalMatches = services.length + programs.length + projects.length + blogs.length + events.length + faqs.length;

    return res.json({
      success: true,
      query: q,
      totalMatches,
      results: {
        services,
        programs,
        projects,
        blogs,
        events,
        faqs
      }
    });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ success: false, message: 'Global search error' });
  }
}

module.exports = {
  globalSearch
};
