const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES FOR TEAMS ---
app.get('/api/teams', async (req, res) => {
  try {
    const [teams] = await db.query('SELECT * FROM Team');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTES FOR DRIVERS ---
app.get('/api/drivers', async (req, res) => {
  try {
    const [drivers] = await db.query(`
      SELECT d.*, t.team_name 
      FROM Driver d 
      LEFT JOIN Team t ON d.team_id = t.team_id
    `);
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/drivers', async (req, res) => {
  const { driver_name, age, nationality, team_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Driver (driver_name, age, nationality, team_id) VALUES (?, ?, ?, ?)',
      [driver_name, age, nationality, team_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/drivers/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Driver WHERE driver_id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTES FOR CARS ---
app.get('/api/cars', async (req, res) => {
  try {
    const [cars] = await db.query(`
      SELECT c.*, t.team_name 
      FROM Car c 
      LEFT JOIN Team t ON c.team_id = t.team_id
    `);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTES FOR RACES ---
app.get('/api/races', async (req, res) => {
  try {
    const [races] = await db.query('SELECT * FROM Race ORDER BY race_date DESC');
    res.json(races);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTES FOR RESULTS ---
app.get('/api/results', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT r.*, d.driver_name, rc.race_name 
      FROM Result r
      JOIN Driver d ON r.driver_id = d.driver_id
      JOIN Race rc ON r.race_id = rc.race_id
      ORDER BY rc.race_date DESC, r.position ASC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend is running on port ${PORT}`);
});