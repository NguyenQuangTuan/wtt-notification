/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật notification, 
 * Admin có thể gửi notification_id trong params nhưng thủ kho lại để notification_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(notification_service, user_unseen_service) {
    this.notification_service = notification_service

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.find_by_user = this.find_by_user.bind(this)
    this.get_unseen_number = this.get_unseen_number.bind(this)
    this.mark_seen = this.mark_seen.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(req, res, next) {
    let condition = {} // tìm theo thằng nào
    let select = req.fields ? req.fields.split(' ') : null // những trường mà mình muốn lấy ra
    let offset = req.options.offset || req.options.skip // số thứ tự trang
    let limit = req.options.limit // số phần tử trong một trang
    let order_by = req.options.sort ? req.options.sort : { created_at: -1 } // sắp xếp theo cái gì

    this.notification_service.find_all(condition, select, offset, limit, order_by, (err, notifications) => {
      if (err) next(err)
      else {
        res.notifications = { notifications }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let { notification_id } = req.params
    let condition = { notification_id }
    let select = req.fields ? req.fields.split(' ') : null

    this.notification_service.find_one(condition, select, (err, notification) => {
      if (err) next(err)
      else {
        res.notification = { notification }
        next()
      }
    })
  }

  find_by_user(req, res, next) {
    let { user_id } = req.query
    // let { user_id } = req.authen_user
    let { page, size } = req.query
    page = Number(page) || 0;
    size = Number(size) || 20;
    this.notification_service.find_by_user({ page, size, user_id }, (err, notifications) => {
      if (err) next(err)
      else {
        res.notifications = { notifications }
        next()
      }
    })
  }

  get_unseen_number(req, res, next) {
    let { user_id } = req.query
    // let { user_id } = req.authen_user
    this.notification_service.get_unseen_number(user_id, (err, count) => {
      if (err) next(err)
      else {
        console.log(count)
        res.result = { count }
        next()
      }
    })
  }

  mark_seen(req, res, next) {
    let { user_id } = req.query
    // let { user_id } = req.authen_user
    let { notifications } = req.body
    this.notification_service.mark_seen(user_id, notifications, (err, result) => {
      if (err) next(err)
      else {
        console.log(result)
        res.result = result;
        next()
      }
    })
  }

  create(req, res, next) {
    let { notification } = req.body
    this.notification_service.create(notification, (err, created) => {
      if (err) {
        console.log(err);
        next(err)
      }
      else {
        res.created = { notification: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { notification_id } = req.params
    let { notification } = req.body
    let condition = { notification_id }

    this.notification_service.update(condition, notification, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { notification_id } = req.params
    let condition = { notification_id }

    this.notification_service.detele(condition, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}