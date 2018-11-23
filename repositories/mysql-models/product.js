module.exports = function (sequelize, DataTypes) {
  return sequelize.define('product', {
    product_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(2083),
      allowNull: false
    },
    rating_average: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_review: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    short_description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    compared_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false
    },
    shows: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
      underscored: true,
    })
}