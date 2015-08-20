module.exports = function(app) {
    var externalRoutes = {};
    var User = app.get('models').User;
    var List = app.get('models').List;
    var Task = app.get('models').Task;
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

          var access_token = Utils.createToken(user);
          List.findAll({
            include: [{model: Task, attributes:['id','name']}]
          }).then(function(lists) {
             res.json({success: true, message: 'You are logged in.', user: user, token: access_token, lists: lists});
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
             user.secret = uuid.v1();
             user.password = crypt.hashSync(req.body.password, crypt.genSaltSync(10));
             User.create(user).then(function(user) {
                createBasicListsForUser(user.id, app);
                res.json({success: true, message: 'You can now login.'});
             }).catch(function(err) {
                res.json({success: false, message: err.errors[0].message});
             });
         });
    };

    return externalRoutes;
};

var createBasicListsForUser = function(userId, app) {
   var List = app.get('models').List;

   console.log('criei listas');

   List.create({
     name: 'Todo',
     userId: userId
   });

   List.create({
     name: 'Done',
     userId: userId
   });
};
