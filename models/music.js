'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class music extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      music.belongsTo(models.artist,{
        as:"artist",
        foreignKey: {
          name: "artisId"
        }
      })
    }
  }
  music.init({
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    year: DataTypes.INTEGER,
    attache: DataTypes.STRING,
    artisId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'music',
  });
  return music;
};