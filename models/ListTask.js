module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var ListTask = sequelize.define('ListTask', {
    id: {
      type: DataTypes.INTEGER
    },
    task_id: {
      type: DataTypes.STRING
    },
    list_id: {
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'ListTask',
    timestamps: false
  });

   return ListTask;
};
