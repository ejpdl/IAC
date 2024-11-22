-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: byg2lehiaall3bovpkv6-mysql.services.clever-cloud.com:3306
-- Generation Time: Nov 22, 2024 at 06:02 AM
-- Server version: 8.0.22-13
-- PHP Version: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `byg2lehiaall3bovpkv6`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_ID` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pc_list`
--

CREATE TABLE `pc_list` (
  `PC_ID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `pc_status` enum('Available','Occupied','Pending') COLLATE utf8mb4_general_ci NOT NULL,
  `Student_ID` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time_used` time DEFAULT NULL,
  `date_used` date DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pc_list`
--

INSERT INTO `pc_list` (`PC_ID`, `pc_status`, `Student_ID`, `time_used`, `date_used`, `end_time`) VALUES
('PC_1', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_2', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_3', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_4', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_5', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_6', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_7', 'Available', NULL, NULL, '2024-11-22', NULL),
('PC_8', 'Available', NULL, NULL, '2024-11-22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `session_history`
--

CREATE TABLE `session_history` (
  `session_id` int NOT NULL,
  `Student_ID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `PC_ID` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_used` date DEFAULT NULL,
  `time_used` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_history`
--

INSERT INTO `session_history` (`session_id`, `Student_ID`, `PC_ID`, `date_used`, `time_used`, `end_time`) VALUES
(1, 'A21-0497', 'PC_4', '2024-11-22', '12:07:21', '13:07:21'),
(2, 'A21-0497', 'PC_7', '2024-11-22', '12:10:43', '13:10:43'),
(3, 'A21-0478', 'PC_3', '2024-11-22', '11:34:28', '12:34:28'),
(4, 'A21-0478', 'PC_5', '2024-11-22', '12:37:39', '13:37:39');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `Student_ID` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `year_level` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `course` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`Student_ID`, `first_name`, `last_name`, `year_level`, `course`, `password`) VALUES
('A21-0002', 'Ralph Jahred', 'Magpantay', '4th Year', 'BS In Computer Science', '$2b$10$q/5r32uxRApR/kf/3JSsCuIDLq8MlnPmbXif8NXJpA8Z.yBB5DZOa'),
('A21-0478', 'Jus', 'Lopez', '4th Year', 'BS In Computer Science', '$2b$10$yjqb9meEmAMCkSyhbUP0eeffmGOFuWKJuaoeo0lNZ6dHaJRj4p1nu'),
('A21-0497', 'Albert Ian', 'Abarquez', '4th Year', 'BS In Computer Science', '$2b$10$2yb8Oiom9aDJ/OJzSU/sxOJ2qc7wrwPOklhP34pCpDb14YQiSApY2'),
('A22-0000', 'Testing', 'test', '3rd Year', 'BS In Accountacy', '$2b$10$kwcaq1Ik37hWI0/hZmf8h.7rnkmK1gCviV6gha4ASfG9Qq7PzziYG'),
('A22-0002', 'rj', 'dm', '4th Year', 'BS In Computer Science', '$2b$10$G6FeZsXP1sFXYguq5zSzbOeNitgw8z4VfXSQ3FQ3zp4v6sboA7yQW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `pc_list`
--
ALTER TABLE `pc_list`
  ADD PRIMARY KEY (`PC_ID`),
  ADD KEY `Student_ID` (`Student_ID`);

--
-- Indexes for table `session_history`
--
ALTER TABLE `session_history`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `session_history_ibfk_2` (`PC_ID`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`Student_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session_history`
--
ALTER TABLE `session_history`
  MODIFY `session_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pc_list`
--
ALTER TABLE `pc_list`
  ADD CONSTRAINT `pc_list_ibfk_1` FOREIGN KEY (`Student_ID`) REFERENCES `students` (`Student_ID`) ON DELETE SET NULL;

--
-- Constraints for table `session_history`
--
ALTER TABLE `session_history`
  ADD CONSTRAINT `session_history_ibfk_1` FOREIGN KEY (`Student_ID`) REFERENCES `students` (`Student_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `session_history_ibfk_2` FOREIGN KEY (`PC_ID`) REFERENCES `pc_list` (`PC_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
