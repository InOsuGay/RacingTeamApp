-- 1. สร้างผู้ใช้งานชื่อ devuser และตั้งรหัสผ่านเป็น devpassword (แก้ได้ตามต้องการ)
CREATE USER 'devuser'@'localhost' IDENTIFIED BY 'devuser';

-- 2. ให้สิทธิ์ทุกอย่าง (เพิ่ม/ลบ/แก้ไขข้อมูล) เฉพาะในฐานข้อมูล racing_management
GRANT ALL PRIVILEGES ON racing_management.* TO 'devuser'@'localhost';

-- 3. รีเฟรชระบบเพื่อให้สิทธิ์ใหม่มีผลทันที
FLUSH PRIVILEGES;