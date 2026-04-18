import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FitTrack Backend is running' });
});

// Example route testing DB connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.status(200).json({ status: 'success', time: result.rows[0].current_time });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to connect to database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
