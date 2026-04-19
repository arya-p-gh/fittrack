import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Always load .env relative to this file, regardless of cwd
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';

// ─── JWT Auth Middleware ──────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ─── Auth Routes (public) ─────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    await query('INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)', [userId, email, passwordHash]);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.', details: error.message, stack: error.stack });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const result = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── Exercise Definitions (protected but not user-scoped) ─────────────────────
app.get('/api/exercises', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM exercise_definitions ORDER BY muscle_group, name');
    res.json(rows.map(r => ({ id: r.id, name: r.name, muscleGroup: r.muscle_group, equipment: r.equipment, gifUrl: r.gif_url })));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// ─── Workouts (protected + user-scoped) ──────────────────────────────────────
app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const workoutsRes = await query('SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC', [req.userId]);
    const exercisesRes = await query(
      'SELECT e.* FROM exercises e JOIN workouts w ON e.workout_id = w.id WHERE w.user_id = $1',
      [req.userId]
    );
    const workouts = workoutsRes.rows.map(w => ({
      id: w.id,
      date: w.date,
      exercises: exercisesRes.rows
        .filter(e => e.workout_id === w.id)
        .map(e => ({ id: e.id, name: e.name, sets: e.sets, reps: e.reps, weight: Number(e.weight), date: e.date }))
    }));
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/api/workouts', authMiddleware, async (req, res) => {
  const workouts = req.body;
  try {
    await query('DELETE FROM workouts WHERE user_id = $1', [req.userId]);
    for (const workout of workouts) {
      await query('INSERT INTO workouts (id, user_id, date) VALUES ($1, $2, $3)', [workout.id, req.userId, workout.date]);
      for (const ex of workout.exercises || []) {
        await query(
          'INSERT INTO exercises (id, workout_id, name, sets, reps, weight, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [ex.id, workout.id, ex.name, ex.sets, ex.reps, ex.weight, ex.date]
        );
      }
    }
    res.status(200).json({ message: 'Workouts synced' });
  } catch (error) {
    console.error('Error syncing workouts:', error);
    res.status(500).json({ error: 'Failed to sync workouts' });
  }
});

// ─── Nutrition Logs (protected + user-scoped) ─────────────────────────────────
app.get('/api/nutrition', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM nutrition_logs WHERE user_id = $1 ORDER BY date DESC', [req.userId]);
    res.json(rows.map(r => ({ id: r.id, date: r.date, calories: r.calories, protein: r.protein, carbs: r.carbs, fats: r.fats })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
});

app.post('/api/nutrition', authMiddleware, async (req, res) => {
  const logs = req.body;
  try {
    await query('DELETE FROM nutrition_logs WHERE user_id = $1', [req.userId]);
    for (const log of logs) {
      await query(
        'INSERT INTO nutrition_logs (id, user_id, date, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [log.id, req.userId, log.date, log.calories, log.protein, log.carbs, log.fats]
      );
    }
    res.status(200).json({ message: 'Nutrition logs synced' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync nutrition logs' });
  }
});

// ─── Personal Bests (protected + user-scoped) ─────────────────────────────────
app.get('/api/personal-bests', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM personal_bests WHERE user_id = $1 ORDER BY date DESC', [req.userId]);
    res.json(rows.map(r => ({ exerciseName: r.exercise_name, weight: Number(r.weight), date: r.date })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personal bests' });
  }
});

app.post('/api/personal-bests', authMiddleware, async (req, res) => {
  const bests = req.body;
  try {
    await query('DELETE FROM personal_bests WHERE user_id = $1', [req.userId]);
    for (const best of bests) {
      const id = uuidv4();
      await query(
        'INSERT INTO personal_bests (id, user_id, exercise_name, weight, date) VALUES ($1, $2, $3, $4, $5)',
        [id, req.userId, best.exerciseName, best.weight, best.date]
      );
    }
    res.status(200).json({ message: 'Personal bests synced' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync personal bests' });
  }
});

// ─── Workout Templates (protected + user-scoped) ──────────────────────────────
app.get('/api/workout_templates', authMiddleware, async (req, res) => {
  try {
    const templatesRes = await query('SELECT * FROM workout_templates WHERE user_id = $1', [req.userId]);
    const exercisesRes = await query(
      'SELECT te.* FROM template_exercises te JOIN workout_templates wt ON te.template_id = wt.id WHERE wt.user_id = $1',
      [req.userId]
    );
    const templates = templatesRes.rows.map(t => ({
      id: t.id,
      name: t.name,
      exercises: exercisesRes.rows
        .filter(e => e.template_id === t.id)
        .map(e => ({ id: e.id, name: e.name, sets: e.sets, reps: e.reps, weight: Number(e.weight) }))
    }));
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

app.post('/api/workout_templates', authMiddleware, async (req, res) => {
  const templates = req.body;
  try {
    await query('DELETE FROM workout_templates WHERE user_id = $1', [req.userId]);
    for (const template of templates) {
      await query('INSERT INTO workout_templates (id, user_id, name) VALUES ($1, $2, $3)', [template.id, req.userId, template.name]);
      for (const ex of template.exercises || []) {
        const exId = ex.id || uuidv4();
        await query(
          'INSERT INTO template_exercises (id, template_id, name, sets, reps, weight) VALUES ($1, $2, $3, $4, $5, $6)',
          [exId, template.id, ex.name, ex.sets, ex.reps, ex.weight]
        );
      }
    }
    res.status(200).json({ message: 'Templates synced' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Failed to sync templates', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
