const app = require('../server');
const { connectDB } = require('../server/config/db');

let databaseConnection;

module.exports = async function handler(req, res) {
  try {
    if (!databaseConnection) {
      databaseConnection = connectDB().catch(error => {
        databaseConnection = undefined;
        throw error;
      });
    }

    await databaseConnection;
    return app(req, res);
  } catch (error) {
    const errorCode = error && typeof error === 'object' && 'code' in error
      ? error.code
      : error instanceof Error ? error.name : 'Unknown error';
    console.error('Unable to initialize the API database connection:', errorCode);
    return res.status(503).json({
      success: false,
      message: 'The API database is temporarily unavailable'
    });
  }
};
