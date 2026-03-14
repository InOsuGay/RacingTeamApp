const { pool } = require('../config/db');

// GET /api/users
async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, role FROM Users'
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/users/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, role FROM Users WHERE user_id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// POST /api/users
async function create(req, res, next) {
  try {
    const { username, password_hash, role } = req.body;
    if (!username || !password_hash || !role) {
      return res.status(400).json({ success: false, message: 'username, password_hash, role are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, password_hash, role]
    );
    res.status(201).json({ success: true, data: { user_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/users/:id
async function update(req, res, next) {
  try {
    const { username, password_hash, role } = req.body;
    const [result] = await pool.query(
      'UPDATE Users SET username=?, password_hash=?, role=? WHERE user_id=?',
      [username, password_hash, role, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/users/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Users WHERE user_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
