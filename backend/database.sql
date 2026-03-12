-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Mar 12, 2026 at 10:21 AM
-- Server version: 12.2.2-MariaDB-ubu2404
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `racing_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `Cars`
--

CREATE TABLE `Cars` (
  `car_id` int(11) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `car_number` int(11) NOT NULL,
  `specs` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Drivers`
--

CREATE TABLE `Drivers` (
  `driver_id` int(11) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `driver_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Races`
--

CREATE TABLE `Races` (
  `race_id` int(11) NOT NULL,
  `season_id` int(11) DEFAULT NULL,
  `race_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `race_date` date NOT NULL,
  `total_laps` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Race_Results`
--

CREATE TABLE `Race_Results` (
  `result_id` int(11) NOT NULL,
  `race_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `finish_position` int(11) DEFAULT NULL,
  `is_fastest_lap` tinyint(1) DEFAULT 0,
  `status` enum('Finished','DNF') DEFAULT 'Finished',
  `points_earned` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Seasons`
--

CREATE TABLE `Seasons` (
  `season_id` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Teams`
--

CREATE TABLE `Teams` (
  `team_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact_info` text DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','race_manager','team_manager') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Cars`
--
ALTER TABLE `Cars`
  ADD PRIMARY KEY (`car_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `Drivers`
--
ALTER TABLE `Drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `driver_number` (`driver_number`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `Races`
--
ALTER TABLE `Races`
  ADD PRIMARY KEY (`race_id`),
  ADD KEY `season_id` (`season_id`);

--
-- Indexes for table `Race_Results`
--
ALTER TABLE `Race_Results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `race_id` (`race_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `Seasons`
--
ALTER TABLE `Seasons`
  ADD PRIMARY KEY (`season_id`),
  ADD UNIQUE KEY `year` (`year`);

--
-- Indexes for table `Teams`
--
ALTER TABLE `Teams`
  ADD PRIMARY KEY (`team_id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `manager_id` (`manager_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Cars`
--
ALTER TABLE `Cars`
  MODIFY `car_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Drivers`
--
ALTER TABLE `Drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Races`
--
ALTER TABLE `Races`
  MODIFY `race_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Race_Results`
--
ALTER TABLE `Race_Results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Seasons`
--
ALTER TABLE `Seasons`
  MODIFY `season_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Teams`
--
ALTER TABLE `Teams`
  MODIFY `team_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Cars`
--
ALTER TABLE `Cars`
  ADD CONSTRAINT `1` FOREIGN KEY (`team_id`) REFERENCES `Teams` (`team_id`) ON DELETE CASCADE;

--
-- Constraints for table `Drivers`
--
ALTER TABLE `Drivers`
  ADD CONSTRAINT `1` FOREIGN KEY (`team_id`) REFERENCES `Teams` (`team_id`) ON DELETE CASCADE;

--
-- Constraints for table `Races`
--
ALTER TABLE `Races`
  ADD CONSTRAINT `1` FOREIGN KEY (`season_id`) REFERENCES `Seasons` (`season_id`) ON DELETE CASCADE;

--
-- Constraints for table `Race_Results`
--
ALTER TABLE `Race_Results`
  ADD CONSTRAINT `1` FOREIGN KEY (`race_id`) REFERENCES `Races` (`race_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`driver_id`) REFERENCES `Drivers` (`driver_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `3` FOREIGN KEY (`car_id`) REFERENCES `Cars` (`car_id`) ON DELETE SET NULL;

--
-- Constraints for table `Teams`
--
ALTER TABLE `Teams`
  ADD CONSTRAINT `1` FOREIGN KEY (`manager_id`) REFERENCES `Users` (`user_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
