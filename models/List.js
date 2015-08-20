module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var List = sequelize.define('List', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Invalid list name.'}
      }
    },
    userId: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    instanceMethods: {
      toJSON: function () {
        var result = this.get({plain:true});
        delete result['userId'];
        return result;
      }
    }
  });

  return List
};
