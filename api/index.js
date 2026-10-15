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

    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const apiPath = requestUrl.searchParams.get('__nks_api_path') || '';
    requestUrl.searchParams.delete('__nks_api_path');
    const encodedPath = apiPath.split('/').map(encodeURIComponent).join('/');
    const query = requestUrl.searchParams.toString();
    req.url = `/api/${encodedPath}${query ? `?${query}` : ''}`;

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
