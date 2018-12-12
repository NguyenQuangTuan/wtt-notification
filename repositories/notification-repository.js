module.exports = class NotificationRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.sequelize = db_context.sequelize
    this.Notification = db_context.Notification
    this.UserNotification = db_context.UserNotification
    this.Op = db_context.sequelize.Op;

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.find_by_user = this.find_by_user.bind(this)
    this.get_unseen_number = this.get_unseen_number.bind(this)
    this.add_notify_user = this.add_notify_user.bind(this)
    this.mark_seen = this.mark_seen.bind(this)
    this.create = this.create.bind(this)
    this.createNotify = this.createNotify.bind(this)
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
    this.UserNotification
      .findAll({
        attributes: ['notification_id'],
        where: { user_id }
      })
      .then(res1 => res1 = res1.map(ck => ck.dataValues.notification_id))
      .then(notifications => this.Notification
        .findAll({
          where: {
            notification_id: {
              [this.Op.in]: notifications
            }
          },
          limit: size,
          offset: page * size,
          order: [['created_at', 'DESC']]
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
    this.UserNotification
      .count({
        where: { user_id, seen: false }
      })
      .then(res => {
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  add_notify_user(notification_id, users, callback) {
    let user_notification_obj_arr = users.map(user_id => {
      return {
        notification_id,
        user_id
      }
    })
    console.log(user_notification_obj_arr);
    return new Promise((resolve, reject) => {
      this.UserNotification
        .bulkCreate(user_notification_obj_arr)
        .then(() => {
          resolve({ success: true })
          return null
        })
        .catch(err => {
          console.log(err)
          reject(err)
          return null
        })
    })

  }

  mark_seen(user_id, notifications, callback) {
    this.UserNotification
      .update({ seen: true }, {
        where: {
          user_id,
          notification_id: {
            [this.Op.in]: notifications
          }
        }
      })
      .then((res) => {
        callback(null, {success: true})
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
        callback(null, res.dataValues)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  createNotify(notification) {
    return this.Notification.create(notification)
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