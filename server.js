const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB first, then start server
connectDB().then(() => {

  const app = express();

  // ── Middleware ──
  app.use(cors({
    origin: ['https://hamedabdullahmachrur.netlify.app/'],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ── Routes ──
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/experiences', require('./routes/experiences'));
  app.use('/api/education', require('./routes/education'));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running ✅' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });

}).catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
