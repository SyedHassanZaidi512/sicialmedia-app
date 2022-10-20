'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Comment,Like}) {
      // define association here
      //userId
      this.belongsTo(User,{foreignKey:"userId",as:"users"})
      //has-relation
      this.hasMany(Comment,{foreignKey:"postId",as:"comments"})
      this.hasMany(Like,{foreignKey:"postId",as:"likes"})
    
    }
  }
  Post.init({
    title:DataTypes.STRING,
    description: DataTypes.STRING,
    show: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
    tableName:"posts"
  });
  return Post;
};