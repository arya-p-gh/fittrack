import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_prod';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- Basic Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FitTrack Backend is running' });
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  const { id, email, password } = req.body;
  if (!id || !email || !password) return res.status(400).json({ error: 'ID, Email and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', [id, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === '23505') { // unique violation in pg
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- Protected Domain Routes (Requires Bearer Token) ---

// Workouts
app.get('/api/workouts', authenticateToken, async (req, res) => {
  try {
    const workoutsRes = await query('SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    if (workoutsRes.rows.length === 0) return res.json([]);

    const workoutIds = workoutsRes.rows.map(w => w.id);
    const exercisesRes = await query('SELECT * FROM exercises WHERE workout_id = ANY($1::varchar[])', [workoutIds]);
    
    // Stitch exercises to workouts
    const workouts = workoutsRes.rows.map(w => ({
      id: w.id,
      date: w.date,
      exercises: exercisesRes.rows.filter(e => e.workout_id === w.id).map(e => {
        const { workout_id, ...exercise } = e;
        return {
          ...exercise,
          weight: Number(exercise.weight) // pg returns decimals as strings
        };
      })
    }));
    
    res.status(200).json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/api/workouts', authenticateToken, async (req, res) => {
  const workouts = req.body;
  if (!Array.isArray(workouts)) return res.status(400).json({ error: 'Array required' });

  try {
    // Basic sync: Clear user's current workouts and re-insert
    await query('DELETE FROM workouts WHERE user_id = $1', [req.user.id]);

    for (const w of workouts) {
      await query('INSERT INTO workouts (id, user_id, date) VALUES ($1, $2, $3)', [w.id, req.user.id, w.date]);
      for (const e of w.exercises) {
        await query(
          'INSERT INTO exercises (id, workout_id, name, sets, reps, weight, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [e.id, w.id, e.name, e.sets, e.reps, e.weight, e.date]
        );
      }
    }
    res.status(201).json({ message: 'Workouts saved successfully' });
  } catch (err) {
    console.error('Error saving workouts:', err);
    res.status(500).json({ error: 'Failed to save workouts' });
  }
});

// Nutrition Logs
app.get('/api/nutrition', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM nutrition_logs WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
});

app.post('/api/nutrition', authenticateToken, async (req, res) => {
  const logs = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Array required' });
  
  try {
    await query('DELETE FROM nutrition_logs WHERE user_id = $1', [req.user.id]);
    for (const l of logs) {
      await query(
        'INSERT INTO nutrition_logs (id, user_id, date, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [l.id, req.user.id, l.date, l.calories, l.protein, l.carbs, l.fats]
      );
    }
    res.status(201).json({ message: 'Nutrition logs saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save nutrition logs' });
  }
});

// Personal Bests
app.get('/api/personal-bests', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM personal_bests WHERE user_id = $1', [req.user.id]);
    const pbs = result.rows.map(pb => ({
      exerciseName: pb.exercise_name, // Mapping column to frontend domain model
      weight: Number(pb.weight),
      date: pb.date
    }));
    res.status(200).json(pbs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch personal bests' });
  }
});

app.post('/api/personal-bests', authenticateToken, async (req, res) => {
  const pbs = req.body;
  if (!Array.isArray(pbs)) return res.status(400).json({ error: 'Array required' });

  try {
    await query('DELETE FROM personal_bests WHERE user_id = $1', [req.user.id]);
    for (const p of pbs) {
      await query(
        'INSERT INTO personal_bests (id, user_id, exercise_name, weight, date) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
        [req.user.id, p.exerciseName, p.weight, p.date]
      );
    }
    res.status(201).json({ message: 'Personal bests saved successfully' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save personal bests' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
