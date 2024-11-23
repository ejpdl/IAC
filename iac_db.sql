-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2024 at 08:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iac`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_ID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pc_list`
--

CREATE TABLE `pc_list` (
  `PC_ID` varchar(50) NOT NULL,
  `pc_status` enum('Available','Occupied','Pending') NOT NULL,
  `Student_ID` varchar(50) DEFAULT NULL,
  `time_used` time DEFAULT NULL,
  `date_used` date DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session_history`
--

CREATE TABLE `session_history` (
  `session_id` int(11) NOT NULL,
  `Student_ID` varchar(50) NOT NULL,
  `PC_ID` varchar(50) DEFAULT NULL,
  `date_used` date DEFAULT NULL,
  `time_used` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `Student_ID` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `year_level` varchar(20) NOT NULL,
  `course` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `Admin_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session_history`
--
ALTER TABLE `session_history`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

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
