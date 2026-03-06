-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS racing_db;
USE racing_db;

-- 1. สร้างตาราง Team (ทีมรถแข่ง)
CREATE TABLE IF NOT EXISTS Team (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  manager_name VARCHAR(100)
);

-- 2. สร้างตาราง Driver (นักแข่ง)
CREATE TABLE IF NOT EXISTS Driver (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  age INT,
  nationality VARCHAR(50),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE SET NULL
);

-- 3. สร้างตาราง Car (รถแข่ง)
CREATE TABLE IF NOT EXISTS Car (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  engine_type VARCHAR(100),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE SET NULL
);

-- 4. สร้างตาราง Race (การแข่งขัน)
CREATE TABLE IF NOT EXISTS Race (
  race_id INT AUTO_INCREMENT PRIMARY KEY,
  race_name VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  race_date DATE
);

-- 5. สร้างตาราง Result (ผลการแข่งขัน)
CREATE TABLE IF NOT EXISTS Result (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT,
  race_id INT,
  position INT,
  points INT,
  FOREIGN KEY (driver_id) REFERENCES Driver(driver_id) ON DELETE CASCADE,
  FOREIGN KEY (race_id) REFERENCES Race(race_id) ON DELETE CASCADE
);

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO Team (team_name, country, manager_name) VALUES 
('Red Bull Racing', 'United Kingdom', 'Christian Horner'),
('Mercedes-AMG Petronas', 'United Kingdom', 'Toto Wolff'),
('Ferrari', 'Italy', 'Frédéric Vasseur');

INSERT INTO Driver (driver_name, age, nationality, team_id) VALUES 
('Max Verstappen', 26, 'Dutch', 1),
('Lewis Hamilton', 39, 'British', 2),
('Charles Leclerc', 26, 'Monegasque', 3),
('Lando Norris', 24, 'British', 1);

INSERT INTO Car (model, engine_type, team_id) VALUES 
('RB20', 'Honda RBPTH002 V6 t', 1),
('W15', 'Mercedes-AMG F1 M15', 2),
('SF-24', 'Ferrari 066/12 V6 t', 3);

INSERT INTO Race (race_name, location, race_date) VALUES 
('Bahrain Grand Prix', 'Sakhir, Bahrain', '2024-03-02'),
('Saudi Arabian Grand Prix', 'Jeddah, Saudi Arabia', '2024-03-09');

INSERT INTO Result (driver_id, race_id, position, points) VALUES 
(1, 1, 1, 25),
(3, 1, 3, 15),
(1, 2, 1, 25),
(2, 2, 9, 2);
