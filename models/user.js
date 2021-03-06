'use strict';
const bcrypt = require("bcrypt")
const createError = require('http-errors');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.payment, {
        as: "payment",
        foreignKey: {
          name: "userId"
        }
      })
      user.hasOne(models.notif,{
        as: "notif",
        foreignKey: {
          name: "userId"
        }
      })
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.BIGINT,
    address: DataTypes.STRING,
    status: DataTypes.INTEGER,
    subscribe: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', async(user,next)=>{
    try{
      const hashPassword = await bcrypt.hash(user.password, 10)
      user.password = hashPassword;
    }catch(error) {
      throw createError.InternalServerError()
    }
  })

  return user;
};