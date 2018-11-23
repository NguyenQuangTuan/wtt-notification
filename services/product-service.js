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
const Product = require('../domain-models/product/product')

module.exports = class {
  constructor(product_repository) {
    this.product_repository = product_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.product_repository.find_all, condition, select, offset, limit, order_by),
      (err, products) => {
        return callback(err, products)
      }
    )
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.product_repository.find_one, condition, select),
      (err, product) => {
        if (err) return callback(err)
        else if (!product) return callback({ type: 'Not Found' })
        else return callback(null, product)
      }
    )
  }

  create(product, callback) {
    let new_product = new Product(product)
    async.retry(
      config.retry,
      async.apply(this.product_repository.create, new_product, (err, created) => {
        return callback(err, created)
      })
    )
  }

  update(condition, product, callback) {
    let new_product = new Product(product)
    async.retry(
      config.retry,
      async.apply(this.product_repository.update, condition, new_product),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }

  delete(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.product_repository.delete, condition),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}