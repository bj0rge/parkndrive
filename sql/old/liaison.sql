USE parkndrive;
CREATE TABLE CarDriver (
    id int(11) NOT NULL AUTO_INCREMENT,
    carId    int(11) NOT NULL,
    driverId int(11) NOT NULL,
    PRIMARY KEY (id)
)Engine=InnoDB;

ALTER TABLE CarDriver
ADD CONSTRAINT fk_car FOREIGN KEY (carId) REFERENCES e_car(id)
        ON DELETE CASCADE;

ALTER TABLE CarDriver
ADD CONSTRAINT fk_driver FOREIGN KEY (driverId) REFERENCES e_driver(d_id)
ON DELETE CASCADE;

ALTER TABLE e_travel
ADD COLUMN driverId int(11) NOT NULL;

ALTER TABLE e_travel
ADD CONSTRAINT fk_driver_travel FOREIGN KEY (driverId) REFERENCES e_driver(d_id)
ON DELETE CASCADE;

ALTER TABLE e_travel
ADD COLUMN  carId    int(11) NOT NULL;

ALTER TABLE e_travel
ADD CONSTRAINT fk_car_travel FOREIGN KEY (carId) REFERENCES e_car(id)
        ON DELETE CASCADE;
