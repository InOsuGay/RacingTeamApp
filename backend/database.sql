-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS racing_management;
USE racing_management;

-- 1. ตาราง Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'race_manager', 'team_manager') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตาราง Teams
CREATE TABLE Teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    contact_info TEXT,
    manager_id INT UNIQUE, -- ผูก 1 User ต่อ 1 Team
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- 3. ตาราง Drivers
CREATE TABLE Drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    driver_number INT NOT NULL UNIQUE,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

-- 4. ตาราง Cars
CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    car_number INT NOT NULL,
    specs TEXT,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

-- 5. ตาราง Seasons
CREATE TABLE Seasons (
    season_id INT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL UNIQUE
);

-- 6. ตาราง Races
CREATE TABLE Races (
    race_id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT,
    race_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    race_date DATE NOT NULL,
    total_laps INT NOT NULL,
    FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE
);

-- 7. ตาราง Race_Results
CREATE TABLE Race_Results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    race_id INT,
    driver_id INT,
    car_id INT,
    finish_position INT,
    is_fastest_lap BOOLEAN DEFAULT FALSE,
    status ENUM('Finished', 'DNF') DEFAULT 'Finished',
    points_earned INT DEFAULT 0,
    FOREIGN KEY (race_id) REFERENCES Races(race_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE SET NULL
);