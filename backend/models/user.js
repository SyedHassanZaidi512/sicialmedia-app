'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post,Follower,Following,Comment,Like}) {
      // define association here
      //userId is foreignkey
      this.hasMany(Post,{foreignKey:'userId',as:'posts'})
      this.hasMany(Follower,{foreignKey:'userId',as:'followers'})
      this.hasMany(Following,{foreignKey:'userId',as:'followings'})
      this.hasMany(Comment,{foreignKey:'userId',as:'comments'})
      this.hasOne(Like,{foreignKey:'userId',as:'likes'})
    
    }
 
    
  }
  User.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    picture:{
      type:DataTypes.STRING,

    },
  }, {
    sequelize,
    modelName: 'User',
    tableName:'users'
  });
  return User;
};