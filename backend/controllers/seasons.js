const { pool } = require('../config/db');

// GET /api/seasons
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM Seasons ORDER BY year DESC');
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/seasons/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM Seasons WHERE season_id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Season not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// GET /api/seasons/:id/races  — races ทั้งหมดในฤดูกาลนี้
async function getRaces(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Races WHERE season_id=? ORDER BY race_date ASC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// POST /api/seasons
async function create(req, res, next) {
  try {
    const { year } = req.body;
    if (!year) return res.status(400).json({ success: false, message: 'year is required' });
    const [result] = await pool.query('INSERT INTO Seasons (year) VALUES (?)', [year]);
    res.status(201).json({ success: true, data: { season_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/seasons/:id
async function update(req, res, next) {
  try {
    const { year } = req.body;
    const [result] = await pool.query('UPDATE Seasons SET year=? WHERE season_id=?', [year, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Season not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/seasons/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Seasons WHERE season_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Season not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, getRaces, create, update, remove };
