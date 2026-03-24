require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const facilityRoutes = require('./routes/facility');
const categoryRoutes = require('./routes/category');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// ── Rate Limiting ────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AccessCare API is running ✅', time: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start ─────────────────────────────────────────────
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 AccessCare API running at http://localhost:${PORT}`);
    });
    
    server.on('error', (err) => {
      console.error('💥 Server Error:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('💥 Failed to start server:', err.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
});

startServer();
