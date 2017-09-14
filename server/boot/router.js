module.exports = function(app) {
  var router = app.loopback.Router();
  var moment = require('moment');
  moment.locale('fr');

  var AccessToken = app.models.AccessToken;
  var Driver = app.models.Driver;
  var User = app.models.User;
  var Travel = app.models.Travel;
  var Car = app.models.Car;

  // load data source to establish a sql connection
  var confDs = require('../../server/datasources.json');
  var ds = app.loopback.createDataSource(confDs['sql']);

  /* ################################################################
   * ########################## Middlewares #########################
   * ################################################################
   */

  // Logs the page
  router.use(function(req, res, next) {
    var date = new Date();
    var now = moment();

    console.log('\n\n' + now.format('DD/MM/YY HH:mm:ss') + '\n \033[1;39m' + req.method + ' \033[0m ' + req.path);
    for (var k in req.query) {
      var query = req.query[k];
      console.log('  > \033[1;35m%s\033[0m:', k);
      console.log('    ' + JSON.stringify(query));
    }
    if (req.body) {
      console.log('  >> \033[1;35mbody\033[0m:');
      console.log('   ' + JSON.stringify(req.body));
    }
    next();
  });

  // Assign the session to 'sess' variable & giving access to it for views
  // if user is logged, check if he is an administrator
  router.use(function(req, res, next) {
    sess = req.session;

    if (sess.user === undefined) {
      res.locals.sess = sess;
      next();
    } else {
      var Role = app.models.Role;
      var admin = false;

      Role.findOne({where: {'name': 'admin'}}, function(err, role) {
        if (err) return res.send(err);
        if(role==null) return notFound(res);
        role.principals(function(err, principals) {
          if (err) return res.send(err);
          for (i = 0; i < principals.length; i++) {
            if (principals[i].principalId == sess.user.id)
              admin = true;
          }
          sess.isAdmin = admin;
          res.locals.sess = sess;
          next();
        });
      });
    }
  });

  // disconnect a user if he is logged
  app.get('/logout', function(req, res, next) {
    if (!sess.token) return res.redirect('/');
    delete req.session.token;
    res.redirect('/');
  });

  // Handle the login session or not
  function checkLogin(token) {
    return (token && new AccessToken(token).isValid());
  }

  /* ################################################################
   * ############################ ROUTES ############################
   * ################################################################
   */

  // run cbAdmin if the user is an administrator
  function checkIsAdmin(cbAdmin, cbNotAdmin) {
    if (sess.isAdmin) {
      cbAdmin();
    } else {
      cbNotAdmin();
    }
  }

  function notFound(res){
    return res.send('Not found');
  }

  /* Index */
  router.get('/', function(req, res) {
    // display token to use it (for the api explorer)
    console.log(sess.token);
    if (checkLogin(sess.token)) {
      Driver.findById(sess.user.id, {
        include: 'habitation',
      }, function(err, driver) {
        if (err) return res.send(err);

        if(driver==null) return notFound(res);

        var cbAdmin = function() {
          // get the five last used cars
          Car.find({order: 'lastTimeUsed DESC', limit: 5}, function(err, cars) {
            if(err) return res.send(err);
            if(cars==null) return notFound(res);
            var traveledDistance = 0;
            for (var i = 0; i < cars.length; i++) {
              traveledDistance += cars[i].traveledDistance;
            }
            Driver.find({}, function(err, drivers) {
                if(err) return res.send(err);
                if(drivers==null) return notFound(res);
                // get the then last trips
                Travel.find({order: 'date DESC LIMIT 10',
                  include: ['driver', 'car']}, function(err, travels) {
                  if (err) return res.send(err);
                  if(travels==null) return notFound(res);
                  var travelsJson = [];
                  travels.forEach(function(travel) {
                    travelsJson.push(travel.toJSON());
                  });
                  res.render('index', {
                    user: driver.toJSON(),
                    admin: sess.isAdmin,
                    cars: cars,
                    moment: moment,
                    traveledDistance: traveledDistance,
                    drivers: drivers,
                    travels: travelsJson,
                  });
                })
              }
            )
          });
        };
        var cbNotAdmin = function(admin) {
          // get the user travel history
          Travel.find(
            {where: {'driverId': sess.user.id}, order: 'date DESC', include: ['driver','car']},
            function(err, travels) {
            if (err) return res.send(err);
            if(travels==null) return notFound(res);
            var travelsJson=[];
            travels.forEach(function(travel){
              travelsJson.push(travel.toJSON());
            });
            res.render('index', {
              user: driver.toJSON(),
              admin: admin,
              moment: moment,
              travels: travelsJson
            });
          });
        };
        return checkIsAdmin(cbAdmin, cbNotAdmin);
      });
    }
    else
      res.render('login');
  });
  /* Login */
  router.post('/login', function(req, res) {
    Driver.login({
        username: req.body.username,
        password: ' ',
      },
      'user',
      function(err, token) {
        if (err) return res.send(err);
        var t = token.toJSON();
        sess.user = t.user;
        delete t.user;
        sess.token = new AccessToken(t);

        res.redirect('/');
      });
  });
  /* Save the received car, after checking if the current user is able to do it */
  router.post('/editcar/:id', function(req, res) {
    checkLoginAction(res);
    Driver.findById(sess.user.id, {}, function(err, driver) {
      if (err) return res.send('error');
      if(driver==null) return notFound(res);
      var carData = {'registrationNumber': req.body.registrationNumber,
        'color': req.body.color};

      var id = req.params.id;

      if (id == "new") {
        // create the car only if it's a new car, with a new registrationNumber
        Car.findOrCreate(
          {where: {'registrationNumber': req.body.registrationNumber}},
          carData, function(err, obj) {
            if (err) return res.send(err);

            obj.drivers.add(driver, function(err) {
              if (err) return res.send(err);
              res.redirect('/editcar/' + id);
            });
          }
        );
      } else {
        // find the car and update its attributes
        var finalCb = function() {
          Car.findById(id, function(err, car) {
            if (err) return res.send(err);
            if(car==null) return notFound(res);
            car.registrationNumber = req.body.registrationNumber;
            car.color = req.body.color;
            car.save(function(err, car) {
              if (err) return res.send('error');
              res.redirect('/editcar/' + id);
            });
          })
        };

        // if the user isn't admin, check if he drives the car
        var cbNotAdmin = function() {
          ds.connector.execute('SELECT id FROM CarDriver WHERE driverId = ? AND carId = ?', [sess.user.id, id], function(err, car) {
            if(err) return res.send('error');
            if(car.length == 1) {
              return finalCb();
            }
            return res.send('error');
          });
        };
        var cbAdmin = finalCb;

        return checkIsAdmin(cbAdmin, cbNotAdmin);
      }
    });
  });

  // this methods runs cb only if the current user owns the target car or if the car is new
  function retrieveCar(res, idCar, cb) {
    ds.connector.execute('SELECT c.registrationNumber, c.id, c.color FROM CarDriver JOIN e_car c ON carId = c.id WHERE driverId = ?', [sess.user.id], function(err, cars) {
      if (err) return res.send(err);

      Driver.findById(sess.user.id, {}, function(err, driver) {
        if (err) return res.send(err);
        if(driver==null) return notFound(res);
        var car = {};
        var found = false;
        if (!isNaN(idCar)) {
          for (var i = 0; i < cars.length; i++) {
            if (cars[i].id == idCar) {
              car = cars[i];
              found = true;
            }
          }
        }
        if (idCar === 'new' || !isNaN(idCar) && found)
          return cb(cars, idCar, car);
        else
          return res.send('error');
      });
    });
  }

  // runs cb if the target car is found. It also sends the user cars.
  function retrieveCarAdmin(res, idCar, cb) {
    ds.connector.execute('' +
      'SELECT c.registrationNumber, c.id FROM CarDriver' +
      ' JOIN e_car c ON carId = c.id WHERE driverId = ?',
      [sess.user.id], function(err, cars) {
      if (err) return res.send(err);
      Car.findById(idCar, function(err, car) {
        if (err) return res.send(err);
        if (idCar == 'new') {
          car = {};
        } else if(!car) {
          return notFound(res);
        } else
        {
          car = car.toJSON();
        }
        return cb(cars, idCar, car);
      });
    })
  }

  // runs the appropriate method
  function getAutorizedCar(res, idCar, cbFinal) {
    var cbNotAdmin = function() {
      retrieveCar(res, idCar, cbFinal);
    };
    var cbAdmin = function() {
      retrieveCarAdmin(res, idCar, cbFinal);
    };
    return checkIsAdmin(cbAdmin, cbNotAdmin);
  }

  // prevents from displaying a view if the user isn't logged
  function checkLoginAction(res) {
    if (!checkLogin(sess.token)) {
      res.redirect('/');
    }
  }

  /* Display the "Manage cars" view */
  router.get('/editcar/:id', function(req, res) {
    checkLoginAction(res);

    var idCar = req.params.id;

    var cbFinal = function(cars, idCar, car) {
      res.render('editcar', {
        cars: cars,
        id: idCar,
        car: car
      });
    };

    getAutorizedCar(res, idCar, cbFinal);

  });

  // save the user personnal data
  function saveUser(err, driver, req, res) {
    if (err) return res.send(err);
    var dataHabitation = {};
    var habitationsKeys = ['name', 'address',
      'postalCode', 'value', 'city', 'country'];
    for (var i = 0; i < habitationsKeys.length; i++) {
      dataHabitation[habitationsKeys[i]] = req.body['hab_' + habitationsKeys[i]];
    }
    var dataDriver = {'name': req.body.name, 'firstName': req.body.firstname,
      'email': req.body.email};
    driver.updateAttributes(dataDriver, function(err, driver) {
      if (err) return res.send(err);

      driver.habitation(function(err, habitation) {
        if (err) return res.send(err);
        habitation.updateAttributes(dataHabitation, function(err, habitation) {
          if (err) return res.send(err);
          res.redirect('/editinfos/' + driver.id);
        })
      });
    });
  }

  /* Save the received data */
  router.post('/editinfos/:id', function(req, res) {
    checkLoginAction(res);
    var cbNotAdmin = function() {
      Driver.findById(sess.user.id, function(err, driver) {
        if (err) return res.send(err);
        if(driver==null) return notFound(res);
        return saveUser(err, driver, req, res);
      })
    }
    var cbAdmin = function() {
      Driver.findById(req.params.id, function(err, driver) {
        if (err) return res.send(err);
        if(driver==null) return notFound(res);
        return saveUser(err, driver, req, res);
      });
    }
    return checkIsAdmin(cbAdmin, cbNotAdmin);
  });

  // get the personnal user informations to display it in the form
  function editForm(err, driver, res) {
    if (err) return res.send(err);

    driver.habitation(function(err, habitation) {
      if (err) return res.send(err);
      habitation['alias_value'] = habitation['value'];
      var jsonHabitation = habitation.toJSON();

      res.render('editinfos', {
        user: driver.toJSON(),
        habitation: jsonHabitation,
        id: driver.id,
        sess: sess
      });
    });
  }

  // display the form after checking that the current user is able to do it
  router.get('/editinfos/:id', function(req, res) {
    checkLoginAction(res);

    var mainAction = function() {
      Driver.findById(req.params.id, function(err, driver) {
        if(driver==null) return notFound(res);
        return editForm(err, driver, res);
      });
    };
    var cbNotAdmin = function() {
      if (!(req.params.id == sess.user.id)) {
        return res.redirect('/editinfos/' + sess.user.id);
      }
      mainAction();
    };
    var cbAdmin = function() {
      mainAction();
    };
    return checkIsAdmin(cbAdmin, cbNotAdmin);
  });
  app.use(router);
};
