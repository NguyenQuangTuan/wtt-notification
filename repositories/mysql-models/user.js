const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    refresh_token: DataTypes.STRING(500),
    created_at: Sequelize.DATE
  }, {
      underscored: true
    })
}