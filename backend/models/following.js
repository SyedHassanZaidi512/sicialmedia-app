'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Following extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User,{foreignKey:"userId",as:"users"})
    }
  }
  Following.init({
    followingId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Following',
    tableName:"followings"
  });
  return Following;
};