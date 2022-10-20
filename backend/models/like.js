'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post,User}) {
      // define association here
      this.belongsTo(User,{foreignKey:"userId",as:"users"})
      this.belongsTo(Post,{foreignKey:"userId",as:"posts"})
    
    
    }
  }
  Like.init({
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName:'likes'
  });
  return Like;
};