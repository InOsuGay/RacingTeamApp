const { pool } = require('../config/db');

// GET /api/cars
async function getAll(req, res, next) {
  try {
    const { manager_id } = req.query;
    let sql = `
      SELECT c.*, t.name AS team_name
      FROM Cars c
      LEFT JOIN Teams t ON c.team_id = t.team_id
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

// GET /api/cars/:id
async function getById(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, t.name AS team_name
      FROM Cars c
      LEFT JOIN Teams t ON c.team_id = t.team_id
      WHERE c.car_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

// POST /api/cars
async function create(req, res, next) {
  try {
    const { team_id, brand, model, car_number, specs } = req.body;
    if (!brand) return res.status(400).json({ success: false, message: 'brand is required' });
    const [result] = await pool.query(
      'INSERT INTO Cars (team_id, brand, model, car_number, specs) VALUES (?, ?, ?, ?, ?)',
      [team_id || null, brand, model || null, car_number || null, specs || null]
    );
    res.status(201).json({ success: true, data: { car_id: result.insertId } });
  } catch (err) { next(err); }
}

// PUT /api/cars/:id
async function update(req, res, next) {
  try {
    const { team_id, brand, model, car_number, specs } = req.body;
    const [result] = await pool.query(
      'UPDATE Cars SET team_id=?, brand=?, model=?, car_number=?, specs=? WHERE car_id=?',
      [team_id, brand, model, car_number, specs, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) { next(err); }
}

// DELETE /api/cars/:id
async function remove(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM Cars WHERE car_id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
