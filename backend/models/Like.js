const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    user: { type: DataTypes.STRING, allowNull: false }
  });
  return Like;
};
