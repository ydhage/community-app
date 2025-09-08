// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Post = sequelize.define("Post", {
//   caption: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   user: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   }
// });

// module.exports = Post;

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    caption: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    user: { type: DataTypes.STRING, allowNull: false } // साधेपणासाठी user नाव (JWT झाल्यावर id ठेऊ शकता)
  });
  return Post;
};
