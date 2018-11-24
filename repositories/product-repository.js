/**
 * Tầng repository:
 * - Là tầng thao tác với cơ sở dữ liệu. Việc thao tác với CSDL mình dùng 
 * thư viện sequelize nên không phải viết câu lệnh sql. Tầng này chủ yếu 
 * phục vụ cho tầng service. Các hàm cơ bản mà tầng này cung cấp là get, 
 * create, update, delete, tùy từng nghiệp vụ mà có thể  thêm 1 số hàm
 */

module.exports = class ProductRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.sequelize = db_context.sequelize
    this.Product = db_context.Product


    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.Product
      .findAll({
        attribute: select,
        where: condition,
        limit: limit,
        offset: offset * limit,
        order_by: order_by,
      })
      .then(res => {
        res = res.map(ck => ck.dataValues)
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  find_one(condition = {}, select = null, callback) {
    this.Product
      .findOne({
        where: condition,
        attribute: select,
      })
      .then(res => {
        if (!res) {
          callback(null, null)
          return null
        }
        else {
          callback(null, res ? res.dataValues : null)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  create(product, callback) {
    this.Product
      .create(product)
      .then(res => {
        if (!res) return callback(null, null)
        else {          
          callback(null, res.dataValues)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  update(condition, product_obj, callback) {
    this.Product
      .update(product_obj, { where: condition })
      .then(res => {
        res = res.every(val => val == 1)
        callback(null, res)

        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }


  delete(condition, callback) {
    this.Product
      .update(
        { shows: false },
        { where: condition }
      )
      .then(res => {
        callback(null, true)
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }
}

