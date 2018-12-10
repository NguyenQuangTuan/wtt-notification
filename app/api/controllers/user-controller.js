/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật user, 
 * Admin có thể gửi user_id trong params nhưng thủ kho lại để user_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(user_service) {
    this.user_service = user_service

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update_or_create = this.update_or_create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(req, res, next) {

    let condition = {} // tìm theo thằng nào
    let select = req.fields ? req.fields.split(' ') : null // những trường mà mình muốn lấy ra
    let offset = req.options.offset || req.options.skip // số thứ tự trang
    let limit = req.options.limit // số phần tử trong một trang
    let order_by = req.options.sort ? req.options.sort : { created_at: -1 } // sắp xếp theo cái gì

    this.user_service.find_all(condition, select, offset, limit, order_by, (err, users) => {
      if (err) next(err)
      else {
        res.users = { users }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let { user_id } = req.params
    let condition = { user_id }
    let select = req.fields ? req.fields.split(' ') : null

    this.user_service.find_one(condition, select, (err, user) => {
      if (err) next(err)
      else {
        res.user = { user }
        next()
      }
    })
  }

  create(req, res, next) {
    let { user } = req.body
    this.user_service.create(user, (err, created) => {
      if (err) next(err)
      else {
        res.created = { user: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.params
    let { user } = req.body
    let condition = { user_id }

    this.user_service.update(condition, user, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  update_or_create(req, res, next) {
    let { user } = req.body;
    this.user_service.update_or_create(user, (err, result) => {
      if (err) next(err)
      else {
        res.result = { result }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { user_id } = req.params
    let condition = { user_id }

    this.user_service.detele(condition, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}