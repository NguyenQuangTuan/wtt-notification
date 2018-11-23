/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */

const tokent_middleware = require('../middlewares/tokent-middleware')
const role_middleware = require('../middlewares/role-middleware')
const product_middleware = require('../middlewares/product-middleware')

module.exports = (app, product_controller) => {
  app.get('/products',
    product_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.products)
    }
  )

  app.get('/products/:product_id',
    product_controller.find_one,
    (req, res) => {
      return res.status(200).send(res.product)
    }
  )

  app.post('/products',
    tokent_middleware.verify, // Giải mã token 
    role_middleware.check_admin, // kiểm tra có phải Adim không    
    tokent_middleware.check_authen_valid, // Nếu không có vai trò nào ở trên được thỏa mãi sẽ trả về lỗi
    product_middleware.validate_create, // Validate thằng product gửi lên xem có hợp lệ không, 
    product_controller.create, // Đi vào xử lý việc tạo product 
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/products/:product_id',
    tokent_middleware.verify,
    role_middleware.check_admin,
    role_middleware.check_warehouse_keeper,
    tokent_middleware.check_authen_valid,
    product_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/products/:product_id',
    tokent_middleware.verify,
    role_middleware.check_admin,
    tokent_middleware.check_authen_valid,
    product_controller.delete,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}