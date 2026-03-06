const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'racing_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ตรวจสอบการเชื่อมต่อ
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ!');
    connection.release();
  } catch (error) {
    console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', error.message);
  }
};

checkConnection();

module.exports = pool;
