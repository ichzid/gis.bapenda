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
-- Table structure for table `ref_kelurahan`
--

CREATE TABLE `ref_kelurahan` (
  `kel_id` int(5) NOT NULL,
  `kdkecamatan` char(3) NOT NULL,
  `kdkelurahan` char(5) NOT NULL,
  `kd_sektor` char(2) DEFAULT NULL,
  `nm_kelurahan` varchar(30) DEFAULT NULL,
  `no_kelurahan` char(6) DEFAULT NULL,
  `kd_pos_kelurahan` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ref_kelurahan`
--

INSERT INTO `ref_kelurahan` (`kel_id`, `kdkecamatan`, `kdkelurahan`, `kd_sektor`, `nm_kelurahan`, `no_kelurahan`, `kd_pos_kelurahan`) VALUES
(2, '102', '027', '10', 'PULAU SEJUK', '432', '21255'),
(3, '102', '028', '10', 'PERK.TANAH ITAM ULU', '566', '21255'),
(4, '140', '008', '20', 'SIPARE-PARE', '360', '21256'),
(5, '140', '009', '10', 'PASAR LAPAN', '361', '21256'),
(6, '140', '010', '20', 'INDRAPURA', '362', '21256'),
(7, '140', '011', '20', 'TANAH MERAH', '363', '21256'),
(8, '140', '012', '10', 'TANJUNG MUDA', '364', '21256'),
(9, '140', '013', '20', 'TANAH TINGGI', '365', '21256'),
(10, '140', '014', '10', 'SUKARAJA', '366', '21256'),
(11, '140', '015', '10', 'PEMATANG PANJANG', '367', '21256'),
(12, '140', '016', '10', 'ARAS', '368', '21256'),
(13, '140', '017', '10', 'TANJUNG KUBAH', '369', '21256'),
(14, '140', '018', '10', 'LIMAU SUNDAI', '370', '21256'),
(15, '140', '019', '10', 'SUKA RAMAI', '994', '21256'),
(16, '140', '024', '20', 'TANJUNG HARAPAN', '374', '21256'),
(17, '082', '003', '10', 'PERK.TANJUNG KASAU', '963', '21256'),
(18, '082', '004', '20', 'TANJUNG KASAU', '964', '21256'),
(19, '082', '005', '20', 'TANJUNG SERI', '965', '21256'),
(20, '141', '006', '20', 'SEI SUKA DERAS', '966', '21256'),
(21, '141', '007', '10', 'PERK.SIPARE-PARE', '967', '21256'),
(22, '141', '008', '10', 'KUALA TANJUNG', '968', '21256'),
(23, '141', '009', '10', 'PEMATANG JERING', '969', '21256'),
(24, '141', '010', '10', 'SIMODONG', '970', '21256'),
(25, '082', '011', '10', 'SEI SIMUJUR', '971', '21256'),
(26, '141', '012', '10', 'PEMATANG KUWING', '972', '21256'),
(27, '141', '013', '10', 'KWALA INDAH', '973', '21256'),
(28, '141', '014', '10', 'J E R M A L', '985', '21465'),
(29, '150', '001', '10', 'SIDOMULYO', '375', '21258'),
(30, '150', '002', '10', 'AEK NAULI', '376', '21258'),
(31, '150', '003', '10', 'SEI BUAH KERAS', '377', '21258'),
(32, '150', '004', '10', 'SEI RAKYAT', '378', '21258'),
(33, '150', '005', '10', 'TANJUNG SIGONI', '379', '21258'),
(34, '150', '006', '10', 'PEMATANG CENGKRING', '380', '21258'),
(35, '150', '007', '20', 'PAKAM', '381', '21258'),
(36, '150', '008', '10', 'LALANG', '382', '21258'),
(37, '150', '009', '20', 'MEDANG', '383', '21258'),
(38, '150', '010', '10', 'DURIAN', '384', '21258'),
(39, '150', '011', '10', 'NENAS SIAM', '385', '21258'),
(40, '150', '012', '20', 'PANGKALAN DODEK', '388', '21258'),
(41, '150', '013', '10', 'J E R M A L', '389', '21258'),
(42, '150', '014', '10', 'PANGKALAN DODEK BARU', '449', '21258'),
(43, '150', '015', '20', 'PAKAM RAYA', '450', '21258'),
(44, '122', '032', '10', ' JATI MULIA', '995', NULL),
(45, '122', '033', '10', 'BANDAR SONO', '996', NULL),
(46, '122', '034', '10', 'MEKAR LARAS', '997', NULL),
(47, '110', '035', '10', 'SUKA JAYA', '998', NULL),
(48, '110', '036', '10', 'KAMPUNG LALANG', '999', NULL),
(49, '110', '037', '20', 'BAGAN ARYA', '1000', NULL),
(50, '110', '038', '10', 'PAHLAWAN', '1001', NULL),
(51, '110', '039', '10', 'BANDAR RAHMAD', '1002', NULL),
(52, '122', '040', '10', 'TALI AIR PERMAI', '1003', NULL),
(53, '122', '041', '10', 'KAPAL MERAH', '1004', NULL),
(54, '112', '014', '10', 'MEKAR BARU', '1005', NULL),
(55, '112', '015', '10', 'GLUGUR MAKMUR', '1006', NULL),
(56, '120', '016', '10', 'GUNUNG RANTE', '1007', NULL),
(57, '112', '017', '10', 'SUMBER TANI', '1008', NULL),
(58, '120', '018', '10', 'BENTENG', '1009', NULL),
(59, '120', '019', '10', 'INDRA YAMAN', '1010', NULL),
(60, '120', '020', '10', 'DAHARI INDAH', '1011', NULL),
(61, '111', '012', '10', 'PERJUANGAN', '1012', NULL),
(62, '111', '013', '10', 'SUKO REJO', '1013', NULL),
(63, '111', '014', '10', 'BENTENG JAYA', '1014', NULL),
(64, '111', '015', '10', 'TANAH TIMBUL', '1015', NULL),
(65, '111', '016', '10', 'MEKAR BARU', '1016', NULL),
(66, '111', '017', '10', 'SIDOMULYO', '1017', NULL),
(67, '092', '029', '10', 'PEMATANG TENGAH', '1018', NULL),
(68, '102', '030', '10', 'SUMBER REJO', '1019', NULL),
(69, '102', '031', '10', 'LUBUK HULU', '1020', NULL),
(70, '092', '032', '10', 'BARUNG-BARUNG', '1021', NULL),
(71, '092', '033', '10', 'PASIR PERMIT', '1022', NULL),
(72, '092', '034', '10', 'TITI PUTIH', '1023', NULL),
(73, '092', '035', '10', 'TITI MERAH', '1024', NULL),
(74, '092', '036', '10', 'GUNUNG BANDUNG', '1025', NULL),
(75, '140', '025', '10', 'TITI PAYUNG', '1026', NULL),
(76, '140', '026', '10', 'PERKOTAAN', '1027', NULL),
(77, '140', '027', '20', 'INDRA SAKTI', '1028', NULL),
(78, '140', '028', '10', 'TANAH RENDAH', '1029', NULL),
(79, '140', '029', '10', 'KAMPUNG KELAPA', '1030', NULL),
(80, '140', '030', '10', 'TANJUNG MULIA', '1031', NULL),
(81, '082', '015', '10', 'PELANGGIRAN LAUT TADOR', '1032', NULL),
(82, '082', '016', '10', 'DWI SRI', '1033', NULL),
(83, '082', '017', '10', 'MEKAR SARI', '1034', NULL),
(84, '141', '018', '10', 'TANJUNG GADING', '1035', NULL),
(85, '141', '019', '10', 'SIMPANG KOPI', '1036', NULL),
(86, '141', '020', '10', 'BROHOL', '1037', NULL),
(87, '082', '021', '10', 'KANDANGAN', '1038', NULL),
(88, '150', '016', '10', 'SEI RAJA', '1039', NULL),
(89, '150', '017', '10', 'CENGKERING PEKAN', '1040', NULL),
(90, '150', '018', '10', 'MANDARSAH', '1041', NULL),
(91, '150', '019', '10', 'MEDANG BARU', '1042', NULL),
(92, '150', '020', '10', 'PEMATANG NIBUNG', '1043', NULL),
(93, '150', '021', '20', 'PAGURAWAN', '1044', NULL),
(94, '150', '022', '10', 'PAKAM RAYA SELATAN', '1045', NULL),
(95, '082', '002', '20', 'LAUT TADOR', '962', '21256'),
(96, '111', '003', '20', 'DURIAN', '976', '21256'),
(97, '082', '001', '10', 'TANJUNG PRAPAT', '961', '21256'),
(98, '122', '011', '10', 'SEI MENTARAM', '314', '21253'),
(99, '122', '012', '10', 'TANJUNG MULIA', '315', '21253'),
(100, '122', '013', '10', 'UJUNG KUBU', '316', '21253'),
(101, '122', '014', '10', 'LIMA LARAS', '317', '21253'),
(102, '110', '015', '10', 'GUNTUNG', '318', '21253'),
(103, '110', '016', '10', 'BAGAN DALAM', '319', '21253'),
(104, '110', '017', '10', 'SUKA MAJU', '320', '21253'),
(105, '110', '018', '20', 'TANJUNG TIRAM', '321', '21253'),
(106, '110', '019', '10', 'BOGAK', '322', '21253'),
(107, '110', '020', '10', 'J E R M A L', '323', '21253'),
(108, '122', '021', '10', 'PEMATANG RAMBEI', '796', '21253'),
(109, '122', '022', '10', 'BAGAN BARU', '387', '21253'),
(110, '122', '023', '10', 'SENTANG', '993', '21253'),
(111, '110', '031', '10', 'PIRKOP SMALL HOLDER', '857', '21253'),
(112, '111', '001', '10', 'PERK.SEI BALAI', '974', '21253'),
(113, '111', '006', '10', 'SUKA RAMAI', '979', '21253'),
(114, '111', '007', '10', 'SEI BEJANGKAR', '980', '21253'),
(115, '111', '008', '10', 'PERK.SEI BEJANGKAR', '981', '21253'),
(116, '111', '009', '20', 'SEI BALAI', '982', '21253'),
(117, '111', '010', '10', 'KWALA SIKASIM', '983', '21253'),
(118, '111', '011', '10', 'MEKAR MULYO', '984', '21253'),
(119, '112', '001', '10', 'PETATAL', '324', '21254'),
(120, '112', '002', '10', 'BINJAI BARU', '325', '21254'),
(121, '112', '003', '20', 'BANGUN SARI', '797', '21254'),
(122, '112', '004', '10', 'PERK.PETATAL', '326', '21254'),
(123, '120', '005', '10', 'PANJANG', '406', '21254'),
(124, '112', '006', '10', 'SEI MUKA', '328', '21254'),
(125, '120', '007', '20', 'PAHANG', '329', '21254'),
(126, '120', '008', '20', 'LABUHAN RUKU', '330', '21254'),
(127, '120', '009', '20', 'MESJID LAMA', '331', '21254'),
(128, '120', '010', '10', 'DAHARI SELEBAR', '332', '21254'),
(129, '112', '011', '10', 'KARANG BARU', '353', '21254'),
(130, '120', '012', '10', 'PADANG GENTING', '413', '21254'),
(131, '112', '013', '10', 'PERK. TANAH DATAR', '354', '21254'),
(132, '130', '001', '10', 'MANGKAI BARU', '333', '21255'),
(133, '130', '002', '20', 'LIMA PULUH KOTA', '334', '21255'),
(134, '130', '003', '10', 'PERK.DOLOK', '335', '21255'),
(135, '130', '004', '20', 'SUMBER PADI', '336', '21255'),
(136, '092', '005', '10', 'LUBUK CUIK', '793', '21255'),
(137, '130', '006', '20', 'ANTARA', '338', '21255'),
(138, '102', '008', '10', 'KWALA GUNUNG', '337', '21255'),
(139, '102', '009', '10', 'CAHAYA PARDOMUAN', '339', '21255'),
(140, '102', '010', '10', 'SIMPANG DOLOK', '340', '21255'),
(141, '102', '011', '10', 'EMPAT NEGERI', '341', '21255'),
(142, '130', '012', '10', 'PERK.LIMA PULUH', '342', '21255'),
(143, '130', '013', '10', 'SUMBER MAKMUR', '343', '21255'),
(144, '130', '014', '10', 'PERK.TANAH GAMBUS', '344', '21255'),
(145, '102', '016', '10', 'LUBUK BESAR', '345', '21255'),
(146, '102', '017', '10', 'AIR HITAM', '346', '21255'),
(147, '092', '018', '10', 'GUNTUNG', '347', '21255'),
(148, '092', '019', '10', 'PEMATANG PANJANG', '348', '21255'),
(149, '092', '020', '10', 'PERUPUK', '349', '21255'),
(150, '092', '021', '10', 'TANAH ITAM ILIR', '350', '21255'),
(151, '130', '022', '10', 'SIMPANG GAMBUS', '351', '21255'),
(152, '130', '023', '10', 'J E R M A L', '352', '21255'),
(153, '092', '024', '10', 'GAMBUS LAUT', '820', '21255'),
(154, '092', '025', '10', 'BULAN BULAN', '430', '21255'),
(155, '130', '026', '10', 'MANGKAI LAMA', '431', '21255'),
(156, '102', '032', '10', 'PERKEBUNAN KUALA GUNUNG', '032', NULL),
(157, '130', '027', '10', 'PERKEBUNAN LIMAU MANIS', '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ref_kelurahan`
--
ALTER TABLE `ref_kelurahan`
  ADD PRIMARY KEY (`kel_id`) USING BTREE,
  ADD KEY `kel` (`kdkelurahan`,`kdkecamatan`,`nm_kelurahan`) USING BTREE,
  ADD KEY `idx_ref_kelurahan` (`kdkelurahan`,`kdkecamatan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ref_kelurahan`
--
ALTER TABLE `ref_kelurahan`
  MODIFY `kel_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
