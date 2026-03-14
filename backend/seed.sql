-- ================================================================
-- F1 Racing Management — Dummy Data (Fixed)
-- ================================================================

USE racing_management;

-- ล้างข้อมูลเก่า (ใช้ DELETE แทน TRUNCATE เพื่อหลีกเลี่ยง FK error)
DELETE FROM Race_Results;
DELETE FROM Races;
DELETE FROM Seasons;
DELETE FROM Cars;
DELETE FROM Drivers;
DELETE FROM Teams;
DELETE FROM Users;

-- ---------------------------------------------------------------
-- 1. Users
-- ---------------------------------------------------------------
INSERT INTO Users (user_id, username, password_hash, role) VALUES
  (1, 'admin',       '$2y$10$admin_hash_here',   'admin'),
  (2, 'ferrari_mgr', '$2y$10$ferrari_hash_here', 'manager'),
  (3, 'redbull_mgr', '$2y$10$redbull_hash_here', 'manager'),
  (4, 'mclaren_mgr', '$2y$10$mclaren_hash_here', 'manager'),
  (5, 'viewer01',    '$2y$10$viewer_hash_here',  'user');

-- ---------------------------------------------------------------
-- 2. Teams
-- ---------------------------------------------------------------
INSERT INTO Teams (team_id, name, contact_info, manager_id) VALUES
  (1, 'Ferrari',         'contact@ferrari.com',       2),
  (2, 'Red Bull Racing', 'contact@redbullracing.com', 3),
  (3, 'McLaren',         'contact@mclaren.com',       4);

-- ---------------------------------------------------------------
-- 3. Drivers
-- ---------------------------------------------------------------
INSERT INTO Drivers (driver_id, team_id, first_name, last_name, driver_number) VALUES
  (1, 1, 'Charles', 'Leclerc',    16),
  (2, 1, 'Carlos',  'Sainz',      55),
  (3, 2, 'Max',     'Verstappen',  1),
  (4, 2, 'Sergio',  'Perez',      11),
  (5, 3, 'Lando',   'Norris',      4),
  (6, 3, 'Oscar',   'Piastri',    81);

-- ---------------------------------------------------------------
-- 4. Cars
-- ---------------------------------------------------------------
INSERT INTO Cars (car_id, team_id, brand, model, car_number, specs) VALUES
  (1, 1, 'Ferrari',  'SF-24',  16, 'V6 Turbo Hybrid 1000hp'),
  (2, 1, 'Ferrari',  'SF-24',  55, 'V6 Turbo Hybrid 1000hp'),
  (3, 2, 'Red Bull', 'RB20',    1, 'V6 Turbo Hybrid 1020hp'),
  (4, 2, 'Red Bull', 'RB20',   11, 'V6 Turbo Hybrid 1020hp'),
  (5, 3, 'McLaren',  'MCL38',   4, 'V6 Turbo Hybrid 1000hp'),
  (6, 3, 'McLaren',  'MCL38',  81, 'V6 Turbo Hybrid 1000hp');

-- ---------------------------------------------------------------
-- 5. Seasons
-- ---------------------------------------------------------------
INSERT INTO Seasons (season_id, year) VALUES
  (1, 2024),
  (2, 2025);

-- ---------------------------------------------------------------
-- 6. Races
-- ---------------------------------------------------------------
INSERT INTO Races (race_id, season_id, race_name, location, race_date, total_laps) VALUES
  (1, 1, 'Bahrain Grand Prix',    'Bahrain',     '2024-03-02', 57),
  (2, 1, 'Saudi Arabian GP',      'Saudi Arabia','2024-03-09', 50),
  (3, 1, 'Australian Grand Prix', 'Australia',   '2024-03-24', 58),
  (4, 2, 'Bahrain Grand Prix',    'Bahrain',     '2025-03-16', 57),
  (5, 2, 'Saudi Arabian GP',      'Saudi Arabia','2025-03-23', 50);

-- ---------------------------------------------------------------
-- 7. Race_Results
-- ---------------------------------------------------------------
INSERT INTO Race_Results (race_id, driver_id, car_id, finish_position, is_fastest_lap, status, points_earned) VALUES
  -- Bahrain 2024
  (1, 3, 3, 1, 1, 'Finished', 26),
  (1, 4, 4, 2, 0, 'Finished', 18),
  (1, 1, 1, 3, 0, 'Finished', 15),
  (1, 5, 5, 4, 0, 'Finished', 12),
  (1, 2, 2, 5, 0, 'Finished', 10),
  (1, 6, 6, 6, 0, 'Finished',  8),

  -- Saudi Arabia 2024
  (2, 3, 3, 1, 1, 'Finished', 26),
  (2, 1, 1, 2, 0, 'Finished', 18),
  (2, 5, 5, 3, 0, 'Finished', 15),
  (2, 2, 2, 4, 0, 'Finished', 12),
  (2, 4, 4, 5, 0, 'DNF',       0),
  (2, 6, 6, 6, 0, 'Finished',  8),

  -- Australia 2024
  (3, 5, 5, 1, 1, 'Finished', 26),
  (3, 6, 6, 2, 0, 'Finished', 18),
  (3, 1, 1, 3, 0, 'DSQ',       0),
  (3, 2, 2, 4, 0, 'Finished', 12),
  (3, 3, 3, 5, 0, 'Finished', 10),
  (3, 4, 4, 6, 0, 'Finished',  8);