'use strict';

var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

module.exports = function (Car) {
  // add dist and update the last time used of the target car (this methods is filtered by acl)
  Car.addDistance = function (id, dist, cb) {

    Car.findById(id, function (err, car) {
      if (err) return cb(err);

      if(car==null){
        return cb('not found');
      }

      var car_data = {
        'traveledDistance': car.traveledDistance + dist,
        'lastTimeUsed': new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      car.updateAttributes(car_data, function (err, car) {
        if (err) return cb(null, err);
        cb(null, 'ok');
      });
    });
  };
  Car.remoteMethod('addDistance', {
    accepts: [{arg: 'id', type: 'number', required: true}, {arg: 'dist', type: 'integer'}],
    returns: {arg: 'msg', type: 'string'},
    http: {path: '/:id/addDistance', verb: 'post'},
  });

};

