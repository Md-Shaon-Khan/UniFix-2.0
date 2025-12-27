require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, ensureDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const mlRoutes = require('./routes/mlRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: Date.now() }));

// Root route
app.get('/', (req, res) => {
  res.send('<h1>UniFix API</h1><p>Visit <a href="/api/health">/api/health</a> for health check.</p>');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/logs', logRoutes);

// Serve client build if it exists (production mode)
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // Fallback to client index.html for non-API routes
  app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Socket.io basic setup
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('subscribe', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Attach io to app for controllers/services
app.set('io', io);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Database connected and models synced');
  } catch (err) {
    console.warn('⚠️ Could not connect/sync database:', err.message || err);
  }

  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();

// Global error handler for Express
app.use((err, req, res, next) => {
  console.error('Unhandled Express error:', err && (err.stack || err.message || err));
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Catch unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err && (err.stack || err.message || err));
});
