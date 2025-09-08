const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    user: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false }
  });
  return Comment;
};
