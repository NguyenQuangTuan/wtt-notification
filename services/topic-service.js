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
const Topic = require('../domain-models/topic/topic')
module.exports = class {
  constructor(topic_repository) {
    this.topic_repository = topic_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.get_all_user_by_topic = this.get_all_user_by_topic.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.topic_repository.find_all, condition, select, offset, limit, order_by),
      (err, topics) => {
        return callback(err, topics)
      }
    )
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.topic_repository.find_one, condition, select),
      (err, topic) => {
        if (err) return callback(err)
        else if (!topic) return callback({ type: 'Not Found' })
        else return callback(null, topic)
      }
    )
  }

  create(topic, callback) {
    let new_topic = new Topic(topic)
    async.retry(
      config.retry,
      async.apply(this.topic_repository.create, new_topic, (err, created) => {
        return callback(err, created)
      })
    )
  }

  update(condition, topic, callback) {
    let new_topic = new Topic(topic)
    async.retry(
      config.retry,
      async.apply(this.topic_repository.update, condition, new_topic),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }

  delete(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.topic_repository.delete, condition),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }

  get_all_user_by_topic(topic_id, type, callback){
    async.retry(
      config.retry,
      async.apply(this.topic_repository.get_all_user_by_topic, topic_id, type),
      (err, refresh_tokens) => {
        return callback(err, refresh_tokens)
      }
    )
  }
}