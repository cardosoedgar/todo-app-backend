module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var List = sequelize.define('List', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Invalid list name.'}
      }
    }
  }, {
    timestamps: false
  });

  return List
};
