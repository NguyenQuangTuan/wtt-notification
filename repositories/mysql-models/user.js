const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    user_firebase_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    refresh_token: DataTypes.STRING(500),
    created_at: Sequelize.DATE
  }, {
      underscored: true
    })
}