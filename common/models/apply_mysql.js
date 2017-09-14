// this file update automatically the mysql schema with the project models

var loopback = require('loopback');

var conf_ds = require('../../server/datasources.json');

var ds = loopback.createDataSource(conf_ds['sql']);

// var schema_v1 = require('./travel.json');
//
// ds.createModel(schema_v1.mysql.table, schema_v1.properties, schema_v1.options);
//
// ds.autoupdate(function () {
//   ds.discoverModelProperties(schema_v1.mysql.table, function (err, props) {
//     console.log(props);
//   });
// });

// var schema_v1 = require('./driver.json');
//
// ds.createModel(schema_v1.mysql.table, schema_v1.properties, schema_v1.options);
//
// ds.autoupdate(function () {
//   ds.discoverModelProperties(schema_v1.mysql.table, function (err, props) {
//     console.log(props);
//   });
// });
