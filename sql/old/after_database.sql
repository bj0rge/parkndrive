USE parkndrive;
-- mandatory for user model
ALTER TABLE  `e_driver`
  ADD `realm` varchar(50) NULL DEFAULT NULL,
  ADD `credentials` varchar(50) NULL DEFAULT NULL,
  ADD `challenges` varchar(50) NULL DEFAULT NULL,
  ADD `emailVerified` int(1) NULL DEFAULT NULL,
  ADD `verificationToken` varchar(50) NULL DEFAULT NULL,
  ADD `status` int(11) NULL DEFAULT NULL,
  ADD `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD `lastUpdated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;
