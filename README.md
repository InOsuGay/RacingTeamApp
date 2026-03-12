# RacingTeamApp

จัดให้เลยครับ! การมีไฟล์ `README.md` ที่ละเอียดและอ่านง่าย จะช่วยให้โปรเจกต์ดูเป็นมืออาชีพมากยิ่งขึ้น ไม่ว่าจะเอาไว้อ่านเอง เอาขึ้น GitHub หรือใช้เป็นเอกสารประกอบการส่งงานโปรเจกต์วิชาก็ตามครับ

คุณสามารถก๊อปปี้โค้ดด้านล่างนี้ไปวางในไฟล์ชื่อ `README.md` ในโฟลเดอร์โปรเจกต์ `racing-backend` ได้เลยครับ ตัวเว็บ GitHub หรือเครื่องมือเขียนโค้ดจะแปลงเป็นหน้าเอกสารสวยๆ ให้เองครับ

---

````markdown
# 🏎️ Racing Management System - Backend API

ระบบ Backend API สำหรับจัดการการแข่งขันรถยนต์และทีมแข่ง พัฒนาด้วย Node.js และ Express พร้อมระบบจัดการฐานข้อมูล MySQL ครอบคลุมการจัดการทีม นักแข่ง รถแข่ง และระบบคำนวณคะแนนการแข่งขันแบบอัตโนมัติ

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (ใช้งานผ่าน `mysql2`)
- **Environment:** `dotenv`
- **Containerization (Optional):** Docker & Docker Compose

## ✨ Features (ความสามารถของระบบ)

- **Team Management:** ลงทะเบียนและจัดการทีม (จำกัดสูงสุด 13 ทีม)
- **Driver & Car Management:** เพิ่มนักแข่งและรถแข่ง (จำกัดทีมละ 2 คน/คัน)
- **Race Results:** บันทึกผลการแข่งขันแต่ละสนาม
- **Auto-Scoring System:** คำนวณคะแนนอัตโนมัติ
  - ให้คะแนน 10 อันดับแรก (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
  - โบนัส +1 คะแนน สำหรับผู้ทำ Fastest Lap (ต้องจบใน Top 10 เท่านั้น)
- **Leaderboard:** ดูตารางคะแนนสะสมประเภททีม (Constructors' Championship)

---

## 🚀 Getting Started (วิธีการติดตั้งและรันโปรเจกต์)

### 1. สิ่งที่ต้องมี (Prerequisites)

- Node.js (v16 ขึ้นไป)
- MySQL Server หรือ Docker Desktop

### 2. การติดตั้ง (Installation)

1. โคลนโปรเจกต์หรือสร้างโฟลเดอร์ แล้วเข้าไปที่โฟลเดอร์นั้น
2. รันคำสั่งติดตั้ง Dependencies:
   ```bash
   npm install express mysql2 cors dotenv
   npm install --save-dev nodemon
   ```
````

### 3. ตั้งค่าตัวแปรแวดล้อม (Environment Variables)

สร้างไฟล์ `.env` ไว้ที่โฟลเดอร์นอกสุด (Root directory) และกำหนดค่าสำหรับการเชื่อมต่อฐานข้อมูล:

```env
DB_HOST=localhost
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=racing_management
PORT=3000

```

### 4. การเตรียมฐานข้อมูล (Database Setup)

**วิธีที่ 1: รันผ่าน Docker (แนะนำ)**
ใช้ไฟล์ `docker-compose.yml` ที่มีอยู่ แล้วรันคำสั่ง:

```bash
docker-compose up -d

```

**วิธีที่ 2: ใช้ MySQL Server ในเครื่อง**

1. สร้างผู้ใช้งานและให้สิทธิ์ (Grant Privileges):

```sql
CREATE USER 'devuser'@'localhost' IDENTIFIED BY 'devpassword';
GRANT ALL PRIVILEGES ON racing_management.* TO 'devuser'@'localhost';
FLUSH PRIVILEGES;

```

2. นำโค้ด SQL จากไฟล์ `database.sql` (หรือ ER Diagram) ไปรันเพื่อสร้างตาราง

### 5. รันเซิร์ฟเวอร์ (Running the Server)

เริ่มต้นการทำงานของ Backend API:

```bash
npm start

```

_(Server จะทำงานอยู่ที่ `http://localhost:3000`)_

---

## 📡 API Endpoints (คู่มือการใช้งาน API)

### 1. เพิ่มทีมใหม่ (Create Team)

- **URL:** `POST /api/teams`
- **Body (JSON):**

```json
{
  "name": "Red Bull Racing",
  "contact_info": "contact@redbull.com",
  "manager_id": 1
}
```

### 2. เพิ่มนักแข่ง (Add Driver)

- **URL:** `POST /api/drivers`
- **Body (JSON):**

```json
{
  "team_id": 1,
  "first_name": "Max",
  "last_name": "Verstappen",
  "driver_number": 1
}
```

### 3. เพิ่มรถแข่ง (Add Car)

- **URL:** `POST /api/cars`
- **Body (JSON):**

```json
{
  "team_id": 1,
  "brand": "Honda",
  "model": "RB19",
  "car_number": 1,
  "specs": "V6 Turbo Hybrid"
}
```

### 4. บันทึกผลการแข่ง (Submit Race Result)

- **URL:** `POST /api/results`
- **Body (JSON):**

```json
{
  "race_id": 1,
  "driver_id": 1,
  "car_id": 1,
  "finish_position": 1,
  "is_fastest_lap": true,
  "status": "Finished"
}
```

### 5. ดูตารางคะแนนประเภททีม (Get Team Standings)

- **URL:** `GET /api/standings/teams`
- **Response (JSON):**

```json
[
  {
    "team_name": "Red Bull Racing",
    "total_points": 26
  }
]
```

---

## 🗂️ Project Structure (โครงสร้างไฟล์)

```text
racing-backend/
├── node_modules/       # โฟลเดอร์เก็บไลบรารี
├── .env                # ไฟล์เก็บตั้งค่าฐานข้อมูล (ห้ามอัปขึ้น GitHub)
├── docker-compose.yml  # ไฟล์คอนฟิกสำหรับรัน Database ด้วย Docker
├── package.json        # ไฟล์จัดการ Dependencies
├── server.js           # โค้ดหลักของ Backend API
└── README.md           # ไฟล์อธิบายโปรเจกต์

```

```

---

ไฟล์นี้น่าจะช่วยให้คุณและทีมเห็นภาพรวมได้ชัดเจนเลยครับว่าโปรเจกต์มีข้อจำกัดอะไรบ้าง รันยังไง และมี API เส้นไหนให้ฝั่งหน้าเว็บ (Frontend) ยิงมาเรียกใช้ได้บ้าง อยากให้ผมช่วยดูส่วนไหนเพิ่มเติมเกี่ยวกับการเอาไปใช้ส่งงานไหมครับ?

```
