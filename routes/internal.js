module.exports = function(app) {
   var User = app.get('models').User;
   var Utils = app.get('Utils');
   var uuid = require('node-uuid');
   var crypt = require('bcrypt');

   var internalRoutes = {};

   internalRoutes.updatePassword = function(req, res) {
      var userId = req.credentials.userId;
      var newPassword = req.body.new_password;
      var confirmPassword = req.body.confirm_password;
      var oldPassword = req.body.old_password;

      if(newPassword !== confirmPassword) {
         res.json({success: false, message: 'Passwords does not match.'});
         return;
      }

      User.findOne({where: {id: userId}}).then(function(user){
         if(!user) {
           res.json({success: false, message: 'User not found.'});
           return;
         }

         if(!crypt.compareSync(oldPassword, user.password)) {
           res.json({success: false, message: 'Password is wrong.'});
           return;
         }

         user.secret = uuid.v1();
         newPassword = crypt.hashSync(newPassword, crypt.genSaltSync(10));
         var access_token = Utils.createToken(user);
         user.update({password: newPassword, secret: user.secret}, {where: {id: userId}}).then(function(updated) {
             res.json({success: true, message: 'Password updated.', token: access_token});
         });
      });
   };

   return internalRoutes;
};
