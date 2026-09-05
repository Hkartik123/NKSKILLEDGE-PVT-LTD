const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const { logAuditAction } = require('../services/auditService');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    await logAuditAction(user, 'LOGIN', 'Authentication', { ip: req.ip });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation
    };

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

async function me(req, res) {
  try {
    const user = req.user;
    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find();
    const safeUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      designation: u.designation,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, users: safeUsers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role, designation } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'admin',
      designation: designation || 'Staff Member'
    });

    await logAuditAction(req.user, 'CREATE_USER', 'Users', { createdUserId: newUser._id, role: newUser.role });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error creating user' });
  }
}

module.exports = {
  login,
  me,
  listUsers,
  createUser
};
