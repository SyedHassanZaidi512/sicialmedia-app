'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {

    static associate({User}) {
      // define association here
      //userId is foreignkey
      this.belongsTo(User,{foreignKey:"userId",as:"users"})
      

    }
  }
  Follower.init({
    followerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Follower',
    tableName:"followers"

  });
  return Follower;
};