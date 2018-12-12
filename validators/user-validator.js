const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let user = {
  type: 'object',
  props: {
    user_id: { type: 'string', require: true},
    refresh_token: { type: 'string' , require: true},
  }

}

// Validators
let validate_user = validator.compile({ user })

module.exports = {
  validate_user: (request) => {
    return errors_aggregator.aggregate(validate_user(request))
  }
}