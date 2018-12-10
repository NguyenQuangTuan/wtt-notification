module.exports = class NotificationRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.sequelize = db_context.sequelize
    this.Notification = db_context.Notification
    this.Topic = db_context.Topic
    this.UserTopic = db_context.UserTopic
    this.UserUnseen = db_context.UserUnseen
    this.Op = db_context.sequelize.Op;

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.find_by_user = this.find_by_user.bind(this)
    this.get_unseen_number = this.get_unseen_number.bind(this)
    this.add_unseen_notify = this.add_unseen_notify.bind(this)
    this.mark_seen = this.mark_seen.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.Notification
      .findAll({
        attributes: select,
        where: condition,
        limit: limit,
        offset: offset * limit,
        order_by: order_by,
      })
      .then(res => {
        res = res.map(ck => ck.dataValues)
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  find_by_user({ page, size, user_id }, callback) {
    this.UserTopic
      .findAll({
        attributes: ['topic_id'],
        where: { user_id }
      })
      .then(res1 => res1 = res1.map(ck => ck.dataValues.topic_id))
      .then(topics => this.Notification
        .findAll({
          where: {
            topic_id: {
              [this.Op.in]: topics
            }
          },
          limit: size,
          offset: page * size,
          order: [['created_at', 'DESC' ]]
        }))
      .then(res => {
        res = res.map(ck => ck.dataValues)
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  get_unseen_number(user_id, callback) {
    this.UserUnseen
      .findOne({
        where: { user_id }
      })
      .then(find_instance => {
        if (!find_instance || !find_instance.dataValues) {
          callback(null, null)
          return null
        }
        callback(null, find_instance.unseen.length)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  add_unseen_notify(user_id, notification, callback) {
    this.UserUnseen
      .findOne({
        where: { user_id }
      })
      .then(find_instance => {
        if (!find_instance || !find_instance.dataValues) {
          callback(null, null)
          return null
        }
        let unseenNow = find_instance.dataValues.unseen.split(',');
        if (unseenNow.indexOf(notification) >= 0) {
          callback(null, { added: true })
          return null;
        }
        unseenNow.push(notification);
        console.log(unseenNow)
        return find_instance.update({ unseen: unseenNow });
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  mark_seen(user_id, notifications, callback) {
    this.UserUnseen
      .findOne({
        where: { user_id }
      })
      .then(find_instance => {
        if (!find_instance || !find_instance.dataValues) {
          callback(null, null)
          return null
        }
        let unseenBefore = find_instance.dataValues.unseen.split(',');
        console.log(notifications);
        let unseenAfter = unseenBefore.filter(notify => notifications.indexOf(notify) < 0);
        console.log(unseenAfter)
        return find_instance.update({ unseen: unseenAfter });
      }).then(() => {
        callback(null, { success: true })
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  find_one(condition = {}, select = null, callback) {
    this.Notification
      .findOne({
        where: condition,
        attributes: select,
      })
      .then(res => {
        if (!res) {
          callback(null, null)
          return null
        }
        else {
          callback(null, res ? res.dataValues : null)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  create(notification, callback) {
    this.Notification
      .create(notification)
      .then(res => {
        if (!res) return callback(null, null)
        console.log(res);
        return this.Topic.findOne({
          where: {
            topic_id: res.topic_id
          },
          raw: true
        })
      })
      .then(topic => {
        console.log(topic);
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  update(condition, notifcation_obj, callback) {
    this.Notification
      .update(notifcation_obj, { where: condition })
      .then(res => {
        res = res.every(val => val == 1)
        callback(null, res)

        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }


  delete(condition, callback) {
    this.Notification
      .update(
        { shows: false },
        { where: condition }
      )
      .then(res => {
        callback(null, true)
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }
}