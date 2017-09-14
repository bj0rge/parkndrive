module.exports = function(app) {

  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  // give the admin rank to the first user
  Role.create({name: 'admin'}, function (err, role) {
    if (err) return debug(err);
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: 1
    }, function (err, principal) {
      if (err) return debug(err);
    })
  });

}
