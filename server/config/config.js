const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'nkskilledge_super_secret_jwt_key_2025',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OFFICIAL_INFO: {
    name: 'NK SkillEdge Pvt. Ltd.',
    tagline: 'Shaping Skills, Building Futures',
    phones: ['7498784109', '9356049629'],
    email: 'hmendhe72@gmail.com',
    office: 'NK SkillEdge Pvt. Ltd., Near Gobade Hospital, Sakoli',
    whatsapp: '7498784109'
  }
};
