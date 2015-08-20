module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Invalid task name.'},
        isUnique: function (name, done) {
            var self = this;
            Task.find({ where: {name: name,listId:self.listId}}).done(function (name) {
                    if (name) {
                        done(new Error('Task already exist in this list.'));
                    }
                    done();
            });
        }
      }
    }
  }, {
    timestamps: false,
  });

  return Task
};
