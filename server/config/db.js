require('./config');

const prisma = require('../utils/prisma');
const { getCollection: getPrismaCollection } = require('./prismaStore');

async function connectDB() {
  await prisma.$connect();
  console.log('Connected to PostgreSQL database successfully.');
  return true;
}

function getModel(name) {
  return getPrismaCollection(prisma, name.toLowerCase());
}

module.exports = {
  connectDB,
  getModel,
  getCollection: getModel,
  disconnectDB: () => prisma.$disconnect()
};
