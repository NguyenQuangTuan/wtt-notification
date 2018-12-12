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

    this.update_or_create = this.update_or_create.bind(this)
    this.delete = this.delete.bind(this)
  }

  update_or_create(req, res, next) {
    let { user_id } = req.authen_user
    let { refresh_token } = req.body;
    this.user_service.update_or_create({ user_id, refresh_token }, (err, result) => {
      if (err) next(err)
      else {
        res.result = { result }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { user_id } = req.authen_user
    let { refresh_token } = req.body;
    let condition = { user_id, refresh_token }

    this.user_service.delete(condition, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}