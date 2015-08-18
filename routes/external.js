module.exports = function(app) {
    var externalRoutes = {};
    var User = app.get('models').User;
    var uuid = require('node-uuid');
    var crypt = require('bcrypt');

    externalRoutes.login = function(req, res){
      var User = app.get('models').User;
      if(!isValidCredentials(req, res))
        return;

      User.findOne({where: { email: req.body.email }}).then(function(user) {
        if(user) {
           if(crypt.compareSync(req.body.password, user.password)) {
              user.access_token = app.get('Utils').createToken(user.email);
              updateUserTokenAndThenLogin(user, res);
           } else {
              res.json({success: false, message: 'Email or password is incorrect.'});
            }
         } else {
           res.json({success: false, message: 'Email or password is incorrect.'});
         }
      });
    };

    externalRoutes.signup = function(req, res){
         var user = {
            id: uuid.v4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
         };

         User.build(user).validate().then(function(result){
            if(result) {
               res.json({success: false, message: result.errors[0].message});
            } else {
               user.password = crypt.hashSync(req.body.password, crypt.genSaltSync(10));
               User.create(user).then(function(result){
                  res.json({success: true, message: 'You can now login.'});
               }).catch(function(err){
                  res.json({success: false, message: err.errors[0].message});
               });
            }
         });
    };

    return externalRoutes;
};

var isValidCredentials = function(req,res) {
    if(req.body.password == '' || req.body.email == '') {
        res.json({success: false, message: 'Invalid credentials.'});
        return false;
    }

    return true;
};

var updateUserTokenAndThenLogin = function(user, res) {
  user.update({access_token: user.access_token}, {where: {id:user.id}}).then(function(updated){
    if(updated){
      res.json({success: true, message: 'You are logged in.', user: user});
    } else {
      res.json({success: false, message: 'An error occurred. Try again later.'});
    }
  });
};
