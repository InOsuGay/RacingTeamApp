-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS racing_management;
USE racing_management;

-- 1. ตาราง Users 
CREATE TABLE Users (
    user_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'manager') NOT NULL 
);

-- 2. ตาราง Teams 
CREATE TABLE Teams (
    team_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    contact_info TEXT,
    manager_id INT(11),
    FOREIGN KEY (manager_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- 3. ตาราง Drivers 
CREATE TABLE Drivers (
    driver_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    team_id INT(11),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    driver_number INT(3),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

-- 4. ตาราง Cars 
CREATE TABLE Cars (
    car_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    team_id INT(11),
    brand VARCHAR(100),
    model VARCHAR(100),
    car_number INT(3),
    specs TEXT,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

-- 5. ตาราง Seasons 
CREATE TABLE Seasons (
    season_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    year INT(4)
);

-- 6. ตาราง Races 
CREATE TABLE Races (
    race_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    season_id INT(11),
    race_name VARCHAR(150),
    location VARCHAR(150),
    race_date DATE,
    total_laps INT(3),
    FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE
);

-- 7. ตาราง Race_Results 
CREATE TABLE Race_Results (
    result_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    race_id INT(11),
    driver_id INT(11),
    car_id INT(11),
    finish_position INT(2),
    is_fastest_lap BOOLEAN,
    status ENUM('Finished', 'DNF', 'DSQ', 'DNS'), 
    points_earned INT(3),
    FOREIGN KEY (race_id) REFERENCES Races(race_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE
);