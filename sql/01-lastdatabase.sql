-- MySQL dump 10.13  Distrib 5.7.19, for Linux (x86_64)
--
-- Host: localhost    Database: parkndrive
-- ------------------------------------------------------
-- Server version	5.7.19-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CarDriver`
--

DROP TABLE IF EXISTS `CarDriver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CarDriver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carId` int(11) NOT NULL,
  `driverId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_car` (`carId`),
  KEY `fk_driver` (`driverId`),
  CONSTRAINT `fk_car` FOREIGN KEY (`carId`) REFERENCES `e_car` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_driver` FOREIGN KEY (`driverId`) REFERENCES `e_driver` (`d_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `e_car`
--

DROP TABLE IF EXISTS `e_car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `e_car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registrationNumber` varchar(512) NOT NULL,
  `lastTimeUsed` datetime DEFAULT NULL,
  `traveledDistance` int(11) NOT NULL,
  `color` varchar(512) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `e_driver`
--

DROP TABLE IF EXISTS `e_driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `e_driver` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_name` varchar(512) NOT NULL,
  `d_first_name` varchar(512) NOT NULL,
  `d_username` varchar(512) NOT NULL,
  `d_email` varchar(512) NOT NULL,
  `d_password` varchar(512) NOT NULL,
  `d_h_id` int(11) DEFAULT NULL,
  `realm` varchar(50) DEFAULT NULL,
  `credentials` varchar(50) DEFAULT NULL,
  `challenges` varchar(50) DEFAULT NULL,
  `emailVerified` int(1) DEFAULT NULL,
  `verificationToken` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`d_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `e_house`
--

DROP TABLE IF EXISTS `e_house`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `e_house` (
  `h_id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `h_name` varchar(50) DEFAULT NULL,
  `h_address` varchar(50) NOT NULL,
  `h_postal_code` int(1) NOT NULL,
  `h_city` varchar(50) NOT NULL,
  `h_country` varchar(2) NOT NULL DEFAULT 'FR',
  `h_value` int(5) unsigned NOT NULL,
  PRIMARY KEY (`h_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `e_travel`
--

DROP TABLE IF EXISTS `e_travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `e_travel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `distance` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `driverId` int(11) NOT NULL,
  `carId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_driver_travel` (`driverId`),
  KEY `fk_car_travel` (`carId`),
  CONSTRAINT `fk_car_travel` FOREIGN KEY (`carId`) REFERENCES `e_car` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_driver_travel` FOREIGN KEY (`driverId`) REFERENCES `e_driver` (`d_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-14 13:26:59
