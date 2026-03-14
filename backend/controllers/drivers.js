const { pool } = require('../config/db');

// GET /api/drivers
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, t.name AS team_name
      FROM Drivers d
      LEFT JOIN Teams t ON d.team_id = t.team_id
    `);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/drivers/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, t.name AS team_name
      FROM Drivers d
      LEFT JOIN Teams t ON d.team_id = t.team_id
      WHERE d.driver_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// POST /api/drivers
async function create(req, res, next) {
  try {
    const { team_id, first_name, last_name, driver_number } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'first_name and last_name are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO Drivers (team_id, first_name, last_name, driver_number) VALUES (?, ?, ?, ?)',
      [team_id || null, first_name, last_name, driver_number || null]
    );
    res.status(201).json({ success: true, data: { driver_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/drivers/:id
async function update(req, res, next) {
  try {
    const { team_id, first_name, last_name, driver_number } = req.body;
    const [result] = await pool.query(
      'UPDATE Drivers SET team_id=?, first_name=?, last_name=?, driver_number=? WHERE driver_id=?',
      [team_id, first_name, last_name, driver_number, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/drivers/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Drivers WHERE driver_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
