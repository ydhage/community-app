const sequelize = require('../config/db');

const Post = require('./Post')(sequelize);
const Like = require('./Like')(sequelize);
const Comment = require('./Comment')(sequelize);

// Associations
Post.hasMany(Like, { onDelete: 'CASCADE' });
Like.belongsTo(Post);

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

module.exports = { sequelize, Post, Like, Comment };
