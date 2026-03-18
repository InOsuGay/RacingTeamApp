const { pool } = require('../config/db');

// GET /api/teams
async function getAll(req, res, next) {
  try {
    const { manager_id } = req.query;
    let sql = `
      SELECT t.*, u.username AS manager_name
      FROM Teams t
      LEFT JOIN Users u ON t.manager_id = u.user_id
    `;
    let params = [];
    if (manager_id) {
      sql += ' WHERE t.manager_id = ?';
      params.push(manager_id);
    }
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/teams/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, u.username AS manager_name
      FROM Teams t
      LEFT JOIN Users u ON t.manager_id = u.user_id
      WHERE t.team_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// POST /api/teams
async function create(req, res, next) {
  try {
    const { name, contact_info, manager_id } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const [result] = await pool.query(
      'INSERT INTO Teams (name, contact_info, manager_id) VALUES (?, ?, ?)',
      [name, contact_info || null, manager_id || null]
    );
    res.status(201).json({ success: true, data: { team_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/teams/:id
async function update(req, res, next) {
  try {
    const { name, contact_info, manager_id } = req.body;
    const [result] = await pool.query(
      'UPDATE Teams SET name=?, contact_info=?, manager_id=? WHERE team_id=?',
      [name, contact_info, manager_id, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/teams/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Teams WHERE team_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
