require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { testConnection }          = require('./config/db');
const routes                      = require('./routes/index');
const { errorHandler, notFound }  = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏎️ F1 Racing API is running' });
});

// ── API Routes ─────────────────────────────────────────
app.use('/api', routes);

// ── 404 & Error Handler ────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Base URL: http://localhost:${PORT}/api`);
  });
}

start();
