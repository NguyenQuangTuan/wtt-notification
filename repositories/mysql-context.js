const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  // const Product = sequelize.import('./mysql-models/product');
  const Notification = sequelize.import('./mysql-models/notification');
  const User = sequelize.import('./mysql-models/user');
  const UserNotification = sequelize.import('./mysql-models/user-notification');

  return { User, UserNotification, Notification, sequelize }
}

module.exports = DataContext