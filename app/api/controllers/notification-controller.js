/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật notification, 
 * Admin có thể gửi notification_id trong params nhưng thủ kho lại để notification_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(notification_service) {
    this.notification_service = notification_service

    this.find_by_user = this.find_by_user.bind(this)
    this.get_unseen_number = this.get_unseen_number.bind(this)
    this.mark_seen = this.mark_seen.bind(this)
    this.mark_seen_all = this.mark_seen_all.bind(this)
  }


  find_by_user(req, res, next) {
    let { user_id } = req.authen_user
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
    let { user_id } = req.authen_user
    this.notification_service.get_unseen_number(user_id, (err, count) => {
      if (err) next(err)
      else {
        console.log(count)
        res.result = { count }
        next()
      }
    })
  }

  mark_seen_all(req, res, next) {
    let { user_id } = req.authen_user
    this.notification_service.mark_seen_all(user_id, (err, result) => {
      if (err) next(err)
      else {
        console.log(result)
        res.result = result;
        next()
      }
    })
  }

  mark_seen(req, res, next) {
    let { user_id } = req.authen_user
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
}