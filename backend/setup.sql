-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS racing_db;
USE racing_db;

-- สร้างตาราง Team (ทีมรถแข่ง)
CREATE TABLE IF NOT EXISTS Team (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  manager_name VARCHAR(100)
);

-- สร้างตาราง Driver (นักแข่ง)
CREATE TABLE IF NOT EXISTS Driver (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  age INT,
  nationality VARCHAR(50),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE SET NULL
);

-- สร้างตาราง Car (รถแข่ง)
CREATE TABLE IF NOT EXISTS Car (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  engine_type VARCHAR(100),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE SET NULL
);

-- สร้างตาราง Race (การแข่งขัน)
CREATE TABLE IF NOT EXISTS Race (
  race_id INT AUTO_INCREMENT PRIMARY KEY,
  race_name VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  race_date DATE
);

-- สร้างตาราง Result (ผลการแข่งขัน)
CREATE TABLE IF NOT EXISTS Result (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT,
  race_id INT,
  position INT,
  points INT,
  FOREIGN KEY (driver_id) REFERENCES Driver(driver_id) ON DELETE CASCADE,
  FOREIGN KEY (race_id) REFERENCES Race(race_id) ON DELETE CASCADE
);