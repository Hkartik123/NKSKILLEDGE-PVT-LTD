const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./services/seedService');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api', apiRoutes);

// In production, serve the built React frontend
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  const indexHtml = path.join(clientDist, 'index.html');
  res.sendFile(indexHtml, err => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>NK SkillEdge API Server</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
          <h1>NK SkillEdge Pvt. Ltd. API Server is Running</h1>
          <p>Status: Healthy | Port: ${config.PORT}</p>
          <p>Access the React frontend on Vite dev server (e.g. port 5173) or run <code>npm run build</code>.</p>
        </body>
        </html>
      `);
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: config.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(config.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 NK SkillEdge Server running at http://localhost:${config.PORT}`);
      console.log(`📡 REST API available at http://localhost:${config.PORT}/api`);
      console.log(`💼 Super Admin: admin@nkskilledge.com | Admin@NK2025!`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
