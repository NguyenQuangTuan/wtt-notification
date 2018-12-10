const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('post', {
    post_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
  }, {
      underscored: true,
    })
}