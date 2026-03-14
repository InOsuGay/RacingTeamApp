const { pool } = require('../config/db');

// GET /api/races
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, s.year AS season_year
      FROM Races r
      LEFT JOIN Seasons s ON r.season_id = s.season_id
      ORDER BY r.race_date ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/races/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, s.year AS season_year
      FROM Races r
      LEFT JOIN Seasons s ON r.season_id = s.season_id
      WHERE r.race_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Race not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// GET /api/races/:id/results  — ผลการแข่งขันของ race นี้
async function getResults(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT rr.*,
             d.first_name, d.last_name, d.driver_number,
             c.brand, c.model, c.car_number,
             t.name AS team_name
      FROM Race_Results rr
      LEFT JOIN Drivers d ON rr.driver_id = d.driver_id
      LEFT JOIN Cars    c ON rr.car_id    = c.car_id
      LEFT JOIN Teams   t ON d.team_id    = t.team_id
      WHERE rr.race_id = ?
      ORDER BY rr.finish_position ASC
    `, [req.params.id]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// POST /api/races
async function create(req, res, next) {
  try {
    const { season_id, race_name, location, race_date, total_laps } = req.body;
    if (!race_name || !season_id) {
      return res.status(400).json({ success: false, message: 'season_id and race_name are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO Races (season_id, race_name, location, race_date, total_laps) VALUES (?, ?, ?, ?, ?)',
      [season_id, race_name, location || null, race_date || null, total_laps || null]
    );
    res.status(201).json({ success: true, data: { race_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/races/:id
async function update(req, res, next) {
  try {
    const { season_id, race_name, location, race_date, total_laps } = req.body;
    const [result] = await pool.query(
      'UPDATE Races SET season_id=?, race_name=?, location=?, race_date=?, total_laps=? WHERE race_id=?',
      [season_id, race_name, location, race_date, total_laps, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Race not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/races/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Races WHERE race_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Race not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, getResults, create, update, remove };
