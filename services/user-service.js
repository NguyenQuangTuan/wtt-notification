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
const User = require('../domain-models/user/user')

module.exports = class {
  constructor(user_repository) {
    this.user_repository = user_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.update_or_create = this.update_or_create.bind(this)
    this.get_refresh_tokens = this.get_refresh_tokens.bind(this)
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.find_all, condition, select, offset, limit, order_by),
      (err, users) => {
        return callback(err, users)
      }
    )
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.find_one, condition, select),
      (err, user) => {
        if (err) return callback(err)
        else if (!user) return callback({ type: 'Not Found' })
        else return callback(null, user)
      }
    )
  }

  create(user, callback) {
    let new_user = new User(user)
    async.retry(
      config.retry,
      async.apply(this.user_repository.create, new_user, (err, created) => {
        return callback(err, created)
      })
    )
  }

  update(condition, user, callback) {
    let new_user = new User(user)
    async.retry(
      config.retry,
      async.apply(this.user_repository.update, condition, new_user),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }

  delete(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.delete, condition),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }

  get_refresh_tokens(users, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.get_refresh_tokens, users),
      (err, refresh_tokens) => {
        return callback(err, refresh_tokens)
      }
    )
  }
  
  update_or_create(user, callback) {
    let new_user = new User(user)
    async.retry(
      config.retry,
      async.apply(this.user_repository.update_or_create, new_user),
      (err, result) => {
        return callback(err, result)
      }
    )
  }
}