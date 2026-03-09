-- เพิ่มข้อมูลทีม
INSERT INTO Team (team_name, country, manager_name) VALUES 
('Red Bull Racing', 'United Kingdom', 'Christian Horner'),
('Mercedes-AMG Petronas', 'United Kingdom', 'Toto Wolff'),
('Ferrari', 'Italy', 'Frédéric Vasseur');

-- เพิ่มข้อมูลนักแข่ง
INSERT INTO Driver (driver_name, age, nationality, team_id) VALUES 
('Max Verstappen', 26, 'Dutch', 1),
('Lewis Hamilton', 39, 'British', 2),
('Charles Leclerc', 26, 'Monegasque', 3),
('Lando Norris', 24, 'British', 1);

-- เพิ่มข้อมูลรถแข่ง
INSERT INTO Car (model, engine_type, team_id) VALUES 
('RB20', 'Honda RBPTH002 V6 t', 1),
('W15', 'Mercedes-AMG F1 M15', 2),
('SF-24', 'Ferrari 066/12 V6 t', 3);

-- เพิ่มข้อมูลสนามแข่ง
INSERT INTO Race (race_name, location, race_date) VALUES 
('Bahrain Grand Prix', 'Sakhir, Bahrain', '2024-03-02'),
('Saudi Arabian Grand Prix', 'Jeddah, Saudi Arabia', '2024-03-09');

-- เพิ่มข้อมูลผลการแข่งขัน
INSERT INTO Result (driver_id, race_id, position, points) VALUES 
(1, 1, 1, 25),
(3, 1, 3, 15),
(1, 2, 1, 25),
(2, 2, 9, 2);