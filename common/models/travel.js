'use strict';

module.exports = function (Travel) {
  // create a travel (this method is filtered by acl)
  Travel.add = function (idDriver, idCar, dist, cb) {

    var travelData = {
      'distance': dist,
      'date': new Date().toISOString().slice(0, 19).replace('T', ' '),
      'driverId': idDriver,
      'carId': idCar,
    };
    Travel.create(travelData, function(err, travel){
      if (err) return cb(null, err);
      cb(null, 'ok');
    });
  };
  Travel.remoteMethod('add', {
    accepts: [{arg: 'idDriver', type: 'number', required: true}, {arg: 'idCar', type: 'number', required: true}, {arg: 'dist', type: 'integer'}],
    returns: {arg: 'msg', type: 'string'},
    http: {path: '/add', verb: 'post'},
  });

};

