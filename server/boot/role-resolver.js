// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
module.exports = function (app) {
  var Car = app.models.Car;
  var Role = app.models.Role;

  // check if the current user can add distance to a car
  Role.registerResolver('carOwner', function (role, context, cb) {
    function reject() {
      process.nextTick(function () {
        cb(null, false);
      });
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }
    // check the target model
    if (context.modelName == 'Car') {
      // find the car instance
      context.model.findById(context.modelId, function (err, car) {
        if (err || !car)
          return cb(null, err);

        var access = false;
        // check if the curent user is a driver of the car
        car.drivers(function (err, drivers) {
          if (err) return cb(null, err);
          for (var i = 0; i < drivers.length; i++) {
            if (userId == drivers[i].id) {
              access = true;
            }
          }
          cb(null, access);
        });
      });
    }
    else{
      return reject();
    }
  });
  // check if the target user can create a travel with the target car
  Role.registerResolver('checkCarAuth', function (role, context, cb) {
    function reject(err) {
      if (err) {
        return cb(err);
      }
      cb(null, false);
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    // if the user is not the administrator, he can only send request for him
    if (!(userId == context.remotingContext.req.body.idDriver)) {
      return reject();
    }
    // check the target model
    if (context.modelName == 'Travel') {
      // find the target car from its id
      Car.findById(context.remotingContext.req.body.idCar, function (err, car) {
        if (err || !car)
          return cb(null, err);

        var access = false;
        // check if the target user is a driver of the car
        car.drivers(function (err, drivers) {
          if (err) return cb(null, err);
          for (var i = 0; i < drivers.length; i++) {
            if (userId == drivers[i].id) {
              access = true;
            }
          }
          cb(null, access);
        });
      });
    }
    else {
      return reject();
    }
  });
};

