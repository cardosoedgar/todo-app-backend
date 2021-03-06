module.exports = function(sequelize) {
  var DataTypes = require('sequelize');
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUUID: 4
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Invalid email.'},
        isUnique: function (email, done) {
            User.find({ where: { email: email }}).done(function (user) {
                    if (user) {
                        done(new Error('Email already in use.'));
                    }
                    done();
            });
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Invalid password.'},
        len: {
           args: [6,255],
           msg: 'Password must contain 6 characteres or more.'
        }
      }
    },
    secret: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    instanceMethods: {
      toJSON: function () {
        var result = this.get({plain:true});
        delete result['password'];
        delete result['secret'];
        return result;
      }
    }
  });

  return User;
};
