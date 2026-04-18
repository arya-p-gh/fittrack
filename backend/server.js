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

// GET all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workoutsRes = await query('SELECT * FROM workouts ORDER BY date DESC');
    const exercisesRes = await query('SELECT * FROM exercises');
    
    // Stitch exercises to workouts
    const workouts = workoutsRes.rows.map(w => ({
      ...w,
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

// POST to save all Workouts (Bulk clear and insert for simplicity replacing LocalStorage sync logic)
app.post('/api/workouts', async (req, res) => {
  const workouts = req.body;
  if (!Array.isArray(workouts)) return res.status(400).json({ error: 'Array required' });

  try {
    // 1. Clear existing items (Simplistic sync)
    await query('DELETE FROM workouts');

    // 2. Insert new workouts and their exercises
    for (const w of workouts) {
      await query('INSERT INTO workouts (id, date) VALUES ($1, $2)', [w.id, w.date]);
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

// GET all Nutrition Logs
app.get('/api/nutrition', async (req, res) => {
  try {
    const result = await query('SELECT * FROM nutrition_logs ORDER BY date DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
});

// POST to save all Nutrition Logs
app.post('/api/nutrition', async (req, res) => {
  const logs = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Array required' });
  
  try {
    await query('DELETE FROM nutrition_logs');
    for (const l of logs) {
      await query(
        'INSERT INTO nutrition_logs (id, date, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6)',
        [l.id, l.date, l.calories, l.protein, l.carbs, l.fats]
      );
    }
    res.status(201).json({ message: 'Nutrition logs saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save nutrition logs' });
  }
});

// GET all Personal Bests
app.get('/api/personal-bests', async (req, res) => {
  try {
    const result = await query('SELECT * FROM personal_bests');
    const pbs = result.rows.map(pb => ({
      exerciseName: pb.exercise_name,
      weight: Number(pb.weight),
      date: pb.date
    }));
    res.status(200).json(pbs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch personal bests' });
  }
});

// POST to save all Personal Bests
app.post('/api/personal-bests', async (req, res) => {
  const pbs = req.body;
  if (!Array.isArray(pbs)) return res.status(400).json({ error: 'Array required' });

  try {
    await query('DELETE FROM personal_bests');
    for (const p of pbs) {
      await query(
        'INSERT INTO personal_bests (exercise_name, weight, date) VALUES ($1, $2, $3)',
        [p.exerciseName, p.weight, p.date]
      );
    }
    res.status(201).json({ message: 'Personal bests saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save personal bests' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
