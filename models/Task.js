module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Invalid task name.'}
      }
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  });

  return Task
};
