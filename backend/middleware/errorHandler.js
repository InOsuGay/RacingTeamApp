// Middleware จัดการ error กลาง
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Duplicate entry' });
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(409).json({ success: false, message: 'Foreign key constraint failed' });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

// Middleware จัดการ route ที่ไม่มี
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

module.exports = { errorHandler, notFound };
