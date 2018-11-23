/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật product, 
 * Admin có thể gửi product_id trong params nhưng thủ kho lại để product_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(product_service) {
    this.product_service = product_service

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(req, res, next) {
    let condition = {} // tìm theo thằng nào
    let select = req.fields ? req.fields.split(' ') : null // những trường mà mình muốn lấy ra
    let offset = req.options.offset || req.options.skip // số thứ tự trang
    let limit = req.options.limit // số phần tử trong một trang
    let order_by = req.options.sort ? req.options.sort : { created_at: -1 } // sắp xếp theo cái gì

    this.product_service.find_all(condition, select, offset, limit, order_by, (err, products) => {
      if (err) next(err)
      else {
        res.products = { products }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let { product_id } = req.params
    let condition = { product_id }
    let select = req.fields ? req.fields.split(' ') : null

    this.product_service.find_one(condition, select, (err, product) => {
      if (err) next(err)
      else {
        res.product = { product }
        next()
      }
    })
  }

  create(req, res, next) {
    let { product } = req.body
    this.product_service.create(product, (err, created) => {
      if (err) next(err)
      else {
        res.created = { product: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { product_id } = req.params
    let { product } = req.body
    let condition = { product_id }

    this.product_service.update(condition, product, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { product_id } = req.params
    let condition = { product_id }

    this.product_service.detele(condition, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}