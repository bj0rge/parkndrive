-- foreign key
ALTER TABLE `e_driver`
  ADD CONSTRAINT `FK__e_driver__e_house__h_id` FOREIGN KEY (`d_h_id`) REFERENCES `e_house` (`h_id`) ON DELETE CASCADE;



