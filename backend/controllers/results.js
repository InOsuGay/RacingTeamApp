const { pool } = require('../config/db');

// GET /api/results
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT rr.*,
             d.first_name, d.last_name, d.driver_number,
             c.brand, c.model,
             r.race_name, r.race_date,
             t.name AS team_name
      FROM Race_Results rr
      LEFT JOIN Drivers d ON rr.driver_id = d.driver_id
      LEFT JOIN Cars    c ON rr.car_id    = c.car_id
      LEFT JOIN Races   r ON rr.race_id   = r.race_id
      LEFT JOIN Teams   t ON d.team_id    = t.team_id
      ORDER BY r.race_date ASC, rr.finish_position ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/results/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT rr.*,
             d.first_name, d.last_name, d.driver_number,
             c.brand, c.model,
             r.race_name, r.race_date,
             t.name AS team_name
      FROM Race_Results rr
      LEFT JOIN Drivers d ON rr.driver_id = d.driver_id
      LEFT JOIN Cars    c ON rr.car_id    = c.car_id
      LEFT JOIN Races   r ON rr.race_id   = r.race_id
      LEFT JOIN Teams   t ON d.team_id    = t.team_id
      WHERE rr.result_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// POST /api/results
async function create(req, res, next) {
  try {
    const { race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned } = req.body;
    if (!race_id || !driver_id || !car_id) {
      return res.status(400).json({ success: false, message: 'race_id, driver_id, car_id are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO Race_Results
         (race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [race_id, driver_id, car_id,
       finish_position || null,
       is_fastest_lap ?? false,
       status || 'Finished',
       points_earned || 0]
    );
    res.status(201).json({ success: true, data: { result_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/results/:id
async function update(req, res, next) {
  try {
    const { race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned } = req.body;
    const [result] = await pool.query(
      `UPDATE Race_Results
       SET race_id=?, driver_id=?, car_id=?, finish_position=?,
           is_fastest_lap=?, status=?, points_earned=?
       WHERE result_id=?`,
      [race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/results/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Race_Results WHERE result_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
