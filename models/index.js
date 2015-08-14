var Sequelize = require('sequelize');
var config    = {
  name: 'todo_app',
  username: 'root',
  password: '',
  options: {
  host: 'localhost',
  port:3306,
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
  'List', 'Task'
];

models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

sequelize.sync();

(function(models){
   models.List.hasMany(models.Task);
})(module.exports);

module.exports.sequelize = sequelize;
