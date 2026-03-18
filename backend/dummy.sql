USE racing_management;

-- --------------------------------------------------------
-- 1. ข้อมูล Users (แยกตาม Role ชัดเจน)
-- --------------------------------------------------------
INSERT INTO Users (user_id, username, password_hash, role) VALUES
-- Admin (เข้าถึงได้ทุกอย่าง จัดการ Users/Seasons)
(1, 'admin_system', 'hash_admin_123', 'admin'),

-- Manager (เจ้าของงานแข่ง จัดการแข่งขันและผลลัพธ์)
(2, 'org_thailand_series', 'hash_mgr_123', 'manager'),
(3, 'org_endurance_cup', 'hash_mgr_456', 'manager'),

-- User (ทีมที่มาแข่ง จัดการทีม รถ และนักแข่งของตัวเอง)
(4, 'team_redbull', 'hash_usr_123', 'user'),
(5, 'team_toyota', 'hash_usr_456', 'user'),
(6, 'team_honda', 'hash_usr_789', 'user');


-- --------------------------------------------------------
-- 2. ข้อมูล Teams (ผูก manager_id เข้ากับ ID ของ User ที่เป็นทีม)
-- --------------------------------------------------------
INSERT INTO Teams (team_id, name, contact_info, manager_id) VALUES
(1, 'Red Bull Racing', 'contact@redbull.com', 4),  -- ผูกกับ User ID 4
(2, 'Toyota Gazoo Racing', 'info@toyota.com', 5),  -- ผูกกับ User ID 5
(3, 'Honda Racing', 'support@honda.com', 6);       -- ผูกกับ User ID 6


-- --------------------------------------------------------
-- 3. ข้อมูล Drivers (แบ่งตามทีม)
-- --------------------------------------------------------
INSERT INTO Drivers (driver_id, team_id, first_name, last_name, driver_number) VALUES
-- ทีม 1: Red Bull
(1, 1, 'Max', 'Verstappen', 1),
(2, 1, 'Sergio', 'Perez', 11),
-- ทีม 2: Toyota
(3, 2, 'Kalle', 'Rovanpera', 69),
(4, 2, 'Sebastien', 'Ogier', 17),
-- ทีม 3: Honda
(5, 3, 'Marc', 'Marquez', 93),
(6, 3, 'Joan', 'Mir', 36);


-- --------------------------------------------------------
-- 4. ข้อมูล Cars (แบ่งตามทีมให้สอดคล้องกับนักแข่ง)
-- --------------------------------------------------------
INSERT INTO Cars (car_id, team_id, brand, model, car_number, specs) VALUES
-- ทีม 1: Red Bull
(1, 1, 'Red Bull', 'RB20', 1, 'V6 Turbo Hybrid 1.6L'),
(2, 1, 'Red Bull', 'RB20', 11, 'V6 Turbo Hybrid 1.6L'),
-- ทีม 2: Toyota
(3, 2, 'Toyota', 'GR Yaris Rally1', 69, 'Inline-4 1.6L Turbo Hybrid'),
(4, 2, 'Toyota', 'GR Yaris Rally1', 17, 'Inline-4 1.6L Turbo Hybrid'),
-- ทีม 3: Honda
(5, 3, 'Honda', 'Civic Type R TCR', 93, 'Inline-4 2.0L Turbo'),
(6, 3, 'Honda', 'Civic Type R TCR', 36, 'Inline-4 2.0L Turbo');


-- --------------------------------------------------------
-- 5. ข้อมูล Seasons (สร้างโดย Admin)
-- --------------------------------------------------------
INSERT INTO Seasons (season_id, year) VALUES
(1, 2024),
(2, 2025);


-- --------------------------------------------------------
-- 6. ข้อมูล Races (สร้างโดย Manager ผู้จัดการแข่ง)
-- --------------------------------------------------------
INSERT INTO Races (race_id, season_id, race_name, location, race_date, total_laps) VALUES
(1, 1, 'Bangkok Street Circuit 2024', 'Bangkok, Thailand', '2024-05-15', 50),
(2, 1, 'Buriram Super GT', 'Chang International Circuit', '2024-08-20', 60),
(3, 2, 'Bangkok Street Circuit 2025', 'Bangkok, Thailand', '2025-05-18', 50);


-- --------------------------------------------------------
-- 7. ข้อมูล Race_Results (บันทึกโดย Manager)
-- สนามที่ 1: Bangkok Street Circuit 2024
-- --------------------------------------------------------
INSERT INTO Race_Results (race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned) VALUES
(1, 1, 1, 1, TRUE, 'Finished', 26),  -- Max ได้ที่ 1 + Fastest Lap
(1, 3, 3, 2, FALSE, 'Finished', 18), -- Kalle ได้ที่ 2
(1, 5, 5, 3, FALSE, 'Finished', 15), -- Marc ได้ที่ 3
(1, 2, 2, 4, FALSE, 'Finished', 12), -- Sergio ได้ที่ 4
(1, 4, 4, 5, FALSE, 'Finished', 10), -- Sebastien ได้ที่ 5
(1, 6, 6, NULL, FALSE, 'DNF', 0);    -- Joan รถเสีย (DNF)