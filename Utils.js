exports.createToken = function(user) {
   var jwt = require('jsonwebtoken');
   var payload = {
      userId: user.id,
      userSecret: user.secret
   };

   return jwt.sign(payload, require('./secret'));
};
