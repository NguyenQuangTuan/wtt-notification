const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notification', {
    notification_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    created_at: Sequelize.DATE
  }, {
      underscored: true,
    })
}