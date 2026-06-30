-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 29, 2026 at 11:50 PM
-- Server version: 5.7.44-log
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `epbb_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ref_kecamatan`
--

CREATE TABLE `ref_kecamatan` (
  `kec_id` int(5) NOT NULL,
  `kdkecamatan` char(3) NOT NULL,
  `nm_kecamatan` char(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ref_kecamatan`
--

INSERT INTO `ref_kecamatan` (`kec_id`, `kdkecamatan`, `nm_kecamatan`) VALUES
(2, '140', 'AIR PUTIH'),
(3, '130', 'LIMA PULUH'),
(4, '150', 'MEDANG DERAS'),
(5, '111', 'SEI BALAI'),
(6, '141', 'SEI SUKA'),
(7, '120', 'TALAWI'),
(8, '110', 'TANJUNG TIRAM'),
(9, '082', 'LAUT TADOR'),
(10, '112', 'DATUK TANAH DATAR'),
(11, '122', 'NIBUNG HANGUS'),
(12, '092', 'LIMAPULUH PESISIR'),
(13, '102', 'DATUK LIMAPULUH');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ref_kecamatan`
--
ALTER TABLE `ref_kecamatan`
  ADD PRIMARY KEY (`kec_id`) USING BTREE,
  ADD KEY `idx_ref_kecamatan_kdkecamatan` (`kdkecamatan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ref_kecamatan`
--
ALTER TABLE `ref_kecamatan`
  MODIFY `kec_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
