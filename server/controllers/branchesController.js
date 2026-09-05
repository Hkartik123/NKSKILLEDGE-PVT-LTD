const { Branch } = require('../models');
const { logAudit } = require('../services/auditService');

// GET /api/branches - List all office branches
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    // Sort by displayOrder ascending
    branches.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    res.json({ success: true, count: branches.length, branches });
  } catch (err) {
    next(err);
  }
};

// GET /api/branches/:id
exports.getBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.json({ success: true, branch });
  } catch (err) {
    next(err);
  }
};

// POST /api/branches - Create branch
exports.createBranch = async (req, res, next) => {
  try {
    const { name, address, city, district, state, pincode, isMainBranch, mapEmbedUrl, phone, displayOrder } = req.body;
    if (!name || !address || !city) {
      return res.status(400).json({ success: false, message: 'Name, address, and city are required' });
    }

    const branch = await Branch.create({
      name,
      address,
      city,
      district: district || '',
      state: state || 'Maharashtra',
      pincode: pincode || '',
      isMainBranch: Boolean(isMainBranch),
      mapEmbedUrl: mapEmbedUrl || '',
      phone: phone || '',
      displayOrder: Number(displayOrder) || 1,
      createdAt: new Date().toISOString()
    });

    await logAudit(req.user ? req.user.email : 'System', 'CREATE_BRANCH', `Created office branch: ${name}`);
    res.status(201).json({ success: true, message: 'Office branch created successfully', branch });
  } catch (err) {
    next(err);
  }
};

// PUT /api/branches/:id - Update branch
exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    await logAudit(req.user ? req.user.email : 'System', 'UPDATE_BRANCH', `Updated branch ${branch.name}`);
    res.json({ success: true, message: 'Branch updated successfully', branch });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/branches/:id - Remove branch
exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    await logAudit(req.user ? req.user.email : 'System', 'DELETE_BRANCH', `Deleted branch ${branch.name}`);
    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (err) {
    next(err);
  }
};
