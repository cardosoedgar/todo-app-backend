exports.createToken = function(email) {
   var jwt = require('jsonwebtoken');
   return jwt.sign(email, require('./secret'), {
      expiresInMinutes: 1440
    });
};
