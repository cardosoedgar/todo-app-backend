var jwt = require('jsonwebtoken');

module.exports = function(app) {
  var User = app.get('models').User;

  var authorizeUser = function(req, res, next) {
    var token = req.headers['x-access-token'];

    if(!token) {
      res.status(401);
      res.json({success:false, status: 401, message: 'Invalid Token' });
      return;
    }

     jwt.verify(token, require('./secret'), function(err, credentials){
       User.findOne({where: {id: credentials.userId}}).then(function(user){
          if(user.secret === credentials.userSecret) {
             req.credentials = credentials;
             next();
          } else {
             res.status(400);
             res.json({success: false, status: 400, message: 'Expired Token.'});
          }
       });
     });
  };

  return authorizeUser;
};
