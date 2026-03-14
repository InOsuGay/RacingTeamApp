# 🏎️ F1 Racing Management — Backend API

Node.js + Express + MySQL

---

## 📁 โครงสร้างไฟล์

```
f1-backend/
├── server.js               ← Entry point
├── .env.example            ← ตัวอย่าง environment variables
├── package.json
├── config/
│   └── db.js               ← MySQL connection pool
├── migrations/
│   └── migrate.js          ← สร้างตาราง DB ทั้งหมด
├── routes/
│   └── index.js            ← รวม routes ทุกตาราง
├── controllers/
│   ├── users.js
│   ├── teams.js
│   ├── drivers.js
│   ├── cars.js
│   ├── seasons.js
│   ├── races.js
│   └── results.js
└── middleware/
    └── errorHandler.js     ← Error handler กลาง
```

---

## ⚙️ วิธีติดตั้งและใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

```bash
cp .env.example .env
# แก้ไข .env ให้ตรงกับ MySQL ของตัวเอง
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=f1_racing
PORT=3000
```

### 3. รัน Migration (สร้างตารางทั้งหมด)

```bash
npm run migrate
```

### 4. เริ่มเซิร์ฟเวอร์

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## 🔗 API Endpoints

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | /api/users             | ดู users ทั้งหมด        |
| POST   | /api/users             | เพิ่ม user              |
| GET    | /api/users/:id         | ดู user รายคน           |
| PUT    | /api/users/:id         | แก้ไข user              |
| DELETE | /api/users/:id         | ลบ user                 |
| GET    | /api/teams             | ดู teams ทั้งหมด        |
| POST   | /api/teams             | เพิ่ม team              |
| GET    | /api/teams/:id         | ดู team รายทีม          |
| PUT    | /api/teams/:id         | แก้ไข team              |
| DELETE | /api/teams/:id         | ลบ team                 |
| GET    | /api/drivers           | ดู drivers ทั้งหมด      |
| POST   | /api/drivers           | เพิ่ม driver            |
| GET    | /api/drivers/:id       | ดู driver รายคน         |
| PUT    | /api/drivers/:id       | แก้ไข driver            |
| DELETE | /api/drivers/:id       | ลบ driver               |
| GET    | /api/cars              | ดู cars ทั้งหมด         |
| POST   | /api/cars              | เพิ่ม car               |
| GET    | /api/cars/:id          | ดู car รายคัน           |
| PUT    | /api/cars/:id          | แก้ไข car               |
| DELETE | /api/cars/:id          | ลบ car                  |
| GET    | /api/seasons           | ดู seasons ทั้งหมด      |
| POST   | /api/seasons           | เพิ่ม season            |
| GET    | /api/seasons/:id/races | ดู races ของ season นี้ |
| GET    | /api/races             | ดู races ทั้งหมด        |
| POST   | /api/races             | เพิ่ม race              |
| GET    | /api/races/:id/results | ดูผลแข่งของ race นี้    |
| GET    | /api/results           | ดูผลแข่งทั้งหมด         |
| POST   | /api/results           | เพิ่มผลแข่ง             |
| PUT    | /api/results/:id       | แก้ไขผลแข่ง             |
| DELETE | /api/results/:id       | ลบผลแข่ง                |

---

## 📨 ตัวอย่าง Request Body

### POST /api/drivers

```json
{
  "team_id": 1,
  "first_name": "Max",
  "last_name": "Verstappen",
  "driver_number": 1
}
```

### POST /api/results

```json
{
  "race_id": 1,
  "driver_id": 1,
  "car_id": 1,
  "finish_position": 1,
  "is_fastest_lap": true,
  "status": "Finished",
  "points_earned": 25
}
```

---

## 📦 Dependencies

| Package | ใช้ทำอะไร              |
| ------- | ---------------------- |
| express | Web framework          |
| mysql2  | MySQL driver (Promise) |
| dotenv  | อ่าน .env file         |
| cors    | Cross-origin requests  |
| nodemon | Auto-restart (dev)     |
