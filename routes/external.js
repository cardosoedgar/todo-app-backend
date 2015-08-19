module.exports = function(app) {
    var externalRoutes = {};
    var User = app.get('models').User;
    var Utils = app.get('Utils');
    var uuid = require('node-uuid');
    var crypt = require('bcrypt');

    externalRoutes.login = function(req, res) {
      User.findOne({where: { email: req.body.email }}).then(function(user) {
        if(!user) {
           res.json({success: false, message: 'Email or password is incorrect.'});
           return;
         }

         if(!crypt.compareSync(req.body.password, user.password)) {
           res.json({success: false, message: 'Email or password is incorrect.'});
           return;
         }

          user.access_token = Utils.createToken(user.email);
          user.update({access_token: user.access_token}, {where: {id:user.id}}).then(function(updated) {
              res.json({success: true, message: 'You are logged in.', user: user});
          });
      });
    };

    externalRoutes.signup = function(req, res) {
         var user = {
            id: uuid.v4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
         };

         User.build(user).validate().then(function(result) {
            if(result) {
               res.json({success: false, message: result.errors[0].message});
               return;
            }

             user.password = crypt.hashSync(req.body.password, crypt.genSaltSync(10));
             User.create(user).then(function(result) {
                res.json({success: true, message: 'You can now login.'});
             }).catch(function(err) {
                res.json({success: false, message: err.errors[0].message});
             });
         });
    };

    return externalRoutes;
};
