const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('topic', {
    topic_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    created_at: Sequelize.DATE,
    shows: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
      underscored: true,
    })
}