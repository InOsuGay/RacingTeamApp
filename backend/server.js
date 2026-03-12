const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล (Database Connection)
// ---------------------------------------------------------
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'devuser',
    password: process.env.DB_PASSWORD || 'devpassword',
    database: process.env.DB_NAME || 'racing_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ---------------------------------------------------------
// 2. API จัดการทีม (จำกัดสูงสุด 13 ทีม)
// ---------------------------------------------------------
app.post('/api/teams', async (req, res) => {
    try {
        const { name, contact_info, manager_id } = req.body;

        // เช็คจำนวนทีมปัจจุบัน
        const [rows] = await pool.query('SELECT COUNT(*) AS teamCount FROM Teams');
        if (rows[0].teamCount >= 13) {
            return res.status(400).json({ error: "ระบบจำกัดจำนวนสูงสุดที่ 13 ทีมเท่านั้น" });
        }

        const [result] = await pool.query(
            'INSERT INTO Teams (name, contact_info, manager_id) VALUES (?, ?, ?)',
            [name, contact_info, manager_id]
        );
        res.status(201).json({ message: "สร้างทีมสำเร็จ", team_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// 3. API จัดการนักแข่ง (จำกัด 2 คน ต่อทีม)
// ---------------------------------------------------------
app.post('/api/drivers', async (req, res) => {
    try {
        const { team_id, first_name, last_name, driver_number } = req.body;

        // เช็คจำนวนนักแข่งในทีมนี้
        const [rows] = await pool.query('SELECT COUNT(*) AS driverCount FROM Drivers WHERE team_id = ?', [team_id]);
        if (rows[0].driverCount >= 2) {
            return res.status(400).json({ error: "ทีมนี้มีนักแข่งครบ 2 คนแล้ว" });
        }

        const [result] = await pool.query(
            'INSERT INTO Drivers (team_id, first_name, last_name, driver_number) VALUES (?, ?, ?, ?)',
            [team_id, first_name, last_name, driver_number]
        );
        res.status(201).json({ message: "เพิ่มนักแข่งสำเร็จ", driver_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// 4. API จัดการรถแข่ง (จำกัด 2 คัน ต่อทีม)
// ---------------------------------------------------------
app.post('/api/cars', async (req, res) => {
    try {
        const { team_id, brand, model, car_number, specs } = req.body;

        // เช็คจำนวนรถในทีมนี้
        const [rows] = await pool.query('SELECT COUNT(*) AS carCount FROM Cars WHERE team_id = ?', [team_id]);
        if (rows[0].carCount >= 2) {
            return res.status(400).json({ error: "ทีมนี้มีรถแข่งลงทะเบียนครบ 2 คันแล้ว" });
        }

        const [result] = await pool.query(
            'INSERT INTO Cars (team_id, brand, model, car_number, specs) VALUES (?, ?, ?, ?, ?)',
            [team_id, brand, model, car_number, specs]
        );
        res.status(201).json({ message: "ลงทะเบียนรถแข่งสำเร็จ", car_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// 5. API บันทึกผลการแข่งและคำนวณคะแนนอัตโนมัติ
// ---------------------------------------------------------
const calculatePoints = (position, isFastestLap) => {
    const pointsMap = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };
    let points = pointsMap[position] || 0; // ถ้าเกินอันดับ 10 จะได้ 0 คะแนน
    
    // บวกโบนัส Fastest Lap ถ้าจบใน 10 อันดับแรก
    if (points > 0 && isFastestLap) {
        points += 1;
    }
    return points;
};

app.post('/api/results', async (req, res) => {
    try {
        const { race_id, driver_id, car_id, finish_position, is_fastest_lap, status } = req.body;

        let pointsEarned = 0;
        if (status === 'Finished') {
            pointsEarned = calculatePoints(finish_position, is_fastest_lap);
        }

        const [result] = await pool.query(
            `INSERT INTO Race_Results 
            (race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [race_id, driver_id, car_id, finish_position, is_fastest_lap, status, pointsEarned]
        );
        res.status(201).json({ message: "บันทึกผลสำเร็จ", points_earned: pointsEarned });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// 6. API ดูตารางคะแนนสะสมประเภททีม (Constructors' Championship)
// ---------------------------------------------------------
app.get('/api/standings/teams', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.name AS team_name,
                SUM(rr.points_earned) AS total_points
            FROM Teams t
            JOIN Drivers d ON t.team_id = d.team_id
            JOIN Race_Results rr ON d.driver_id = rr.driver_id
            GROUP BY t.team_id
            ORDER BY total_points DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// เริ่มรัน Server
// ---------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Racing Backend Server is running on port ${PORT}`);
});