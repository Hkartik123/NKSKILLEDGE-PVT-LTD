const { Media } = require('../models');
const { logAudit } = require('../services/auditService');

// GET /api/media - List all media assets
exports.getMedia = async (req, res, next) => {
  try {
    const { folder } = req.query;
    const query = folder ? { folder } : {};
    const media = await Media.find(query);
    // Sort recent first
    media.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json({ success: true, count: media.length, media });
  } catch (err) {
    next(err);
  }
};

// POST /api/media - Upload/Add media asset
exports.uploadMedia = async (req, res, next) => {
  try {
    const { name, url, folder, altText, mimeType, size } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Media URL or Data is required' });
    }

    const item = await Media.create({
      name: name || 'Media Asset ' + Date.now(),
      url,
      folder: folder || 'General',
      altText: altText || name || 'NK SkillEdge media asset',
      mimeType: mimeType || 'image/jpeg',
      size: size || 'Optimized',
      createdAt: new Date().toISOString()
    });

    await logAudit(req.user ? req.user.email : 'System', 'UPLOAD_MEDIA', `Added media asset: ${item.name} in folder ${item.folder}`);
    res.status(201).json({ success: true, message: 'Media uploaded successfully', media: item });
  } catch (err) {
    next(err);
  }
};

// PUT /api/media/:id - Update media metadata
exports.updateMedia = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    await logAudit(req.user ? req.user.email : 'System', 'UPDATE_MEDIA', `Updated media asset ${item.name}`);
    res.json({ success: true, message: 'Media updated successfully', media: item });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/media/:id - Remove media asset
exports.deleteMedia = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    await logAudit(req.user ? req.user.email : 'System', 'DELETE_MEDIA', `Deleted media asset ${item.name}`);
    res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (err) {
    next(err);
  }
};
