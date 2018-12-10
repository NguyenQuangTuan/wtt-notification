const setArr = (value) => {
  if (!value) return '';
  return JSON.stringify(value);
}

const parseArr = (value) => {
  try {
    if (value != '') {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {
    return [];
  } z
}


module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user-unseen', {
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    unseen: {
      type: DataTypes.STRING(255),
      get() {
        return this.getDataValue('unseen').split(',')
      },
      set(val) {
        this.setDataValue('unseen', val.join(','));
      }
    }
  }, {
      underscored: true
    })
}

