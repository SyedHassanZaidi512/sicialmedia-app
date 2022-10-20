'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Post}) {
      // define association here
      this.belongsTo(User,{foreignKey:"userId",as:"users"})
      this.belongsTo(Post,{foreignKey:"postId",as:"posts"})
    }
  }
  Comment.init({
    text: DataTypes.STRING,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    tableName:"comments"
  });
  return Comment;
};