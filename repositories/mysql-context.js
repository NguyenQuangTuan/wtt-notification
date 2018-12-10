const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  // const Product = sequelize.import('./mysql-models/product');
  const Post = sequelize.import('./mysql-models/post');
  const Topic = sequelize.import('./mysql-models/topic');
  const UserTopic = sequelize.import('./mysql-models/user-topic-sub');
  const UserUnseen = sequelize.import('./mysql-models/user-unseen.js');
  const Notification = sequelize.import('./mysql-models/notification');
  const User = sequelize.import('./mysql-models/user');

  Notification.belongsTo(Topic, { foreignKey: 'topic_id', targetKey: 'topic_id' });
  User.belongsToMany(Topic, { through: 'user_topic', foreignKey: 'user_id' });
  Topic.belongsToMany(User, { through: 'user_topic', foreignKey: 'topic_id' });




  return { User, Topic, Notification, UserTopic, UserUnseen, sequelize }
}

module.exports = DataContext