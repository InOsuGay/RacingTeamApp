const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

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

    const hashedPwd = await bcrypt.hash(password_hash, 10);

    const [result] = await pool.query(
      'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hashedPwd, role]
    );
    res.status(201).json({ success: true, data: { user_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/users/:id
async function update(req, res, next) {
  try {
    const { username, password_hash, role } = req.body;
    
    // Hash password before updating if it was provided
    let query, params;
    if (password_hash) {
      const hashedPwd = await bcrypt.hash(password_hash, 10);
      query = 'UPDATE Users SET username=?, password_hash=?, role=? WHERE user_id=?';
      params = [username, hashedPwd, role, req.params.id];
    } else {
      query = 'UPDATE Users SET username=?, role=? WHERE user_id=?';
      params = [username, role, req.params.id];
    }

    const [result] = await pool.query(query, params);
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

// POST /api/users/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'username and password are required' });
    }
    
    const [rows] = await pool.query(
      'SELECT user_id, username, password_hash, role FROM Users WHERE username = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = rows[0];

    // Check if the provided password matches the hash in the DB
    // Or allow fallback to plain password match (for older un-hashed DB records like kaikai)
    const isMatch = await bcrypt.compare(password, user.password_hash) || password === user.password_hash;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Return user without password
    delete user.password_hash;
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove, login };
