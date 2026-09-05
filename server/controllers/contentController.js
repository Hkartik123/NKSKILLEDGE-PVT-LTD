const models = require('../models');
const { logAuditAction } = require('../services/auditService');

// Helper generator for CRUD across CMS modules
function createCrudHandlers(modelName, collectionName) {
  return {
    getAll: async (req, res) => {
      try {
        const items = await models[modelName].find();
        return res.json({ success: true, count: items.length, data: items });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Error fetching ${collectionName}` });
      }
    },
    getOne: async (req, res) => {
      try {
        const { id } = req.params;
        let item = await models[modelName].findById(id);
        if (!item && req.params.slug) {
          item = await models[modelName].findOne({ slug: req.params.slug });
        }
        if (!item) {
          return res.status(404).json({ success: false, message: `${collectionName} item not found` });
        }
        return res.json({ success: true, data: item });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Error fetching item` });
      }
    },
    create: async (req, res) => {
      try {
        const newItem = await models[modelName].create(req.body);
        await logAuditAction(req.user, `CREATE_${collectionName.toUpperCase()}`, collectionName, { id: newItem._id });
        return res.status(201).json({ success: true, data: newItem });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Error creating ${collectionName}` });
      }
    },
    update: async (req, res) => {
      try {
        const { id } = req.params;
        const updated = await models[modelName].findByIdAndUpdate(id, req.body);
        if (!updated) {
          return res.status(404).json({ success: false, message: `${collectionName} not found` });
        }
        await logAuditAction(req.user, `UPDATE_${collectionName.toUpperCase()}`, collectionName, { id });
        return res.json({ success: true, data: updated });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Error updating ${collectionName}` });
      }
    },
    remove: async (req, res) => {
      try {
        const { id } = req.params;
        await models[modelName].findByIdAndDelete(id);
        await logAuditAction(req.user, `DELETE_${collectionName.toUpperCase()}`, collectionName, { id });
        return res.json({ success: true, message: `${collectionName} item deleted` });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Error deleting ${collectionName}` });
      }
    }
  };
}

module.exports = {
  services: createCrudHandlers('Service', 'Services'),
  programs: createCrudHandlers('Program', 'Programs'),
  projects: createCrudHandlers('Project', 'Projects'),
  team: createCrudHandlers('TeamMember', 'Team'),
  clients: createCrudHandlers('Client', 'Clients'),
  testimonials: createCrudHandlers('Testimonial', 'Testimonials'),
  successStories: createCrudHandlers('SuccessStory', 'SuccessStories'),
  blogs: createCrudHandlers('BlogPost', 'Blogs'),
  events: createCrudHandlers('Event', 'Events'),
  faqs: createCrudHandlers('FAQ', 'FAQs'),
  certifications: createCrudHandlers('Certification', 'Certifications')
};
