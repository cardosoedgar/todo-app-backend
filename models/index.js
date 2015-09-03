var Sequelize = require('sequelize');
var config    = {
  name: 'todo_app',
  username: 'root',
  password: '',
  options: {
  host: 'localhost',
  port:3307,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
    }
  }
};

var sequelize = new Sequelize(
  config.name,
  config.username,
  config.password,
  config.options
);

var models = [
  'User', 'List', 'Task',
];

models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

sequelize.sync();
// sequelize.sync({force: true});  //force the DB to drop all tables

(function(models){
   models.List.hasMany(models.Task);
   models.Task.belongsTo(models.List);
   models.User.hasMany(models.List, {foreignKey: 'userId'});
   models.List.belongsTo(models.User, {foreignKey: 'userId'});
})(module.exports);

module.exports.sequelize = sequelize;
