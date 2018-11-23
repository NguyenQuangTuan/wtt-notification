const validator = require('../../../validators/product-validator')

const validate = {
  product: product => validator.validate_product({ product })
}

// gọi hàm validator và chuẩn lại mã lỗi trả về nếu có lỗi 
const conduct_validating = validatees => {
  let validatees_keys = Object.keys(validatees)
  for (let i = 0; i < validatees_keys.length; i++) {
    let validatee = validatees_keys[i]

    if (!validatees[validatee]) continue
    let result = validate[validatee](validatees[validatee])
    if (!result.is_valid) return ({ type: 'Bad Request', detail: result.errors })
  }

  return null
}

module.exports = {
  // validate product truyền lên khi tạo sản phẩm khi 
  validate_create: (req, res, next) => {
    let { product } = req.body

    let validatees = { product }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  }
}