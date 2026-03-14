const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  // เชื่อมต่อโดยไม่ระบุ database ก่อน เพื่อ CREATE DATABASE ได้
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const DB_NAME = process.env.DB_NAME || 'f1_racing';

  console.log(`📦 Creating database "${DB_NAME}" if not exists...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conn.query(`USE \`${DB_NAME}\``);

  console.log('🔧 Running migrations...\n');

  const statements = [
    // -------------------------------------------------------
    // 1. Users
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Users (
      user_id       INT(11)      PRIMARY KEY AUTO_INCREMENT,
      username      VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          ENUM('admin', 'user', 'manager') NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 2. Teams
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Teams (
      team_id      INT(11)  PRIMARY KEY AUTO_INCREMENT,
      name         VARCHAR(100),
      contact_info TEXT,
      manager_id   INT(11),
      FOREIGN KEY (manager_id) REFERENCES Users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 3. Drivers
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Drivers (
      driver_id     INT(11)      PRIMARY KEY AUTO_INCREMENT,
      team_id       INT(11),
      first_name    VARCHAR(100),
      last_name     VARCHAR(100),
      driver_number INT(3),
      FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 4. Cars
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Cars (
      car_id     INT(11)      PRIMARY KEY AUTO_INCREMENT,
      team_id    INT(11),
      brand      VARCHAR(100),
      model      VARCHAR(100),
      car_number INT(3),
      specs      TEXT,
      FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 5. Seasons
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Seasons (
      season_id INT(11) PRIMARY KEY AUTO_INCREMENT,
      year      INT(4)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 6. Races
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Races (
      race_id    INT(11)      PRIMARY KEY AUTO_INCREMENT,
      season_id  INT(11),
      race_name  VARCHAR(150),
      location   VARCHAR(150),
      race_date  DATE,
      total_laps INT(3),
      FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // -------------------------------------------------------
    // 7. Race_Results
    // -------------------------------------------------------
    `CREATE TABLE IF NOT EXISTS Race_Results (
      result_id       INT(11)  PRIMARY KEY AUTO_INCREMENT,
      race_id         INT(11),
      driver_id       INT(11),
      car_id          INT(11),
      finish_position INT(2),
      is_fastest_lap  BOOLEAN,
      status          ENUM('Finished', 'DNF', 'DSQ', 'DNS'),
      points_earned   INT(3),
      FOREIGN KEY (race_id)   REFERENCES Races(race_id)     ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id) ON DELETE CASCADE,
      FOREIGN KEY (car_id)    REFERENCES Cars(car_id)       ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  ];

  const tableNames = [
    'Users', 'Teams', 'Drivers', 'Cars', 'Seasons', 'Races', 'Race_Results'
  ];

  for (let i = 0; i < statements.length; i++) {
    try {
      await conn.query(statements[i]);
      console.log(`  ✅ Table "${tableNames[i]}" ready`);
    } catch (err) {
      console.error(`  ❌ Failed on "${tableNames[i]}":`, err.message);
      await conn.end();
      process.exit(1);
    }
  }

  console.log('\n🎉 Migration completed successfully!');
  await conn.end();
}

migrate();
