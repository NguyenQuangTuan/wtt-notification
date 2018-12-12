/**
 * Tầng Service:
 * - Nhiệm vụ: Là nơi xử lý logic, tầng service nhận dữ liệu đã đc chuẩn hóa 
 * ở tầng controller bên trên và nó chỉ quan tâm tới việc xử lý logic nghiệp 
 * vụ, nếu 1 trường bắt buộc là số int thì vào đến service nó phải là int,
 * nếu không phải int nó đã bị chặn và trả về lỗi ở tầng controller và validate 
 * ở trên rồi
 */

const async = require('async')
const config = require('../config/config')
const Notification = require('../domain-models/notification/notification')

module.exports = class {
  constructor(notification_repository) {
    this.notification_repository = notification_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.find_by_user = this.find_by_user.bind(this)
    this.get_unseen_number = this.get_unseen_number.bind(this)
    this.mark_seen = this.mark_seen.bind(this)
    this.add_notify_user = this.add_notify_user.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.find_all, condition, select, offset, limit, order_by),
      (err, notifications) => {
        return callback(err, notifications)
      }
    )
  }

  find_by_user({ page, size, user_id }, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.find_by_user, { page, size, user_id }),
      (err, notifications) => {
        return callback(err, notifications)
      }
    )
  }

  add_notify_user(notification_id, users, callback){
    async.retry(
      config.retry,
      async.apply(this.notification_repository.add_notify_user, notification_id, users),
      (err, result) => {
        return callback(err, result)
      }
    )
  }

  get_unseen_number(user_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.get_unseen_number, user_id),
      (err, result) => {
        if (err) {
          return callback(err)
        }
        return callback(err, result)
      }
    )
  }

  mark_seen(user_id, notifications, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.mark_seen, user_id, notifications),
      (err, result) => {
        if (err) {
          return callback(err)
        }
        if (!result) {
          return callback({ type: 'Not Found' })
        }
        return callback(err, result)
      }
    )
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.find_one, condition, select),
      (err, notification) => {
        if (err) return callback(err)
        else if (!notification) return callback({ type: 'Not Found' })
        else return callback(null, notification)
      }
    )
  }

  create(notification, callback) {
    let new_notification = new Notification(notification)
    async.retry(
      config.retry,
      async.apply(this.notification_repository.create, new_notification, (err, created) => {
        return callback(err, created)
      })
    )
  }

  update(condition, notification, callback) {
    let new_notification = new Notification(notification)
    async.retry(
      config.retry,
      async.apply(this.notification_repository.update, condition, new_notification),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }

  delete(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.notification_repository.delete, condition),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}